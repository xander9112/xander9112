var $$ = $$ || {};

$$.TestClass = class TestClass extends $$.Component {
	constructor (root, options) {
		super(root, options);
	}

	get _defaultOptions () {
		"use strict";

		return {}
	}

	initialize () {
		"use strict";
		super.initialize();
	}

	_cacheNodes () {
		this.nodes = {};
	}

	_bindEvents () {
	}

	_ready () {
		"use strict";
	}
};
