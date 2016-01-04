var $$ = $$ || {};

$$.VimeoPlayer2 = class VimeoPlayer2 {
	constructor (root, options) {
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

	get duration () {
		"use strict";
		this._post('getDuration');
		return this.playerObject.getDuration;
	}

	_onMessageReceived (event) {
		// Handle messages from the vimeo player only
		if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
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
			this.playerObject[ data.method ] = data.value;
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

	_bindEvents () {
		"use strict";
		if (window.addEventListener) {
			window.addEventListener('message', _.bind(this._onMessageReceived, this), false);
		}
		else {
			window.attachEvent('onmessage', _.bind(this._onMessageReceived, this), false);
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
