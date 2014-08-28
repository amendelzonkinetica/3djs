define(['glmatrix', 'lib/matrixStack'], function(GLMatrix, MatrixStack) {
	var triangle = function(vertexes, colors) {
		this._vertexes = vertexes;
		this._colors = colors;
		this._transformationStack = new MatrixStack();
		this._transformation = mat4.create();
		mat4.identity(this._transformation);
	};
	
	triangle.prototype.getVertexes = function() {
		return this._vertexes;
	};
	
	triangle.prototype.getColors = function() {
		return this._colors;
	};
	
	triangle.prototype.getTransformation = function() {
		return this._transformation;
	};
	
	triangle.prototype.render = function(renderer) {
		renderer.renderTriangle(this);
	};
	
	triangle.prototype.rotate = function(angle, axis) {
		this._transformationStack.push(this._transformation);
		var rotation = mat4.create();
		mat4.identity(rotation);
		mat4.rotate(rotation, angle, axis);
		mat4.multiply(rotation, this._transformation, this._transformation);
	};
	
	triangle.prototype.translate = function(x, y, z) {
		this._transformationStack.push(this._transformation);
		var translation = mat4.create();
		mat4.identity(translation);
		mat4.translate(translation, [x, y, z]);
		mat4.multiply(translation, this._transformation, this._transformation);
	};
	
	triangle.prototype.scale = function(x, y, z) {
		this._transformationStack.push(this._transformation);
		var scalation = mat4.create();
		mat4.identity(scalation);
		mat4.scale(scalation, [x, y, z]);
		mat4.multiply(scalation, this._transformation, this._transformation);
	};
	
	triangle.prototype.undo = function() {
		if (this._transformationStack.isPopable()) {
			this._transformation = this._transformationStack.pop();
		}
	};
	
	return triangle;
});