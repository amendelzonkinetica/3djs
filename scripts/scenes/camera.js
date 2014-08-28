define(['glmatrix'], function(GLMatrix) {
	var camera = function() {
		this._transformation = mat4.create();
		mat4.identity(this._transformation);
	};
	
	camera.prototype.getTransformation = function() {
		return this._transformation;
	};
	
	camera.prototype.rotate = function(angle, axis) {
		var rotation = mat4.create();
		mat4.identity(rotation);
		mat4.rotate(rotation, angle, [-axis[0], -axis[1], -axis[2]]);
		mat4.multiply(rotation, this._transformation, this._transformation);
	};
	
	camera.prototype.translate = function(x, y, z) {
		var translation = mat4.create();
		mat4.identity(translation);
		mat4.translate(translation, [-x, -y, -z]);
		mat4.multiply(translation, this._transformation, this._transformation);
	};
	
	return camera;
});