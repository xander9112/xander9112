var $$ = $$ || {};

const GM = google.maps;
const GMEventListener = GM.event.addListener;


/**
 * @type {GoogleMap}
 */

$$.GoogleMap = class GoogleMap {
	/**
	 *
	 * @param root
	 * @param options
	 */
	constructor (root, options = {}) {
		var defaultOptions = {
			offset:      {
				top:  false,
				left: false
			},
			coordinates: [ 51.6753557, 38.9559867 ],
			icon:        {
				url:  '/assets/images/point.png',
				size: [ 32, 48 ]
			},
			mapOptions:  {
				mapTypeId:          !_.isUndefined(window.google) ? GM.MapTypeId.ROADMAP : '', //MapTypeId.SATELLITE, MapTypeId.HYBRID, MapTypeId.TERRAIN
				maxZoom:            45,
				zoom:               15,
				minZoom:            0,
				zoomControl:        true,
				overviewMapControl: true,
				disableDefaultUI:   false,
				scrollwheel:        false,
				styles:             [
					{
						"featureType": "administrative",
						"elementType": "labels.text.fill",
						"stylers":     [ { "color": "#444444" } ]
					}, {
						"featureType": "landscape",
						"elementType": "all",
						"stylers":     [ { "color": "#f2f2f2" } ]
					}, {
						"featureType": "poi",
						"elementType": "all",
						"stylers":     [ { "visibility": "off" } ]
					}, {
						"featureType": "road",
						"elementType": "all",
						"stylers":     [ { "saturation": -100 }, { "lightness": 45 } ]
					}, {
						"featureType": "road.highway",
						"elementType": "all",
						"stylers":     [ { "visibility": "simplified" } ]
					}, {
						"featureType": "road.arterial",
						"elementType": "labels.icon",
						"stylers":     [ { "visibility": "off" } ]
					}, {
						"featureType": "transit",
						"elementType": "all",
						"stylers":     [ { "visibility": "off" } ]
					}, {
						"featureType": "water",
						"elementType": "all",
						"stylers":     [ { "color": "#0088f6" }, { "visibility": "on" } ]
					}
				]
			}
		};

		this.root = root;
		this.options = _.merge(defaultOptions, options);

		this.MercatorProjection = null;
		this.MapIcon = null;
		this.MapCenter = null;

		this.initialize();
	}

	initialize () {
		"use strict";

		this._ready();
	}

	set icon (value) {
		if (value) {
			this.MapIcon = {
				url:    value.url,
				size:   new GM.Size(value.size[ 0 ], value.size[ 1 ]),
				origin: new GM.Point(0, 0),
				anchor: new GM.Point(value.size[ 0 ] / 2, value.size[ 1 ])
			};
		}
	}

	get icon () {
		return this.MapIcon;
	}

	/**
	 * @param value
	 * value может быть массив координат или объект google.maps.LatLng
	 */

	setMarker (value, element = $) {
		let position;

		_.isArray(value) ? position = new GM.LatLng(value[ 0 ], value[ 1 ]) : position = value;

		let icon = this.icon !== null ? this.icon : '';

		let marker = new GM.Marker({
			position: position,
			map:      this.map,
			icon:     icon
		});

		GM.event.addListener(marker, 'click', () => {
			if (element.length) {
				element.trigger('click', position);
			} else {
				//this.panTo = marker.getPosition();
			}
		});

		return position;
	}

	/**
	 * @param value
	 * value может быть массив координат или объект google.maps.LatLng
	 */
	set center (value) {
		let position;

		_.isArray(value) ? position = new GM.LatLng(value[ 0 ], value[ 1 ]) : position = value;

		this.map.setCenter(position);
		this.MapCenter = position;

		if (this.mapOffset) {
			this.map.setCenter(this.mapOffset);
			this.MapCenter = this.mapOffset;
		}
	}

	get center () {
		return this.MapCenter;
	}

	get mapOffset () {
		"use strict";

		if (!this.MercatorProjection) {
			return false;
		}

		let offsetLeft = this.root.width() / 2;
		let offsetTop = this.root.height() / 2;

		if (this.options.offset.left) {
			offsetLeft = (this.root.width() - this.options.offset.left) / 2;
		}

		if (this.options.offset.top) {
			offsetTop = (this.root.height() - this.options.offset.top) / 2;
		}

		let point = new GM.Point(offsetLeft, offsetTop);

		return this.MercatorProjection.PixelToLatLng(point);
	}

	/**
	 * @param value
	 * value может быть массив координат или объект google.maps.LatLng
	 */
	set panTo (value) {
		let position;

		_.isArray(value) ? position = new GM.LatLng(value[ 0 ], value[ 1 ]) : position = value;


		this.map.panTo(position);
		this.MapCenter = position;

		if (this.mapOffset) {
			this.map.panTo(this.mapOffset);
			this.MapCenter = this.mapOffset;
		}
	}

	_createMap () {
		let coordinates = this.options.coordinates;

		this.map = new GM.Map(this.root.get(0), this.options.mapOptions);
		this.center = new GM.LatLng(coordinates[ 0 ], coordinates[ 1 ]);

		if (this.options.offset.left || this.options.offset.top) {
			this.MercatorProjection = new $$.MercatorProjection(this.map);
		}

		this._bindEvents();
	}

	_cacheNodes () {
		this.nodes = {};
	}

	_bindEvents () {
		"use strict";

		GM.event.addListenerOnce(this.map, 'idle', () => {
			if (this.options.offset) {
				this.center = this.mapOffset;
			}
		});

		GMEventListener(this.map, 'click', (event) => {
			this.root.trigger('mapClick', event);
		});

		GMEventListener(this.map, 'zoom_changed', () => {
			if (this.center) {
				this.panTo = this.center;
			}
		});

		GMEventListener(this.map, 'dragstart', (event) => {
			this.center = null;
		});
	}

	_ready () {
		GM.event.addDomListener(window, 'load', this._createMap());

		this.icon = this.options.icon;
	}
};

$$.MercatorProjection = class MercatorProjection {
	constructor (map) {
		this.map = map;
		this.mapOverlay = new GM.OverlayView();
		this.mapOverlay.draw = function () {
		};
		this.mapOverlay.onAdd = () => {
			"use strict";
		};

		this._ready();
	}

	/**
	 * Computes the pixel coordinates of the given geographical location in the map's container element.
	 * @param {google.maps.LatLng} latLng Position to display
	 */
	LatLngToPixel (latLng) {
		var projection = this.mapOverlay.getProjection();
		var point = projection.fromLatLngToContainerPixel(latLng);
		return point
	}

	/**
	 * SComputes the geographical coordinates from pixel coordinates in the map's container.
	 * @param {google.maps.Point} Point Position to display
	 */
	PixelToLatLng (point) {
		var projection = this.mapOverlay.getProjection();

		var newPoint = projection.fromContainerPixelToLatLng(point);

		return newPoint;
	}

	_ready () {
		this.mapOverlay.setMap(this.map);
	}
};
