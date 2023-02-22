/* coneClass.js
	
	Written by John Bell for CS 425, Fall 2020
    
    This file contains code to create and draw a unit cone, centered at the origin.
    
*/

// Globals are evil.  We won't use any here. :-)

class Horse { 
	constructor(gl, xForm = mat4()) {
		this.objs = [
			new TruncatedCone(gl, 16, 1, 0),
			new TruncatedCone(gl, 16, 0.8, 0),
			new TruncatedCone(gl, 16, 1.9, 0),
			new TruncatedCone(gl, 16, 2, 0),
		]		
	}
	
	render( gl, program, uParentXform ) {
		// body
		let uLocalXform = mult( rotateX(-82), scalem(0.1, .5, 0.1));
		let uCombinedXform = mult(uParentXform, uLocalXform);
		this.objs[0].render(gl, program, uCombinedXform);

		// head
		uLocalXform = mult(translate(0, .18, -0.34), mult(rotateX(-110), scalem(0.1, .25, 0.1)));
		uCombinedXform = mult(uParentXform, uLocalXform);
		this.objs[1].render(gl, program, uCombinedXform);

		// front leg
		uLocalXform = mult(translate(0, -.15, -.17), mult(rotateX(-5), scalem(0.02, .2, 0.02)));
		uCombinedXform = mult(uParentXform, uLocalXform);
		this.objs[2].render(gl, program, uCombinedXform);

		// back leg
		uLocalXform = mult(translate(0, -.17, 0.17), mult(rotateX(5), scalem(0.02, .2, 0.02)));
		uCombinedXform = mult(uParentXform, uLocalXform);
		this.objs[3].render(gl, program, uCombinedXform);
	}

} // class Cone