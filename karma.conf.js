module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine-ajax', 'jasmine'],
		files: [
			'node_modules/jquery/dist/jquery.js',
			'node_modules/knockout/build/output/knockout-latest.debug.js',
			'node_modules/knockout.validation/dist/knockout.validation.js',
			'node_modules/ko.editables/ko.editables.js',
			'node_modules/moment/moment.js',
			'js/**/*.js',
			'spec/**/*.js'
		],
		exclude: [],
		preprocessors: {
			'js/**/*.js': ['coverage']
		},
		reporters: ['progress', 'coverage'],
		coverageReporter: {
			dir: 'coverage',
			reporters: [
				{type: 'html'},
				{type: 'teamcity', subdir: '.', file: 'teamcity.txt'}
			]
		},
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['PhantomJS'],
		singleRun: false,
		concurrency: Infinity
	});
};
