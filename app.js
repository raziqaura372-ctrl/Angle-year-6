// Angle Quest - Complete JS Application

// --- TEACHER EDITABLE CONFIGURATION ---
const ANGLES = [90, 45, 120, 150];
const TOLERANCE = 10; // acceptable error in degrees

// --- NAVIGATION & UTILS ---
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById(`screen-${screenId}`);
  if (target) target.classList.remove('hidden');
}

function goHome() {
  sounds.playTick();
  if (escapeState.timerInterval) clearInterval(escapeState.timerInterval);
  showScreen('home');
}

function toggleMute() {
  const isMuted = sounds.toggleMute();
  const btn = document.getElementById('btn-mute');
  if (btn) {
    btn.textContent = isMuted ? '🔇' : '🔊';
  }
}

// --- SOUND ENGINE (Web Audio API) ---
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playCorrect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.25);
    });
  }

  playWrong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playTimeUp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const freqs = [400, 350, 300, 250];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.12 + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.12);
      osc.stop(this.ctx.currentTime + idx * 0.12 + 0.15);
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

const sounds = new SoundEngine();

// --- GAME 1: ANGLE ESCAPE ROOM DATA & LOGIC ---
const ESCAPE_QUESTIONS = [
  // Level 1: Identify angles
  {
    id: 1,
    level: 1,
    question: "A 40° angle. What type of angle is this?",
    options: ["Acute", "Right", "Obtuse", "Reflex"],
    answer: "Acute",
    explanation: "An angle less than 90° is an Acute angle."
  },
  {
    id: 2,
    level: 1,
    question: "A 125° angle. What type of angle is this?",
    options: ["Obtuse", "Acute", "Right", "Reflex"],
    answer: "Obtuse",
    explanation: "An angle between 90° and 180° is an Obtuse angle."
  },
  {
    id: 3,
    level: 1,
    question: "A 250° angle. What type of angle is this?",
    options: ["Reflex", "Obtuse", "Acute", "Straight"],
    answer: "Reflex",
    explanation: "An angle greater than 180° but less than 360° is a Reflex angle."
  },
  // Level 2: Angles on line, point, triangle
  {
    id: 4,
    level: 2,
    question: "Two angles on a straight line are 110° and x. Find x.",
    options: ["70°", "80°", "90°", "110°"],
    answer: "70°",
    explanation: "Angles on a straight line add up to 180° (180 - 110 = 70)."
  },
  {
    id: 5,
    level: 2,
    question: "Three angles around a point are 100°, 120° and x. Find x.",
    options: ["140°", "120°", "150°", "180°"],
    answer: "140°",
    explanation: "Angles around a point add up to 360° (360 - 100 - 120 = 140)."
  },
  {
    id: 6,
    level: 2,
    question: "A triangle has angles 50°, 60° and x. Find x.",
    options: ["70°", "80°", "60°", "90°"],
    answer: "70°",
    explanation: "Angles inside a triangle add up to 180° (180 - 50 - 60 = 70)."
  },
  // Level 3: Polygons
  {
    id: 7,
    level: 3,
    question: "A quadrilateral has angles 90°, 80°, 100° and x. Find x.",
    options: ["90°", "80°", "100°", "110°"],
    answer: "90°",
    explanation: "Angles in a quadrilateral add up to 360° (360 - 90 - 80 - 100 = 90)."
  },
  {
    id: 8,
    level: 3,
    question: "A pentagon can be split into 3 triangles. What is the sum of its interior angles?",
    options: ["540°", "360°", "180°", "720°"],
    answer: "540°",
    explanation: "3 triangles × 180° = 540°."
  },
  {
    id: 9,
    level: 3,
    question: "A regular hexagon has a total interior angle sum of 720°. What is the size of ONE interior angle?",
    options: ["120°", "100°", "108°", "140°"],
    answer: "120°",
    explanation: "720° divided by 6 sides equals 120°."
  }
];

const ROLES_ROTATION = [
  { level: 1, nav: "Pupil A", reader: "Pupil B", checker: "Pupil C" },
  { level: 2, nav: "Pupil B", reader: "Pupil C", checker: "Pupil A" },
  { level: 3, nav: "Pupil C", reader: "Pupil A", checker: "Pupil B" }
];

let escapeState = {
  currentQuestionIdx: 0,
  score: 0,
  results: [],
  timerSeconds: 600, // 10 mins
  timerInterval: null,
  selectedOption: null,
  attemptsForCurrent: 0,
  shuffledQuestions: []
};

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startEscapeRoomIntro() {
  sounds.playTick();
  initEscapeGame();
}

function startEscapeRoomPlay() {
  sounds.playTick();
  showScreen('escape-play');
  startEscapeTimer();
  renderEscapeQuestion();
}

