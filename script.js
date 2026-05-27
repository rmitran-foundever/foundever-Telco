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

// ===== AI Value Assessment =====
(function() {
  const wrap = document.querySelector('.assessment-wrap');
  if (!wrap) return;

  const questions = [
    {
      dimension: 'Knowing where AI creates CX value',
      text: 'Do you know where AI can lift the customer experience most across the journey?',
      context: 'Most AI gets deployed where it is quickest to ship, not where customers feel it most.',
      options: [
        { text: 'No, we deploy AI where it is easiest, not where customers feel it.', score: 1 },
        { text: 'A rough sense, from instinct rather than data.', score: 2 },
        { text: 'We have identified the moments, but not quantified the value.', score: 3 },
        { text: 'We have a data backed map of where AI lifts the experience.', score: 4 },
        { text: 'We continuously map AI value across the journey and reprioritise.', score: 5 }
      ]
    },
    {
      dimension: 'The customer data foundation',
      text: 'Do you have real customer data, deep and clean enough for AI to learn from?',
      context: 'AI is only as good as the customer data it learns from.',
      options: [
        { text: 'No, our customer data is thin, siloed, or unusable for AI.', score: 1 },
        { text: 'We have data, but not in a state AI can learn from.', score: 2 },
        { text: 'Some journeys have usable data, coverage is patchy.', score: 3 },
        { text: 'Most of the customer ecosystem feeds clean data into our AI.', score: 4 },
        { text: 'Real customer data flows continuously, and AI learns from it in near real time.', score: 5 }
      ]
    },
    {
      dimension: 'Beyond one flow at a time',
      text: 'Is AI deployed flow by flow, or across your whole customer ecosystem?',
      context: 'Flow by flow deployment does not compound. Ecosystem scale does.',
      options: [
        { text: 'One flow at a time. Each use case is a separate project.', score: 1 },
        { text: 'A few flows live, each built and run in isolation.', score: 2 },
        { text: 'AI covers a cluster of related journeys.', score: 3 },
        { text: 'AI is deployed across most of the customer ecosystem.', score: 4 },
        { text: 'AI scales across the ecosystem by default. New journeys inherit it.', score: 5 }
      ]
    },
    {
      dimension: 'Refined to your ecosystem',
      text: 'Is your AI generic, or refined on your own customer data to fit how your customers behave?',
      context: 'Generic models plateau fast. Models trained on your data keep improving.',
      options: [
        { text: 'Generic. Out of the box models, no tuning to our customers.', score: 1 },
        { text: 'Lightly configured, not trained on our data.', score: 2 },
        { text: 'Tuned on our data in the highest volume journeys.', score: 3 },
        { text: 'Refined on our customer data across most of the operation.', score: 4 },
        { text: 'Continuously retrained on live customer data. The AI gets sharper every cycle.', score: 5 }
      ]
    },
    {
      dimension: 'CX value, evidenced',
      text: 'Is AI measurably improving experience, retention, and revenue, or only cutting cost?',
      context: 'Cost saved is easy to measure. Value created is what the board reads.',
      options: [
        { text: 'Cost only. We measure contacts deflected, not outcomes.', score: 1 },
        { text: 'We track efficiency, customer impact is unmeasured.', score: 2 },
        { text: 'AI improves some experience metrics like CSAT or FCR.', score: 3 },
        { text: 'AI measurably lifts experience, retention, and revenue.', score: 4 },
        { text: 'Every AI investment maps to experience, retention, and revenue in our P&L.', score: 5 }
      ]
    }
  ];

  const tiers = [
    {
      name: 'AI Plugged In',
      range: [5, 9],
      desc: 'You have done the easy part. AI is switched on in pockets of the operation, but with no data foundation underneath it and no scale behind it. Right now AI is a set of tools, not a capability.',
      stage: 'Identify value levers',
      stageNote: 'Before AI can scale, you need to know where it should create value. That is where the work begins.',
      next: 'A value audit maps where AI can create value across your ecosystem, and what real customer data you have to build on. It is the first step of a value realization project.'
    },
    {
      name: 'AI Piloting',
      range: [10, 14],
      desc: 'AI is live, but it runs flow by flow. Each use case is its own project, the customer data is underused, and the gains do not compound. You are proving AI works without proving it scales.',
      stage: 'Identify value levers',
      stageNote: 'The pilots show promise. The next move is mapping the full set of value levers so deployment stops being one project at a time.',
      next: 'A value audit turns your scattered pilots into a single value map, and sizes the prize from scaling them across the ecosystem.'
    },
    {
      name: 'AI Scaling',
      range: [15, 19],
      desc: 'AI is moving beyond single flows and the customer data foundation is taking shape. The challenge now is making scale the default rather than the exception.',
      stage: 'Build the plan',
      stageNote: 'You have the levers. The work now is sequencing them into a plan that scales AI across the ecosystem, with the data and governance to support it.',
      next: 'A value audit pressure tests your data foundation and builds the plan to scale AI across the ecosystem, with the return quantified.'
    },
    {
      name: 'AI Compounding',
      range: [20, 24],
      desc: 'AI is deployed at ecosystem scale, learning from real customer data, and the value is compounding. You are in the top quartile. The frontier now is individual customer level optimisation.',
      stage: 'Generate value',
      stageNote: 'The system works. The work now is execution discipline, holding the loop between data, AI, and outcome tight as you scale further.',
      next: 'A value audit benchmarks you against the operators ahead of you and identifies the last increments of value still on the table.'
    },
    {
      name: 'AI Native',
      range: [25, 25],
      desc: 'Your customer ecosystem runs on AI, refined continuously on live customer data. AI is the operating model, not a layer on top of it. You operate years ahead of peers.',
      stage: 'Generate value',
      stageNote: 'You are at the frontier. The work is staying there as scale, M&A, and new AI capability keep raising the bar.',
      next: 'A value audit benchmarks you against the global frontier and stress tests the data and governance loop that keeps your edge.'
    }
  ];

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
    contextText: wrap.querySelector('.assess-context'),
    options: wrap.querySelector('.assess-options'),
    nextBtn: wrap.querySelector('[data-action="next"]'),
    backBtn: wrap.querySelector('[data-action="back"]'),
    scoreNum: wrap.querySelector('.assess-score-num'),
    stageName: wrap.querySelector('.assess-stage-name'),
    stageDesc: wrap.querySelector('.assess-stage-desc'),
    startpoint: wrap.querySelector('.assess-startpoint'),
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
    if (els.contextText) els.contextText.textContent = q.context || '';

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
      state.current === questions.length - 1 ? 'See your AI value score' : 'Next';
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

  function calculateScore() {
    return state.selections.reduce((sum, sel, qi) => sum + questions[qi].options[sel].score, 0);
  }

  function tierFromScore(score) {
    return tiers.find(t => score >= t.range[0] && score <= t.range[1]) || tiers[0];
  }

  function showResults() {
    const score = calculateScore();
    const tier = tierFromScore(score);

    if (els.scoreNum) els.scoreNum.textContent = String(score);
    els.stageName.textContent = tier.name;
    els.stageDesc.textContent = tier.desc;
    if (els.startpoint) els.startpoint.textContent = tier.stage + '. ' + tier.stageNote;
    els.stageNext.textContent = tier.next;

    // Spectrum marker: 5 -> 0%, 25 -> 100%
    const pct = Math.max(0, Math.min(100, ((score - 5) / 20) * 100));
    setProgress(100);
    showScreen('results');
    requestAnimationFrame(() => {
      setTimeout(() => { els.spectrumMarker.style.left = pct + '%'; }, 50);
    });
  }

  // Email capture
  if (els.emailForm) {
    els.emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submit = els.emailSubmit;
      submit.classList.add('success');
      submit.querySelector('.assess-submit-label').textContent = 'Sent';
      const arrow = submit.querySelector('.arrow');
      if (arrow) arrow.textContent = '✓';
    });
  }

  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'start') start();
    else if (action === 'next') next();
    else if (action === 'back') back();
    else if (action === 'retake') retake();
  });

  // CTAs elsewhere on the page that launch the assessment directly.
  // The href="#cta" smooth-scroll handles scrolling; this starts question 1.
  document.querySelectorAll('[data-start-assessment]').forEach(function(cta) {
    cta.addEventListener('click', function() { start(); });
  });
})();

// ===== Why Foundever accordion =====
(function() {
  const pillars = document.querySelectorAll('.why-pillar');
  if (!pillars.length) return;
  pillars.forEach(p => {
    p.addEventListener('click', () => {
      const open = p.getAttribute('aria-expanded') === 'true';
      p.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });
})();