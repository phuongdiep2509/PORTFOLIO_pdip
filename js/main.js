(function () {
  "use strict";

  var doc = document;
  var data = window.PORTFOLIO || { skills: [], projects: [], contact: {} };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- Hero wordmark: tách chữ để hiện lần lượt ---------- */
  (function buildWordmark() {
    var host = doc.querySelector(".hero__word-inner");
    if (!host) return;
    "Portfolio".split("").forEach(function (c, i) {
      var wrap = el("span", "ch");
      var inner = el("i", null, c);
      wrap.style.setProperty("--i", i);
      wrap.appendChild(inner);
      host.appendChild(wrap);
    });
  })();

  /* ---------- Skills ---------- */
  (function renderSkills() {
    var list = doc.getElementById("skillTags");
    if (!list) return;
    if (!data.skills.length) { list.parentNode.hidden = true; return; }
    data.skills.forEach(function (s) {
      var li = el("li", "tag", s);
      li.tabIndex = 0;
      list.appendChild(li);
    });
  })();

  /* ---------- Projects ---------- */
  var grid = doc.getElementById("projectGrid");
  var modal = doc.getElementById("modal");
  var modalBody = doc.getElementById("modalBody");
  var modalPanel = doc.getElementById("modalPanel");
  var lastFocus = null;

  function listBlock(title, items) {
    if (!items || !items.length) return null;
    var box = el("div");
    box.appendChild(el("h4", null, title));
    var ul = el("ul", "list");
    items.forEach(function (t) { ul.appendChild(el("li", null, t)); });
    box.appendChild(ul);
    return box;
  }

  function toolsBlock(tools) {
    if (!tools || !tools.length) return null;
    var ul = el("ul", "pcard__tools");
    tools.forEach(function (t) { ul.appendChild(el("li", null, t)); });
    return ul;
  }

  function openProject(p, trigger) {
    lastFocus = trigger || doc.activeElement;
    modalBody.textContent = "";
    modalBody.appendChild(el("h3", null, p.name)).id = "modalTitle";
    if (p.overview) modalBody.appendChild(el("p", null, p.overview));
    [
      listBlock("Mục tiêu", p.objectives),
      listBlock("Vai trò và đóng góp", p.responsibilities)
    ].forEach(function (b) { if (b) modalBody.appendChild(b); });
    if (p.tools && p.tools.length) {
      modalBody.appendChild(el("h4", null, "Công cụ"));
      modalBody.appendChild(toolsBlock(p.tools));
    }
    var out = listBlock("Kết quả bàn giao", p.outcomes);
    if (out) modalBody.appendChild(out);
    if (p.links && p.links.length) {
      var wrapLinks = el("div", "modal__links");
      p.links.forEach(function (l) {
        var a = el("a", "btn btn--solid", l.label);
        a.href = l.url; a.target = "_blank"; a.rel = "noopener";
        wrapLinks.appendChild(a);
      });
      modalBody.appendChild(wrapLinks);
    }
    modal.hidden = false;
    doc.body.style.overflow = "hidden";
    modalPanel.focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    doc.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  (function renderProjects() {
    if (!grid) return;
    if (!data.projects.length) {
      var empty = el("div", "projects__empty");
      empty.setAttribute("data-reveal", "");
      empty.innerHTML =
        '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M6 14 Q6 6 14 6 H42 Q50 6 52 14 H104 Q114 14 114 24 V76 Q114 84 106 84 H14 Q6 84 6 76 Z" fill="none" stroke="#346c9a" stroke-width="3" stroke-dasharray="7 6" stroke-linejoin="round"/></svg>';
      var txt = el("div");
      txt.appendChild(el("h3", null, "Dự án đang được cập nhật"));
      txt.appendChild(el("p", null, "Các dự án Business Analysis sẽ xuất hiện tại đây khi được bổ sung."));
      empty.appendChild(txt);
      grid.appendChild(empty);
      return;
    }
    data.projects.forEach(function (p, i) {
      var card = el("button", "pcard");
      card.type = "button";
      card.setAttribute("data-reveal", "");
      card.style.setProperty("--d", i * 90 + "ms");
      card.appendChild(el("h3", "pcard__name", p.name));
      if (p.overview) card.appendChild(el("p", "pcard__text", p.overview));
      var tb = toolsBlock(p.tools);
      if (tb) card.appendChild(tb);
      card.addEventListener("click", function () { openProject(p, card); });
      grid.appendChild(card);
    });
  })();

  modal.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) closeModal(); });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeModal(); closeMenu(); }
    if (e.key === "Tab" && !modal.hidden) {
      var f = modalPanel.querySelectorAll("a[href], button");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (doc.activeElement === first || doc.activeElement === modalPanel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Contact ---------- */
  (function renderContact() {
    var list = doc.getElementById("contactList");
    var c = data.contact || {};
    var icons = {
      pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>',
      mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2L4.5 7v.2L12 12.4 19.5 7.2V7L12 12.2Z"/></svg>',
      phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 2h3l1.4 4.6-2 1.5a12 12 0 0 0 5.9 5.9l1.5-2 4.6 1.4v3A2.6 2.6 0 0 1 18 18.8 16.8 16.8 0 0 1 5.2 6 2.6 2.6 0 0 1 6.6 2Z"/></svg>',
      linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 9h3v12H3V9Zm6 0h2.9v1.7c.5-1 1.800-1.900 3.600-1.900 3.300 0 3.900 2.100 3.900 4.900V21h-3v-6.500c0-1.500 0-3.200-2-3.200s-2.400 1.400-2.400 3.100V21H9V9Z"/></svg>',
      github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.200 19.500c.5.1.7-.2.7-.5v-1.800c-2.800.6-3.400-1.200-3.400-1.200-.5-1.200-1.100-1.500-1.100-1.500-.9-.6.1-.6.1-.6 1 .1 1.600 1.100 1.600 1.100.9 1.500 2.400 1.100 3 .8.1-.7.4-1.100.7-1.400-2.200-.3-4.600-1.100-4.600-5 0-1.100.4-2 1-2.700-.1-.3-.5-1.300.1-2.700 0 0 .8-.3 2.700 1a9.400 9.400 0 0 1 5 0c1.900-1.300 2.700-1 2.700-1 .6 1.400.2 2.400.1 2.700.6.700 1 1.600 1 2.700 0 3.900-2.400 4.700-4.600 5 .4.300.7.900.7 1.800v2.700c0 .3.200.6.700.5A10 10 0 0 0 12 2Z"/></svg>'
    };
    function item(icon, label, href, newTab) {
      var node = href ? el("a") : el("span");
      node.innerHTML = icons[icon];
      node.appendChild(doc.createTextNode(label));
      if (href) { node.href = href; if (newTab) { node.target = "_blank"; node.rel = "noopener"; } }
      var li = el("li");
      li.appendChild(node);
      list.appendChild(li);
    }
    if (c.location) item("pin", c.location);
    if (c.email) item("mail", c.email, "mailto:" + c.email);
    if (c.phone) item("phone", c.phone, "tel:" + c.phone.replace(/[^\d+]/g, ""));
    if (c.linkedin) item("linkedin", "LinkedIn", c.linkedin, true);
    if (c.github) item("github", "GitHub", c.github, true);
  })();

  /* ---------- Navigation ---------- */
  var nav = doc.getElementById("nav");
  var toggle = doc.getElementById("navToggle");
  var menu = doc.getElementById("navMenu");

  function closeMenu() {
    if (!menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Mở menu");
    doc.body.style.overflow = "";
  }
  toggle.addEventListener("click", function () {
    var open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    doc.body.style.overflow = open ? "hidden" : "";
  });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  window.addEventListener("resize", function () { if (window.innerWidth > 820) closeMenu(); });

  /* Menu trên mobile ẩn khỏi bàn phím khi đóng */
  var mq = window.matchMedia("(max-width: 820px)");
  function syncInert() { if (mq.matches && !menu.classList.contains("is-open")) menu.setAttribute("inert", ""); else menu.removeAttribute("inert"); }
  new MutationObserver(syncInert).observe(menu, { attributes: true, attributeFilter: ["class"] });
  mq.addEventListener("change", syncInert); syncInert();

  /* Active section */
  var links = {};
  doc.querySelectorAll("[data-link]").forEach(function (a) { links[a.getAttribute("data-link")] = a; });
  var sections = ["intro", "about", "skills", "projects", "contact"].map(function (id) { return doc.getElementById(id); });

  function setActive(id) {
    Object.keys(links).forEach(function (k) {
      var on = k === id;
      links[k].classList.toggle("is-active", on);
      if (on) links[k].setAttribute("aria-current", "true"); else links[k].removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }
  setActive("intro");

  /* ---------- Scroll reveal ---------- */
  var revealEls = doc.querySelectorAll("[data-reveal]");
  doc.querySelectorAll(".about__right .block, .tags").forEach(function (n, i) { n.style.setProperty("--d", i * 100 + "ms"); });
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (n) { io.observe(n); });
    // các thẻ kỹ năng hiện lần lượt
    doc.querySelectorAll(".tag").forEach(function (t, i) { t.style.transitionDelay = ""; });
  } else {
    revealEls.forEach(function (n) { n.classList.add("is-in"); });
  }

  /* ---------- Nav compact + parallax ---------- */
  var parallaxEls = Array.prototype.slice.call(doc.querySelectorAll("[data-depth]"));
  var mouse = { x: 0, y: 0 }, ticking = false;

  function frame() {
    ticking = false;
    var y = window.scrollY;
    nav.classList.toggle("is-compact", y > 40);
    if (reduceMotion) return;
    parallaxEls.forEach(function (n) {
      var d = parseFloat(n.getAttribute("data-depth"));
      var r = n.getBoundingClientRect();
      var off = (r.top + r.height / 2 - window.innerHeight / 2) * d * -1;
      var mx = mouse.x * d * 220, my = mouse.y * d * 160;
      n.style.translate = (mx).toFixed(1) + "px " + (off + my).toFixed(1) + "px";
    });
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  window.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    mouse.x = e.clientX / window.innerWidth - .5;
    mouse.y = e.clientY / window.innerHeight - .5;
    request();
  }, { passive: true });
  frame();

  /* ---------- Micro-interaction: gợn sóng khi bấm nút ---------- */
  doc.addEventListener("pointerdown", function (e) {
    var b = e.target.closest(".btn");
    if (!b || reduceMotion) return;
    var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
    var rip = el("span", "ripple");
    rip.style.cssText = "width:" + s + "px;height:" + s + "px;left:" + (e.clientX - r.left - s / 2) + "px;top:" + (e.clientY - r.top - s / 2) + "px";
    b.appendChild(rip);
    setTimeout(function () { rip.remove(); }, 600);
  });

  doc.documentElement.classList.remove("no-js");
})();
