// PROJECT PAGES: updates the "01 — 03" counter as each image or demo scrolls into view.
(function () {
  var counter = document.querySelector(".project-counter");
  var items = document.querySelectorAll(".project-media > [data-media]");
  if (!counter || items.length < 2 || !("IntersectionObserver" in window)) {
    if (counter) counter.hidden = true;
    return;
  }

  function pad(n) { return String(n).padStart(2, "0"); }
  var total = pad(items.length);
  counter.textContent = "01 — " + total;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var i = Array.prototype.indexOf.call(items, entry.target);
        counter.textContent = pad(i + 1) + " — " + total;
      }
    });
  }, { rootMargin: "-40% 0px -40% 0px" });   // counts an item when it crosses the middle of the screen

  items.forEach(function (el) { observer.observe(el); });
})();
