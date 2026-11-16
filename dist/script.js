
// Footer year (all pages)
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Canvas1 (gallery page only)
const canvas = document.getElementById("canvas");
if (canvas) {
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;


/* Lightweight smooth pseudo-noise */
const noise = (x, y) => {
  return (Math.sin(x * 0.01) + Math.cos(y * 0.01)) * 0.5;
};


class FlowField {
  constructor(scale = 50) {
    this.scale = scale;
    this.cols = Math.floor(canvas.width / scale);
    this.rows = Math.floor(canvas.height / scale);
  }

  getAngle(x, y) {
    return noise(x, y) * Math.PI * 2;
  }
}

class Particle {
  constructor(flowField) {
    this.flowField = flowField;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.speed = 0.3;
  }

  update() {
    const angle = this.flowField.getAngle(this.x, this.y);

    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;

    // Wrap around edges
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }

  draw() {
    //ctx.fillStyle = "rgba(0,255,25,5)";
    const colors = [
        "rgba(0, 224,120,6)",
        "rgba(225, 29, 147,6)"
    ];
    ctx.fillStyle = colors[Math.floor(Math.random()* colors.length)];
    ctx.fillRect(this.x, this.y, 2, 2);
  }
}


const flowField = new FlowField(40);
const particles = [];

for (let i = 0; i < 4000; i++) {
  particles.push(new Particle(flowField));
}

// Loop
function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.09)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

animate();
}




