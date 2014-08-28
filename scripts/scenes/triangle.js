define(['glmatrix'], function(GLMatrix) {
	var triangle = function(vertexes, colors) {
		this._vertexes = vertexes;
		this._colors = colors;
	};
	
	triangle.prototype.getVertexes = function() {
		return this._vertexes;
	};
	
	triangle.prototype.getColors = function() {
		return this._colors;
	};
	
	triangle.prototype.render = function(renderer) {
		renderer.renderTriangle(this);
	};
	
	return triangle;
});