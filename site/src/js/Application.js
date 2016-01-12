var $$ = $$ || {};

class Application {
	constructor () {
		this._initMap();
		this._initYouTubePlayer();
		this._initYouTubePlayerList();
		this._initVimeoPlayer();
		this._initSimpleSlider();
		this._initFormStyles();
		this._initSimpleForm();
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

			player.on('PlayerCreated', function () {
				dimmer.removeClass('active');

				$('.js-progress-time').progress({
					percent: 0
				});

				var interval = null;

				let allTime = $$.secondsToTime(player.duration);

				$('.js-all-time').text(`${allTime.minutes}:${allTime.sec}`);

				player.on('PlayerStateChange', function () {

					if (player.playerState === 1) {
						interval = setInterval(() => {
							let currentTime = parseInt(player.CurrentTime);
							let duration = parseInt(player.duration);

							let allTime = $$.secondsToTime(player.CurrentTime);
							$('.js-current-time').text(`${allTime.minutes}:${allTime.sec}`);

							$('.js-progress-time').progress({
								percent: parseInt(((currentTime / duration) * 100))
							});
						}, 1000);
					} else {
						clearInterval(interval);
					}


				});

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

	_initYouTubePlayerList () {
		"use strict";

		$('.js-youtube-player-list').each(function () {
			let dimmer = $('.js-dimmer');

			let player = new $$.YouTubePlayerList($('.js-youtube-player-list'), {
				width:      '640',
				height:     '480',
				videoId:    $(this).data('id'),
				playerVars: {
					disablekb: 0
				}
			});

			let form = $('.js-form-video');

			//$('.js-video-list')

			player.on('PlayerCreated', function () {
				dimmer.removeClass('active');

				$('.js-progress-time').progress({
					percent: 0
				});

				var interval = null;

				let allTime = $$.secondsToTime(player.duration);

				$('.js-all-time').text(`${allTime.minutes}:${allTime.sec}`);

				player.on('PlayerStateChange', function () {
					if (player.playerState === 1) {
						interval = setInterval(() => {
							let currentTime = parseInt(player.CurrentTime);
							let duration = parseInt(player.duration);

							let allTime = $$.secondsToTime(player.CurrentTime);
							$('.js-current-time').text(`${allTime.minutes}:${allTime.sec}`);

							$('.js-progress-time').progress({
								percent: parseInt(((currentTime / duration) * 100))
							});
						}, 1000);
					} else {
						clearInterval(interval);
					}
				});


				$('.js-video-list').find('.item').each(function (index) {
					let indexElement = index;

					$(this).on('click', 'a', (event) => {
						event.preventDefault();
						let item = $(event.currentTarget);
						player.cueVideoById(item.data('id'));
					});
				});

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

	_initVimeoPlayer () {
		"use strict";

		$('.js-vimeo-player').each(function () {
			let dimmer = $('.js-dimmer');

			let player = new $$.VimeoPlayer($('.js-vimeo-player'), {
				width:   '1101',
				height:  '620',
				videoId: $(this).data('id')
			});

			let form = $('.js-form-video');

			player.on('PlayerCreated', function () {
				dimmer.removeClass('active');

				$('.js-progress-time').progress({
					percent: 0
				});

				var interval = null;

				player.duration.then((resolve) => {
					let allTime = $$.secondsToTime(resolve);

					$('.js-all-time').text(`${allTime.minutes}:${allTime.sec}`);
				});

				form.on('click', '.js-play', function (event) {
					event.preventDefault();
					player.playVideo();

					$(this).addClass('active').siblings().removeClass('active');
				});


				player.on('PlayerStateChange', function () {
					let currentTime = 0;
					let allTime = 0;
					let duration = 0;

					if (player.playerState === 1) {
						interval = setInterval(() => {
							player.CurrentTime.then((currentTime) => {
								player.duration.then((duration) => {
									currentTime = parseInt(currentTime);
									allTime = $$.secondsToTime(currentTime);
									duration = parseInt(duration);

									$('.js-current-time').text(`${allTime.minutes}:${allTime.sec}`);

									$('.js-progress-time').progress({
										percent: parseInt(((currentTime / duration) * 100))
									});
								});
							});
						}, 1000);
					} else {
						clearInterval(interval);
					}


				});

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

					player.isMuted().then((isMuted) => {
						player.mute = !isMuted;

						if (isMuted) {
							$(this).find('.icon').removeClass('volume off');
							$(this).find('.icon').addClass('volume up');
							$('.js-volume').removeClass('disabled');
						} else {
							$(this).find('.icon').removeClass('volume up');
							$(this).find('.icon').addClass('volume off');
							$('.js-volume').addClass('disabled');
						}
					});
				});


				player.volume.then((volume) => {
					$('.js-volume').progress({
						percent: volume * 100
					});
				});

				form.on('click', '.js-volume-minus', function (event) {
					event.preventDefault();

					player.volume.then((volume) => {
						if (volume === 0) {
							$('.js-volume').progress({
								percent: 0
							});
							return;
						}

						player.volume = volume - 0.1;

						player.volume.then((volume) => {
							$('.js-volume').progress({
								percent: volume * 100
							});
						});
					});
				});

				form.on('click', '.js-volume-plus', function (event) {
					event.preventDefault();

					player.volume.then((volume) => {
						if (volume === 1) {
							$('.js-volume').progress({
								percent: 100
							});
							return;
						}

						player.volume = volume + 0.1;

						player.volume.then((volume) => {
							$('.js-volume').progress({
								percent: volume * 100
							});
						});
					});
				});
			});
		});
	}

	_initSimpleSlider () {
		"use strict";

		$('.js-simple-slider').each(function () {
			let slider = new $$.SimpleSlider($(this), {
				isCyclical: false
			});

			slider.nodes.items.each(function (index) {
				let item = $(this);

				item.append(`<div class="index"><span>${index}</span></div>`);
			});
		});
	}

	_initFormStyles () {
		"use strict";


		$('.js-form-styles').each(function () {
			$(this).find('input, textarea, select').styler();
		});
	}

	_initSimpleForm () {
		"use strict";

		$('select.dropdown').dropdown();
		$('.ui.checkbox').checkbox();

		$('.js-form-generator').each(function () {
			let generatorForm = $(this);
			let simple = $('.js-simple-form');
			let firstLevel = generatorForm.find('.first-level');
			let secondLevel = generatorForm.find('.second-level');

			secondLevel.slideUp();

			generatorForm.on('click', '.js-create-form', (event) => {
				let simpleForm = new $$.SimpleForm(simple, {
					method:          generatorForm.find('.js-method .selected').text(),
					action:          generatorForm.find('.js-action').val(),
					additionalClass: 'ui form'
				});

				simpleForm.createForm();

				firstLevel.slideUp();
				secondLevel.slideDown();

				generatorForm.on('click', '.js-create-field', (event) => {
					let options = {};

					secondLevel.find('input, select').each(function () {
						let item = $(this);

						if (item[ 0 ].nodeName === 'INPUT' || item[ 0 ].nodeName === 'SELECT') {
							if (item.val() !== '') {

								if (item.attr('type') === 'checkbox') {
									item.val(item.val() === 'on' ? true : false);
								}

								options[ item.attr('name') ] = item.val();
							}
						}
					});

					console.log(options);

					let field = simpleForm.createInput({
						label:           'Тестовое поле',
						name:            'INPUT_TEST',
						type:            'text',
						placeholder:     'Плейсхолдер',
						required:        {
							required: true,
							message:  'Это поля обязательно к заполнению!!!'
						},
						additionalClass: 'field'
					});

				});

				/*

				 simpleForm.createSubmit({
				 name:            'SUBMIT',
				 type:            'submit',
				 value:           'Отправить форму',
				 additionalClass: 'ui button'
				 });*/


			});


			/*form.validate({
			 errorPlacement: function (error, element) {
			 let field = element.parent();
			 field.parents('form').removeClass('loading');

			 field.addClass('error');
			 field.find('.f-error').text(error.text());


			 },
			 submitHandler:  (form) => {
			 form = $(form);
			 form.addClass('loading');

			 form.find('.f-field').each(function () {
			 $(this).removeClass('error');
			 $(this).find('.f-error').text('');
			 });


			 /!**
			 * TODO: Временный код
			 *!/

			 setTimeout(function () {
			 form.removeClass('loading');
			 }, 1000);
			 },
			 success:        function (label, element) {
			 // set &nbsp; as text for IE

			 let field = $(element).parent();
			 field.parents('form').removeClass('loading');
			 field.removeClass('error');
			 field.addClass('success');
			 field.find('.f-error').text('');
			 }
			 });*/
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
