var $$ = $$ || {};

$$.YandexMetrika = {
    counter: null,

    reachGoal: function (goal) {
        if (this.counter) {
            this.counter.reachGoal(goal);
        }
    }
};
