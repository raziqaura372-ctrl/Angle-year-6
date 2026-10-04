/* ==========================================================================
   ANGLE QUEST - MAIN JAVASCRIPT APPLICATION
   ========================================================================== */

// Configurable constants for Game 2
const ANGLES = [90, 45, 120, 150];
const TOLERANCE = 10; // degrees acceptable error zone

/* ==========================================================================
   1. Web Audio API Sound Synthesizer
   ========================================================================== */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.15, startVol = 0.3) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(startVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  playTick() {
    this.playTone(800, 'sine', 0.05, 0.15);
  }

  playCorrect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.2, 0.25), idx * 80);
    });
  }

  playWrong() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.playTone(220, 'sawtooth', 0.2, 0.2);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.3, 0.2), 150);
  }

  playTimeUp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    [400, 350, 300, 250].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'square', 0.15, 0.2), idx * 100);
    });
  }

  playFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 880, 1046.50];
    const delays = [0, 120, 240, 360, 500, 650];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'triangle', 0.3, 0.3), delays[i]);
    });
  }

  playSparkle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this.playTone(1200 + Math.random() * 800, 'sine', 0.08, 0.15);
      }, i * 60);
    }
  }
}

const audio = new SoundEngine();

/* ==========================================================================
   2. Canvas Particle Generator (Confetti, Stars, Fireworks)
   ========================================================================== */
class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animating = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burstConfetti(count = 70) {
    if (!this.ctx) return;
    const colors = ['#f472b6', '#fb923c', '#fde047', '#4ade80', '#38bdf8', '#c084fc'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: window.innerWidth / 2 + (Math.random() * 200 - 100),
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 18,
        size: 8 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        gravity: 0.35,
        life: 1,
        decay: 0.012 + Math.random() * 0.01
      });
    }
    if (!this.animating) {
      this.animating = true;
      this.loop();
    }
  }

  burstFireworks(count = 90) {
    if (!this.ctx) return;
    const colors = ['#fde047', '#38bdf8', '#f472b6', '#4ade80', '#ffffff'];
    const cx = window.innerWidth * (0.2 + Math.random() * 0.6);
    const cy = window.innerHeight * (0.2 + Math.random() * 0.4);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 12;
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: 0,
        vRot: 0,
        gravity: 0.15,
        life: 1,
        decay: 0.015 + Math.random() * 0.01
      });
    }
    if (!this.animating) {
      this.animating = true;
      this.loop();
    }
  }

  loop() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRot;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.animating = false;
    }
  }
}

const particles = new ParticleEngine('particle-canvas');

/* ==========================================================================
   3. Prot-Bot Original Cartoon Mascot Renderer
   ========================================================================== */
function renderProtBotSVG(expression = 'happy', hasPartyHat = false) {
  let mouthPath = "M 45 70 Q 60 85 75 70"; // default smile (protractor shape)
  let eyeLeft = `<circle cx="42" cy="48" r="8" fill="#0f172a"/><circle cx="44" cy="46" r="3" fill="#ffffff"/>`;
  let eyeRight = `<circle cx="78" cy="48" r="8" fill="#0f172a"/><circle cx="80" cy="46" r="3" fill="#ffffff"/>`;
  let armLeft = `<path d="M 20 65 Q 10 75 15 85" fill="none" stroke="#0284c7" stroke-width="6" stroke-linecap="round"/>`;
  let armRight = `<path d="M 100 65 Q 110 75 105 85" fill="none" stroke="#0284c7" stroke-width="6" stroke-linecap="round"/>`;

  if (expression === 'cheering') {
    mouthPath = "M 45 68 Q 60 92 75 68 Z";
    armLeft = `<path d="M 20 65 Q 5 45 15 30" fill="none" stroke="#0284c7" stroke-width="6" stroke-linecap="round"/>`;
    armRight = `<path d="M 100 65 Q 115 45 105 30" fill="none" stroke="#0284c7" stroke-width="6" stroke-linecap="round"/>`;
  } else if (expression === 'thinking') {
    mouthPath = "M 48 74 Q 60 66 72 74 Z";
    eyeLeft = `<circle cx="42" cy="44" r="7" fill="#0f172a"/><circle cx="44" cy="42" r="2.5" fill="#ffffff"/>`;
    eyeRight = `<circle cx="78" cy="44" r="7" fill="#0f172a"/><circle cx="80" cy="42" r="2.5" fill="#ffffff"/>`;
    armRight = `<path d="M 100 65 Q 90 50 78 58" fill="none" stroke="#0284c7" stroke-width="6" stroke-linecap="round"/>`;
  } else if (expression === 'oops') {
    mouthPath = "M 50 78 Q 60 68 70 78 Z";
    eyeLeft = `<path d="M 36 44 L 48 52 M 48 44 L 36 52" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>`;
    eyeRight = `<path d="M 72 44 L 84 52 M 84 44 L 72 52" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>`;
  }

  const partyHatSVG = hasPartyHat ? `
    <g transform="translate(42, -5)">
      <polygon points="18,10 0,40 36,40" fill="#f472b6" stroke="#ffffff" stroke-width="2"/>
      <circle cx="18" cy="8" r="6" fill="#fde047"/>
      <line x1="0" y1="40" x2="36" y2="40" stroke="#fb923c" stroke-width="4"/>
    </g>
  ` : '';

  return `
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <!-- Antenna -->
      <line x1="60" y1="28" x2="60" y2="12" stroke="#0284c7" stroke-width="5" stroke-linecap="round"/>
      <circle cx="60" cy="10" r="7" fill="#fde047" stroke="#eab308" stroke-width="2"/>

      <!-- Arms -->
      ${armLeft}
      ${armRight}

      <!-- Body / Head (Round Robot) -->
      <circle cx="60" cy="60" r="42" fill="#38bdf8" stroke="#0284c7" stroke-width="5"/>

      <!-- Rosy Cheeks -->
      <circle cx="34" cy="62" r="7" fill="#f472b6" opacity="0.6"/>
      <circle cx="86" cy="62" r="7" fill="#f472b6" opacity="0.6"/>

      <!-- Eyes -->
      ${eyeLeft}
      ${eyeRight}

      <!-- Protractor Smile -->
      <path d="${mouthPath}" fill="#fde047" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>

      <!-- Party Hat -->
      ${partyHatSVG}
    </svg>
  `;
}

