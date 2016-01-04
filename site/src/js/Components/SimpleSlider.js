var $$ = $$ || {};

$$.SimpleSlider = class SimpleSlider extends $$.Component {
	constructor (root, options) {
		super(root, options);

		this.isAnimated = false;
		/* ширина слайда с отступами */
		this.slideWidth = this.nodes.list.find('.item').outerWidth(true);

		/* смещение слайдера */
		this.newLeftPos = -this.slideWidth;
	}

	get _defaultOptions () {
		"use strict";

		return {
			speed:              2000,
			containerWidth:     1180,
			isCyclical:         false,
			isCyclicalInterval: 2000
		}
	}

	initialize () {
		"use strict";

		super.initialize();
	}

	_cacheNodes () {
		"use strict";

		this.nodes = {
			list:    this.root.find('.item-list'),
			items:   this.root.find('.item'),
			prevNav: this.root.find('.js-prev'),
			nextNav: this.root.find('.js-next')
		};
	}

	_bindEvents () {
		"use strict";

		this.nodes.prevNav.on('click', (event) => {
			event.preventDefault();

			this.setPrev();
		});

		this.nodes.nextNav.on('click', (event) => {
			event.preventDefault();

			this.setNext();
		});
	}

	setNext () {
		"use strict";

		var bounce = new Bounce();

		bounce.translate({
			from:      { x: 0, y: 0 },
			to:        { x: this.newLeftPos, y: 0 },
			duration:  this.options.speed,
			bounces:   0,
			stiffness: 5
		});

		this.nodes.list
			.find('.item:first')
			.appendTo(this.nodes.list);

		this._updateItems(true);

		bounce.applyTo(this.nodes.list).then(() => {
			this.trigger('slideChanged');
		});
	}

	setPrev () {
		"use strict";

		var bounce = new Bounce();

		this.nodes.list
			.find('.item:last')
			.prependTo(this.nodes.list);

		bounce.translate({
			from:      { x: 2 * this.newLeftPos, y: 0 },
			to:        { x: this.newLeftPos, y: 0 },
			duration:  this.options.speed,
			bounces:   0,
			stiffness: 5
		});

		this._updateItems(true);

		bounce.applyTo(this.nodes.list).then(() => {
			this.trigger('slideChanged');
		});
	}

	_updateItems (next = false) {
		"use strict";

		this.nodes.items.removeClass('prev active next');
		this.root.find('.item').eq(0).addClass('prev');
		this.root.find('.item').eq(1).addClass('active');
		this.root.find('.item').eq(2).addClass('next');

		this.resize();

		this.trigger('slideChanged');
	}

	resize () {
		"use strict";

		$$.window.on('resize', () => {
			let partPhoto = Math.ceil(($$.window.width() - this.options.containerWidth) / 2);

			this.nodes.list.css({
				marginLeft: `-${this.nodes.items.filter('.prev').width() - partPhoto}px`
			});
		});

		$$.window.resize();
	}

	_ready () {
		"use strict";

		this.nodes.items.each(function (index) {
			let item = $(this);
			let image = item.find('img');

			if (image.width() > image.height()) {
				item.addClass('horizontal');
			} else if (image.width() < image.height()) {
				item.addClass('vertical');
			}
		});

		var bounce = new Bounce();

		this.nodes.list
			.find('.item:last')
			.prependTo(this.nodes.list);

		let newPos = this.nodes.items.eq(0).outerWidth(true);

		bounce.translate({
			from:      { x: 0, y: 0 },
			to:        { x: -newPos, y: 0 },
			duration:  1,
			bounces:   0,
			stiffness: 5
		});


		this._updateItems(true);

		bounce.applyTo(this.nodes.list).then(() => {
			this.trigger('slideChanged');
		});

		if (this.options.isCyclical) {
			this.interval = setInterval(() => {
				this.setNext();
			}, this.options.isCyclicalInterval);
		}
	}
};
