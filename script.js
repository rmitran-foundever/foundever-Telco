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

// ===== Lifecycle Revenue Leak Diagnostic =====
(function() {
  const wrap = document.querySelector('.assessment-wrap');
  if (!wrap) return;

  const questions = [
    {
      dimension: 'Acquire',
      stage: 'Acquire',
      text: 'When a new subscriber says yes, how does your CX operation pick them up?',
      context: 'The handoff into CX is where retention starts or stalls.',
      options: [
        { text: 'Reactive. We answer when they reach out.', score: 1 },
        { text: 'Basic welcome touches, no measurement of impact.', score: 2 },
        { text: 'Welcome programmes for high value cohorts only.', score: 3 },
        { text: 'Structured welcome across the base, with measured impact on tenure.', score: 4 },
        { text: 'Activation is treated as a retention moment. High risk cohorts segmented and intervened in real time.', score: 5 }
      ]
    },
    {
      dimension: 'Onboard',
      stage: 'Onboard',
      text: 'How does your operation handle the first 90 days, where most full year churn is decided?',
      context: 'Most subscribers who leave inside year one make the decision in the first three months.',
      options: [
        { text: 'The same as any other tenure. No early life segmentation.', score: 1 },
        { text: 'We know early life is risky but have no specific programme.', score: 2 },
        { text: 'We respond reactively to early life signals like complaints or missed payments.', score: 3 },
        { text: 'Proactive outreach to early life cohorts, with a clear playbook.', score: 4 },
        { text: 'Early life risk is detected in week one, intervened by week four. Cohort tenure measured separately.', score: 5 }
      ]
    },
    {
      dimension: 'Serve',
      stage: 'Serve',
      text: 'When a subscriber calls about a bill or service issue, what happens beyond resolution?',
      context: 'Every inbound contact is a revenue moment, not just a cost event.',
      options: [
        { text: 'We resolve and close. Speed and CSAT are the metrics.', score: 1 },
        { text: 'Reps occasionally pitch if the moment feels right.', score: 2 },
        { text: 'Upsell prompts are in the workflow, execution varies.', score: 3 },
        { text: 'Every contact is screened for revenue opportunity. Reps coached to convert.', score: 4 },
        { text: 'Real time agent assist flags upsell moments. Conversion measured per contact reason, optimised continuously.', score: 5 }
      ]
    },
    {
      dimension: 'Grow',
      stage: 'Grow',
      text: 'How well does your operation grow revenue per subscriber across the household?',
      context: 'The household is the unit of expansion. Selling each product in isolation leaves revenue on the table.',
      options: [
        { text: 'Each product sells in isolation. No household view.', score: 1 },
        { text: 'We have household data but do not act on it operationally.', score: 2 },
        { text: 'Cross sell happens at renewal or contract events only.', score: 3 },
        { text: 'Cross sell is a CX metric. Reps see household composition and act on it.', score: 4 },
        { text: 'Household revenue is the operating goal. AI flags next best product per household in real time.', score: 5 }
      ]
    },
    {
      dimension: 'Save',
      stage: 'Save',
      text: 'When a high value subscriber signals they are leaving, what is your save conversion?',
      context: 'In the post One Touch Switching window, save conversion on the high value cohort is where the P&L is won or lost.',
      options: [
        { text: 'We do not track save conversion by value cohort.', score: 1 },
        { text: 'Save attempts happen but conversion is not benchmarked.', score: 2 },
        { text: 'Save conversion is measured at the base level, not by cohort.', score: 3 },
        { text: 'Save conversion is benchmarked by cohort, with playbooks per segment.', score: 4 },
        { text: 'Save conversion on the high value cohort is the highest priority operational metric. Continuously tuned, OTS compliant.', score: 5 }
      ]
    }
  ];

  const tiers = [
    {
      name: 'Leaking',
      range: [5, 9],
      desc: 'Revenue is leaking at multiple stages of your lifecycle.',
      stage: '',
      stageNote: 'Your operation is processing contacts, not converting them. The COO sees throughput, the CFO sees cost. The revenue per subscriber upside sitting in acquire, onboard, serve, grow, and save is invisible to the CX function today.',
      next: 'Start with a leak audit. Map where revenue is leaving across all five stages and identify the single biggest recovery.'
    },
    {
      name: 'Patching',
      range: [10, 14],
      desc: 'You are patching the worst leaks. The biggest is still costing you.',
      stage: '',
      stageNote: 'You see where revenue is at risk and are working on the most visible leaks. The operation has the levers but no through line. Each stage works in isolation, so wins do not compound across the lifecycle.',
      next: 'Connect the stages. A lifecycle revenue audit shows where one fix in one stage compounds into recovery across the others.'
    },
    {
      name: 'Tuning',
      range: [15, 19],
      desc: 'Most stages are converting. One or two are still leaking.',
      stage: '',
      stageNote: 'The operation is performing across most of the lifecycle. The remaining leak is concentrated in one or two stages where the lever has not yet been found. Sizeable but contained, and likely the highest return work on the table this year.',
      next: 'Pressure test the leaky stage against operator benchmarks. We show what the top quartile is doing differently and the gap between you and them.'
    },
    {
      name: 'Compounding',
      range: [20, 25],
      desc: 'Revenue per subscriber is compounding across your lifecycle.',
      stage: '',
      stageNote: 'You are operating at top quartile telco level on most levers. The lifecycle is no longer a series of stages to be managed but a system that compounds. The work now is staying there as switching pressure, AI capability, and M&A keep raising the bar.',
      next: 'A frontier audit benchmarks you against the global top quartile and stress tests the operational loop that keeps your edge.'
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
    leakStages: wrap.querySelectorAll('.leak-map-stage'),
    leakBiggest: wrap.querySelector('.leak-map-biggest'),
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
      state.current === questions.length - 1 ? 'Get my leak map' : 'Next';
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

  function leakLevelFromScore(s) {
    if (s <= 2) return 'high';
    if (s === 3) return 'medium';
    return 'low';
  }

  function renderLeakMap() {
    if (!els.leakStages || !els.leakStages.length) return;
    let lowestScore = Infinity;
    let biggestIdx = 0;
    state.selections.forEach((sel, qi) => {
      const score = sel !== null ? questions[qi].options[sel].score : 1;
      if (score < lowestScore) { lowestScore = score; biggestIdx = qi; }
    });
    els.leakStages.forEach((node, i) => {
      const sel = state.selections[i];
      const score = sel !== null ? questions[i].options[sel].score : 1;
      node.setAttribute('data-leak-level', leakLevelFromScore(score));
      node.classList.toggle('is-biggest', i === biggestIdx);
    });
    if (els.leakBiggest) {
      els.leakBiggest.textContent = questions[biggestIdx].stage;
    }
  }

  function showResults() {
    const score = calculateScore();
    const tier = tierFromScore(score);

    if (els.scoreNum) els.scoreNum.textContent = String(score);
    els.stageName.textContent = tier.name;
    els.stageDesc.textContent = tier.desc;
    if (els.startpoint) els.startpoint.textContent = tier.stageNote;
    els.stageNext.textContent = tier.next;

    renderLeakMap();

    setProgress(100);
    showScreen('results');
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