function updateProtBot(expression = 'happy', speechText = '', hasPartyHat = false) {
  const avatarWrapper = document.getElementById('prot-bot-svg-wrapper');
  const speechEl = document.getElementById('speech-text');

  if (avatarWrapper) {
    avatarWrapper.innerHTML = renderProtBotSVG(expression, hasPartyHat);
  }
  if (speechEl && speechText) {
    speechEl.textContent = speechText;
  }
}

/* ==========================================================================
   4. Game 1: Angle Escape Room State & Logic
   ========================================================================== */

const GAME1_QUESTIONS = [
  // Level 1: Identify angles
  {
    level: 1,
    worldName: "Jungle Gate 🌿",
    worldClass: "level-1-bg",
    prompt: "What type of angle is this?",
    angleDeg: 40,
    type: "acute",
    options: ["Acute", "Right", "Obtuse", "Reflex"],
    correct: "Acute",
    explanation: "An acute angle is smaller than 90°.",
    diagramType: "angle"
  },
  {
    level: 1,
    worldName: "Jungle Gate 🌿",
    worldClass: "level-1-bg",
    prompt: "What type of angle is this?",
    angleDeg: 125,
    type: "obtuse",
    options: ["Acute", "Right", "Obtuse", "Reflex"],
    correct: "Obtuse",
    explanation: "An obtuse angle is between 90° and 180°.",
    diagramType: "angle"
  },
  {
    level: 1,
    worldName: "Jungle Gate 🌿",
    worldClass: "level-1-bg",
    prompt: "What type of angle is this?",
    angleDeg: 250,
    type: "reflex",
    options: ["Acute", "Right", "Obtuse", "Reflex"],
    correct: "Reflex",
    explanation: "A reflex angle is greater than 180°.",
    diagramType: "angle"
  },

  // Level 2: Line, Point, Triangle
  {
    level: 2,
    worldName: "Space Station 🚀",
    worldClass: "level-2-bg",
    prompt: "Two angles on a straight line: 110° and x. Find x.",
    options: ["70°", "80°", "90°", "180°"],
    correct: "70°",
    explanation: "Angles on a straight line add up to 180°. (180 - 110 = 70)",
    diagramType: "straight-line",
    given: 110
  },
  {
    level: 2,
    worldName: "Space Station 🚀",
    worldClass: "level-2-bg",
    prompt: "Three angles around a point: 100°, 120° and x. Find x.",
    options: ["140°", "120°", "100°", "160°"],
    correct: "140°",
    explanation: "Angles around a point add up to 360°. (360 - 100 - 120 = 140)",
    diagramType: "point",
    given: [100, 120]
  },
  {
    level: 2,
    worldName: "Space Station 🚀",
    worldClass: "level-2-bg",
    prompt: "A triangle has angles 50°, 60° and x. Find x.",
    options: ["70°", "80°", "60°", "90°"],
    correct: "70°",
    explanation: "Angles in a triangle add up to 180°. (180 - 50 - 60 = 70)",
    diagramType: "triangle",
    given: [50, 60]
  },

  // Level 3: Polygons
  {
    level: 3,
    worldName: "Treasure Vault 💎",
    worldClass: "level-3-bg",
    prompt: "A quadrilateral has angles 90°, 80°, 100° and x. Find x.",
    options: ["90°", "100°", "80°", "110°"],
    correct: "90°",
    explanation: "Angles in a quadrilateral add up to 360°. (360 - 90 - 80 - 100 = 90)",
    diagramType: "quadrilateral",
    given: [90, 80, 100]
  },
  {
    level: 3,
    worldName: "Treasure Vault 💎",
    worldClass: "level-3-bg",
    prompt: "A pentagon can be split into 3 triangles. What is the sum of its interior angles?",
    options: ["540°", "360°", "720°", "450°"],
    correct: "540°",
    explanation: "A pentagon's interior angles sum to (5 - 2) × 180° = 540°.",
    diagramType: "pentagon"
  },
  {
    level: 3,
    worldName: "Treasure Vault 💎",
    worldClass: "level-3-bg",
    prompt: "A regular hexagon has a sum of interior angles of 720°. What is ONE interior angle?",
    options: ["120°", "100°", "130°", "140°"],
    correct: "120°",
    explanation: "720° divided by 6 equal sides = 120°.",
    diagramType: "hexagon"
  }
];

let g1State = {
  currentQIndex: 0,
  score: 0,
  timeRemaining: 600, // 10 minutes in seconds
  timerInterval: null,
  selectedOption: null,
  attempts: 0,
  roles: ['Pupil 1', 'Pupil 2', 'Pupil 3'],
  resultsLog: []
};

