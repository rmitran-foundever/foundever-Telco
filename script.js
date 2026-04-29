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

// ===== Solutions Tab Navigation =====
(function() {
  const items = document.querySelectorAll('.sol-bar-item');
  const cards = document.querySelectorAll('.sol-card');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const idx = item.dataset.index;
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      cards.forEach(c => c.classList.remove('visible'));
      const target = document.querySelector('.sol-card[data-card="' + idx + '"]');
      if (target) {
        target.style.animation = 'none';
        target.offsetHeight;
        target.style.animation = '';
        target.classList.add('visible');
      }
    });
  });
})();

// ===== Count-Up Animation (integers) =====
(function() {
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  const duration = 1800;

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
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

// ===== 9M Decimal Counter =====
(function() {
  const el = document.getElementById('hstat-counter');
  if (!el) return;
  let animated = false;
  const duration = 1800;
  const target = 9.0;

  function animate() {
    if (animated) return;
    animated = true;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = (ease * target).toFixed(1);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) animate(); });
  }, { threshold: 0.3 });

  observer.observe(el);
})();

// ===== CX Maturity Assessment =====
(function() {
  const wrap = document.querySelector('.assessment-wrap');
  if (!wrap) return;

  const questions = [
    {
      dimension: 'Operational resilience and scalability',
      text: 'How does your CX operation handle volume surges (renewal peaks, weather events, regulatory shifts)?',
      options: [
        { text: 'We routinely miss SLAs during peaks', score: 1 },
        { text: 'We hit SLAs but at significant overtime cost', score: 2 },
        { text: 'Surge plans exist but require manual orchestration', score: 3 },
        { text: 'Surge handling is mostly automated with documented playbooks', score: 4 },
        { text: 'Capacity flexes within hours, with predictive forecasting and cross\u2011skilled teams', score: 5 }
      ]
    },
    {
      dimension: 'Margin\u2011resilient and growth\u2011ready operations',
      text: 'How clearly can you tie CX operations spend to loss ratio, retention, or revenue outcomes?',
      options: [
        { text: 'We can\u2019t \u2014 it\u2019s tracked as pure cost', score: 1 },
        { text: 'We see departmental costs, no link to commercial outcomes', score: 2 },
        { text: 'We can model some links anecdotally', score: 3 },
        { text: 'Most CX spend ties to a named commercial outcome', score: 4 },
        { text: 'Every CX investment maps to loss ratio, retention, or revenue in our P&L', score: 5 }
      ]
    },
    {
      dimension: 'Workflow integration and system connectivity',
      text: 'How well integrated are your CX workflows with policy admin, claims, and underwriting systems?',
      options: [
        { text: 'Manual handoffs and re\u2011keying between systems', score: 1 },
        { text: 'Partial integrations; agents copy and paste regularly', score: 2 },
        { text: 'Core systems integrated; reporting still partly manual', score: 3 },
        { text: 'End to end flows; agents work in one pane of glass', score: 4 },
        { text: 'Real time, bi\u2011directional integration with full data lineage', score: 5 }
      ]
    },
    {
      dimension: 'Human + AI collaboration',
      text: 'Where are you on AI adoption inside the contact centre?',
      options: [
        { text: 'Not deployed in production yet', score: 1 },
        { text: 'Pilots only (transcription, sentiment) without scale', score: 2 },
        { text: 'AI handles defined deflection (chatbot, triage) for narrow use cases', score: 3 },
        { text: 'AI augments agents in real time across most journeys', score: 4 },
        { text: 'AI embedded across the operation with documented governance and outcome tracking', score: 5 }
      ]
    },
    {
      dimension: 'Regulatory and data sovereignty readiness',
      text: 'How well can you evidence Consumer Duty, vulnerable customer handling, and data sovereignty across your CX operation?',
      options: [
        { text: 'Evidence is reactive, gathered when asked', score: 1 },
        { text: 'Some processes documented; gaps when challenged', score: 2 },
        { text: 'Documented framework, manual evidence gathering', score: 3 },
        { text: 'Continuous monitoring with automated evidence trails', score: 4 },
        { text: 'Audit ready by default; regulatory posture demonstrably above baseline', score: 5 }
      ]
    }
  ];

  const stages = [
    {
      name: 'Reactive',
      range: [1.0, 1.8],
      desc: 'Your operation is in firefight mode. SLAs slip, regulators ask hard questions, and AI is more conversation than deployment.',
      next: 'Stabilising. Close the basics first \u2014 surge plans, integrated systems, evidence trails \u2014 before reaching for AI.'
    },
    {
      name: 'Stabilising',
      range: [1.81, 2.6],
      desc: 'The worst gaps are patched. Operations run, but cost to serve creeps and you can\u2019t yet tie CX spend to commercial outcomes.',
      next: 'Scaling. Make the operation defensible: integrated workflows, named commercial outcomes per pound spent, documented compliance.'
    },
    {
      name: 'Scaling',
      range: [2.61, 3.4],
      desc: 'Foundations are in place. CX runs to plan, integrations are real, and AI pilots are starting to land. The challenge: pilot to portfolio.',
      next: 'AI\u2011Assisted. Embed AI across the operation, tie spend to P&L, and turn compliance evidence into continuous monitoring.'
    },
    {
      name: 'AI\u2011Assisted',
      range: [3.41, 4.2],
      desc: 'Augmented by AI in the right places. Integrations are bi\u2011directional. Consumer Duty evidence is automated. You\u2019re ahead of most carriers.',
      next: 'Resilient. Treat regulatory posture as a commercial asset, scale predictive forecasting, and make AI governance a competitive moat.'
    },
    {
      name: 'Resilient',
      range: [4.21, 5.0],
      desc: 'You\u2019re operating at the front edge. AI is embedded, the operation flexes within hours, and your regulatory posture is a commercial asset, not a cost.',
      next: 'Stay there. The challenge is preserving the edge as scale, M&A, and regulatory shifts test the model. We\u2019d benchmark you against peer carriers and stress test the AI governance layer.'
    }
  ];

  // Per-question state: index of selected option (or null)
  const state = { current: 0, selections: questions.map(() => null) };

  const screens = {
    intro: wrap.querySelector('#screen-intro'),
    question: wrap.querySelector('#screen-question'),
    results: wrap.querySelector('#screen-results')
  };

  const els = {
    progressFill: wrap.querySelector('.assess-progress-fill'),
    progressBar: wrap.querySelector('.assess-progress'),
    qCurrent: wrap.querySelector('.assess-q-current'),
    qTotal: wrap.querySelector('.assess-q-total'),
    dimension: wrap.querySelector('.assess-dimension'),
    questionText: wrap.querySelector('.assess-question'),
    options: wrap.querySelector('.assess-options'),
    nextBtn: wrap.querySelector('[data-action="next"]'),
    backBtn: wrap.querySelector('[data-action="back"]'),
    stageName: wrap.querySelector('.assess-stage-name'),
    stageDesc: wrap.querySelector('.assess-stage-desc'),
    stageNext: wrap.querySelector('.assess-stage-next'),
    spectrumMarker: wrap.querySelector('.assess-spectrum-marker'),
    emailForm: wrap.querySelector('.assess-email-form'),
    emailSubmit: wrap.querySelector('.assess-email-submit')
  };

  if (els.qTotal) els.qTotal.textContent = String(questions.length);

  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
      if (!el) return;
      if (key === name) el.setAttribute('data-active', 'true');
      else el.removeAttribute('data-active');
    });
  }

  function setProgress(pct) {
    els.progressFill.style.width = pct + '%';
    els.progressBar.setAttribute('aria-valuenow', String(Math.round(pct)));
  }

  function renderQuestion() {
    const q = questions[state.current];
    els.qCurrent.textContent = String(state.current + 1);
    els.dimension.textContent = q.dimension;
    els.questionText.textContent = q.text;

    els.options.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'assess-option';
      btn.textContent = opt.text;
      btn.setAttribute('aria-pressed', state.selections[state.current] === idx ? 'true' : 'false');
      btn.dataset.idx = String(idx);
      btn.addEventListener('click', () => selectOption(idx));
      els.options.appendChild(btn);
    });

    setProgress((state.current / questions.length) * 100);
    els.backBtn.disabled = state.current === 0;
    els.nextBtn.disabled = state.selections[state.current] === null;
    els.nextBtn.querySelector('.assess-next-label').textContent =
      state.current === questions.length - 1 ? 'See your stage' : 'Next';
  }

  function selectOption(idx) {
    state.selections[state.current] = idx;
    Array.from(els.options.children).forEach(c => {
      c.setAttribute('aria-pressed', c.dataset.idx === String(idx) ? 'true' : 'false');
    });
    els.nextBtn.disabled = false;
  }

  function next() {
    if (state.selections[state.current] === null) return;
    if (state.current < questions.length - 1) {
      state.current += 1;
      renderQuestion();
    } else {
      showResults();
    }
  }

  function back() {
    if (state.current === 0) return;
    state.current -= 1;
    renderQuestion();
  }

  function start() {
    state.current = 0;
    state.selections = questions.map(() => null);
    if (els.emailSubmit) {
      els.emailSubmit.classList.remove('success');
      els.emailSubmit.querySelector('.assess-submit-label').textContent = 'Send';
    }
    if (els.emailForm) els.emailForm.reset();
    renderQuestion();
    showScreen('question');
  }

  function retake() { start(); }

  function calculateAvg() {
    const scores = state.selections.map((sel, qi) => questions[qi].options[sel].score);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  function stageFromAvg(avg) {
    return stages.find(s => avg >= s.range[0] && avg <= s.range[1]) || stages[0];
  }

  function showResults() {
    const avg = calculateAvg();
    const stage = stageFromAvg(avg);
    els.stageName.textContent = stage.name;
    els.stageDesc.textContent = stage.desc;
    els.stageNext.textContent = stage.next;

    // Position marker: avg 1 -> 0%, avg 5 -> 100%
    const pct = Math.max(0, Math.min(100, ((avg - 1) / 4) * 100));
    setProgress(100);
    showScreen('results');
    // Animate marker after the fade-up so the move is visible
    requestAnimationFrame(() => {
      setTimeout(() => { els.spectrumMarker.style.left = pct + '%'; }, 50);
    });
  }

  // Email capture: client-side only; on submit, mark as sent
  if (els.emailForm) {
    els.emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submit = els.emailSubmit;
      submit.classList.add('success');
      submit.querySelector('.assess-submit-label').textContent = 'Sent';
      const arrow = submit.querySelector('.arrow');
      if (arrow) arrow.textContent = '\u2713';
    });
  }

  // Delegated actions
  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'start') start();
    else if (action === 'next') next();
    else if (action === 'back') back();
    else if (action === 'retake') retake();
  });
})();
