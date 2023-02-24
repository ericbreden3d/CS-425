/*********************************
Assignment 2: Merry Go 'Round
Author: Eric Breden
NetID: ebrede2
*********************************/

let scene_objs = []
let scene_playing = true;

let help_text_info ="- Move Forward/Back: W/D<br>- Rotate Left/Right: A/D<br>- Reset Camera: R<br>- Play/Pause: Space<br>- Help: H<br>- Quit: Q";
let help_hint = "For help, press H";
let help_displayed = false;

// init webGL, set input handlers, and begin scene
window.onload = function init() {
    [gl, program] = init_gl();

    let help_box = document.getElementById("help-box");
    let help_text = document.getElementById("help-text");
    help_text.innerHTML = help_hint;

    // initial view
    let eye = vec3(0, .7, 3);
    let at = vec3(0, 0, 0);
    let atDir = normalize(subtract(at, eye)); 
    let fDir = vec3(atDir[0], 0, atDir[2]);
    set_view(gl, program, eye, at);

    // input handler, uses move() and rotate() functions below for button presses
    // to update cam variables and pass to set_view()
    document.onkeydown = (e) => {
        if (e.key == "w" || e.key == "W") {
            [eye, at, atDir, fDir] = move(eye, at, atDir, fDir, 0.05);
        } else if (e.key == "s" || e.key == "S") {
            [eye, at, atDir, fDir] = move(eye, at, atDir, fDir, -0.05);
        } else if (e.key == "a" || e.key == "A") {
            [eye, at, atDir, fDir] = rotate(eye, at, atDir, fDir, 1.5);
        } else if (e.key == "d" || e.key == "D") {
            [eye, at, atDir, fDir] = rotate(eye, at, atDir, fDir, -1.5);
        } else if (e.key == "r" || e.key == "R") {
            eye = vec3(0, .7, 3);
            at = vec3(0, 0, 0);
            atDir = normalize(subtract(at, eye)); 
            fDir = vec3(atDir[0], 0, atDir[2]);
        } else if (e.key == "h" || e.key == "H" || e.key == "?") {
            help_displayed = help_displayed ? false : true;
            help_text.innerHTML = help_displayed ? help_text_info : help_hint;
            return;
        } else if (e.key == "q" || e.key == "Q") {
            if (scene_playing) {
                window.close();
            }
            return;
        } else if (e.key == " ") {
            if (!scene_playing) {
                scene_objs[0].play_animation(gl, program, mat4());
                scene_playing = true;
                return; 
            } else {
                clearInterval(scene_objs[0].interval_id);
                scene_playing = false;
            }
        }
        set_view(gl, program, eye, at);
    }

    // start scene
    generate_scene(gl, program);
 }
 
// pass default model xForm and render merry go round 
function generate_scene(gl, program) {
    let uModelXform = mat4();
    let uLoc_model = gl.getUniformLocation(program, "uModelXform");
    gl.uniformMatrix4fv(uLoc_model, false, flatten(uModelXform));
    
    // render merry go round
    let mgr = new MerryGoRound(gl, 6);
    scene_objs.push(mgr);
    mgr.play_animation(gl, program, mat4());

    // let mgrs = [];
    // for (let i = 0; i < 8; i++) {
    //     mgrs.push(new MerryGoRound(gl, 6));
    // }

    // setInterval(() => {
    //     let uCombinedXform = rotateY(new Date().getTime() * 0.075);
    //     let ind = 0;
    //     for (let x = 0; x < 20; x+=3) {
    //         for (let z = 20; z >= 0; z-=3) {
    //             let trans = translate(x, 0, z - 20);
    //             mgrs[ind++].render(gl, program, mult(trans, uCombinedXform));
    //         }
    //     }

    // }, 50);
}

// update view transform uniform variable
function set_view(gl, program, eye, at) {
    let uViewXform = lookAt(eye, at, vec3( 0, 1, 0 ));
    let uLoc_view = gl.getUniformLocation(program, "uViewXform");
    gl.uniformMatrix4fv(uLoc_view, false, flatten(uViewXform));
}

// initialize and configure webGL as well as perspective transform
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
	gl.clearColor( 0.9, 0.9, 0.9, 1.0 );
	
	// Load the shaders, create a GLSL program, and use it.
	let program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

    // set perspective uniform matrix
    let uProjXform = perspective( 60, aspectRatio, 0.1, 10.0 );
	let uLoc_proj = gl.getUniformLocation( program, "uProjection" );
	gl.uniformMatrix4fv( uLoc_proj, false, flatten( uProjXform ) );

    return [gl ,program];
}

// returns recalculated cam values for move forward/backward operation
function move(eye, at, atDir, fDir, amount) {
    eye = add(eye, scale(amount, fDir));
    at = add(eye, atDir);
    atDir = normalize(subtract(at, eye)); 
    fDir = vec3(atDir[0], 0, atDir[2]);
    return [eye, at, atDir, fDir];
}

// returns recalculated cam values for move rotate operation
function rotate(eye, at, atDir, fDir, amount) {
    atDir = normalize(subtract(at, eye));
    atDir.push(0);
    atMat = mat4(
        vec4(atDir[0], 0, 0, 0), 
        vec4(atDir[1], 0, 0, 0), 
        vec4(atDir[2], 0, 0, 0), 
        vec4(0, 0, 0, 0)
    );
    atMat = mult(rotateY(amount), atMat);
    atDir = vec3(atMat[0][0], atMat[1][0], atMat[2][0]);
    fDir = vec3(atDir[0], 0, atDir[2]);
    at = add(eye, atDir);
    return [eye, at, atDir, fDir];
}