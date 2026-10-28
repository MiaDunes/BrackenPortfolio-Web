import { BaseParticle } from "../libMia/BaseParticle";
import p5 from 'p5';

export class complexParticle extends BaseParticle{
   


    constructor(p:p5, pos: p5.Vector, radius:number,speed:p5.Vector) {
      super(p, pos, radius, speed );

    }



    draw(): void {
        this.p.rect(this.pos.x, this.pos.y, this.radius, this.radius);

    }

}