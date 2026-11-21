/* ========================================================
   CALCULUS FOR BUSINESS - MODULE 1 (BEGINNER EDITION) SCRIPT
   Interactive Simulators, 16-Problem Practice & Quiz Engine
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize KaTeX Auto-Render
  renderMathInDocument();

  // 2. Initialize Theme Toggle
  initThemeToggle();

  // 3. Initialize Scroll Progress & TOC ScrollSpy
  initScrollFeatures();

  // 4. Initialize Interactive Break-Even Simulator & Chart
  initBreakEvenSimulator();

  // 5. Initialize Practice Solutions Toggles (1 to 16)
  initPracticeToggles();

  // 6. Initialize Module 1 Knowledge Check Quiz
  initQuiz();

  // 7. Initialize Formula Cheatsheet Modal
  initFormulaModal();

  // 8. Initialize Mobile Sidebar Drawer & TOC Search
  initSidebarFeatures();

  // 9. Initialize Infographic Fullscreen View
  initInfographicFeatures();
});

/* ========================================================
   1. KATEX AUTO-RENDER
   ======================================================== */
function renderMathInDocument(targetElement = document.body) {
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(targetElement, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false }
      ],
      throwOnError: false
    });
  }
}

/* ========================================================
   2. THEME TOGGLE
   ======================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('agy-calc-theme-v2') || 'light';
  
  if (savedTheme === 'dark') {
    document.body.classList.replace('light-theme', 'dark-theme');
    if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      if (document.body.classList.contains('light-theme')) {
        document.body.classList.replace('light-theme', 'dark-theme');
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem('agy-calc-theme-v2', 'dark');
        updateChartColors();
      } else {
        document.body.classList.replace('dark-theme', 'light-theme');
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('agy-calc-theme-v2', 'light');
        updateChartColors();
      }
    });
  }
}

/* ========================================================
   3. SCROLL PROGRESS & TOC SCROLLSPY
   ======================================================== */
