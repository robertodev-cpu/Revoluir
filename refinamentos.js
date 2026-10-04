/* REVOLUIR — refinamentos de interação (independente do script.js) */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* 1. Botões: brilho que segue o dedo/rato + deslocamento magnético discreto */
  var BTN = '.btn,.secondary-btn,.copy-btn';
  function btnFrom(e) { return e.target && e.target.closest ? e.target.closest(BTN) : null; }
  function setPos(el, e) {
    var r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }
  document.addEventListener('pointermove', function (e) {
    var el = btnFrom(e); if (!el) return;
    setPos(el, e);
    if (canHover && !reduce) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--tx', (((e.clientX - r.left) / r.width - 0.5) * 6).toFixed(2) + 'px');
      el.style.setProperty('--ty', (((e.clientY - r.top) / r.height - 0.5) * 4).toFixed(2) + 'px');
    }
  }, { passive: true });
  document.addEventListener('pointerdown', function (e) { var el = btnFrom(e); if (el) setPos(el, e); }, { passive: true });
  document.addEventListener('pointerout', function (e) {
    var el = btnFrom(e); if (!el || el.contains(e.relatedTarget)) return;
    el.style.removeProperty('--tx'); el.style.removeProperty('--ty');
  });

  /* 2. Logo do hero: inclinação suave com o rato */
  var visual = document.querySelector('.hero-visual');
  var sym = document.querySelector('.hero-symbol');
  if (visual && sym && canHover && !reduce) {
    visual.addEventListener('pointermove', function (e) {
      var r = visual.getBoundingClientRect();
      sym.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 14).toFixed(2) + 'deg');
      sym.style.setProperty('--rx', (-((e.clientY - r.top) / r.height - 0.5) * 10).toFixed(2) + 'deg');
    });
    visual.addEventListener('pointerleave', function () {
      sym.style.setProperty('--ry', '0deg'); sym.style.setProperty('--rx', '0deg');
    });
  }

  /* 3. Livros: "Ver mais" só aparece quando há mais livros do que data-visible */
  var grid = document.getElementById('bookGrid');
  var more = document.getElementById('booksMore');
  var btn = document.getElementById('booksMoreBtn');
  if (grid && more && btn) {
    var visible = parseInt(grid.getAttribute('data-visible'), 10) || 1;
    var expanded = false;
    var sync = function () {
      var cards = grid.querySelectorAll('.book-card');
      for (var i = 0; i < cards.length; i++) cards[i].hidden = !expanded && i >= visible;
      more.hidden = cards.length <= visible;
      btn.textContent = expanded ? 'Ver menos' : 'Ver mais';
      btn.setAttribute('aria-expanded', String(expanded));
    };
    btn.addEventListener('click', function () { expanded = !expanded; sync(); });
    new MutationObserver(sync).observe(grid, { childList: true });
    sync();
  }

  /* 4. Botão "Comprar" ainda sem link: não saltar para o topo */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('[data-book-link]') : null;
    if (a && (!a.getAttribute('href') || a.getAttribute('href') === '#')) e.preventDefault();
  });
})();
