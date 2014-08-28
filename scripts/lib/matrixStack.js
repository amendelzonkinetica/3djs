define(['glmatrix'], function(GLMatrix) {
	var matrixStack = function() {
		this._stack = [];
	};
	
	matrixStack.prototype.push = function(matrix) {
		var copy = mat4.create();
		mat4.set(matrix, copy);
		this._stack.push(copy);
	};
	
	matrixStack.prototype.pop = function() {
		if (this._stack.length == 0) {
			throw "Stack is empty :-(";
		}
		return this._stack.pop();
	};
	
	matrixStack.prototype.isPopable = function() {
		return this._stack.length > 0;
	};
	
	return matrixStack;
});