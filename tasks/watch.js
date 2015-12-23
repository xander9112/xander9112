var gulp = require('gulp');

gulp.task('watch', function () {
	gulp.watch('site/src/js/**/*.js', ['scripts.app']);
	gulp.watch('site/src/vendor/*.js', ['scripts.vendor']);
	gulp.watch('site/src/images/*', ['images']);
	gulp.watch('site/src/images/sprite/*', ['sprite']);
	gulp.watch('site/src/less/*.less', ['styles']);
});
