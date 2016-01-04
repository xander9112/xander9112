var $$ = $$ || {};

$$.SimpleForm = class SimpleForm extends $$.Component {
	constructor (root, options) {
		super(root, options);

		this.types = [
			'button',
			'checkbox',
			'hidden',
			'password',
			'radio',
			'reset',
			'submit',
			'text',
			'email',
			'range',
			'search',
			'tel',
			'url'
		];
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
		"use strict";

		this.nodes = {};
	}

	_bindEvents () {
		"use strict";
	}

	_ready () {
		"use strict";
	}

	_template () {
		"use strict";

		let formId = _.uniqueId('simple-form_');
		let action = this.options.action;
		let method = this.options.method;
		let additionalClass = this.options.additionalClass;

		return `<form name="${formId}" action="${action}" method="${method}" class="${additionalClass}"></form>`
	}

	createForm () {
		"use strict";

		this.form = $(this._template()).appendTo(this.root);
	}

	createInput (options = {}) {
		"use strict";

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

		let type = options.type;
		let name = options.name;
		let value = options.value || '';
		let placeholder = options.placeholder || '';
		let dataRequired = ``;
		let errorTemplate = ``;

		if (options.required) {
			let required = options.required.required;
			let message = options.required.message;
			let errorAdditionalClass = options.required.additionalClass || '';
			dataRequired = `
				data-rule-required="${required}"
				data-msg-required="${message}"
			`;

			errorTemplate = `<span class="f-error ${errorAdditionalClass}"></span>`;
		}

		let inputId = _.uniqueId(`${type}-${name}_`);
		let additionalClass = options.additionalClass || '';
		let labelTemplate = ``;
		let inputTemplate = `
		<input
			type="${type}"
			name="${name}"
			id="${inputId}"
			placeholder="${placeholder}"
			${dataRequired}
			value="${value}">
		`;

		if (options.label) {
			labelTemplate = `<label for="${inputId}" class="f-label">${options.label}</label>`;
		}


		let field = `
			<div class="f-field ${additionalClass}">
				${labelTemplate}
				${inputTemplate}
				${errorTemplate}
			</div>
		`;


		return $(field).appendTo(this.form);
	}

	createSubmit (options = {}) {
		"use strict";

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

		let type = 'submit';
		let name = options.name;
		let value = options.value || '';

		let inputId = _.uniqueId(`${type}-${name}_`);
		let additionalClass = options.additionalClass || '';
		let labelTemplate = ``;
		let inputTemplate = `
		<button
			type="${type}"
			name="${name}"
			class="f-field ${additionalClass}"
			id="${inputId}">
				${value}
			</button>
		`;


		let field = `${inputTemplate}`;


		return $(field).appendTo(this.form);
	}
};