//Canvas2 (gallery page only)
window.onload = function () {
 
  var canvas = document.getElementById("mycanvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var w = canvas.width;
  var h = canvas.height;

  var time = 0;
  var shapes = [];

  //particles"
  for (var i = 0; i < 80; i++) {
  shapes.push({
  x: Math.random() * w,
  y: Math.random() * h,
  r: 5 + Math.random() * 20,
  speed: 0.5 + Math.random(),
   offset: Math.random() * Math.PI * 2
   });
}

  function drawBackground() {
  var grad = ctx.createRadialGradient(
  w / 2, h / 2, 50,
  w / 2, h / 2, w
  );
  grad.addColorStop(0, "rgb(255,200,220)");
  grad.addColorStop(1, "rgb(190,225,203)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  }

  function draw() {
  time += 0.01;

  drawBackground();

  for (var i = 0; i < shapes.length; i++) {
  var s = shapes[i];

  var dx = Math.cos(time + s.offset) * 20;
  var dy = Math.sin(time + s.offset) * 20;

  ctx.beginPath();
  ctx.fillStyle = "rgba(80, 120, 200, 0.6)";
  ctx.arc(s.x + dx, s.y + dy, s.r, 0, Math.PI * 2);
  ctx.fill();
  }

  requestAnimationFrame(draw);
}

draw();

};
// Canvas3 - Film26-27 chart (gallery page only)
if (document.getElementById("chart") && window.d3) {

d3.csv("Film26-27/Moviedata.csv")
.then(data => {
  console.log("CSV loaded successfully");
  console.table(data);
})
.catch(error => {
  console.error("CSV loading error:", error);
});

const margin = { top: 60, right: 80, bottom: 270, left: 190 };
const width = 1100 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("Film26-27/Moviedata.csv").then(data => {

    data.forEach(d => {
        d.AnticipationScore = +d.AnticipationScore;
        d.SocialBuzz = +d.SocialBuzz;
    });

    // X Scale
    const x = d3.scalePoint()
        .domain(data.map(d => d.Movie))
        .range([0, width]);

    // Y Scale
    const y = d3.scaleLinear()
        .domain([60, 100])
        .range([height, 0]);

    // Axes
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform","rotate(-40)")
        .style("text-anchor","end");

    g.append("g")
        .call(d3.axisLeft(y));

    // Gridlines
    g.append("g")
        .attr("class","grid")
        .call(
            d3.axisLeft(y)
              .tickSize(-width)
              .tickFormat("")
        );

    // Anticipation Line
    const anticipation = d3.line()
        .x(d => x(d.Movie))
        .y(d => y(d.AnticipationScore))
        .curve(d3.curveCatmullRom);

    const anticipationPath = g.append("path")
        .datum(data)
        .attr("fill","none")
        .attr("stroke","#2E86DE")
        .attr("stroke-width",4)
        .attr("d",anticipation);

    // Social Buzz Line
    const buzz = d3.line()
        .x(d => x(d.Movie))
        .y(d => y(d.SocialBuzz))
        .curve(d3.curveCatmullRom);

    const buzzPath = g.append("path")
        .datum(data)
        .attr("fill","none")
        .attr("stroke","#F39C12")
        .attr("stroke-width",4)
        .attr("d",buzz);

    // Animate Lines
    [anticipationPath, buzzPath].forEach(path => {

        const totalLength = path.node().getTotalLength();

        path
            .attr("stroke-dasharray", totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(4000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset",0);
    });

    // Anticipation Points
    g.selectAll(".dot1")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx",d=>x(d.Movie))
        .attr("cy",d=>y(d.AnticipationScore))
        .attr("r",6)
        .attr("fill","#2E86DE");

    // Social Buzz Points
    g.selectAll(".dot2")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx",d=>x(d.Movie))
        .attr("cy",d=>y(d.SocialBuzz))
        .attr("r",6)
        .attr("fill","#F39C12");

    // Legend
    svg.append("circle")
        .attr("cx",920)
        .attr("cy",35)
        .attr("r",7)
        .attr("fill","#2E86DE");

    svg.append("text")
        .attr("x",935)
        .attr("y",40)
        .text("Anticipation");

    svg.append("circle")
        .attr("cx",920)
        .attr("cy",60)
        .attr("r",7)
        .attr("fill","#F39C12");

    svg.append("text")
        .attr("x",935)
        .attr("y",65)
        .text("Social Buzz");

});

}


// Canvas4 - Grad Dune (ported from Processing sketch GradDune)
(function () {
  const canvas = document.getElementById("gradDune");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const ballWidth = 48;

  class Ball {
    constructor(x, y, w) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.speed = 0;
      this.gravity = 0.1;
      this.life = 300;
    }

    move() {
      // gravity to speed, speed to y location
      this.speed += this.gravity;
      this.y += this.speed;
      if (this.y > height) {
        this.speed *= -0.8;
        this.y = height;
      }
    }

    finished() {
      // balls fade out
      this.life--;
      return this.life < 0;
    }

    display() {
      const alpha = Math.min(this.life, 255) / 255;
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.w / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const balls = [new Ball(width / 2, 2, ballWidth)];

  function drawGradient() {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "rgb(255, 140, 0)");  // orange
    grad.addColorStop(1, "rgb(0, 120, 255)");  // blue
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  function draw() {
    drawGradient();
    for (let i = balls.length - 1; i >= 0; i--) {
      const ball = balls[i];
      ball.move();
      ball.display();
      if (ball.finished()) balls.splice(i, 1);
    }
    requestAnimationFrame(draw);
  }

  // mousePressed (also works with touch). The canvas is scaled by CSS,
  // so convert the click position back to canvas pixels.
  canvas.addEventListener("pointerdown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (width / rect.width);
    const y = (e.clientY - rect.top) * (height / rect.height);
    balls.push(new Ball(x, y, ballWidth));
  });

  draw();
})();


// Canvas5 - Sandbox (ported from Processing sketch Sandbox_wk4)
(function () {
  const canvas = document.getElementById("sandbox");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  // lerpColor for [r, g, b] arrays
  function lerpColor(c1, c2, t) {
    return c1.map((v, i) => Math.round(v + (c2[i] - v) * t));
  }

  function gradientEllipse(x, y, w, h, c1, c2, steps) {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;        // map(i, 0, steps, 0, 1)
      const t2 = 1 - t;           // map(i, 0, steps, 1, 0)
      const [r, g, b] = lerpColor(c1, c2, t);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${100 / 255})`;  // fill(c, 100)
      ctx.beginPath();
      ctx.ellipse(x, y, (w * t2) / 2, (h * t2) / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // The sketch draws the same frame every time, so draw it once
  ctx.fillStyle = "rgb(166, 200, 230)";
  ctx.fillRect(0, 0, width, height);
  gradientEllipse(width / 2, height / 2, 600, 800, [255, 0, 0], [0, 0, 255], 10);
})();


// Canvas6 - Text (ported from Processing sketch TEXT_)
(function () {
  const canvas = document.getElementById("bounceText");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  const s = "Create ";
  ctx.font = "80px sans-serif";        // textSize(80)
  ctx.textBaseline = "alphabetic";     // y is the text baseline, like Processing
  const m = ctx.measureText(s);
  const textWidth = m.width;
  const textHeight = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;

  // Start somewhere fully inside the canvas
  let x = Math.random() * (width - textWidth);
  let y = textHeight + Math.random() * (height - textHeight);
  let xSpeed = 5;
  let ySpeed = 3;

  function moveText() {
    x += xSpeed;
    y += ySpeed;
  }

  function checkCollision() {
    if (x < 0 || x + textWidth > width) xSpeed *= -1;
    if (y < textHeight || y > height) ySpeed *= -1;
  }

  function draw() {
    ctx.fillStyle = "rgb(213, 175, 240)";            // background
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = `rgba(213, 9, 140, ${127 / 255})`; // fill(213, 9, 140, 127)
    ctx.fillText(s, x, y);
    moveText();
    checkCollision();
    requestAnimationFrame(draw);
  }

  draw();
})();


// Canvas7 - Square Rotate (ported from Processing sketch square_rotate_, 3D with p5.js WEBGL)
(function () {
  const holder = document.getElementById("squareRotate");
  if (!holder || !window.p5) return;

  new p5((p) => {
    let a = 0;
    const offset = Math.PI / 24.0;  // angle offset between boxes
    const num = 15;

    p.setup = () => {
      p.createCanvas(840, 960, p.WEBGL);  // WEBGL origin is already the center
      p.noStroke();
    };

    p.draw = () => {
      p.background(26, 49, 69);
      p.lights();
      for (let i = 0; i < num; i++) {
        p.push();
        p.fill(200, 255, 127);
        p.rotateY(a + offset * i);
        p.rotateX(a / 2 + offset * i);
        p.box(300);
        p.pop();
      }
      a += 0.01;
    };
  }, holder);
})();


// Canvas8 - Verlet (ported from Processing sketch MiaB_Mod10_Sum_Verlet)
(function () {
  const canvas = document.getElementById("verlet");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const random = (a, b) => a + Math.random() * (b - a);

  class VerletBall {
    constructor(x, y, pushX, pushY, radius) {
      this.x = x; this.y = y;
      this.oldX = x; this.oldY = y;
      this.radius = radius;
      this.dragging = false;
      this.x += pushX; this.y += pushY;   // 1st motion
    }
    applyForce(fx, fy) { this.x += fx; this.y += fy; }
    verlet() {
      const tx = this.x, ty = this.y;
      this.x += this.x - this.oldX;
      this.y += this.y - this.oldY;
      this.oldX = tx; this.oldY = ty;
    }
    render() {
      ctx.fillStyle = "rgb(255, 100, 10)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    boundsCollision() {
      const r = this.radius;
      if (this.x > width - r) { this.x = width - r; this.oldX = this.x + (this.x - this.oldX); }
      else if (this.x < r)    { this.x = r;         this.oldX = this.x + (this.x - this.oldX); }
      if (this.y > height - r) { this.y = height - r; this.oldY = this.y + (this.y - this.oldY); }
      else if (this.y < r)     { this.y = r;          this.oldY = this.y + (this.y - this.oldY); }
    }
    checkClick(mx, my) { if (Math.hypot(mx - this.x, my - this.y) < this.radius) this.dragging = true; }
    drag(mx, my) { if (this.dragging) { this.x = mx; this.y = my; } }
    release() { this.dragging = false; }
  }

  class VerletStick {
    constructor(b1, b2, tension) {
      this.b1 = b1; this.b2 = b2;
      this.len = Math.hypot(b2.x - b1.x, b2.y - b1.y);
      this.tension = tension;
    }
    constrainLen() {
      const dx = this.b2.x - this.b1.x, dy = this.b2.y - this.b1.y;
      const dist = Math.hypot(dx, dy);
      if (dist === 0) return;   // a stick joining a ball to itself would divide by zero
      const diff = (dist - this.len) / dist * this.tension;
      const ox = dx * 0.5 * diff, oy = dy * 0.5 * diff;
      this.b1.x += ox; this.b1.y += oy;
      this.b2.x -= ox; this.b2.y -= oy;
    }
    render() {
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.b1.x, this.b1.y);
      ctx.lineTo(this.b2.x, this.b2.y);
      ctx.stroke();
    }
  }

  const particles = 50;
  const bonds = particles * 2;
  const gravity = { x: 0, y: 0.1 };
  const balls = [];
  const sticks = [];

  // setup
  let theta = Math.PI / 4.0;
  const shapeM = 90;
  const tension = 0.5;
  for (let i = 0; i < particles; i++) {
    balls[i] = new VerletBall(
      width / 2 + Math.cos(theta) * shapeM,
      height / 2 + Math.sin(theta) * shapeM,
      random(-1.5, 1.5), random(-1.5, 1.5),
      random(5, 15)
    );
    theta += (Math.PI * 2) / particles;
  }
  for (let i = 0; i < particles; i++) {
    sticks[i] = new VerletStick(balls[i], balls[(i + 1) % particles], tension);
  }
  for (let i = particles; i < bonds; i++) {
    sticks[i] = new VerletStick(balls[i % particles], balls[Math.floor(random(0, particles))], tension);
  }

  function draw() {
    ctx.fillStyle = "rgb(255, 219, 164)";   // background(324, 219, 164) -> 324 caps at 255
    ctx.fillRect(0, 0, width, height);
    balls.forEach((b) => b.applyForce(gravity.x, gravity.y));
    sticks.forEach((s) => { s.constrainLen(); s.render(); });
    balls.forEach((b) => { b.verlet(); b.boundsCollision(); b.render(); });
    requestAnimationFrame(draw);
  }

  // Mouse/touch: convert screen position to canvas pixels (the canvas is scaled by CSS)
  function toCanvas(e) {
    const rect = canvas.getBoundingClientRect();
    return [(e.clientX - rect.left) * (width / rect.width), (e.clientY - rect.top) * (height / rect.height)];
  }
  canvas.addEventListener("pointerdown", (e) => {
    const [mx, my] = toCanvas(e);
    balls.forEach((b) => b.checkClick(mx, my));
    canvas.setPointerCapture(e.pointerId);   // keep dragging even if the pointer leaves the canvas
    canvas.style.cursor = "grabbing";
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!canvas.hasPointerCapture(e.pointerId)) return;
    const [mx, my] = toCanvas(e);
    balls.forEach((b) => b.drag(mx, my));
  });
  const release = () => { balls.forEach((b) => b.release()); canvas.style.cursor = "grab"; };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);

  draw();
})();

// Canvas9 - Pic Brain (ported from Processing sketch MiaB_Mod_7_sum_brain_, textured shape with p5.js WEBGL)
(function () {
  const holder = document.getElementById("picBrain");
  if (!holder || !window.p5) return;

  new p5((p) => {
    let b;
    const vertices = [];
    const velocities = [];

    function randomVelocities(minSpeed, maxSpeed) {
      for (let i = 0; i < 4; i++) {
        const angle = p.random(p.TWO_PI);
        const speed = p.random(minSpeed, maxSpeed);
        velocities[i] = p.createVector(Math.cos(angle) * speed, Math.sin(angle) * speed);
      }
    }

    p.setup = async () => {
      p.createCanvas(1300, 1500, p.WEBGL);
      b = await p.loadImage("images/brain-blue-yellow.jpeg");
      p.noStroke();
      p.textureMode(p.NORMAL);

      // Start the vertices at the corners of the image
      vertices[0] = p.createVector(2, 0);
      vertices[1] = p.createVector(b.width, 2);
      vertices[2] = p.createVector(b.width, b.height);
      vertices[3] = p.createVector(2, b.height);
      randomVelocities(1, 3);

      // mousePressed: reset the corners and pick new random velocities
      holder.addEventListener("pointerdown", () => {
        vertices[0].set(0, 0);
        vertices[1].set(b.width, 0);
        vertices[2].set(b.width, b.height);
        vertices[3].set(0, b.height);
        randomVelocities(1, 4);
      });
    };

    p.draw = () => {
      if (!b) return;
      p.background(227, 134, 207);
      vertices.forEach((v, i) => v.add(velocities[i]));

      p.translate(-p.width / 2, -p.height / 2);  // WEBGL starts at the center; match Processing's top-left origin
      p.translate(p.width / 4 - b.width / 4, p.height / 4 - b.height / 4);

      p.beginShape();
      p.texture(b);
      p.vertex(vertices[0].x, vertices[0].y, 0, 0, 0);
      p.vertex(vertices[1].x, vertices[1].y, 0, 1, 0);
      p.vertex(vertices[2].x, vertices[2].y, 0, 1, 1);
      p.vertex(vertices[3].x, vertices[3].y, 0, 0, 1);
      p.endShape(p.CLOSE);
    };
  }, holder);
})();

// Canvas10 - Ben (ported from Processing sketch MiaB_Mod6_Sum_Ben_)
(function () {
  const canvas = document.getElementById("ben");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const imgW = 400, imgH = 400;          // B.resize(400, 400)
  const mouseXScaling = imgW / width;

  // Start with a coarse grid so the effect shows before anyone hovers
  let mouseX = 80, mouseY = 50;
  let pixels = null;
  const B = new Image();
  B.src = "images/bigben.jpeg";

  B.onload = () => {
    // Read the image's pixels once (like B.pixels in Processing)
    const off = document.createElement("canvas");
    off.width = imgW; off.height = imgH;
    const octx = off.getContext("2d");
    octx.drawImage(B, 0, 0, imgW, imgH);
    pixels = octx.getImageData(0, 0, imgW, imgH).data;
    draw();
  };

  function draw() {
    if (!pixels) return;
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(B, 0, 0, imgW, imgH);

    const rows = Math.floor(mouseX * mouseXScaling);
    const cols = mouseY;
    // Never let a cell be smaller than 1px (in Processing that could freeze the sketch)
    const celH = rows > 0 ? Math.max(1, imgH / rows) : imgH;
    const celW = cols > 0 ? Math.max(1, imgW / cols) : imgW;

    ctx.save();
    ctx.translate(width / 2, 0);
    for (let i = 0; i < imgH; i = Math.floor(i + celH)) {
      for (let j = 0; j < imgW; j = Math.floor(j + celW)) {
        const k = (imgW * i + j) * 4;
        ctx.fillStyle = `rgb(${pixels[k]}, ${pixels[k + 1]}, ${pixels[k + 2]})`;
        ctx.fillRect(j, i, Math.ceil(celW), Math.ceil(celH));   // ceil avoids hairline gaps
      }
    }
    ctx.restore();
  }

  // Only redraw when the mouse moves (the picture doesn't change otherwise)
  let queued = false;
  canvas.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * (width / rect.width);
    mouseY = (e.clientY - rect.top) * (height / rect.height);
    if (!queued) {
      queued = true;
      requestAnimationFrame(() => { queued = false; draw(); });
    }
  });
})();

// Canvas11 - Barney (ported from Processing sketch MiaB_Mod5_Sum_barney)
(function () {
  const canvas = document.getElementById("barney");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  // barney colors: purple + green (secondary complements)
  const purple = [128, 0, 128];
  const green = [0, 128, 0];
  let angle = 0;
  const orbitRadius = 120;   // distance from center to each ellipse
  const speed = 0.02;        // how fast they spin

  function lerpColor(c1, c2, t) {
    return c1.map((v, i) => Math.round(v + (c2[i] - v) * t));
  }

  function gradientEllipse(x, y, w, h, c1, c2, steps) {
    for (let i = steps; i > 0; i--) {
      const t = i / steps;   // map(i, 0, steps, 0, 1)
      const [r, g, b] = lerpColor(c1, c2, t);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${150 / 255})`;   // fill(c, 150)
      ctx.beginPath();
      ctx.ellipse(x, y, (w * t) / 2, (h * t) / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function draw() {
    ctx.fillStyle = "rgb(100, 30, 70)";
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    // Ellipse A sits at the current angle; ellipse B is 180 degrees (PI) across from it
    const ax = cx + Math.cos(angle) * orbitRadius;
    const ay = cy + Math.sin(angle) * orbitRadius;
    const bx = cx + Math.cos(angle + Math.PI) * orbitRadius;
    const by = cy + Math.sin(angle + Math.PI) * orbitRadius;

    gradientEllipse(ax, ay, 300, 300, purple, green, 50);
    gradientEllipse(bx, by, 300, 300, green, purple, 50);

    angle += speed;
    requestAnimationFrame(draw);
  }

  draw();
})();

// Canvas12 - Analogous (ported from Processing sketch MiaB_Mod_5_SumAnalo)
(function () {
  const canvas = document.getElementById("analogous");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Analogous colors: blue and green
  const color1 = [0, 128, 255];   // Blue
  const color2 = [0, 255, 128];   // Green

  function gradientRect(x, y, w, h, c1, c2, steps) {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;   // map(i, 0, steps, 0, 1)
      const [r, g, b] = c1.map((v, k) => Math.round(v + (c2[k] - v) * t));   // lerpColor
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, y + i * (h / steps), w, h / steps);
    }
  }

  // The sketch draws the same frame every time, so draw it once
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  gradientRect(100, 100, 600, 600, color1, color2, 30);
})();

// Canvas13 - Triad (ported from Processing sketch MiaB_Mod5_Sum_tri)
(function () {
  const canvas = document.getElementById("triad");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  // --- Perlin noise, similar to Processing's noise(): smooth values between 0 and 1 ---
  const perm = new Uint8Array(512);
  (function () {
    const p = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  })();
  const fade = (f) => f * f * f * (f * (f * 6 - 15) + 10);
  const grad = (h, x, y) => ((h & 1) ? -x : x) + ((h & 2) ? -y : y);
  function perlin(x, y) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y);
    const a = perm[X] + Y, b = perm[X + 1] + Y;
    const l1 = grad(perm[a], x, y) + u * (grad(perm[b], x - 1, y) - grad(perm[a], x, y));
    const l2 = grad(perm[a + 1], x, y - 1) + u * (grad(perm[b + 1], x - 1, y - 1) - grad(perm[a + 1], x, y - 1));
    return l1 + v * (l2 - l1);   // about -1..1
  }
  function noise(x, y = 0) {
    // 4 octaves with falloff 0.5, like Processing's default noiseDetail
    let total = 0, amp = 0.5, freq = 1, max = 0;
    for (let o = 0; o < 4; o++) { total += perlin(x * freq, y * freq) * amp; max += amp; amp *= 0.5; freq *= 2; }
    return Math.min(1, Math.max(0, 0.5 + total / max / 2));
  }
  const map = (v, a, b, c, d) => c + (d - c) * ((v - a) / (b - a));

  // triad colors
  const orange = [255, 29, 1];
  const red = [255, 0, 0];
  const yellow = [255, 255, 0];
  let angle = 0;
  const speed = 0.012;       // orbit speed
  const orbitRadius = 140;   // base distance from center
  let t = 0;                 // time for noise-based drifting

  function gradientEllipse(x, y, w, h, c1, c2, steps) {
    for (let i = steps; i > 0; i--) {
      const tt = i / steps;
      const [r, g, b] = c1.map((v, k) => Math.round(v + (c2[k] - v) * tt));   // lerpColor
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${150 / 255})`;                   // fill(c, 150)
      ctx.beginPath();
      ctx.ellipse(x, y, (w * tt) / 2, (h * tt) / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const c1s = [orange, red, yellow];
  const c2s = [red, yellow, orange];

  function draw() {
    ctx.fillStyle = "rgb(222, 89, 50)";
    ctx.fillRect(0, 0, width, height);

    // Shared center drifts gently around the middle of the canvas
    const cx = width / 2 + map(noise(t, 0), 0, 1, -50, 50);
    const cy = height / 2 + map(noise(0, t), 0, 1, -50, 50);

    for (let i = 0; i < 3; i++) {
      const a = angle + (i * Math.PI * 2) / 3;                      // 120 degrees apart
      const r = orbitRadius + map(noise(t + i * 10), 0, 1, -40, 40); // each one bobs in and out
      gradientEllipse(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 300, 300, c1s[i], c2s[i], 30);
    }

    angle += speed;
    t += 0.005;
    requestAnimationFrame(draw);
  }

  draw();
})();

// Canvas14 - Dim Lights (ported from Processing sketch MiaB_Mod_5Sum_fun_)
(function () {
  const canvas = document.getElementById("dimLights");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const light = width / 2;

  // colorMode(HSB, 360, 90, 90): convert hue/saturation/brightness to an RGB string
  function hsb(h, s, b) {
    s /= 90; b /= 90;
    const f = (n) => {
      const k = (n + h / 60) % 6;
      return Math.round(255 * (b - b * s * Math.max(0, Math.min(k, 4 - k, 1))));
    };
    return `rgb(${f(5)}, ${f(3)}, ${f(1)})`;
  }

  ctx.fillStyle = "rgb(0, 0, 0)";   // background(0), only once in setup
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgb(0, 0, 0)"; // Processing's default black outline is what makes the lights "dim"
  ctx.lineWidth = 1;

  function drawGradient(x, y) {
    const radius = Math.floor(light / 2);
    let hue = Math.random() * 360;
    for (let r = radius; r > 0; --r) {
      ctx.fillStyle = hsb(hue, 80, 80);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);   // ellipseMode(RADIUS)
      ctx.fill();
      ctx.stroke();
      hue = (hue + 1) % 360;
    }
  }

  function draw() {
    for (let x = 0; x <= width; x += light) drawGradient(x, height / 2);
    requestAnimationFrame(draw);
  }

  draw();
})();

// Canvas15 - Lighting (ported from Processing sketch MiaB_Mod4_Sum3)
(function () {
  const canvas = document.getElementById("lighting");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const random = (a, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));

  const Totpoints = 500;
  const level = Totpoints + 7;

  function draw() {
    ctx.fillStyle = "rgb(10, 10, 10)";
    ctx.fillRect(0, 0, width, height);

    let rndm = 2;
    // stroke(random(255), random(150), random(300), 500): values above 255 cap at 255
    const r = Math.round(random(255));
    const g = Math.round(random(150));
    const b = Math.min(255, Math.round(random(300)));
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

    for (let i = 2; i < level; i++) {
      // point() with strokeWeight(3) draws a 3px dot
      ctx.beginPath();
      ctx.arc((width / level) * i, height / 2 + random(-rndm, rndm), 1.5, 0, Math.PI * 2);
      ctx.fill();
      rndm += random(-7, 7);
    }
  }

  draw();
  setInterval(draw, 500);   // frameRate(2)
})();

// Canvas16 - Peach (ported from Processing sketch MiaB_Mod4_Sum_2_)
(function () {
  const canvas = document.getElementById("peach");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  let theta = 0;
  const r = 300;

  // No background() call, so Processing's default light gray shows and the lines build up
  ctx.fillStyle = "rgb(204, 204, 204)";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgb(222, 98, 116)";
  ctx.lineWidth = 1;

  function draw() {
    const x = width / 2 + r * Math.cos(theta);
    const y = height / 2 + r * Math.sin(theta);
    ctx.beginPath();   // triangle(...) with noFill()
    ctx.moveTo(width / 2, height / 2);
    ctx.lineTo(width / 2, 3 + height / 2);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
    theta += 0.02;
    if (theta >= Math.PI * 2) theta = 0;
    requestAnimationFrame(draw);
  }

  draw();
})();

// Canvas17 - Build (ported from Processing sketch MiaB_Mod4_Sum_)
(function () {
  const canvas = document.getElementById("build");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const random = (a, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
  const c255 = (v) => Math.min(255, Math.round(v));   // Processing caps color values at 255

  ctx.fillStyle = "rgb(240, 177, 213)";   // background only once, so shapes pile up
  ctx.fillRect(0, 0, width, height);

  function draw() {
    ctx.lineWidth = 5;
    ctx.strokeStyle = `rgba(${c255(random(255))}, ${c255(random(255))}, ${c255(random(300))}, ${150 / 255})`;
    ctx.fillStyle = `rgba(${c255(random(255))}, ${c255(random(255))}, ${c255(random(222))}, ${100 / 255})`;

    // rect(random(width), random(height), random(50, 90), random(50, 100))
    ctx.beginPath();
    ctx.rect(random(width), random(height), random(50, 90), random(50, 100));
    ctx.fill();
    ctx.stroke();

    // ellipse(random(width), random(height), random(50, 100), random(50, 90))
    ctx.beginPath();
    ctx.ellipse(random(width), random(height), random(50, 100) / 2, random(50, 90) / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(random(width), random(height));
    ctx.lineTo(random(width), random(height));
    ctx.stroke();
  }

  draw();
  setInterval(draw, 250);   // frameRate(4)
})();

// Canvas18 - Symmetry (ported from Processing sketch MiaB_Mod3_Sum)
(function () {
  const canvas = document.getElementById("symmetry");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  const num = 120;
  let theta = 2;
  const rad = 200;
  const len = 300;

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "rgb(192, 237, 194)";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgb(124, 214, 187)";
    ctx.lineWidth = 2;

    ctx.translate(width / 2, height / 2);
    let angle = theta;
    for (let i = 0; i < num; i++) {
      const x = rad * Math.cos(angle);
      const y = rad * Math.sin(angle);
      ctx.strokeRect(x - len / 2, y - len / 2, len, len);   // rectMode(CENTER)
      angle += 0.04;
    }
    theta += 0.02;
    requestAnimationFrame(draw);
  }

  draw();
})();

// Canvas19 - Burst (ported from Processing sketch MiaB_Mod_2_Sum)
(function () {
  const canvas = document.getElementById("burst");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const random = (a, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "rgb(20, 160, 150)";
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);
    ctx.lineCap = "butt";   // strokeCap(CORNER) ends up as flat line ends
    ctx.lineWidth = 2;

    for (let a = 0; a < 700; a += 2) {
      const x = random(30, 200);
      const xx = random(170, 350);
      const gray = Math.min(255, Math.round(random(430)));   // stroke(random(430)) caps at 255
      ctx.save();
      ctx.rotate((a * Math.PI) / 180);   // rotate(radians(a))
      ctx.strokeStyle = `rgb(${gray}, ${gray}, ${gray})`;
      ctx.beginPath();
      ctx.moveTo(x, 5);
      ctx.lineTo(xx, 4);
      ctx.stroke();
      ctx.restore();
    }
  }

  draw();
  setInterval(draw, 200);   // frameRate(5)
})();

// Canvas20 - Mouse Worm (ported from Processing sketch Moues_worm_)
(function () {
  const canvas = document.getElementById("mouseWorm");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let mouseX = 0, mouseY = 0;

  ctx.fillStyle = "rgb(28, 23, 20)";   // background only once, so the trail builds up
  ctx.fillRect(0, 0, width, height);
  ctx.lineWidth = 1;

  function ellipse(x, y, w, h, fill, stroke) {
    ctx.beginPath();
    ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }

  function draw() {
    const brown = "rgb(148, 91, 37)";
    ellipse(mouseX, mouseY, 220, 190, "rgb(242, 204, 116)", brown);   // outer
    ellipse(mouseX, mouseY, 170, 150, "rgb(184, 123, 50)", brown);    // inner
    ellipse(mouseX, mouseY, 140, 120, "rgb(209, 163, 102)", brown);   // inner 2

    const slate = "rgb(55, 60, 80)";                                   // noFill()
    ellipse(mouseX, mouseY, 230, 95, null, slate);
    ellipse(mouseX, mouseY, 150, 130, null, slate);

    // triangle(mouseX, mouseY, 232, 80, 344, 300) "mountains"
    ctx.strokeStyle = "rgb(214, 196, 165)";
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
    ctx.lineTo(232, 80);
    ctx.lineTo(344, 300);
    ctx.closePath();
    ctx.stroke();

    requestAnimationFrame(draw);
  }

  // The canvas is scaled by CSS, so convert the mouse position back to canvas pixels
  canvas.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * (width / rect.width);
    mouseY = (e.clientY - rect.top) * (height / rect.height);
  });

  draw();
})();

// Canvas21 - Mandala (ported from Processing sketch MiaBMod6_1)
(function () {
  const canvas = document.getElementById("mandala");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let angle = 0;

  function shape(points, fill) {
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    for (let k = 2; k < points.length; k += 2) ctx.lineTo(points[k], points[k + 1]);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    ctx.stroke();
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "rgb(245, 143, 71)";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgb(182, 209, 212)";
    ctx.lineWidth = 5;
    ctx.lineJoin = "miter";
    ctx.translate(width / 2, height / 2);

    for (let i = 0; i < 30; i++) {
      ctx.rotate((angle * Math.PI) / 180);   // rotations add up each time through the loop
      shape([152, 124, 300, 80, 250, 200, 500, 300], "rgb(5, 60, 100)");   // quad
      shape([120, 100, 300, 250, 80, 300], "rgb(207, 111, 60)");           // triangle
      ctx.strokeRect(120 - 110, 90 - 110, 220, 220);                       // rect, rectMode(CENTER), noFill
    }
    angle += -0.1;
    requestAnimationFrame(draw);
  }

  draw();
})();

// Canvas22 - Tennis (ported from Processing sketch MiaB_Mod4, "pickleball")
(function () {
  const canvas = document.getElementById("tennis");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const random = (a, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
  let weight = 1;   // strokeWeight(5) is set mid-draw, so it carries into later frames

  function draw() {
    ctx.fillStyle = "rgb(137, 202, 217)";
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = weight;

    // court
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.fillStyle = "rgb(74, 145, 176)";
    ctx.fillRect(30, 30, 300, 540);   ctx.strokeRect(30, 30, 300, 540);
    ctx.fillRect(370, 30, 305, 540);  ctx.strokeRect(370, 30, 305, 540);

    // net line
    ctx.beginPath();
    ctx.moveTo(random(width), random(height));
    ctx.lineTo(random(width), random(height));
    ctx.stroke();

    // ball
    const x = random(width);
    const y = random(height);
    const W = random(90, 200);
    const H = random(200, 300);
    weight = 5;
    ctx.lineWidth = weight;
    ctx.strokeStyle = "rgb(90, 90, 90)";
    ctx.fillStyle = "rgb(247, 245, 90)";
    ctx.beginPath();
    ctx.ellipse(x, y, W / 2, H / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // paddle
    ctx.strokeStyle = "rgb(217, 146, 111)";
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo(120, 80);
    ctx.bezierCurveTo(x, y, W, H, 20, 5);
    ctx.fill();
    ctx.stroke();
  }

  draw();
  setInterval(draw, 1000 / 7);   // frameRate(7)
})();

// Canvas23 - Draw (ported from Processing sketch MiaB_Mod_3)
(function () {
  const canvas = document.getElementById("drawPortrait");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let mouseX = 0, mouseY = 0;

  // Small helpers that mimic Processing's fill/stroke state
  let fillC = null, strokeC = null;
  const fill = (c) => { fillC = c; };
  const stroke = (c) => { strokeC = c; };
  const noStroke = () => { strokeC = null; };
  function paint(closeForStroke = true) {
    if (fillC) { ctx.fillStyle = fillC; ctx.fill(); }
    if (strokeC) { ctx.strokeStyle = strokeC; if (closeForStroke) ctx.stroke(); }
  }
  function ellipse(x, y, w, h) { ctx.beginPath(); ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2); paint(); }
  const circle = (x, y, d) => ellipse(x, y, d, d);
  function rect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); paint(); }
  function arc(x, y, w, h, a1, a2) {
    // Processing's default arc fills like a pie slice
    ctx.beginPath(); ctx.moveTo(x, y); ctx.ellipse(x, y, w / 2, h / 2, 0, a1, a2); ctx.closePath();
    if (fillC) { ctx.fillStyle = fillC; ctx.fill(); }
    if (strokeC) { ctx.beginPath(); ctx.ellipse(x, y, w / 2, h / 2, 0, a1, a2); ctx.strokeStyle = strokeC; ctx.stroke(); }
  }
  function triangle(x1, y1, x2, y2, x3, y3) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath(); paint(); }
  function line(x1, y1, x2, y2) { if (!strokeC) return; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = strokeC; ctx.stroke(); }

  ctx.fillStyle = "rgb(150, 191, 75)";   // background only once
  ctx.fillRect(0, 0, width, height);
  ctx.lineWidth = 1;

  function draw() {
    const brown = "rgb(150, 110, 78)";
    stroke(brown); fill(brown);
    circle(180, 220, 40); circle(340, 220, 40);   // ears
    circle(344, 240, 20); circle(175, 240, 20);   // ear lobes

    fill("rgb(219, 179, 20)");
    circle(175, 250, 8); circle(344, 250, 8);     // earrings
    noStroke();
    circle(165, 240, 8); circle(353, 240, 8);     // earrings

    fill(brown);
    rect(230, 230, 55, 130, 10);                  // neck
    ellipse(260, 220, 170, 190);                  // head

    fill("rgba(43, 38, 36, 0.098)");              // hair: fill(43, 38, 36, 25)
    circle(mouseX, mouseY, 30);

    fill("rgb(255, 255, 255)"); ellipse(220, 200, 50, 25);   // left eye
    fill("rgb(69, 57, 45)");    ellipse(220, 200, 40, 5);    // left pupil
    fill("rgb(255, 255, 255)"); ellipse(300, 200, 50, 25);   // right eye
    fill("rgb(69, 57, 45)");    ellipse(300, 200, 40, 5);    // right pupil

    fill("rgb(0, 0, 0)");
    ellipse(225, 170, 60, 5); ellipse(300, 170, 60, 5);      // brows
    arc(195, 185, 70, 10, 0, 2); arc(300, 185, 70, 10, 0, 2); // lashes

    fill("rgb(155, 115, 80)");
    triangle(280, 230, 260, 240, 240, 230);                   // nose
    ellipse(210, 250, 20, 20); ellipse(310, 250, 20, 20);     // cheeks

    fill("rgb(176, 106, 93)");
    arc(260, 260, 70, 30, 0, Math.PI);                        // mouth

    fill("rgb(150, 30, 90)");
    rect(150, 350, 210, 200, 40);                             // torso

    stroke("rgb(5, 5, 5)");
    line(320, 400, 320, 530); line(200, 400, 200, 530);       // arms

    requestAnimationFrame(draw);
  }

  // The canvas is scaled by CSS, so convert the mouse position back to canvas pixels
  canvas.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * (width / rect.width);
    mouseY = (e.clientY - rect.top) * (height / rect.height);
  });

  draw();
})();

// Canvas24 - Weather (ported from Processing sketch MiaB_Mod9_weather)
(function () {
  const canvas = document.getElementById("weather");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const random = (a, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));

  class Raindrop {
    constructor(x, y) { this.x = x; this.y = y; this.spd = random(4, 10); }
    fall() { this.y += this.spd; }
    loops() { this.y = random(-600, -50); }
    D() {   // display
      ctx.strokeStyle = "rgb(15, 197, 255)";   // blue raindrop
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, this.y + 70);
      ctx.stroke();
    }
  }

  class Cloud {
    constructor(x, y, speed) { this.x = x; this.y = y; this.spd = speed; }
    M() {   // move
      this.x += this.spd;
      if (this.x > width + 10) this.x = 120;
    }
    D() {   // display
      ctx.fillStyle = "rgb(94, 102, 107)";
      for (const [dx, dy, w, h] of [[0, 0, 400, 80], [40, -20, 70, 40], [-30, -20, 70, 30]]) {
        ctx.beginPath();
        ctx.ellipse(this.x + dx, this.y + dy, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const raindrops = Array.from({ length: 300 }, () => new Raindrop(random(width), random(-500, -50)));
  const clouds = Array.from({ length: 5 }, () => new Cloud(random(width), random(100), random(1, 3)));

  function draw() {
    ctx.fillStyle = "rgb(1, 8, 48)";
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 1;
    clouds.forEach((c) => { c.D(); c.M(); });
    raindrops.forEach((r) => {
      r.D();
      r.fall();
      if (r.y > height) r.loops();
    });
    requestAnimationFrame(draw);
  }

  draw();
})();

// Hover to enlarge: any gallery canvas grows to its full size while the mouse is over it
(function () {
  const grid = document.querySelector(".gallery-grid");
  if (!grid || !window.matchMedia("(hover: hover)").matches) return;  // skip touch screens

  function fullWidth(canvas) {
    // p5 canvases keep their real size in style.width; plain canvases use the width attribute
    return parseFloat(canvas.style.width) || canvas.width;
  }

  function enlarge(canvas) {
    canvas.style.transform = "";
    const r = canvas.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const s = Math.max(1, Math.min(fullWidth(canvas) / r.width, (vw * 0.9) / r.width, (vh * 0.9) / r.height));
    // Grow around the center, then nudge it so it stays on screen
    const w = r.width * s, h = r.height * s;
    let left = r.left + r.width / 2 - w / 2;
    let top = r.top + r.height / 2 - h / 2;
    left = Math.min(Math.max(left, vw * 0.05), vw * 0.95 - w);
    top = Math.min(Math.max(top, vh * 0.05), vh * 0.95 - h);
    const dx = left + w / 2 - (r.left + r.width / 2);
    const dy = top + h / 2 - (r.top + r.height / 2);
    canvas.classList.add("enlarged");
    canvas.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
  }

  function shrink(canvas) {
    canvas.classList.remove("enlarged");
    canvas.style.transform = "";
  }

  // Event delegation so canvases created later by p5 are included
  grid.addEventListener("mouseover", (e) => {
    const c = e.target.closest(".gallery-card canvas");
    if (c && !c.classList.contains("enlarged")) enlarge(c);
  });
  grid.addEventListener("mouseout", (e) => {
    const c = e.target.closest(".gallery-card canvas");
    if (c && !c.contains(e.relatedTarget)) shrink(c);
  });
})();


// Canvas10 - Movie Spheres (ported from Processing sketch FinalBrackenMovie26, 3D with p5.js WEBGL)
// Size = anticipation, color = genre, opacity = social buzz. Hover a sphere for its numbers.
(function () {
  const holder = document.getElementById("movieSpheres");
  if (!holder || !window.p5) return;

  // Title and hover label are HTML on top of the canvas (WEBGL text would need a font file)
  const title = document.createElement("div");
  title.className = "movie-title";
  title.textContent = "Most Anticipated Movies 2026-2027";
  const tip = document.createElement("div");
  tip.className = "movie-tip";
  holder.appendChild(title);
  holder.appendChild(tip);

  new p5((p) => {
    const W = 1200, H = 800;
    const DEPTH_SHIFT = -200;  // same as translate(0,0,-200) in the Processing sketch
    let eyeZ;
    let movies = [];

    const genreColor = {
      "Sci-Fi":    [50, 180, 255],
      "Superhero": [255, 80, 60],
      "Animation": [255, 210, 70],
      "Horror":    [150, 40, 200],
      "Fantasy":   [80, 255, 160]
    };

    class Movie {
      constructor(t, a, b, g) {
        this.title = t;
        this.anticipation = a;
        this.buzz = b;
        this.genre = g;
        this.speed = p.random(0.2, 1);
        this.x = p.random(100, W - 100);
        this.y = p.random(100, H - 100);
        this.z = p.random(-200, 200);
        this.size = p.map(a, 79, 100, 25, 100);  // size based on anticipation
      }
      update() {
        this.x += Math.sin(p.frameCount * 0.01 * this.speed) * 0.3;
        this.y += Math.cos(p.frameCount * 0.01 * this.speed) * 0.3;
      }
      display() {
        const c = genreColor[this.genre] || [255, 150, 200];
        p.push();
        p.translate(this.x, this.y, this.z);
        p.noStroke();
        p.fill(c[0], c[1], c[2], this.buzz * 2);  // opacity based on buzz
        p.sphere(this.size / 2);
        p.pop();
      }
      // Where the sphere lands on screen, so hover matches what you see
      screen() {
        const s = eyeZ / (eyeZ - (this.z + DEPTH_SHIFT));
        return { x: W / 2 + (this.x - W / 2) * s, y: H / 2 + (this.y - H / 2) * s, r: (this.size / 2) * s };
      }
    }

    p.setup = () => {
      p.createCanvas(W, H, p.WEBGL);
      eyeZ = (H / 2) / Math.tan(Math.PI / 6);  // default camera distance (same as Processing)
      movies = [
        new Movie("Avengers: Secret Wars", 100, 98, "Superhero"),
        new Movie("Dune: Part Three", 97, 91, "Sci-Fi"),
        new Movie("Spider-Verse", 96, 89, "Animation"),
        new Movie("Batman Part II", 95, 88, "Superhero"),
        new Movie("Spider-Man", 94, 87, "Superhero"),
        new Movie("Project Hail Mary", 92, 83, "Sci-Fi"),
        new Movie("Hunger Games", 91, 80, "Action"),
        new Movie("Shrek 5", 90, 92, "Animation"),
        new Movie("Supergirl", 89, 78, "Superhero"),
        new Movie("Frozen 3", 88, 90, "Animation"),
        new Movie("Resident Evil", 86, 74, "Horror"),
        new Movie("Devil Wears Prada 2", 84, 76, "Comedy"),
        new Movie("Highlander", 82, 69, "Fantasy"),
        new Movie("How to Train Your Dragon", 81, 73, "Fantasy"),
        new Movie("Gremlins 3", 79, 67, "Horror")
      ];
    };

    p.draw = () => {
      p.background(30, 90, 80);
      p.lights();
      p.push();
      p.translate(-W / 2, -H / 2, DEPTH_SHIFT);  // WEBGL starts at the center; match Processing's top-left origin
      movies.forEach((m) => { m.update(); m.display(); });
      p.pop();

      // hover interaction: nearest sphere under the mouse
      let hit = null;
      const inside = p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H;
      if (inside) {
        movies.forEach((m) => {
          const s = m.screen();
          if (p.dist(p.mouseX, p.mouseY, s.x, s.y) < s.r && (!hit || m.z > hit.z)) hit = m;
        });
      }
      if (hit) {
        const scale = holder.clientWidth / W;
        tip.innerHTML = "<strong>" + hit.title + "</strong><br>Anticipation: " + hit.anticipation +
          "<br>Buzz: " + hit.buzz + "<br>Genre: " + hit.genre;
        const flip = p.mouseX > W * 0.65;  // near the right edge, show the label to the left
        tip.style.left = (p.mouseX * scale + (flip ? -20 : 20)) + "px";
        tip.style.transform = flip ? "translateX(-100%)" : "none";
        tip.style.top = (p.mouseY * scale) + "px";
        tip.style.display = "block";
      } else {
        tip.style.display = "none";
      }
    };
  }, holder);
})();


// Sonification player for the film chart (Featured Projects on Home)
// Plays only when the visitor clicks; browsers block sound that starts on its own.
(function () {
  const audio = document.getElementById("dataSound");
  const btn = document.getElementById("dataSoundBtn");
  if (!audio || !btn) return;
  const bar = document.getElementById("dataSoundBar");
  const time = document.getElementById("dataSoundTime");

  const fmt = (s) => {
    s = Math.max(0, Math.round(s || 0));
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  };
  const total = () => (isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 22);

  function render() {
    const playing = !audio.paused && !audio.ended;
    btn.innerHTML = playing ? "&#10074;&#10074; Pause" : "&#9654; Listen to the data";
    btn.setAttribute("aria-pressed", playing ? "true" : "false");
    bar.style.width = (audio.currentTime / total() * 100) + "%";
    time.textContent = fmt(audio.currentTime) + " / " + fmt(total());
  }

  btn.addEventListener("click", function () {
    if (audio.paused) {
      audio.play().catch(function () {
        time.textContent = "Couldn\u2019t play the audio. Try again.";
      });
    } else {
      audio.pause();
    }
  });

  ["play", "pause", "timeupdate", "loadedmetadata"].forEach(function (ev) {
    audio.addEventListener(ev, render);
  });
  audio.addEventListener("ended", function () { audio.currentTime = 0; render(); });
})();
