/**
 * Base emitter class.
 *
 * Dependencies: underscore.js.
 *
 * Example:
 *
 *   var e = new $$.Emitter();
 *
 *   e.on('event1', function() {});
 *   e.on('event2.namespace1', function() {});
 *   e.on('event2.namespace2', function() {});
 *   e.on('event3a.namespace3', function() {});
 *   e.on('event3b.namespace3', function() {});
 *   e.on('event3c.namespace3', function() {});
 *   e.emit('event1', { Some event data here... });
 *   e.emit('event2.namespace1');
 *   e.off('event1');
 *   e.off('event2.namespace1');
 *   e.off('event2.namespace2');
 *   e.off('.namespace3');
 *
 * Multiple event data arguments are supported.
 *
 *   e.on('event10', function(a, b, c) { ... });
 *   e.emit('event10', 2, 'qwe', { x: 3, y: 'zxc' });
 *
 * Also #trigger() is an alias for #emit().
 *
 * NOTE: The namespace name "*" has a special meaning in $$.Emitter.ItemContainer.
 */

'use strict';

var $$ = $$ || {};

/**
 * @constructor
 */
$$.Emitter = function () {
	this._itemContainer = new $$.Emitter.ItemContainer();
};

$$.Emitter.prototype = {
	/**
  * @param {String} eventId
  * @return {Boolean}
  * @private
  */
	_isEventIdJustANamespace: function _isEventIdJustANamespace(eventId) {
		eventId = String(eventId);

		return !!eventId.match(/^\.[a-z\d]+$/i);
	},

	/**
  * @param {String} eventId
  * @return {Array} [eventName, namespace]
  * @throws {Error}
  * @private
  */
	_parseAndValidateEventId: function _parseAndValidateEventId(eventId) {
		eventId = String(eventId);

		// Either a single event name.

		var match = eventId.match(/^[a-z\d]+$/i);

		if (match) {
			return [match[0], null];
		}

		// Or an event name + a namespace name.

		match = eventId.match(/^([a-z\d]+)\.([a-z\d]+)$/i);

		if (!match) {
			throw Error('Full event names should not be empty, should consist of letters and numbers' + ' and may contain only single dot in the middle.');
		}

		return [match[1], match[2]];
	},

	/**
  * @param {String} eventId
  */
	emit: function emit(eventId /*, eventData1, eventData2, ... */) {
		eventId = String(eventId);

		var parts = this._parseAndValidateEventId(eventId);
		var items = this._itemContainer.getItems(parts[0], parts[1]);
		var args = Array.prototype.slice.call(arguments, 1);

		_.each(items, function (item) {
			item.callback.apply(null, args);
		});
	},

	/**
  * @param {String} eventId
  * @param {Function} callback
  */
	on: function on(eventId, callback) {
		if (callback == null) {
			throw Error('An event callback should be provided.');
		}

		if (!_.isFunction(callback)) {
			throw Error('An event callback should be a function.');
		}

		var parts = this._parseAndValidateEventId(eventId);

		this._itemContainer.add(parts[0], parts[1], callback);
	},

	off: function off(eventId) {
		eventId = String(eventId);

		if (this._isEventNameWithNamespaceJustANamespace(eventId)) {
			// Just a namespace.
			this._itemContainer.remove(null, eventId.substr(1));
		} else {
			// Event name and possible namespace.
			var parts = this._parseAndValidateEventId(eventId);
			this._itemContainer.remove(parts[0], parts[1]);
		}
	}
};

$$.Emitter.prototype.trigger = $$.Emitter.prototype.emit;

$$.Emitter.ItemContainer = function () {
	/* Items:
  *
  * {
  *   eventName1: {
  *     namespace1: [ { callback, *... }, ... ],
  *     namespace2: [ ... ]
  *     ...
  *   },
  *
  *   eventName2: { ... }
  *   ...
  * }
  */
	this._items = {};
};

$$.Emitter.ItemContainer.prototype = {
	/**
  * @param {String} eventName
  * @param {String}|null namespace
  * @param {Function} callback
  */
	add: function add(eventName, namespace, callback) {
		eventName = String(eventName);
		namespace = namespace == null ? '*' : String(namespace);

		if (!this._items.hasOwnProperty(eventName)) {
			this._items[eventName] = {};
		}

		if (!this._items[eventName].hasOwnProperty(namespace)) {
			this._items[eventName][namespace] = [];
		}

		this._items[eventName][namespace].push({
			callback: callback
		});
	},

	/**
  * @param {String} eventName
  * @param {String}|null namespace
  * @return {Array}
  */
	getItems: function getItems(eventName, namespace) {
		eventName = String(eventName);

		if (!this._items.hasOwnProperty(eventName)) {
			return [];
		}

		if (namespace == null) {
			// Return items for all namespaces of the event.

			var arraysOfItems = _.values(this._items[eventName]);

			return _.union.apply(null, arraysOfItems);
		}

		namespace = String(namespace);

		if (!this._items[eventName].hasOwnProperty(namespace)) {
			return [];
		}

		return this._items[eventName][namespace];
	},

	/**
  * Removes by event name, by namespace or by both.
  *
  * @param {String}|null eventName
  * @param {String}|null namespace
  */
	remove: function remove(eventName, namespace) {
		if (eventName == null && namespace == null) {
			throw Error('Only one of the arguments can be omitted.');
		}

		if (namespace == null) {
			this.removeByEventName(eventName);
		} else if (eventName == null) {
			this.removeByNamespace(namespace);
		} else {
			// Both eventName and namespace are not null.

			eventName = String(eventName);
			namespace = String(namespace);

			if (!this._items.hasOwnProperty(eventName) || !this._items[eventName].hasOwnProperty(namespace)) {
				return;
			}

			delete this._items[eventName][namespace];
		}
	},

	/**
  * @param {String} eventName
  */
	removeByEventName: function removeByEventName(eventName) {
		eventName = String(eventName);

		if (!this._items.hasOwnProperty(eventName)) {
			return;
		}

		delete this._items[eventName];
	},

	/**
  * @param {String} namespace
  */
	removeByNamespace: function removeByNamespace(namespace) {
		namespace = String(namespace);

		_.each(this._items, function (itemsByNamespace) {
			if (!itemsByNamespace.hasOwnProperty(namespace)) {
				return;
			}

			delete itemsByNamespace[namespace];
		});
	}
};
"use strict";

