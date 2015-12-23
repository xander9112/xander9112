<?php include('../header.php'); ?>
    <div class="ui stackable grid container b-video-page">
        <div class="ui active dimmer js-dimmer">
            <div class="ui loader"></div>
        </div>
        <div class="row">
            <div class="sixteen wide column">
                <div class="embed-responsive embed-responsive-16by9">
                    <div class="embed-responsive-item js-youtube-player" data-id="M7lc1UVf-VE"></div>
                </div>
            </div>
            <div class="sixteen wide column">
                <form class="ui form js-form-video">
                    <div class="fields">
                        <div class="thirteen wide field">
                            <div class="ui indicating progress js-progress-time">
                                <div class="bar">
                                    <div class="progress"></div>
                                </div>
                            </div>
                        </div>
                        <div class="three wide field">
                            <div class="ui label">
                                <i class="wait icon"></i> <span class="js-current-time">00:00</span>
                            </div>
                            <div class="ui label">
                                <i class="wait icon"></i> <span class="js-all-time">00:00</span>
                            </div>
                        </div>
                    </div>
                    <div class="fields">
                        <div class="four wide field">
                            <button class="ui icon button js-play">
                                <i class="play icon"></i>
                            </button>
                            <button class="ui icon button js-pause">
                                <i class="pause icon"></i>
                            </button>
                            <button class="ui icon button js-stop">
                                <i class="stop icon"></i>
                            </button>
                            <button class="ui icon button js-mute">
                                <i class="volume up icon"></i>
                            </button>
                        </div>
                        <div class="twelve wide field">
                            <div class="fields">
                                <div class="one wide field">
                                    <button class="ui icon button js-volume-minus">
                                        <i class="minus icon"></i>
                                    </button>
                                </div>
                                <div class="fourteen wide field">
                                    <div class="ui indicating progress js-volume">
                                        <div class="bar"></div>
                                        <div class="label">Громкость</div>
                                    </div>
                                </div>
                                <div class="one wide field">
                                    <button class="Right floated ui icon button js-volume-plus">
                                        <i class="plus icon"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                </form>
            </div>
        </div>
    </div>
<?php include('../footer.php');
