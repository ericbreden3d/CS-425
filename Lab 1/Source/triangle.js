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
    slider.value = 10
    count_text.innerText = "Triangle Count: " + slider.value;
    
    // Funtion to generate vertex and color data, then render to screen
    var generateAndRender = function() {
        // update displayed triangle count
        count_text.innerText = "Triangle Count: " + slider.value;

        // Fill buffers using generateData based on slider value
        let num_verts = slider.value * 3;
        let vertices = [];
        let colors = [];
        generateData(vertices, colors, num_verts); 

        // Load vertex data into the GPU
        let vPositionBufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vPositionBufferId );
            gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
            var vPosition = gl.getAttribLocation( program, "vPosition" );
            gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vPosition );
        // gl.bindBuffer(gl.ARRAY_BUFFER, NULL);

        // Load color data into the GPU
        let vColorBufferId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vColorBufferId);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
            var vColor = gl.getAttribLocation(program, "vColor");
            gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vColor);
        // gl.bindBuffer(gl.ARRAY_BUFFER, NULL);

        render(gl, num_verts);
    }

    // Render initial scene and bind to slider input
    generateAndRender();
    slider.oninput = generateAndRender;
};

// Push a randomized position vec2 and color vec3 for each vertex
function generateData(vertices, colors, num_verts) {
    for (let i = 0; i < num_verts; i++) {
        vertices.push(vec2(Math.random() * 2 - 1, Math.random() * 2 - 1));
        colors.push(vec3(Math.random(), Math.random(), Math.random()));
    }
}

// Draw triangles to screen
function render(gl, num_verts) {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, num_verts );
}
