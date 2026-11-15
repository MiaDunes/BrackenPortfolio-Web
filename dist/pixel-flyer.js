// PIXEL FAN FLYER (Gallery page)
// A pixel-art fan that flutters around the page on its own. Click or tap
// anywhere and it flies over to that spot with a burst of sparks.
// It sits on a see-through layer on top of the page that ignores the mouse,
// so every link, button and sketch underneath still works normally.
// Plain canvas, no libraries.
(function () {
  // Respect visitors who turn off motion in their system settings
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const SPR = {"pal": ["#e9763f", "#c95f2e", "#7d6a1e", "#5a4a12", "#2b2310"], "rows": ["........................................................", "........................00......................0230....", ".......................022....................00211.....", ".......................023...........00022332210000.....", "........................220........0223321100000000.....", "........................220....00233200000001111000.....", "........................02200233200...0000110000000.....", ".......................02233320.......100000000001......", "....................023332222200000002100010000001......", "................0223222232220020.....0000001111100......", "............0223200.020200200..020...1000000000000......", "........0023320....00.2.0020.0....2200000111110000......", "....0023321100...020.00.0.22.00....01000000001101.......", ".02232210000000.00..00..0.22..2....00001110000000.......", "02210000011100120...2...0.020.00..000000001110010.......", ".1000001100000010..00..00.020..2.010000000001001........", "..100110000100000002...00..22..02100011000000000........", "..0100000010000000100..0...22..0000000011000001.........", "...0000011000100000010020..22110000000001100010.........", "....000100001000000000000112210000000000000010..........", ".....1000001000100000000000122000001000000010...........", ".....010001000100001000000002200000010000010............", "......0100000100000100010000221010000100010.............", "........0000100000100010001012100100001000..............", ".........10000000010001000101220010000000...............", "..........000000010000100010022000100000................", "...........0000001000100001002200000000.................", "............00100000010000100221000010..................", "...............001000000000001210010....................", "..................0010000000012210......................", ".....................000000000220.......................", "..............................020.......................", "..............................022.......................", "...............................23.......................", "...............................220......................", "...............................220......................", "...............................022......................", "...............................023......................", "................................220.....................", "................................222.....................", "...............................03233222000..............", "..............................0232220..0222220..........", "............................0200222002.0000010..........", "...........................00..00220002001110...........", ".........................0210.0.00202.0100000...........", "........................0210100.202000001101............", ".......................21010010.2.2201010010............", ".......................01000100110221101101.............", "........................010101101022101001..............", ".........................0000101011211110...............", "..........................01010101122010................", "............................0001010220..................", "................................000222..................", "...................................022..................", "...................................023..................", "....................................220.................", "....................................222.................", "....................................022.................", "....................................0230................", ".....................................23.................", ".....................................0..................", "........................................................", "........................................................"]};

  // See-through layer over the whole window
  const c = document.createElement("canvas");
  c.id = "pixelFlyer";
  c.setAttribute("aria-hidden", "true");
  document.body.appendChild(c);
  const x = c.getContext("2d");

  // Small note that fades away after a few seconds
  const hint = document.createElement("div");
  hint.id = "pixelFlyerHint";
  hint.textContent = "Click anywhere to call the flyer over";
  document.body.appendChild(hint);
  setTimeout(function () { hint.classList.add("hide"); }, 5000);

  let PX, W, H;  // PX = how many screen pixels make one "pixel" of the art
  function size() {
    PX = innerWidth < 700 ? 1 : 2;  // smaller on phones
    W = Math.ceil(innerWidth / PX);
    H = Math.ceil(innerHeight / PX);
    c.width = W; c.height = H;
    x.imageSmoothingEnabled = false;
  }
  addEventListener("resize", size);
  size();

  // Build the sprite once from the pixel rows
  const sw = SPR.rows[0].length, sh = SPR.rows.length;
  const sp = document.createElement("canvas");
  sp.width = sw; sp.height = sh;
  const sx = sp.getContext("2d");
  SPR.rows.forEach(function (r, y) {
    [...r].forEach(function (ch, i) {
      if (ch !== ".") { sx.fillStyle = SPR.pal[+ch]; sx.fillRect(i, y, 1, 1); }
    });
  });

  // The flyer
  const f = { x: W * 0.2, y: H * 0.4, vx: 0.6, vy: 0, tx: 0, ty: 0, dir: 1, t: 0, a: 0 };
  function newTarget() {
    f.tx = sw / 2 + Math.random() * Math.max(1, W - sw);
    f.ty = sh / 2 + Math.random() * Math.max(1, H - sh);
  }
  newTarget();

  const trail = [], sparks = [];
  let manual = 0;

  // Clicks anywhere on the page call it over (the page still gets the click too)
  document.addEventListener("pointerdown", function (e) {
    f.tx = e.clientX / PX; f.ty = e.clientY / PX; manual = 90;
    for (let i = 0; i < 14; i++) {
      sparks.push({ x: f.tx, y: f.ty, vx: (Math.random() - 0.5) * 1.4, vy: (Math.random() - 0.5) * 1.4, l: 30 });
    }
    hint.classList.add("hide");
  });

  function step() {
    f.t++;
    const dx = f.tx - f.x, dy = f.ty - f.y, d = Math.hypot(dx, dy) || 1;
    if (d < 10 && manual <= 0) newTarget();
    if (manual > 0) manual--;
    const max = manual > 0 ? 1.6 : 0.9;
    f.vx += dx / d * 0.04; f.vy += dy / d * 0.04;
    f.vy += Math.sin(f.t * 0.05) * 0.01;
    const s = Math.hypot(f.vx, f.vy);
    if (s > max) { f.vx *= max / s; f.vy *= max / s; }
    f.x += f.vx; f.y += f.vy;
    if (Math.abs(f.vx) > 0.15) f.dir = f.vx > 0 ? 1 : -1;
    f.a += ((f.vy * 0.35 + f.vx * 0.08 * f.dir) - f.a) * 0.08;
    if (f.t % 3 === 0) trail.push({ x: f.x, y: f.y + sh * 0.35, l: 40 });
  }

  function draw() {
    x.clearRect(0, 0, W, H);  // transparent, so the page shows through
    // soft orange trail (white wouldn't show on the light page)
    trail.forEach(function (p) {
      x.fillStyle = "rgba(233,118,63," + (p.l / 80) + ")";
      x.fillRect(p.x | 0, p.y | 0, 1, 1); p.l--;
    });
    while (trail.length && trail[0].l <= 0) trail.shift();
    sparks.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.l--;
      x.fillStyle = p.l % 6 < 3 ? "#f2c94c" : "#e9763f";
      x.fillRect(p.x | 0, p.y | 0, 1, 1);
    });
    for (let i = sparks.length - 1; i >= 0; i--) if (sparks[i].l <= 0) sparks.splice(i, 1);
    // flutter
    const flap = 1 + Math.sin(f.t * 0.3) * 0.07;
    x.save();
    x.translate(Math.round(f.x), Math.round(f.y));
    x.rotate(Math.round(f.a * 8) / 8 * f.dir);  // stepped rotation keeps it chunky
    x.scale(f.dir * flap, 1 / flap);
    x.drawImage(sp, -sw / 2 | 0, -sh / 2 | 0);
    x.restore();
  }

  (function loop() { step(); draw(); requestAnimationFrame(loop); })();
})();
