/* Smooth mouse-wheel scrolling: each wheel notch glides to its target with a short ease-out instead of
   jumping. Only discrete mouse wheels are handled; trackpads, touch, keyboard, scrollbar and inner
   scroll areas stay native. Off when the system asks for reduced motion. */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const root = document.scrollingElement || document.documentElement;
  const EASE = 0.20;              // share of the remaining distance covered per 60 Hz frame
  let target = null, pos = 0, raf = 0, last = 0;

  const maxY = () => root.scrollHeight - innerHeight;
  const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; target = null; };

  // An inner element (e.g. the toolbar panel) that can still scroll in this direction keeps the wheel.
  function innerScroller(el, dy) {
    for (; el && el !== root && el !== document.body; el = el.parentElement) {
      const o = getComputedStyle(el).overflowY;
      if ((o === "auto" || o === "scroll") && el.scrollHeight > el.clientHeight + 1) {
        if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
      }
    }
    return false;
  }

  function step(now) {
    // Something else moved the page (scrollbar drag, find-in-page): hand control back.
    if (Math.abs(root.scrollTop - pos) > 3) return stop();
    const k = 1 - Math.pow(1 - EASE, Math.min(now - last, 64) / 16.667);
    last = now;
    pos += (target - pos) * k;
    if (Math.abs(target - pos) < 0.5) pos = target;
    window.scrollTo({ top: pos, behavior: "instant" });
    if (pos === target) { raf = 0; target = null; return; }
    raf = requestAnimationFrame(step);
  }

  addEventListener("wheel", e => {
    if (e.ctrlKey || e.shiftKey || e.defaultPrevented || e.deltaX) return;
    let dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 40;
    else if (e.deltaMode === 2) dy *= innerHeight;
    else if (Math.abs(dy) < 50 || dy % 1) return;   // small or fractional steps = trackpad: native
    if (innerScroller(e.target, dy)) return;
    e.preventDefault();
    if (target === null) { pos = root.scrollTop; target = pos; last = performance.now(); }
    // Direction change: drop what was still left to travel the other way, so the page turns at once
    // (2026-10-26: reversing after a few quick notches kept gliding the old way first and felt unresponsive).
    else if ((target - pos) * dy < 0) target = pos;
    target = Math.max(0, Math.min(maxY(), target + dy));
    if (!raf) raf = requestAnimationFrame(step);
  }, { passive: false });

  // Clicks (menu links), keys and touch take over immediately.
  ["mousedown", "keydown", "touchstart"].forEach(t => addEventListener(t, stop, { passive: true }));
})();
