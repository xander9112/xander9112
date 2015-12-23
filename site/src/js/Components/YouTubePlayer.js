var $$ = $$ || {};

$$.YouTubePlayer = class YouTubePlayer {
	constructor (root, options) {
		this.root = root;

		this.options = {
			width:      '640',
			height:     '360',
			playerVars: {
				autoplay:       0,
				controls:       0,
				disablekb:      1,
				enablejsapi:    1,
				end:            '',
				loop:           0,
				modestbranding: 1,
				rel:            0
			},
			videoId:    'M7lc1UVf-VE'
		};

		_.merge(this.options, options);

		this.YT = undefined;

		this._cacheNodes();
		this._bindEvents();
		this._createScript();
		this._ready();
	}

	/**
	 * Загружаем скрипт в браузер
	 * @private
	 */

	_createScript () {
		"use strict";

		if (!$('script#js-youtube-api').length) {
			var tag = document.createElement('script');

			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[ 0 ];
			firstScriptTag.id = 'js-youtube-api';
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		}

		var interval = setInterval(() => {
			if (!_.isUndefined(window.YT)) {
				if (YT.loaded) {
					clearInterval(interval);
					this.YT = YT;
					this.root.trigger('YouTubeIframeAPIReady');
				}
			}
		}, 1);
	}

	_cacheNodes () {
		this.nodes = {};
	}

	_bindEvents () {
		"use strict";

		this.root.on('YouTubeIframeAPIReady', () => {
			this._createPlayer();
		});

		this.root.on('PlayerCreated', () => {

		});
	}

	_createPlayer () {
		"use strict";

		var playerOptions = {
			events: {
				'onReady':       (event) => {
					this.root.trigger('PlayerCreated');
				},
				'onStateChange': (event) => {
					this.onPlayerStateChange(event);
				}
			}
		};

		_.assign(playerOptions, this.options);

		this.player = new YT.Player(this.root.get(0), playerOptions);
	}

	set mute (isMute) {
		"use strict";

		if (isMute) {
			this.player.mute();
		} else {
			this.player.unMute();
		}
	}

	isMuted () {
		"use strict";
		return this.player.isMuted();
	}

	get volume () {
		"use strict";
		console.log(this.player.getVolume());
		return this.player.getVolume();
	}

	set volume (volume) {
		"use strict";
		if (parseInt(volume) > 100) {
			volume = 100;
		}

		if (parseInt(volume) < 0) {
			volume = 0;
		}

		this.player.setVolume(volume);
	}

	onPlayerStateChange (event) {
		if (event.data == YT.PlayerState.PLAYING) {
		}
	}


	playVideo () {
		"use strict";
		this.player.playVideo();
	}

	pauseVideo () {
		"use strict";
		this.player.pauseVideo();
	}

	stopVideo () {
		"use strict";
		this.player.stopVideo();
	}

	_ready () {
		"use strict";
	}
};
