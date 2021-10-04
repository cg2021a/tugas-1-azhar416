function main(){
    /**
     * @type {HTMLCanvasElement} canvas
    */
    
    var canvas = document.getElementById("myCanvas");

    /**
     * @type {WebGLRenderingContext} gl
    */
    var gl = canvas.getContext("webgl");

    if(!gl) {
        console.log(`WebGL not supported, falling back on experimental`);
        gl = canvas.getContext("experimental-webgl");
    }

    if(!gl) {
        alert("Your browser does not support webgl");
    }
    
    var vertexShaderCode = `
    precision mediump float;
    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 v_Color;
    // uniform float dx;
    // uniform float dy;
    // uniform float dz;
    uniform mat4 translasi;

    void main(){
        v_Color = vertColor;
        // mat4 translasi = mat4(
        //     1.0, 0.0, 0.0, 0.0,
        //     0.0, 1.0, 0.0, 0.0,
        //     0.0, 0.0, 1.0, 0.0,
        //     dx, dy, dz, 1.0
        // );
      gl_Position = translasi * vec4(vertPosition, 0.0, 2.0);
    }`;

    var fragmentShaderCode = `
    precision mediump float;
    varying vec3 v_Color;
    void main(){
        gl_FragColor = vec4(0.5255, 0.5255, 0.5255, 1.0);
    }`;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderCode)
    gl.shaderSource(fragmentShader, fragmentShaderCode);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling vertex shader!' , gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling fragment shader!' , gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program! ', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("ERROR validating program!", gl.getProgramInfoLog(program));
        return;
    }

    var vertices = [], vertices2 = [],
        vertCount = 2;

    // benda 1
    for (var i=0.0; i<=720; i+=1) {
      // degrees to radians
      var j = i * Math.PI / 180;
      // X Y Z
        if (i<=360)
        {
            var vert1 = [
              Math.sin(j)*0.5,
              Math.cos(j)*0.5,
              // 0,
            ];
            var vert2 = [
              0,
              0,
              // 0,
            ];
            
        }
        else
        {
            var vert1 = [
                Math.sin(j)*0.20,
                Math.cos(j)*0.5,
                // 0,
              ];
              var vert2 = [
                0,
                0,
                // 0,
              ];
        }
        vertices = vertices.concat(vert1);
        vertices = vertices.concat(vert2);
    }
    var n = vertices.length / vertCount;

    let color = []

    for (let i = 0; i < n/2; i++) {
        let r = 1;
        let g = 1;
        let b = 1;
        for (let j = 0; j < 3; j++) {
            color.push(r);
            color.push(g);
            color.push(b);
            // color.push(0.124);
        }
    }

    var vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation, // attribut location
        vertCount, // number of elements per attribute
        gl.FLOAT, // type of elements
        gl.FALSE,
        0, // size of an individual vertex
        0 // offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    var colorBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttribLocation, // attribut location
        vertCount, // number of elements per attribute
        gl.FLOAT, // type of elements
        gl.FALSE,
        0, // size of an individual vertex
        0 // offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(colorAttribLocation);

    let dy = 0;
    let speed = 0.0037;

    function render()
    {
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if(dy>=0.72 || dy<=-0.74) {
            speed = speed * -1;
        }
         dy += speed;
         let translasiMatrix = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            -0.5, 0.0, 0.0, 1.0
        ]
    
        const translasi = gl.getUniformLocation(program, "translasi");
        gl.uniformMatrix4fv(translasi, false, translasiMatrix);
    
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
         translasiMatrix = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.5, dy, 0.0, 1.0
        ]
    
        gl.uniformMatrix4fv(translasi, false, translasiMatrix);
    
        gl.drawArrays(gl.TRIANGLE_STRIP, n/2 -1, n);

        requestAnimationFrame(render);
    }
    render();
}