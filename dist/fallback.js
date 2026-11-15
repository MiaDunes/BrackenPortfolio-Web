// FALLBACK MESSAGES
// Some pieces on this site load outside tools (D3 and p5.js) or a data file.
// If one of those fails, its box would just sit empty. This script checks each
// box a few seconds after the page loads and, if nothing was drawn, shows a
// friendly message with a "Try again" button instead.
// It uses no outside libraries, so it keeps working even when they fail.
(function () {
  // Each entry: the box to watch, how to tell it worked, and what to call it
  var watched = [
    { id: "chart",        drawn: function (el) { return el.querySelector("svg circle, svg path.line, svg .line"); }, name: "chart" },
    { id: "movieSpheres", drawn: function (el) { return el.querySelector("canvas"); }, name: "3D sketch" },
    { id: "squareRotate", drawn: function (el) { return el.querySelector("canvas"); }, name: "sketch" },
    { id: "picBrain",     drawn: function (el) { return el.querySelector("canvas"); }, name: "sketch" },
    { id: "p5-sketch",    drawn: function (el) { return el.querySelector("canvas"); }, name: "sketch" }
  ];

  var WAIT_MS = 5000;  // give slow connections time before deciding something failed

  function showMessage(el, name) {
    if (el.querySelector(".load-fallback")) return;
    // Hide anything half-drawn (for example an empty chart frame)
    Array.prototype.forEach.call(el.children, function (child) { child.style.display = "none"; });

    var box = document.createElement("div");
    box.className = "load-fallback";
    box.setAttribute("role", "status");

    var msg = document.createElement("p");
    msg.textContent = "This " + name + " couldn’t load right now. It may be a slow connection.";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cta-button";
    btn.textContent = "Try again";
    btn.addEventListener("click", function () { window.location.reload(); });

    box.appendChild(msg);
    box.appendChild(btn);
    el.appendChild(box);
  }

  function check() {
    watched.forEach(function (item) {
      var el = document.getElementById(item.id);
      if (el && !item.drawn(el)) showMessage(el, item.name);
    });
  }

  window.addEventListener("load", function () {
    setTimeout(check, WAIT_MS);
  });
})();
