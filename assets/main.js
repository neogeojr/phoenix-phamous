/* =========================================================================
   Phoenix Phamous — site behaviour
   - mobile nav toggle
   - footer year
   - scroll reveal (respects prefers-reduced-motion)
   - booking form: client validation + mailto: hand-off
   ========================================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("primary-nav");

  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- scroll reveal ---------- */
  var revealables = document.querySelectorAll(".reveal");
  if (revealables.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- booking form ---------- */
  var form = document.getElementById("booking-form");
  if (!form) return;

  var BOOKING_EMAIL = "booking@phoenixphamous.com";
  var summary = document.getElementById("error-summary");
  var summaryList = document.getElementById("error-summary-list");
  var status = document.getElementById("form-status");

  var FIELDS = [
    { id: "act", label: "Act / band name", required: true },
    { id: "genre", label: "Genre / style", required: true },
    { id: "city", label: "Home city", required: true },
    { id: "email", label: "Contact email", required: true, type: "email" },
    { id: "phone", label: "Phone", required: false },
    { id: "links", label: "Link to music / EPK", required: true, type: "url" },
    { id: "date", label: "Preferred month or date", required: false },
    { id: "draw", label: "Typical local draw", required: false },
    { id: "message", label: "About the act", required: true }
  ];

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function fieldError(id, msg) {
    var input = document.getElementById(id);
    var errEl = document.getElementById(id + "-error");
    if (!input || !errEl) return;
    if (msg) {
      input.setAttribute("aria-invalid", "true");
      errEl.textContent = msg;
    } else {
      input.removeAttribute("aria-invalid");
      errEl.textContent = "";
    }
  }

  function validateField(f) {
    var input = document.getElementById(f.id);
    if (!input) return null;
    var value = input.value.trim();

    if (f.required && !value) {
      return f.label + " is required.";
    }
    if (value && f.type === "email" && !EMAIL_RE.test(value)) {
      return "Enter a valid email address.";
    }
    if (value && f.type === "url" && !/^https?:\/\/.+/i.test(value)) {
      return "Include a full link starting with http:// or https://";
    }
    return null;
  }

  FIELDS.forEach(function (f) {
    var input = document.getElementById(f.id);
    if (!input) return;
    input.addEventListener("blur", function () {
      fieldError(f.id, validateField(f));
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";

    var errors = [];
    FIELDS.forEach(function (f) {
      var msg = validateField(f);
      fieldError(f.id, msg);
      if (msg) errors.push({ id: f.id, label: f.label, msg: msg });
    });

    if (errors.length) {
      summaryList.innerHTML = "";
      errors.forEach(function (err) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + err.id;
        a.textContent = err.msg;
        a.addEventListener("click", function (ev) {
          ev.preventDefault();
          var target = document.getElementById(err.id);
          if (target) target.focus();
        });
        li.appendChild(a);
        summaryList.appendChild(li);
      });
      summary.hidden = false;
      summary.focus();
      return;
    }

    summary.hidden = true;

    function val(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : "";
    }

    var act = val("act");
    var subject = "Booking pitch — " + act;
    var body = [
      "ACT / BAND: " + act,
      "GENRE: " + val("genre"),
      "HOME CITY: " + val("city"),
      "CONTACT EMAIL: " + val("email"),
      "PHONE: " + (val("phone") || "—"),
      "MUSIC / EPK: " + val("links"),
      "PREFERRED DATE: " + (val("date") || "flexible"),
      "TYPICAL LOCAL DRAW: " + (val("draw") || "—"),
      "",
      "ABOUT THE ACT:",
      val("message"),
      "",
      "— Sent from phoenixphamous.com booking form"
    ].join("\n");

    var href =
      "mailto:" + BOOKING_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    window.location.href = href;

    status.textContent =
      "Opening your email app with the pitch ready to send. If nothing happened, " +
      "email " + BOOKING_EMAIL + " directly with the same details.";
  });
})();
