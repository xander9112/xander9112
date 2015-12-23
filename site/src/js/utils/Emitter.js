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

var $$ = $$ || {};

/**
 * @constructor
 */
$$.Emitter = function() {
	this._itemContainer = new $$.Emitter.ItemContainer();
};

$$.Emitter.prototype = {
	/**
	 * @param {String} eventId
	 * @return {Boolean}
	 * @private
	 */
	_isEventIdJustANamespace: function(eventId) {
		eventId = String(eventId);

		return !!eventId.match(/^\.[a-z\d]+$/i);
	},

	/**
	 * @param {String} eventId
	 * @return {Array} [eventName, namespace]
	 * @throws {Error}
	 * @private
	 */
	_parseAndValidateEventId: function(eventId) {
		eventId = String(eventId);

		// Either a single event name.

		var match = eventId.match(/^[a-z\d]+$/i);

		if (match) {
			return [match[0], null];
		}

		// Or an event name + a namespace name.

		match = eventId.match(/^([a-z\d]+)\.([a-z\d]+)$/i);

		if (!match) {
			throw Error(
				'Full event names should not be empty, should consist of letters and numbers'
				+ ' and may contain only single dot in the middle.'
			);
		}

		return [match[1], match[2]];
	},

	/**
	 * @param {String} eventId
	 */
	emit: function(eventId /*, eventData1, eventData2, ... */) {
		eventId = String(eventId);

		var parts = this._parseAndValidateEventId(eventId);
		var items = this._itemContainer.getItems(parts[0], parts[1]);
		var args = Array.prototype.slice.call(arguments, 1);

		_.each(items, function(item) {
			item.callback.apply(null, args);
		});
	},

	/**
	 * @param {String} eventId
	 * @param {Function} callback
	 */
	on: function(eventId, callback) {
		if (callback == null) {
			throw Error('An event callback should be provided.');
		}

		if (!_.isFunction(callback)) {
			throw Error('An event callback should be a function.');
		}

		var parts = this._parseAndValidateEventId(eventId);

		this._itemContainer.add(parts[0], parts[1], callback);
	},

	off: function(eventId) {
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

$$.Emitter.ItemContainer = function() {
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
	add: function(eventName, namespace, callback) {
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
	getItems: function(eventName, namespace) {
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
	remove: function(eventName, namespace) {
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
	removeByEventName: function(eventName) {
		eventName = String(eventName);

		if (!this._items.hasOwnProperty(eventName)) {
			return;
		}

		delete this._items[eventName];
	},

	/**
	 * @param {String} namespace
	 */
	removeByNamespace: function(namespace) {
		namespace = String(namespace);

		_.each(this._items, function(itemsByNamespace) {
			if (!itemsByNamespace.hasOwnProperty(namespace)) {
				return;
			}

			delete itemsByNamespace[namespace];
		});
	}
};
