
class TruncatedCone { 

	constructor( gl, nSectors, ratio, color ) {
		
		this.nSectors = nSectors;
		
		var points = [ ];	// Vertex location data 
		var colors = [ ];	// Vertex color data
				
		var validColor = false;
		
		if ( Array.isArray( color ) && color.length == 3 
			&& color[0] >= 0 && color[1] >= 0 && color[2] >=0
			&& color[0] <= 1 && color[1] <= 1 && color[2] <=1 ) {
			
			validColor = true;
																 
		}
	
		for( var i = 0; i < this.nSectors + 1; i++ ) {
			if( validColor ) {
				colors.push(vec3(color));
				colors.push(vec3(color));
			} else {
				colors.push(vec3(Math.random(), Math.random(), Math.random()));
				colors.push(vec3(Math.random(), Math.random(), Math.random()));
			}
		}

		for( let i = 0; i < this.nSectors + 1; i++ ) {
			let radians = 2 * Math.PI / this.nSectors * i;
			let x = Math.cos(radians);
			let y = Math.sin(radians);
			points.push(vec3(ratio * x, .5, ratio * y));
			points.push(vec3(x, -.5, y));
		}


		// fill top/bottom faces
		points.push(vec3(0, .5, 0));
		colors.push(vec3(Math.random(), Math.random(), Math.random()));
		for (let i = 0; i < this.nSectors + 1; i++) {
			let radians = 2 * Math.PI / this.nSectors * i;
			let x = Math.cos(radians);
			let y = Math.sin(radians);
			points.push(vec3(ratio * x, .5, ratio * y));
			colors.push(vec3(Math.random(), Math.random(), Math.random()));
		}

		points.push(vec3(0, -.5, 0));
		colors.push(vec3(Math.random(), Math.random(), Math.random()));
		for (let i = 0; i < this.nSectors + 1; i++) {
			let radians = 2 * Math.PI / this.nSectors * i;
			let x = Math.cos(radians);
			let y = Math.sin(radians);
			points.push(vec3(x, -.5, y));
			colors.push(vec3(Math.random(), Math.random(), Math.random()));
		}

        // push to GPU
		this.vbufferID = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vbufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( points ), gl.STATIC_DRAW );
		
		this.cbufferID = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.cbufferID);
		gl.bufferData(gl.ARRAY_BUFFER, flatten( colors ), gl.STATIC_DRAW);
	
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
		
		return;
	
	}
	
	render( gl, program, uParentXform ) {
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vbufferID );
		var vPosition = gl.getAttribLocation( program, "vPosition" );
		gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vPosition );
	
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.cbufferID);
		let vColor = gl.getAttribLocation(program, "vColor");
		gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray( vColor );
				
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
			
        //  use transform passed from parent
        let uLoc_model = gl.getUniformLocation(program, "uModelXform");
		gl.uniformMatrix4fv(uLoc_model, false, flatten(uParentXform));
		
        // buffer offsets
        let cone_size = this.nSectors * 2 + 2;
		let face_size = this.nSectors + 2;

        // bottom
        gl.drawArrays(gl.TRIANGLE_FAN, cone_size + face_size, face_size);
		// cone
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, cone_size);	// Sides
		// top
        gl.drawArrays(gl.TRIANGLE_FAN, cone_size, face_size);
		
        
		
        
        // TODO later - Draw the bottom.  Could possibly make this controlled by an extra passed parameter.
		
	} // renderCone( )

} // class Cone