/* ============================================================
   Happy 1st Birthday, Sidra — interactions & animations
   Vanilla JS. No external libraries.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Loader ---------- */
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.getElementById("loader").classList.add("hidden");
      goTo(0, true);
    }, 2200);
  });

  /* ============================================================
     CANVAS FX — fireworks + confetti
     ============================================================ */
  const canvas = document.getElementById("fx");
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const GOLD = ["#e7c66b", "#fff2c9", "#b8912f", "#ffd76e"];
  const PINK = ["#ff9ec7", "#ffd6e8", "#ff6f9c", "#ffffff"];
  const ALL = GOLD.concat(PINK);

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  function firework(x, y, colors) {
    const n = 42;
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 * i) / n;
      const sp = rand(2, 6);
      particles.push({
        x, y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        life: rand(50, 80), age: 0,
        color: pick(colors || ALL),
        size: rand(1.6, 3.2), grav: 0.045, type: "spark"
      });
    }
  }

  function launchFireworks(count) {
    let done = 0;
    const iv = setInterval(() => {
      firework(rand(W * 0.15, W * 0.85), rand(H * 0.15, H * 0.5), Math.random() < 0.5 ? GOLD : PINK);
      if (++done >= (count || 6)) clearInterval(iv);
    }, 350);
  }

  function confetti(count) {
    for (let i = 0; i < (count || 160); i++) {
      particles.push({
        x: rand(0, W), y: rand(-H * 0.3, 0),
        vx: rand(-1.5, 1.5), vy: rand(1.5, 4.5),
        life: rand(120, 200), age: 0,
        color: pick(ALL),
        size: rand(4, 8), grav: 0.03, type: "confetti",
        rot: rand(0, 6.28), vr: rand(-0.2, 0.2), w: rand(6, 11), h: rand(8, 14)
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age++;
      p.vy += p.grav;
      p.x += p.vx; p.y += p.vy;
      const alpha = Math.max(0, 1 - p.age / p.life);
      ctx.globalAlpha = alpha;
      if (p.type === "confetti") {
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8; ctx.shadowColor = p.color;
        ctx.arc(p.x, p.y, p.size, 0, 6.283);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      if (p.age >= p.life || p.y > H + 40) particles.splice(i, 1);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  tick();

  /* ============================================================
     DECORATIVE PARTICLE SPAWNERS (DOM emoji)
     ============================================================ */
  function spawnFloat(layer, emoji, opts) {
    opts = opts || {};
    const count = opts.count || 12;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "float-item";
      el.textContent = emoji;
      el.style.left = rand(0, 100) + "vw";
      el.style.fontSize = rand(opts.min || 16, opts.max || 34) + "px";
      el.style.setProperty("--drift", rand(-60, 60) + "px");
      el.style.setProperty("--spin", rand(-40, 40) + "deg");
      el.style.animationDuration = rand(opts.slow || 7, opts.fast || 15) + "s";
      el.style.animationDelay = rand(0, opts.spread || 12) + "s";
      layer.appendChild(el);
    }
  }

  function spawnFall(layer, emoji, opts) {
    opts = opts || {};
    const count = opts.count || 14;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "fall-item";
      el.textContent = emoji;
      el.style.left = rand(0, 100) + "vw";
      el.style.fontSize = rand(opts.min || 18, opts.max || 34) + "px";
      el.style.setProperty("--drift", rand(-80, 80) + "px");
      el.style.setProperty("--spin", rand(180, 540) + "deg");
      el.style.animationDuration = rand(opts.slow || 6, opts.fast || 12) + "s";
      el.style.animationDelay = rand(0, opts.spread || 10) + "s";
      layer.appendChild(el);
    }
  }

  function spawnStars(layer, count) {
    for (let i = 0; i < (count || 40); i++) {
      const s = document.createElement("div");
      s.className = "twinkle-star";
      const size = rand(1, 3);
      s.style.width = s.style.height = size + "px";
      s.style.left = rand(0, 100) + "vw";
      s.style.top = rand(0, 100) + "vh";
      s.style.animationDelay = rand(0, 3) + "s";
      layer.appendChild(s);
    }
  }

  function spawnGlitter(layer, count) {
    for (let i = 0; i < (count || 30); i++) {
      const g = document.createElement("div");
      g.className = "twinkle-star";
      g.style.width = g.style.height = rand(2, 4) + "px";
      g.style.background = pick(GOLD);
      g.style.left = rand(0, 100) + "vw";
      g.style.top = rand(0, 100) + "vh";
      g.style.boxShadow = "0 0 6px " + g.style.background;
      g.style.animationDelay = rand(0, 3) + "s";
      layer.appendChild(g);
    }
  }

  function spawnClouds(layer, count) {
    for (let i = 0; i < (count || 4); i++) {
      const c = document.createElement("div");
      c.className = "cloud";
      c.textContent = "☁️";
      c.style.top = rand(5, 55) + "vh";
      c.style.fontSize = rand(2.4, 4.5) + "rem";
      c.style.animationDuration = rand(28, 55) + "s";
      c.style.animationDelay = "-" + rand(0, 40) + "s";
      layer.appendChild(c);
    }
  }

  /* Build all decorative layers once */
  function buildDecor() {
    document.querySelectorAll(".balloons").forEach(l => {
      spawnFloat(l, "🎈", { count: 14, min: 26, max: 46, slow: 8, fast: 16 });
    });
    document.querySelectorAll(".butterflies").forEach(l => {
      spawnFloat(l, "🦋", { count: 12, min: 20, max: 36, slow: 9, fast: 17 });
    });
    document.querySelectorAll(".hearts-bg").forEach(l => {
      spawnFloat(l, "💖", { count: 14, min: 16, max: 34, slow: 7, fast: 15 });
    });
    document.querySelectorAll(".roses").forEach(l => {
      spawnFall(l, "🌹", { count: 18, min: 20, max: 38, slow: 6, fast: 12 });
    });
    document.querySelectorAll(".stars, .twinkle").forEach(l => spawnStars(l, 45));
    document.querySelectorAll(".glitter").forEach(l => spawnGlitter(l, 34));
    document.querySelectorAll(".clouds").forEach(l => spawnClouds(l, 5));
  }
  buildDecor();

  /* ============================================================
     NAVIGATION
     ============================================================ */
  const pages = Array.from(document.querySelectorAll(".page"));
  const dotsWrap = document.getElementById("dots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let current = 0;

  pages.forEach((p, i) => {
    const b = document.createElement("button");
    b.title = p.dataset.name || ("Page " + (i + 1));
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
  });
  const dotBtns = Array.from(dotsWrap.children);

  function goTo(i, force) {
    if (i < 0 || i >= pages.length) return;
    if (i === current && !force) return;
    pages[current].classList.remove("active");
    current = i;
    pages[current].classList.add("active");
    dotBtns.forEach((d, k) => d.classList.toggle("on", k === i));
    prevBtn.classList.toggle("hide", i === 0);
    nextBtn.classList.toggle("hide", i === pages.length - 1);
    onEnter(pages[i].dataset.name);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  document.querySelectorAll("[data-next]").forEach(b => b.addEventListener("click", next));

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight" || e.key === "PageDown") next();
    if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
  });

  /* Touch swipe (vertical or horizontal) */
  let tsX = 0, tsY = 0;
  document.addEventListener("touchstart", e => {
    tsX = e.touches[0].clientX; tsY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - tsX;
    const dy = e.changedTouches[0].clientY - tsY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next() : prev(); }
    else if (Math.abs(dy) > 70) { dy < 0 ? next() : prev(); }
  }, { passive: true });

  /* Wheel navigation (debounced) */
  let wheelLock = false;
  window.addEventListener("wheel", e => {
    // let the letter card scroll internally
    if (e.target.closest(".letter-card")) return;
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < 25) return;
    wheelLock = true;
    e.deltaY > 0 ? next() : prev();
    setTimeout(() => (wheelLock = false), 900);
  }, { passive: true });

  /* ---------- Per-page entrance effects ---------- */
  let letterTyped = false;
  function onEnter(name) {
    if (name === "Welcome") launchFireworks(5);
    if (name === "Cake") { /* wait for blow */ }
    if (name === "Letter" && !letterTyped) startTyping();
    if (name === "Wishes") launchFireworks(3);
    if (name === "Finale") { confetti(180); launchFireworks(10); }
  }

  /* ============================================================
     LETTER — typing animation
     ============================================================ */
  const LETTER = `My Dearest Sidra,

Happy 1st Birthday, my little princess.

Today you complete one beautiful year of filling our lives with happiness, love, and countless smiles. Although you are still too young to understand these words, I want you to know that you are one of Allah's most precious blessings to our family.

Watching you grow has been one of the greatest joys of my life. Your tiny hands, your innocent smile, and your beautiful laughter make every moment special.

As your mama, I pray that Allah grants you a life full of happiness, good health, endless success, and strong Iman. May He protect you from every difficulty, bless your heart with kindness, and guide every step you take.

May your future be brighter than the stars, your smile shine like the moon, and your dreams become reality.

I will always love you, support you, and pray for you.

Happy 1st Birthday, my little angel.

With endless love,
Your Mama ❤️`;

  function startTyping() {
    letterTyped = true;
    const el = document.getElementById("letterText");
    const caret = document.getElementById("caret");
    let i = 0;
    el.textContent = "";
    (function type() {
      if (i <= LETTER.length) {
        el.textContent = LETTER.slice(0, i);
        i++;
        // scroll the card as it fills
        const card = el.closest(".letter-card");
        card.scrollTop = card.scrollHeight;
        setTimeout(type, LETTER[i - 1] === "\n" ? 24 : 22);
      } else {
        caret.style.display = "none";
      }
    })();
  }

  /* ============================================================
     CAKE — blow out the candle
     ============================================================ */
  const flame = document.getElementById("flame");
  const cakeHint = document.getElementById("cakeHint");
  let blown = false;
  function blowCandle() {
    if (blown) return;
    blown = true;
    flame.classList.add("out");
    // smoke puff
    const candle = flame.parentElement;
    const smoke = document.createElement("div");
    smoke.className = "smoke";
    candle.appendChild(smoke);
    setTimeout(() => smoke.remove(), 1600);
    cakeHint.textContent = "Yaaay! Happy Birthday Sidra! 🎉";
    confetti(200);
    launchFireworks(8);
  }
  flame.addEventListener("click", blowCandle);

  /* ============================================================
     GALLERY slideshow
     ============================================================ */
  const total = 16;
  const slideImg = document.getElementById("slideImg");
  const thumbs = document.getElementById("thumbs");
  let slide = 0, slideTimer = null;

  for (let n = 1; n <= total; n++) {
    const t = document.createElement("img");
    t.src = "photos/" + n + ".jpg";
    t.loading = "lazy";
    t.alt = "Memory " + n;
    t.addEventListener("click", () => showSlide(n - 1, true));
    thumbs.appendChild(t);
  }
  const thumbEls = Array.from(thumbs.children);

  function showSlide(i, manual) {
    slide = (i + total) % total;
    slideImg.classList.add("swap");
    setTimeout(() => {
      slideImg.src = "photos/" + (slide + 1) + ".jpg";
      slideImg.classList.remove("swap");
    }, 250);
    thumbEls.forEach((t, k) => t.classList.toggle("sel", k === slide));
    if (manual) restartSlideTimer();
  }
  function restartSlideTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => showSlide(slide + 1), 3200);
  }
  document.getElementById("slideNext").addEventListener("click", () => showSlide(slide + 1, true));
  document.getElementById("slidePrev").addEventListener("click", () => showSlide(slide - 1, true));
  showSlide(0);
  restartSlideTimer();

  /* ============================================================
     REPLAY
     ============================================================ */
  document.getElementById("replayBtn").addEventListener("click", () => goTo(0));

  /* ============================================================
     MUSIC toggle (optional — needs music/song.mp3)
     ============================================================ */
  const bgm = document.getElementById("bgm");
  const musicBtn = document.getElementById("musicBtn");
  let playing = false;
  musicBtn.addEventListener("click", () => {
    if (playing) {
      bgm.pause(); musicBtn.textContent = "🔇"; playing = false;
    } else {
      bgm.play().then(() => {
        musicBtn.textContent = "🔊"; playing = true;
      }).catch(() => {
        musicBtn.textContent = "🎵";
        musicBtn.title = "Add music/song.mp3 to enable audio";
      });
    }
  });

})();
