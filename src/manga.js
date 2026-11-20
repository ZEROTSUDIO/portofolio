/**
 * ═════════════════════════════════════════════════════════════════════
 * ZEROTSUDIO MANGA UI (v3.0.0) // RUNTIME INTERACTION ENGINE
 * Tactile Micro-Interactions, GSAP Physics & Portfolio UI Suite
 * Arief Rizal Bayhaqi — Backend & Data Developer Portfolio
 * ═════════════════════════════════════════════════════════════════════
 */

export const MangaUI = {

  /* ─────────────────────────────────────────────────────────────────
     1. TACTILE TOAST NOTIFICATIONS
  ───────────────────────────────────────────────────────────────── */
  toast(message, type = 'info', duration = 3200) {
    let container = document.getElementById('mangaToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'mangaToastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-manga ${type}`;
    const badgeChar = type === 'success' ? '✔' : (type === 'error' ? '✖' : '零');
    const badgeBg = type === 'error' 
      ? 'var(--blood)' 
      : (type === 'success' ? 'var(--success)' : 'var(--signal)');

    toast.innerHTML = `
      <div class="stamp w-6 h-6 border shadow-none" style="background:${badgeBg}">
        <span class="text-[9px]">${badgeChar}</span>
      </div>
      <div class="flex flex-col">
        <span class="font-mono text-xs uppercase font-bold text-[var(--ink)]">${message}</span>
        <span class="font-mono text-[9px] text-[var(--ink-muted)]">TELEMETRY // ${new Date().toLocaleTimeString()}</span>
      </div>
    `;
    container.appendChild(toast);

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(toast,
        { x: 120, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.3, 
          ease: 'back.out(1.4)',
          onComplete: () => {
            setTimeout(() => {
              gsap.to(toast, { 
                x: 120, 
                opacity: 0, 
                duration: 0.22, 
                ease: 'power2.in',
                onComplete: () => toast.remove()
              });
            }, duration);
          }
        }
      );
    } else {
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250);
      }, duration);
    }
  },

  /* ─────────────────────────────────────────────────────────────────
     2. MODAL OPEN / CLOSE (Game & Spec Dialogs)
  ───────────────────────────────────────────────────────────────── */
  openModal(modalOrId) {
    const modal = typeof modalOrId === 'string' ? document.getElementById(modalOrId) : modalOrId;
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();

    if (typeof gsap !== 'undefined') {
      const box = modal.querySelector('.modal-box, .modal-box-game');
      if (box) {
        gsap.fromTo(box,
          { y: 20, scale: 0.96, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(1.6)' }
        );
      }
      const rows = modal.querySelectorAll('.modal-item-row');
      if (rows.length) {
        gsap.fromTo(rows,
          { x: -16, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.2, stagger: 0.05, ease: 'power2.out', delay: 0.08 }
        );
      }
    }
  },

  closeModal(modalOrId) {
    const modal = typeof modalOrId === 'string' ? document.getElementById(modalOrId) : modalOrId;
    if (!modal) return;
    if (typeof gsap !== 'undefined') {
      const box = modal.querySelector('.modal-box, .modal-box-game');
      if (box) {
        gsap.to(box, {
          y: 12, 
          scale: 0.98, 
          opacity: 0, 
          duration: 0.18, 
          ease: 'power2.in',
          onComplete: () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }
        });
        return;
      }
    }
    modal.classList.remove('active');
    document.body.style.overflow = '';
  },

  /* ─────────────────────────────────────────────────────────────────
     3. 1-CLICK CLIPBOARD COPY TRIGGER
  ───────────────────────────────────────────────────────────────── */
  initClipboard() {
    document.addEventListener('click', e => {
      const copyBtn = e.target.closest('[data-copy]');
      if (!copyBtn) return;
      
      const target = copyBtn.getAttribute('data-copy');
      let textToCopy = target;
      if (target.startsWith('#') || target.startsWith('.')) {
        const targetEl = document.querySelector(target);
        if (targetEl) textToCopy = targetEl.value || targetEl.textContent;
      }
      
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy.trim())
          .then(() => MangaUI.toast(`COPIED TO CLIPBOARD: ${textToCopy.trim()}`, 'success'))
          .catch(() => MangaUI.toast('CLIPBOARD ACCESS DENIED', 'error'));
      }
    });
  },

  /* ─────────────────────────────────────────────────────────────────
     4. BUTTON & CHIP SPRING PHYSICS (GSAP)
  ───────────────────────────────────────────────────────────────── */
  initButtonPhysics() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn-solid, .btn-blood, .btn-orange, .btn-outline, .chip, .card-project, .keycap, .hud-action');
      if (!btn || typeof gsap === 'undefined') return;
      
      gsap.timeline()
        .to(btn, { scale: 0.96, duration: 0.07, ease: 'power2.in' })
        .to(btn, { scale: 1, duration: 0.2, ease: 'back.out(2.2)' });
    });
  },

  /* ─────────────────────────────────────────────────────────────────
     5. DUAL PROJECT VIEW SWITCHER (Cards vs Move-List Table)
  ───────────────────────────────────────────────────────────────── */
  initProjectViewToggle() {
    document.addEventListener('click', e => {
      const toggleBtn = e.target.closest('[data-project-view]');
      if (!toggleBtn) return;
      
      const viewMode = toggleBtn.getAttribute('data-project-view');
      const cardsContainer = document.getElementById('projectsGrid');
      const tableContainer = document.getElementById('projectsTable');
      if (!cardsContainer || !tableContainer) return;

      // Update button active styling
      document.querySelectorAll('[data-project-view]').forEach(btn => {
        btn.classList.remove('bg-[var(--ink)]', 'text-white', 'active');
        btn.classList.add('bg-[var(--paper-dim)]', 'text-[var(--ink)]');
      });
      toggleBtn.classList.remove('bg-[var(--paper-dim)]', 'text-[var(--ink)]');
      toggleBtn.classList.add('bg-[var(--ink)]', 'text-white', 'active');

      if (viewMode === 'table') {
        cardsContainer.classList.add('hidden');
        cardsContainer.style.display = 'none';
        tableContainer.classList.remove('hidden');
        tableContainer.style.display = 'block';

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(tableContainer,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
          );
        }
        MangaUI.toast('SWITCHED VIEW // MOVE-LIST COMMAND MATRIX', 'info', 1800);
      } else {
        tableContainer.classList.add('hidden');
        tableContainer.style.display = 'none';
        cardsContainer.classList.remove('hidden');
        cardsContainer.style.display = '';

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(cardsContainer.children,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.28, stagger: 0.06, ease: 'power2.out' }
          );
        }
        MangaUI.toast('SWITCHED VIEW // TACTILE MANGA CARDS', 'info', 1800);
      }
    });
  },

  /* ─────────────────────────────────────────────────────────────────
     6. MOVE LIST ROW SELECTION & DETAIL INSPECTION
  ───────────────────────────────────────────────────────────────── */
  initMoveListRows() {
    document.addEventListener('click', e => {
      const row = e.target.closest('tr[data-activatable], .move-list-row');
      if (!row) return;
      
      const container = row.closest('tbody, [data-row-container]');
      if (container) {
        container.querySelectorAll('tr, .move-list-row').forEach(r => {
          r.classList.remove('row-active', 'active');
        });
      }
      row.classList.add(row.tagName === 'TR' ? 'row-active' : 'active');

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(row, { scaleY: 0.94 }, { scaleY: 1, duration: 0.2, ease: 'back.out(2)' });
      }

      // Sync project title toast if available
      const projectTitle = row.dataset.title || row.querySelector('.move-name, h3')?.textContent;
      if (projectTitle && !e.target.closest('a, button')) {
        MangaUI.toast(`INSPECTING RECORD // ${projectTitle.trim()}`, 'info', 1800);
      }
    });
  },

  /* ─────────────────────────────────────────────────────────────────
     7. KEYBOARD SHORTCUTS & NAVIGATION
  ───────────────────────────────────────────────────────────────── */
  initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');

      // Esc closes modals
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) MangaUI.closeModal(activeModal);
        
        // Also close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          mobileMenu.classList.remove('flex');
          const menuBtn = document.getElementById('menuBtn');
          if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
        }
      }

      // Ctrl + K quick jump to contact
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          MangaUI.toast('JUMP // COMMS TRANSMISSION (CTRL+K)', 'info', 1800);
        }
      }

      // Number keys 1-5 for quick section jumping
      if (!isInput && !e.ctrlKey && !e.altKey && !e.metaKey && e.key >= '1' && e.key <= '5') {
        const sectionMap = {
          '1': { id: '#hero', label: '01 HERO DOSSIER' },
          '2': { id: '#about', label: '02 CHARACTER SHEET' },
          '3': { id: '#projects', label: '03 MOVE LIST (PROJECTS)' },
          '4': { id: '#stack', label: '04 TECH LOADOUT' },
          '5': { id: '#contact', label: '05 COMMS TRANSMISSION' }
        };
        const target = sectionMap[e.key];
        if (target) {
          const el = document.querySelector(target.id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            MangaUI.toast(`JUMP // ${target.label}`, 'info', 1600);
          }
        }
      }

      // Arrow navigation for table rows when in focus
      if (!isInput && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        const activeTable = document.querySelector('#projectsTable:not(.hidden) tbody, [data-row-container]');
        if (activeTable) {
          const rows = Array.from(activeTable.querySelectorAll('tr[data-activatable], .move-list-row'));
          const currentIdx = rows.findIndex(r => r.classList.contains('row-active') || r.classList.contains('active'));
          let nextIdx = currentIdx;
          if (e.key === 'ArrowDown') {
            nextIdx = currentIdx < rows.length - 1 ? currentIdx + 1 : 0;
          } else {
            nextIdx = currentIdx > 0 ? currentIdx - 1 : rows.length - 1;
          }
          if (rows[nextIdx]) {
            e.preventDefault();
            rows[nextIdx].click();
          }
        }
      }
    });
  },

  /* ─────────────────────────────────────────────────────────────────
     8. STAT BARS INTERSECTION OBSERVER
  ───────────────────────────────────────────────────────────────── */
  initStatBars() {
    const statFills = document.querySelectorAll('.stat-fill');
    if (!statFills.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          const targetWidth = entry.target.style.getPropertyValue('--target-width') 
            || entry.target.getAttribute('data-percent');
          if (targetWidth) {
            entry.target.style.width = targetWidth.includes('%') ? targetWidth : targetWidth + '%';
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    statFills.forEach(fill => observer.observe(fill));
  },

  /* ─────────────────────────────────────────────────────────────────
     9. MOBILE NAVIGATION DRAWER
  ───────────────────────────────────────────────────────────────── */
  initMobileNav() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
      const isClosed = mobileMenu.classList.contains('hidden');
      if (isClosed) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
        menuBtn.setAttribute('aria-expanded', 'true');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(mobileMenu,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }
          );
        }
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking on any mobile nav-link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  },

  /* ─────────────────────────────────────────────────────────────────
     10. DYNAMIC TELEMETRY COORDINATES (X/Y Tracker)
  ───────────────────────────────────────────────────────────────── */
  initTelemetryCoords() {
    const coordsDisplay = document.querySelector('[data-telemetry-coords]');
    if (coordsDisplay) {
      const updateCoords = () => {
        coordsDisplay.textContent = `X:${window.innerWidth} // Y:${Math.round(window.scrollY)} // REG.OK`;
      };
      window.addEventListener('scroll', updateCoords, { passive: true });
      window.addEventListener('resize', updateCoords, { passive: true });
      updateCoords();
    }
  },

  /* ─────────────────────────────────────────────────────────────────
     INITIALIZE ALL SUBSYSTEMS
  ───────────────────────────────────────────────────────────────── */
  init() {
    this.initButtonPhysics();
    this.initClipboard();
    this.initProjectViewToggle();
    this.initMoveListRows();
    this.initKeyboardShortcuts();
    this.initStatBars();
    this.initMobileNav();
    this.initTelemetryCoords();

    // Modal click triggers
    document.addEventListener('click', e => {
      const openBtn = e.target.closest('[data-modal-open]');
      if (openBtn) {
        this.openModal(openBtn.getAttribute('data-modal-open'));
        return;
      }
      const closeBtn = e.target.closest('[data-modal-close]');
      if (closeBtn) {
        const modal = closeBtn.closest('.modal-overlay');
        if (modal) this.closeModal(modal);
        return;
      }
      if (e.target.classList.contains('modal-overlay')) {
        this.closeModal(e.target);
      }
    });

    console.log('%c ZEROTSU MANGA UI v3.0 // READY ', 'background: #0A090D; color: #5BB8D4; font-family: monospace; font-size: 11px; font-weight: bold; padding: 4px 8px; border: 1.5px solid #5BB8D4;');
  }

};

// Expose globally for inline onclick triggers
if (typeof window !== 'undefined') {
  window.MangaUI = MangaUI;
}