function initEscapeGame() {
  escapeState.currentQuestionIdx = 0;
  escapeState.score = 0;
  escapeState.results = [];
  escapeState.timerSeconds = 600;
  escapeState.selectedOption = null;
  escapeState.attemptsForCurrent = 0;

  escapeState.shuffledQuestions = ESCAPE_QUESTIONS.map(q => ({
    ...q,
    shuffledOptions: shuffleArray(q.options)
  }));

  if (escapeState.timerInterval) clearInterval(escapeState.timerInterval);
  showScreen('escape-intro');
}

function startEscapeTimer() {
  if (escapeState.timerInterval) clearInterval(escapeState.timerInterval);
  escapeState.timerInterval = setInterval(() => {
    escapeState.timerSeconds--;
    updateEscapeTimerUI();
    if (escapeState.timerSeconds <= 0) {
      clearInterval(escapeState.timerInterval);
      sounds.playTimeUp();
      finishEscapeGame(true);
    }
  }, 1000);
  updateEscapeTimerUI();
}

function updateEscapeTimerUI() {
  const timerElem = document.getElementById('escape-timer-display');
  if (!timerElem) return;

  const mins = Math.floor(escapeState.timerSeconds / 60);
  const secs = escapeState.timerSeconds % 60;
  const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  timerElem.textContent = `⏱️ ${formatted}`;

  if (escapeState.timerSeconds <= 60) {
    timerElem.style.color = 'var(--accent-red)';
  } else if (escapeState.timerSeconds <= 120) {
    timerElem.style.color = 'var(--accent-orange)';
  } else {
    timerElem.style.color = 'var(--text-main)';
  }
}

function renderEscapeQuestion() {
  const q = escapeState.shuffledQuestions[escapeState.currentQuestionIdx];
  const roleConfig = ROLES_ROTATION.find(r => r.level === q.level);

  for (let l = 1; l <= 3; l++) {
    const lockEl = document.getElementById(`lock-level-${l}`);
    if (lockEl) {
      if (l < q.level) {
        lockEl.className = 'lock-item unlocked';
        lockEl.innerHTML = `🔓 Level ${l}`;
      } else if (l === q.level) {
        lockEl.className = 'lock-item active';
        lockEl.innerHTML = `🔒 Level ${l}`;
      } else {
        lockEl.className = 'lock-item';
        lockEl.innerHTML = `🔒 Level ${l}`;
      }
    }
  }

  document.getElementById('role-nav').textContent = roleConfig.nav;
  document.getElementById('role-reader').textContent = roleConfig.reader;
  document.getElementById('role-checker').textContent = roleConfig.checker;

  document.getElementById('q-counter').textContent = `Question ${escapeState.currentQuestionIdx + 1} of 9`;
  document.getElementById('q-text').textContent = q.question;

  const svgContainer = document.getElementById('q-svg-container');
  svgContainer.innerHTML = generateQuestionSVG(q.id);

  const optionsGrid = document.getElementById('q-options-grid');
  optionsGrid.innerHTML = '';
  escapeState.selectedOption = null;
  document.getElementById('btn-agree-submit').disabled = true;

  q.shuffledOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => {
      sounds.playTick();
      document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      escapeState.selectedOption = opt;
      document.getElementById('btn-agree-submit').disabled = false;
    };
    optionsGrid.appendChild(btn);
  });
}

function handleAgreeSubmit() {
  if (!escapeState.selectedOption) return;

  const q = escapeState.shuffledQuestions[escapeState.currentQuestionIdx];
  const isCorrect = escapeState.selectedOption === q.answer;

  if (isCorrect) {
    sounds.playCorrect();
    const points = escapeState.attemptsForCurrent === 0 ? 2 : 1;
    escapeState.score += points;

    escapeState.results.push({
      id: q.id,
      question: q.question,
      status: escapeState.attemptsForCurrent === 0 ? 'first' : 'retry',
      points: points
    });

    if (q.level === 3) {
      showOralExplanationModal(q.explanation);
    } else {
      showFeedbackModal(true, `Correct! 🎉 ${q.explanation}`, () => advanceQuestion());
    }
  } else {
    sounds.playWrong();
    escapeState.attemptsForCurrent++;
    if (escapeState.attemptsForCurrent === 1) {
      showFeedbackModal(false, `Not quite right!\nTry one more time together!`, () => {
        document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        escapeState.selectedOption = null;
        document.getElementById('btn-agree-submit').disabled = true;
      });
    } else {
      escapeState.results.push({
        id: q.id,
        question: q.question,
        status: 'wrong',
        points: 0
      });
      showFeedbackModal(false, `Incorrect. The correct answer was ${q.answer}. ${q.explanation}`, () => advanceQuestion());
    }
  }
}

