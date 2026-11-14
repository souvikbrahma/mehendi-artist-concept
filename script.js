// Sumit Mehandi Art — interactions
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Year
  $('#yr').textContent = new Date().getFullYear();

  // Mobile menu
  const burger = $('#burger'), links = $('#navLinks'), nav = $('.nav');
  const setNavH = () => document.documentElement.style.setProperty('--navH', nav.getBoundingClientRect().bottom + 'px');
  burger.addEventListener('click', () => {
    setNavH();
    const open = links.classList.toggle('open');
    burger.classList.toggle('x', open);
    burger.setAttribute('aria-expanded', open);
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open'); burger.classList.remove('x'); burger.setAttribute('aria-expanded', false);
  }));

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  // Falling marigold & rose petals in hero
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const petalBox = $('#petals');
  const colors = ['#F29A1F', '#F7C531', '#C4161C', '#E5541B', '#F7C531'];
  function spawnPetal() {
    if (document.hidden) return;
    const p = document.createElement('span');
    p.className = 'petal';
    const size = 8 + Math.random() * 12;
    p.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;color:${colors[Math.floor(Math.random() * colors.length)]};` +
      `--dx:${(Math.random() - 0.5) * 200}px;--r:${(Math.random() - 0.5) * 720}deg;animation-duration:${7 + Math.random() * 6}s`;
    p.innerHTML = '<svg viewBox="0 0 20 20" fill="currentColor"><use href="#petal"/></svg>';
    petalBox.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
  if (!reduce) { for (let i = 0; i < 6; i++) setTimeout(spawnPetal, i * 400); setInterval(spawnPetal, 900); }

  // Gallery filter
  const tiles = $$('.tile');
  $$('.chip').forEach(chip => chip.addEventListener('click', () => {
    $$('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;
    tiles.forEach(t => t.classList.toggle('hide', f !== 'all' && !t.dataset.cat.split(' ').includes(f)));
  }));

  // Lightbox
  const lb = $('#lightbox'), lbImg = $('#lbImg');
  let idx = 0;
  const visible = () => tiles.filter(t => !t.classList.contains('hide'));
  const show = i => {
    const v = visible(); idx = (i + v.length) % v.length;
    const img = $('img', v[idx]); lbImg.src = img.src; lbImg.alt = img.alt;
  };
  tiles.forEach(t => t.addEventListener('click', () => { show(visible().indexOf(t)); lb.classList.add('open'); lb.setAttribute('aria-hidden', false); }));
  const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', true); };
  $('.lb-close').addEventListener('click', close);
  $('.lb-prev').addEventListener('click', e => { e.stopPropagation(); show(idx - 1); });
  $('.lb-next').addEventListener('click', e => { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  // Swipe on mobile
  let sx = 0;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1)); });
})();
