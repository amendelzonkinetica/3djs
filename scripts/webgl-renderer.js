define(['glmatrix', 'lib/matrixStack'], function(GLMatrix, MatrixStack) {
	var webGLRenderer = function(canvas, shaders) {
		this._canvas = canvas;
		this._shaders = shaders;
		this._camera = null;
		this._matrixStack = new MatrixStack();
		this._initGL();
		this._shaderProgram = this._initShaderProgram();
	};
	
	webGLRenderer.prototype.setCamera = function(camera) {
		this._camera = camera;
	};
	
	webGLRenderer.prototype.renderScene = function(scene) {
		// Scene-rendering routine
		this._gl.viewport(0, 0, this._gl.viewportWidth, this._gl.viewportHeight);
		this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
		
		// Render each object
		var objects = scene.getObjects();
		var object;
		for (var oi in objects) {
			if (objects.hasOwnProperty(oi)) {
				object = objects[oi];
				object.render(this);
			}
		}
	};
	
	webGLRenderer.prototype.renderComplex = function(complex) {
		var mvMatrix;
		if (!this._matrixStack.isPopable()) {
			// Model-view matrix
			mvMatrix = mat4.create();
			mat4.identity(mvMatrix);
			// Push
			this._matrixStack.push(mvMatrix);
		}
		
		mvMatrix = this._matrixStack.pop();
		
		// Apply complex transformation
		mat4.multiply(complex.getTransformation(), mvMatrix, mvMatrix);
		
		this._matrixStack.push(mvMatrix);
		
		// Render each object
		var objects = complex.getObjects();
		var object;
		for (var oi in objects) {
			if (objects.hasOwnProperty(oi)) {
				object = objects[oi];
				object.render(this);
			}
		}
		
		this._matrixStack.pop();
	};
	
	webGLRenderer.prototype.renderTriangle = function(triangle) {
		// Apply current model view transformation
		var mvMatrix = this._matrixStack.pop();
		this._matrixStack.push(mvMatrix);
		
		// Apply camera transformation before actually rendering
		if (!this._camera) {
			throw "No camera set :-(";
		}
		
		mat4.multiply(this._camera.getTransformation(), mvMatrix, mvMatrix);
		
		// Perspective
		var pMatrix = mat4.create();
		mat4.perspective(45, this._gl.viewportWidth / this._gl.viewportHeight, 0.1, 100.0, pMatrix);
		
		// Pass in  matrixes to shaders
		this._gl.uniformMatrix4fv(this._shaderProgram.pMatrixUniform, false, pMatrix);
		this._gl.uniformMatrix4fv(this._shaderProgram.mvMatrixUniform, false, mvMatrix);
		
		// Vertexes
		var v = triangle.getVertexes();
		var triangleVertexPositionBuffer = this._createVertexPositionBuffer([
			v[0][0], v[0][1], v[0][2],
            v[1][0], v[1][1], v[1][2],
			v[2][0], v[2][1], v[2][2]
		]);
		
		// Colors
		var c = triangle.getColors();
		var triangleVertexColorBuffer = this._createVertexColorBuffer([
			c[0][0], c[0][1], c[0][2], c[0][3],
            c[1][0], c[1][1], c[1][2], c[1][3],
			c[2][0], c[2][1], c[2][2], c[2][3]
		]);
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
		this._gl.vertexAttribPointer(this._shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, this._gl.FLOAT, false, 0, 0);
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, triangleVertexColorBuffer);
		this._gl.vertexAttribPointer(this._shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, this._gl.FLOAT, false, 0, 0);
		this._gl.drawArrays(this._gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
	};
	
	webGLRenderer.prototype._createVertexPositionBuffer = function(values) { return this._createBuffer(values, 3); };
	
	webGLRenderer.prototype._createVertexColorBuffer = function(values) { return this._createBuffer(values, 4); };
	
	webGLRenderer.prototype._createBuffer = function(values, itemSize) {
		var result = this._gl.createBuffer();
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, result);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(values), this._gl.STATIC_DRAW);
		result.itemSize = itemSize;
		result.numItems = values.length / itemSize;
		return result;
	};
	
	webGLRenderer.prototype._initGL = function() {
		try {
			var canvas = document.getElementById(this._canvas);
			if (!canvas) {
				throw "Invalid canvas :-(";
			}
			this._gl = canvas.getContext("experimental-webgl");
			this._gl.viewportWidth = canvas.width;
			this._gl.viewportHeight = canvas.height;
			this._gl.enable(this._gl.DEPTH_TEST);
			
		} catch(e) { }
		
		if (!this._gl) {
			throw new "Could not initialise WebGL, sorry :-( ";
		}
	};
	
	webGLRenderer.prototype._initShaderProgram = function() {
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
	
	webGLRenderer.prototype._getShader = function(which) {
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
	
	return webGLRenderer;
});