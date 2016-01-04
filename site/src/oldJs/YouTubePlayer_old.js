/*
var $$ = $$ || {};

$$.YouTube = class YouTube {
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

	/!**
	 * Загружаем скрипт в браузер
	 * @private
	 *!/

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

		this.root.on('PlayerStateChange', (event, data) => {
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
					this.root.trigger('PlayerStateChange', event);
				}
			}
		};

		_.assign(playerOptions, this.options);

		this.player = new YT.Player(this.root.get(0), playerOptions);
	}

	onPlayerStateChange (event) {
		if (event.data == YT.PlayerState.PLAYING) {
		}
	}


	_ready () {
		"use strict";
	}
};

$$.YouTubePlayer = class YouTubePlayer extends $$.YouTube {
	constructor (root, options) {
		"use strict";

		super(root, options)
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

	set size (size) {
		"use strict";

		this.player.setSize(size.width, size.height);
	}

	/!**
	 * Возвращает состояние проигрывателя. Возможные значения:
	 * @returns
	 * -1 – воспроизведение видео не началось
	 * 0 – воспроизведение видео завершено
	 * 1 – воспроизведение
	 * 2 – пауза
	 * 3 – буферизация
	 * 5 – видео находится в очереди
	 *!/

	get playerState () {
		"use strict";

		return this.player.getPlayerState()
	}

	get CurrentTime () {
		"use strict";

		return this.player.getCurrentTime();
	}

	get duration () {
		"use strict";

		return this.player.getDuration();
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
};
*/
