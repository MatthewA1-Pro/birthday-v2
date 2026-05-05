/* ============================================================
   BIRTHDAY PORTAL — MAIN APP (LUXURY EDITION)
   ============================================================ */

(() => {
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

    /* ── Star Background ────────────────────────────────────── */
    initStarCanvas(starCanvas);
    gateEl.classList.add('active');

    /* ── Validation ─────────────────────────────────────────── */
    function normalize(str) { return str.toLowerCase().replace(/[\s\-_.,!?'"]/g, '').trim(); }
    function validateBirthday(raw) {
      const n = normalize(raw);
      return n.includes("may11") || n === "0511" || n === "1105";
    }

    submitBtn.addEventListener('click', handleSubmit);
    bdayInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSubmit(); });

    function handleSubmit() {
      if (validateBirthday(bdayInput.value)) {
        transitionToLoader();
      } else {
        errorMsg.textContent = "That doesn't seem to be the right date... try again? ❤️";
        errorMsg.classList.add('visible');
        gateCard.classList.remove('shake');
        void gateCard.offsetWidth;
        gateCard.classList.add('shake');
      }
    }

    function transitionToLoader() {
      gateEl.classList.remove('active');
      gateEl.classList.add('exit');
      setTimeout(() => {
        gateEl.style.display = 'none';
        loaderEl.classList.add('active');
        startLoaderAnimation();
      }, 650);
    }

    /* ── Luxury Loader Animation ────────────────────────────── */
    function startLoaderAnimation() {
      const streakController = initLuxuryStreaks(loaderCanvas);
      let progress = 0;
      const barInterval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 2.5, 100);
        loaderBar.style.width = progress + '%';
        if (progress >= 100) clearInterval(barInterval);
      }, 70);

      loaderGreeting.textContent = `Happy Birthday, ${CONTENT.name} ✨`;
      setTimeout(() => loaderGreeting.classList.add('visible'), 800);
      setTimeout(() => loaderSub.classList.add('visible'), 1400);

      setTimeout(() => {
        streakController.stop();
        loaderEl.classList.remove('active');
        loaderEl.classList.add('exit');
        setTimeout(() => {
          loaderEl.style.display = 'none';
          showFavPicStage();
        }, 700);
      }, 6500);
    }

    function showFavPicStage() {
      const favPicEl = document.getElementById('fav-pic-stage');
      const imgEl = favPicEl.querySelector('.fav-pic-img');
      const tempImg = new Image();
      tempImg.src = CONTENT.favPic;
      tempImg.onload = () => {
        imgEl.src = CONTENT.favPic;
        favPicEl.classList.add('active');
        setTimeout(() => {
          favPicEl.classList.remove('active');
          favPicEl.classList.add('exit');
          setTimeout(() => {
            favPicEl.style.display = 'none';
            showMain();
          }, 800);
        }, 5000);
      };
      tempImg.onerror = () => showMain();
    }

    function showMain() {
      mainEl.classList.add('active');
      renderStory();
      buildGallery();
      renderTimeline();
      startTypewriter();
      initScrollReveal();
    }

    function renderStory() {
      const titleEl = document.getElementById('story-title');
      const contentEl = document.getElementById('story-content');
      if (CONTENT.story) {
        titleEl.textContent = CONTENT.story.title;
        contentEl.innerHTML = CONTENT.story.paragraphs.map(p => `<p class="story-p">${p}</p>`).join('');
      }
    }

    function buildGallery() {
      const grid = document.getElementById('gallery-grid');
      grid.innerHTML = '';
      (CONTENT.gallery || []).forEach(({ src, caption }) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm');
        if (!isVideo) {
          const img = document.createElement('img');
          img.src = src; img.alt = caption; img.loading = 'lazy';
          img.onerror = () => item.innerHTML = '<div class="placeholder">Media Missing</div>';
          item.appendChild(img);
        } else {
          const vid = document.createElement('video');
          vid.src = src; vid.muted = true; vid.loop = true; vid.playsInline = true;
          item.appendChild(vid);
          item.addEventListener('mouseenter', () => vid.play());
          item.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
        }
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `<div class="overlay-content"><p class="overlay-caption">${caption}</p></div>`;
        item.appendChild(overlay);
        item.addEventListener('click', () => openLightbox(isVideo ? 'video' : 'image', src));
        grid.appendChild(item);
      });
    }

    function renderTimeline() {
      const list = document.getElementById('timeline-list');
      list.innerHTML = '';
      (CONTENT.timeline || []).forEach(item => {
        const div = document.createElement('div');
        div.className = 'timeline-item';
        div.innerHTML = `<div class="timeline-content"><span class="timeline-date">${item.date}</span><p class="timeline-text">${item.text}</p></div>`;
        list.appendChild(div);
      });
    }

    function openLightbox(type, src) {
      const lb = document.getElementById('lightbox');
      const content = lb.querySelector('.lightbox-content');
      content.innerHTML = type === 'video' 
        ? `<video src="${src}" controls autoplay loop></video>`
        : `<img src="${src}" alt="Full View">`;
      lb.classList.add('active');
    }

    document.getElementById('btn-close-lb').addEventListener('click', () => {
      document.getElementById('lightbox').classList.remove('active');
      document.getElementById('lightbox').querySelector('.lightbox-content').innerHTML = '';
    });

    /* ── Typewriter Logic (Restored Organic Feel) ───────────── */
    function startTypewriter() {
      const el = document.getElementById('typewriter-text');
      const messages = CONTENT.messages;
      let msgIdx = 0, charIdx = 0, deleting = false, pauseTicks = 0;

      function tick() {
        if (pauseTicks > 0) { pauseTicks--; setTimeout(tick, 100); return; }
        const msg = messages[msgIdx];
        if (!deleting) {
          if (charIdx < msg.length) {
            el.textContent = msg.slice(0, ++charIdx);
            const variance = 25 + Math.random() * 35;
            setTimeout(tick, msg[charIdx - 1] === ' ' ? variance * 0.6 : variance);
          } else {
            if (msgIdx === messages.length - 1) { unlockScroll(); return; }
            pauseTicks = 30; deleting = true; setTimeout(tick, 60);
          }
        } else {
          if (charIdx > 0) { el.textContent = msg.slice(0, --charIdx); setTimeout(tick, 15); }
          else { deleting = false; msgIdx = (msgIdx + 1) % messages.length; setTimeout(tick, 60); }
        }
      }

      function unlockScroll() {
        mainEl.classList.remove('scroll-locked');
        document.getElementById('read-hint').style.display = 'none';
        const hint = document.getElementById('main-scroll-hint');
        hint.style.opacity = '1'; hint.style.pointerEvents = 'all';
      }
      setTimeout(tick, 1200);
    }

    function initScrollReveal() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
      }, { threshold: 0.1 });
      document.querySelectorAll('.timeline-item, .story-p').forEach(el => observer.observe(el));
    }

    /* ── High-End Canvas Backgrounds ──────────────────────── */
    function initStarCanvas(c) {
      const ctx = c.getContext('2d');
      let w, h, stars = [];
      function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; stars = Array.from({length: 150}, () => ({x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.5, o: Math.random(), v: Math.random()*0.2})); }
      window.addEventListener('resize', resize); resize();
      function draw() { ctx.clearRect(0,0,w,h); stars.forEach(s => { s.y -= s.v; if(s.y<0) s.y=h; ctx.fillStyle = `rgba(255,255,255,${s.o})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill(); }); requestAnimationFrame(draw); }
      draw();
    }

    function initLuxuryStreaks(c) {
      const ctx = c.getContext('2d');
      let w, h, active = true;
      function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
      window.addEventListener('resize', resize); resize();
      const lines = Array.from({length: 40}, () => ({y: Math.random(), s: 5 + Math.random()*15, c: Math.random()>0.5?'#3b82f6':'#ef4444', w: 1+Math.random()*2, o: Math.random()*w}));
      function draw() {
        if (!active) return;
        ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(0,0,w,h);
        lines.forEach(l => {
          l.o += l.s; if (l.o > w) l.o = -200;
          ctx.beginPath(); ctx.strokeStyle = l.c; ctx.lineWidth = l.w; ctx.globalAlpha = 0.6;
          const yPos = l.y * h;
          ctx.moveTo(l.o, yPos); ctx.lineTo(l.o + 200, yPos); ctx.stroke();
          ctx.shadowBlur = 10; ctx.shadowColor = l.c;
        });
        requestAnimationFrame(draw);
      }
      draw();
      return { stop: () => { active = false; ctx.clearRect(0,0,w,h); } };
    }
  });
})();
