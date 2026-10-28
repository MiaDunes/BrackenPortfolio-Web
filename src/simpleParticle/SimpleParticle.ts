// import { BaseParticle } from "../libMia/BaseParticle";

import p5 from 'p5';

export class SimpleParticle {
    // class fiels
    p: p5;
    pos: p5.Vector;
    radius: number;
    speed: p5.Vector;


    constructor(p:p5, pos: p5.Vector, radius:number,speed:p5.Vector) {
    //   super();
      this.p = p;
      this.pos = pos;
      this.radius = radius;
      this.speed = speed;

    //   console.log("in subclass, woo hoo");  
    }

    run(): void{
        this.pos.add(this.speed);
    }

    draw(): void {
        this.p.ellipse(this.pos.x, this.pos.y, this.radius, this.radius);

    }

}