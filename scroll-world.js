// Scroll-driven camera for the "Recorrido por la misión" section: scroll position
// moves a camera across the illustrated world and cross-fades one hero per scene.
(function () {
  var C = [[520, 560], [1300, 420], [2100, 600], [2520, 1200], [1720, 1360], [900, 1260]];
  var F = [[20, 0], [10, -20], [0, -10], [0, 10], [20, 10], [10, 20]];
  var UNIT = 700, STEP = 1.7, T = 6 + 5 * 0.7;

  var track = document.querySelector('[data-sw-track]');
  var stage = document.getElementById('sw-stage');
  var plane = document.getElementById('sw-plane');
  var bar = document.getElementById('sw-bar');
  var hint = document.getElementById('sw-hint');
  if (!track || !stage || !plane) return;
  var heroes = stage.querySelectorAll('[data-hero]');
  var railButtons = stage.querySelectorAll('.sw-rail button[data-i]');
  var anchors = track.querySelectorAll('[data-card]');

  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function lerp(a, b, t) {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, s: Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * t) };
  }
  function est(i) { return { x: C[i][0], y: C[i][1] - 10, s: 1.2 }; }
  function inside(i) { return { x: C[i][0] + F[i][0], y: C[i][1] + F[i][1], s: 2.6 }; }
  function camAt(u) {
    var wide = { x: 1500, y: 900, s: 0.42 };
    if (u <= 0) return wide;
    for (var i = 0; i < 6; i++) {
      var s0 = i * STEP;
      if (u < s0 + 1) return lerp(i === 0 ? wide : est(i), inside(i), ease(Math.max(0, u - s0)));
      if (i < 5 && u < s0 + STEP) {
        var t = (u - s0 - 1) / (STEP - 1);
        var mid = { x: (C[i][0] + C[i + 1][0]) / 2, y: (C[i][1] + C[i + 1][1]) / 2, s: 0.75 };
        return t < 0.5 ? lerp(inside(i), mid, ease(t * 2)) : lerp(mid, est(i + 1), ease(t * 2 - 1));
      }
    }
    return inside(5);
  }

  var cur = 0, target = 0, raf = 0, active = -1;

  function measure() {
    target = Math.max(0, Math.min(T, -track.getBoundingClientRect().top / UNIT));
  }

  function apply() {
    var u = cur;
    var vw = stage.clientWidth, vh = stage.clientHeight;
    var k = Math.min(vw / 1440, vh / 900);
    var desk = vw > 860;
    var px = desk ? vw * 0.62 : vw * 0.5, py = desk ? vh * 0.5 : vh * 0.32;
    var cam = camAt(u), s = cam.s * k;
    plane.style.transform = 'translate3d(' + (px - cam.x * s) + 'px,' + (py - cam.y * s) + 'px,0) scale(' + s + ')';
    if (bar) bar.style.width = (u / T * 100) + '%';
    if (hint) hint.style.opacity = u > 0.15 ? '0' : '1';

    for (var h = 0; h < heroes.length; h++) {
      var d = u - (h * STEP + 0.5);
      if ((h === 0 && d < 0) || (h === heroes.length - 1 && d > 0)) d = 0;
      var op = Math.max(0, Math.min(1, (0.85 - Math.abs(d)) / 0.25));
      heroes[h].style.opacity = String(op);
      heroes[h].style.transform = 'translateY(' + ((d > 0 ? -1 : 1) * (1 - op) * 28) + 'px)';
      heroes[h].style.visibility = op < 0.01 ? 'hidden' : 'visible';
    }

    var a = Math.min(5, Math.floor((u + 0.35) / STEP));
    if (a !== active) {
      active = a;
      for (var r = 0; r < railButtons.length; r++) {
        var on = r === a;
        railButtons[r].setAttribute('aria-current', on ? 'step' : 'false');
        railButtons[r].style.color = on ? '#695683' : '#414042';
        var dot = railButtons[r].querySelector('.sw-dot');
        if (dot) dot.style.background = on ? '#836AA3' : (r < a ? '#414042' : 'transparent');
      }
    }
  }

  function step() {
    raf = 0;
    cur += (target - cur) * 0.16;
    if (Math.abs(target - cur) < 0.0005) cur = target;
    apply();
    if (cur !== target) raf = requestAnimationFrame(step);
  }

  function onScroll() {
    measure();
    if (!raf) raf = requestAnimationFrame(step);
  }

  for (var b = 0; b < railButtons.length; b++) {
    railButtons[b].addEventListener('click', function (e) {
      var i = +e.currentTarget.getAttribute('data-i');
      if (anchors[i]) anchors[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  measure();
  cur = target;
  apply();
})();
