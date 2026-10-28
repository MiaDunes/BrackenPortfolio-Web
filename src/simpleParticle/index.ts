import p5 from 'p5';

import { SimpleParticle } from './SimpleParticle';

export const sketch = (p: p5) => {
    // let x: number = 45;
    // let y: number =45;
    // const speedx: number = 1.5;
    // const speedy: number = 2.5;

    let part1:SimpleParticle;

    p.setup = () => {
        p.createCanvas(400, 400);
        // constructor(pos: p5.vector, radius:number,speed:p5.vector)
        part1 = new SimpleParticle(p, p.createVector(45,45), 125, p.createVector(2.5, 3.5));
    }

    p.draw = () => {
        p.background(220);
        // p.ellipse(x,y,80,50);
        // x += speedx;
        // y += speedy;
        part1.run();
        part1.draw();
    }
}

export const myp5 = new p5(sketch, document.getElementById("p5-sketch") ?? document.body);