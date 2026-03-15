// ============================================
// TSUKIHI — 月日  |  Sumi-Ink Editorial Scripts
// ============================================

(function () {
  'use strict';

  // --- Header scroll state ---
  var header = document.getElementById('header');
  var lastScrollY = 0;
  var ticking = false;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  function updateHeader() {
    if (lastScrollY > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Mobile menu ---
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');

  if (menuBtn && nav) {
    function openMenu() {
      menuBtn.classList.add('is-open');
      nav.classList.add('is-open');
      header.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
      menuBtn.setAttribute('aria-label', 'メニューを閉じる');
      menuBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      menuBtn.classList.remove('is-open');
      nav.classList.remove('is-open');
      header.classList.remove('menu-open');
      document.body.style.overflow = '';
      menuBtn.setAttribute('aria-label', 'メニューを開く');
      menuBtn.setAttribute('aria-expanded', 'false');
    }

    menuBtn.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu on nav link click
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        menuBtn.focus();
      }
    });
  }

  // --- Scroll reveal with staggered animations ---
  var revealDefault = [
    '.section__header',
    '.product-card',
    '.craft__item',
    '.journal__item',
    '.newsletter',
    '.footer__nav-group',
    '.page-hero__title',
    '.timeline__item',
    '.value-item',
    '.product-grid-card',
    '.faq-item',
    '.store-card',
    '.job-card'
  ];

  var revealLight = [
    '.philosophy__lead',
    '.philosophy__body',
    '.page-hero__desc',
    '.footer__cta-inner'
  ];

  var revealSlideLeft = [
    '.philosophy__image',
    '.footer__brand'
  ];

  var revealSlow = [
    '.products__image'
  ];

  var allReveals = [];

  function setupReveals(selectors, className) {
    selectors.forEach(function (selector) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function (el, i) {
        el.classList.add(className);
        // Stagger within each group of siblings
        var parent = el.parentElement;
        if (parent) {
          var siblings = parent.querySelectorAll(selector);
          var index = Array.prototype.indexOf.call(siblings, el);
          if (index >= 0) {
            el.style.transitionDelay = (index * 0.08) + 's';
          }
        } else {
          el.style.transitionDelay = (i * 0.08) + 's';
        }
        allReveals.push(el);
      });
    });
  }

  setupReveals(revealDefault, 'reveal');
  setupReveals(revealLight, 'reveal--light');
  setupReveals(revealSlideLeft, 'reveal--slide-left');
  setupReveals(revealSlow, 'reveal--slow');

  // Use rootMargin for better trigger timing
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  allReveals.forEach(function (el) {
    observer.observe(el);
  });

  // --- Back to top ---
  var toTopBtn = document.getElementById('toTopBtn');
  if (toTopBtn) {
    toTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-item__question').forEach(function (btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-item__answer');
      var isOpen = item.classList.toggle('is-open');
      answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : '0';
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 76;
        var top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // --- Subtle parallax for hero image (performance-safe) ---
  var heroImage = document.querySelector('.hero__image img');
  if (heroImage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var heroSection = document.querySelector('.hero');
    var heroHeight = heroSection ? heroSection.offsetHeight : 0;
    var parallaxTicking = false;

    function updateParallax() {
      if (lastScrollY < heroHeight) {
        var offset = lastScrollY * 0.15;
        heroImage.style.transform = 'scale(1.05) translateY(' + offset + 'px)';
      }
      parallaxTicking = false;
    }

    window.addEventListener('scroll', function () {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
  }
})();
