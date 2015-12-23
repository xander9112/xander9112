var gulp = require('gulp');
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var production = require('../gulpfile');

gulp.task('images', function () {
    return gulp.src([
	    'site/src/vendor/semantic/images/*',
	    'site/src/images/*'
    ])
        .pipe(plumber())
        .pipe(gulpif(production, imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        })))
        .pipe(gulp.dest('site/assets/images/'));
});
