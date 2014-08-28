define([], function() {
	var scene = function() {
		this._objects = [];
	};
	
	scene.prototype.add = function(object) {
		this._objects.push(object);
	};
	
	scene.prototype.getObjects = function() {
		return this._objects;
	};
	
	scene.prototype.render = function(renderer) {
		renderer.renderScene(this);
	};
	
	return scene;
});