/* ============================================================
   BIRTHDAY PORTAL — MAIN APP (HEARTBEAT EDITION)
   ============================================================ */

(() => {
  document.addEventListener('DOMContentLoaded', () => {

    const refs = {
      gate: document.getElementById('gate'),
      loader: document.getElementById('loader'),
      main: document.getElementById('main'),
      loaderCanvas: document.getElementById('loader-canvas'),
      starCanvas: document.getElementById('star-canvas'),
      bdayInput: document.getElementById('bday-answer'),
      submitBtn: document.getElementById('btn-enter'),
      errorMsg: document.getElementById('error-msg'),
      gateCard: document.querySelector('.gate-card'),
      loaderGreeting: document.querySelector('.loader-greeting'),
      loaderSub: document.querySelector('.loader-sub'),
      loaderBar: document.querySelector('.loader-bar'),
      typewriter: document.getElementById('typewriter-text'),
      readHint: document.getElementById('read-hint'),
      scrollHint: document.getElementById('main-scroll-hint')
    };

    initStarCanvas(refs.starCanvas);
    refs.gate.classList.add('active');

    function normalize(str) { return str.toLowerCase().replace(/[\s\-_.,!?'"]/g, '').trim(); }
    
    refs.submitBtn.addEventListener('click', () => {
      const input = refs.bdayInput.value;
      const normalized = normalize(input);
      if (normalized.includes("may11") || normalized === "0511" || normalized === "1105") {
        transitionToLoader();
      } else {
        refs.errorMsg.textContent = "That doesn't seem to be the right date... try again? ❤️";
        refs.errorMsg.classList.add('visible');
        refs.gateCard.classList.add('shake');
        setTimeout(() => refs.gateCard.classList.remove('shake'), 400);
      }
    });

    function transitionToLoader() {
      refs.gate.classList.remove('active');
      refs.gate.classList.add('exit');
      setTimeout(() => {
        refs.gate.style.display = 'none';
        refs.loader.classList.add('active');
        startLoaderAnimation();
      }, 650);
    }

    /* ── Heartbeat Animation ────────────────────────────────── */
    function startLoaderAnimation() {
      const heartController = initHeartbeatCanvas(refs.loaderCanvas);
      let progress = 0;
      const barInterval = setInterval(() => {
        progress = Math.min(progress + 1.2, 100);
        refs.loaderBar.style.width = progress + '%';
        if (progress >= 100) clearInterval(barInterval);
      }, 80);

      refs.loaderGreeting.textContent = `Happy Birthday, ${CONTENT.name} ✨`;
      setTimeout(() => refs.loaderGreeting.classList.add('visible'), 800);
      setTimeout(() => refs.loaderSub.classList.add('visible'), 1400);

      setTimeout(() => {
        heartController.stop();
        refs.loader.classList.remove('active');
        refs.loader.classList.add('exit');
        setTimeout(() => {
          refs.loader.style.display = 'none';
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
      refs.main.classList.add('active');
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
      content.innerHTML = type === 'video' ? `<video src="${src}" controls autoplay loop></video>` : `<img src="${src}">`;
      lb.classList.add('active');
    }

    document.getElementById('btn-close-lb').addEventListener('click', () => {
      document.getElementById('lightbox').classList.remove('active');
    });

    /* ── Typewriter (Simplified & Robust) ───────────────────── */
    function startTypewriter() {
      const messages = CONTENT.messages;
      const el = refs.typewriter;
      if (!el || !messages.length) { unlockScroll(); return; }

      let mIdx = 0, cIdx = 0, isDeleting = false;

      function type() {
        const currentMsg = messages[mIdx];
        if (!isDeleting) {
          el.textContent = currentMsg.substring(0, ++cIdx);
          if (cIdx === currentMsg.length) {
            if (mIdx === messages.length - 1) {
              setTimeout(unlockScroll, 1000);
              return;
            }
            setTimeout(() => { isDeleting = true; type(); }, 2000);
          } else {
            setTimeout(type, 30 + Math.random() * 30);
          }
        } else {
          el.textContent = currentMsg.substring(0, --cIdx);
          if (cIdx === 0) {
            isDeleting = false;
            mIdx = (mIdx + 1) % messages.length;
            setTimeout(type, 500);
          } else {
            setTimeout(type, 20);
          }
        }
      }
      
      function unlockScroll() {
        refs.main.classList.remove('scroll-locked');
        if (refs.readHint) refs.readHint.style.display = 'none';
        if (refs.scrollHint) {
          refs.scrollHint.style.opacity = '1';
          refs.scrollHint.style.pointerEvents = 'all';
        }
      }

      type();
    }

    function initScrollReveal() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
      }, { threshold: 0.1 });
      document.querySelectorAll('.timeline-item, .story-p').forEach(el => observer.observe(el));
    }

    function initStarCanvas(c) {
      const ctx = c.getContext('2d');
      let w, h, stars = [];
      function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; stars = Array.from({length: 120}, () => ({x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.2, o: Math.random()})); }
      window.addEventListener('resize', resize); resize();
      function draw() { ctx.clearRect(0,0,w,h); stars.forEach(s => { ctx.fillStyle = `rgba(255,255,255,${s.o})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill(); }); requestAnimationFrame(draw); }
      draw();
    }

    /* ── Heartbeat Monitor Canvas ──────────────────────────── */
    function initHeartbeatCanvas(c) {
      const ctx = c.getContext('2d');
      let w, h, active = true, x = 0;
      function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
      window.addEventListener('resize', resize); resize();
      
      const points = [];
      function draw() {
        if (!active) return;
        ctx.fillStyle = 'rgba(5, 7, 10, 0.1)';
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        
        ctx.beginPath();
        let y = h / 2;
        // Heartbeat spike logic
        const cycle = (x % 200);
        if (cycle > 140 && cycle < 150) y -= 40; // P wave
        else if (cycle >= 150 && cycle < 155) y += 10; // Q
        else if (cycle >= 155 && cycle < 165) y -= 120; // R (Big spike)
        else if (cycle >= 165 && cycle < 170) y += 30; // S
        else if (cycle >= 180 && cycle < 195) y -= 20; // T wave

        points.push({x, y});
        if (points.length > 50) points.shift();

        for(let i=1; i<points.length; i++){
          ctx.moveTo(points[i-1].x % w, points[i-1].y);
          ctx.lineTo(points[i].x % w, points[i].y);
        }
        ctx.stroke();

        x += 4;
        requestAnimationFrame(draw);
      }
      draw();
      return { stop: () => { active = false; ctx.clearRect(0,0,w,h); } };
    }
  });
})();
