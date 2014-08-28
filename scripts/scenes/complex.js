define(['glmatrix'], function(GLMatrix) {
	var complex = function() {
		this._objects = [];
		this._transformation = mat4.create();
		mat4.identity(this._transformation);
	};
	
	complex.prototype.add = function(object) {
		this._objects.push(object);
	};
	
	complex.prototype.getObjects = function() {
		return this._objects;
	};
	
	complex.prototype.getTransformation = function() {
		return this._transformation;
	};
	
	complex.prototype.render = function(renderer) {
		renderer.renderComplex(this);
	};
	
	complex.prototype.rotate = function(angle, axis) {
		var rotation = mat4.create();
		mat4.identity(rotation);
		mat4.rotate(rotation, angle, axis);
		mat4.multiply(rotation, this._transformation, this._transformation);
	};
	
	complex.prototype.translate = function(x, y, z) {
		var translation = mat4.create();
		mat4.identity(translation);
		mat4.translate(translation, [x, y, z]);
		mat4.multiply(translation, this._transformation, this._transformation);
	};
	
	complex.prototype.scale = function(x, y, z) {
		var scalation = mat4.create();
		mat4.identity(scalation);
		mat4.scale(scalation, [x, y, z]);
		mat4.multiply(scalation, this._transformation, this._transformation);
	};
	
	return complex;
});