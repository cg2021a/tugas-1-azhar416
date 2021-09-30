function main(){
    /**
    * @type {HTMLCanvasElement} canvas
    */
    const canvas = document.getElementById('myCanvas');
    
    /**
    * @type {WebGLRenderingContext} gl
    */
    const gl = canvas.getContext('webgl');
 
    var positionBuffer = gl.createBuffer(),
        vertices = [],
        vertCount = 2;
    
    for (var i = 0.0; i <= 360; i += 1) 
    {
        // degrees to radians
        var j = i * Math.PI / 180;
        // X Y Z
        var vert1 = [
            (Math.sin(j)*0.25),
            (Math.cos(j)*0.25),
            // 0,
        ];
        var vert2 = [
            (Math.sin(j)*0.0),
            (Math.cos(j)*0.0),
            // 0,
        ];
        vertices = vertices.concat(vert1);
        vertices = vertices.concat(vert2);
    }

    var n = vertices.length / vertCount;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var vertexShaderCode = `
    attribute vec4 a_Position;
    void main(){
        gl_Position = a_Position;
    }`;
 
    //var vertexShaderCode = document.getElementById("vertexShaderCode").text;

    //membuat vertex 
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);
 
    var fragmentShaderCode = document.getElementById("fragmentShaderCode").text;
 
    //membuat warna
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);
 
    //membuat package program agar data bisa dieksekusi
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
 
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var aPosition = gl.getAttribLocation(shaderProgram, "a_Position");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
 
    //mendefinisikan background
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
 }