$$.Simulation = $$.Simulation || {};

/**
 * Не нужно использовать этот класс напрямую. Нужно использовать $$.Simulation.Spring.
 */
$$.Simulation.SpringSimulator = function () {
	var self = this;

	this._springs = [];
	this._lastTime = +new Date();

	setInterval(function () {
		var now = +new Date();
		var time = (now - self._lastTime) / 1000;
		var dt = 0.01;

		if (time > 0.2) {
			// Если жс работает слишком медленно, замедлить симуляцию.
			time = 0.2;
		}

		var i,
		    ni = self._springs.length,
		    spring,
		    dampings = [],
		    distance,
		    newDistance,
		    force,
		    newVelocity,
		    targetVelocityLimit,
		    velocityLimit,
		    positionLimits;

		for (i = 0; i < ni; i++) {
			spring = self._springs[i];
			dampings.push(2 * Math.sqrt(spring._rigidness) * spring._damping);
		}

		while (time > 0.000001) {
			for (i = 0; i < ni; i++) {
				spring = self._springs[i];

				if (spring._frozen) {
					continue;
				}

				distance = spring._target - spring._position;

				force = (distance >= 0 ? 1 : -1) * Math.pow(Math.abs(distance), spring._forcePower) * spring._rigidness - (spring._velocity >= 0 ? 1 : -1) * Math.abs(spring._velocity) * dampings[i];

				newVelocity = spring._velocity + force * dt;

				velocityLimit = spring._velocityLimit;
				targetVelocityLimit = spring._targetVelocityLimit;

				if (targetVelocityLimit !== null) {
					targetVelocityLimit *= Math.pow(spring._targetVelocityLimitPower, Math.abs(distance));

					if (velocityLimit === null || targetVelocityLimit < velocityLimit) {
						velocityLimit = targetVelocityLimit;
					}
				}

				if (velocityLimit !== null && Math.abs(newVelocity) > velocityLimit) {
					newVelocity = (newVelocity >= 0 ? 1 : -1) * velocityLimit;
				}

				spring._position += newVelocity * dt;
				spring._velocity = newVelocity;

				if (spring._stopAtTarget) {
					newDistance = spring._target - spring._position;

					if (distance > 0 && newDistance <= 0 || distance < 0 && newDistance >= 0) {
						spring._position = spring._target;
						spring._velocity = 0;
						continue;
					}
				}

				if (spring._positionLimits !== null) {
					positionLimits = spring._positionLimits;

					if (spring._position < positionLimits[0]) {
						spring._position = positionLimits[0];
						spring._velocity = 0;
					} else if (spring._position > positionLimits[1]) {
						spring._position = positionLimits[1];
						spring._velocity = 0;
					}
				}
			}

			time -= dt;
		}

		self._lastTime = now;

		for (i = 0; i < ni; i++) {
			spring = self._springs[i];

			if (spring == null) {
				continue;
			}

			if (!spring._frozen && spring._step) {
				spring._step.call();
			}
		}
	}, 20);
};

$$.Simulation.SpringSimulator.prototype = {
	addSpring: function addSpring(spring) {
		this._springs.push(spring);
	},

	deleteSpring: function deleteSpring(spring) {
		var i = _.indexOf(this._springs, spring);

		if (i != -1) {
			this._springs.splice(i, 1);
		}
	}
};

// Создать один "глобальный" экземпляр.

$$.Simulation.__springSimulator = new $$.Simulation.SpringSimulator();
'use strict';

$$.Simulation = $$.Simulation || {};

/**
 * @constructor
 */
$$.Simulation.Spring = function (options) {
	options = _.extend({
		frozen: false,
		position: 0,
		positionLimits: null,
		target: 0,
		targetLimits: null,
		velocity: 0,
		velocityLimit: null,
		rigidness: 1,
		damping: 1,
		forcePower: 1,
		targetVelocityLimit: null,
		targetVelocityLimitPower: 1.25,
		stopAtTarget: false,
		step: null
	}, options || {});

	this._frozen = options.frozen;
	this._position = options.position;
	this._positionLimits = options.positionLimits;
	this._target = options.target;
	this._targetLimits = options.targetLimits;
	this._velocity = options.velocity;
	this._velocityLimit = options.velocityLimit;
	this._rigidness = options.rigidness;
	this._damping = options.damping;
	this._forcePower = options.forcePower;
	this._targetVelocityLimit = options.targetVelocityLimit;
	this._targetVelocityLimitPower = options.targetVelocityLimitPower;
	this._stopAtTarget = options.stopAtTarget;
	this._step = null;

	if (options.step) {
		this.step(options.step);
	}

	this._applyTargetLimits();

	$$.Simulation.__springSimulator.addSpring(this);
};

$$.Simulation.Spring.prototype = {
	_applyTargetLimits: function _applyTargetLimits() {
		if (this._targetLimits === null) {
			return;
		}

		if (this._target < this._targetLimits[0]) {
			this._target = this._targetLimits[0];
		} else if (this._target > this._targetLimits[1]) {
			this._target = this._targetLimits[1];
		}
	},

	destroy: function destroy() {
		this._step = null;
		$$.Simulation.__springSimulator.deleteSpring(this);
	},

	moveTarget: function moveTarget(delta) {
		this._target += delta;
		this._applyTargetLimits();
	},

	step: function step(callback) {
		this._step = _.bind(callback, this);
	},

	target: function target(value) {
		if (arguments.length == 0) {
			return this._target;
		}

		this._target = value;
		this._applyTargetLimits();
	},

	targetLimits: function targetLimits(value) {
		if (arguments.length == 0) {
			return this._targetLimits;
		}

		this._targetLimits = value;
		this._applyTargetLimits();
	}
};

// Создать методы-аксессоры.

