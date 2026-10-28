

import p5 from 'p5';

import { complexParticle } from './complexParticle';

export const sketch = (p: p5) => {
    

    let part1:complexParticle;

    let num = 60;
    let range = 20;
  
    let bx: number[] = [];
    let by: number[] = [];
  
    p.setup = () => {
      p.createCanvas(800, 400);
  
      p.background(p.random(255), p.random(255), p.random(255));
  
      for (let i = 0; i < num; i++) {
        bx[i] = p.width / 2;
        by[i] = p.width / 4;
      }
  
      p.frameRate(p.random(20, 50));
    };
  
    p.draw = () => {
  
      // shift positions (trail effect)
      for (let i = 1; i < num; i++) {
        bx[i - 1] = bx[i];
        by[i - 1] = by[i];
      }
  
      // move last point randomly
      bx[num - 1] += p.random(-range, range);
      by[num - 1] += p.random(-range, range);
  
      // constrain to canvas
      bx[num - 1] = p.constrain(bx[num - 1], 0, p.width);
      by[num - 1] = p.constrain(by[num - 1], 5, p.height);
  
      // draw lines
      for (let i = 1; i < num; i++) {
        p.stroke(
          p.random(150, 255),
          p.random(0, 100),
          p.random(50, 255)
        );
        p.line(bx[i - 1], by[i - 1], bx[i], by[i]);
      }
    };
  };
  
  export const myp5 = new p5(sketch, document.getElementById("p5-sketch") ?? document.body);


//     p.setup = () => {
//         p.createCanvas(400, 400);
//         // constructor(pos: p5.vector, radius:number,speed:p5.vector)
//         part1 = new complexParticle(p, p.createVector(45,45), 125, p.createVector(2.5, 3.5));
//     }


//     p.draw = () => {
//         p.background(220);
//         part1.move();
//         // part1.run();
//         part1.draw();
//     }
// }

// export const myp5 = new p5(sketch, document.getElementById("p5-sketch") ?? document.body);


// let num = 60;      // number of points (you can adjust)
// let range = 20;    // movement range

// let bx = [];
// let by = [];

// function setup() {
//   createCanvas(800, 300);
//   background(random(255), random(255), random(255));

//   for (let i = 0; i < num; i++) {
//     bx[i] = width / 2;
//     by[i] = width / 4;
//   }

//   frameRate(random(20, 50));
// }

// function draw() {
//   // background(200);

//   // shift positions (like a trail)
//   for (let i = 1; i < num; i++) {
//     bx[i - 1] = bx[i];
//     by[i - 1] = by[i];
//   }

//   // move last point randomly
//   bx[num - 1] += random(-range, range);
//   by[num - 1] += random(-range, range);

//   // constrain to canvas
//   bx[num - 1] = constrain(bx[num - 1], 0, width);
//   by[num - 1] = constrain(by[num - 1], 5, height);

//   // draw lines
//   for (let i = 1; i < num; i++) {
//     stroke(random(150, 55), random(0, 100), random(50, 255));
//     line(bx[i - 1], by[i - 1], bx[i], by[i]);
//   }
// }