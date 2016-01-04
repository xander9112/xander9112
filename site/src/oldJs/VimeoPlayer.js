var $$ = $$ || {};

$$.VimeoPlayer = class VimeoPlayer {
	constructor (root, options) {
		this.root = root;

		this.options = {};

		_.assign(this.options, options);

		this.playerState = 0;

		this._createScript();
		this._createPlayer();

		this._ready();
	}

	_createScript () {
		"use strict";

		if (!$('script#js-vimeo-api').length) {
			var tag = document.createElement('script');

			tag.src = "https://f.vimeocdn.com/js/froogaloop2.min.js";
			var firstScriptTag = document.getElementsByTagName('script')[ 0 ];
			firstScriptTag.id = 'js-vimeo-api';
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		}

		var interval = setInterval(() => {
			if (!_.isUndefined(window.$f)) {
				clearInterval(interval);

				this.root.trigger('APIReady');
			}
		}, 1);
	}

	_createPlayer () {
		"use strict";
		let rootClass = this.root.attr('class');
		let id = _.uniqueId('player_');

		this.root.on('APIReady', () => {
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

			this.root.append(iframe);

			this.player = $f(this.root.find('iframe').get(0));

			this.player.addEvent('ready', () => {
				this.root.trigger('PlayerCreated');

				this.player.addEvent('play', () => {
					this.playerState = 1;
					this.root.trigger('PlayerStateChange');
				});

				this.player.addEvent('pause', () => {
					this.playerState = 2;
					this.root.trigger('PlayerStateChange');
				});

				this.player.addEvent('finish', () => {
					this.playerState = 0;
					this.root.trigger('PlayerStateChange');
				});
			});
		});
	}

	_cacheNodes () {
		this.nodes = {};
	}

	get duration () {
		"use strict";

		let duration = new Promise((resolve, reject) => {
			this.player.api('getDuration', function (value) {
				resolve(value);
			});
		});

		return duration;
	}

	_bindEvents () {
		"use strict";

	}

	playVideo () {
		"use strict";

		this.player.api('play');
	}

	pauseVideo () {
		"use strict";

		this.player.api('pause');
	}

	stopVideo () {
		"use strict";

		this.player.api('unload');
	}

	get CurrentTime () {
		"use strict";

		let promise = new Promise((resolve, reject) => {
			this.player.api('getCurrentTime', function (value) {
				resolve(value);
			});
		});

		return promise;
	}

	get volume () {
		"use strict";

		let promise = new Promise((resolve, reject) => {
			this.player.api('getVolume', function (value) {
				resolve(value);
			});
		});

		return promise;
	}

	set volume (volume) {
		"use strict";
		if (parseInt(volume) > 100) {
			volume = 100;
		}

		if (parseInt(volume) < 0) {
			volume = 0;
		}

		this.player.api('setVolume', volume);
	}

	set mute (isMute) {
		"use strict";

		if (isMute) {
			this.player.api('setVolume', 0);
		} else {
			this.player.api('setVolume', 1);
		}
	}

	isMuted () {
		"use strict";

		let promise = new Promise((resolve, reject) => {
			this.player.api('getVolume', function (value) {
				resolve(value === 0);
			});
		});

		return promise;
	}

	_ready () {
		"use strict";
	}
};
