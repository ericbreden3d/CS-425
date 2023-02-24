/*********************************
Assignment 2: Merry Go 'Round
Author: Eric Breden
NetID: ebrede2
*********************************/

class MerryGoRound {
    constructor(gl, numHorses) {
        this.numHorses = numHorses;
        this.horse = new Horse(gl);
        this.top = [
            new TruncatedCone(gl, 16, 0.7, 0),
            new TruncatedCone(gl, 16, 0, 0)
        ]
        this.cylinder = new TruncatedCone(gl, 16, 1, 0);
        this.time = 0;
    }

    // starts animation
    play_animation(gl, program, translation) {
        this.interval_id = setInterval(() => {
            gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

            // calculate rotation and outer translation and pass to render() 
            let uCombinedXform = mult(translation, rotateY(this.time += 2));
            this.render(gl, program, uCombinedXform);
        }, 50)
    }

    render(gl, program, uParentXform) {
        // render top pieces
        let uLocalXform = mult(translate(0, 0.85, 0), scalem(1, 0.2, 1));
        let uCombinedXform = mult(uParentXform, uLocalXform);
        this.top[0].render(gl, program, uCombinedXform);

        uLocalXform = mult(translate(0, 1.05, 0), scalem(.7, 0.2, .7));
        uCombinedXform = mult(uParentXform, uLocalXform);
        this.top[1].render(gl, program, uCombinedXform);

        // render bottom
        uLocalXform = mult(translate(0, -.25, 0), scalem(1.1, 0.12, 1.1));
        uCombinedXform = mult(uParentXform, uLocalXform);
        this.cylinder.render(gl, program, uCombinedXform);

        // render pole
        uLocalXform = mult(translate(0, 0.3, 0), scalem(0.03, 1, 0.03));
        uCombinedXform = mult(uParentXform, uLocalXform);
        this.cylinder.render(gl, program, uCombinedXform);

        // render horses
        for (let i = 0; i < this.numHorses; i++) {
            let radians = 2 * Math.PI / this.numHorses * i;
			let x = Math.cos(radians);
			let y = Math.sin(radians);
            let degrees = radians * 180 / Math.PI;

            // calculate height using time and sine
            // offset by i to make "wave" and invert every other
            let hOffset = Math.sin(this.time * 0.075 + i) * 0.15;
            if (i % 2 == 1) {
                hOffset *= -1;
            }

            // combine parent and relative horse location transform then render horse
            uLocalXform = mult(translate(0.8 * x, hOffset + .25, 0.8 * y), mult(rotateY(-degrees), scalem(Array(3).fill(0.5))));
            uCombinedXform = mult(uParentXform, uLocalXform);
            this.horse.render(gl, program, uCombinedXform);

            // render horse pole
            uLocalXform = mult(translate(0.8 * x, 0.25, 0.8 * y), scalem(0.015, 1.1, 0.015));
            uCombinedXform = mult(uParentXform, uLocalXform);
            this.cylinder.render(gl, program, uCombinedXform);
        }
    }
}