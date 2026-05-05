/* ============================================================
   BIRTHDAY PORTAL — MAIN APP
   Reads from CONTENT (content.js) — no backend required.
   ============================================================ */

(() => {
  /* ── Wait for DOM ──────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {

    /* ── Refs ────────────────────────────────────────────────── */
    const gateEl       = document.getElementById('gate');
    const loaderEl     = document.getElementById('loader');
    const mainEl       = document.getElementById('main');
    const loaderCanvas = document.getElementById('loader-canvas');
    const starCanvas   = document.getElementById('star-canvas');

    const bdayInput    = document.getElementById('bday-answer');
    const submitBtn    = document.getElementById('btn-enter');
    const errorMsg     = document.getElementById('error-msg');
    const gateCard     = document.querySelector('.gate-card');

    const loaderGreeting = document.querySelector('.loader-greeting');
    const loaderSub      = document.querySelector('.loader-sub');
    const loaderBar      = document.querySelector('.loader-bar');

    /* ── Star Canvas background ──────────────────────────────── */
    initStarCanvas(starCanvas);

    /* ── Gate: show immediately ──────────────────────────────── */
    gateEl.classList.add('active');

    /* ────────────────────────────────────────────────────────── *
     * VALIDATION LOGIC
     * ────────────────────────────────────────────────────────── */
    function normalize(str) {
      return str
        .toLowerCase()
        .replace(/[\s\-_.,!?'"]/g, '') // strip spaces & punctuation
        .trim();
    }

    function validateBirthday(raw) {
      const normalized = normalize(raw);
      // Validates for "may11" or "0511" or "may11th"
      return normalized.includes("may11") || normalized === "0511" || normalized === "1105";
    }

    /* ── Submit Handler ──────────────────────────────────────── */
    submitBtn.addEventListener('click', handleSubmit);
    bdayInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSubmit(); });

    function handleSubmit() {
      const bdayOk = validateBirthday(bdayInput.value);

      if (!bdayOk) {
        errorMsg.textContent = "That doesn't seem to be the right date... try again? ❤️";
        errorMsg.classList.add('visible');
        gateCard.classList.remove('shake');
        void gateCard.offsetWidth; // reflow to restart animation
        gateCard.classList.add('shake');
        return;
      }

      // ── SUCCESS ──────────────────────────────────────────────
      errorMsg.classList.remove('visible');
      transitionToLoader();
    }

    /* ────────────────────────────────────────────────────────── *
     * LOADER TRANSITION
     * ────────────────────────────────────────────────────────── */
    function transitionToLoader() {
      // Exit gate
      gateEl.classList.remove('active');
      gateEl.classList.add('exit');

      setTimeout(() => {
        gateEl.style.display = 'none';
        loaderEl.classList.add('active');
        startLoaderAnimation();
      }, 650);
    }

    function startLoaderAnimation() {
      // Lexus streak canvas
      const streak = initStreakCanvas(loaderCanvas);

      // Progress bar fill
      let progress = 0;
      const barInterval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 3.5, 100);
        loaderBar.style.width = progress + '%';
        if (progress >= 100) clearInterval(barInterval);
      }, 80);

      // Greeting fade-in
      loaderGreeting.textContent = `Happy Birthday, ${CONTENT.name} (${CONTENT.altName}) ✨`;
      setTimeout(() => loaderGreeting.classList.add('visible'), 800);
      setTimeout(() => loaderSub.classList.add('visible'),    1400);

      // After ~6s → transition to Favorite Picture stage
      setTimeout(() => {
        streak.stop();
        loaderEl.classList.remove('active');
        loaderEl.classList.add('exit');
        
        setTimeout(() => {
          loaderEl.style.display = 'none';
          showFavPicStage();
        }, 700);
      }, 6000);
    }

    function showFavPicStage() {
      const favPicEl = document.getElementById('fav-pic-stage');
      const imgEl = favPicEl.querySelector('.fav-pic-img');
      
      // Update image source from content.js
      if (imgEl && CONTENT.favPic) {
        imgEl.src = CONTENT.favPic;
      }
      
      favPicEl.classList.add('active');

      // Show for 4 seconds, then transition to main
      setTimeout(() => {
        favPicEl.classList.remove('active');
        favPicEl.classList.add('exit');
        setTimeout(() => {
          favPicEl.style.display = 'none';
          showMain();
        }, 700);
      }, 4500);
    }

    /* ────────────────────────────────────────────────────────── *
     * MAIN CONTENT
     * ────────────────────────────────────────────────────────── */
    function showMain() {
      mainEl.classList.add('active');

      buildGallery();
      buildTimeline();
      startTypewriter();
      initScrollReveal();
    }

    /* ── Gallery Builder ─────────────────────────────────────── */
    function buildGallery() {
      const grid = document.getElementById('gallery-grid');
      grid.innerHTML = '';

      if (!CONTENT.gallery || CONTENT.gallery.length === 0) {
        grid.innerHTML = '<p style="color:rgba(240,244,255,0.3);font-size:0.85rem;letter-spacing:0.08em;">Add your files to content.js</p>';
        return;
      }

      CONTENT.gallery.forEach(({ src, caption }) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';

        const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm');

        if (!isVideo) {
          const img = document.createElement('img');
          img.src = src;
          img.alt = caption;
          img.loading = 'lazy';
          img.onerror = () => showPlaceholder(item);
          item.appendChild(img);
        } else {
          const vid = document.createElement('video');
          vid.src = src;
          vid.muted = true;
          vid.loop = true;
          vid.playsInline = true;
          vid.preload = 'metadata';
          vid.onerror = () => showPlaceholder(item);
          item.addEventListener('mouseenter', () => vid.play());
          item.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
          item.appendChild(vid);
        }

        // Overlay with caption
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `
          <div class="overlay-content">
            <p class="overlay-caption">${caption}</p>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </div>
        `;
        item.appendChild(overlay);

        // Lightbox click
        item.addEventListener('click', () => openLightbox(isVideo ? 'video' : 'image', path));

        grid.appendChild(item);
      });
    }

    function showPlaceholder(item) {
      item.innerHTML = `<div class="gallery-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="m21 15-5-5L5 21"/>
        </svg>
        <span>Add your file</span>
      </div>`;
    }

    /* ── Timeline Builder ────────────────────────────────────── */
    function buildTimeline() {
      const container = document.getElementById('timeline');
      container.innerHTML = '';

      CONTENT.timeline.forEach(({ date, text }) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
          <div class="tl-date">${date}</div>
          <div class="tl-body"><p>${text}</p></div>
        `;
        container.appendChild(item);
      });
    }

    /* ── Scroll Reveal (IntersectionObserver) ────────────────── */
    function initScrollReveal() {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add('reveal'), delay);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      document.querySelectorAll('.timeline-item').forEach((el, i) => {
        el.dataset.delay = i * 150;
        io.observe(el);
      });
    }

    /* ────────────────────────────────────────────────────────── *
     * TYPEWRITER ENGINE
     * ────────────────────────────────────────────────────────── */
    function startTypewriter() {
      const el = document.getElementById('typewriter-text');
      const messages = CONTENT.messages;
      let msgIdx = 0;
      let charIdx = 0;
      let deleting = false;
      let pauseTicks = 0;

      const PAUSE_AFTER_WRITE = 55;  // ticks to hold full message
      const PAUSE_AFTER_DEL   = 12;  // ticks to hold empty

      function tick() {
        const msg = messages[msgIdx];

        if (pauseTicks > 0) {
          pauseTicks--;
          setTimeout(tick, 60);
          return;
        }

        if (!deleting) {
          if (charIdx < msg.length) {
            el.textContent = msg.slice(0, ++charIdx);
            // Slower speed for easy reading
            const variance = 55 + Math.random() * 90;
            setTimeout(tick, msg[charIdx - 1] === ' ' ? variance * 0.7 : variance);
          } else {
            pauseTicks = PAUSE_AFTER_WRITE;
            deleting = true;
            setTimeout(tick, 60);
          }
        } else {
          if (charIdx > 0) {
            el.textContent = msg.slice(0, --charIdx);
            setTimeout(tick, 20 + Math.random() * 15);
          } else {
            deleting = false;
            
            // Check if we finished the last message to unlock scroll
            if (msgIdx === messages.length - 1) {
              unlockScroll();
            }

            msgIdx = (msgIdx + 1) % messages.length;
            pauseTicks = PAUSE_AFTER_DEL;
            setTimeout(tick, 60);
          }
        }
      }

      function unlockScroll() {
        const main = document.getElementById('main');
        const hint = document.getElementById('read-hint');
        const scrollHint = document.getElementById('main-scroll-hint');
        
        main.classList.remove('scroll-locked');
        if (hint) hint.style.display = 'none';
        if (scrollHint) {
          scrollHint.style.opacity = '0.4';
          scrollHint.style.pointerEvents = 'all';
        }
      }

      setTimeout(tick, 800);
    }

    /* ────────────────────────────────────────────────────────── *
     * LIGHTBOX
     * ────────────────────────────────────────────────────────── */
    const lightbox      = document.getElementById('lightbox');
    const lightboxInner = document.getElementById('lightbox-inner');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(type, src) {
      lightboxInner.innerHTML = '';
      if (type === 'image') {
        const img = document.createElement('img');
        img.src = src; img.alt = 'Memory';
        lightboxInner.appendChild(img);
      } else {
        const vid = document.createElement('video');
        vid.src = src; vid.controls = true; vid.autoplay = true; vid.playsInline = true;
        lightboxInner.appendChild(vid);
      }
      lightbox.classList.add('open');
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      // Stop any playing video
      const vid = lightboxInner.querySelector('video');
      if (vid) vid.pause();
      setTimeout(() => { lightboxInner.innerHTML = ''; }, 400);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

    /* ════════════════════════════════════════════════════════════
     * CANVAS SYSTEMS
     * ════════════════════════════════════════════════════════════ */

    /* ── Star / Galaxy Canvas ────────────────────────────────── */
    function initStarCanvas(canvas) {
      const ctx = canvas.getContext('2d');
      let W, H, stars = [], particles = [];
      let raf;

      function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        buildStars();
      }

      function buildStars() {
        stars = [];
        const count = Math.floor((W * H) / 3200);
        for (let i = 0; i < count; i++) {
          stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.4 + 0.2,
            a: Math.random(),
            speed: 0.002 + Math.random() * 0.006,
            phase: Math.random() * Math.PI * 2
          });
        }
        // floating glitter particles
        particles = [];
        for (let i = 0; i < 28; i++) {
          particles.push(newParticle(W, H));
        }
      }

      function newParticle(W, H) {
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.2 - Math.random() * 0.4,
          r: Math.random() * 2.2 + 0.5,
          a: Math.random() * 0.6 + 0.2,
          hue: Math.random() > 0.6 ? 220 : 45, // blue or gold
          life: 0,
          maxLife: 180 + Math.random() * 240
        };
      }

      function drawFrame(t) {
        ctx.clearRect(0, 0, W, H);

        // Stars
        stars.forEach(s => {
          const alpha = s.a * 0.55 * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,215,255,${alpha})`;
          ctx.fill();
        });

        // Glitter particles
        particles.forEach((p, i) => {
          p.x += p.vx; p.y += p.vy; p.life++;
          const progress = p.life / p.maxLife;
          const alpha = p.a * (1 - progress);

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue},90%,75%,${alpha})`;
          ctx.fill();

          if (p.life >= p.maxLife || p.y < -10) {
            particles[i] = newParticle(W, H);
          }
        });

        raf = requestAnimationFrame(drawFrame);
      }

      window.addEventListener('resize', resize);
      resize();
      raf = requestAnimationFrame(drawFrame);
    }

    /* ── Loader: Lexus Streak Canvas ─────────────────────────── */
    function initStreakCanvas(canvas) {
      const ctx = canvas.getContext('2d');
      let W, H;
      let running = true;
      let streaks = [];
      let glitters = [];
      let raf;

      function resize() {
        W = canvas.width  = canvas.offsetWidth  || window.innerWidth;
        H = canvas.height = canvas.offsetHeight || window.innerHeight;
      }

      window.addEventListener('resize', resize);
      resize();

      // Generate initial streaks
      function newStreak() {
        const isRed  = Math.random() < 0.42;
        const fromLeft = Math.random() < 0.5;
        return {
          x: fromLeft ? -80 : W + 80,
          y: H * (0.35 + Math.random() * 0.3),
          len: 120 + Math.random() * 200,
          speed: (2.5 + Math.random() * 4.5) * (fromLeft ? 1 : -1),
          width: 1.5 + Math.random() * 3,
          hue: isRed ? 0 : 218,
          sat: isRed ? 95 : 85,
          alpha: 0.7 + Math.random() * 0.3,
          life: 0,
          maxLife: 90 + Math.random() * 60
        };
      }

      for (let i = 0; i < 6; i++) {
        const s = newStreak();
        s.life = Math.random() * s.maxLife; // stagger
        streaks.push(s);
      }

      function newGlitter() {
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 2.5 + 0.5,
          a: Math.random(),
          vx: (Math.random() - 0.5) * 1.2,
          vy: -0.5 - Math.random() * 1,
          hue: Math.random() > 0.5 ? 218 : 0,
          life: 0,
          maxLife: 60 + Math.random() * 80
        };
      }

      for (let i = 0; i < 40; i++) glitters.push(newGlitter());

      function draw(t) {
        if (!running) return;

        // Fade trail
        ctx.fillStyle = 'rgba(8,10,16,0.18)';
        ctx.fillRect(0, 0, W, H);

        // Streaks
        streaks.forEach((s, i) => {
          s.x += s.speed;
          s.life++;

          const fade = Math.min(s.life / 15, 1) * Math.max(1 - (s.life - s.maxLife * 0.7) / (s.maxLife * 0.3), 0.15);

          const grad = ctx.createLinearGradient(
            s.x, s.y,
            s.x - s.len * Math.sign(s.speed), s.y
          );
          grad.addColorStop(0, `hsla(${s.hue},${s.sat}%,65%,${s.alpha * fade})`);
          grad.addColorStop(0.4, `hsla(${s.hue},${s.sat}%,55%,${s.alpha * fade * 0.6})`);
          grad.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.len * Math.sign(s.speed), s.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = s.width;
          ctx.shadowBlur = 12;
          ctx.shadowColor = `hsl(${s.hue},${s.sat}%,65%)`;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Glow dot at head
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.width * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue},${s.sat}%,90%,${s.alpha * fade})`;
          ctx.fill();

          if (s.life >= s.maxLife) {
            streaks[i] = newStreak();
          }
        });

        // Glitter
        glitters.forEach((g, i) => {
          g.x += g.vx; g.y += g.vy; g.life++;
          const alpha = g.a * (1 - g.life / g.maxLife);
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${g.hue},85%,75%,${alpha})`;
          ctx.fill();
          if (g.life >= g.maxLife) glitters[i] = newGlitter();
        });

        raf = requestAnimationFrame(draw);
      }

      raf = requestAnimationFrame(draw);

      return {
        stop() {
          running = false;
          cancelAnimationFrame(raf);
          ctx.clearRect(0, 0, W, H);
        }
      };
    }

  }); // end DOMContentLoaded
})();
