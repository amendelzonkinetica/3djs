define(['webgl-drawer'], function(WebGLDrawer) {
	var app = function() {
	};
	
	app.prototype.run = function() {
		var drawer = new WebGLDrawer('main', { vertex: 'main-shader-vertex', fragment: 'main-shader-fragment' });
		drawer.draw({});
	};
	
	return app;
});