function renderSVGDiagram(q) {
  const shapeColors = ['#f472b6', '#38bdf8', '#fb923c', '#4ade80', '#c084fc'];
  const fill = shapeColors[q.level % shapeColors.length];

  if (q.diagramType === 'angle') {
    const deg = q.angleDeg;
    const isReflex = deg > 180;
    const rad = (deg * Math.PI) / 180;
    const r = 80;
    const cx = 150, cy = 130;
    const x2 = cx + r * Math.cos(-rad);
    const y2 = cy + r * Math.sin(-rad);

    const largeArc = deg > 180 ? 1 : 0;

    return `
      <svg width="300" height="220" viewBox="0 0 300 220">
        <path d="M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2} Z" fill="${fill}" opacity="0.35"/>
        <line x1="${cx}" y1="${cy}" x2="${cx + 100}" y2="${cy}" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
        <line x1="${cx}" y1="${cy}" x2="${cx + 100 * Math.cos(-rad)}" y2="${cy + 100 * Math.sin(-rad)}" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
        <circle cx="${cx}" cy="${cy}" r="6" fill="#0f172a"/>
      </svg>
    `;
  }

  if (q.diagramType === 'straight-line') {
    return `
      <svg width="340" height="180" viewBox="0 0 340 180">
        <line x1="30" y1="130" x2="310" y2="130" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
        <line x1="170" y1="130" x2="110" y2="30" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
        <!-- Arc 110 -->
        <path d="M 220 130 A 50 50 0 0 0 148 93" fill="none" stroke="#fb923c" stroke-width="5"/>
        <text x="210" y="110" font-weight="bold" font-size="22" fill="#ea580c">110°</text>
        <!-- Arc x -->
        <path d="M 148 93 A 50 50 0 0 0 120 130" fill="none" stroke="#0284c7" stroke-width="5"/>
        <text x="110" y="110" font-weight="bold" font-size="26" fill="#0284c7">x</text>
      </svg>
    `;
  }

  if (q.diagramType === 'point') {
    return `
      <svg width="300" height="220" viewBox="0 0 300 220">
        <circle cx="150" cy="110" r="6" fill="#0f172a"/>
        <line x1="150" y1="110" x2="250" y2="110" stroke="#0f172a" stroke-width="5"/>
        <line x1="150" y1="110" x2="100" y2="30" stroke="#0f172a" stroke-width="5"/>
        <line x1="150" y1="110" x2="80" y2="170" stroke="#0f172a" stroke-width="5"/>
        <text x="180" y="80" font-weight="bold" font-size="22" fill="#15803d">100°</text>
        <text x="90" y="100" font-weight="bold" font-size="22" fill="#ea580c">120°</text>
        <text x="160" y="160" font-weight="bold" font-size="26" fill="#0284c7">x</text>
      </svg>
    `;
  }

  if (q.diagramType === 'triangle') {
    return `
      <svg width="300" height="200" viewBox="0 0 300 200">
        <polygon points="50,160 250,160 140,40" fill="${fill}" opacity="0.3" stroke="#0f172a" stroke-width="5"/>
        <text x="80" y="150" font-weight="bold" font-size="22" fill="#0f172a">50°</text>
        <text x="200" y="150" font-weight="bold" font-size="22" fill="#0f172a">60°</text>
        <text x="135" y="75" font-weight="bold" font-size="26" fill="#0284c7">x</text>
      </svg>
    `;
  }

  if (q.diagramType === 'quadrilateral') {
    return `
      <svg width="300" height="200" viewBox="0 0 300 200">
        <polygon points="40,160 260,160 220,40 70,50" fill="${fill}" opacity="0.35" stroke="#0f172a" stroke-width="5"/>
        <text x="60" y="145" font-weight="bold" font-size="20">90°</text>
        <text x="210" y="145" font-weight="bold" font-size="20">80°</text>
        <text x="180" y="75" font-weight="bold" font-size="20">100°</text>
        <text x="90" y="80" font-weight="bold" font-size="26" fill="#0284c7">x</text>
      </svg>
    `;
  }

  if (q.diagramType === 'pentagon') {
    return `
      <svg width="300" height="200" viewBox="0 0 300 200">
        <polygon points="150,30 250,90 210,180 90,180 50,90" fill="${fill}" opacity="0.35" stroke="#0f172a" stroke-width="5"/>
        <line x1="150" y1="30" x2="210" y2="180" stroke="#64748b" stroke-width="3" stroke-dasharray="6,6"/>
        <line x1="150" y1="30" x2="90" y2="180" stroke="#64748b" stroke-width="3" stroke-dasharray="6,6"/>
        <text x="140" y="120" font-weight="bold" font-size="22" fill="#0f172a">3 Δ</text>
      </svg>
    `;
  }

  if (q.diagramType === 'hexagon') {
    return `
      <svg width="300" height="200" viewBox="0 0 300 200">
        <polygon points="100,30 200,30 250,110 200,190 100,190 50,110" fill="${fill}" opacity="0.35" stroke="#0f172a" stroke-width="5"/>
        <text x="130" y="120" font-weight="bold" font-size="26" fill="#0f172a">720°</text>
      </svg>
    `;
  }

  return '';
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startG1Game() {
  g1State.currentQIndex = 0;
  g1State.score = 0;
  g1State.timeRemaining = 600;
  g1State.resultsLog = [];
  g1State.roles = ['Pupil 1', 'Pupil 2', 'Pupil 3'];

  document.getElementById('g1-coins').textContent = '0';
  updateLockIcons(1);
  startG1Timer();
  loadG1Question();
}

function startG1Timer() {
  clearInterval(g1State.timerInterval);
  g1State.timerInterval = setInterval(() => {
    g1State.timeRemaining--;
    updateG1TimerUI();

    if (g1State.timeRemaining <= 0) {
      clearInterval(g1State.timerInterval);
      audio.playTimeUp();
      showG1ResultsScreen(false);
    }
  }, 1000);
}

function updateG1TimerUI() {
  const mins = Math.floor(g1State.timeRemaining / 60);
  const secs = g1State.timeRemaining % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  document.getElementById('g1-timer-text').textContent = timeStr;

  const fuelBar = document.getElementById('g1-fuel-bar');
  const pct = Math.max(0, (g1State.timeRemaining / 600) * 100);
  fuelBar.style.width = `${pct}%`;

  fuelBar.classList.remove('warning', 'danger');
  if (g1State.timeRemaining <= 120 && g1State.timeRemaining > 60) {
    fuelBar.classList.add('warning');
  } else if (g1State.timeRemaining <= 60) {
    fuelBar.classList.add('danger');
  }
}

function updateLockIcons(level) {
  for (let i = 1; i <= 3; i++) {
    const lockEl = document.getElementById(`lock-${i}-icon`);
    if (i < level) {
      lockEl.textContent = '🔓';
      lockEl.classList.add('unlocked');
    } else {
      lockEl.textContent = '🔒';
      lockEl.classList.remove('unlocked');
    }
  }
}

function loadG1Question() {
  const q = GAME1_QUESTIONS[g1State.currentQIndex];
  g1State.selectedOption = null;
  g1State.attempts = 0;

  // Update Roles Display
  const currentNavIdx = (q.level - 1) % 3;
  const currentReadIdx = q.level % 3;
  const currentCheckIdx = (q.level + 1) % 3;

  document.getElementById('role-nav-name').textContent = g1State.roles[currentNavIdx];
  document.getElementById('role-read-name').textContent = g1State.roles[currentReadIdx];
  document.getElementById('role-check-name').textContent = g1State.roles[currentCheckIdx];

  // Update World Info
  const worldContainer = document.getElementById('g1-world-container');
  worldContainer.className = `g1-world-box ${q.worldClass}`;
  document.getElementById('g1-level-title').textContent = `Level ${q.level}: ${q.worldName}`;

  // Update Progress Stars
  const starsProgress = document.getElementById('g1-stars-progress');
  starsProgress.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const isCompleted = i < g1State.currentQIndex;
    starsProgress.innerHTML += `<span style="opacity: ${isCompleted ? 1 : 0.3}">⭐</span>`;
  }

  // Question & Diagram
  document.getElementById('g1-question-text').textContent = `Q${g1State.currentQIndex + 1}. ${q.prompt}`;
  document.getElementById('g1-diagram-container').innerHTML = renderSVGDiagram(q);

  // Answer Options
  const optionsGrid = document.getElementById('g1-options-grid');
  optionsGrid.innerHTML = '';
  const shuffled = shuffleArray(q.options);
  const shapes = ['⭐', '⭕', '🔺', '⬛'];
  const candyColors = ['candy-blue', 'candy-purple', 'candy-pink', 'candy-yellow'];

  shuffled.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = `candy-btn option-btn ${candyColors[idx % 4]}`;
    btn.innerHTML = `<span class="shape-icon">${shapes[idx % 4]}</span> <span>${opt}</span>`;
    btn.onclick = () => selectOption(btn, opt);
    optionsGrid.appendChild(btn);
  });

  document.getElementById('btn-g1-confirm').disabled = true;
  updateProtBot('happy', `Question ${g1State.currentQIndex + 1}! Reader, read aloud!`);
}

