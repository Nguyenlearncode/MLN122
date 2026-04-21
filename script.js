(function() {
  const slides = document.querySelectorAll('.slide');
  const total = slides.length;
  const progress = document.getElementById('progress');
  const currentEl = document.getElementById('current');
  const totalEl = document.getElementById('total');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  let idx = 0;
  totalEl.textContent = total;

  function render() {
    slides.forEach((s, i) => {
      s.classList.remove('active', 'leaving');
      if (i === idx) s.classList.add('active');
      else if (i < idx) s.classList.add('leaving');
    });
    currentEl.textContent = idx + 1;
    progress.style.width = ((idx + 1) / total * 100) + '%';
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === total - 1;
    // scroll to top inside current slide
    const cur = slides[idx];
    if (cur) cur.scrollTop = 0;
  }

  function go(n) {
    idx = Math.max(0, Math.min(total - 1, n));
    render();
  }

  prevBtn.addEventListener('click', () => go(idx - 1));
  nextBtn.addEventListener('click', () => go(idx + 1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      go(idx + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      go(idx - 1);
    } else if (e.key === 'Home') {
      go(0);
    } else if (e.key === 'End') {
      go(total - 1);
    }
  });

  // Swipe support
  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 60) {
      if (dx < 0) go(idx + 1); else go(idx - 1);
    }
  }, { passive: true });

  // Wheel navigation (if slide is not scrollable)
  let wheelLock = false;
  document.addEventListener('wheel', (e) => {
    const cur = slides[idx];
    const canScroll = cur.scrollHeight > cur.clientHeight;
    if (canScroll) {
      const atTop = cur.scrollTop <= 1;
      const atBottom = cur.scrollTop + cur.clientHeight >= cur.scrollHeight - 1;
      if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) return;
    }
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < 20) return;
    wheelLock = true;
    if (e.deltaY > 0) go(idx + 1);
    else go(idx - 1);
    setTimeout(() => wheelLock = false, 700);
  }, { passive: true });

  render();
})();
