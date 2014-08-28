// Require configuration
require.config({
	waitSeconds: 15,
	urlArgs: '_=' + (new Date()).getTime().toString()
});

// Run
require(['app'], function (App) {
	var app = new App();
	app.run();
});