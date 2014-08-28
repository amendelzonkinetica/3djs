define(['glmatrix'], function(GLMatrix) {
	var webGLDrawer = function(canvas, shaders) {
		this._canvas = canvas;
		this._shaders = shaders;
		this._initGL();
		this._shaderProgram = this._initShaderProgram();
	};
	
	webGLDrawer.prototype.draw = function(scene) {
		// Scene-drawing routine
		
		this._gl.viewport(0, 0, this._gl.viewportWidth, this._gl.viewportHeight);
		this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
		
		var pMatrix = mat4.create();
		mat4.perspective(45, this._gl.viewportWidth / this._gl.viewportHeight, 0.1, 100.0, pMatrix);
		var mvMatrix = mat4.create();
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, [0.0, 0.0, -7.0]);
		this._gl.uniformMatrix4fv(this._shaderProgram.pMatrixUniform, false, pMatrix);
		this._gl.uniformMatrix4fv(this._shaderProgram.mvMatrixUniform, false, mvMatrix);
		
		var triangleVertexPositionBuffer = this._createVertexPositionBuffer([
			0.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
            1.0, -1.0,  0.0
		]);
		var triangleVertexColorBuffer = this._createVertexColorBuffer([
			1.0,  0.0,  0.0, 1.0,
            1.0,  1.0,  0.0, 1.0,
            1.0,  0.0,  1.0, 1.0,
		]);
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
		this._gl.vertexAttribPointer(this._shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, this._gl.FLOAT, false, 0, 0);
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, triangleVertexColorBuffer);
		this._gl.vertexAttribPointer(this._shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, this._gl.FLOAT, false, 0, 0);
		this._gl.drawArrays(this._gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
	};
	
	webGLDrawer.prototype._createVertexPositionBuffer = function(values) { return this._createBuffer(values, 3); };
	
	webGLDrawer.prototype._createVertexColorBuffer = function(values) { return this._createBuffer(values, 4); };
	
	webGLDrawer.prototype._createBuffer = function(values, itemSize) {
		var result = this._gl.createBuffer();
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, result);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(values), this._gl.STATIC_DRAW);
		result.itemSize = itemSize;
		result.numItems = values.length / itemSize;
		return result;
	};
	
	webGLDrawer.prototype._initGL = function() {
		try {
			var canvas = document.getElementById(this._canvas);
			if (!canvas) {
				throw "Invalid canvas :-(";
			}
			this._gl = canvas.getContext("experimental-webgl");
			this._gl.viewportWidth = canvas.width;
			this._gl.viewportHeight = canvas.height;
			
		} catch(e) { }
		
		if (!this._gl) {
			throw new "Could not initialise WebGL, sorry :-( ";
		}
	};
	
	webGLDrawer.prototype._initShaderProgram = function() {
		var fragmentShader = this._getShader(this._shaders.fragment);
		var vertexShader = this._getShader(this._shaders.vertex);

		var shaderProgram = this._gl.createProgram();
		this._gl.attachShader(shaderProgram, vertexShader);
		this._gl.attachShader(shaderProgram, fragmentShader);
		this._gl.linkProgram(shaderProgram);

		if (!this._gl.getProgramParameter(shaderProgram, this._gl.LINK_STATUS)) {
			throw "Could not initialise shaders, sorry :-(";
		}

		this._gl.useProgram(shaderProgram);
		
		shaderProgram.vertexPositionAttribute = this._gl.getAttribLocation(shaderProgram, "aVertexPosition");
		this._gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
		
		shaderProgram.vertexColorAttribute = this._gl.getAttribLocation(shaderProgram, "aVertexColor");
		this._gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
		
		shaderProgram.pMatrixUniform = this._gl.getUniformLocation(shaderProgram, "uPMatrix");
		shaderProgram.mvMatrixUniform = this._gl.getUniformLocation(shaderProgram, "uMVMatrix");
		
		return shaderProgram;
	};
	
	webGLDrawer.prototype._getShader = function(which) {
		var shaderScript = document.getElementById(which);
		if (!shaderScript) {
			throw "Invalid shader specified: '" + which + "' :-(";
		}

		var str = "";
		var k = shaderScript.firstChild;
		while (k) {
			if (k.nodeType == 3) {
				str += k.textContent;
			}
			k = k.nextSibling;
		}

		var shader;
		if (shaderScript.type == "x-shader/x-fragment") {
			shader = this._gl.createShader(this._gl.FRAGMENT_SHADER);
		} else if (shaderScript.type == "x-shader/x-vertex") {
			shader = this._gl.createShader(this._gl.VERTEX_SHADER);
		} else {
			throw "Invalid shader type: '" + shaderScript.type  + "' :-(";
		}

		this._gl.shaderSource(shader, str);
		this._gl.compileShader(shader);

		if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
			throw this._gl.getShaderInfoLog(shader);
		}

		return shader;
	};
	
	return webGLDrawer;
});