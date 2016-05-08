var gulp = require('gulp');
var eslint = require('gulp-eslint');
var path = require('path');
var Server = require('karma').Server;

gulp.task('eslint', function () {
	return gulp.src(['src/**/*.js', 'spec/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('test', function (done) {
	new Server({
		configFile: path.join(__dirname, '/karma.conf.js'),
		singleRun: true
	}, done).start();
});

gulp.task('default', ['eslint', 'test']);
