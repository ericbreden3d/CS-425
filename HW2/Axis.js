class Axis {
    constructor(gl) {
        let points = [
            vec3(0, 0, 0),
            vec3(1, 0, 0),
            vec3(0, 0, 0),
            vec3(0, 1, 0),
            vec3(0, 0, 0),
            vec3(0, 0, 1)
        ];
        let colors = [
            vec3(1, 0, 0),
            vec3(1, 0, 0),
            vec3(0, 1, 0),
            vec3(0, 1, 0),
            vec3(0, 0, 0),
            vec3(0, 0, 1),
        ];

        this.vBufferID_pos = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferID_pos);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.vBufferID_col = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferID_col);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

    }

    render(gl, program) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferID_pos);
            let vLoc_pos = gl.getAttribLocation(program, "vPosition");
            gl.vertexAttribPointer(vLoc_pos, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vLoc_pos);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferID_col);
            let vLoc_col = gl.getAttribLocation(program, "vColor");
            gl.vertexAttribPointer(vLoc_col, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vLoc_col);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.drawArrays(gl.LINES, 0, 6);
    }
}