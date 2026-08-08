/* ==========================================================================
   J BAKE CO. — site behaviour
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

    // Unknown path — fall back to Home so the nav is never left blank
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
     DESIGNS PAGE — render the grid from CAKE_DESIGNS (designs-data.js)
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

    // "14 June 2026" — falls back to the raw string if the date won't parse
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

    function cardHTML(cake) {
      var tags = Array.isArray(cake.tags) ? cake.tags : [];
      var tagHTML = tags
        .map(function (t) { return '<span class="tag">' + escapeHTML(t) + "</span>"; })
        .join("");

      return (
        '<article class="card reveal" data-tags="' + escapeHTML(tags.join("|")) + '">' +
          '<div class="card__media">' +
            '<img src="' + escapeHTML(cake.image) + '" alt="' + escapeHTML(cake.title) +
              '" loading="lazy" width="800" height="1000">' +
          "</div>" +
          '<div class="card__body">' +
            '<h2 class="card__title">' + escapeHTML(cake.title) + "</h2>" +
            '<p class="card__text">' + escapeHTML(cake.description) + "</p>" +
            '<div class="design__meta">' +
              '<span class="design__date">' + escapeHTML(formatDate(cake.date)) + "</span>" +
              '<div class="tags">' + tagHTML + "</div>" +
            "</div>" +
          "</div>" +
        "</article>"
      );
    }

    function render(filter) {
      var list =
        filter === "All"
          ? cakes
          : cakes.filter(function (c) {
              return Array.isArray(c.tags) && c.tags.indexOf(filter) !== -1;
            });

      grid.innerHTML = list.map(cardHTML).join("");
      if (empty) empty.hidden = list.length > 0;

      // Newly injected cards need to be picked up by the reveal observer
      initReveal();
    }

    render("All");

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
     CONTACT PAGE — no backend; swap the form for a thank-you panel
     ====================================================================== */

  function initForm() {
    var form = document.getElementById("order-form");
    var thanks = document.getElementById("order-thanks");
    if (!form || !thanks) return;

    // TODO: wire up Formspree — add action="https://formspree.io/f/YOUR_FORM_ID"
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
