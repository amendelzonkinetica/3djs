// Require configuration
require.config({
	paths: {
		'jquery': 'http://code.jquery.com/jquery-1.11.0.min',
		'glmatrix': 'lib/glMatrix'
	},
	shim: {
		'glmatrix': {
			deps: [],
			exports: '___module___glMatrix'
		}
	},
	waitSeconds: 15,
	urlArgs: '_=' + (new Date()).getTime().toString()
});

// Run
require(['app'], function (App) {
	var app = new App();
	app.run();
});