function selectOption(btnEl, optionText) {
  audio.playTick();
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btnEl.classList.add('selected');
  g1State.selectedOption = optionText;
  document.getElementById('btn-g1-confirm').disabled = false;
  updateProtBot('thinking', `Checker: Confirm if everyone agrees!`);
}

function confirmAnswer() {
  const q = GAME1_QUESTIONS[g1State.currentQIndex];
  const isCorrect = g1State.selectedOption === q.correct;
  g1State.attempts++;

  if (isCorrect) {
    audio.playCorrect();
    particles.burstConfetti(60);
    const pts = g1State.attempts === 1 ? 2 : 1;
    g1State.score += pts;
    document.getElementById('g1-coins').textContent = g1State.score;

    g1State.resultsLog.push({
      qNum: g1State.currentQIndex + 1,
      prompt: q.prompt,
      status: g1State.attempts === 1 ? '✅' : '🔁',
      points: pts
    });

    updateProtBot('cheering', 'Great teamwork! That is correct!');

    if (q.level === 3) {
      showExplainModal(q);
    } else {
      showFeedbackModal(true, `Correct! ${q.explanation}`);
    }
  } else {
    audio.playWrong();
    if (g1State.attempts === 1) {
      updateProtBot('oops', "Oops, let's think again! You have 1 retry!");
      showFeedbackModal(false, `Not quite! Think together and retry this question.`);
    } else {
      g1State.resultsLog.push({
        qNum: g1State.currentQIndex + 1,
        prompt: q.prompt,
        status: '❌',
        points: 0
      });
      updateProtBot('oops', 'Moving to next question!');
      showFeedbackModal(false, `Incorrect. ${q.explanation}`);
    }
  }
}

function showExplainModal(q) {
  const modal = document.getElementById('explain-overlay');
  modal.classList.remove('hidden');
  document.getElementById('btn-explained-confirm').onclick = () => {
    modal.classList.add('hidden');
    showFeedbackModal(true, `Awesome explanation! ${q.explanation}`);
  };
}

