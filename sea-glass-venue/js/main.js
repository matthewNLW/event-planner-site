/**
 * Sea Glass Venue - Main JavaScript
 * Handles navigation, scroll reveals, and common interactions
 */

(function () {
  "use strict";

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /**
   * Navigation functionality
   */
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelector(".nav__links");
  const navOverlay = document.querySelector(".nav__overlay");

  // Show nav after delay on homepage
  function initNavReveal() {
    if (!nav) return;

    // If nav doesn't have is-visible class, add it after delay
    if (!nav.classList.contains("is-visible")) {
      const delay = prefersReducedMotion ? 0 : 1200;
      setTimeout(() => {
        nav.classList.add("is-visible");
      }, delay);
    }
  }

  // Handle nav scroll state
  function handleNavScroll() {
    if (!nav) return;

    if (window.scrollY > 100) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }

  // Mobile nav toggle
  function toggleMobileNav() {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";

    navToggle.setAttribute("aria-expanded", !isOpen);
    navLinks.classList.toggle("is-open");
    navOverlay.classList.toggle("is-visible");

    // Prevent body scroll when nav is open
    document.body.style.overflow = isOpen ? "" : "hidden";

    // Update toggle label
    navToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  }

  // Close mobile nav
  function closeMobileNav() {
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
    navOverlay.classList.remove("is-visible");
    document.body.style.overflow = "";
    navToggle.setAttribute("aria-label", "Open menu");
  }

  // Initialize navigation
  function initNav() {
    initNavReveal();

    // Scroll handler
    window.addEventListener("scroll", handleNavScroll, { passive: true });
    handleNavScroll(); // Check initial state

    // Mobile nav toggle
    if (navToggle) {
      navToggle.addEventListener("click", toggleMobileNav);
    }

    // Close nav on overlay click
    if (navOverlay) {
      navOverlay.addEventListener("click", closeMobileNav);
    }

    // Close nav on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
        closeMobileNav();
        navToggle.focus();
      }
    });

    // Close nav when clicking a link
    navLinks.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", closeMobileNav);
    });
  }

  /**
   * Hero content reveal
   */
  function initHeroReveal() {
    const heroContent = document.querySelector(".hero__content");
    if (!heroContent) return;

    const delay = prefersReducedMotion ? 0 : 1500;
    setTimeout(() => {
      heroContent.classList.add("is-visible");
    }, delay);
  }

  /**
   * Scroll reveal animations using IntersectionObserver
   */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      // If reduced motion, show all elements immediately
      document.querySelectorAll(".reveal, .reveal-stagger").forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }

    const revealElements = document.querySelectorAll(
      ".reveal, .reveal-stagger",
    );

    if (!revealElements.length) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => observer.observe(el));
  }

  /**
   * FAQ Accordion (for details page using native details/summary)
   */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (item.open) {
          item.classList.add("is-open");
        } else {
          item.classList.remove("is-open");
        }
      });
    });
  }

  /**
   * Form validation (for inquiry page)
   */
  function initFormValidation() {
    const form = document.getElementById("inquiry-form");
    const successMessage = document.getElementById("form-success");

    if (!form) return;

    // Validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Clear error state
    function clearError(input) {
      const group = input.closest(".form-group");
      if (group) {
        group.classList.remove("has-error");
        input.classList.remove("is-invalid");
      }
    }

    // Set error state
    function setError(input) {
      const group = input.closest(".form-group");
      if (group) {
        group.classList.add("has-error");
        input.classList.add("is-invalid");
      }
    }

    // Validate individual field
    function validateField(input) {
      const value = input.value.trim();

      // Required fields
      if (input.required && !value) {
        setError(input);
        return false;
      }

      // Email format
      if (input.type === "email" && value && !emailPattern.test(value)) {
        setError(input);
        return false;
      }

      // Guest count range
      if (input.name === "guestCount" && value) {
        const count = parseInt(value, 10);
        if (isNaN(count) || count < 1 || count > 150) {
          setError(input);
          return false;
        }
      }

      clearError(input);
      return true;
    }

    // Validate date logic
    function validateDates() {
      const eventDate = document.getElementById("event-date");
      const arrivalDate = document.getElementById("arrival-date");
      const departureDate = document.getElementById("departure-date");

      let isValid = true;

      // Event date is required
      if (!eventDate.value) {
        setError(eventDate);
        isValid = false;
      }

      // If arrival date is set, it should be <= event date
      if (arrivalDate.value && eventDate.value) {
        if (new Date(arrivalDate.value) > new Date(eventDate.value)) {
          setError(arrivalDate);
          isValid = false;
        }
      }

      // If departure date is set, it should be >= event date
      if (departureDate.value && eventDate.value) {
        if (new Date(departureDate.value) < new Date(eventDate.value)) {
          setError(departureDate);
          isValid = false;
        }
      }

      return isValid;
    }

    // Real-time validation on blur
    form.querySelectorAll("input, select, textarea").forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => clearError(input));
    });

    // Form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate all required fields
      form
        .querySelectorAll("input[required], select[required]")
        .forEach((input) => {
          if (!validateField(input)) {
            isValid = false;
          }
        });

      // Validate date logic
      if (!validateDates()) {
        isValid = false;
      }

      if (isValid) {
        // Hide form, show success message
        form.style.display = "none";
        successMessage.classList.add("is-visible");

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: "smooth", block: "center" });

        // Focus success message for screen readers
        successMessage.focus();
      } else {
        // Focus first invalid field
        const firstError = form.querySelector(".is-invalid");
        if (firstError) {
          firstError.focus();
        }
      }
    });
  }

  /**
   * Smooth scroll for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (href === "#") return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }
      });
    });
  }

  /**
   * Initialize all functionality
   */
  function init() {
    initNav();
    initHeroReveal();
    initScrollReveal();
    initFaqAccordion();
    initFormValidation();
    initSmoothScroll();
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
