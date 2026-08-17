(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var yearEl = document.getElementById('curYr');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    var cards = document.querySelectorAll('.event-card');
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      filterBar.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var year = btn.dataset.year;
      cards.forEach(function (card) {
        card.classList.toggle('hidden', year !== 'all' && card.dataset.year !== year);
      });
    });
  }

  var gallery = document.querySelector('.gallery');
  if (gallery) {
    var links = Array.prototype.slice.call(gallery.querySelectorAll('a'));
    var current = 0;

    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML =
      '<img alt="">' +
      '<button class="lightbox__close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
      '<button class="lightbox__prev" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>' +
      '<button class="lightbox__next" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></button>';
    document.body.appendChild(lightbox);
    var lbImg = lightbox.querySelector('img');

    function show(i) {
      current = (i + links.length) % links.length;
      lbImg.src = links[current].href;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('open');
      lbImg.removeAttribute('src');
      document.body.style.overflow = '';
    }

    links.forEach(function (link, i) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        show(i);
      });
    });

    lightbox.querySelector('.lightbox__close').addEventListener('click', close);
    lightbox.querySelector('.lightbox__prev').addEventListener('click', function () { show(current - 1); });
    lightbox.querySelector('.lightbox__next').addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }
})();
