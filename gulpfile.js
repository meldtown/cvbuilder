var gulp = require('gulp');
var eslint = require('gulp-eslint');
var htmlmin = require('gulp-htmlmin');
var insert = require('gulp-insert');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var mincss = require('gulp-clean-css');
var uncss = require('gulp-uncss');
var path = require('path');
var Server = require('karma').Server;

gulp.task('eslint', function () {
	/** @type Function|stream */
	var formatter = eslint.format();
	/** @type Function|stream */
	var done = eslint.failAfterError();

	return gulp.src(['src/**/*.js', 'spec/**/*.js'])
		.pipe(eslint())
		.pipe(formatter)
		.pipe(done);
});

gulp.task('test', function (done) {
	new Server({
		configFile: path.join(__dirname, '/karma.conf.js'),
		singleRun: true
	}, done).start();
});

gulp.task('js', function () {
	return gulp.src(['./js/Helpers.js', './js/*.js'])
		.pipe(concat('cvbuilder.js'))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('css', function () {
	return gulp.src('./scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascading: false
		}))
		.pipe(uncss({
			html: ['index.html']
		}))
		.pipe(mincss())
		.pipe(gulp.dest('./dist/'));
});

gulp.task('html', function () {
	return gulp.src('html/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(insert.transform(function (contents, file) {
			var filename = path.basename(file.path, '.html');
			return '<script id="' + filename + '" type="text/html">' + contents + '</script>';
		}))
		.pipe(concat('cvbuilder.html', {newLine: ''}))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('dist', ['js', 'css', 'html']);

gulp.task('watch', function () {
	gulp.watch(['./scss/**/*.scss'], ['css']);
	gulp.watch('./js/**/*.js', ['js']);
	gulp.watch('./html/**/*.html', ['html']);
});

gulp.task('default', ['eslint', 'test', 'dist']);
