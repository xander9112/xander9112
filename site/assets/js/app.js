'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

$$.Emitter = (function () {
	function Emitter() {
		_classCallCheck(this, Emitter);

		this._itemContainer = new $$.Emitter.ItemContainer();
	}

	/**
  * @param {String} eventId
  * @return {Boolean}
  * @private
  */

	_createClass(Emitter, [{
		key: '_isEventIdJustANamespace',
		value: function _isEventIdJustANamespace(eventId) {
			eventId = String(eventId);

			return !!eventId.match(/^\.[a-z\d]+$/i);
		}

		/**
   * @param {String} eventId
   * @return {Array} [eventName, namespace]
   * @throws {Error}
   * @private
   */
	}, {
		key: '_parseAndValidateEventId',
		value: function _parseAndValidateEventId(eventId) {
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
		}

		/**
   * @param {String} eventId
   */
	}, {
		key: 'trigger',
		value: function trigger(eventId /*, eventData1, eventData2, ... */) {
			eventId = String(eventId);

			var parts = this._parseAndValidateEventId(eventId);
			var items = this._itemContainer.getItems(parts[0], parts[1]);
			var args = Array.prototype.slice.call(arguments, 1);

			_.each(items, function (item) {
				item.callback.apply(null, args);
			});
		}

		/**
   * @param {String} eventId
   * @param {Function} callback
   */
	}, {
		key: 'on',
		value: function on(eventId, callback) {
			if (!callback) {
				throw Error('An event callback should be provided.');
			}

			if (!_.isFunction(callback)) {
				throw Error('An event callback should be a function.');
			}

			var parts = this._parseAndValidateEventId(eventId);

			this._itemContainer.add(parts[0], parts[1], callback);
		}
	}, {
		key: 'off',
		value: function off(eventId) {
			if (!arguments.length) {
				this._itemContainer.clear();
				return;
			}

			eventId = String(eventId);

			if (!this._isEventIdJustANamespace(eventId)) {
				// Event name and possible namespace.
				var parts = this._parseAndValidateEventId(eventId);
				this._itemContainer.remove(parts[0], parts[1]);
			} else {
				// Just a namespace.
				this._itemContainer.remove(null, eventId.substr(1));
			}
		}
	}]);

	return Emitter;
})();

