var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var babel = require("gulp-babel");
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');

var production = require('../gulpfile');

gulp.task('scripts', ['scripts.app', 'scripts.vendor']);

gulp.task('scripts.app', function () {
	return gulp.src([
		'site/src/js/utils/*.js',
		'site/src/js/Component.js',
		'site/src/js/Components/*.js',
		'site/src/js/Application.js'
	])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(concat('app.js'))
		.pipe(gulpif(production, uglify()))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('site/assets/js/'));
});

gulp.task('scripts.vendor', function () {
	return gulp.src([
		'site/src/vendor/jquery-2.1.4.js',
		'site/src/vendor/jQueryFormStyler/jquery.formstyler.js',
		'site/src/vendor/semantic/semantic.js',
		'site/src/vendor/*.js'
	])
		.pipe(plumber())
		.pipe(concat('vendor.js', { newLine: ';\n' }))
		.pipe(gulpif(production, uglify()))
		.pipe(gulp.dest('site/assets/js/'));
});
