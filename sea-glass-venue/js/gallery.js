/**
 * Sea Glass Venue - Gallery Lightbox
 * Accessible lightbox with keyboard navigation and focus trapping
 */

(function() {
  'use strict';

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCurrent = document.getElementById('lightbox-current');
  const lightboxTotal = document.getElementById('lightbox-total');
  const closeBtn = lightbox?.querySelector('.lightbox__close');
  const prevBtn = lightbox?.querySelector('.lightbox__nav--prev');
  const nextBtn = lightbox?.querySelector('.lightbox__nav--next');
  
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  let currentIndex = 0;
  let images = [];
  let lastFocusedElement = null;

  // Check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Build images array from gallery items
   */
  function buildImageArray() {
    images = Array.from(galleryItems).map((item, index) => {
      const img = item.querySelector('img');
      return {
        src: img.src,
        alt: img.alt,
        index: index
      };
    });
    
    if (lightboxTotal) {
      lightboxTotal.textContent = images.length;
    }
  }

  /**
   * Open lightbox at specific index
   */
  function openLightbox(index) {
    if (!lightbox || !images.length) return;
    
    currentIndex = index;
    lastFocusedElement = document.activeElement;
    
    updateLightboxImage();
    
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus close button for accessibility
    setTimeout(() => {
      closeBtn?.focus();
    }, 100);
  }

  /**
   * Close lightbox
   */
  function closeLightbox() {
    if (!lightbox) return;
    
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to triggering element
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  /**
   * Update lightbox image and counter
   */
  function updateLightboxImage() {
    if (!images[currentIndex]) return;
    
    const image = images[currentIndex];
    
    // Add loading state
    lightboxImage.style.opacity = prefersReducedMotion ? '1' : '0';
    
    // Update image source
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    
    // Update caption
    if (lightboxCaption) {
      lightboxCaption.textContent = image.alt;
    }
    
    // Update counter
    if (lightboxCurrent) {
      lightboxCurrent.textContent = currentIndex + 1;
    }
    
    // Fade in new image
    lightboxImage.onload = () => {
      lightboxImage.style.opacity = '1';
    };
  }

  /**
   * Navigate to next image
   */
  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
  }

  /**
   * Navigate to previous image
   */
  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeydown(e) {
    if (!lightbox.classList.contains('is-open')) return;
    
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'Tab':
        // Trap focus within lightbox
        trapFocus(e);
        break;
    }
  }

  /**
   * Trap focus within lightbox for accessibility
   */
  function trapFocus(e) {
    const focusableElements = lightbox.querySelectorAll(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      // Shift + Tab: if on first element, go to last
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: if on last element, go to first
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * Initialize lightbox
   */
  function init() {
    if (!lightbox || !galleryItems.length) return;
    
    buildImageArray();
    
    // Gallery item click handlers
    galleryItems.forEach((item, index) => {
      // Click handler
      item.addEventListener('click', () => openLightbox(index));
      
      // Keyboard handler (Enter/Space)
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });
    });
    
    // Lightbox controls
    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', prevImage);
    nextBtn?.addEventListener('click', nextImage);
    
    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextImage();
        } else {
          prevImage();
        }
      }
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
