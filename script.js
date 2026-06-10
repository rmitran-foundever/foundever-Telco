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

// ===== Lifecycle Gap Map Diagnostic =====
(function() {
  const wrap = document.querySelector('.assessment-wrap');
  if (!wrap) return;

  // Index 0 is the intent gate (sets state.lens). Indices 1..5 are lifecycle stages,
  // each carrying a growth and a cost variant. State.lens picks which variant renders.
  const questions = [
    {
      isIntent: true,
      dimension: 'Your priority',
      text: 'What does the board want CX to move first?',
      context: 'Same lifecycle, different lens. Pick the one the board is asking about.',
      options: [
        { text: 'Grow revenue per subscriber', lens: 'growth' },
        { text: 'Reduce cost to serve', lens: 'cost' }
      ]
    },
    {
      dimension: 'Acquire',
      stage: 'Acquire',
      variants: {
        growth: {
          text: 'When a prospect or new subscriber lands in your CX operation, what happens?',
          context: 'Every inbound at the moment of conversion is a revenue moment, not a service call.',
          options: [
            { text: 'We answer or take the order. Conversion is not measured.', score: 1 },
            { text: 'We resolve and occasionally upsell if the moment feels right.', score: 2 },
            { text: 'Conversion is measured at the rep level but not coached to.', score: 3 },
            { text: 'Conversion is a core CX metric, with cohort and rep performance tracked.', score: 4 },
            { text: 'Every acquisition contact is treated as a conversion event. Real time prompts, measured per channel.', score: 5 }
          ]
        },
        cost: {
          text: 'How much of your acquisition contact volume is preventable or contained in self serve?',
          context: 'The cost of acquisition through CX is concentrated in contacts that did not need to happen.',
          options: [
            { text: 'Most acquisition contacts hit a human first. No self serve layer to speak of.', score: 1 },
            { text: 'Basic self serve exists but most subscribers still call.', score: 2 },
            { text: 'Self serve handles common queries. Containment is not measured per journey.', score: 3 },
            { text: 'Containment is tracked with clear targets per acquisition contact reason.', score: 4 },
            { text: 'Most acquisition contacts contain in self serve. Human time is reserved for the moments that need it.', score: 5 }
          ]
        }
      }
    },
    {
      dimension: 'Onboard',
      stage: 'Onboard',
      variants: {
        growth: {
          text: 'Does the first 90 days lift the cohort’s revenue per subscriber, or just keep them?',
          context: 'Most subscribers who leave inside year one decide in the first three months, and most who stay do not grow.',
          options: [
            { text: 'We aim to keep them. Lifting their value is not part of the onboarding goal.', score: 1 },
            { text: 'Some onboarding includes a soft upsell. Impact is not measured.', score: 2 },
            { text: 'Structured onboarding with upsell touchpoints in high value cohorts.', score: 3 },
            { text: 'Onboarding lifts cohort revenue measurably. We track the cohort separately.', score: 4 },
            { text: 'The first 90 days are designed as the highest leverage revenue moment of the lifecycle. AI flags next best action per subscriber.', score: 5 }
          ]
        },
        cost: {
          text: 'How much of your first 90 days contact volume is preventable noise?',
          context: 'Early life contacts are skewed to billing confusion, activation issues, and bill shock. Most are preventable.',
          options: [
            { text: 'The first 90 days drive a disproportionate share of contact volume. We do not measure root cause.', score: 1 },
            { text: 'We know early life is heavy, no specific programme.', score: 2 },
            { text: 'We have reduced top contact drivers through better welcome messaging.', score: 3 },
            { text: 'Preventable early life contacts are tracked and engineered out per cohort.', score: 4 },
            { text: 'Early life contact volume is a continuous improvement metric. New friction caught in week one.', score: 5 }
          ]
        }
      }
    },
    {
      dimension: 'Serve',
      stage: 'Serve',
      variants: {
        growth: {
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
        cost: {
          text: 'What is your cost per contact, and how much of it is avoidable through better routing or self serve?',
          context: 'Most cost per contact creep comes from contacts that landed in the wrong place.',
          options: [
            { text: 'Cost per contact is a top line metric. We do not see avoidable contact volume.', score: 1 },
            { text: 'We track cost per contact by channel. Misrouting is not measured.', score: 2 },
            { text: 'We have targeted the highest volume reasons with self serve or routing.', score: 3 },
            { text: 'Avoidable contact volume is tracked per reason, with engineered out programmes.', score: 4 },
            { text: 'Self serve and routing tuned continuously. Every contact reason has a target containment rate.', score: 5 }
          ]
        }
      }
    },
    {
      dimension: 'Grow',
      stage: 'Grow',
      variants: {
        growth: {
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
        cost: {
          text: 'Is your retention spend concentrated on the high value cohort, or spread thin across the base?',
          context: 'Retention spend on low value subscribers is one of the largest hidden costs in most operations.',
          options: [
            { text: 'We retain the whole base the same way. No cohort level segmentation.', score: 1 },
            { text: 'We have cohort data but retention spend is not tuned to it.', score: 2 },
            { text: 'Some high value subscribers get differentiated treatment. The rest is uniform.', score: 3 },
            { text: 'Retention spend per subscriber is tuned by cohort value.', score: 4 },
            { text: 'Retention investment maps cleanly to cohort lifetime value. Low value retention is engineered to be cheap.', score: 5 }
          ]
        }
      }
    },
    {
      dimension: 'Save',
      stage: 'Save',
      variants: {
        growth: {
          text: 'What is your save conversion on the high value cohort in the OTS or contract end window?',
          context: 'In the post One Touch Switching window, save conversion on the high value cohort is where the P&L is won or lost.',
          options: [
            { text: 'We do not track save conversion by value cohort.', score: 1 },
            { text: 'Save attempts happen but conversion is not benchmarked.', score: 2 },
            { text: 'Save conversion is measured at the base level, not by cohort.', score: 3 },
            { text: 'Save conversion is benchmarked by cohort, with playbooks per segment.', score: 4 },
            { text: 'Save conversion on the high value cohort is the highest priority operational metric. Continuously tuned, OTS compliant.', score: 5 }
          ]
        },
        cost: {
          text: 'What does an unnecessary save attempt or churn event cost you per subscriber?',
          context: 'Save spend on subscribers who would have stayed, or should not be saved, is one of the largest avoidable cost lines.',
          options: [
            { text: 'We save everyone the same way. Cost per save is not measured.', score: 1 },
            { text: 'We know save costs are high, no breakdown by cohort.', score: 2 },
            { text: 'We have cut save spend on the lowest value cohorts. The rest is uniform.', score: 3 },
            { text: 'Save spend is targeted: cohort, propensity, intervention cost, all tracked.', score: 4 },
            { text: 'Save spend is optimised by cohort and propensity. We save only when saved revenue exceeds save cost.', score: 5 }
          ]
        }
      }
    }
  ];

  const tiers = [
    {
      name: 'Leaking',
      range: [5, 9],
      desc: {
        growth: 'Revenue is leaking at multiple stages of your lifecycle.',
        cost: 'Cost is leaking at multiple stages of your lifecycle.'
      },
      stageNote: {
        growth: 'Your operation is processing contacts, not converting them. The COO sees throughput, the CFO sees cost. The revenue per subscriber upside sitting in acquire, onboard, serve, grow, and save is invisible to the CX function today.',
        cost: 'Your operation is taking the calls and absorbing the load. Avoidable contacts, misrouted cases, and uniform retention spend across cohorts add up to a cost to serve the CFO can see in OpEx but not by lever.'
      },
      next: {
        growth: 'Start with a revenue gap audit. Map where revenue is leaking across all five stages and identify the single biggest recovery.',
        cost: 'Start with a cost to serve audit. Map where cost is leaking across all five stages and identify the biggest cut without service impact.'
      }
    },
    {
      name: 'Patching',
      range: [10, 14],
      desc: {
        growth: 'You are patching the worst revenue gaps. The biggest is still costing you.',
        cost: 'You are patching the worst cost leaks. The biggest is still draining margin.'
      },
      stageNote: {
        growth: 'You see where revenue is at risk and are working on the most visible gaps. The operation has the levers but no through line. Each stage works in isolation, so wins do not compound across the lifecycle.',
        cost: 'You see where cost is creeping and are cutting the most visible drivers. The operation has the levers but no through line. Each stage works in isolation, so savings do not compound across the lifecycle.'
      },
      next: {
        growth: 'Connect the stages. A lifecycle revenue audit shows where one fix in one stage compounds into recovery across the others.',
        cost: 'Connect the stages. A lifecycle cost to serve audit shows where one fix in one stage compounds into savings across the others.'
      }
    },
    {
      name: 'Tuning',
      range: [15, 19],
      desc: {
        growth: 'Most stages are converting. One or two are still leaking revenue.',
        cost: 'Most stages are tuned. One or two are still bleeding cost.'
      },
      stageNote: {
        growth: 'The operation is performing across most of the lifecycle. The remaining gap is concentrated in one or two stages where the revenue lever has not yet been found. Sizeable but contained, and likely the highest return work on the table this year.',
        cost: 'The operation is performing across most of the lifecycle. The remaining gap is concentrated in one or two stages where the cost lever has not yet been found. Sizeable but contained, and likely the cleanest margin recovery on the table this year.'
      },
      next: {
        growth: 'Pressure test the leaky stage against operator benchmarks. We show what the top quartile is doing differently on revenue and the gap between you and them.',
        cost: 'Pressure test the leaky stage against operator benchmarks. We show what the top quartile is doing differently on cost to serve and the gap between you and them.'
      }
    },
    {
      name: 'Compounding',
      range: [20, 25],
      desc: {
        growth: 'Revenue per subscriber is compounding across your lifecycle.',
        cost: 'Cost to serve is compounding the right way, downward, across your lifecycle.'
      },
      stageNote: {
        growth: 'You are operating at top quartile telco level on most revenue levers. The lifecycle is no longer a series of stages to be managed but a system that compounds. The work now is staying there as switching pressure, AI capability, and M&A keep raising the bar.',
        cost: 'You are operating at top quartile telco level on most cost levers. The lifecycle is no longer a set of cost centres but a system that compounds savings. The work now is staying there as switching pressure, AI capability, and M&A keep raising the bar.'
      },
      next: {
        growth: 'A frontier audit benchmarks you against the global top quartile on revenue per subscriber and stress tests the operational loop that keeps your edge.',
        cost: 'A frontier audit benchmarks you against the global top quartile on cost to serve and stress tests the operational loop that keeps your edge.'
      }
    }
  ];

  const state = { current: 0, lens: null, selections: questions.map(() => null) };
  const LIFECYCLE_COUNT = 5;

  function getRenderedQ(i) {
    const q = questions[i];
    if (q.isIntent) return q;
    if (q.variants && state.lens) {
      return Object.assign({}, q, q.variants[state.lens]);
    }
    // Fallback before lens is set: render with growth variant
    return Object.assign({}, q, q.variants.growth);
  }

  const screens = {
    intro: wrap.querySelector('#screen-intro'),
    question: wrap.querySelector('#screen-question'),
    results: wrap.querySelector('#screen-results')
  };

  const els = {
    progressFill: wrap.querySelector('.assess-progress-fill'),
    progressBar: wrap.querySelector('.assess-progress'),
    counter: wrap.querySelector('.assess-counter'),
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

  if (els.qTotal) els.qTotal.textContent = String(LIFECYCLE_COUNT);

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
    const rawQ = questions[state.current];
    const q = getRenderedQ(state.current);
    const isIntent = !!rawQ.isIntent;

    els.dimension.textContent = q.dimension;
    els.questionText.textContent = q.text;
    if (els.contextText) els.contextText.textContent = q.context || '';

    // Counter visible only for lifecycle questions (state.current 1..5)
    if (els.counter) els.counter.style.display = isIntent ? 'none' : '';
    if (!isIntent) els.qCurrent.textContent = String(state.current);

    els.options.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'assess-option' + (isIntent ? ' assess-option-intent' : '');
      btn.textContent = opt.text;
      btn.setAttribute('aria-pressed', state.selections[state.current] === idx ? 'true' : 'false');
      btn.dataset.idx = String(idx);
      btn.addEventListener('click', () => selectOption(idx));
      els.options.appendChild(btn);
    });

    // Progress: 0% on intent, then (current-1)/5 * 100 across lifecycle
    const pct = isIntent ? 0 : ((state.current - 1) / LIFECYCLE_COUNT) * 100;
    setProgress(pct);

    els.backBtn.disabled = state.current === 0;
    els.nextBtn.disabled = state.selections[state.current] === null;
    els.nextBtn.querySelector('.assess-next-label').textContent =
      state.current === questions.length - 1 ? 'Get my gap map' : 'Next';
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
    const rawQ = questions[state.current];
    if (rawQ.isIntent) {
      state.lens = rawQ.options[state.selections[state.current]].lens;
    }
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
    state.lens = null;
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
    return state.selections.reduce((sum, sel, qi) => {
      if (sel === null) return sum;
      const q = questions[qi];
      if (q.isIntent) return sum;
      const v = q.variants[state.lens];
      return sum + v.options[sel].score;
    }, 0);
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
    let biggestIdx = 1;
    // Lifecycle questions are at indices 1..5; index 0 is the intent gate.
    for (let qi = 1; qi <= LIFECYCLE_COUNT; qi++) {
      const sel = state.selections[qi];
      const v = questions[qi].variants[state.lens];
      const score = sel !== null ? v.options[sel].score : 1;
      if (score < lowestScore) { lowestScore = score; biggestIdx = qi; }
    }
    els.leakStages.forEach((node, i) => {
      const qi = i + 1;
      const sel = state.selections[qi];
      const v = questions[qi].variants[state.lens];
      const score = sel !== null ? v.options[sel].score : 1;
      node.setAttribute('data-leak-level', leakLevelFromScore(score));
      node.classList.toggle('is-biggest', qi === biggestIdx);
    });
    if (els.leakBiggest) {
      els.leakBiggest.textContent = questions[biggestIdx].stage;
    }
  }

  function showResults() {
    const score = calculateScore();
    const tier = tierFromScore(score);

    const lens = state.lens || 'growth';
    if (els.scoreNum) els.scoreNum.textContent = String(score);
    els.stageName.textContent = tier.name;
    els.stageDesc.textContent = tier.desc[lens];
    if (els.startpoint) els.startpoint.textContent = tier.stageNote[lens];
    els.stageNext.textContent = tier.next[lens];

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