/**
 * Sea Glass Venue - Animations & Micro-interactions
 * 
 * Implements high-end, subtle motion for the event planner website.
 * - Smart sticky header (hide/show on scroll)
 * - IntersectionObserver for scroll reveals
 * - Subtle parallax for hero section
 * - Performance-optimized using requestAnimationFrame
 */

(function () {
  'use strict';

  // State & Config
  const state = {
    lastScrollY: 0,
    ticking: false, // for rAF throttling
    headerVisible: true,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  const DOM = {
    nav: document.querySelector('.nav'),
    heroMedia: document.querySelector('.hero__media img'),
    revealElements: document.querySelectorAll('.reveal, .reveal-stagger'),
    timelineItems: document.querySelectorAll('.timeline__item')
  };

  /**
   * 1. Smart Sticky Header
   * Hides on scroll down, reveals on scroll up.
   * Adds background blur when not at top.
   */
  function updateHeader() {
    if (!DOM.nav) return;

    const scrollY = window.scrollY;
    const scrollDelta = scrollY - state.lastScrollY;
    const threshold = 100; // px to scroll before hiding

    // Determine generic styled state (background/glass effect)
    if (scrollY > 50) {
      DOM.nav.classList.add('is-scrolled');
    } else {
      DOM.nav.classList.remove('is-scrolled');
    }

    // Determine visibility (hide/show) styling
    // Only apply hide logic if we've scrolled past the initial threshold
    if (scrollY > threshold) {
      if (scrollDelta > 0 && state.headerVisible) {
        // Scrolling Down -> Hide
        DOM.nav.style.transform = 'translateY(-100%)';
        state.headerVisible = false;
      } else if (scrollDelta < -5 && !state.headerVisible) {
        // Scrolling Up (little buffer) -> Show
        DOM.nav.style.transform = 'translateY(0)';
        state.headerVisible = true;
      }
    } else {
      // Always show at top
      if (!state.headerVisible) {
        DOM.nav.style.transform = 'translateY(0)';
        state.headerVisible = true;
      }
    }

    state.lastScrollY = scrollY;
  }

  /**
   * 2. Hero Parallax
   * Subtle vertical parallax on the hero image for depth.
   */
  function updateHeroParallax() {
    if (!DOM.heroMedia || state.prefersReducedMotion) return;

    const scrollY = window.scrollY;
    // Only animate if in viewport (top of page)
    if (scrollY < window.innerHeight) {
      // Subtle movement: move image at 20% of scroll speed
      // Use translate3d for GPU acceleration
      const yPos = scrollY * 0.2;
      DOM.heroMedia.style.transform = `translate3d(0, ${yPos}px, 0)`;
    }
  }

  /**
   * Scroll Loop (requestAnimationFrame)
   * Centralizes all scroll-based updates for performance.
   */
  function onScroll() {
    if (!state.ticking) {
      window.requestAnimationFrame(() => {
        updateHeader();
        updateHeroParallax();
        state.ticking = false;
      });
      state.ticking = true;
    }
  }

  /**
   * 3. Scroll Reveal System
   * Uses IntersectionObserver to trigger CSS transitions.
   * One-time trigger (unobserve after reveal).
   */
  function initScrollReveal() {
    if (state.prefersReducedMotion) {
      // Reveal immediately if reduced motion is preferred
      DOM.revealElements.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // Trigger when element is 10% from bottom
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    DOM.revealElements.forEach(el => revealObserver.observe(el));
  }

  /**
   * 4. Timeline Animation
   * Ensures timeline items specifically have a clean sequential flow.
   * (They are already covered by .reveal class, but we ensure staggers if grouped)
   * Current HTML structure uses individual .reveal classes on items, which is better for long lists.
   * No extra JS needed here if they have .reveal class.
   */

  /**
   * 5. Micro-interactions
   * Add 3D Tilt effect to Detail Cards on hover?
   * Keeping it subtle as requested.
   */
  function initCardInteractions() {
    if (state.prefersReducedMotion) return;

    const cards = document.querySelectorAll('.detail-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate percentages from center
        const xPct = (x / rect.width) - 0.5;
        const yPct = (y / rect.height) - 0.5;

        // Very subtle tilt (max 5deg)
        // Using CSS variable for performant updates would be ideal, 
        // but direct transform is fine for small number of elements.
        // However, 'styles.css' has a hover scale effect. We should be careful not to conflict.
        // Let's stick to the subtle icon rotation defined in CSS (step 92) which is cleaner.
        // "Card & Button Micro-Interactions... shadow refinement" -> Handled in CSS.
        // So we will skip JS tilt to avoid "flashy" or "tech demo" feel.
      });
    });
  }

  /**
   * Initialization
   */
  function init() {
    // Event Listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial calls
    initScrollReveal();
    updateHeader(); // Set initial state
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
