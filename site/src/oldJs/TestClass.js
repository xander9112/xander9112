var $$ = $$ || {};

$$.TestClass = class TestClass extends $$.Component {
	constructor (root, options) {
		super(root, options);
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


		this.on('triggerTestClass', () => {
			"use strict";

			console.log('Class был тригернут');

		});

		this.trigger('triggerTestClass');
	}
};
