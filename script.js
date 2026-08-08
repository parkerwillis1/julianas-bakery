/* ==========================================================================
   J BAKE CO. | site behaviour
   Vanilla JS, no dependencies. Loaded on every page; each block no-ops when
   the elements it needs aren't present.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav__toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    // Close the menu after tapping a link (same-page anchors, mostly)
    links.addEventListener("click", function (e) {
      if (e.target.closest(".nav__link")) {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Active nav state ----------
     The markup already ships with .is-active, but the page can be reached as
     "/designs", "/designs.html" or "/designs/", and hosts that serve pretty
     URLs (Netlify does) rewrite href="designs.html" to href="/designs". So
     reduce both sides to a bare page key before comparing. */
  function pageKey(path) {
    // drop query/hash, then any trailing slash so "/about/" reads as "about"
    var clean = String(path).split("?")[0].split("#")[0].replace(/\/+$/, "");
    var last = clean.split("/").pop();
    if (!last) return "index"; // "" or "/"
    return last.replace(/\.html$/, "");
  }

  function initActiveNav() {
    var here = pageKey(window.location.pathname);

    var links = document.querySelectorAll(".nav__link");
    var matched = false;

    links.forEach(function (link) {
      var isMatch = pageKey(link.getAttribute("href")) === here;
      link.classList.toggle("is-active", isMatch);
      if (isMatch) {
        link.setAttribute("aria-current", "page");
        matched = true;
      } else {
        link.removeAttribute("aria-current");
      }
    });

    // Unknown path, fall back to Home so the nav is never left blank
    if (!matched && links.length) {
      links[0].classList.add("is-active");
      links[0].setAttribute("aria-current", "page");
    }
  }

  /* ---------- Fade-in on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    // No IntersectionObserver (or reduced motion): just show everything.
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ======================================================================
     DESIGNS PAGE | render the grid from CAKE_DESIGNS (designs-data.js)
     ====================================================================== */

  function initDesigns() {
    var grid = document.getElementById("designs-grid");
    if (!grid) return;

    if (typeof CAKE_DESIGNS === "undefined" || !Array.isArray(CAKE_DESIGNS)) {
      grid.innerHTML =
        '<p class="empty">Cake data failed to load. Check designs-data.js.</p>';
      return;
    }

    var empty = document.getElementById("designs-empty");
    var filterBar = document.getElementById("filters");

    // Newest first. Copy the array so the source data keeps its own order.
    var cakes = CAKE_DESIGNS.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    // "14 June 2026", falls back to the raw string if the date won't parse
    function formatDate(value) {
      var d = new Date(value);
      if (isNaN(d)) return value || "";
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC", // keep YYYY-MM-DD from drifting a day west of UTC
      });
    }

    function escapeHTML(str) {
      return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c];
      });
    }

    // A cake may carry `images: [...]` or a single legacy `image: "..."`
    function photosOf(cake) {
      if (Array.isArray(cake.images) && cake.images.length) return cake.images;
      return cake.image ? [cake.image] : [];
    }

    function tagsHTML(tags) {
      return tags
        .map(function (t) { return '<span class="tag">' + escapeHTML(t) + "</span>"; })
        .join("");
    }

    function cardHTML(cake, index) {
      var tags = Array.isArray(cake.tags) ? cake.tags : [];
      var cover = photosOf(cake)[0] || "";

      return (
        '<article class="card card--clickable reveal" data-index="' + index +
          '" tabindex="0" role="button" aria-label="View ' + escapeHTML(cake.title) + '">' +
          '<div class="card__media">' +
            '<img src="' + escapeHTML(cover) + '" alt="' + escapeHTML(cake.title) +
              '" loading="lazy" width="800" height="1000">' +
          "</div>" +
          '<div class="card__body">' +
            '<h2 class="card__title">' + escapeHTML(cake.title) + "</h2>" +
            '<p class="card__text">' + escapeHTML(cake.description) + "</p>" +
            '<div class="design__meta">' +
              '<span class="design__date">' + escapeHTML(formatDate(cake.date)) + "</span>" +
              '<div class="tags">' + tagsHTML(tags) + "</div>" +
            "</div>" +
          "</div>" +
        "</article>"
      );
    }

    // `visible` maps a rendered card's data-index back to the cake it came from
    var visible = [];

    function render(filter) {
      visible =
        filter === "All"
          ? cakes.slice()
          : cakes.filter(function (c) {
              return Array.isArray(c.tags) && c.tags.indexOf(filter) !== -1;
            });

      grid.innerHTML = visible.map(cardHTML).join("");
      if (empty) empty.hidden = visible.length > 0;

      // Newly injected cards need to be picked up by the reveal observer
      initReveal();
    }

    render("All");

    /* ---------- Detail overlay ---------- */
    initDetail(grid, function (index) { return visible[index]; }, {
      photosOf: photosOf,
      tagsHTML: tagsHTML,
      formatDate: formatDate,
      escapeHTML: escapeHTML,
    });

    if (filterBar) {
      filterBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".filter");
        if (!btn) return;

        filterBar.querySelectorAll(".filter").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });

        render(btn.dataset.filter);
      });
    }
  }

  /* ======================================================================
     CAKE DETAIL OVERLAY
     Slideshow of the cake's photos, with its ingredients underneath.
     ====================================================================== */

  function initDetail(grid, cakeAt, helpers) {
    var root = document.getElementById("cake-detail");
    if (!root) return;

    var panel = root.querySelector(".detail__panel");
    var shell = document.getElementById("detail-slideshow");
    var track = document.getElementById("detail-track");
    var dots = document.getElementById("detail-dots");
    var prev = root.querySelector(".slideshow__nav--prev");
    var next = root.querySelector(".slideshow__nav--next");
    var elDate = document.getElementById("detail-date");
    var elTitle = document.getElementById("detail-title");
    var elTags = document.getElementById("detail-tags");
    var elDesc = document.getElementById("detail-desc");
    var elIngWrap = document.getElementById("detail-ingredients-wrap");
    var elIng = document.getElementById("detail-ingredients");

    var slideCount = 0;
    var current = 0;
    var lastFocused = null;

    function goTo(i) {
      if (!slideCount) return;
      current = (i + slideCount) % slideCount; // wrap at both ends
      track.style.transform = "translateX(" + -current * 100 + "%)";
      Array.prototype.forEach.call(dots.children, function (d, n) {
        d.classList.toggle("is-active", n === current);
        d.setAttribute("aria-selected", String(n === current));
      });
    }

    function open(index) {
      var cake = cakeAt(index);
      if (!cake) return;

      var photos = helpers.photosOf(cake);
      var tags = Array.isArray(cake.tags) ? cake.tags : [];
      var ing = Array.isArray(cake.ingredients) ? cake.ingredients : [];

      track.innerHTML = photos
        .map(function (src, n) {
          return (
            '<div class="slideshow__slide">' +
              '<img src="' + helpers.escapeHTML(src) + '" alt="' +
                helpers.escapeHTML(cake.title) + ", photo " + (n + 1) + '"' +
                (n === 0 ? "" : ' loading="lazy"') + ">" +
            "</div>"
          );
        })
        .join("");

      dots.innerHTML = photos
        .map(function (_, n) {
          return '<button class="slideshow__dot" type="button" role="tab" ' +
            'aria-label="Photo ' + (n + 1) + '" data-slide="' + n + '"></button>';
        })
        .join("");

      slideCount = photos.length;
      shell.classList.toggle("is-single", slideCount < 2);

      elDate.textContent = helpers.formatDate(cake.date);
      elTitle.textContent = cake.title;
      elTags.innerHTML = helpers.tagsHTML(tags);
      elDesc.textContent = cake.description || "";

      // ingredients are optional
      elIngWrap.hidden = ing.length === 0;
      elIng.innerHTML = ing
        .map(function (x) { return "<li>" + helpers.escapeHTML(x) + "</li>"; })
        .join("");

      // jump to the first slide without animating in from the previous cake
      track.style.transition = "none";
      goTo(0);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { track.style.transition = ""; });
      });

      lastFocused = document.activeElement;
      root.hidden = false;
      document.body.style.overflow = "hidden";
      panel.scrollTop = 0;
      panel.focus();
    }

    function close() {
      root.hidden = true;
      document.body.style.overflow = "";
      track.innerHTML = "";
      dots.innerHTML = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    // open from a card, by click or keyboard
    grid.addEventListener("click", function (e) {
      var card = e.target.closest(".card--clickable");
      if (card) open(Number(card.dataset.index));
    });
    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var card = e.target.closest(".card--clickable");
      if (!card) return;
      e.preventDefault();
      open(Number(card.dataset.index));
    });

    // close via the X or the backdrop
    root.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) close();
    });

    prev.addEventListener("click", function () { goTo(current - 1); });
    next.addEventListener("click", function () { goTo(current + 1); });
    dots.addEventListener("click", function (e) {
      var dot = e.target.closest(".slideshow__dot");
      if (dot) goTo(Number(dot.dataset.slide));
    });

    document.addEventListener("keydown", function (e) {
      if (root.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") goTo(current - 1);
      else if (e.key === "ArrowRight") goTo(current + 1);
    });
  }

  /* ======================================================================
     CONTACT PAGE | no backend; swap the form for a thank-you panel
     ====================================================================== */

  function initForm() {
    var form = document.getElementById("order-form");
    var thanks = document.getElementById("order-thanks");
    if (!form || !thanks) return;

    // TODO: wire up Formspree, add action="https://formspree.io/f/YOUR_FORM_ID"
    // and method="POST" to #order-form in contact.html. Once an action is set
    // we step aside and let the browser post the form for real.
    if (form.getAttribute("action")) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Let the browser show its own messages for required fields
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      form.hidden = true;
      thanks.hidden = false;
      thanks.focus();
      thanks.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ---------- Boot ---------- */
  function init() {
    initNav();
    initActiveNav();
    initYear();
    initDesigns();
    initForm();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
