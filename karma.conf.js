module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine-ajax', 'jasmine'],
		files: [
			'node_modules/jquery/dist/jquery.js',
			'node_modules/knockout/build/output/knockout-latest.debug.js',
			'js/**/*.js',
			'spec/**/*.js'
		],
		exclude: [],
		preprocessors: {
			'js/**/*.js': ['coverage']
		},
		reporters: ['progress', 'coverage'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['PhantomJS'],
		singleRun: false,
		concurrency: Infinity
	});
};
