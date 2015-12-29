var $$ = $$ || {};

$$.GoogleAnalytics = {
	reachGoal: function (goal) {
		if (!_.isUndefined(window.ga)) {
			ga('send', 'event', 'click', goal);
		}
	},

	reachPage: function (page) {
		if (!_.isUndefined(window.ga)) {
			ga('send', 'pageview', page);
		}
	}
};
