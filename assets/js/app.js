/* ==========================================================================
   Tabernacle of Prayer Parish — Ottawa
   Bilingual (EN/FR) + motion + interaction

   No dependencies. Everything here is chosen to stay light on older phones:
   a geometry check for reveals instead of a scroll library, CSS transforms
   instead of animated layout properties.
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* ---------------------------------------------------------------------
     rAF throttle
     A plain `if (pending) return` + requestAnimationFrame guard deadlocks:
     rAF does not fire while the document is hidden, so `pending` latches on
     and every later scroll is dropped even after the tab comes back. This
     runs the work synchronously when hidden, and clears the latch whenever
     visibility changes.
     --------------------------------------------------------------------- */
  function rafThrottle(fn) {
    var pending = false;
    var run = function () { pending = false; fn(); };

    document.addEventListener("visibilitychange", function () {
      pending = false;                 // never stay latched across a hide/show
      if (!document.hidden) fn();
    });

    return function () {
      if (document.hidden) { fn(); return; }   // rAF won't fire; just do it
      if (pending) return;
      pending = true;
      requestAnimationFrame(run);
    };
  }

  /* ---------------------------------------------------------------------
     i18n
     French copy is written, not machine-translated placeholder text. It runs
     roughly 15-20% longer than English, which the layout is built to absorb.
     --------------------------------------------------------------------- */
  var I18N = {
    en: {
      "meta.title": "Tabernacle of Prayer Parish — A church in Ottawa",
      "meta.desc": "A Spirit-filled church in Ottawa. Sunday worship 11am–1pm, Wednesday 7–8:30pm, and a night vigil the last Friday of every month. Everyone is welcome — come as you are.",

      "nav.about": "Our church",
      "nav.sermons": "Sermons",
      "nav.shop": "Bookshop",
      "nav.give": "Give",
      "nav.menu": "Open menu",
      "nav.close": "Close menu",
      "skip": "Skip to main content",

      "hero.eyebrow": "Ottawa, Ontario",
      "hero.title_a": "You're welcome",
      "hero.title_b": "here",
      "hero.lede": "Whatever brought you looking today — curiosity, a hard season, or a long time away — there's a seat for you on Sunday. No dress code. No pressure.",
      "hero.cta_visit": "Meet our church",
      "hero.cta_watch": "Come this Sunday",
      "hero.next_label": "Next gathering",
      "hero.next_today": "Today",
      "hero.next_tomorrow": "Tomorrow",
      "hero.next_vigil": "night vigil",

      "expect.eyebrow": "What to expect",
      "expect.title": "Your first Sunday, before you arrive",
      "expect.lede": "Walking into a new church is uncomfortable when you don't know how it goes. Here's the whole thing, so nothing catches you off guard.",
      "expect.1_t": "Arriving",
      "expect.1_b": "Someone will greet you at the door. That's all there is to it — no forms, no sign-in, and nobody will follow up unless you ask them to.",
      "expect.2_t": "Where to sit",
      "expect.2_b": "Anywhere you like. The only exception is the occasional special programme, when part of the seating may be set aside.",
      "expect.3_t": "Bringing children",
      "expect.3_b": "We don't run a separate children's programme yet, so little ones stay with you in the service. Nobody minds the noise.",

      "sermons.eyebrow": "Sermons",
      "sermons.title": "Listen before you visit",
      "sermons.lede": "A good way to get a feel for us without walking through the door first.",
      "sermons.s1_t": "Message by Rev Cornelius Babalola",
      "sermons.s1_s": "Rise Up Canada · October 2023",
      "sermons.all": "Browse all sermons",

      "shop.eyebrow": "Bookshop",
      "shop.title": "Books from our teaching",
      "shop.lede": "Written by Apostle Cornelius Babalola. Order either title on Amazon, or pick up a copy on Sunday.",
      "shop.b1_t": "Echoes of a Praying Heart",
      "shop.b1_a": "Apostle Cornelius Olajide Babalola · 136 pages",
      "shop.b2_t": "Footsteps of Destiny",
      "shop.b2_a": "Apostle Cornelius Olajide Babalola · 196 pages",
      "shop.buy": "Buy on Amazon",
      "shop.note": "Both titles are published through Amazon. Order there, or pick up a copy on Sunday.",

      "give.eyebrow": "Giving",
      "give.title": "Give to the work here",
      "give.lede": "Your giving sustains the life of this parish — the room we gather in, and the ministry that goes out from it. Our accounts are published in an annual report each March.",
      "give.amount_label": "Choose an amount",
      "give.custom": "Other amount",
      "give.etransfer_label": "Send an Interac e-Transfer to",
      "give.copy": "Copy",
      "give.copied": "Copied",
      "give.banks_label": "Or open your bank",
      "give.banks_note": "Sign in, then send an e-Transfer to the address above.",
      "give.note": "Please include your name in the message so we can issue your tax receipt. No card details are ever entered on this site.",
      "give.receipt": "Tax receipts are issued with the annual report each March. Include your full name and mailing address in the e-Transfer message.",

      "about.eyebrow": "Our church",
      "about.title": "A house of prayer in Ottawa",
      "about.lede": "Tabernacle of Prayer Parish is a Spirit-filled congregation on Lancaster Road, part of The New Life In Christ Ministry. We gather every Sunday from 11 to 1, meet again on Wednesday evenings, and keep watch together through the last Friday night of each month.",
      "about.leaders": "Our leadership",
      "about.p1_n": "Apostle Cornelius Olajide Babalola",
      "about.p1_r": "Founder & Spiritual Leader",
      "about.p1_b": "Apostle Cornelius Olajide Babalola is a seasoned servant of God, prayer warrior, teacher of the Word, and visionary leader with decades of faithful ministry experience. He is the founder and spiritual leader of the Tabernacle of Prayer Ministry, based in Ottawa, Canada, where he has dedicated his life to preaching the Gospel, mentoring believers, and advancing the work of God through prayer, faith, and compassionate leadership.",
      "about.p1_b2": "Known for his unwavering trust in God and his inspiring message, “God will do what He says He will do,” Apostle Babalola has impacted many lives through his teachings, counseling, and spiritual guidance. He is also an author — Footsteps of Destiny and Echoes of a Praying Heart — whose writings continue to encourage, strengthen, and inspire people in their walk with God.",
      "about.p2_n": "Pastor (Mrs.) Ansa Adebola Babalola",
      "about.p2_r": "Pastor",
      "about.p2_b": "Pastor (Mrs.) Ansa Adebola Babalola is a devoted servant of God, inspirational writer, and church leader based in Ottawa, Canada. She serves faithfully alongside her husband, Apostle Cornelius Olajide Babalola, at the Tabernacle of Prayer Ministry. Passionate about prayer, women’s empowerment, and encouraging others through faith, she is known for her compassionate leadership and uplifting messages.",
      "about.p2_b2": "She is also the convener of the annual Queen Esther’s Banquet, inspiring women to rise in purpose, resilience, and faith.",
      "quote.text": "God will do what He says He will do.",
      "quote.attr": "Apostle Cornelius Olajide Babalola",
      "footer.youtube": "Watch on YouTube",
      "footer.address": "Address",
      "footer.times": "Service times",
      "footer.explore": "Explore",
      "footer.connect": "Connect",
      "footer.svc_sun": "Sunday · 11:00 AM – 1:00 PM",
      "footer.svc_wed": "Wednesday · 7:00 – 8:30 PM",
      "footer.svc_vigil": "Night vigil · last Friday, 11 PM – 1 AM",
      "footer.rights": "Tabernacle of Prayer Parish, Ottawa. A registered Canadian charity.",
      "footer.ministry": "New Life In Christ Ministry — Tabernacle of Prayer Parish",
      "footer.charity": "Charity no. 00000 0000 RR0001"
    },

    fr: {
      "meta.title": "Tabernacle of Prayer Parish — Une église à Ottawa",
      "meta.desc": "Une église remplie de l'Esprit à Ottawa. Culte du dimanche de 11 h à 13 h, mercredi de 19 h à 20 h 30, et veillée de prière le dernier vendredi du mois. Tous sont les bienvenus — venez comme vous êtes.",

      "nav.about": "Notre église",
      "nav.sermons": "Prédications",
      "nav.shop": "Librairie",
      "nav.give": "Donner",
      "nav.menu": "Ouvrir le menu",
      "nav.close": "Fermer le menu",
      "skip": "Aller au contenu principal",

      "hero.eyebrow": "Ottawa, Ontario",
      "hero.title_a": "Vous êtes le",
      "hero.title_b": "bienvenu",
      "hero.lede": "Peu importe ce qui vous amène aujourd'hui — la curiosité, une saison difficile, ou une longue absence — une place vous attend dimanche. Aucune tenue exigée. Aucune pression.",
      "hero.cta_visit": "Découvrir notre église",
      "hero.cta_watch": "Venez ce dimanche",
      "hero.next_label": "Prochaine rencontre",
      "hero.next_today": "Aujourd’hui",
      "hero.next_tomorrow": "Demain",
      "hero.next_vigil": "veillée de prière",

      "expect.eyebrow": "À quoi s'attendre",
      "expect.title": "Votre premier dimanche, avant même d'arriver",
      "expect.lede": "Entrer dans une nouvelle église met mal à l'aise quand on ne sait pas comment ça se passe. Voici le déroulement complet, pour qu'aucune surprise ne vous attende.",
      "expect.1_t": "L'arrivée",
      "expect.1_b": "Quelqu'un vous accueillera à la porte. C'est tout — aucun formulaire, aucune inscription, et personne ne vous relancera à moins que vous ne le demandiez.",
      "expect.2_t": "Où s'asseoir",
      "expect.2_b": "Où vous voulez. La seule exception : lors d'un programme spécial, une partie des places peut être réservée.",
      "expect.3_t": "Venir avec des enfants",
      "expect.3_b": "Nous n'avons pas encore de programme pour enfants; les petits restent donc avec vous pendant le culte. Le bruit ne dérange personne.",

      "sermons.eyebrow": "Prédications",
      "sermons.title": "Écoutez-nous avant de venir",
      "sermons.lede": "Une bonne façon de nous découvrir sans avoir à franchir la porte.",
      "sermons.s1_t": "Message du Rév. Cornelius Babalola",
      "sermons.s1_s": "Rise Up Canada · octobre 2023",
      "sermons.all": "Voir toutes les prédications",

      "shop.eyebrow": "Librairie",
      "shop.title": "Livres issus de notre enseignement",
      "shop.lede": "Écrits par l'Apôtre Cornelius Babalola. Commandez l'un ou l'autre titre sur Amazon, ou procurez-vous un exemplaire le dimanche.",
      "shop.b1_t": "Echoes of a Praying Heart",
      "shop.b1_a": "Apôtre Cornelius Olajide Babalola · 136 pages",
      "shop.b2_t": "Footsteps of Destiny",
      "shop.b2_a": "Apôtre Cornelius Olajide Babalola · 196 pages",
      "shop.buy": "Acheter sur Amazon",
      "shop.note": "Les deux titres sont publiés sur Amazon. Commandez-y, ou procurez-vous un exemplaire le dimanche.",

      "give.eyebrow": "Dons",
      "give.title": "Soutenir l'œuvre ici",
      "give.lede": "Vos dons soutiennent la vie de cette assemblée — le lieu où nous nous réunissons et le ministère qui en découle. Nos comptes sont publiés dans un rapport annuel chaque mars.",
      "give.amount_label": "Choisissez un montant",
      "give.custom": "Autre montant",
      "give.etransfer_label": "Envoyez un virement Interac à",
      "give.copy": "Copier",
      "give.copied": "Copié",
      "give.banks_label": "Ou ouvrez votre banque",
      "give.banks_note": "Connectez-vous, puis envoyez un virement à l'adresse ci-dessus.",
      "give.note": "Veuillez inclure votre nom dans le message afin que nous puissions émettre votre reçu fiscal. Aucune donnée de carte n'est saisie sur ce site.",
      "give.receipt": "Les reçus fiscaux sont émis avec le rapport annuel, chaque mars. Indiquez votre nom complet et votre adresse postale dans le message du virement.",

      "about.eyebrow": "Notre église",
      "about.title": "Une maison de prière à Ottawa",
      "about.lede": "Tabernacle of Prayer Parish est une assemblée remplie de l'Esprit, située sur le chemin Lancaster, et fait partie de The New Life In Christ Ministry. Nous nous réunissons chaque dimanche de 11 h à 13 h, de nouveau le mercredi soir, et veillons ensemble le dernier vendredi soir de chaque mois.",
      "about.leaders": "Notre direction",
      "about.p1_n": "Apôtre Cornelius Olajide Babalola",
      "about.p1_r": "Fondateur et responsable spirituel",
      "about.p1_b": "L’apôtre Cornelius Olajide Babalola est un serviteur de Dieu chevronné, un intercesseur, un enseignant de la Parole et un leader visionnaire fort de plusieurs décennies de ministère fidèle. Fondateur et responsable spirituel du Tabernacle of Prayer Ministry, à Ottawa, il consacre sa vie à annoncer l’Évangile, à accompagner les croyants et à faire avancer l’œuvre de Dieu par la prière, la foi et un leadership empreint de compassion.",
      "about.p1_b2": "Reconnu pour sa confiance inébranlable en Dieu et pour son message « Dieu fera ce qu’il a dit qu’il ferait », l’apôtre Babalola a marqué de nombreuses vies par son enseignement, son accompagnement et sa direction spirituelle. Il est également auteur — Footsteps of Destiny et Echoes of a Praying Heart — et ses écrits continuent d’encourager, de fortifier et d’inspirer ceux qui cheminent avec Dieu.",
      "about.p2_n": "Pasteure Ansa Adebola Babalola",
      "about.p2_r": "Pasteure",
      "about.p2_b": "La pasteure Ansa Adebola Babalola est une servante de Dieu dévouée, une auteure inspirante et une responsable d’église établie à Ottawa. Elle sert fidèlement aux côtés de son époux, l’apôtre Cornelius Olajide Babalola, au Tabernacle of Prayer Ministry. Passionnée par la prière, l’autonomisation des femmes et l’encouragement par la foi, elle est reconnue pour son leadership bienveillant et ses messages porteurs d’espérance.",
      "about.p2_b2": "Elle est également l’instigatrice du Queen Esther’s Banquet annuel, qui invite les femmes à se lever avec détermination, résilience et foi.",
      "quote.text": "Dieu fera ce qu’il a dit qu’il ferait.",
      "quote.attr": "Apôtre Cornelius Olajide Babalola",
      "footer.youtube": "Regarder sur YouTube",
      "footer.address": "Adresse",
      "footer.times": "Heures des cultes",
      "footer.explore": "Explorer",
      "footer.connect": "Nous joindre",
      "footer.svc_sun": "Dimanche · 11 h – 13 h",
      "footer.svc_wed": "Mercredi · 19 h – 20 h 30",
      "footer.svc_vigil": "Veillée de prière · dernier vendredi, 23 h – 1 h",
      "footer.rights": "Tabernacle of Prayer Parish, Ottawa. Organisme de bienfaisance enregistré au Canada.",
      "footer.ministry": "New Life In Christ Ministry — Tabernacle of Prayer Parish",
      "footer.charity": "N° d'organisme 00000 0000 RR0001"
    }
  };

  var STORE_KEY = "lwc-lang";
  var lang = "en";

  function t(key) {
    var dict = I18N[lang] || I18N.en;
    return dict[key] != null ? dict[key] : (I18N.en[key] != null ? I18N.en[key] : key);
  }

  function applyLang(next) {
    lang = I18N[next] ? next : "en";

    document.documentElement.setAttribute("lang", lang === "fr" ? "fr-CA" : "en-CA");

    // Text nodes
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });

    // Attributes: data-i18n-attr="aria-label:nav.menu, placeholder:some.key"
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length === 2) {
          el.setAttribute(bits[0].trim(), t(bits[1].trim()));
        }
      });
    });

    // Document head
    document.title = t("meta.title");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.desc"));

    // Toggle state
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* private mode */ }

    // Modules that render their own strings (the next-gathering strip) listen
    // for this rather than being called from here.
    document.dispatchEvent(new CustomEvent("lwc:langchange"));
  }

  function initLang() {
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* ignore */ }
    // Respect a stored choice; otherwise take a hint from the browser.
    var initial = saved || ((navigator.language || "en").toLowerCase().indexOf("fr") === 0 ? "fr" : "en");
    applyLang(initial);

    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });
  }

  /* ---------------------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------------------- */
  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;

    var reveal = function (el) {
      if (el.classList.contains("is-visible")) return;
      // Stagger siblings within the same parent, 70ms apart.
      var siblings = el.parentElement
        ? Array.prototype.filter.call(el.parentElement.children, function (c) {
            return c.hasAttribute && c.hasAttribute("data-reveal");
          })
        : [];
      var idx = siblings.indexOf(el);
      el.style.setProperty("--reveal-delay", (idx > 0 ? idx * 70 : 0) + "ms");
      el.classList.add("is-visible");
    };

    var showAll = function () { els.forEach(reveal); };

    // Opted out of motion: render everything immediately, no transition.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showAll();
      return;
    }

    // Deliberately geometry-based rather than IntersectionObserver. An observer
    // that never fires (hidden document, odd embedding, some extensions) would
    // leave every section stuck at opacity 0 — a blank page for the visitor.
    // A rect check can't silently fail: worst case it runs and reveals.
    var check = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var pending = false;
      els.forEach(function (el) {
        if (el.classList.contains("is-visible")) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) reveal(el);
        else pending = true;
      });
      return pending;
    };

    var onScroll = rafThrottle(check);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    check();

    // Last-resort failsafe. If something above went wrong and content is still
    // hidden well after load, show it — an un-animated page beats a blank one.
    window.setTimeout(showAll, 4000);
  }

  /* ---------------------------------------------------------------------
     Header, mobile drawer, nav highlighting
     --------------------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector(".header");
    var burger = document.querySelector(".burger");
    var drawer = document.querySelector(".drawer");

    if (header) {
      var syncHeader = function () {
        // Solid once you've scrolled off the hero photo, transparent over it.
        header.setAttribute("data-scrolled", String(window.scrollY > 12));
      };
      window.addEventListener("scroll", rafThrottle(syncHeader), { passive: true });
      syncHeader();
    }

    if (burger && drawer) {
      burger.addEventListener("click", function () {
        var open = drawer.getAttribute("data-open") === "true";
        drawer.setAttribute("data-open", String(!open));
        burger.setAttribute("aria-expanded", String(!open));
        burger.setAttribute("aria-label", t(!open ? "nav.close" : "nav.menu"));
      });
      // Close after following a link, so the drawer isn't left open behind you.
      drawer.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          drawer.setAttribute("data-open", "false");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }

    // Mark the section currently in view.
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link[href^='#']"));
    var sections = links.map(function (l) { return document.querySelector(l.getAttribute("href")); });
    if ("IntersectionObserver" in window && sections.filter(Boolean).length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (l, i) {
            l.setAttribute("aria-current", String(sections[i] === e.target));
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (s) { if (s) spy.observe(s); });
    }
  }

  /* ---------------------------------------------------------------------
     Giving amount selector
     Chooses an amount only. Payment happens on the provider's own site —
     no card details are ever entered or handled here.
     --------------------------------------------------------------------- */
  /* ---------------------------------------------------------------------
     Copy-to-clipboard for the e-Transfer address
     navigator.clipboard needs a secure context and can be refused outright,
     so there is a selection-based fallback. If both fail the address is still
     plain selectable text — nothing is lost, it just isn't one-tap.
     --------------------------------------------------------------------- */
  function initCopy() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (btn) {
      var label = btn.querySelector("span") || btn;
      var original = label.textContent;

      var flash = function () {
        label.textContent = t("give.copied");
        btn.setAttribute("data-copied", "true");
        window.setTimeout(function () {
          label.textContent = t("give.copy") || original;
          btn.removeAttribute("data-copied");
        }, 1800);
      };

      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(flash, function () { legacy(text); });
        } else {
          legacy(text);
        }

        function legacy(value) {
          var ta = document.createElement("textarea");
          ta.value = value;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); flash(); } catch (e) { /* selectable anyway */ }
          document.body.removeChild(ta);
        }
      });
    });
  }

  function initGiving() {
    var buttons = document.querySelectorAll(".amount");
    var custom = document.getElementById("give-custom");
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        if (custom) custom.value = "";
      });
    });

    if (custom) {
      custom.addEventListener("input", function () {
        if (custom.value) {
          buttons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        }
      });
    }
  }

  /* ---------------------------------------------------------------------
     Logo
     The crest is shown only once a real file exists at brand/logo.*, so a
     missing file never renders as a broken-image icon. Drop the file in and
     it appears; nothing else to change.
     --------------------------------------------------------------------- */
  function initLogo() {
    var slots = document.querySelectorAll("[data-logo]");
    if (!slots.length) return;

    // Order matters: first hit wins. SVG preferred if one ever exists.
    var candidates = [
      "brand/logo.svg", "brand/logo.webp", "brand/logo.png", "brand/logo.jpg"
    ];

    var tryNext = function (i) {
      if (i >= candidates.length) return;      // none found: keep the fallback
      var probe = new Image();
      probe.onload = function () {
        slots.forEach(function (img) {
          img.src = candidates[i];
          img.hidden = false;
          // Hide the stand-in star now that the real mark is in place.
          var mark = img.parentElement.querySelector(".brand__mark");
          if (mark) mark.style.display = "none";
        });
      };
      probe.onerror = function () { tryNext(i + 1); };
      probe.src = candidates[i];
    };

    tryNext(0);
  }

  /* ---------------------------------------------------------------------
     Next gathering
     Works out the soonest of: Sunday 11:00, Wednesday 19:00, and the last
     Friday of the month at 23:00.

     Deliberately computed in America/Toronto rather than the visitor's own
     clock — service times belong to the church, not to wherever someone
     happens to be browsing from. If the timezone data is unavailable the whole
     strip stays hidden rather than showing a time that might be wrong.
     --------------------------------------------------------------------- */
  var SCHEDULE = [
    { day: 0, hour: 11, minute: 0, key: "sun"   },   // Sunday
    { day: 3, hour: 19, minute: 0, key: "wed"   },   // Wednesday
    { day: 5, hour: 23, minute: 0, key: "vigil", lastOfMonth: true }
  ];

  function torontoParts(date) {
    var fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false
    });
    var out = {};
    fmt.formatToParts(date).forEach(function (p) { out[p.type] = p.value; });
    var days = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };
    return {
      y: +out.year, m: +out.month, d: +out.day,
      hh: +out.hour % 24, mm: +out.minute,
      dow: days[out.weekday]
    };
  }

  function isLastOfMonth(y, m, d) {
    // d is a Friday; it is the last one if seven days later is a new month.
    var next = new Date(Date.UTC(y, m - 1, d + 7));
    return next.getUTCMonth() !== (m - 1);
  }

  function initNextGathering() {
    var host = document.querySelector(".hero__next");
    var slot = document.getElementById("next-gathering");
    if (!host || !slot) return;

    var now;
    try { now = torontoParts(new Date()); }
    catch (e) { return; }                    // no tz data: leave it hidden

    var found = null;
    for (var offset = 0; offset < 40 && !found; offset++) {
      var probe = new Date(Date.UTC(now.y, now.m - 1, now.d + offset));
      var py = probe.getUTCFullYear(), pm = probe.getUTCMonth() + 1,
          pd = probe.getUTCDate(),     pdow = probe.getUTCDay();

      for (var i = 0; i < SCHEDULE.length; i++) {
        var ev = SCHEDULE[i];
        if (ev.day !== pdow) continue;
        if (ev.lastOfMonth && !isLastOfMonth(py, pm, pd)) continue;
        // today only counts if the start time has not already passed
        if (offset === 0 && (now.hh > ev.hour || (now.hh === ev.hour && now.mm > ev.minute))) continue;
        found = { ev: ev, offset: offset, y: py, m: pm, d: pd, dow: pdow };
        break;
      }
    }
    if (!found) return;

    var render = function () {
      var loc = lang === "fr" ? "fr-CA" : "en-CA";
      var when;
      if (found.offset === 0)      when = t("hero.next_today");
      else if (found.offset === 1) when = t("hero.next_tomorrow");
      else {
        when = new Intl.DateTimeFormat(loc, {
          weekday: "long", timeZone: "UTC"
        }).format(new Date(Date.UTC(found.y, found.m - 1, found.d)));
        when = when.charAt(0).toUpperCase() + when.slice(1);
      }

      var time = new Intl.DateTimeFormat(loc, {
        hour: "numeric", minute: "2-digit", timeZone: "UTC",
        hour12: lang !== "fr"
      }).format(new Date(Date.UTC(2000, 0, 1, found.ev.hour, found.ev.minute)));

      slot.textContent = when + " · " + time +
        (found.ev.key === "vigil" ? " · " + t("hero.next_vigil") : "");
      host.hidden = false;
    };

    render();
    document.addEventListener("lwc:langchange", render);
  }

  /* ---------------------------------------------------------------------
     Hero video
     What large churches actually use: a short, silent, looping clip of the
     room in worship. Drop assets/video/hero.mp4 (or .webm) and it takes over.

     Deliberately conservative about when it plays:
       - never on prefers-reduced-motion
       - never when the browser reports Save-Data or a 2g/slow-2g connection
       - preload="none", so the file is not fetched at all unless it will play
     Autoplay can still be refused by the browser; if the play() promise
     rejects we hide the video and fall back rather than leaving a frozen frame.
     --------------------------------------------------------------------- */
  function initHeroVideo() {
    var vid = document.querySelector("[data-hero-video]");
    if (!vid) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && (conn.saveData || /^(slow-)?2g$/.test(conn.effectiveType || ""))) return;

    var sources = ["assets/video/hero.webm", "assets/video/hero.mp4"];

    var tryNext = function (i) {
      if (i >= sources.length) return;             // none found: keep fallback
      fetch(sources[i], { method: "HEAD" })
        .then(function (res) {
          if (!res.ok) throw new Error("missing");
          vid.src = sources[i];
          vid.preload = "auto";

          // Browsers refuse autoplay while the document is hidden, so a single
          // rejection must not disable the video for good — otherwise a page
          // opened in a background tab keeps the fallback forever. Retry once
          // the page is actually visible.
          var attempt = function () {
            if (document.hidden) return;
            var played = vid.play();
            if (played && typeof played.catch === "function") {
              played.catch(function () { vid.hidden = true; });
            } else {
              vid.hidden = false;
            }
          };

          vid.addEventListener("playing", function () { vid.hidden = false; }, { once: true });
          document.addEventListener("visibilitychange", attempt);
          attempt();
        })
        .catch(function () { tryNext(i + 1); });
    };

    tryNext(0);
  }

  /* ---------------------------------------------------------------------
     Hero background
     Same pattern as the logo: probe for a real photo and only swap it in once
     it has decoded, so a missing or slow image never shows a half-painted
     background. The gradient underneath is the fallback.
     --------------------------------------------------------------------- */
  function initHeroImage() {
    var bg = document.querySelector("[data-hero-img]");
    if (!bg) return;

    var candidates = [
      "assets/img/ottawa.webp", "assets/img/ottawa.jpg",
      "assets/img/hero.webp",   "assets/img/hero.jpg"
    ];

    var tryNext = function (i) {
      if (i >= candidates.length) return;       // none found: keep the gradient
      var probe = new Image();
      probe.onload = function () {
        bg.style.backgroundImage = "url('" + candidates[i] + "')";
        bg.setAttribute("data-loaded", "true");
      };
      probe.onerror = function () { tryNext(i + 1); };
      probe.src = candidates[i];
    };

    tryNext(0);
  }

  /* ---------------------------------------------------------------------
     Image slots (book covers, leadership portraits)
     Drop assets/img/book-1.*, book-2.*, pastor-1.*, pastor-2.* and they fill
     in. Same probe-then-swap approach as the logo, so a missing file leaves
     the styled placeholder rather than a broken image.
     --------------------------------------------------------------------- */
  function initImageSlots() {
    var exts = [".webp", ".jpg", ".png", ".jpeg"];
    var groups = [
      { attr: "data-book",   prefix: "book-"   },
      { attr: "data-person", prefix: "pastor-" }
    ];

    groups.forEach(function (g) {
      Array.prototype.forEach.call(document.querySelectorAll("[" + g.attr + "]"), function (slot) {
        var base = "assets/img/" + g.prefix + slot.getAttribute(g.attr);

        var tryNext = function (i) {
          if (i >= exts.length) return;         // none found: keep placeholder
          var probe = new Image();
          probe.onload = function () {
            slot.style.backgroundImage = "url('" + base + exts[i] + "')";
            slot.setAttribute("data-loaded", "true");
          };
          probe.onerror = function () { tryNext(i + 1); };
          probe.src = base + exts[i];
        };

        tryNext(0);
      });
    });
  }

  /* --------------------------------------------------------------------- */
  function init() {
    initLang();
    initLogo();
    initHeroVideo();
    initHeroImage();
    initNextGathering();
    initImageSlots();
    initReveal();
    initHeader();
    initGiving();
    initCopy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
