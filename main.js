// ============================================
// TSUKIHI — 月日  |  Landing Page Scripts
// ============================================

(function () {
  'use strict';

  // --- Header scroll state ---
  const header = document.getElementById('header');
  let lastScrollY = 0;
  let ticking = false;

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
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');

  menuBtn.addEventListener('click', function () {
    const isOpen = menuBtn.classList.toggle('is-open');
    nav.classList.toggle('is-open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    menuBtn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu on nav link click
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menuBtn.classList.remove('is-open');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // --- Scroll reveal with variants ---
  // Default: translateY(32px) fade
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

  // Light: translateY(20px) faster fade — text elements
  var revealLight = [
    '.philosophy__lead',
    '.philosophy__body',
    '.page-hero__desc',
    '.footer__cta-inner'
  ];

  // Slide left: translateX(-24px) — images and brand elements
  var revealSlideLeft = [
    '.philosophy__image',
    '.footer__brand'
  ];

  // Slow: translateY(40px) longer duration — hero images
  var revealSlow = [
    '.products__image'
  ];

  var allReveals = [];

  function setupReveals(selectors, className) {
    selectors.forEach(function (selector) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function (el, i) {
        el.classList.add(className);
        el.style.transitionDelay = (i * 0.1) + 's';
        allReveals.push(el);
      });
    });
  }

  setupReveals(revealDefault, 'reveal');
  setupReveals(revealLight, 'reveal--light');
  setupReveals(revealSlideLeft, 'reveal--slide-left');
  setupReveals(revealSlow, 'reveal--slow');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
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

  // --- FAQ accordion with aria-expanded ---
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
        var headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
        var top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();
