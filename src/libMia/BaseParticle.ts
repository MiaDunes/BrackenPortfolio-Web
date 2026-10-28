import p5 from 'p5';

export class BaseParticle{
    // class fiels
    p: p5;
    pos: p5.Vector;
    radius: number;
    speed: p5.Vector;

    constructor(p:p5, pos: p5.Vector, radius:number,speed:p5.Vector) {
        this.p = p;
      this.pos = pos;
      this.radius = radius;
      this.speed = speed;

        // console.log("in superclass, woo hoo");
    }

    move(): void{
      this.pos.add(this.speed);
    }

    draw(): void {
      this.p.rect(this.pos.x, this.pos.y, this.radius, this.radius);

  }

}