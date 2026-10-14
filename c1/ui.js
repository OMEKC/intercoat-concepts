/* Intercoat concepts: language list, mobile menu, company toggle, contact popup, news slider, triangle motion (concept 1). */
(function () {
  var doc = document.documentElement;
  var staticMode = /[?&]static/.test(location.search);
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- language list ---------- */
  var lb = document.querySelector('.lang-btn'), lp = document.querySelector('.lang-panel');
  if (lb && lp) {
    var setLang = function (open) { lp.hidden = !open; lb.setAttribute('aria-expanded', open ? 'true' : 'false'); };
    lb.addEventListener('click', function (e) { e.stopPropagation(); setLang(lp.hidden); });
    document.addEventListener('click', function (e) { if (!lp.hidden && !e.target.closest('.lang')) setLang(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lp.hidden) { setLang(false); lb.focus(); } });
  }

  /* ---------- mobile menu ---------- */
  var hd = document.getElementById('header'), bg = document.querySelector('.burger');
  if (hd && bg) {
    var menu = function (open) { hd.classList.toggle('menu-open', open); document.body.classList.toggle('menu-lock', open); bg.setAttribute('aria-expanded', open ? 'true' : 'false'); };
    bg.addEventListener('click', function () { menu(!hd.classList.contains('menu-open')); });
    [].forEach.call(hd.querySelectorAll('nav a'), function (a) { a.addEventListener('click', function () { menu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && hd.classList.contains('menu-open')) menu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1100) menu(false); });
  }

  /* ---------- company: photo <-> long text ---------- */
  var tg = document.querySelector('[data-co-toggle]');
  if (tg) {
    var box = tg.closest('.company'), fig = box.querySelector('.co-photo'), img = fig.querySelector('img'), lg = fig.querySelector('.co-long');
    tg.addEventListener('click', function () {
      var on = box.classList.toggle('is-long');
      if (on) { fig.style.minHeight = fig.getBoundingClientRect().height + 'px'; }
      lg.hidden = !on; img.style.visibility = on ? 'hidden' : '';
      tg.textContent = on ? tg.dataset.close : tg.dataset.open;
      tg.setAttribute('aria-expanded', on ? 'true' : 'false');
      if (!on) fig.style.minHeight = '';
    });
  }

  /* ---------- contact popup ---------- */
  var src = document.querySelector('[data-ic-form]');
  var modal, dlg, paneForm, paneThanks, opener = null;
  var X = '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" stroke-width="1.5"/></svg>';
  function build() {
    modal = document.createElement('div');
    modal.className = 'ic-modal'; modal.hidden = true;
    modal.innerHTML = '<div class="ic-ov" data-ic-close></div><div class="ic-box" role="dialog" aria-modal="true" aria-labelledby="ic-title" tabindex="-1"><button type="button" class="ic-x" aria-label="Close" data-ic-close>' + X + '</button><div class="ic-pane ic-form"></div><div class="ic-pane ic-thanks" hidden><h3 id="ic-thanks-t">Thank you</h3><button type="button" class="btn ic-done" data-ic-close>Close</button></div></div>';
    document.body.appendChild(modal);
    dlg = modal.querySelector('.ic-box'); paneForm = modal.querySelector('.ic-form'); paneThanks = modal.querySelector('.ic-thanks');
    modal.addEventListener('click', function (e) { if (e.target.closest('[data-ic-close]')) close(); });
  }
  function clearErr(f) { f.classList.remove('is-error'); var m = f.querySelector('.ic-err'); if (m) m.remove(); }
  function validate(f) {
    var ok = true, first = null;
    [].forEach.call(f.querySelectorAll('[required]'), function (inp) {
      var host = inp.closest('.field'); clearErr(host);
      var v = inp.value.trim();
      var bad = !v || (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      if (bad) {
        ok = false; host.classList.add('is-error');
        var m = document.createElement('span'); m.className = 'ic-err'; m.setAttribute('role', 'alert');
        m.textContent = inp.type === 'email' && v ? 'Enter a valid email address.' : 'Required';
        host.appendChild(m); if (!first) first = inp;
      }
    });
    if (first) first.focus();
    return ok;
  }
  function fresh() {
    var f = src.cloneNode(true);
    f.hidden = false; f.removeAttribute('data-ic-form');
    var h = f.querySelector('h3'); if (h) h.id = 'ic-title';
    paneForm.innerHTML = ''; paneForm.appendChild(f);
    f.addEventListener('submit', function (e) { e.preventDefault(); if (validate(f)) { paneForm.hidden = true; paneThanks.hidden = false; paneThanks.querySelector('.ic-done').focus(); } });
    f.addEventListener('input', function (e) { var fl = e.target.closest('.field'); if (fl) clearErr(fl); });
    return f;
  }
  function open(from) {
    if (!src) return;
    if (!modal) build();
    opener = from || document.activeElement;
    paneThanks.hidden = true; paneForm.hidden = false;
    var f = fresh();
    modal.hidden = false; document.body.classList.add('ic-lock');
    var first = f.querySelector('input'); if (first) first.focus({ preventScroll: true });
  }
  function close() {
    if (!modal || modal.hidden) return;
    modal.hidden = true; document.body.classList.remove('ic-lock');
    if (opener && opener.focus) { try { opener.focus({ preventScroll: true }); } catch (e) {} }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#contact"]');
    if (!a || !src) return;
    e.preventDefault(); open(a);
  });
  document.addEventListener('keydown', function (e) {
    if (!modal || modal.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      var f = [].slice.call(dlg.querySelectorAll('button,[href],input,textarea')).filter(function (n) { return !n.closest('[hidden]') && !n.disabled; });
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });

  /* ---------- news slider: finite, one card per step, arrows and swipe ---------- */
  [].forEach.call(document.querySelectorAll('[data-ic-slider]'), function (root) {
    var vp = root.querySelector('.ic-viewport'), tr = root.querySelector('.ic-track');
    var cards = [].slice.call(tr.children);
    var prev = root.querySelector('.ic-prev'), next = root.querySelector('.ic-next');
    var cnt = root.querySelector('.ic-count'), bar = root.querySelector('.ic-bar b');
    var i = 0;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function m() {
      var g = parseFloat(getComputedStyle(tr).columnGap) || 0;
      var w = cards[0].getBoundingClientRect().width, step = w + g;
      var total = cards.length * w + (cards.length - 1) * g;
      var max = Math.max(0, total - vp.clientWidth);
      var vis = Math.max(1, Math.round((vp.clientWidth + g) / step));
      return { step: step, max: max, vis: vis, last: Math.ceil(max / step - 0.001) };
    }
    function go(k) {
      var s = m(); i = Math.max(0, Math.min(k, s.last));
      var off = Math.min(i * s.step, s.max);
      tr.style.transform = 'translateX(' + (-off) + 'px)';
      prev.disabled = i <= 0; next.disabled = i >= s.last;
      var first = off >= s.max - 1 ? Math.max(1, cards.length - s.vis + 1) : i + 1;
      var lastN = Math.min(cards.length, first + s.vis - 1);
      if (cnt) cnt.textContent = s.vis > 1 ? pad(first) + '\u2013' + pad(lastN) + ' / ' + pad(cards.length) : pad(first) + ' / ' + pad(cards.length);
      if (bar) { bar.style.left = ((first - 1) / cards.length * 100) + '%'; bar.style.width = (s.vis / cards.length * 100) + '%'; }
      cards.forEach(function (c, idx) {
        var on = idx + 1 >= first && idx + 1 <= lastN;
        if (on) { c.removeAttribute('inert'); c.removeAttribute('aria-hidden'); } else { c.setAttribute('inert', ''); c.setAttribute('aria-hidden', 'true'); }
      });
    }
    prev.addEventListener('click', function () { go(i - 1); });
    next.addEventListener('click', function () { go(i + 1); });
    root.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(i - 1); else if (e.key === 'ArrowRight') go(i + 1); });
    var x0 = null;
    vp.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') x0 = e.clientX; });
    vp.addEventListener('pointerup', function (e) { if (x0 === null) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) go(dx < 0 ? i + 1 : i - 1); });
    vp.addEventListener('pointercancel', function () { x0 = null; });
    window.addEventListener('resize', function () { go(i); });
    go(0);
  });

  /* ---------- concept 1: triangles unfold once from their corner ---------- */
  if (doc.hasAttribute('data-ic-tri') && !staticMode && !reduced && 'IntersectionObserver' in window) {
    var tris = [].slice.call(document.querySelectorAll('.tri'));
    tris.forEach(function (t) {
      var s = t.getAttribute('style') || '';
      t.style.transformOrigin = (/right:\s*0/.test(s) ? 'right' : 'left') + ' ' + (/bottom:\s*0/.test(s) ? 'bottom' : 'top');
    });
    doc.classList.add('ic-tri-motion');
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { threshold: .3 });
    tris.forEach(function (t) { io.observe(t); });
  }
})();