function showFeedbackModal(isCorrect, message) {
  const modal = document.getElementById('feedback-overlay');
  modal.classList.remove('hidden');
  document.getElementById('feedback-icon').textContent = isCorrect ? '🎉' : '🤔';
  document.getElementById('feedback-title').textContent = isCorrect ? 'Correct!' : 'Keep Going!';
  document.getElementById('feedback-msg').textContent = message;

  const nextBtn = document.getElementById('btn-feedback-next');
  nextBtn.onclick = () => {
    modal.classList.add('hidden');
    if (isCorrect || g1State.attempts >= 2) {
      advanceG1Question();
    }
  };
}

function advanceG1Question() {
  const currentQ = GAME1_QUESTIONS[g1State.currentQIndex];
  g1State.currentQIndex++;

  if (g1State.currentQIndex >= GAME1_QUESTIONS.length) {
    clearInterval(g1State.timerInterval);
    showG1ResultsScreen(true);
    return;
  }

  const nextQ = GAME1_QUESTIONS[g1State.currentQIndex];
  if (nextQ.level > currentQ.level) {
    showLevelCompleteScreen(currentQ.level);
  } else {
    loadG1Question();
  }
}

function showLevelCompleteScreen(completedLevel) {
  audio.playFanfare();
  particles.burstConfetti(80);
  switchScreen('screen-g1-level-complete');
  updateLockIcons(completedLevel + 1);

  document.getElementById('lc-title').textContent = `Level ${completedLevel} Unlocked! 🎉`;
  updateProtBot('cheering', `Level ${completedLevel} cleared! Awesome team!`);

  const nextNavIdx = completedLevel % 3;
  const nextReadIdx = (completedLevel + 1) % 3;
  const nextCheckIdx = (completedLevel + 2) % 3;

  document.getElementById('lc-roles-desc').textContent =
    `${g1State.roles[nextNavIdx]} is now Navigator 🧭, ${g1State.roles[nextReadIdx]} is Reader 📖, ${g1State.roles[nextCheckIdx]} is Checker ✅`;

  document.getElementById('btn-g1-next-level').onclick = () => {
    switchScreen('screen-g1-gameplay');
    loadG1Question();
  };
}

function showG1ResultsScreen(success) {
  clearInterval(g1State.timerInterval);
  audio.playFanfare();
  particles.burstFireworks(120);
  switchScreen('screen-g1-results');

  const usedSeconds = 600 - g1State.timeRemaining;
  const mins = Math.floor(usedSeconds / 60);
  const secs = usedSeconds % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  document.getElementById('g1-results-title').textContent = success ? 'Escape Successful! 🎉' : "Time's Up! Great Teamwork! 👏";
  document.getElementById('res-coins').textContent = g1State.score;
  document.getElementById('res-stars').textContent = `${g1State.resultsLog.filter(r => r.status === '✅' || r.status === '🔁').length}/9`;
  document.getElementById('res-time').textContent = timeStr;

  updateProtBot('cheering', success ? 'We escaped together! Amazing work!' : 'Great effort team!', true);

  const tbody = document.getElementById('g1-results-tbody');
  tbody.innerHTML = '';
  g1State.resultsLog.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.qNum}</td>
      <td>${r.prompt}</td>
      <td>${r.status}</td>
      <td>${r.points} pts</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ==========================================================================
   5. Game 2: Human Protractor State & SVG Protractor Engine
   ========================================================================== */

let g2State = {
  roundIndex: 0,
  timer: 30,
  timerInterval: null,
  isPaused: false,
  isRevealed: false,
  gifts: 0,
  flipped: false,
  themeLight: false,
  hideTeacherPanel: false,
  practiceMode: false,

  // Calibration offsets
  calY: 0,
  calScale: 1.0
};

