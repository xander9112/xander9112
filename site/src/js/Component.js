class Component extends $$.Emitter {
	constructor(...args) {
		super();
		$$.Emitter.call(this);

		if (args.length === 1) {
			this.root = args[0];
		} else if (args.length === 2) {
			this.root = args[0];
			this.options = args[1];
		}

		this.initialize();
	}

	initialize() {
		this._cacheNodes();
		this._bindEvents();
		this._ready();
	}

	_cacheNodes() {
	}

	_bindEvents() {
	}

	_ready() {

	}
}