function initScrollFeatures() {
  const progressBar = document.getElementById('scroll-progress-bar');
  const sections = document.querySelectorAll('.lesson-section, .hero-section');
  const tocLinks = document.querySelectorAll('.toc-item');

  window.addEventListener('scroll', () => {
    // Scroll progress percentage
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    // ScrollSpy active link
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (winScroll >= top) {
        currentId = sec.getAttribute('id');
      }
    });

    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (currentId && link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ========================================================
   4. INTERACTIVE BREAK-EVEN SIMULATOR (Chart.js)
   ======================================================== */
let breakEvenChartInstance = null;

function initBreakEvenSimulator() {
  const inputF = document.getElementById('input-fixed-cost');
  const inputV = document.getElementById('input-var-cost');
  const inputP = document.getElementById('input-price');

  const valF = document.getElementById('val-fixed-cost');
  const valV = document.getElementById('val-var-cost');
  const valP = document.getElementById('val-price');

  const statCM = document.getElementById('stat-cm');
  const statQStar = document.getElementById('stat-qstar');
  const statRStar = document.getElementById('stat-rstar');
  const formulaOutput = document.getElementById('sim-math-display');

  // Presets
  const btnMilkTea = document.getElementById('preset-milktea');
  const btnPractice10 = document.getElementById('preset-practice10');
  const btnNotebook = document.getElementById('preset-notebook');

  if (!inputF || !inputV || !inputP) return;

  function updateSimulator() {
    let F = parseFloat(inputF.value);
    let v = parseFloat(inputV.value);
    let p = parseFloat(inputP.value);

    // Guard: price must exceed variable cost for positive break-even
    if (p <= v) {
      p = v + 5;
      inputP.value = p;
    }

    if (valF) valF.textContent = `₱${F.toLocaleString()}`;
    if (valV) valV.textContent = `₱${v.toLocaleString()}`;
    if (valP) valP.textContent = `₱${p.toLocaleString()}`;

    const cm = p - v;
    const qStar = Math.round(F / cm);
    const rStar = qStar * p;

    if (statCM) statCM.textContent = `₱${cm.toFixed(2)}`;
    if (statQStar) statQStar.textContent = `${qStar.toLocaleString()} units`;
    if (statRStar) statRStar.textContent = `₱${rStar.toLocaleString()}`;

    // Update dynamic formula KaTeX
    if (formulaOutput) {
      formulaOutput.innerHTML = `\\[ Q = \\frac{F}{p - v} = \\frac{${F.toLocaleString()}}{${p} - ${v}} = \\mathbf{${qStar.toLocaleString()}} \\text{ products} \\]`;
      renderMathInDocument(formulaOutput);
    }

    updateChartData(F, v, p, qStar);
  }

  // Listeners
  [inputF, inputV, inputP].forEach(input => {
    input.addEventListener('input', updateSimulator);
  });

  // Preset Handlers
  if (btnMilkTea) {
    btnMilkTea.addEventListener('click', () => {
      setActivePreset(btnMilkTea);
      inputF.value = 3000;
      inputV.value = 50;
      inputP.value = 80;
      updateSimulator();
    });
  }

  if (btnPractice10) {
    btnPractice10.addEventListener('click', () => {
      setActivePreset(btnPractice10);
      inputF.value = 4000;
      inputV.value = 60;
      inputP.value = 100;
      updateSimulator();
    });
  }

  if (btnNotebook) {
    btnNotebook.addEventListener('click', () => {
      setActivePreset(btnNotebook);
      inputF.value = 2000;
      inputV.value = 30;
      inputP.value = 70;
      updateSimulator();
    });
  }

  function setActivePreset(activeBtn) {
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  // Build Chart.js Graph
  buildChart();
  updateSimulator();
}

function buildChart() {
  const ctx = document.getElementById('breakEvenChart');
  if (!ctx) return;

  const isDark = document.body.classList.contains('dark-theme');
  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  breakEvenChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Total Revenue R(x)',
          data: [],
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          borderWidth: 2.5,
          tension: 0,
          pointRadius: 0
        },
        {
          label: 'Total Cost C(x)',
          data: [],
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          borderWidth: 2.5,
          tension: 0,
          pointRadius: 0
        },
        {
          label: 'Fixed Cost F',
          data: [],
          borderColor: '#64748b',
          borderWidth: 1.5,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        },
        {
          label: 'Break-Even Point (Q)',
          data: [],
          borderColor: '#2563eb',
          backgroundColor: '#2563eb',
          pointRadius: 6,
          pointHoverRadius: 8,
          showLine: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              const val = context.parsed.y;
              return `${context.dataset.label}: ₱${val.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Quantity Produced & Sold (x)', color: textColor, font: { weight: '600' } },
          grid: { color: gridColor },
          ticks: { color: textColor }
        },
        y: {
          title: { display: true, text: 'Amount in Pesos (₱)', color: textColor, font: { weight: '600' } },
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            callback: function(val) {
              return '₱' + (val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val);
            }
          }
        }
      }
    }
  });
}

function updateChartData(F, v, p, qStar) {
  if (!breakEvenChartInstance) return;

  const maxUnits = Math.max(qStar * 2, 150);
  const steps = 10;
  const stepSize = Math.ceil(maxUnits / steps);

  const labels = [];
  const revenueData = [];
  const costData = [];
  const fixedData = [];

  for (let x = 0; x <= maxUnits; x += stepSize) {
    labels.push(x);
    revenueData.push(p * x);
    costData.push(F + (v * x));
    fixedData.push(F);
  }

  // BEP Point coordinate
  let bepData = [];
  labels.forEach(x => {
    if (Math.abs(x - qStar) < stepSize / 2) {
      bepData.push(p * qStar);
    } else {
      bepData.push(null);
    }
  });

  breakEvenChartInstance.data.labels = labels;
  breakEvenChartInstance.data.datasets[0].data = revenueData;
  breakEvenChartInstance.data.datasets[1].data = costData;
  breakEvenChartInstance.data.datasets[2].data = fixedData;
  breakEvenChartInstance.data.datasets[3].data = bepData;

  breakEvenChartInstance.update();
}

function updateChartColors() {
  if (!breakEvenChartInstance) return;
  const isDark = document.body.classList.contains('dark-theme');
  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  breakEvenChartInstance.options.scales.x.title.color = textColor;
  breakEvenChartInstance.options.scales.x.ticks.color = textColor;
  breakEvenChartInstance.options.scales.x.grid.color = gridColor;

  breakEvenChartInstance.options.scales.y.title.color = textColor;
  breakEvenChartInstance.options.scales.y.ticks.color = textColor;
  breakEvenChartInstance.options.scales.y.grid.color = gridColor;

  breakEvenChartInstance.update();
}

/* ========================================================
   5. PRACTICE EXERCISES & SOLUTIONS ACCORDION (1 to 16)
   ======================================================== */
function initPracticeToggles() {
  const toggleBtns = document.querySelectorAll('.toggle-sol-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const solEl = document.getElementById(targetId);
      if (solEl) {
        const isRevealed = solEl.classList.contains('revealed');
        if (isRevealed) {
          solEl.classList.remove('revealed');
          btn.innerHTML = `<i class="fa-solid fa-chevron-down"></i> Reveal ${targetId.replace('sol-', 'Solution ')}`;
        } else {
          solEl.classList.add('revealed');
          btn.innerHTML = `<i class="fa-solid fa-chevron-up"></i> Hide ${targetId.replace('sol-', 'Solution ')}`;
          renderMathInDocument(solEl);
        }
      }
    });
  });

  // Reveal All / Hide All button
  const toggleAllBtn = document.getElementById('toggle-all-solutions-btn');

  function toggleAll() {
    const allSolutions = document.querySelectorAll('.practice-solution');
    const areSomeHidden = Array.from(allSolutions).some(s => !s.classList.contains('revealed'));

    allSolutions.forEach(s => {
      const id = s.getAttribute('id');
      const btn = document.querySelector(`[data-target="${id}"]`);
      if (areSomeHidden) {
        s.classList.add('revealed');
        renderMathInDocument(s);
        if (btn) btn.innerHTML = `<i class="fa-solid fa-chevron-up"></i> Hide ${id.replace('sol-', 'Solution ')}`;
      } else {
        s.classList.remove('revealed');
        if (btn) btn.innerHTML = `<i class="fa-solid fa-chevron-down"></i> Reveal ${id.replace('sol-', 'Solution ')}`;
      }
    });

    const label = areSomeHidden ? '<i class="fa-solid fa-eye-slash"></i> Hide All Solutions' : '<i class="fa-solid fa-eye"></i> Reveal All Solutions';
    if (toggleAllBtn) toggleAllBtn.innerHTML = label;
  }

  if (toggleAllBtn) toggleAllBtn.addEventListener('click', toggleAll);
}

/* ========================================================
   6. MODULE 1 KNOWLEDGE CHECK QUIZ
   ======================================================== */
function initQuiz() {
  const form = document.getElementById('knowledge-check-form');
  const progressText = document.getElementById('quiz-progress-text');
  const scoreDisplay = document.getElementById('quiz-score-display');
  const scoreNum = document.getElementById('quiz-score-num');
  const resetBtn = document.getElementById('reset-quiz-btn');

  if (!form) return;

  const questions = document.querySelectorAll('.quiz-q');
  const totalQ = questions.length;

  // Track progress on selection
  form.addEventListener('change', () => {
    let answered = 0;
    questions.forEach(q => {
      const qNum = q.getAttribute('data-q');
      if (form.querySelector(`input[name="q${qNum}"]:checked`)) {
        answered++;
      }
    });
    if (progressText) progressText.textContent = `${answered} of ${totalQ} answered`;
  });

  // Submit Evaluation
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let score = 0;

    questions.forEach(q => {
      const qNum = q.getAttribute('data-q');
      const correctVal = q.getAttribute('data-correct');
      const feedbackEl = document.getElementById(`fb-${qNum}`);
      const selected = form.querySelector(`input[name="q${qNum}"]:checked`);

      if (!feedbackEl) return;

      if (!selected) {
        feedbackEl.className = 'q-feedback incorrect';
        feedbackEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Not answered yet. Correct answer: <strong>${correctVal}</strong>`;
      } else if (selected.value.trim() === correctVal.trim()) {
        score++;
        feedbackEl.className = 'q-feedback correct';
        feedbackEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> Correct! <strong>${correctVal}</strong>`;
      } else {
        feedbackEl.className = 'q-feedback incorrect';
        feedbackEl.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Incorrect. You selected "${selected.value}". Correct answer: <strong>${correctVal}</strong>`;
      }
    });

    if (scoreDisplay) scoreDisplay.style.display = 'inline-block';
    if (scoreNum) scoreNum.textContent = score;

    // Trigger Confetti if student did well
    if (score >= 6 && typeof confetti === 'function') {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 }
      });
    }

    if (scoreDisplay) scoreDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Reset Quiz
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      if (progressText) progressText.textContent = `0 of ${totalQ} answered`;
      if (scoreDisplay) scoreDisplay.style.display = 'none';
      document.querySelectorAll('.q-feedback').forEach(fb => {
        fb.className = 'q-feedback';
        fb.innerHTML = '';
      });
    });
  }
}

