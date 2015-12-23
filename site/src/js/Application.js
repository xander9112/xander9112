var $$ = $$ || {};

class Application {
	constructor () {
		this._initMap();
		this._initYouTubePlayer();
	}

	_initMap () {
		"use strict";

		var mapElement = $('.js-map-left, .js-map-top');

		mapElement.each(function () {
			var item = $(this);
			let coodinates = mapElement.data('coords');
			let map = null;
			let offset = {};

			$$.window.on('resize', function () {
				item.height($$.windowHeight - $('.ui.top.menu').outerHeight(true));

				if ($('.js-addresses').hasClass('left')) {
					$('.js-addresses').height($$.windowHeight - $('.ui.top.menu').outerHeight(true) - 25);
				} else {
					item.height($$.windowHeight - $('.ui.top.menu').outerHeight(true));
				}
			});

			if (item.hasClass('js-map-top')) {

				var offsetheight = $('.js-addresses').offset().top + $('.js-addresses').outerHeight(true)

				offset = {
					top: offsetheight
				}
			}

			if (item.hasClass('js-map-left')) {
				offset = {
					left: $('.js-addresses').offset().left - $$.windowWidth
				}
			}

			map = new $$.GoogleMap(mapElement, {
				coordinates: coodinates,
				offset:      offset,
				icon:        {
					url: '/site/assets/images/point.png'
				},
				mapOptions:  {
					scrollwheel: true,
					styles:      ''
				}
			});

			var addresses = $('.js-addresses .js-list-group-item');

			addresses.each(function () {

				let markerPosition = map.setMarker($(this).data('coords'), $(this));

				$(this).on('click', (event, position) => {
					let element = $(event.currentTarget);
					let pos = _.isUndefined(position) ? markerPosition : position;

					element.siblings().removeClass('active');
					element.addClass('active');

					map.panTo = pos;
				});
			});
		});
	}

	_initYouTubePlayer () {
		"use strict";

		$('.js-youtube-player').each(function () {
			let dimmer = $('.js-dimmer');

			let player = new $$.YouTubePlayer($('.js-youtube-player'), {
				width:      '1101',
				height:     '620',
				videoId:    $(this).data('id'),
				playerVars: {
					disablekb: 0
				}
			});

			let form = $('.js-form-video');

			player.root.on('PlayerCreated', function () {
				dimmer.removeClass('active');

				form.on('click', '.js-play', function (event) {
					event.preventDefault();
					player.playVideo();

					$(this).addClass('active').siblings().removeClass('active');
				});

				form.on('click', '.js-pause', function (event) {
					event.preventDefault();
					player.pauseVideo();

					$(this).addClass('active').siblings().removeClass('active');
				});

				form.on('click', '.js-stop', function (event) {
					event.preventDefault();
					player.stopVideo();

					$(this).addClass('active').siblings().removeClass('active');
				});

				form.on('click', '.js-mute', function (event) {
					event.preventDefault();
					player.mute = !player.isMuted();

					if (player.isMuted()) {
						$(this).find('.icon').removeClass('volume off');
						$(this).find('.icon').addClass('volume up');
						$('.js-volume').removeClass('disabled');
					} else {
						$(this).find('.icon').removeClass('volume up');
						$(this).find('.icon').addClass('volume off');
						$('.js-volume').addClass('disabled');
					}
				});

				$('.js-volume').progress({
					percent: player.volume
				});

				form.on('click', '.js-volume-minus', function (event) {
					event.preventDefault();
					if (player.volume === 0) {
						$('.js-volume').progress({
							percent: 0
						});
						return;
					}

					player.volume -= 10;

					$('.js-volume').progress({
						percent: player.volume
					});
				});

				form.on('click', '.js-volume-plus', function (event) {
					event.preventDefault();
					if (player.volume === 100) {
						$('.js-volume').progress({
							percent: 100
						});

						return;
					}

					player.volume += 10;

					$('.js-volume').progress({
						percent: player.volume
					});
				});
			});
		});
	}
}

$(function () {
	$$.window = $(window);
	$$.body = $(document.body);
	$$.windowWidth = $$.window.width();
	$$.windowHeight = $$.window.height();
	$$.ESCAPE_KEY_CODE = 27;

	$$.window.on('resize', function () {
		$$.windowWidth = $$.window.width();
		$$.windowHeight = $$.window.height();
	});

	$$.application = new Application();

	$$.window.resize();
});