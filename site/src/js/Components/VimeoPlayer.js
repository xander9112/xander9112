var $$ = $$ || {};

$$.VimeoPlayer = class VimeoPlayer {
	constructor (root, options) {
		this.root = root;

		this.options = {};

		_.assign(this.options, options);
		this.playerOrigin = '*';
		this._createPlayer();
		this._cacheNodes();
		this._bindEvents();
		this._ready();
	}

	_createPlayer () {
		"use strict";
		let rootClass = this.root.attr('class');
		let id = _.uniqueId('player_');

		let iframe = $(`
			<iframe id="${id}"
				class="${rootClass}"
				src="https://player.vimeo.com/video/${this.options.videoId}?api=1&player_id=${id}"
				width="${this.options.width}"
				height="${this.options.height}"
				frameborder="0"
				webkitallowfullscreen
				mozallowfullscreen
				allowfullscreen>
			</iframe>
			`);

		this.root.replaceWith(() => {
			return iframe;
		});

		this.player = iframe;
	}

	_cacheNodes () {
		this.nodes = {};
	}

	_onMessageReceived (event) {
		// Handle messages from the vimeo player only
		if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
			return false;
		}
		let self = this;

		if (this.playerOrigin === '*') {
			this.playerOrigin = event.origin;
		}

		var data = JSON.parse(event.data);

		console.log(data.event);

		switch (data.event) {
			case 'ready':
				this.root.trigger('PlayerCreated');
				break;

			case 'playProgress':
				onPlayProgress(data.data);
				break;

			case 'pause':
				onPause();
				break;

			case 'finish':
				onFinish();
				break;
		}
	}

	_bindEvents () {
		"use strict";
		// Listen for messages from the player

		if (window.addEventListener) {
			window.addEventListener('message', _.bind(this._onMessageReceived, this), false);
		}
		else {
			window.attachEvent('onmessage', _.bind(this._onMessageReceived, this), false);
		}

		return;

		// Helper function for sending a message to the player

		function onReady () {
			post('addEventListener', 'pause');
			post('addEventListener', 'finish');
			post('addEventListener', 'playProgress');
		}

		function onPause () {
			console.log('paused');
		}

		function onFinish () {
			console.log('finished');
		}

		function onPlayProgress (data) {
			console.log(data.seconds + 's played');
		}
	}

	_post (action, value) {
		"use strict";
		let data = {
			method: action
		};

		if (value) {
			data.value = value;
		}

		var message = JSON.stringify(data);

		this.player.get(0).contentWindow.postMessage(message, this.playerOrigin);
	}

	playVideo () {
		"use strict";
		this._post('play');
	}

	pauseVideo () {
		"use strict";
		this._post('pause');
	}

	stopVideo () {
		"use strict";
		this._post('stop');
	}

	get CurrentTime () {
		"use strict";

		return this._post('getCurrentTime');
	}

	get duration () {
		"use strict";

		return this._post('getDuration');
	}

	get volume () {
		"use strict";
		return this._post('getVolume');
	}

	set volume (volume) {
		"use strict";
		if (parseInt(volume) > 100) {
			volume = 100;
		}

		if (parseInt(volume) < 0) {
			volume = 0;
		}

		this._post('setVolume', volume);
	}


	_ready () {
		"use strict";
	}
};