function renderFullProtractorSVG(targetAngle = null) {
  const svg = document.getElementById('protractor-svg');
  if (!svg) return;

  const cx = 960;
  const cy = 880 + g2State.calY;
  const R = 720 * g2State.calScale;
  const innerR = 520 * g2State.calScale;

  // Handle Flip Horizontal Mirror Mode
  const flipFactor = g2State.flipped ? -1 : 1;

  let ticksSVG = '';
  let labelsSVG = '';

  for (let deg = 0; deg <= 180; deg++) {
    const rad = (deg * Math.PI) / 180;
    const cosVal = Math.cos(rad);
    const sinVal = Math.sin(rad);

    let tickLen = 14;
    let strokeW = 1.5;

    if (deg % 10 === 0) {
      tickLen = 32;
      strokeW = 3.5;
    } else if (deg % 5 === 0) {
      tickLen = 22;
      strokeW = 2.5;
    }

    // Outer Scale Ticks
    const x1 = cx + flipFactor * (R * cosVal);
    const y1 = cy - R * sinVal;
    const x2 = cx + flipFactor * ((R - tickLen) * cosVal);
    const y2 = cy - (R - tickLen) * sinVal;

    ticksSVG += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--prot-ticks)" stroke-width="${strokeW}"/>`;

    // Inner Scale Ticks
    const ix1 = cx + flipFactor * (innerR * cosVal);
    const iy1 = cy - innerR * sinVal;
    const ix2 = cx + flipFactor * ((innerR + tickLen) * cosVal);
    const iy2 = cy - (innerR + tickLen) * sinVal;

    ticksSVG += `<line x1="${ix1}" y1="${iy1}" x2="${ix2}" y2="${iy2}" stroke="var(--prot-ticks)" stroke-width="${strokeW}"/>`;

    // Numbers every 10 degrees
    if (deg % 10 === 0) {
      const outerNumRad = (R - 55);
      const lx = cx + flipFactor * (outerNumRad * cosVal);
      const ly = cy - outerNumRad * sinVal + 10;
      const outerDegVal = deg;

      labelsSVG += `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="28" font-weight="bold" fill="var(--prot-text)">${outerDegVal}</text>`;

      const innerNumRad = (innerR + 55);
      const ilx = cx + flipFactor * (innerNumRad * cosVal);
      const ily = cy - innerNumRad * sinVal + 10;
      const innerDegVal = 180 - deg;

      labelsSVG += `<text x="${ilx}" y="${ily}" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--sky-blue)">${innerDegVal}</text>`;
    }
  }

  // Answer Arm & Tolerance Wedge (when revealed)
  let answerOverlay = '';
  if (g2State.isRevealed && targetAngle !== null) {
    const targetRad = (targetAngle * Math.PI) / 180;
    const armLength = R + 120;
    const ax = cx + flipFactor * (armLength * Math.cos(targetRad));
    const ay = cy - armLength * Math.sin(targetRad);

    // Tolerance Wedge Zone
    const minDeg = Math.max(0, targetAngle - TOLERANCE);
    const maxDeg = Math.min(180, targetAngle + TOLERANCE);
    const minRad = (minDeg * Math.PI) / 180;
    const maxRad = (maxDeg * Math.PI) / 180;

    const wx1 = cx + flipFactor * ((R + 40) * Math.cos(minRad));
    const wy1 = cy - (R + 40) * Math.sin(minRad);
    const wx2 = cx + flipFactor * ((R + 40) * Math.cos(maxRad));
    const wy2 = cy - (R + 40) * Math.sin(maxRad);

    const largeWedgeArc = (maxDeg - minDeg) > 180 ? 1 : 0;

    answerOverlay = `
      <!-- Tolerance Zone Wedge -->
      <path d="M ${cx} ${cy} L ${wx1} ${wy1} A ${R + 40} ${R + 40} 0 ${largeWedgeArc} ${g2State.flipped ? 1 : 0} ${wx2} ${wy2} Z" fill="#ef4444" opacity="0.25"/>

      <!-- Target Arc -->
      <path d="M ${cx + flipFactor * 160} ${cy} A 160 160 0 0 ${g2State.flipped ? 1 : 0} ${cx + flipFactor * (160 * Math.cos(targetRad))} ${cy - 160 * Math.sin(targetRad)}" fill="none" stroke="#fde047" stroke-width="8"/>

      <!-- Sweeping Red Answer Arm -->
      <line x1="${cx}" y1="${cy}" x2="${ax}" y2="${ay}" stroke="#ef4444" stroke-width="12" stroke-linecap="round"/>
      <circle cx="${ax}" cy="${ay}" r="16" fill="#ef4444" stroke="#ffffff" stroke-width="4"/>

      <!-- Degree Label Callout -->
      <g transform="translate(${cx + flipFactor * ((R - 120) * Math.cos(targetRad))}, ${cy - (R - 120) * Math.sin(targetRad)})">
        <circle cx="0" cy="0" r="45" fill="#fde047" stroke="#0f172a" stroke-width="4"/>
        <text x="0" y="10" text-anchor="middle" font-size="32" font-weight="900" fill="#0f172a">${targetAngle}°</text>
      </g>
    `;
  }

  // Baseline Arm Guide (Blue line on 0° line)
  const baseLineX = cx + flipFactor * (R + 80);

  svg.innerHTML = `
    <defs>
      <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="50%" stop-color="#fde047" />
        <stop offset="100%" stop-color="#f472b6" />
      </linearGradient>
    </defs>

    <!-- Background Stars -->
    <circle cx="150" cy="120" r="3" fill="#ffffff" opacity="0.6"/>
    <circle cx="1780" cy="180" r="4" fill="#ffffff" opacity="0.6"/>
    <circle cx="960" cy="100" r="3" fill="#ffffff" opacity="0.4"/>

    <!-- Soft Acute / Obtuse Shaded Body Bands -->
    <!-- Acute Band 0 to 90 -->
    <path d="M ${cx} ${cy} L ${cx + flipFactor * R} ${cy} A ${R} ${R} 0 0 ${g2State.flipped ? 1 : 0} ${cx} ${cy - R} Z" fill="var(--prot-acute)"/>
    <!-- Obtuse Band 90 to 180 -->
    <path d="M ${cx} ${cy} L ${cx} ${cy - R} A ${R} ${R} 0 0 ${g2State.flipped ? 1 : 0} ${cx - flipFactor * R} ${cy} Z" fill="var(--prot-obtuse)"/>

    <!-- Main Semicircle Outer Outline -->
    <path d="M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy} Z" fill="var(--prot-body)" stroke="var(--prot-border)" stroke-width="8"/>
    <!-- Inner Semicircle Outline -->
    <path d="M ${cx - innerR} ${cy} A ${innerR} ${innerR} 0 0 1 ${cx + innerR} ${cy} Z" fill="none" stroke="var(--prot-border)" stroke-width="4"/>

    <!-- Ticks & Numbers -->
    ${ticksSVG}
    ${labelsSVG}

    <!-- 90 Degree Highlight Line & Right Angle Box Marker -->
    <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - R}" stroke="#fde047" stroke-width="5" stroke-dasharray="8,8"/>
    <rect x="${g2State.flipped ? cx - 30 : cx}" y="${cy - 30}" width="30" height="30" fill="none" stroke="#fde047" stroke-width="3"/>

    <!-- Horizontal Baseline Line -->
    <line x1="${cx - R - 60}" y1="${cy}" x2="${cx + R + 60}" y2="${cy}" stroke="var(--prot-ticks)" stroke-width="6"/>

    <!-- Blue Interactive Baseline Arm Guide (0° side) -->
    <line x1="${cx}" y1="${cy}" x2="${baseLineX}" y2="${cy}" stroke="#38bdf8" stroke-width="12" stroke-linecap="round"/>
    <text x="${baseLineX + (g2State.flipped ? -30 : 30)}" y="${cy + 10}" text-anchor="middle" font-size="28" font-weight="900" fill="#38bdf8">0°</text>

    <!-- Center Point Crosshair & Ring -->
    <circle cx="${cx}" cy="${cy}" r="18" fill="none" stroke="#fde047" stroke-width="5"/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="#fde047"/>
    <line x1="${cx - 30}" y1="${cy}" x2="${cx + 30}" y2="${cy}" stroke="#fde047" stroke-width="3"/>
    <line x1="${cx}" y1="${cy - 30}" x2="${cx}" y2="${cy + 30}" stroke="#fde047" stroke-width="3"/>

    <!-- Target Answer & Wedge Overlay -->
    ${answerOverlay}
  `;
}

