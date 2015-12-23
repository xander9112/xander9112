var gulp = require('gulp');
var del = require('del');

gulp.task('clean', function (callback) {
	return del('site/assets/**/*', callback);
});

gulp.task('build', ['scripts', 'styles', 'images', 'fonts', 'sprite']);

gulp.task('default', [ 'clean' ], function () {
	gulp.start('build');
});