_.each(['frozen', 'position', 'positionLimits', 'velocity', 'velocityLimit', 'rigidness', 'damping', 'forcePower',, 'targetVelocityLimit', 'targetVelocityLimitPower', 'stopAtTarget'], function (k) {
	$$.Simulation.Spring.prototype[k] = function (value) {
		if (arguments.length == 0) {
			return this['_' + k];
		}

		this['_' + k] = value;
	};
});
'use strict';

var $$ = $$ || {};

$$.extend = function (Child, Parent) {
	var F = function F() {};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
};

$$.trim = function (str, charlist) {
	charlist = !charlist ? ' \\s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
	var re = new RegExp('^[' + charlist + ']+|[' + charlist + ']+$', 'g');
	return str.replace(re, '');
};

$$.parseUrlParams = function (url) {
	var url = url || location.href;
	var searchParam = {};
	var regExpParams = /\?{1}.+/;

	if (regExpParams.test(url)) {
		url = url.replace(regExpParams, '');

		var urlParams = location.search.replace('?', '');
		urlParams = urlParams.split('&');

		_.each(urlParams, function (item, index, list) {
			var param = item.split('=');
			searchParam[param[0]] = param[1];
		});
	}
	return searchParam;
};

$$.clamp = function (value, min, max) {
	return Math.min(max, Math.max(min, value));
};

$$.getRandomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

$$.makeVideoPlayerHtml = function (videoType, videoId, width, height) {
	if (videoType == 'youtube') {
		return '<iframe class="youtube-player" type="text/html"' + ' width="' + width + '" height="' + height + '" src="' + 'http://www.youtube.com/embed/' + videoId + '?autoplay=0&rel=0&amp;controls=0&amp;showinfo=0' + '" frameborder="0" wmode="opaque" autoplay="false"></iframe>';
	} else if (videoType == 'vimeo') {
		return '<iframe wmode="opaque" width="' + width + '" height="' + height + '" src="' + 'http://player.vimeo.com/video/' + videoId + '?autoplay=1' + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
	}

	return '';
};

$$.ScrollWidth = function () {
	// создадим элемент с прокруткой
	var div = document.createElement('div');

	div.style.overflowY = 'scroll';
	div.style.width = '50px';
	div.style.height = '50px';

	// при display:none размеры нельзя узнать
	// нужно, чтобы элемент был видим,
	// visibility:hidden - можно, т.к. сохраняет геометрию
	div.style.visibility = 'hidden';

	document.body.appendChild(div);
	var scrollWidth = div.offsetWidth - div.clientWidth;
	document.body.removeChild(div);

	return scrollWidth;
};

$$.FakerInfo = function (block) {
	var news = block.find('.news-block');

	news.each(function () {
		var item = $(this);
		var hasImage = item.find('img').length == 0 ? false : true;
		var hasTitle = item.find('.title').length == 0 ? false : true;

		if (hasTitle) {
			var title = item.find('.title');
			var subtitle = item.find('.subtitle');
			var description = item.find('.description');
			var date = item.find('.date');
			var rating = item.find('.rating');

			var timeDate = new Date(faker.date.between(2010, 2014));
			var curr_date = timeDate.getDate();
			var curr_month = timeDate.getMonth() + 1;
			var curr_year = timeDate.getFullYear() % 1000;
			var formatDate = curr_date + "." + numb(curr_month) + "." + curr_year;
			var formatTime = numb(timeDate.getHours()) + ":" + numb(timeDate.getMinutes());

			date.text(formatDate + ', ' + formatTime);
			title.text(faker.lorem.words(1)[0]);
			subtitle.text(faker.lorem.paragraph(1));
			description.text(faker.lorem.paragraph(1));
			rating.text($$.getRandomInt(0, 4) + '.' + $$.getRandomInt(0, 9));
		}

		if (hasImage) {
			var width = item.width();
			var height = item.height();
			item.find('img').attr('src', faker.image.imageUrl(width, height, 'transport'));
		}
	});

	function numb(number) {
		if (number < 10) {
			return '0' + number;
		} else {
			return number;
		}
	}
};

$$.number_format = function (number, decimals, dec_point, thousands_sep) {
	number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number,
	    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	    sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
	    dec = typeof dec_point === 'undefined' ? '.' : dec_point,
	    s = '',
	    toFixedFix = function toFixedFix(n, prec) {
		var k = Math.pow(10, prec);
		return '' + Math.round(n * k) / k;
	};
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
};

$$.getVideoID = function (url) {
	var id = '';
	url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
	if (url[2] !== undefined) {
		id = url[2].split(/[^0-9a-z_\-]/i);
		id = id[0];
	} else {
		id = url;
	}
	return id;
};

$$.secondsToTime = function (seconds) {
	"use strict";

	var allTime = seconds;
	var minutes = parseInt(seconds / 60);
	var sec = parseInt(seconds - minutes * 60);

	if (minutes < 10) {
		minutes = '0' + minutes;
	}

	if (sec < 10) {
		sec = '0' + sec;
	}

	return {
		minutes: minutes,
		sec: sec
	};
};
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = (function (_$$$Emitter) {
	_inherits(Component, _$$$Emitter);

	function Component() {
		_classCallCheck(this, Component);

		_get(Object.getPrototypeOf(Component.prototype), "constructor", this).call(this);
		$$.Emitter.call(this);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		if (args.length === 1) {
			this.root = args[0];
		} else if (args.length === 2) {
			this.root = args[0];
			this.options = args[1];
		}

		this.initialize();
	}

	_createClass(Component, [{
		key: "initialize",
		value: function initialize() {
			this._cacheNodes();
			this._bindEvents();
			this._ready();
		}
	}, {
		key: "_cacheNodes",
		value: function _cacheNodes() {}
	}, {
		key: "_bindEvents",
		value: function _bindEvents() {}
	}, {
		key: "_ready",
		value: function _ready() {}
	}]);

	return Component;
})($$.Emitter);
'use strict';

var $$ = $$ || {};

$$.GoogleAnalytics = {
	reachGoal: function reachGoal(goal) {
		if (!_.isUndefined(window.ga)) {
			ga('send', 'event', 'click', goal);
		}
	},

	reachPage: function reachPage(page) {
		if (!_.isUndefined(window.ga)) {
			ga('send', 'pageview', page);
		}
	}
};
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

