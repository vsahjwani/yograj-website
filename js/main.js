/* ============================================================
   YOGRAJ SERVICES — interaction layer
   ============================================================ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- tiny click sound (WebAudio, no assets) --------------- */
  var actx = null;
  function clickSound(soft) {
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      var t = actx.currentTime;
      var osc = actx.createOscillator();
      var osc2 = actx.createOscillator();
      var g = actx.createGain();
      var lp = actx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2400;
      osc.type = "square";  osc.frequency.value = 1750;
      osc2.type = "sine";   osc2.frequency.value = 320;
      var peak = soft ? 0.025 : 0.05;
      g.gain.setValueAtTime(peak, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      osc.connect(lp); osc2.connect(lp); lp.connect(g); g.connect(actx.destination);
      osc.start(t); osc2.start(t);
      osc.stop(t + 0.07); osc2.stop(t + 0.07);
    } catch (e) { /* sound is a garnish, never an error */ }
  }

  /* ---------------- entry / illumination ---------------- */
  var entry = document.getElementById("entry");
  var entrySwitch = document.getElementById("entry-switch");
  var illuminated = false;

  function illuminate(withSound) {
    if (illuminated) return;
    illuminated = true;
    if (withSound) clickSound(false);
    entry.classList.add("blooming");
    setTimeout(function () {
      document.body.classList.remove("pre-light");
      document.body.classList.add("lit");
      entry.classList.add("gone");
      applyHeroDimmer(); // paint the hero glow at current slider value
    }, withSound ? 420 : 60);
    setTimeout(function () { if (entry.parentNode) entry.parentNode.removeChild(entry); }, 2600);
  }

  if (reduced) {
    illuminate(false);
  } else {
    entrySwitch.addEventListener("click", function () { illuminate(true); });
    setTimeout(function () { illuminate(false); }, 6500); // never trap the visitor
  }

  /* ---------------- cursor torch ---------------- */
  var torch = document.getElementById("cursor-glow");
  if (torch && window.matchMedia("(hover:hover)").matches && !reduced) {
    var tx = innerWidth / 2, ty = innerHeight / 3, cx = tx, cy = ty;
    document.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; });
    (function torchLoop() {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      torch.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(torchLoop);
    })();
  }

  /* ---------------- nav ---------------- */
  var nav = document.getElementById("nav");
  window.addEventListener("scroll", function () {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  /* ---------------- hero master dimmer (dim-to-warm) ---------------- */
  var dimmer   = document.getElementById("hero-dimmer");
  var dimPct   = document.getElementById("dim-pct");
  var dimKel   = document.getElementById("dim-kelvin");
  var glowWarm   = document.querySelector(".glow-warm");
  var glowCandle = document.querySelector(".glow-candle");
  var lux = 0.78;

  function fmtKelvin(k) {
    k = Math.round(k);
    var s = String(k);
    return s.slice(0, s.length - 3) + " " + s.slice(-3) + " K";
  }
  function applyHeroDimmer() {
    var v = Number(dimmer.value);
    var t = v / 100;
    lux = t;
    dimmer.style.setProperty("--fill", v + "%");
    dimPct.textContent = v + "%";
    dimKel.textContent = fmtKelvin(2200 + 500 * Math.pow(t, 1.1));
    if (document.body.classList.contains("lit")) {
      glowWarm.style.opacity   = (Math.pow(t, 0.9)).toFixed(3);
      glowCandle.style.opacity = (Math.sqrt(t) * (1 - t) * 1.15 + 0.05).toFixed(3);
    }
  }
  dimmer.addEventListener("input", applyHeroDimmer);
  dimmer.addEventListener("change", function () { clickSound(true); });
  applyHeroDimmer();

  /* ---------------- dust in the light (hero canvas) ---------------- */
  var dustCanvas = document.getElementById("dust");
  if (dustCanvas && !reduced) {
    var ctx = dustCanvas.getContext("2d");
    var motes = [];
    var W = 0, H = 0;
    function sizeDust() {
      W = dustCanvas.width = dustCanvas.offsetWidth;
      H = dustCanvas.height = dustCanvas.offsetHeight;
    }
    sizeDust();
    window.addEventListener("resize", sizeDust);
    for (var i = 0; i < 54; i++) {
      motes.push({
        x: Math.random(), y: Math.random(),
        r: 0.5 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.00016,
        vy: -0.00008 - Math.random() * 0.00022,
        p: Math.random() * Math.PI * 2,
        ps: 0.004 + Math.random() * 0.012
      });
    }
    (function dustLoop() {
      ctx.clearRect(0, 0, W, H);
      if (document.body.classList.contains("lit")) {
        var bright = 0.25 + 0.75 * lux;
        for (var i = 0; i < motes.length; i++) {
          var m = motes[i];
          m.x += m.vx; m.y += m.vy; m.p += m.ps;
          if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
          if (m.x < -0.02) m.x = 1.02;
          if (m.x > 1.02) m.x = -0.02;
          var tw = 0.35 + 0.65 * Math.abs(Math.sin(m.p));
          // motes are brightest inside the top light beam
          var beam = 1 - Math.min(1, m.y * 1.4);
          var a = 0.32 * tw * bright * (0.25 + 0.75 * beam);
          ctx.beginPath();
          ctx.arc(m.x * W, m.y * H, m.r, 0, 6.2832);
          ctx.fillStyle = "rgba(255,214,160," + a.toFixed(3) + ")";
          ctx.fill();
        }
      }
      requestAnimationFrame(dustLoop);
    })();
  }

  /* ---------------- scroll reveals ---------------- */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        revealIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll("[data-reveal]").forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 0.08 + "s";
    revealIO.observe(el);
  });

  /* timeline golden thread */
  var thread = document.getElementById("thread-fill");
  var timeline = document.querySelector(".timeline");
  if (thread && timeline) {
    new IntersectionObserver(function (entries, io) {
      if (entries[0].isIntersecting) {
        thread.style.width = "96%";
        io.disconnect();
      }
    }, { threshold: 0.3 }).observe(timeline);
  }

  /* ============================================================
     THE ROOM — live scene demo
     ============================================================ */
  var room = document.getElementById("room");
  var fxNames = ["chandelier", "cove", "lamp", "art", "screen"];
  var fx = {};
  fxNames.forEach(function (n) {
    fx[n] = { el: document.getElementById("fx-" + n), v: 0 };
  });
  var tintEl = document.getElementById("room-tint");
  var master = 0.85;
  var masterInput = document.getElementById("room-master");
  var masterOut = document.getElementById("room-master-out");

  var SCENES = {
    arrival:  { fx: { chandelier: 0.85, cove: 0.65, lamp: 0.55, art: 0.75, screen: 0 },
                tint: "#3a2408", tintO: 0.10, curtains: false, city: false },
    soiree:   { fx: { chandelier: 1,    cove: 0.9,  lamp: 0.85, art: 1,    screen: 0 },
                tint: "#4a2c06", tintO: 0.16, curtains: false, city: false },
    cinema:   { fx: { chandelier: 0,    cove: 0.14, lamp: 0.22, art: 0,    screen: 1 },
                tint: "#060a1e", tintO: 0.38, curtains: true,  city: false },
    midnight: { fx: { chandelier: 0,    cove: 0.07, lamp: 0.12, art: 0,    screen: 0 },
                tint: "#040720", tintO: 0.45, curtains: false, city: true }
  };

  function renderRoom() {
    fxNames.forEach(function (n) {
      var on = fx[n].v > 0.01;
      fx[n].el.classList.toggle("on", on);
      fx[n].el.style.setProperty("--i", (fx[n].v * master).toFixed(3));
    });
    document.querySelectorAll(".fx-btn").forEach(function (b) {
      b.classList.toggle("active", fx[b.getAttribute("data-fx")].v > 0.01);
    });
  }

  function setScene(name, btn) {
    var s = SCENES[name];
    if (!s) return;
    fxNames.forEach(function (n) { fx[n].v = s.fx[n]; });
    tintEl.style.fill = s.tint;
    tintEl.style.opacity = s.tintO;
    room.classList.toggle("curtains-closed", s.curtains);
    room.classList.toggle("city-bright", s.city);
    document.querySelectorAll(".scene-btn").forEach(function (b) {
      b.classList.toggle("active", b === btn);
    });
    renderRoom();
  }

  document.querySelectorAll(".scene-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      clickSound(false);
      setScene(b.getAttribute("data-scene"), b);
    });
  });

  document.querySelectorAll(".fx-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      clickSound(false);
      var n = b.getAttribute("data-fx");
      fx[n].v = fx[n].v > 0.01 ? 0 : (n === "screen" ? 1 : 0.85);
      // manual override leaves scene presets
      document.querySelectorAll(".scene-btn").forEach(function (sb) { sb.classList.remove("active"); });
      renderRoom();
    });
  });

  masterInput.addEventListener("input", function () {
    master = Number(masterInput.value) / 100;
    masterOut.textContent = masterInput.value + "%";
    masterInput.style.setProperty("--fill", masterInput.value + "%");
    renderRoom();
  });
  masterInput.style.setProperty("--fill", masterInput.value + "%");

  /* wake the room in "arrival" when it scrolls into view */
  var roomStage = document.querySelector(".room-stage");
  if (roomStage) {
    new IntersectionObserver(function (entries, io) {
      if (entries[0].isIntersecting) {
        setTimeout(function () {
          setScene("arrival", document.querySelector('.scene-btn[data-scene="arrival"]'));
        }, 500);
        io.disconnect();
      }
    }, { threshold: 0.35 }).observe(roomStage);
  }

  /* ============================================================
     PRODUCTS
     ============================================================ */
  /* GO video — play only while visible */
  var goVideo = document.getElementById("go-video");
  if (goVideo) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { goVideo.play().catch(function () {}); }
        else { goVideo.pause(); }
      });
    }, { threshold: 0.35 }).observe(goVideo);

    var soundBtn = document.getElementById("go-sound");
    soundBtn.addEventListener("click", function () {
      goVideo.muted = !goVideo.muted;
      soundBtn.innerHTML = goVideo.muted ? "&#x1F507;" : "&#x1F50A;";
      if (!goVideo.muted) goVideo.play().catch(function () {});
    });
  }

  /* voice command typewriter */
  var typed = document.getElementById("voice-typed");
  if (typed && !reduced) {
    var phrases = [
      "Alexa, movie time.",
      "OK Google, dim the living room to twenty percent.",
      "Alexa, good night.",
      "OK Google, set the AC to twenty-three."
    ];
    var pi = 0, ci = 0, deleting = false;
    (function typeLoop() {
      var p = phrases[pi];
      if (!deleting) {
        ci++;
        if (ci >= p.length) { deleting = true; setTimeout(typeLoop, 2200); typed.textContent = p; return; }
      } else {
        ci -= 2;
        if (ci <= 0) { ci = 0; deleting = false; pi = (pi + 1) % phrases.length; }
      }
      typed.textContent = p.slice(0, ci);
      setTimeout(typeLoop, deleting ? 24 : 55 + Math.random() * 40);
    })();
  } else if (typed) {
    typed.textContent = "Alexa, movie time.";
  }

  /* ---------------- stat count-up ---------------- */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    new IntersectionObserver(function (entries, io) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      var target = Number(el.getAttribute("data-count"));
      var t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / 1600);
        el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, { threshold: 0.6 }).observe(el);
  });

  /* ---------------- contact form (front-end placeholder) ---------------- */
  var form = document.getElementById("contact-form");
  var toast = document.getElementById("toast");
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove("show"); }, 4200);
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim();
    var phone = form.elements.phone.value.trim();
    if (!name || !phone) {
      showToast("Please share your name and a phone number.");
      return;
    }
    /* ------------------------------------------------------------------
       TODO (go-live): POST this to your email / CRM endpoint, e.g.
       fetch("/api/enquiry", { method:"POST", body:new FormData(form) })
       ------------------------------------------------------------------ */
    clickSound(false);
    form.reset();
    showToast("Thank you, " + name.split(" ")[0] + " — we will call you to arrange a private demo.");
  });

})();
