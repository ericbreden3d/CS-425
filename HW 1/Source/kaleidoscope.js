// ********************************************
// Assignment: HW 1 Kaleidoscope
// Name: Eric Breden
// NetID: ebrede2
// ********************************************

var init_N = 4;
var rot_speed = 0.1;
var angle_mult = 1;
var color_speed = 0.00155;

var gl;
var program
var init_vals = [];
var colors = [];
var vertices = [];
var cur_col_offset = 0;

window.onload = function init()
{
    // Initialize webGL environment
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0,0.08,0.08, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
 
    // Initialize UI
    var slider = document.getElementById("tri_slider");
    var count_text = document.getElementById("tri count");
    var l_slider = document.getElementById("layer_slider");
    var l_text = document.getElementById("layer count");
    var ang_slider = document.getElementById("angle_slider");
    var ang_text = document.getElementById("angle mult");
    slider.value = init_N;
    count_text.innerText = "N: " + slider.value;
    l_slider.value = 1;
    l_text.innerText = "Layers: " + l_slider.value;
    ang_slider.value = 1;
    ang_text.innerText = "Angle Mult: " + ang_slider.value;

    // Render initial scene and bind to slider input
    for (let i = 0; i < 4; i++) colors.push(vec3(0, 0, 0));
    generateAndRender(slider.value, l_slider.value);

    // slider functionality
    slider.oninput = () => {
        count_text.innerText = "N: " + slider.value;
        init_vals = [];
        colors = [];
        for (let i = 0; i < 4; i++) colors.push(vec3(0, 0, 0));
        generateAndRender(slider.value, l_slider.value);
    }
    l_slider.oninput = () => {
        l_text.innerText = "Layers: " + l_slider.value;
        init_vals = [];
        colors = [];
        for (let i = 0; i < 4; i++) colors.push(vec3(0, 0, 0));
        generateAndRender(slider.value, l_slider.value);
    }
    ang_slider.oninput = () => {
        ang_text.innerText = "Angle Mult: " + ang_slider.value;
        init_vals = [];
        colors = [];
        for (let i = 0; i < 4; i++) colors.push(vec3(0, 0, 0));
        generateAndRender(slider.value, l_slider.value, ang_slider);
    }

    // generate and render new animation frame every 10 ms
    setInterval(() => {
        generateAndRender(slider.value, l_slider.value);
    }, 10);
};


// Funtion to generate vertex and color data, then render to screen
var generateAndRender = function(N, layers) {
    let angle_max = 360 / (2 * N);

    // Fill buffers using generateData based on slider value
    let vertices = [];

    // push verts for coordinate axis lines
    vertices.push(vec2(0, -1), vec2(0, 1), vec2(-1, 0), vec2(1, 0));

    // generate initial data and animate on subsequent calls
    generateData(vertices, colors, N, angle_max,layers);

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

    // pass color offset as uniform
    var uColorOffset = gl.getUniformLocation(program, "uColorOffset");
    cur_col_offset = gl.getUniform(program, uColorOffset);
    if (cur_col_offset > 1 || cur_col_offset < 0) {
        color_speed = -color_speed;
    }
    gl.uniform1f(uColorOffset, cur_col_offset + color_speed);

    render(2 * N * layers * 3);
}


// Generate kaleidoscope vertex and color data
function generateData(vertices, colors, N, angle_max, layers) {
    // generate initial randomized radius and angle values for vertices.
    // if no parameter change, then animate rotation
    let l_size = 1 / layers;
    if (init_vals.length != 3 * layers) {
        for (let l = 0; l < layers; l++) {
            let bound_lo = l * l_size;
            let bound_hi = (l + 1) * l_size; 
            for (let i = 0; i < 3; i++) {
                let val = {
                    r: Math.random() * (bound_hi - bound_lo) + bound_lo,
                    a: Math.random() * (angle_max) * angle_mult
                }
                init_vals.push(val);
            }
        }
    } else {
        for (let i = 0; i < 3 * layers; i++) {
            init_vals[i].a += rot_speed;
        }
    }

    // convert to rectangular coordinates and push initial and mirrored
    // vertices and randomized vertex colors
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < 3 * layers; j++) {
            vertices.push(vec2(polarToRect(init_vals[j].r, 2 * i * angle_max + init_vals[j].a)));
            if (colors.length <= 2 * N * 3 * layers + 4)
                colors.push(vec3(Math.random()*.7 +.3, Math.random()*.7 +.3, Math.random()*.7+.3));
        }
        for (let j = 0; j < 3 * layers; j++) {
            vertices.push(polarToRect(init_vals[j].r, 2 * (i + 1) * angle_max - init_vals[j].a));
            if (colors.length <= 2 * N * 3 * layers + 4)
                colors.push(vec3(Math.random()*.7 +.3, Math.random()*.7 +.3, Math.random()*.7+.3));
        }
    }
}

function polarToRect(r, angle) {
    let x = r * Math.cos(angle * Math.PI / 180);
    let y = r * Math.sin(angle * Math.PI / 180);
    return vec2(x, y);
}

// Draw triangles to screen
function render(num_verts) {
    gl.clear( gl.COLOR_BUFFER_BIT );
    // gl.drawArrays( gl.LINES, 0, 4);  // draw xy axis for debug
    gl.drawArrays( gl.TRIANGLES, 4, num_verts);
}