function startG2Round() {
  g2State.isRevealed = false;
  g2State.timer = 30;
  g2State.isPaused = false;

  const targetDeg = ANGLES[g2State.roundIndex];
  document.getElementById('g2-round-tag').textContent = `Round ${g2State.roundIndex + 1} of ${ANGLES.length}`;
  document.getElementById('g2-target-text').textContent = `Make ${targetDeg}°`;

  // Practice Mode Hint
  const hintEl = document.getElementById('g2-hint-text');
  if (g2State.practiceMode) {
    let typeStr = "Acute Angle (0°-90°)";
    if (targetDeg === 90) typeStr = "Right Angle (90°)";
    else if (targetDeg > 90) typeStr = "Obtuse Angle (90°-180°)";
    hintEl.textContent = `Hint: ${typeStr}`;
    hintEl.classList.remove('hidden');
  } else {
    hintEl.classList.add('hidden');
  }

  document.getElementById('g2-eval-buttons').classList.add('hidden');
  document.getElementById('btn-g2-next-angle').style.display = 'inline-flex';

  updateProtBot('thinking', `Round ${g2State.roundIndex + 1}: Pose your arms to make ${targetDeg}°!`);
  renderFullProtractorSVG(targetDeg);

  // Get Ready 3, 2, 1 Countdown Animation
  const getReadyOverlay = document.getElementById('g2-getready-overlay');
  const getReadyText = document.getElementById('g2-getready-text');
  getReadyOverlay.classList.add('active');

  let count = 3;
  getReadyText.textContent = `Get Ready ${count}...`;
  audio.playTick();

  const getReadyInterval = setInterval(() => {
    count--;
    if (count > 0) {
      getReadyText.textContent = `${count}...`;
      audio.playTick();
    } else {
      clearInterval(getReadyInterval);
      getReadyOverlay.classList.remove('active');
      startG2Timer();
    }
  }, 900);
}

function startG2Timer() {
  clearInterval(g2State.timerInterval);
  updateG2TimerUI();

  g2State.timerInterval = setInterval(() => {
    if (g2State.isPaused || g2State.isRevealed) return;

    g2State.timer--;
    updateG2TimerUI();

    if (g2State.timer <= 5 && g2State.timer > 0) {
      audio.playTick();
    }

    if (g2State.timer <= 0) {
      clearInterval(g2State.timerInterval);
      audio.playTimeUp();
      revealG2Answer();
    }
  }, 1000);
}

function updateG2TimerUI() {
  document.getElementById('g2-timer-digits').textContent = g2State.timer;
  const ring = document.getElementById('timer-ring-path');
  const totalDash = 326.7;
  const offset = totalDash - (g2State.timer / 30) * totalDash;
  ring.style.strokeDashoffset = offset;
}

function revealG2Answer() {
  if (g2State.isRevealed) return;
  g2State.isRevealed = true;
  clearInterval(g2State.timerInterval);

  const targetDeg = ANGLES[g2State.roundIndex];
  renderFullProtractorSVG(targetDeg);

  audio.playSparkle();
  document.getElementById('g2-eval-buttons').classList.remove('hidden');

  let angleCategory = "Acute";
  if (targetDeg === 90) angleCategory = "Right Angle";
  else if (targetDeg > 90) angleCategory = "Obtuse";

  updateProtBot('cheering', `TA-DA! ${targetDeg}° is an ${angleCategory} angle! Teacher, rate the pose!`);
}

function recordG2TeacherResult(isCorrect) {
  if (isCorrect) {
    audio.playSparkle();
    audio.playCorrect();
    particles.burstConfetti(60);
    g2State.gifts++;
    document.getElementById('gift-count-display').textContent = `🎁 ${g2State.gifts}`;
    updateProtBot('cheering', 'Gift awarded! Awesome angle pose!');
  } else {
    audio.playWrong();
    updateProtBot('oops', 'Nice try! Keep practicing!');
  }

  document.getElementById('g2-eval-buttons').classList.add('hidden');
}

function advanceG2Round() {
  g2State.roundIndex++;
  if (g2State.roundIndex >= ANGLES.length) {
    showG2FinishScreen();
  } else {
    startG2Round();
  }
}