/* ========================================================
   7. FORMULA CHEATSHEET MODAL
   ======================================================== */
function initFormulaModal() {
  const modal = document.getElementById('formula-modal');
  const openBtn = document.getElementById('quick-formula-btn');
  const closeBtn = document.getElementById('close-modal-btn');

  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', () => {
    modal.classList.add('open');
    renderMathInDocument(modal);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });
}

/* ========================================================
   8. SIDEBAR FEATURES & SEARCH
   ======================================================== */
function initSidebarFeatures() {
  const sidebar = document.getElementById('sidebar');
  const openSidebarBtn = document.getElementById('sidebar-toggle-btn');
  const closeSidebarBtn = document.getElementById('sidebar-close-btn');
  const searchInput = document.getElementById('toc-search');
  const tocItems = document.querySelectorAll('.toc-list li');

  if (openSidebarBtn && sidebar) {
    openSidebarBtn.addEventListener('click', () => {
      sidebar.classList.add('mobile-open');
    });
  }

  if (closeSidebarBtn && sidebar) {
    closeSidebarBtn.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
    });
  }

  // Close sidebar when clicking a TOC link on mobile
  document.querySelectorAll('.toc-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 1024 && sidebar) {
        sidebar.classList.remove('mobile-open');
      }
    });
  });

  // Search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      tocItems.forEach(li => {
        const text = li.textContent.toLowerCase();
        if (text.includes(term)) {
          li.style.display = '';
        } else {
          li.style.display = 'none';
        }
      });
    });
  }
}

/* ========================================================
   9. INFOGRAPHIC FULLSCREEN
   ======================================================== */
function initInfographicFeatures() {
  const expandBtn = document.getElementById('infographic-expand-btn');
  const poster = document.getElementById('infographic-poster');

  if (expandBtn && poster) {
    expandBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        poster.requestFullscreen().catch(err => {
          alert(`Error attempting to enable fullscreen mode: ${err.message}`);
        });
        expandBtn.innerHTML = '<i class="fa-solid fa-compress"></i> Exit Fullscreen';
      } else {
        document.exitFullscreen();
        expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i> Fullscreen Poster';
      }
    });

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i> Fullscreen Poster';
      }
    });
  }
}
