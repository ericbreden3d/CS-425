window.onload = function init() {
    [gl, program] = init_gl();

    generate_scene(gl, program);
 }
 

function generate_scene(gl, program) {
    console.log(typeof(vec2()))
    
    // model transform
    let uModelXform = mat4();s
    let uLoc_model = gl.getUniformLocation(program, "uModelXform");
    gl.uniformMatrix4fv(uLoc_model, false, flatten(uModelXform));
    
    let eye = vec3(0, .7, 3);
    let at = vec3(0, 0, 0);

    // initial view
    set_view(gl, program, eye, at);

    // input handler
    document.onkeydown = (e) => {
        let atDir = normalize(subtract(at, eye)); 
        let fDir = vec3(atDir[0], 0, atDir[2]);
        if (e.key == "w" || e.key == "W") {
            let atDir = normalize(subtract(at, eye)); 
            let fDir = vec3(atDir[0], 0, atDir[2]);
            atDir[1] = 0;
            eye = add(eye, scale(0.02, fDir));
            at = add(eye, atDir);
            console.log(eye, at);
            set_view(gl, program, eye, at);
        } else if (e.key == "s" || e.key == "S") {
            atDir[1] = 0;
            eye = subtract(eye, scale(0.02, fDir));
            at = add(eye, atDir);
            console.log(eye, at);
            set_view(gl, program, eye, at);
        } else if (e.key == "a" || e.key == "A") {

        } else if (e.key == "d" || e.key == "D") {

        }

    }
    
    // render merry go round
    let mgr = new MerryGoRound(gl, 6);
    mgr.play_animation(gl, program, translate(0, 0, 0));
}

function set_view(gl, program, eye, at) {
    // view transform
    let uViewXform = lookAt(eye, at, vec3( 0, 1, 0 ));
    let uLoc_view = gl.getUniformLocation(program, "uViewXform");
    gl.uniformMatrix4fv(uLoc_view, false, flatten(uViewXform));
}

function init_gl() {
    // init canvas 
    let canvas = document.getElementById( "gl-canvas" );
	let gl=WebGLUtils.setupWebGL( canvas );
	if( !gl ) {
		alert( "No WebGL" );
	}

    // gl config
    gl.enable(gl.DEPTH_TEST)
    gl.viewport( 0, 0, canvas.width, canvas.height );
	aspectRatio = canvas.width / canvas.height ;
	gl.clearColor( 0.95, 0.95, 0.95, 1.0 );
	
	// Load the shaders, create a GLSL program, and use it.
	let program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

    // set perspective uniform matrix
    let uProjXform = perspective( 60, aspectRatio, 0.1, 10.0 );
	let uLoc_proj = gl.getUniformLocation( program, "uProjection" );
	gl.uniformMatrix4fv( uLoc_proj, false, flatten( uProjXform ) );

    return [gl ,program];
}