var GM = google.maps;
var GMEventListener = GM.event.addListener;

/**
 * @type {GoogleMap}
 */

$$.GoogleMap = (function () {
	/**
  *
  * @param root
  * @param options
  */

	function GoogleMap(root) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, GoogleMap);

		var defaultOptions = {
			offset: {
				top: false,
				left: false
			},
			coordinates: [51.6753557, 38.9559867],
			icon: {
				url: '/assets/images/point.png',
				size: [32, 48]
			},
			mapOptions: {
				mapTypeId: !_.isUndefined(window.google) ? GM.MapTypeId.ROADMAP : '', //MapTypeId.SATELLITE, MapTypeId.HYBRID, MapTypeId.TERRAIN
				maxZoom: 45,
				zoom: 15,
				minZoom: 0,
				zoomControl: true,
				overviewMapControl: true,
				disableDefaultUI: false,
				scrollwheel: false,
				styles: [{
					"featureType": "administrative",
					"elementType": "labels.text.fill",
					"stylers": [{ "color": "#444444" }]
				}, {
					"featureType": "landscape",
					"elementType": "all",
					"stylers": [{ "color": "#f2f2f2" }]
				}, {
					"featureType": "poi",
					"elementType": "all",
					"stylers": [{ "visibility": "off" }]
				}, {
					"featureType": "road",
					"elementType": "all",
					"stylers": [{ "saturation": -100 }, { "lightness": 45 }]
				}, {
					"featureType": "road.highway",
					"elementType": "all",
					"stylers": [{ "visibility": "simplified" }]
				}, {
					"featureType": "road.arterial",
					"elementType": "labels.icon",
					"stylers": [{ "visibility": "off" }]
				}, {
					"featureType": "transit",
					"elementType": "all",
					"stylers": [{ "visibility": "off" }]
				}, {
					"featureType": "water",
					"elementType": "all",
					"stylers": [{ "color": "#0088f6" }, { "visibility": "on" }]
				}]
			}
		};

		this.root = root;
		this.options = _.merge(defaultOptions, options);

		this.MercatorProjection = null;
		this.MapIcon = null;
		this.MapCenter = null;

		this.initialize();
	}

	_createClass(GoogleMap, [{
		key: 'initialize',
		value: function initialize() {
			"use strict";

			this._ready();
		}
	}, {
		key: 'setMarker',

		/**
   * @param value
   * value может быть массив координат или объект google.maps.LatLng
   */

		value: function setMarker(value) {
			var element = arguments.length <= 1 || arguments[1] === undefined ? $ : arguments[1];

			var position = undefined;

			_.isArray(value) ? position = new GM.LatLng(value[0], value[1]) : position = value;

			var icon = this.icon !== null ? this.icon : '';

			var marker = new GM.Marker({
				position: position,
				map: this.map,
				icon: icon
			});

			GM.event.addListener(marker, 'click', function () {
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
	}, {
		key: '_createMap',
		value: function _createMap() {
			var coordinates = this.options.coordinates;

			this.map = new GM.Map(this.root.get(0), this.options.mapOptions);
			this.center = new GM.LatLng(coordinates[0], coordinates[1]);

			if (this.options.offset.left || this.options.offset.top) {
				this.MercatorProjection = new $$.MercatorProjection(this.map);
			}

			this._bindEvents();
		}
	}, {
		key: '_cacheNodes',
		value: function _cacheNodes() {
			this.nodes = {};
		}
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {
			"use strict";

			var _this = this;

			GM.event.addListenerOnce(this.map, 'idle', function () {
				if (_this.options.offset) {
					_this.center = _this.mapOffset;
				}
			});

			GMEventListener(this.map, 'click', function (event) {
				_this.root.trigger('mapClick', event);
			});

			GMEventListener(this.map, 'zoom_changed', function () {
				if (_this.center) {
					_this.panTo = _this.center;
				}
			});

			GMEventListener(this.map, 'dragstart', function (event) {
				_this.center = null;
			});
		}
	}, {
		key: '_ready',
		value: function _ready() {
			GM.event.addDomListener(window, 'load', this._createMap());

			this.icon = this.options.icon;
		}
	}, {
		key: 'icon',
		set: function set(value) {
			if (value) {
				this.MapIcon = {
					url: value.url,
					size: new GM.Size(value.size[0], value.size[1]),
					origin: new GM.Point(0, 0),
					anchor: new GM.Point(value.size[0] / 2, value.size[1])
				};
			}
		},
		get: function get() {
			return this.MapIcon;
		}
	}, {
		key: 'center',
		set: function set(value) {
			var position = undefined;

			_.isArray(value) ? position = new GM.LatLng(value[0], value[1]) : position = value;

			this.map.setCenter(position);
			this.MapCenter = position;

			if (this.mapOffset) {
				this.map.setCenter(this.mapOffset);
				this.MapCenter = this.mapOffset;
			}
		},
		get: function get() {
			return this.MapCenter;
		}
	}, {
		key: 'mapOffset',
		get: function get() {
			"use strict";

			if (!this.MercatorProjection) {
				return false;
			}

			var offsetLeft = this.root.width() / 2;
			var offsetTop = this.root.height() / 2;

			if (this.options.offset.left) {
				offsetLeft = (this.root.width() - this.options.offset.left) / 2;
			}

			if (this.options.offset.top) {
				offsetTop = (this.root.height() - this.options.offset.top) / 2;
			}

			var point = new GM.Point(offsetLeft, offsetTop);

			return this.MercatorProjection.PixelToLatLng(point);
		}

		/**
   * @param value
   * value может быть массив координат или объект google.maps.LatLng
   */
	}, {
		key: 'panTo',
		set: function set(value) {
			var position = undefined;

			_.isArray(value) ? position = new GM.LatLng(value[0], value[1]) : position = value;

			this.map.panTo(position);
			this.MapCenter = position;

			if (this.mapOffset) {
				this.map.panTo(this.mapOffset);
				this.MapCenter = this.mapOffset;
			}
		}
	}]);

	return GoogleMap;
})();

$$.MercatorProjection = (function () {
	function MercatorProjection(map) {
		_classCallCheck(this, MercatorProjection);

		this.map = map;
		this.mapOverlay = new GM.OverlayView();
		this.mapOverlay.draw = function () {};
		this.mapOverlay.onAdd = function () {
			"use strict";
		};

		this._ready();
	}

	/**
  * Computes the pixel coordinates of the given geographical location in the map's container element.
  * @param {google.maps.LatLng} latLng Position to display
  */

	_createClass(MercatorProjection, [{
		key: 'LatLngToPixel',
		value: function LatLngToPixel(latLng) {
			var projection = this.mapOverlay.getProjection();
			var point = projection.fromLatLngToContainerPixel(latLng);
			return point;
		}

		/**
   * SComputes the geographical coordinates from pixel coordinates in the map's container.
   * @param {google.maps.Point} Point Position to display
   */
	}, {
		key: 'PixelToLatLng',
		value: function PixelToLatLng(point) {
			var projection = this.mapOverlay.getProjection();

			var newPoint = projection.fromContainerPixelToLatLng(point);

			return newPoint;
		}
	}, {
		key: '_ready',
		value: function _ready() {
			this.mapOverlay.setMap(this.map);
		}
	}]);

	return MercatorProjection;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.VimeoPlayer = (function () {
	function VimeoPlayer(root, options) {
		_classCallCheck(this, VimeoPlayer);

		this.root = root;

		this.options = {};

		_.assign(this.options, options);

		this.playerState = 0;

		this._createScript();
		this._createPlayer();

		this._ready();
	}

	_createClass(VimeoPlayer, [{
		key: '_createScript',
		value: function _createScript() {
			"use strict";

			var _this = this;

			if (!$('script#js-vimeo-api').length) {
				var tag = document.createElement('script');

				tag.src = "https://f.vimeocdn.com/js/froogaloop2.min.js";
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.id = 'js-vimeo-api';
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			}

			var interval = setInterval(function () {
				if (!_.isUndefined(window.$f)) {
					clearInterval(interval);

					_this.root.trigger('APIReady');
				}
			}, 1);
		}
	}, {
		key: '_createPlayer',
		value: function _createPlayer() {
			"use strict";

			var _this2 = this;

			var rootClass = this.root.attr('class');
			var id = _.uniqueId('player_');

			this.root.on('APIReady', function () {
				var iframe = $('\n\t\t\t<iframe id="' + id + '"\n\t\t\t\tclass="' + rootClass + '"\n\t\t\t\tsrc="https://player.vimeo.com/video/' + _this2.options.videoId + '?api=1&player_id=' + id + '"\n\t\t\t\twidth="' + _this2.options.width + '"\n\t\t\t\theight="' + _this2.options.height + '"\n\t\t\t\tframeborder="0"\n\t\t\t\twebkitallowfullscreen\n\t\t\t\tmozallowfullscreen\n\t\t\t\tallowfullscreen>\n\t\t\t</iframe>\n\t\t\t');

				_this2.root.append(iframe);

				_this2.player = $f(_this2.root.find('iframe').get(0));

				_this2.player.addEvent('ready', function () {
					_this2.root.trigger('PlayerCreated');

					_this2.player.addEvent('play', function () {
						_this2.playerState = 1;
						_this2.root.trigger('PlayerStateChange');
					});

					_this2.player.addEvent('pause', function () {
						_this2.playerState = 2;
						_this2.root.trigger('PlayerStateChange');
					});

					_this2.player.addEvent('finish', function () {
						_this2.playerState = 0;
						_this2.root.trigger('PlayerStateChange');
					});
				});
			});
		}
	}, {
		key: '_cacheNodes',
		value: function _cacheNodes() {
			this.nodes = {};
		}
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {
			"use strict";
		}
	}, {
		key: 'playVideo',
		value: function playVideo() {
			"use strict";

			this.player.api('play');
		}
	}, {
		key: 'pauseVideo',
		value: function pauseVideo() {
			"use strict";

			this.player.api('pause');
		}
	}, {
		key: 'stopVideo',
		value: function stopVideo() {
			"use strict";

			this.player.api('unload');
		}
	}, {
		key: 'isMuted',
		value: function isMuted() {
			"use strict";

			var _this3 = this;

			var promise = new Promise(function (resolve, reject) {
				_this3.player.api('getVolume', function (value) {
					resolve(value === 0);
				});
			});

			return promise;
		}
	}, {
		key: '_ready',
		value: function _ready() {
			"use strict";
		}
	}, {
		key: 'duration',
		get: function get() {
			"use strict";

			var _this4 = this;

			var duration = new Promise(function (resolve, reject) {
				_this4.player.api('getDuration', function (value) {
					resolve(value);
				});
			});

			return duration;
		}
	}, {
		key: 'CurrentTime',
		get: function get() {
			"use strict";

			var _this5 = this;

			var promise = new Promise(function (resolve, reject) {
				_this5.player.api('getCurrentTime', function (value) {
					resolve(value);
				});
			});

			return promise;
		}
	}, {
		key: 'volume',
		get: function get() {
			"use strict";

			var _this6 = this;

			var promise = new Promise(function (resolve, reject) {
				_this6.player.api('getVolume', function (value) {
					resolve(value);
				});
			});

			return promise;
		},
		set: function set(volume) {
			"use strict";
			if (parseInt(volume) > 100) {
				volume = 100;
			}

			if (parseInt(volume) < 0) {
				volume = 0;
			}

			this.player.api('setVolume', volume);
		}
	}, {
		key: 'mute',
		set: function set(isMute) {
			"use strict";

			if (isMute) {
				this.player.api('setVolume', 0);
			} else {
				this.player.api('setVolume', 1);
			}
		}
	}]);

	return VimeoPlayer;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.VimeoPlayer2 = (function () {
	function VimeoPlayer2(root, options) {
		_classCallCheck(this, VimeoPlayer2);

		this.root = root;

		this.options = {};

		_.assign(this.options, options);

		this.playerOrigin = '*';
		this.playerObject = {};
		this._createPlayer();
		this._cacheNodes();
		this._bindEvents();
		this._ready();
	}

	_createClass(VimeoPlayer2, [{
		key: '_createPlayer',
		value: function _createPlayer() {
			"use strict";
			var rootClass = this.root.attr('class');
			var id = _.uniqueId('player_');

			var iframe = $('\n\t\t\t<iframe id="' + id + '"\n\t\t\t\tclass="' + rootClass + '"\n\t\t\t\tsrc="https://player.vimeo.com/video/' + this.options.videoId + '?api=1&player_id=' + id + '"\n\t\t\t\twidth="' + this.options.width + '"\n\t\t\t\theight="' + this.options.height + '"\n\t\t\t\tframeborder="0"\n\t\t\t\twebkitallowfullscreen\n\t\t\t\tmozallowfullscreen\n\t\t\t\tallowfullscreen>\n\t\t\t</iframe>\n\t\t\t');

			this.root.replaceWith(function () {
				return iframe;
			});

			this.player = iframe;
		}
	}, {
		key: '_cacheNodes',
		value: function _cacheNodes() {
			this.nodes = {};
		}
	}, {
		key: '_onMessageReceived',
		value: function _onMessageReceived(event) {
			// Handle messages from the vimeo player only
			if (!/^https?:\/\/player.vimeo.com/.test(event.origin)) {
				return false;
			}

			if (this.playerOrigin === '*') {
				this.playerOrigin = event.origin;
			}

			var data = JSON.parse(event.data);

			if (data.event === 'ready') {
				this._post('addEventListener', 'loadProgress');
				this._post('addEventListener', 'playProgress');
				this._post('addEventListener', 'play');
				this._post('addEventListener', 'pause');
				this._post('addEventListener', 'finish');
				this._post('addEventListener', 'seek');

				this.root.trigger('PlayerCreated');
			}

			if (!_.isUndefined(data.method)) {
				this.playerObject[data.method] = data.value;
				console.log(this.playerObject.getDuration);
			}

			/*switch (data.event) {
    case 'ready':
    break;
   		 case 'loadProgress':
    this.root.trigger('loadProgress', {
    player_id: data.player_id,
    data:      data.data
    });
    break;
    case 'playProgress':
    this.root.trigger('playProgress', {
    player_id: data.player_id,
    data:      data.data
    });
    break;
   		 case 'play':
    this.root.trigger('PlayerStateChange');
    this.playerState = 1;
   		 break;
   		 case 'pause':
    this.root.trigger('PlayerStateChange');
    this.playerState = 2;
    break;
   		 case 'finish':
    this.root.trigger('PlayerStateChange');
    this.playerState = 0;
    break;
   		 case 'seek':
    this.root.trigger('seek', {
    player_id: data.player_id,
    data:      data.data
    });
   		 break;
    }*/
		}
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {
			"use strict";
			if (window.addEventListener) {
				window.addEventListener('message', _.bind(this._onMessageReceived, this), false);
			} else {
				window.attachEvent('onmessage', _.bind(this._onMessageReceived, this), false);
			}
		}
	}, {
		key: '_post',
		value: function _post(action, value) {
			"use strict";
			var data = {
				method: action
			};

			if (value) {
				data.value = value;
			}

			var message = JSON.stringify(data);

			this.player.get(0).contentWindow.postMessage(message, this.playerOrigin);
		}
	}, {
		key: 'playVideo',
		value: function playVideo() {
			"use strict";
			this._post('play');
		}
	}, {
		key: 'pauseVideo',
		value: function pauseVideo() {
			"use strict";
			this._post('pause');
		}
	}, {
		key: 'stopVideo',
		value: function stopVideo() {
			"use strict";
			this._post('stop');
		}
	}, {
		key: '_ready',
		value: function _ready() {
			"use strict";
		}
	}, {
		key: 'duration',
		get: function get() {
			"use strict";
			this._post('getDuration');
			return this.playerObject.getDuration;
		}
	}, {
		key: 'CurrentTime',
		get: function get() {
			"use strict";

			return this._post('getCurrentTime');
		}
	}, {
		key: 'volume',
		get: function get() {
			"use strict";
			return this._post('getVolume');
		},
		set: function set(volume) {
			"use strict";
			if (parseInt(volume) > 100) {
				volume = 100;
			}

			if (parseInt(volume) < 0) {
				volume = 0;
			}

			this._post('setVolume', volume);
		}
	}]);

	return VimeoPlayer2;
})();
"use strict";

var $$ = $$ || {};

$$.YandexMetrika = {
    counter: null,

    reachGoal: function reachGoal(goal) {
        if (this.counter) {
            this.counter.reachGoal(goal);
        }
    }
};
'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.YouTube = (function () {
	function YouTube(root, options) {
		_classCallCheck(this, YouTube);

		this.root = root;

		this.options = {
			width: '640',
			height: '360',
			playerVars: {
				autoplay: 0,
				controls: 0,
				disablekb: 1,
				enablejsapi: 1,
				end: '',
				loop: 0,
				modestbranding: 1,
				rel: 0
			},
			videoId: 'M7lc1UVf-VE'
		};

		_.merge(this.options, options);

		this.YT = undefined;

		this._cacheNodes();
		this._bindEvents();
		this._createScript();
		this._ready();
	}

	/**
  * Загружаем скрипт в браузер
  * @private
  */

	_createClass(YouTube, [{
		key: '_createScript',
		value: function _createScript() {
			"use strict";

			var _this = this;

			if (!$('script#js-youtube-api').length) {
				var tag = document.createElement('script');

				tag.src = "https://www.youtube.com/iframe_api";
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.id = 'js-youtube-api';
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			}

			var interval = setInterval(function () {
				if (!_.isUndefined(window.YT)) {
					if (YT.loaded) {
						clearInterval(interval);
						_this.YT = YT;
						_this.root.trigger('YouTubeIframeAPIReady');
					}
				}
			}, 1);
		}
	}, {
		key: '_cacheNodes',
		value: function _cacheNodes() {
			this.nodes = {};
		}
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {
			"use strict";

			var _this2 = this;

			this.root.on('YouTubeIframeAPIReady', function () {
				_this2._createPlayer();
			});

			this.root.on('PlayerCreated', function () {});

			this.root.on('PlayerStateChange', function (event, data) {});
		}
	}, {
		key: '_createPlayer',
		value: function _createPlayer() {
			"use strict";

			var _this3 = this;

			var playerOptions = {
				events: {
					'onReady': function onReady(event) {
						_this3.root.trigger('PlayerCreated');
					},
					'onStateChange': function onStateChange(event) {
						_this3.root.trigger('PlayerStateChange', event);
					}
				}
			};

			_.assign(playerOptions, this.options);

			this.player = new YT.Player(this.root.get(0), playerOptions);
		}
	}, {
		key: 'onPlayerStateChange',
		value: function onPlayerStateChange(event) {
			if (event.data == YT.PlayerState.PLAYING) {}
		}
	}, {
		key: '_ready',
		value: function _ready() {
			"use strict";
		}
	}]);

	return YouTube;
})();

$$.YouTubePlayer = (function (_$$$YouTube) {
	_inherits(YouTubePlayer, _$$$YouTube);

	function YouTubePlayer(root, options) {
		"use strict";

		_classCallCheck(this, YouTubePlayer);

		_get(Object.getPrototypeOf(YouTubePlayer.prototype), 'constructor', this).call(this, root, options);
	}

	_createClass(YouTubePlayer, [{
		key: 'isMuted',
		value: function isMuted() {
			"use strict";
			return this.player.isMuted();
		}
	}, {
		key: 'playVideo',
		value: function playVideo() {
			"use strict";
			this.player.playVideo();
		}
	}, {
		key: 'pauseVideo',
		value: function pauseVideo() {
			"use strict";
			this.player.pauseVideo();
		}
	}, {
		key: 'stopVideo',
		value: function stopVideo() {
			"use strict";
			this.player.stopVideo();
		}
	}, {
		key: 'mute',
		set: function set(isMute) {
			"use strict";

			if (isMute) {
				this.player.mute();
			} else {
				this.player.unMute();
			}
		}
	}, {
		key: 'volume',
		get: function get() {
			"use strict";
			return this.player.getVolume();
		},
		set: function set(volume) {
			"use strict";
			if (parseInt(volume) > 100) {
				volume = 100;
			}

			if (parseInt(volume) < 0) {
				volume = 0;
			}

			this.player.setVolume(volume);
		}
	}, {
		key: 'size',
		set: function set(size) {
			"use strict";

			this.player.setSize(size.width, size.height);
		}

		/**
   * Возвращает состояние проигрывателя. Возможные значения:
   * @returns
   * -1 – воспроизведение видео не началось
   * 0 – воспроизведение видео завершено
   * 1 – воспроизведение
   * 2 – пауза
   * 3 – буферизация
   * 5 – видео находится в очереди
   */

	}, {
		key: 'playerState',
		get: function get() {
			"use strict";

			return this.player.getPlayerState();
		}
	}, {
		key: 'CurrentTime',
		get: function get() {
			"use strict";

			return this.player.getCurrentTime();
		}
	}, {
		key: 'duration',
		get: function get() {
			"use strict";

			return this.player.getDuration();
		}
	}]);

	return YouTubePlayer;
})($$.YouTube);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

var Application = (function () {
	function Application() {
		_classCallCheck(this, Application);

		//this._initMap();
		//this._initYouTubePlayer();
		this._initVimeoPlayer();
	}

	_createClass(Application, [{
		key: '_initMap',
		value: function _initMap() {
			"use strict";

			var mapElement = $('.js-map-left, .js-map-top');

			mapElement.each(function () {
				var item = $(this);
				var coodinates = mapElement.data('coords');
				var map = null;
				var offset = {};

				$$.window.on('resize', function () {
					item.height($$.windowHeight - $('.ui.top.menu').outerHeight(true));

					if ($('.js-addresses').hasClass('left')) {
						$('.js-addresses').height($$.windowHeight - $('.ui.top.menu').outerHeight(true) - 25);
					} else {
						item.height($$.windowHeight - $('.ui.top.menu').outerHeight(true));
					}
				});

				if (item.hasClass('js-map-top')) {

					var offsetheight = $('.js-addresses').offset().top + $('.js-addresses').outerHeight(true);

					offset = {
						top: offsetheight
					};
				}

				if (item.hasClass('js-map-left')) {
					offset = {
						left: $('.js-addresses').offset().left - $$.windowWidth
					};
				}

				map = new $$.GoogleMap(mapElement, {
					coordinates: coodinates,
					offset: offset,
					icon: {
						url: '/site/assets/images/point.png'
					},
					mapOptions: {
						scrollwheel: true,
						styles: ''
					}
				});

				var addresses = $('.js-addresses .js-list-group-item');

				addresses.each(function () {

					var markerPosition = map.setMarker($(this).data('coords'), $(this));

					$(this).on('click', function (event, position) {
						var element = $(event.currentTarget);
						var pos = _.isUndefined(position) ? markerPosition : position;

						element.siblings().removeClass('active');
						element.addClass('active');

						map.panTo = pos;
					});
				});
			});
		}
	}, {
		key: '_initYouTubePlayer',
		value: function _initYouTubePlayer() {
			"use strict";

			$('.js-youtube-player').each(function () {
				var dimmer = $('.js-dimmer');

				var player = new $$.YouTubePlayer($('.js-youtube-player'), {
					width: '1101',
					height: '620',
					videoId: $(this).data('id'),
					playerVars: {
						disablekb: 0
					}
				});

				var form = $('.js-form-video');

				player.root.on('PlayerCreated', function () {
					dimmer.removeClass('active');

					$('.js-progress-time').progress({
						percent: 0
					});

					var interval = null;

					var allTime = $$.secondsToTime(player.duration);

					$('.js-all-time').text(allTime.minutes + ':' + allTime.sec);

					player.root.on('PlayerStateChange', function () {

						if (player.playerState === 1) {
							interval = setInterval(function () {
								var currentTime = parseInt(player.CurrentTime);
								var duration = parseInt(player.duration);

								var allTime = $$.secondsToTime(player.CurrentTime);
								$('.js-current-time').text(allTime.minutes + ':' + allTime.sec);

								$('.js-progress-time').progress({
									percent: parseInt(currentTime / duration * 100)
								});
							}, 1000);
						} else {
							clearInterval(interval);
						}
					});

					form.on('click', '.js-play', function (event) {
						event.preventDefault();
						player.playVideo();

						$(this).addClass('active').siblings().removeClass('active');
					});

					form.on('click', '.js-pause', function (event) {
						event.preventDefault();
						player.pauseVideo();

						$(this).addClass('active').siblings().removeClass('active');
					});

					form.on('click', '.js-stop', function (event) {
						event.preventDefault();
						player.stopVideo();

						$(this).addClass('active').siblings().removeClass('active');
					});

					form.on('click', '.js-mute', function (event) {
						event.preventDefault();
						player.mute = !player.isMuted();

						if (player.isMuted()) {
							$(this).find('.icon').removeClass('volume off');
							$(this).find('.icon').addClass('volume up');
							$('.js-volume').removeClass('disabled');
						} else {
							$(this).find('.icon').removeClass('volume up');
							$(this).find('.icon').addClass('volume off');
							$('.js-volume').addClass('disabled');
						}
					});

					$('.js-volume').progress({
						percent: player.volume
					});

					form.on('click', '.js-volume-minus', function (event) {
						event.preventDefault();
						if (player.volume === 0) {
							$('.js-volume').progress({
								percent: 0
							});
							return;
						}

						player.volume -= 10;

						$('.js-volume').progress({
							percent: player.volume
						});
					});

					form.on('click', '.js-volume-plus', function (event) {
						event.preventDefault();
						if (player.volume === 100) {
							$('.js-volume').progress({
								percent: 100
							});

							return;
						}

						player.volume += 10;

						$('.js-volume').progress({
							percent: player.volume
						});
					});
				});
			});
		}
	}, {
		key: '_initVimeoPlayer',
		value: function _initVimeoPlayer() {
			"use strict";

			$('.js-vimeo-player').each(function () {
				var dimmer = $('.js-dimmer');

				var player = new $$.VimeoPlayer($('.js-vimeo-player'), {
					width: '1101',
					height: '620',
					videoId: $(this).data('id')
				});

				var form = $('.js-form-video');

				$('body').on('PlayerCreated', function () {
					dimmer.removeClass('active');

					$('.js-progress-time').progress({
						percent: 0
					});

					var interval = null;

					player.duration.then(function (resolve) {
						var allTime = $$.secondsToTime(resolve);

						$('.js-all-time').text(allTime.minutes + ':' + allTime.sec);
					});

					form.on('click', '.js-play', function (event) {
						event.preventDefault();
						player.playVideo();

						$(this).addClass('active').siblings().removeClass('active');
					});

					player.root.on('PlayerStateChange', function () {
						var currentTime = 0;
						var allTime = 0;
						var duration = 0;

						if (player.playerState === 1) {
							interval = setInterval(function () {
								player.CurrentTime.then(function (currentTime) {
									player.duration.then(function (duration) {
										currentTime = parseInt(currentTime);
										allTime = $$.secondsToTime(currentTime);
										duration = parseInt(duration);

										$('.js-current-time').text(allTime.minutes + ':' + allTime.sec);

										$('.js-progress-time').progress({
											percent: parseInt(currentTime / duration * 100)
										});
									});
								});
							}, 1000);
						} else {
							clearInterval(interval);
						}
					});

					form.on('click', '.js-play', function (event) {
						event.preventDefault();
						player.playVideo();

						$(this).addClass('active').siblings().removeClass('active');
					});

					form.on('click', '.js-pause', function (event) {
						event.preventDefault();
						player.pauseVideo();

						$(this).addClass('active').siblings().removeClass('active');
					});

					form.on('click', '.js-stop', function (event) {
						event.preventDefault();
						player.stopVideo();

						$(this).addClass('active').siblings().removeClass('active');
					});

					form.on('click', '.js-mute', function (event) {
						var _this = this;

						event.preventDefault();

						player.isMuted().then(function (isMuted) {
							player.mute = !isMuted;

							if (isMuted) {
								$(_this).find('.icon').removeClass('volume off');
								$(_this).find('.icon').addClass('volume up');
								$('.js-volume').removeClass('disabled');
							} else {
								$(_this).find('.icon').removeClass('volume up');
								$(_this).find('.icon').addClass('volume off');
								$('.js-volume').addClass('disabled');
							}
						});
					});

					player.volume.then(function (volume) {
						$('.js-volume').progress({
							percent: volume * 100
						});
					});

					form.on('click', '.js-volume-minus', function (event) {
						event.preventDefault();

						player.volume.then(function (volume) {
							if (volume === 0) {
								$('.js-volume').progress({
									percent: 0
								});
								return;
							}

							player.volume = volume - 0.1;

							player.volume.then(function (volume) {
								$('.js-volume').progress({
									percent: volume * 100
								});
							});
						});
					});

					form.on('click', '.js-volume-plus', function (event) {
						event.preventDefault();

						player.volume.then(function (volume) {
							if (volume === 1) {
								$('.js-volume').progress({
									percent: 100
								});
								return;
							}

							player.volume = volume + 0.1;

							player.volume.then(function (volume) {
								$('.js-volume').progress({
									percent: volume * 100
								});
							});
						});
					});
				});
			});
		}
	}]);

	return Application;
})();

$(function () {
	$$.window = $(window);
	$$.body = $(document.body);
	$$.windowWidth = $$.window.width();
	$$.windowHeight = $$.window.height();
	$$.ESCAPE_KEY_CODE = 27;

	$$.window.on('resize', function () {
		$$.windowWidth = $$.window.width();
		$$.windowHeight = $$.window.height();
	});

	$$.application = new Application();

	$$.window.resize();
});
//# sourceMappingURL=app.js.map
