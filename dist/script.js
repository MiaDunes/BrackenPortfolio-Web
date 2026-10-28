
// Footer year (all pages)
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Canvas1 (gallery page only)
const canvas = document.getElementById("canvas");
if (canvas) {
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


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

const margin = { top: 60, right: 80, bottom: 120, left: 70 };
const width = 1100 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

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
