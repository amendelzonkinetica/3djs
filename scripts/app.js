define(['webgl-renderer', 'scenes/scene', 'scenes/triangle', 'scenes/camera'], function(WebGLRenderer, Scene, Triangle, Camera) {
	var app = function() {
	};
	
	app.prototype.run = function() {
		var renderer = new WebGLRenderer('main', { vertex: 'main-shader-vertex', fragment: 'main-shader-fragment' });
		
		// The triangle
		var triangle = new Triangle([
			[0.0, 1.0, 0.0],
			[-1.0, -1.0, 0.0],
			[1.0, -1.0, 0.0]
		], [
			[1.0, 0.0, 0.0, 1.0],
			[1.0, 1.0, 0.0, 1.0],
			[1.0, 0.0, 1.0, 1.0]
		]);
		
		// The camera
		var camera = new Camera();
		camera.translate(0,0,7);
		renderer.setCamera(camera);
		
		// The scene
		var scene = new Scene();
		scene.add(triangle);
		
		// Render!
		scene.render(renderer);
	};
	
	return app;
});