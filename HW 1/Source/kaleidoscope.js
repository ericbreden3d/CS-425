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

// TODO add instructions to screen

var init_N = 20;
var rot_speed = 0.1;
var layers = 1;
var clamp_low = 0.1;
var clamp_hi = 0.6;

var init_vals = [];
var colors = [];
var vertices = [];

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
    slider.value = init_N;
    count_text.innerText = "N: " + slider.value;
    
    // Funtion to generate vertex and color data, then render to screen
    var generateAndRender = function(N) {
        // update displayed triangle count
        count_text.innerText = "N: " + N;
        // N = slider.value;
        let angle_max = 360 / (2 * N);

        // Fill buffers using generateData based on slider value
        // let num_verts = slider.value * 3;
        let vertices = [];

        // push verts for coordinate axis lines
        vertices.push(vec2(0, -1), vec2(0, 1), vec2(-1, 0), vec2(1, 0));

        // 
        generateData(vertices, colors, N, angle_max);

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

        render(gl, 2 * N * layer * 3);
    }

    // Render initial scene and bind to slider input
    for (let i = 0; i < 4; i++) colors.push(vec3(0, 0, 0));
    generateAndRender(slider.value);
    slider.oninput = () => {
        init_vals = [];
        colors = [];
        for (let i = 0; i < 4; i++) colors.push(vec3(0, 0, 0));
        generateAndRender(slider.value);
    }
    setInterval(() => {
        generateAndRender(parseInt(slider.value));
    }, 8);
};

// Push a randomized position vec2 and color vec3 for each vertex
function generateData(vertices, colors, N, angle_max) {
    if (init_vals.length != 3) {
        for (let l = 0; l < layers; l++) {
            for (let i = 0; i < 3; i++) {
                let val = {
                    r: Math.random() * (clamp_hi - clamp_low) + clamp_low,
                    a: Math.random() * (angle_max)
                }
                init_vals.push(val);
            }
        }
    } else {
        for (let i = 0; i < 3; i++) {
            init_vals[i].a += rot_speed;
        }
    }
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < 3; j++) {
            vertices.push(vec2(polarToRect(init_vals[j].r, 2 * i * angle_max + init_vals[j].a)));
            if (colors.length <= 2 * N * 3 * layer + 4)
                colors.push(vec3(Math.random()*.6 +.4, Math.random()*.5 +.5, Math.random()*.5+.5));
        }
        for (let j = 0; j < 3; j++) {
            vertices.push(vec2(polarToRect(init_vals[j].r, 2 * i * angle_max - init_vals[j].a)));
            if (colors.length <= 2 * N * 3 * layer + 4)
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
