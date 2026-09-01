/* AIG - лендинг: шапка, меню, reveal, счётчики, форма -> WhatsApp */
(function () {
  "use strict";

  var WA = "77010702700";

  /* ---------- шапка: фон при скролле ---------- */
  var header = document.getElementById("header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- мобильное меню ---------- */
  var burger = document.getElementById("burger");
  var mMenu = document.getElementById("mMenu");
  function closeMenu() {
    document.body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  burger.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  });
  mMenu.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1080) closeMenu();
  });

  /* ---------- reveal-анимации ---------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("on");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("on"); });
  }

  /* ---------- линия пути проекта ---------- */
  var path = document.querySelector(".path");
  if (path) {
    if ("IntersectionObserver" in window && !reduced) {
      var ioPath = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            path.classList.add("line-on");
            ioPath.disconnect();
          }
        });
      }, { threshold: 0.25 });
      ioPath.observe(path);
    } else {
      path.classList.add("line-on");
    }
  }

  /* ---------- счётчики ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var space = el.getAttribute("data-space") === "1";
    var dur = 1400;
    var start = null;
    function fmt(n) {
      var s = String(n);
      if (space && n >= 1000) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      return s + suffix;
    }
    if (reduced) { el.textContent = fmt(target); return; }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var ioCnt = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCount(en.target);
          ioCnt.unobserve(en.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { ioCnt.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- форма -> WhatsApp ---------- */
  var form = document.getElementById("leadForm");
  var done = document.getElementById("formDone");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var phone = form.elements.phone.value.trim();
      if (!name || !phone) {
        (!name ? form.elements.name : form.elements.phone).focus();
        return;
      }
      var dir = form.elements.dir.value;
      var msg = form.elements.msg.value.trim();
      var text =
        "Здравствуйте! Заявка с лендинга AIG\n" +
        "Имя: " + name + "\n" +
        "Телефон: " + phone + "\n" +
        "Направление: " + dir +
        (msg ? "\nЗадача: " + msg : "");
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      done.hidden = false;
      form.reset();
    });
  }

  /* ---------- делегированные клики tel/WhatsApp (для будущих gtag-конверсий) ---------- */
  document.addEventListener("click", function (e) {
    var cta = e.target.closest("[data-cta]");
    if (!cta) return;
    var type = cta.getAttribute("data-cta"); /* "call" | "whatsapp" */
    if (typeof window.gtagSendEvent === "function") {
      window.gtagSendEvent(type);
    }
  });

  /* ---------- год в футере ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
