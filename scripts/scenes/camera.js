define(['glmatrix', 'lib/matrixStack'], function(GLMatrix, MatrixStack) {
	var camera = function() {
		this._transformationStack = new MatrixStack();
		this._transformation = mat4.create();
		mat4.identity(this._transformation);
	};
	
	camera.prototype.getTransformation = function() {
		return this._transformation;
	};
	
	camera.prototype.rotate = function(x, y, z) {
		this._transformationStack.push(this._transformation);
		var rotation = mat4.create();
		mat4.identity(rotation);
		mat4.rotate(rotation, [-x, -y, -z]);
		mat4.multiply(rotation, this._transformation, this._transformation);
	};
	
	camera.prototype.translate = function(x, y, z) {
		this._transformationStack.push(this._transformation);
		var translation = mat4.create();
		mat4.identity(translation);
		mat4.translate(translation, [-x, -y, -z]);
		mat4.multiply(translation, this._transformation, this._transformation);
	};
	
	camera.prototype.undo = function() {
		if (this._transformationStack.isPopable()) {
			this._transformation = this._transformationStack.pop();
		}
	};
	
	return camera;
});