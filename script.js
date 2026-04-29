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

// ===== Telco CX Impact Assessment =====
(function() {
  const wrap = document.querySelector('.assessment-wrap');
  if (!wrap) return;

  const questions = [
    {
      dimension: 'First Contact Resolution Impact',
      text: 'What happens when customers contact support with an issue?',
      context: 'Every repeat contact increases churn risk by 15-20% and costs €8-12 to handle.',
      options: [
        { text: 'Multiple contacts needed. Customers often call back about the same issue.', score: 1 },
        { text: 'Most issues resolved but customers sometimes need to follow up.', score: 2 },
        { text: 'Strong FCR but no tracking of impact on retention or ARPU.', score: 3 },
        { text: 'We track FCR and its correlation to churn rates.', score: 4 },
        { text: 'We measure how FCR improvements directly increase customer lifetime value.', score: 5 }
      ]
    },
    {
      dimension: 'Early life experience impact',
      text: 'How does your support experience in the first 90 days affect customer value?',
      context: '40% of churn happens in the first 90 days, often triggered by poor support experiences.',
      options: [
        { text: 'We don’t track early life support interactions separately.', score: 1 },
        { text: 'We monitor onboarding completion but not support impact.', score: 2 },
        { text: 'We track first 90 day support contacts and costs.', score: 3 },
        { text: 'We measure correlation between early support quality and retention.', score: 4 },
        { text: 'We quantify how early life support experience impacts 3 year LTV per customer.', score: 5 }
      ]
    },
    {
      dimension: 'Support driven churn vs revenue protection',
      text: 'Can you identify customers whose support experience is pushing them toward churn?',
      context: 'Poor support experiences drive 25-30% of preventable churn, representing €15-20M annually for a typical operator.',
      options: [
        { text: 'No. We only see churn after it happens.', score: 1 },
        { text: 'We track customer satisfaction scores.', score: 2 },
        { text: 'We flag customers with multiple support contacts.', score: 3 },
        { text: 'We predict churn based on support interaction patterns.', score: 4 },
        { text: 'We measure revenue protected by proactive support intervention.', score: 5 }
      ]
    },
    {
      dimension: 'Support’s impact on ARPU expansion',
      text: 'How does your support quality affect upsell and cross-sell success?',
      context: 'Customers with positive support experiences are 3-4x more likely to accept upsells.',
      options: [
        { text: 'We don’t connect support quality to revenue expansion.', score: 1 },
        { text: 'We track upsell rates separately from support metrics.', score: 2 },
        { text: 'We’ve noticed satisfied customers are more likely to upgrade.', score: 3 },
        { text: 'We measure correlation between support NPS and ARPU growth.', score: 4 },
        { text: 'We quantify exactly how much incremental ARPU each support improvement generates.', score: 5 }
      ]
    },
    {
      dimension: 'Cost to serve vs value delivered',
      text: 'How do you balance support costs against the customer value you’re protecting?',
      context: 'Spending equally on all customers means over investing in low value and under investing in high value segments.',
      options: [
        { text: 'We only track cost per contact.', score: 1 },
        { text: 'We measure efficiency metrics (AHT, utilization).', score: 2 },
        { text: 'We segment cost to serve by customer value tier.', score: 3 },
        { text: 'We track ROI of support investments by customer segment.', score: 4 },
        { text: 'We optimize support investment dynamically based on customer lifetime value.', score: 5 }
      ]
    }
  ];

  const tiers = [
    {
      name: 'Cost Center',
      range: [5, 9],
      impact: 'Negative',
      desc: 'Your support team is firefighting, handling contacts reactively without understanding which customers are at risk of churning or which are ready to expand ARPU. Every poor experience pushes valuable customers toward competitors, but you won’t know until they’ve already left.',
      analysis: {
        title: 'Hidden cost analysis',
        lines: [
          { text: 'Support driven churn', value: '€15-20M annually' },
          { text: 'Missed ARPU expansion opportunities', value: '€10-15M annually' },
          { text: 'Inefficient cost allocation', value: '€5-10M annually' }
        ],
        totalLabel: 'Total LTV erosion',
        totalValue: '€30-50M annually'
      },
      actions: {
        title: 'Top 3 immediate actions',
        list: [
          { title: 'Start tracking First Contact Resolution impact on retention', impact: 'Reduce support driven churn by 5-8 percentage points', value: '€8-12M annually' },
          { title: 'Implement early life support quality monitoring (0-90 days)', impact: 'Prevent 40% of early churn', value: '€6-10M annually' },
          { title: 'Segment customers by lifetime value for support prioritization', impact: 'Optimize support investment allocation', value: '€5-8M annually' }
        ]
      },
      next: 'Download your personalized LTV optimization roadmap showing exactly how to move from Cost Center to Value Driven support operations.'
    },
    {
      name: 'Aware but disconnected',
      range: [10, 14],
      impact: 'Minimal',
      desc: 'You know churn is happening but not how much is support driven. You measure costs but not value protected or created. Your support investments aren’t optimized for customer value. You’re spending equally on customers worth €500 and customers worth €3,000 in lifetime value.',
      analysis: {
        title: 'Hidden opportunity analysis',
        lines: [
          { text: 'Support driven churn you’re not preventing', value: '€10-15M annually' },
          { text: 'ARPU expansion blocked by support gaps', value: '€8-12M annually' },
          { text: 'Misallocated support investment', value: '€5-8M annually' }
        ],
        totalLabel: 'Total LTV opportunity gap',
        totalValue: '€20-30M annually'
      },
      actions: {
        title: 'Top 3 optimization opportunities',
        list: [
          { title: 'Measure FCR correlation to retention and ARPU growth', impact: 'Identify which support improvements drive most value', value: '€8-12M annually' },
          { title: 'Track early life support quality impact on 90 day retention', impact: 'Prevent early churn before it happens', value: '€6-10M annually' },
          { title: 'Implement value based support routing (high LTV customers prioritized)', impact: 'Protect high value relationships', value: '€4-8M annually' }
        ]
      },
      next: 'Download your optimization roadmap showing how to connect support metrics to customer lifetime value.'
    },
    {
      name: 'Tracking impact',
      range: [15, 19],
      impact: 'Positive but unoptimized',
      desc: 'You see correlations between support quality and customer outcomes, but haven’t fully quantified the financial impact. Support investments aren’t yet optimized by customer segment. You’re protecting value reactively instead of proactively.',
      analysis: {
        title: 'Untapped potential analysis',
        lines: [
          { text: 'LTV gains from better churn prediction', value: '€8-12M annually' },
          { text: 'ARPU expansion from support driven engagement', value: '€5-8M annually' },
          { text: 'Cost optimization through value based allocation', value: '€3-5M annually' }
        ],
        totalLabel: 'Total LTV optimization potential',
        totalValue: '€15-25M annually'
      },
      actions: {
        title: 'Top 3 optimization levers',
        list: [
          { title: 'Quantify exact LTV impact of support improvements by segment', impact: 'Move from correlation to causation', value: '€8-12M annually' },
          { title: 'Implement predictive support intervention (identify at risk high LTV customers)', impact: 'Proactive retention vs reactive save desk', value: '€6-10M annually' },
          { title: 'Dynamic support investment allocation based on real time customer value', impact: 'Optimize every support interaction for LTV', value: '€4-6M annually' }
        ]
      },
      next: 'Download your maturity roadmap showing how to move from reactive to predictive support operations.'
    },
    {
      name: 'Value driven',
      range: [20, 24],
      impact: 'Strong',
      desc: 'You know exactly how much churn is support driven and prevent it. You measure ARPU lift from positive support experiences. You’re investing support resources based on customer value. But you’re still operating at the segment level, not individual customer level.',
      analysis: {
        title: 'Final optimization potential',
        lines: [
          { text: 'Real time dynamic optimization gains', value: '€6-10M annually' },
          { text: 'Individual customer level value maximization', value: '€4-6M annually' },
          { text: 'Autonomous support allocation', value: '€2-4M annually' }
        ],
        totalLabel: 'Total remaining LTV gains',
        totalValue: '€10-15M annually'
      },
      actions: {
        title: 'Final optimization opportunities',
        list: [
          { title: 'Move from segment level to individual customer level value optimization', impact: 'Hyper personalized support investment', value: '€5-8M annually' },
          { title: 'Implement AI driven real time support routing and intervention', impact: 'Predictive support before customers realize they need it', value: '€3-5M annually' },
          { title: 'Autonomous support allocation that self-optimizes for LTV', impact: 'Continuous improvement without manual intervention', value: '€2-4M annually' }
        ]
      },
      next: 'Download your best practice benchmark showing how the top 5% of telcos maximize support’s impact on LTV.'
    },
    {
      name: 'Value maximized',
      range: [25, 25],
      impact: 'Optimized',
      desc: 'Your support operation is a strategic revenue and retention engine, not a cost center. You dynamically protect high value customer relationships, generate measurable ARPU expansion through support excellence, optimize every support investment for maximum LTV impact, and run real time individual customer level value optimization. You’re operating 3-5 years ahead of industry average.',
      analysis: {
        title: 'Competitive advantage analysis',
        lines: [
          { text: 'LTV protection vs reactive operators', value: '€40-60M annually' },
          { text: 'ARPU expansion advantage', value: '€15-25M annually' },
          { text: 'Cost efficiency advantage', value: '€10-15M annually' }
        ],
        totalLabel: 'Total competitive advantage',
        totalValue: '€60-100M annually'
      },
      actions: {
        title: 'What’s next',
        list: [
          { title: 'Share your playbook', impact: 'Help benchmark the industry', value: 'and potentially monetize your approach' },
          { title: 'Explore partnership opportunities', impact: 'Work with us to help other operators reach your level', value: '' },
          { title: 'Continuous innovation', impact: 'Stay ahead as the industry catches up', value: '' }
        ]
      },
      next: 'Schedule a strategic discussion to explore how we can help you maintain this competitive advantage.'
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
    stageNext: wrap.querySelector('.assess-stage-next'),
    impactLabel: wrap.querySelector('.assess-impact-label'),
    analysisTitle: wrap.querySelector('.assess-analysis-title'),
    analysisLines: wrap.querySelector('.assess-analysis-lines'),
    analysisTotalLabel: wrap.querySelector('.assess-analysis-total-label'),
    analysisTotalValue: wrap.querySelector('.assess-analysis-total-value'),
    actionsTitle: wrap.querySelector('.assess-actions-title'),
    actionsList: wrap.querySelector('.assess-actions-list'),
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
      state.current === questions.length - 1 ? 'See your impact score' : 'Next';
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
    if (els.impactLabel) els.impactLabel.textContent = 'CX impact: ' + tier.impact;
    els.stageDesc.textContent = tier.desc;
    els.stageNext.textContent = tier.next;

    if (els.analysisTitle && tier.analysis) {
      els.analysisTitle.textContent = tier.analysis.title;
      els.analysisLines.innerHTML = '';
      tier.analysis.lines.forEach(line => {
        const li = document.createElement('li');
        li.className = 'assess-analysis-line';
        const t = document.createElement('span');
        t.className = 'assess-analysis-line-text';
        t.textContent = line.text;
        const v = document.createElement('span');
        v.className = 'assess-analysis-line-value';
        v.textContent = line.value;
        li.appendChild(t);
        li.appendChild(v);
        els.analysisLines.appendChild(li);
      });
      els.analysisTotalLabel.textContent = tier.analysis.totalLabel;
      els.analysisTotalValue.textContent = tier.analysis.totalValue;
    }

    if (els.actionsTitle && tier.actions) {
      els.actionsTitle.textContent = tier.actions.title;
      els.actionsList.innerHTML = '';
      tier.actions.list.forEach(action => {
        const li = document.createElement('li');
        li.className = 'assess-action';
        const titleEl = document.createElement('h4');
        titleEl.className = 'assess-action-title';
        titleEl.textContent = action.title;
        li.appendChild(titleEl);
        if (action.impact) {
          const impact = document.createElement('p');
          impact.className = 'assess-action-impact';
          const strong = document.createElement('strong');
          strong.textContent = 'Potential impact: ';
          impact.appendChild(strong);
          impact.appendChild(document.createTextNode(action.impact));
          li.appendChild(impact);
        }
        if (action.value) {
          const value = document.createElement('p');
          value.className = 'assess-action-value';
          const strong = document.createElement('strong');
          strong.textContent = 'Value: ';
          value.appendChild(strong);
          value.appendChild(document.createTextNode(action.value));
          li.appendChild(value);
        }
        els.actionsList.appendChild(li);
      });
    }

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
})();