function advanceQuestion() {
  const currentQ = escapeState.shuffledQuestions[escapeState.currentQuestionIdx];
  escapeState.attemptsForCurrent = 0;
  escapeState.currentQuestionIdx++;

  if (escapeState.currentQuestionIdx >= escapeState.shuffledQuestions.length) {
    clearInterval(escapeState.timerInterval);
    finishEscapeGame(false);
    return;
  }

  const nextQ = escapeState.shuffledQuestions[escapeState.currentQuestionIdx];
  if (nextQ.level > currentQ.level) {
    showLevelCompleteModal(currentQ.level, nextQ.level);
  } else {
    renderEscapeQuestion();
  }
}

function showFeedbackModal(isCorrect, message, onContinue) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content">
      <h2 style="font-size: 3rem; color: ${isCorrect ? 'var(--accent-green)' : 'var(--accent-red)'}">
        ${isCorrect ? '✅ Excellent!' : '❌ Let\'s Check!'}
      </h2>
      <p class="instruction-text">${message}</p>
      <button class="btn btn-success" id="btn-modal-continue">Continue</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('btn-modal-continue').onclick = () => {
    sounds.playTick();
    document.body.removeChild(overlay);
    if (onContinue) onContinue();
  };
}

function showOralExplanationModal(explanation) {
  const roleConfig = ROLES_ROTATION.find(r => r.level === 3);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content">
      <h2 style="font-size: 2.8rem; color: var(--accent-yellow)">🗣️ Explain Aloud!</h2>
      <p class="instruction-text">
        <strong>${roleConfig.reader} (Reader):</strong> Say <em>"because..."</em> and explain your answer aloud to your group!
      </p>
      <p class="body-text" style="color: var(--text-muted); margin-bottom: 2rem;">
        Key idea: ${explanation}
      </p>
      <button class="btn btn-warning" id="btn-explained">We explained it! 🗣️</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('btn-explained').onclick = () => {
    sounds.playTick();
    document.body.removeChild(overlay);
    advanceQuestion();
  };
}

function showLevelCompleteModal(completedLevel, nextLevel) {
  const nextRoles = ROLES_ROTATION.find(r => r.level === nextLevel);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content">
      <h2 style="font-size: 3.5rem; color: var(--accent-green)">🔓 Level ${completedLevel} Complete!</h2>
      <p class="instruction-text">Lock ${completedLevel} is open! Great teamwork!</p>
      <div style="font-size: 4rem; margin: 1rem 0;">⭐ ⭐ ⭐</div>
      <div class="roles-banner" style="margin-top: 1.5rem;">
        <div class="role-tag">📱 <strong>Navigator:</strong> ${nextRoles.nav}</div>
        <div class="role-tag">📖 <strong>Reader:</strong> ${nextRoles.reader}</div>
        <div class="role-tag">✅ <strong>Checker:</strong> ${nextRoles.checker}</div>
      </div>
      <button class="btn btn-success" id="btn-next-level">Start Level ${nextLevel} 🚀</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('btn-next-level').onclick = () => {
    sounds.playTick();
    document.body.removeChild(overlay);
    renderEscapeQuestion();
  };
}

function finishEscapeGame(isTimeUp) {
  showScreen('escape-results');
  const totalSecsUsed = 600 - escapeState.timerSeconds;
  const mins = Math.floor(totalSecsUsed / 60);
  const secs = totalSecsUsed % 60;
  const timeStr = `${mins}m ${secs}s`;

  document.getElementById('res-score').textContent = `${escapeState.score} / 18`;
  document.getElementById('res-time').textContent = timeStr;

  let stars = "⭐";
  if (escapeState.score >= 15) stars = "⭐ ⭐ ⭐";
  else if (escapeState.score >= 10) stars = "⭐ ⭐";
  document.getElementById('res-stars').textContent = stars;

  const msgElem = document.getElementById('res-message');
  if (isTimeUp) {
    msgElem.textContent = "⏱️ Time's up! Great teamwork!";
    msgElem.style.color = "var(--accent-orange)";
  } else {
    msgElem.textContent = "🎉 Escape successful! Fantastic geometry skills!";
    msgElem.style.color = "var(--accent-green)";
  }

  const tableBody = document.getElementById('res-table-body');
  tableBody.innerHTML = '';
  escapeState.results.forEach((r, idx) => {
    let statusIcon = '✅ First Try (+2)';
    if (r.status === 'retry') statusIcon = '🔁 Retry Correct (+1)';
    else if (r.status === 'wrong') statusIcon = '❌ Incorrect (+0)';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>Q${idx + 1}</td>
      <td style="text-align: left;">${r.question}</td>
      <td>${statusIcon}</td>
      <td><strong>${r.points}</strong></td>
    `;
    tableBody.appendChild(tr);
  });
}