function showG2FinishScreen() {
  audio.playFanfare();
  particles.burstFireworks(100);
  switchScreen('screen-g2-finish');
  document.getElementById('g2-final-gifts').textContent = `🎁 ${g2State.gifts}`;
  updateProtBot('cheering', `Great job Protractors! You earned ${g2State.gifts} gifts!`, true);
}

/* ==========================================================================
   6. Global Screen Navigation & Keyboard Control Event Engine
   ========================================================================== */

function switchScreen(screenId) {
  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
  }
}

function setupEventListeners() {
  // Navigation
  document.getElementById('btn-home').onclick = () => {
    clearInterval(g1State.timerInterval);
    clearInterval(g2State.timerInterval);
    switchScreen('screen-home');
    updateProtBot('happy', 'Welcome to Angle Quest! Pick a game to start!');
  };

  document.getElementById('btn-mute').onclick = () => {
    const isMuted = audio.toggleMute();
    document.getElementById('mute-icon').textContent = isMuted ? '🔇' : '🔊';
    document.getElementById('mute-text').textContent = isMuted ? 'Muted' : 'Sound ON';
  };

  // Home Screen Buttons
  document.getElementById('btn-select-g1').onclick = () => {
    switchScreen('screen-g1-intro');
    updateProtBot('happy', 'Read the rules together before starting!');
  };

  document.getElementById('btn-select-g2').onclick = () => {
    switchScreen('screen-g2-start');
    updateProtBot('happy', 'Get ready to pose in front of the TV!');
  };

  // Game 1 Flow
  document.getElementById('btn-g1-start').onclick = () => {
    switchScreen('screen-g1-gameplay');
    startG1Game();
  };

  document.getElementById('btn-g1-confirm').onclick = () => confirmAnswer();
  document.getElementById('btn-g1-replay').onclick = () => {
    switchScreen('screen-g1-gameplay');
    startG1Game();
  };
  document.getElementById('btn-g1-home').onclick = () => switchScreen('screen-home');

  // Game 2 Flow
  document.getElementById('g2-practice-toggle').onchange = (e) => {
    g2State.practiceMode = e.target.checked;
  };

  document.getElementById('btn-g2-start').onclick = () => {
    g2State.roundIndex = 0;
    g2State.gifts = 0;
    document.getElementById('gift-count-display').textContent = '🎁 0';
    switchScreen('screen-g2-round');
    startG2Round();
  };

  document.getElementById('btn-g2-next-angle').onclick = () => {
    if (!g2State.isRevealed) {
      revealG2Answer();
    } else {
      advanceG2Round();
    }
  };

  document.getElementById('btn-g2-correct').onclick = () => recordG2TeacherResult(true);
  document.getElementById('btn-g2-wrong').onclick = () => recordG2TeacherResult(false);

  document.getElementById('btn-g2-replay').onclick = () => {
    g2State.roundIndex = 0;
    g2State.gifts = 0;
    document.getElementById('gift-count-display').textContent = '🎁 0';
    switchScreen('screen-g2-round');
    startG2Round();
  };
  document.getElementById('btn-g2-home').onclick = () => switchScreen('screen-home');

  // Keyboard Shortcuts for Teacher (Game 2)
  window.addEventListener('keydown', (e) => {
    const activeScreen = document.querySelector('.app-screen.active');
    if (!activeScreen || activeScreen.id !== 'screen-g2-round') return;

    if (e.code === 'Space') {
      e.preventDefault();
      if (!g2State.isRevealed) {
        revealG2Answer();
      } else {
        advanceG2Round();
      }
    } else if (e.key === 'r' || e.key === 'R') {
      revealG2Answer();
    } else if (e.key === 'p' || e.key === 'P') {
      g2State.isPaused = !g2State.isPaused;
      updateProtBot('thinking', g2State.isPaused ? 'Timer Paused ⏸️' : 'Timer Resumed ▶️');
    } else if (e.key === 'm' || e.key === 'M') {
      document.getElementById('btn-mute').click();
    } else if (e.key === 'f' || e.key === 'F') {
      g2State.flipped = !g2State.flipped;
      renderFullProtractorSVG(ANGLES[g2State.roundIndex]);
    } else if (e.key === 't' || e.key === 'T') {
      g2State.themeLight = !g2State.themeLight;
      document.body.classList.toggle('light-theme', g2State.themeLight);
      renderFullProtractorSVG(ANGLES[g2State.roundIndex]);
    } else if (e.key === 'h' || e.key === 'H') {
      g2State.hideTeacherPanel = !g2State.hideTeacherPanel;
      document.getElementById('g2-shortcuts-panel').classList.toggle('hidden', g2State.hideTeacherPanel);
    } else if (e.key === 'ArrowUp') {
      g2State.calY -= 15;
      renderFullProtractorSVG(ANGLES[g2State.roundIndex]);
    } else if (e.key === 'ArrowDown') {
      g2State.calY += 15;
      renderFullProtractorSVG(ANGLES[g2State.roundIndex]);
    } else if (e.key === '+' || e.key === '=') {
      g2State.calScale += 0.05;
      renderFullProtractorSVG(ANGLES[g2State.roundIndex]);
    } else if (e.key === '-' || e.key === '_') {
      g2State.calScale = Math.max(0.5, g2State.calScale - 0.05);
      renderFullProtractorSVG(ANGLES[g2State.roundIndex]);
    } else if (e.key === '0') {
      g2State.calY = 0;
      g2State.calScale = 1.0;
      renderFullProtractorSVG(ANGLES[g2State.roundIndex]);
    }
  });
}

// App Initialization
window.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateProtBot('happy', 'Welcome to Angle Quest! Pick a game to start!');
});
