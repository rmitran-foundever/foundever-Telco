// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Pause marquee on hover
const track = document.querySelector('.rolling-bar-track');
if (track) {
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

// ===== Solutions Accordion (sol-acc) =====
(function(){
  var w = document.getElementById('solAcc');
  if (!w) return;
  var items = [].slice.call(w.querySelectorAll('.sol-acc-item'));
  items.forEach(function(it){
    var b = it.querySelector('.sol-acc-btn');
    b.addEventListener('click', function(){
      if (it.classList.contains('is-open')) return;
      items.forEach(function(o){
        var ob = o.querySelector('.sol-acc-btn');
        var op = o.querySelector('.sol-acc-body');
        var on = o === it;
        o.classList.toggle('is-open', on);
        ob.setAttribute('aria-expanded', on ? 'true' : 'false');
        op.hidden = !on;
      });
    });
  });
})();

// ===== Solutions video (click-to-play) =====
(function(){
  var f = document.getElementById('solVideo');
  if (!f) return;
  var v = f.querySelector('video');
  var b = f.querySelector('.sol-play');
  b.addEventListener('click', function(){
    v.currentTime = 0;
    v.controls = true;
    f.classList.add('is-playing');
    v.play();
  });
  v.addEventListener('ended', function(){
    v.controls = false;
    f.classList.remove('is-playing');
    v.currentTime = 0;
  });
})();

// ===== Case studies carousel =====
(function(){
  var t = document.getElementById('csTrack');
  if (!t) return;
  var slides = [].slice.call(t.children);
  var dots = [].slice.call(document.querySelectorAll('#csDots .cs-dot'));
  var prev = document.querySelector('.cs-prev');
  var next = document.querySelector('.cs-next');
  function idx(){ return Math.round(t.scrollLeft / t.clientWidth); }
  function go(i){
    i = Math.max(0, Math.min(slides.length - 1, i));
    t.scrollTo({ left: i * t.clientWidth, behavior: 'smooth' });
  }
  function ui(){
    var i = idx();
    dots.forEach(function(d, k){ d.classList.toggle('is-active', k === i); });
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === slides.length - 1;
  }
  if (prev) prev.addEventListener('click', function(){ go(idx() - 1); });
  if (next) next.addEventListener('click', function(){ go(idx() + 1); });
  dots.forEach(function(d, k){ d.addEventListener('click', function(){ go(k); }); });
  t.addEventListener('scroll', function(){ window.requestAnimationFrame(ui); }, { passive: true });
  t.addEventListener('keydown', function(e){
    if (e.key === 'ArrowRight') { e.preventDefault(); go(idx() + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(idx() - 1); }
  });
  window.addEventListener('resize', function(){ t.scrollLeft = idx() * t.clientWidth; ui(); });
  ui();
})();

// ===== Count-Up Animation (integers + decimals) =====
(function() {
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  const duration = 1800;

  function animateCount(el) {
    const targetStr = el.dataset.target;
    const target = parseFloat(targetStr);
    if (isNaN(target)) return;
    const isDecimal = targetStr.includes('.');
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = isDecimal ? (ease * target).toFixed(1) : Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();



// ===== Click-to-expand accordions (Why Foundever pillars + Who we serve segments) =====
(function() {
  const items = document.querySelectorAll('.why-pillar, .serve-segment');
  if (!items.length) return;
  items.forEach(el => {
    el.addEventListener('click', () => {
      const open = el.getAttribute('aria-expanded') === 'true';
      el.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });
})();