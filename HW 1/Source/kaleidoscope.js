// ********************************************
// Assignment: Lab 1
// Name: Eric Breden
// NetID: ebrede2
//
// Instructions: 
// Use slider beneath the canvas to control the
// amount of triangles rendered to the screen
//
// ********************************************

var N = 1;
var angle_max;

window.onload = function init()
{
    // Initialize webGL environment
    var canvas = document.getElementById( "gl-canvas" );
    var gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
 
    // Initialize UI
    var slider = document.getElementById("tri_slider");
    var count_text = document.getElementById("tri count");
    slider.value = 1;
    count_text.innerText = "Triangle Count: " + slider.value;

    // Funtion to generate vertex and color data, then render to screen
    var generateAndRender = function() {
        // update displayed triangle count
        count_text.innerText = "Triangle Count: " + slider.value;
        N = slider.value;
        angle_max = 360 / (2 * N);

        // Fill buffers using generateData based on slider value
        // let num_verts = slider.value * 3;
        let vertices = [];
        let colors = [];
        vertices.push(vec2(0, -1), vec2(0, 1), vec2(-1, 0), vec2(1, 0));
        for (let i = 0; i < 4; i++) colors.push(vec3(0, 0, 0));
        generateData(vertices, colors);

        console.log(vertices);

        // Load vertex data into the GPU
        let vPositionBufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vPositionBufferId );
            gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
            var vPosition = gl.getAttribLocation( program, "vPosition" );
            gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vPosition );
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // Load color data into the GPU
        let vColorBufferId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vColorBufferId);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
            var vColor = gl.getAttribLocation(program, "vColor");
            gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vColor);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        render(gl, 2 * N * 3);
    }

    // Render initial scene and bind to slider input
    generateAndRender();
    slider.oninput = generateAndRender;
    // setInterval(generateAndRender, 30);
};

// Push a randomized position vec2 and color vec3 for each vertex
function generateData(vertices, colors) {
    let vals = []
    for (let i = 0; i < 3; i++) {
        let val = {
            r: Math.random(),
            a: Math.random() * angle_max
        }
        vals.push(val);
    }
    console.log(vals);
    console.log(angle_max);
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < 3; j++) {
            vertices.push(vec2(polarToRect(vals[j].r, 2 * i * angle_max + vals[j].a)));
            colors.push(vec3(Math.random()*.6 +.4, Math.random()*.5 +.5, Math.random()*.5+.5));
        }
        for (let j = 0; j < 3; j++) {
            vertices.push(vec2(polarToRect(vals[j].r, 2 * i * angle_max - vals[j].a)));
            colors.push(vec3(Math.random()*.6 +.4, Math.random()*.5 +.5, Math.random()*.5+.5));
        }
    }
    
}

function polarToRect(r, angle) {
    let x = r * Math.cos(angle * Math.PI / 180);
    let y = r * Math.sin(angle * Math.PI / 180);
    return vec2(x, y);
}

// Draw triangles to screen
function render(gl, num_verts) {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, 4);
    gl.drawArrays( gl.TRIANGLES, 4, num_verts);
}