$$.Emitter.ItemContainer = (function () {
	function EmitterItemContainer() {
		_classCallCheck(this, EmitterItemContainer);

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
	}

	/**
  * @param {String} eventName
  * @param {String} namespace
  * @param {Function} callback
  */

	_createClass(EmitterItemContainer, [{
		key: 'add',
		value: function add(eventName, namespace, callback) {
			eventName = String(eventName);
			namespace = !namespace ? '*' : String(namespace);

			if (!this._items.hasOwnProperty(eventName)) {
				this._items[eventName] = {};
			}

			if (!this._items[eventName].hasOwnProperty(namespace)) {
				this._items[eventName][namespace] = [];
			}

			this._items[eventName][namespace].push({
				callback: callback
			});
		}

		/**
   * @param {String} eventName
   * @param {String}|null namespace
   * @return {Array}
   */
	}, {
		key: 'getItems',
		value: function getItems(eventName, namespace) {
			eventName = String(eventName);

			if (!this._items.hasOwnProperty(eventName)) {
				return [];
			}

			if (!namespace) {
				// Return items for all namespaces of the event.

				var arraysOfItems = _.values(this._items[eventName]);

				return _.union.apply(null, arraysOfItems);
			}

			namespace = String(namespace);

			if (!this._items[eventName].hasOwnProperty(namespace)) {
				return [];
			}

			return this._items[eventName][namespace];
		}

		/**
   * Removes by event name, by namespace or by both.
   *
   * @param {String} eventName
   * @param {String} namespace
   */
	}, {
		key: 'remove',
		value: function remove(eventName, namespace) {
			if (!eventName && !namespace) {
				throw Error('Only one of the arguments can be omitted.');
			}

			if (!namespace) {
				this.removeByEventName(eventName);
			} else if (!eventName) {
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
		}

		/**
   * @param {String} eventName
   */
	}, {
		key: 'removeByEventName',
		value: function removeByEventName(eventName) {
			eventName = String(eventName);

			if (!this._items.hasOwnProperty(eventName)) {
				return;
			}

			delete this._items[eventName];
		}

		/**
   * @param {String} namespace
   */
	}, {
		key: 'removeByNamespace',
		value: function removeByNamespace(namespace) {
			namespace = String(namespace);

			_.each(this._items, function (itemsByNamespace) {
				if (!itemsByNamespace.hasOwnProperty(namespace)) {
					return;
				}

				delete itemsByNamespace[namespace];
			});
		}
	}, {
		key: 'clear',
		value: function clear() {
			this._items = {};
		}
	}]);

	return EmitterItemContainer;
})();
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

var $$ = $$ || {};

$$.Component = (function (_$$$Emitter) {
	_inherits(Component, _$$$Emitter);

	function Component(root, options) {
		_classCallCheck(this, Component);

		_get(Object.getPrototypeOf(Component.prototype), "constructor", this).call(this);

		this.root = root;
		this.options = _.merge(this._defaultOptions, options);

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

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $$ = $$ || {};

var GM = google.maps;
var GMEventListener = GM.event.addListener;

/**
 * @type {GoogleMap}
 */

$$.GoogleMap = (function (_$$$Component) {
	_inherits(GoogleMap, _$$$Component);

	/**
  *
  * @param root
  * @param options
  */

	function GoogleMap(root, options) {
		_classCallCheck(this, GoogleMap);

		_get(Object.getPrototypeOf(GoogleMap.prototype), 'constructor', this).call(this, root, options);

		this.MercatorProjection = null;
		this.MapIcon = null;
		this.MapCenter = null;
	}

	_createClass(GoogleMap, [{
		key: 'initialize',
		value: function initialize() {
			"use strict";

			_get(Object.getPrototypeOf(GoogleMap.prototype), 'initialize', this).call(this);
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
		key: '_defaultOptions',
		get: function get() {
			"use strict";

			return {
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
})($$.Component);

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

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $$ = $$ || {};

$$.SimpleForm = (function (_$$$Component) {
	_inherits(SimpleForm, _$$$Component);

	function SimpleForm(root, options) {
		_classCallCheck(this, SimpleForm);

		_get(Object.getPrototypeOf(SimpleForm.prototype), 'constructor', this).call(this, root, options);

		this.types = ['button', 'checkbox', 'hidden', 'password', 'radio', 'reset', 'submit', 'text', 'email', 'range', 'search', 'tel', 'url'];
	}

	_createClass(SimpleForm, [{
		key: 'initialize',
		value: function initialize() {
			"use strict";

			_get(Object.getPrototypeOf(SimpleForm.prototype), 'initialize', this).call(this);
		}
	}, {
		key: '_cacheNodes',
		value: function _cacheNodes() {
			"use strict";

			this.nodes = {};
		}
	}, {
		key: '_bindEvents',
		value: function _bindEvents() {
			"use strict";
		}
	}, {
		key: '_ready',
		value: function _ready() {
			"use strict";
		}
	}, {
		key: '_template',
		value: function _template() {
			"use strict";

			var formId = _.uniqueId('simple-form_');
			var action = this.options.action;
			var method = this.options.method;
			var additionalClass = this.options.additionalClass;

			return '<form name="' + formId + '" action="' + action + '" method="' + method + '" class="' + additionalClass + '"></form>';
		}
	}, {
		key: 'createForm',
		value: function createForm() {
			"use strict";

			this.form = $(this._template()).appendTo(this.root);
		}
	}, {
		key: 'createInput',
		value: function createInput() {
			"use strict";

			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
			if (!this.form.length) {
				console.error('Форма не создана');
				return;
			}

			if (!options.type) {
				console.error('Не указан тип поля');
				return;
			}

			if (_.indexOf(this.types, options.type) < 0) {
				console.error('Неверно указан тип поля');
				return;
			}

			if (!options.name) {
				console.error('Не указано имя поля');
				return;
			}

			//options
			/**
    * label
    * name
    * type
    * value
    * placeholder
    * required: {
    *  required: true,
    *  message: 'Сообщение об ошибке'
    *  }
    * additionalClass
    */

			var type = options.type;
			var name = options.name;
			var value = options.value || '';
			var placeholder = options.placeholder || '';
			var dataRequired = '';
			var errorTemplate = '';

			if (options.required) {
				var required = options.required.required;
				var message = options.required.message;
				var errorAdditionalClass = options.required.additionalClass || '';
				dataRequired = '\n\t\t\t\tdata-rule-required="' + required + '"\n\t\t\t\tdata-msg-required="' + message + '"\n\t\t\t';

				errorTemplate = '<span class="f-error ' + errorAdditionalClass + '"></span>';
			}

			var inputId = _.uniqueId(type + '-' + name + '_');
			var additionalClass = options.additionalClass || '';
			var labelTemplate = '';
			var inputTemplate = '\n\t\t<input\n\t\t\ttype="' + type + '"\n\t\t\tname="' + name + '"\n\t\t\tid="' + inputId + '"\n\t\t\tplaceholder="' + placeholder + '"\n\t\t\t' + dataRequired + '\n\t\t\tvalue="' + value + '">\n\t\t';

			if (options.label) {
				labelTemplate = '<label for="' + inputId + '" class="f-label">' + options.label + '</label>';
			}

			var field = '\n\t\t\t<div class="f-field ' + additionalClass + '">\n\t\t\t\t' + labelTemplate + '\n\t\t\t\t' + inputTemplate + '\n\t\t\t\t' + errorTemplate + '\n\t\t\t</div>\n\t\t';

			return $(field).appendTo(this.form);
		}
	}, {
		key: 'createSubmit',
		value: function createSubmit() {
			"use strict";

			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
			if (!this.form.length) {
				console.error('Форма не создана');
				return;
			}

			//options
			/**
    * name
    * value
    * additionalClass
    */

			var type = 'submit';
			var name = options.name;
			var value = options.value || '';

			var inputId = _.uniqueId(type + '-' + name + '_');
			var additionalClass = options.additionalClass || '';
			var labelTemplate = '';
			var inputTemplate = '\n\t\t<button\n\t\t\ttype="' + type + '"\n\t\t\tname="' + name + '"\n\t\t\tclass="f-field ' + additionalClass + '"\n\t\t\tid="' + inputId + '">\n\t\t\t\t' + value + '\n\t\t\t</button>\n\t\t';

			var field = '' + inputTemplate;

			return $(field).appendTo(this.form);
		}
	}, {
		key: '_defaultOptions',
		get: function get() {
			"use strict";

			return {};
		}
	}]);

	return SimpleForm;
})($$.Component);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $$ = $$ || {};

$$.SimpleSlider = (function (_$$$Component) {
	_inherits(SimpleSlider, _$$$Component);

	function SimpleSlider(root, options) {
		_classCallCheck(this, SimpleSlider);

		_get(Object.getPrototypeOf(SimpleSlider.prototype), "constructor", this).call(this, root, options);

		this.isAnimated = false;
		/* ширина слайда с отступами */
		this.slideWidth = this.nodes.list.find('.item').outerWidth(true);

		/* смещение слайдера */
		this.newLeftPos = -this.slideWidth;
	}

	_createClass(SimpleSlider, [{
		key: "initialize",
		value: function initialize() {
			"use strict";

			_get(Object.getPrototypeOf(SimpleSlider.prototype), "initialize", this).call(this);
		}
	}, {
		key: "_cacheNodes",
		value: function _cacheNodes() {
			"use strict";

			this.nodes = {
				list: this.root.find('.item-list'),
				items: this.root.find('.item'),
				prevNav: this.root.find('.js-prev'),
				nextNav: this.root.find('.js-next')
			};
		}
	}, {
		key: "_bindEvents",
		value: function _bindEvents() {
			"use strict";

			var _this = this;

			this.nodes.prevNav.on('click', function (event) {
				event.preventDefault();

				_this.setPrev();
			});

			this.nodes.nextNav.on('click', function (event) {
				event.preventDefault();

				_this.setNext();
			});
		}
	}, {
		key: "setNext",
		value: function setNext() {
			"use strict";

			var _this2 = this;

			var bounce = new Bounce();

			bounce.translate({
				from: { x: 0, y: 0 },
				to: { x: this.newLeftPos, y: 0 },
				duration: this.options.speed,
				bounces: 0,
				stiffness: 5
			});

			this.nodes.list.find('.item:first').appendTo(this.nodes.list);

			this._updateItems(true);

			bounce.applyTo(this.nodes.list).then(function () {
				_this2.trigger('slideChanged');
			});
		}
	}, {
		key: "setPrev",
		value: function setPrev() {
			"use strict";

			var _this3 = this;

			var bounce = new Bounce();

			this.nodes.list.find('.item:last').prependTo(this.nodes.list);

			bounce.translate({
				from: { x: 2 * this.newLeftPos, y: 0 },
				to: { x: this.newLeftPos, y: 0 },
				duration: this.options.speed,
				bounces: 0,
				stiffness: 5
			});

			this._updateItems(true);

			bounce.applyTo(this.nodes.list).then(function () {
				_this3.trigger('slideChanged');
			});
		}
	}, {
		key: "_updateItems",
		value: function _updateItems() {
			"use strict";

			var next = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
			this.nodes.items.removeClass('prev active next');
			this.root.find('.item').eq(0).addClass('prev');
			this.root.find('.item').eq(1).addClass('active');
			this.root.find('.item').eq(2).addClass('next');

			this.resize();

			this.trigger('slideChanged');
		}
	}, {
		key: "resize",
		value: function resize() {
			"use strict";

			var _this4 = this;

			$$.window.on('resize', function () {
				var partPhoto = Math.ceil(($$.window.width() - _this4.options.containerWidth) / 2);

				_this4.nodes.list.css({
					marginLeft: "-" + (_this4.nodes.items.filter('.prev').width() - partPhoto) + "px"
				});
			});

			$$.window.resize();
		}
	}, {
		key: "_ready",
		value: function _ready() {
			"use strict";

			var _this5 = this;

			this.nodes.items.each(function (index) {
				var item = $(this);
				var image = item.find('img');

				if (image.width() > image.height()) {
					item.addClass('horizontal');
				} else if (image.width() < image.height()) {
					item.addClass('vertical');
				}
			});

			var bounce = new Bounce();

			this.nodes.list.find('.item:last').prependTo(this.nodes.list);

			var newPos = this.nodes.items.eq(0).outerWidth(true);

			bounce.translate({
				from: { x: 0, y: 0 },
				to: { x: -newPos, y: 0 },
				duration: 1,
				bounces: 0,
				stiffness: 5
			});

			this._updateItems(true);

			bounce.applyTo(this.nodes.list).then(function () {
				_this5.trigger('slideChanged');
			});

			if (this.options.isCyclical) {
				this.interval = setInterval(function () {
					_this5.setNext();
				}, this.options.isCyclicalInterval);
			}
		}
	}, {
		key: "_defaultOptions",
		get: function get() {
			"use strict";

			return {
				speed: 2000,
				containerWidth: 1180,
				isCyclical: false,
				isCyclicalInterval: 2000
			};
		}
	}]);

	return SimpleSlider;
})($$.Component);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $$ = $$ || {};

$$.VimeoPlayer = (function (_$$$Component) {
	_inherits(VimeoPlayer, _$$$Component);

	function VimeoPlayer(root, options) {
		_classCallCheck(this, VimeoPlayer);

		_get(Object.getPrototypeOf(VimeoPlayer.prototype), 'constructor', this).call(this, root, options);

		this.playerState = 0;
	}

	_createClass(VimeoPlayer, [{
		key: 'initialize',
		value: function initialize() {
			"use strict";

			this._createScript();
			this._createPlayer();

			_get(Object.getPrototypeOf(VimeoPlayer.prototype), 'initialize', this).call(this);
		}
	}, {
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

					_this.trigger('APIReady');
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

			this.on('APIReady', function () {
				var iframe = $('\n\t\t\t<iframe id="' + id + '"\n\t\t\t\tclass="' + rootClass + '"\n\t\t\t\tsrc="https://player.vimeo.com/video/' + _this2.options.videoId + '?api=1&player_id=' + id + '"\n\t\t\t\twidth="' + _this2.options.width + '"\n\t\t\t\theight="' + _this2.options.height + '"\n\t\t\t\tframeborder="0"\n\t\t\t\twebkitallowfullscreen\n\t\t\t\tmozallowfullscreen\n\t\t\t\tallowfullscreen>\n\t\t\t</iframe>\n\t\t\t');

				_this2.root.replaceWith(function () {
					return iframe;
				});

				_this2.player = $f(iframe.get(0));

				_this2.player.addEvent('ready', function () {
					_this2.trigger('PlayerCreated');

					_this2.player.addEvent('play', function () {
						_this2.playerState = 1;
						_this2.trigger('PlayerStateChange');
					});

					_this2.player.addEvent('pause', function () {
						_this2.playerState = 2;
						_this2.trigger('PlayerStateChange');
					});

					_this2.player.addEvent('finish', function () {
						_this2.playerState = 0;
						_this2.trigger('PlayerStateChange');
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
		key: '_defaultOptions',
		get: function get() {
			"use strict";

			return {
				width: '640',
				height: '360',
				videoId: 'M7lc1UVf-VE'
			};
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
})($$.Component);
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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $$ = $$ || {};

$$.YouTube = (function (_$$$Component) {
	_inherits(YouTube, _$$$Component);

	function YouTube(root, options) {
		_classCallCheck(this, YouTube);

		_get(Object.getPrototypeOf(YouTube.prototype), 'constructor', this).call(this, root, options);

		this.player = undefined;
		this.YT = undefined;
	}

	_createClass(YouTube, [{
		key: 'initialize',
		value: function initialize() {
			"use strict";
			this._createScript();

			_get(Object.getPrototypeOf(YouTube.prototype), 'initialize', this).call(this);
		}

		/**
   * Загружаем скрипт в браузер
   * @private
   */

	}, {
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
						_this.trigger('YouTubeIframeAPIReady');
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

			this.on('YouTubeIframeAPIReady', function () {
				_this2._createPlayer();
			});

			this.on('PlayerCreated', function () {});

			this.on('PlayerStateChange', function (event, data) {});
		}
	}, {
		key: '_createPlayer',
		value: function _createPlayer() {
			"use strict";

			var _this3 = this;

			var playerOptions = {
				events: {
					'onReady': function onReady(event) {
						_this3.trigger('PlayerCreated');
					},
					'onStateChange': function onStateChange(event) {
						_this3.trigger('PlayerStateChange', event);
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
	}, {
		key: '_defaultOptions',
		get: function get() {
			"use strict";

			return {
				width: '640',
				height: '360',
				playerVars: {
					autoplay: 0,
					controls: 0,
					disablekb: 1,
					enablejsapi: 1,
					end: '',
					loop: 0,
					showinfo: 0,
					modestbranding: 1,
					rel: 0
				},
				videoId: 'M7lc1UVf-VE'
			};
		}
	}]);

	return YouTube;
})($$.Component);

$$.YouTubePlayer = (function (_$$$YouTube) {
	_inherits(YouTubePlayer, _$$$YouTube);

	function YouTubePlayer(root, options) {
		"use strict";

		_classCallCheck(this, YouTubePlayer);

		_get(Object.getPrototypeOf(YouTubePlayer.prototype), 'constructor', this).call(this, root, options);
	}

	_createClass(YouTubePlayer, [{
		key: 'destroy',
		value: function destroy() {
			"use strict";
			this.player.destroy();
		}
	}, {
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

$$.YouTubePlayerList = (function (_$$$YouTubePlayer) {
	_inherits(YouTubePlayer, _$$$YouTubePlayer);

	function YouTubePlayer(root, options) {
		"use strict";

		_classCallCheck(this, YouTubePlayer);

		_get(Object.getPrototypeOf(YouTubePlayer.prototype), 'constructor', this).call(this, root, options);
	}

	_createClass(YouTubePlayer, [{
		key: 'cueVideoById',
		value: function cueVideoById(list) {
			"use strict";

			this.player.cuePlaylist({
				'playlist': list,
				'listType': 'playlist',
				'index': 0,
				'startSeconds': 0,
				'suggestedQuality': 'small'
			});
		}
	}, {
		key: 'playVideoAt',
		value: function playVideoAt(index) {
			"use strict";

			this.player.playVideoAt(index);
		}
	}, {
		key: 'playlist',
		get: function get() {
			"use strict";

			return this.player.getPlaylist();
		}
	}]);

	return YouTubePlayer;
})($$.YouTubePlayer);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $$ = $$ || {};

var Application = (function () {
	function Application() {
		_classCallCheck(this, Application);

		this._initMap();
		this._initYouTubePlayer();
		this._initYouTubePlayerList();
		this._initVimeoPlayer();
		this._initSimpleSlider();
		this._initFormStyles();
		this._initSimpleForm();
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

				player.on('PlayerCreated', function () {
					dimmer.removeClass('active');

					$('.js-progress-time').progress({
						percent: 0
					});

					var interval = null;

					var allTime = $$.secondsToTime(player.duration);

					$('.js-all-time').text(allTime.minutes + ':' + allTime.sec);

					player.on('PlayerStateChange', function () {

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
		key: '_initYouTubePlayerList',
		value: function _initYouTubePlayerList() {
			"use strict";

			$('.js-youtube-player-list').each(function () {
				var dimmer = $('.js-dimmer');

				var player = new $$.YouTubePlayerList($('.js-youtube-player-list'), {
					width: '640',
					height: '480',
					videoId: $(this).data('id'),
					playerVars: {
						disablekb: 0
					}
				});

				var form = $('.js-form-video');

				//$('.js-video-list')

				player.on('PlayerCreated', function () {
					dimmer.removeClass('active');

					$('.js-progress-time').progress({
						percent: 0
					});

					var interval = null;

					var allTime = $$.secondsToTime(player.duration);

					$('.js-all-time').text(allTime.minutes + ':' + allTime.sec);

					player.on('PlayerStateChange', function () {
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

					$('.js-video-list').find('.item').each(function (index) {
						var indexElement = index;

						$(this).on('click', 'a', function (event) {
							event.preventDefault();
							var item = $(event.currentTarget);
							player.cueVideoById(item.data('id'));
						});
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

				player.on('PlayerCreated', function () {
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

					player.on('PlayerStateChange', function () {
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
	}, {
		key: '_initSimpleSlider',
		value: function _initSimpleSlider() {
			"use strict";

			$('.js-simple-slider').each(function () {
				var slider = new $$.SimpleSlider($(this), {
					isCyclical: false
				});

				slider.nodes.items.each(function (index) {
					var item = $(this);

					item.append('<div class="index"><span>' + index + '</span></div>');
				});
			});
		}
	}, {
		key: '_initFormStyles',
		value: function _initFormStyles() {
			"use strict";

			$('.js-form-styles').each(function () {
				$(this).find('input, textarea, select').styler();
			});
		}
	}, {
		key: '_initSimpleForm',
		value: function _initSimpleForm() {
			"use strict";

			$('select.dropdown').dropdown();
			$('.ui.checkbox').checkbox();

			$('.js-form-generator').each(function () {
				var generatorForm = $(this);
				var simple = $('.js-simple-form');
				var firstLevel = generatorForm.find('.first-level');
				var secondLevel = generatorForm.find('.second-level');

				secondLevel.slideUp();

				generatorForm.on('click', '.js-create-form', function (event) {
					var simpleForm = new $$.SimpleForm(simple, {
						method: generatorForm.find('.js-method .selected').text(),
						action: generatorForm.find('.js-action').val(),
						additionalClass: 'ui form'
					});

					simpleForm.createForm();

					firstLevel.slideUp();
					secondLevel.slideDown();

					generatorForm.on('click', '.js-create-field', function (event) {
						var options = {};

						secondLevel.find('input, select').each(function () {
							var item = $(this);

							if (item[0].nodeName === 'INPUT' || item[0].nodeName === 'SELECT') {
								if (item.val() !== '') {

									if (item.attr('type') === 'checkbox') {
										item.val(item.val() === 'on' ? true : false);
									}

									options[item.attr('name')] = item.val();
								}
							}
						});

						console.log(options);

						var field = simpleForm.createInput({
							label: 'Тестовое поле',
							name: 'INPUT_TEST',
							type: 'text',
							placeholder: 'Плейсхолдер',
							required: {
								required: true,
								message: 'Это поля обязательно к заполнению!!!'
							},
							additionalClass: 'field'
						});
					});

					/*
     		 simpleForm.createSubmit({
      name:            'SUBMIT',
      type:            'submit',
      value:           'Отправить форму',
      additionalClass: 'ui button'
      });*/
				});

				/*form.validate({
     errorPlacement: function (error, element) {
     let field = element.parent();
     field.parents('form').removeClass('loading');
    		 field.addClass('error');
     field.find('.f-error').text(error.text());
    
     },
     submitHandler:  (form) => {
     form = $(form);
     form.addClass('loading');
    		 form.find('.f-field').each(function () {
     $(this).removeClass('error');
     $(this).find('.f-error').text('');
     });
    
     /!**
     * TODO: Временный код
     *!/
    		 setTimeout(function () {
     form.removeClass('loading');
     }, 1000);
     },
     success:        function (label, element) {
     // set &nbsp; as text for IE
    		 let field = $(element).parent();
     field.parents('form').removeClass('loading');
     field.removeClass('error');
     field.addClass('success');
     field.find('.f-error').text('');
     }
     });*/
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
