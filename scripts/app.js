define(['jquery', 'webgl-renderer', 'scenes/scene', 'scenes/complex', 'scenes/triangle', 'scenes/camera'], function($, WebGLRenderer, Scene, Complex, Triangle, Camera) {
	var app = function() {
	};
	
	app.prototype.run = function() {
		var self = this;
		$(function() {
			// The web gl renderer
			self._renderer = new WebGLRenderer('main', { vertex: 'main-shader-vertex', fragment: 'main-shader-fragment' });
			
			// The triangles
			var t1 = new Triangle([
				[0.0, 1.0, 0.0],
				[-1.0, -1.0, 0.0],
				[1.0, -1.0, 0.0]
			], [
				[0.5, 0.0, 0.0, 1.0],
				[0.5, 0.0, 0.0, 1.0],
				[0.5, 0.0, 0.0, 1.0]
			]);
			var t2 = new Triangle([
				[0.0, 1.0, 0.0],
				[-1.0, -1.0, 0.0],
				[0.0, -1.0, -1.0]
			], [
				[0.0, 0.5, 0.0, 1.0],
				[0.0, 0.5, 0.0, 1.0],
				[0.0, 0.5, 0.0, 1.0]
			]);
			var t3 = new Triangle([
				[0.0, 1.0, 0.0],
				[0.0, -1.0, -1.0],
				[1.0, -1.0, 0.0]
			], [
				[0.0, 0.0, 0.5, 1.0],
				[0.0, 0.0, 0.5, 1.0],
				[0.0, 0.0, 0.5, 1.0]
			]);
			var t4 = new Triangle([
				[-1.0, -1.0, 0.0],
				[1.0, -1.0, 0.0],
				[0.0, -1.0, -1.0]
			], [
				[0.5, 0.5, 0.0, 1.0],
				[0.5, 0.5, 0.0, 1.0],
				[0.5, 0.5, 0.0, 1.0]
			]);
			
			// The complex object
			self._complex = new Complex();
			self._complex.add(t1);
			self._complex.add(t2);
			self._complex.add(t3);
			self._complex.add(t4);
			
			// The camera
			var camera = new Camera();
			camera.translate(0,0,7);
			self._renderer.setCamera(camera);
			
			// The scene
			self._scene = new Scene();
			self._scene.add(self._complex);
			
			// Render!
			self._scene.render(self._renderer);
			
			// UI related stuff
			self._dragging = false;
			self._totalX = $('#main').width();
			self._totalY = $('#main').height();
			self._dragScale = 0.05;
			
			// Bind events
			self._bindEvents();
		});
	};
	
	app.prototype._bindEvents = function() {
		var self = this;
		$('#main').on('mousedown', function(e) { self._mouseDown(e); });
		$('#main').on('mouseup', function(e) { self._mouseUp(e); });
		$('#main').on('mousemove', function(e) { self._mouseMove(e); });
	};
	
	app.prototype._mouseDown = function(e) {
		this._dragging = true;
		this._mouseDownPosition = e;
	};
	
	app.prototype._mouseUp = function(e) {
		this._dragging = false;
	};
	
	app.prototype._mouseMove = function(e) {
		if (this._dragging) {
			// Calculate amount dragged
			var deltaX = e.offsetX - this._mouseDownPosition.offsetX;
			var deltaY = e.offsetY - this._mouseDownPosition.offsetY;
			var percentX = deltaX / this._totalX * this._dragScale;
			var percentY = deltaY / this._totalY * this._dragScale;
			// Rooootation!
			this._complex.rotate(2.0 * Math.PI * percentX, [0, 1, 0]);
			this._complex.rotate(2.0 * Math.PI * percentY, [1, 0, 0]);
			// Rendering!
			this._scene.render(this._renderer);
		}
	};
	
	return app;
});