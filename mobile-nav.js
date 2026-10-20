/* Phone menu: under 900 px the top links don't fit, so a ☰ button opens a panel with all of them
   (Modules, Pricing, Changelog, Buy). The links are cloned from the page's own .nav-links, so every
   page keeps its own targets and its highlighted item. Styles live in fonts.css (shared by every page). */
(() => {
  const nav = document.querySelector("header.nav");
  const links = nav && nav.querySelector(".nav-links");
  if (!links) return;
  const wrap = nav.querySelector(".wrap") || nav;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mnav-btn";
  btn.setAttribute("aria-label", "Menu");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "mnav-panel");
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="l1" d="M4 7h16"/><path class="l2" d="M4 12h16"/><path class="l3" d="M4 17h16"/></svg>';

  const panel = document.createElement("nav");
  panel.id = "mnav-panel";
  panel.className = "mnav-panel";
  panel.setAttribute("aria-label", "Menu");
  panel.hidden = true;
  links.querySelectorAll("a").forEach(a => {
    const c = a.cloneNode(true);
    c.removeAttribute("class");
    if (a.classList.contains("on")) c.className = "on";
    panel.appendChild(c);
  });

  wrap.appendChild(btn);
  nav.appendChild(panel);
  document.documentElement.classList.add("has-mnav");

  const setOpen = open => {
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("mnav-open", open);
  };
  btn.addEventListener("click", e => { e.stopPropagation(); setOpen(panel.hidden); });
  panel.addEventListener("click", e => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("click", e => { if (!panel.hidden && !nav.contains(e.target)) setOpen(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) { setOpen(false); btn.focus(); } });
  matchMedia("(min-width: 901px)").addEventListener("change", m => { if (m.matches) setOpen(false); });
})();
