// Angle Quest - Year 6 Primary Math Micro-teaching Web App

// Editable ANGLES array for Game 2 (Human Protractor)
const ANGLES = [90, 45, 120, 150];

// Audio Synthesizer using Web Audio API
const SoundManager = {
  ctx: null,
  isMuted: false,

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
  },

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  },

  playTick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  },

  playCorrect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.25);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  },

  playWrong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [330, 260];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0.2, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.2);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  },

  playTimeUp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.5);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }
};

window.ANGLES = ANGLES;
window.SoundManager = SoundManager;

// SVG Mathematics Renderer
const SVGRenderer = {
  polarToCartesian(cx, cy, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: cx + radius * Math.cos(angleInRadians),
      y: cy - radius * Math.sin(angleInRadians)
    };
  },

  describeArc(cx, cy, radius, startAngle, endAngle) {
    let diff = endAngle - startAngle;
    if (diff < 0) diff += 360;
    const start = this.polarToCartesian(cx, cy, radius, startAngle);
    const end = this.polarToCartesian(cx, cy, radius, endAngle);
    const largeArcFlag = diff > 180 ? '1' : '0';
    return [
      'M', start.x.toFixed(2), start.y.toFixed(2),
      'A', radius, radius, 0, largeArcFlag, 0, end.x.toFixed(2), end.y.toFixed(2)
    ].join(' ');
  },

  getDefs() {
    return `
      <defs>
        <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e88e5"/>
        </marker>
        <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#e53935"/>
        </marker>
        <marker id="arrow-dark" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#2d3748"/>
        </marker>
      </defs>
    `;
  },

  renderSingleAngle(angleDeg, isReflex = false) {
    const cx = 220;
    const cy = 200;
    const len = 140;
    const arcRadius = isReflex ? 60 : 50;

    const p0 = this.polarToCartesian(cx, cy, len, 0);
    const p1 = this.polarToCartesian(cx, cy, len, angleDeg);

    const arcPath = this.describeArc(cx, cy, arcRadius, 0, angleDeg);

    return `
      <svg viewBox="0 0 440 320" width="100%" height="260" aria-label="Angle Diagram" role="img">
        ${this.getDefs()}
        <line x1="${cx}" y1="${cy}" x2="${p0.x}" y2="${p0.y}" stroke="#1e88e5" stroke-width="6" stroke-linecap="round" marker-end="url(#arrow-blue)"/>
        <line x1="${cx}" y1="${cy}" x2="${p1.x}" y2="${p1.y}" stroke="#e53935" stroke-width="6" stroke-linecap="round" marker-end="url(#arrow-red)"/>
        <circle cx="${cx}" cy="${cy}" r="7" fill="#2d3748" />
        <path d="${arcPath}" fill="none" stroke="#f57c00" stroke-width="4" stroke-dasharray="${isReflex ? '6 4' : 'none'}"/>
      </svg>
    `;
  },

  renderStraightLineAngle(knownDeg = 110) {
    const cx = 220;
    const cy = 200;
    const len = 130;
    const arcRadius = 45;

    const leftX = cx - len;
    const rightX = cx + len;
    const rayP = this.polarToCartesian(cx, cy, len, knownDeg);

    const arc1 = this.describeArc(cx, cy, arcRadius, 0, knownDeg);
    const arc2 = this.describeArc(cx, cy, arcRadius, knownDeg, 180);

    const label1Pos = this.polarToCartesian(cx, cy, arcRadius + 25, knownDeg / 2);
    const label2Pos = this.polarToCartesian(cx, cy, arcRadius + 25, knownDeg + (180 - knownDeg) / 2);

    return `
      <svg viewBox="0 0 440 300" width="100%" height="260" aria-label="Angles on a Straight Line" role="img">
        ${this.getDefs()}
        <line x1="${leftX}" y1="${cy}" x2="${rightX}" y2="${cy}" stroke="#1e88e5" stroke-width="6" stroke-linecap="round"/>
        <line x1="${cx}" y1="${cy}" x2="${rayP.x}" y2="${rayP.y}" stroke="#e53935" stroke-width="6" stroke-linecap="round" marker-end="url(#arrow-red)"/>
        <circle cx="${cx}" cy="${cy}" r="6" fill="#2d3748" />
        <path d="${arc1}" fill="none" stroke="#2e7d32" stroke-width="4"/>
        <path d="${arc2}" fill="none" stroke="#f57c00" stroke-width="4"/>
        <text x="${label1Pos.x}" y="${label1Pos.y}" font-size="26" font-weight="bold" fill="#2e7d32" text-anchor="middle" dominant-baseline="central">${knownDeg}°</text>
        <text x="${label2Pos.x}" y="${label2Pos.y}" font-size="32" font-weight="bold" fill="#e53935" text-anchor="middle" dominant-baseline="central">x</text>
      </svg>
    `;
  },

  renderAroundPointAngle(deg1 = 100, deg2 = 120) {
    const cx = 220;
    const cy = 160;
    const len = 110;
    const r = 40;

    const angle1 = 0;
    const angle2 = deg1;
    const angle3 = deg1 + deg2;

    const p1 = this.polarToCartesian(cx, cy, len, angle1);
    const p2 = this.polarToCartesian(cx, cy, len, angle2);
    const p3 = this.polarToCartesian(cx, cy, len, angle3);

    const arc1 = this.describeArc(cx, cy, r, angle1, angle2);
    const arc2 = this.describeArc(cx, cy, r, angle2, angle3);
    const arc3 = this.describeArc(cx, cy, r, angle3, 360);

    const lbl1 = this.polarToCartesian(cx, cy, r + 24, (angle1 + angle2) / 2);
    const lbl2 = this.polarToCartesian(cx, cy, r + 24, (angle2 + angle3) / 2);
    const lbl3 = this.polarToCartesian(cx, cy, r + 24, (angle3 + 360) / 2);

    return `
      <svg viewBox="0 0 440 320" width="100%" height="260" aria-label="Angles Around a Point" role="img">
        ${this.getDefs()}
        <line x1="${cx}" y1="${cy}" x2="${p1.x}" y2="${p1.y}" stroke="#1e88e5" stroke-width="5" stroke-linecap="round"/>
        <line x1="${cx}" y1="${cy}" x2="${p2.x}" y2="${p2.y}" stroke="#1e88e5" stroke-width="5" stroke-linecap="round"/>
        <line x1="${cx}" y1="${cy}" x2="${p3.x}" y2="${p3.y}" stroke="#1e88e5" stroke-width="5" stroke-linecap="round"/>
        <circle cx="${cx}" cy="${cy}" r="6" fill="#2d3748"/>

        <path d="${arc1}" fill="none" stroke="#2e7d32" stroke-width="4"/>
        <path d="${arc2}" fill="none" stroke="#0288d1" stroke-width="4"/>
        <path d="${arc3}" fill="none" stroke="#e53935" stroke-width="4"/>

        <text x="${lbl1.x}" y="${lbl1.y}" font-size="24" font-weight="bold" fill="#2e7d32" text-anchor="middle" dominant-baseline="central">${deg1}°</text>
        <text x="${lbl2.x}" y="${lbl2.y}" font-size="24" font-weight="bold" fill="#0288d1" text-anchor="middle" dominant-baseline="central">${deg2}°</text>
        <text x="${lbl3.x}" y="${lbl3.y}" font-size="30" font-weight="bold" fill="#e53935" text-anchor="middle" dominant-baseline="central">x</text>
      </svg>
    `;
  },

  renderTriangleAngle(deg1 = 50, deg2 = 60) {
    const A = { x: 70, y: 240 };
    const B = { x: 370, y: 240 };
    const C = { x: 210, y: 70 };

    return `
      <svg viewBox="0 0 440 300" width="100%" height="260" aria-label="Angles in a Triangle" role="img">
        <polygon points="${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}" fill="#e3f2fd" stroke="#1e88e5" stroke-width="5" stroke-linejoin="round"/>

        <path d="M 110 240 A 40 40 0 0 0 94.5 205" fill="none" stroke="#2e7d32" stroke-width="4"/>
        <text x="125" y="215" font-size="24" font-weight="bold" fill="#2e7d32">${deg1}°</text>

        <path d="M 330 240 A 40 40 0 0 1 345.5 205" fill="none" stroke="#0288d1" stroke-width="4"/>
        <text x="315" y="215" font-size="24" font-weight="bold" fill="#0288d1">${deg2}°</text>

        <path d="M 185 96 A 35 35 0 0 0 235 96" fill="none" stroke="#e53935" stroke-width="4"/>
        <text x="210" y="125" font-size="32" font-weight="bold" fill="#e53935" text-anchor="middle">x</text>
      </svg>
    `;
  },

  renderQuadrilateralAngle() {
    const p1 = { x: 80, y: 220 };
    const p2 = { x: 340, y: 220 };
    const p3 = { x: 300, y: 80 };
    const p4 = { x: 100, y: 80 };

    return `
      <svg viewBox="0 0 440 290" width="100%" height="250" aria-label="Angles in a Quadrilateral" role="img">
        <polygon points="${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}" fill="#fff3e0" stroke="#f57c00" stroke-width="5" stroke-linejoin="round"/>
        <rect x="80" y="195" width="25" height="25" fill="none" stroke="#2e7d32" stroke-width="3"/>
        <text x="120" y="195" font-size="22" font-weight="bold" fill="#2e7d32">90°</text>
        <text x="300" y="195" font-size="22" font-weight="bold" fill="#0288d1">80°</text>
        <text x="260" y="115" font-size="22" font-weight="bold" fill="#7b1fa2">100°</text>
        <text x="135" y="115" font-size="30" font-weight="bold" fill="#e53935">x</text>
      </svg>
    `;
  },

  renderPentagonTriangles() {
    const cx = 220, cy = 150, r = 110;
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const angle = -90 + i * 72;
      pts.push(this.polarToCartesian(cx, cy, r, angle));
    }

    const polyPoints = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    return `
      <svg viewBox="0 0 440 290" width="100%" height="250" aria-label="Pentagon Split into 3 Triangles" role="img">
        <polygon points="${polyPoints}" fill="#e8f5e9" stroke="#2e7d32" stroke-width="5" stroke-linejoin="round"/>
        <line x1="${pts[0].x}" y1="${pts[0].y}" x2="${pts[2].x}" y2="${pts[2].y}" stroke="#1e88e5" stroke-width="4" stroke-dasharray="8 6"/>
        <line x1="${pts[0].x}" y1="${pts[0].y}" x2="${pts[3].x}" y2="${pts[3].y}" stroke="#1e88e5" stroke-width="4" stroke-dasharray="8 6"/>

        <text x="160" y="140" font-size="26" font-weight="bold" fill="#1e88e5" text-anchor="middle">Δ 1</text>
        <text x="220" y="180" font-size="26" font-weight="bold" fill="#1e88e5" text-anchor="middle">Δ 2</text>
        <text x="280" y="140" font-size="26" font-weight="bold" fill="#1e88e5" text-anchor="middle">Δ 3</text>
      </svg>
    `;
  },

  renderHexagonAngle() {
    const cx = 220, cy = 145, r = 105;
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const angle = i * 60;
      pts.push(this.polarToCartesian(cx, cy, r, angle));
    }
    const polyPoints = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    return `
      <svg viewBox="0 0 440 290" width="100%" height="250" aria-label="Regular Hexagon Interior Angle" role="img">
        <polygon points="${polyPoints}" fill="#f3e5f5" stroke="#7b1fa2" stroke-width="5" stroke-linejoin="round"/>
        <circle cx="${pts[1].x}" cy="${pts[1].y}" r="6" fill="#e53935"/>
        <text x="${pts[1].x - 35}" y="${pts[1].y + 10}" font-size="30" font-weight="bold" fill="#e53935">x</text>
        <text x="220" y="150" font-size="24" font-weight="bold" fill="#7b1fa2" text-anchor="middle">Sum = 720°</text>
      </svg>
    `;
  },

  renderProtractorReveal(deg, classification) {
    const cx = 220;
    const cy = 200;
    const len = 150;
    const arcRadius = 60;

    const p0 = this.polarToCartesian(cx, cy, len, 0);
    const p1 = this.polarToCartesian(cx, cy, len, deg);

    const arcPath = this.describeArc(cx, cy, arcRadius, 0, deg);
    const lblPos = this.polarToCartesian(cx, cy, arcRadius + 35, deg / 2);

    return `
      <svg viewBox="0 0 440 320" width="100%" height="280" aria-label="Human Protractor Reveal Diagram" role="img">
        ${this.getDefs()}
        <line x1="${cx}" y1="${cy}" x2="${p0.x}" y2="${p0.y}" stroke="#1e88e5" stroke-width="8" stroke-linecap="round" marker-end="url(#arrow-blue)"/>
        <line x1="${cx}" y1="${cy}" x2="${p1.x}" y2="${p1.y}" stroke="#e53935" stroke-width="8" stroke-linecap="round" marker-end="url(#arrow-red)"/>
        <circle cx="${cx}" cy="${cy}" r="8" fill="#2d3748"/>
        <path d="${arcPath}" fill="none" stroke="#f57c00" stroke-width="5"/>
        <text x="${lblPos.x}" y="${lblPos.y}" font-size="36" font-weight="bold" fill="#f57c00" text-anchor="middle" dominant-baseline="central">${deg}°</text>
        <text x="220" y="295" font-size="28" font-weight="bold" fill="#2d3748" text-anchor="middle">${classification} Angle</text>
      </svg>
    `;
  }
};

window.SVGRenderer = SVGRenderer;

// QUESTIONS DATASET (Game 1)
const ESCAPE_QUESTIONS = [
  {
    id: 1,
    level: 1,
    title: "Question 1 of 9",
    question: "What type of angle is this 40° angle?",
    options: ["Acute", "Right", "Obtuse", "Reflex"],
    answer: "Acute",
    renderSVG: () => SVGRenderer.renderSingleAngle(40, false),
    explanation: "An acute angle is smaller than 90°."
  },
  {
    id: 2,
    level: 1,
    title: "Question 2 of 9",
    question: "What type of angle is this 125° angle?",
    options: ["Acute", "Right", "Obtuse", "Reflex"],
    answer: "Obtuse",
    renderSVG: () => SVGRenderer.renderSingleAngle(125, false),
    explanation: "An obtuse angle is between 90° and 180°."
  },
  {
    id: 3,
    level: 1,
    title: "Question 3 of 9",
    question: "What type of angle is this 250° angle?",
    options: ["Acute", "Right", "Obtuse", "Reflex"],
    answer: "Reflex",
    renderSVG: () => SVGRenderer.renderSingleAngle(250, true),
    explanation: "A reflex angle is greater than 180° but less than 360°."
  },
  {
    id: 4,
    level: 2,
    title: "Question 4 of 9",
    question: "Two angles on a straight line are 110° and x. Find x.",
    options: ["70°", "110°", "80°", "250°"],
    answer: "70°",
    renderSVG: () => SVGRenderer.renderStraightLineAngle(110),
    explanation: "Angles on a straight line add up to 180°. (180° - 110° = 70°)"
  },
  {
    id: 5,
    level: 2,
    title: "Question 5 of 9",
    question: "Three angles around a point are 100°, 120° and x. Find x.",
    options: ["140°", "40°", "160°", "220°"],
    answer: "140°",
    renderSVG: () => SVGRenderer.renderAroundPointAngle(100, 120),
    explanation: "Angles around a point add up to 360°. (360° - 100° - 120° = 140°)"
  },
  {
    id: 6,
    level: 2,
    title: "Question 6 of 9",
    question: "A triangle has angles 50°, 60° and x. Find x.",
    options: ["70°", "110°", "80°", "250°"],
    answer: "70°",
    renderSVG: () => SVGRenderer.renderTriangleAngle(50, 60),
    explanation: "Angles in a triangle add up to 180°. (180° - 50° - 60° = 70°)"
  },
  {
    id: 7,
    level: 3,
    title: "Question 7 of 9",
    question: "A quadrilateral has angles 90°, 80°, 100° and x. Find x.",
    options: ["90°", "270°", "180°", "100°"],
    answer: "90°",
    renderSVG: () => SVGRenderer.renderQuadrilateralAngle(),
    explanation: "Angles in a quadrilateral add up to 360°. (360° - 270° = 90°)"
  },
  {
    id: 8,
    level: 3,
    title: "Question 8 of 9",
    question: "A pentagon can be split into 3 triangles. What is the sum of its interior angles?",
    options: ["540°", "360°", "180°", "720°"],
    answer: "540°",
    renderSVG: () => SVGRenderer.renderPentagonTriangles(),
    explanation: "3 triangles × 180° = 540°. Sum of interior angles of a pentagon is 540°."
  },
  {
    id: 9,
    level: 3,
    title: "Question 9 of 9",
    question: "A regular hexagon has a sum of interior angles of 720°. What is the size of ONE interior angle?",
    options: ["120°", "60°", "100°", "180°"],
    answer: "120°",
    renderSVG: () => SVGRenderer.renderHexagonAngle(),
    explanation: "720° divided by 6 sides equals 120°."
  }
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// GAME 1 ESCAPE ROOM MANAGER STATE
const EscapeRoomGame = {
  currentQuestionIndex: 0,
  score: 0,
  levelScores: [0, 0, 0],
  timerSeconds: 600,
  timerInterval: null,
  isPaused: false,
  shuffledQuestions: [],
  questionAttempts: {},
  questionResults: [],
  selectedOption: null,

  getRolesForLevel(level) {
    if (level === 1) {
      return { navigator: "Pupil 1", reader: "Pupil 2", checker: "Pupil 3" };
    } else if (level === 2) {
      return { navigator: "Pupil 2", reader: "Pupil 3", checker: "Pupil 1" };
    } else {
      return { navigator: "Pupil 3", reader: "Pupil 1", checker: "Pupil 2" };
    }
  },

  startNewGame() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.levelScores = [0, 0, 0];
    this.timerSeconds = 600;
    this.questionAttempts = {};
    this.questionResults = [];
    this.selectedOption = null;

    this.shuffledQuestions = ESCAPE_QUESTIONS.map(q => ({
      ...q,
      shuffledOptions: shuffleArray(q.options)
    }));

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.isPaused && this.timerSeconds > 0) {
        this.timerSeconds--;
        if (this.timerSeconds === 0) {
          clearInterval(this.timerInterval);
          SoundManager.playTimeUp();
          if (window.App && window.App.showEscapeResults) {
            window.App.showEscapeResults(true);
          }
        } else {
          if (window.App && window.App.updateEscapeTimerUI) {
            window.App.updateEscapeTimerUI();
          }
        }
      }
    }, 1000);
  },

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  getFormattedTime() {
    const mins = Math.floor(this.timerSeconds / 60);
    const secs = this.timerSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  getTimerClass() {
    if (this.timerSeconds <= 60) return "timer-danger";
    if (this.timerSeconds <= 120) return "timer-warning";
    return "timer-normal";
  }
};

// GAME 2 HUMAN PROTRACTOR MANAGER STATE
const HumanProtractorGame = {
  currentRound: 0,
  giftsCount: 0,
  timerSeconds: 30,
  timerInterval: null,
  isPaused: false,
  isRevealed: false,
  practiceMode: false,

  getAngleClassification(deg) {
    if (deg < 90) return "Acute";
    if (deg === 90) return "Right";
    if (deg < 180) return "Obtuse";
    return "Reflex";
  },

  startNewGame() {
    this.currentRound = 0;
    this.giftsCount = 0;
    this.isRevealed = false;
    this.isPaused = false;
    this.startRound(0);
  },

  startRound(roundIdx) {
    this.currentRound = roundIdx;
    this.timerSeconds = 30;
    this.isRevealed = false;
    this.isPaused = false;

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.isPaused && !this.isRevealed && this.timerSeconds > 0) {
        this.timerSeconds--;
        if (this.timerSeconds <= 5 && this.timerSeconds > 0) {
          SoundManager.playTick();
        }
        if (this.timerSeconds === 0) {
          clearInterval(this.timerInterval);
          this.revealAnswer();
        }
        if (window.App && window.App.updateProtractorTimerUI) {
          window.App.updateProtractorTimerUI();
        }
      }
    }, 1000);
  },

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  },

  revealAnswer() {
    if (this.isRevealed) return;
    this.isRevealed = true;
    this.stopTimer();
    SoundManager.playTimeUp();
    if (window.App && window.App.renderProtractorScreen) {
      window.App.renderProtractorScreen();
    }
  }
};

// APPLICATION UI CONTROLLER
const App = {
  currentView: 'home', // 'home', 'escape-intro', 'escape-question', 'escape-level-complete', 'escape-results', 'protractor-start', 'protractor-round', 'protractor-finish'
  showVerbalPromptModal: false,
  feedbackState: null, // { isCorrect, explanation, canRetry }

  init() {
    this.bindKeyboardShortcuts();
    this.render();
  },

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Shortcuts for Game 2 (Human Protractor)
      if (this.currentView === 'protractor-round') {
        const key = e.key.toUpperCase();
        if (e.code === 'Space') {
          e.preventDefault();
          if (HumanProtractorGame.isRevealed) {
            this.handleProtractorNextRound();
          }
        } else if (key === 'R') {
          e.preventDefault();
          if (!HumanProtractorGame.isRevealed) {
            HumanProtractorGame.revealAnswer();
          }
        } else if (key === 'P') {
          e.preventDefault();
          const paused = HumanProtractorGame.togglePause();
          this.updateProtractorTimerUI();
        } else if (key === 'M') {
          e.preventDefault();
          this.handleToggleMute();
        }
      } else if (this.currentView === 'protractor-start' && e.code === 'Space') {
        e.preventDefault();
        this.startProtractorGame();
      }
    });
  },

  handleToggleMute() {
    SoundManager.toggleMute();
    this.renderNavActions();
  },

  triggerConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    const colors = ['#1e88e5', '#e53935', '#2e7d32', '#f57c00', '#7b1fa2'];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDelay = Math.random() * 0.5 + 's';
      p.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
      container.appendChild(p);
    }
    document.body.appendChild(container);
    setTimeout(() => {
      container.remove();
    }, 3000);
  },

  // Main Render Router
  render() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    let html = `
      <header class="navbar">
        <h1 class="nav-title" onclick="App.showHome()" style="cursor:pointer">Angle Quest 🎯</h1>
        <div class="nav-actions" id="nav-actions">
          ${this.renderNavActionsHTML()}
        </div>
      </header>
      <main class="container">
    `;

    switch (this.currentView) {
      case 'home':
        html += this.renderHomeHTML();
        break;
      case 'escape-intro':
        html += this.renderEscapeIntroHTML();
        break;
      case 'escape-question':
        html += this.renderEscapeQuestionHTML();
        break;
      case 'escape-level-complete':
        html += this.renderEscapeLevelCompleteHTML();
        break;
      case 'escape-results':
        html += this.renderEscapeResultsHTML();
        break;
      case 'protractor-start':
        html += this.renderProtractorStartHTML();
        break;
      case 'protractor-round':
        html += this.renderProtractorRoundHTML();
        break;
      case 'protractor-finish':
        html += this.renderProtractorFinishHTML();
        break;
      default:
        html += this.renderHomeHTML();
    }

    html += `</main>`;
    appEl.innerHTML = html;
  },

  renderNavActionsHTML() {
    const muteIcon = SoundManager.isMuted ? "🔇 Unmute" : "🔊 Mute";
    let homeBtn = "";
    if (this.currentView !== 'home') {
      homeBtn = `<button class="btn btn-outline" onclick="App.showHome()">🏠 Home</button>`;
    }
    return `
      ${homeBtn}
      <button class="btn btn-outline" onclick="App.handleToggleMute()">${muteIcon}</button>
    `;
  },

  renderNavActions() {
    const el = document.getElementById('nav-actions');
    if (el) el.innerHTML = this.renderNavActionsHTML();
  },

  showHome() {
    EscapeRoomGame.stopTimer();
    HumanProtractorGame.stopTimer();
    this.currentView = 'home';
    this.render();
  },

  // HOME SCREEN
  renderHomeHTML() {
    return `
      <div class="home-screen">
        <h2 class="home-title">Angle Quest 🎯</h2>
        <p class="home-subtitle">Year 6 Primary Mathematics Micro-Teaching Lesson</p>

        <div class="game-card-grid">
          <div class="game-card">
            <div>
              <div class="game-card-icon">🔒</div>
              <div class="game-card-title">Game 1: Angle Escape Room</div>
              <div class="game-card-desc">10 minutes • Tablet Activity • 3 Pupils Teamwork<br>Solve 9 questions to open 3 locks together!</div>
            </div>
            <button class="btn btn-primary btn-large" onclick="App.startEscapeIntro()">Play Escape Room</button>
          </div>

          <div class="game-card">
            <div>
              <div class="game-card-icon">🙋‍♂️</div>
              <div class="game-card-title">Game 2: Human Protractor</div>
              <div class="game-card-desc">5 minutes • Whole Class Activity • Teacher Controlled<br>Make angles using your body in front of the TV!</div>
            </div>
            <button class="btn btn-primary btn-large" onclick="App.showProtractorStart()">Play Human Protractor</button>
          </div>
        </div>
      </div>
    `;
  },

  // GAME 1: ESCAPE ROOM INTRO
  startEscapeIntro() {
    this.currentView = 'escape-intro';
    this.render();
  },

  renderEscapeIntroHTML() {
    return `
      <div class="protractor-layout">
        <h2 style="font-size: 52px; color: var(--primary-blue); margin-bottom: 24px;">🔒 Angle Escape Room (10 Minutes)</h2>
        <p style="font-size: 32px; font-weight: 700; margin-bottom: 28px;">
          Team up with 3 pupils on 1 tablet to unlock 3 level locks within 10 minutes!
        </p>

        <div class="roles-banner" style="flex-direction: column; gap: 16px; text-align: left; margin-bottom: 36px;">
          <div class="role-tag"><strong>Rule:</strong> "No answer is submitted until all 3 pupils agree!"</div>
          <div class="role-tag">🧭 <strong>Navigator:</strong> Taps the option on the tablet screen.</div>
          <div class="role-tag">📖 <strong>Reader:</strong> Reads the question and options aloud.</div>
          <div class="role-tag">✅ <strong>Checker:</strong> Says "We agree!" and confirms submission.</div>
        </div>

        <p style="font-size: 26px; color: var(--text-muted); margin-bottom: 32px;">
          Roles rotate automatically every level!
        </p>

        <button class="btn btn-success btn-large" onclick="App.startEscapeGame()">🚀 Start Escape Room</button>
      </div>
    `;
  },

  startEscapeGame() {
    EscapeRoomGame.startNewGame();
    this.feedbackState = null;
    this.showVerbalPromptModal = false;
    this.currentView = 'escape-question';
    this.render();
  },

  updateEscapeTimerUI() {
    const timerEl = document.getElementById('escape-timer-display');
    if (timerEl) {
      timerEl.textContent = `⏱️ ${EscapeRoomGame.getFormattedTime()}`;
      timerEl.className = `timer-box ${EscapeRoomGame.getTimerClass()}`;
    }
  },

  renderEscapeQuestionHTML() {
    const q = EscapeRoomGame.shuffledQuestions[EscapeRoomGame.currentQuestionIndex];
    const level = q.level;
    const roles = EscapeRoomGame.getRolesForLevel(level);

    // Locks UI status
    const l1Status = level > 1 ? '🔓 Level 1' : (level === 1 ? '🔒 Level 1' : '🔒 Level 1');
    const l2Status = level > 2 ? '🔓 Level 2' : (level === 2 ? '🔒 Level 2' : '🔒 Level 2');
    const l3Status = level === 3 ? '🔒 Level 3' : '🔒 Level 3';

    const selectedOpt = EscapeRoomGame.selectedOption;
    const isFeedbackShown = !!this.feedbackState;

    return `
      <div>
        <div class="escape-status-bar">
          <div class="locks-progress">
            <span class="lock-item ${level === 1 ? 'active' : (level > 1 ? 'unlocked' : '')}">${l1Status}</span>
            <span class="lock-item ${level === 2 ? 'active' : (level > 2 ? 'unlocked' : '')}">${l2Status}</span>
            <span class="lock-item ${level === 3 ? 'active' : ''}">${l3Status}</span>
          </div>
          <div style="font-weight: 800; font-size: 32px;">${q.title}</div>
          <div id="escape-timer-display" class="timer-box ${EscapeRoomGame.getTimerClass()}">⏱️ ${EscapeRoomGame.getFormattedTime()}</div>
        </div>

        <div class="roles-banner">
          <span>🧭 Navigator: <strong>${roles.navigator}</strong></span>
          <span>📖 Reader: <strong>${roles.reader}</strong></span>
          <span>✅ Checker: <strong>${roles.checker}</strong></span>
        </div>

        <div class="question-layout">
          <div>
            <div class="question-prompt">${q.question}</div>
            ${q.renderSVG()}
          </div>

          <div>
            <div class="options-grid">
              ${q.shuffledOptions.map(opt => {
                let btnClass = "option-btn";
                if (selectedOpt === opt) btnClass += " selected";
                if (isFeedbackShown && opt === q.answer) btnClass += " correct";
                if (isFeedbackShown && selectedOpt === opt && !this.feedbackState.isCorrect) btnClass += " wrong";
                return `
                  <button class="${btnClass}" ${isFeedbackShown ? 'disabled' : ''} onclick="App.handleSelectOption('${opt}')">
                    ${opt}
                  </button>
                `;
              }).join('')}
            </div>

            ${!isFeedbackShown ? `
              <div class="confirm-box">
                <button class="btn btn-success btn-large" style="width: 100%;" ${!selectedOpt ? 'disabled' : ''} onclick="App.handleConfirmAgreement()">
                  ✅ We all agree (Checker confirm)
                </button>
              </div>
            ` : ''}

            ${isFeedbackShown ? `
              <div class="feedback-banner ${this.feedbackState.isCorrect ? 'correct' : 'wrong'}">
                <p style="margin: 0 0 12px 0;">${this.feedbackState.isCorrect ? '🎉 Correct!' : '❌ Not quite right!'}</p>
                <p style="font-size: 24px; font-weight: normal; margin: 0 0 16px 0;">${this.feedbackState.explanation}</p>
                ${this.feedbackState.canRetry ? `
                  <button class="btn btn-warning" onclick="App.handleRetryQuestion()">🔁 Try Again (1 retry left)</button>
                ` : `
                  <button class="btn btn-primary" onclick="App.handleNextQuestion()">Next ➡️</button>
                `}
              </div>
            ` : ''}
          </div>
        </div>

        ${this.showVerbalPromptModal ? this.renderVerbalPromptModalHTML(roles.reader) : ''}
      </div>
    `;
  },

  handleSelectOption(opt) {
    if (this.feedbackState) return;
    SoundManager.playTick();
    EscapeRoomGame.selectedOption = opt;
    this.render();
  },

  handleConfirmAgreement() {
    if (!EscapeRoomGame.selectedOption || this.feedbackState) return;

    const q = EscapeRoomGame.shuffledQuestions[EscapeRoomGame.currentQuestionIndex];
    const isCorrect = (EscapeRoomGame.selectedOption === q.answer);
    const attempts = EscapeRoomGame.questionAttempts[q.id] || 0;

    if (isCorrect) {
      SoundManager.playCorrect();
      const points = (attempts === 0) ? 2 : 1;
      EscapeRoomGame.score += points;
      EscapeRoomGame.levelScores[q.level - 1] += points;

      EscapeRoomGame.questionResults.push({
        id: q.id,
        level: q.level,
        question: q.question,
        isCorrect: true,
        retried: (attempts === 1)
      });

      this.feedbackState = {
        isCorrect: true,
        explanation: q.explanation,
        canRetry: false
      };

      // Check if Level 3 question requires verbal prompt
      if (q.level === 3) {
        this.showVerbalPromptModal = true;
      }
    } else {
      SoundManager.playWrong();
      if (attempts === 0) {
        // Allow 1 retry
        EscapeRoomGame.questionAttempts[q.id] = 1;
        this.feedbackState = {
          isCorrect: false,
          explanation: `Gentle hint: ${q.explanation}`,
          canRetry: true
        };
      } else {
        // Out of retries
        EscapeRoomGame.questionResults.push({
          id: q.id,
          level: q.level,
          question: q.question,
          isCorrect: false,
          retried: true
        });

        this.feedbackState = {
          isCorrect: false,
          explanation: `The correct answer was ${q.answer}. ${q.explanation}`,
          canRetry: false
        };
      }
    }

    this.render();
  },

  handleRetryQuestion() {
    this.feedbackState = null;
    EscapeRoomGame.selectedOption = null;
    this.render();
  },

  handleNextQuestion() {
    this.feedbackState = null;
    EscapeRoomGame.selectedOption = null;

    const currentQ = EscapeRoomGame.shuffledQuestions[EscapeRoomGame.currentQuestionIndex];
    const currentLevel = currentQ.level;

    EscapeRoomGame.currentQuestionIndex++;

    if (EscapeRoomGame.currentQuestionIndex < EscapeRoomGame.shuffledQuestions.length) {
      const nextQ = EscapeRoomGame.shuffledQuestions[EscapeRoomGame.currentQuestionIndex];
      if (nextQ.level > currentLevel) {
        // Level completed! Show Level Complete Transition
        this.currentView = 'escape-level-complete';
      } else {
        this.currentView = 'escape-question';
      }
    } else {
      // Finished all 9 questions!
      this.showEscapeResults(false);
      return;
    }

    this.render();
  },

  renderVerbalPromptModalHTML(readerName) {
    return `
      <div class="modal-overlay">
        <div class="modal-card">
          <div class="modal-title">🗣️ Verbal Explanation Time!</div>
          <div class="modal-body">
            <strong>${readerName} (Reader):</strong> Say <em>"because..."</em> and explain your answer aloud to your group!
          </div>
          <button class="btn btn-success btn-large" onclick="App.confirmVerbalExplanation()">🗣️ We explained it!</button>
        </div>
      </div>
    `;
  },

  confirmVerbalExplanation() {
    SoundManager.playCorrect();
    this.showVerbalPromptModal = false;
    this.render();
  },

  // LEVEL COMPLETE SCREEN
  renderEscapeLevelCompleteHTML() {
    const currentQ = EscapeRoomGame.shuffledQuestions[EscapeRoomGame.currentQuestionIndex];
    const completedLevel = currentQ.level - 1; // finished level
    const newRoles = EscapeRoomGame.getRolesForLevel(currentQ.level);

    const levelScore = EscapeRoomGame.levelScores[completedLevel - 1]; // max 6
    let stars = "⭐";
    if (levelScore >= 5) stars = "⭐⭐⭐";
    else if (levelScore >= 3) stars = "⭐⭐";

    return `
      <div class="protractor-layout">
        <div style="font-size: 80px; margin-bottom: 12px;">🔓</div>
        <h2 style="font-size: 52px; color: var(--success-green); margin-bottom: 16px;">
          Lock ${completedLevel} Unlocked!
        </h2>
        <div style="font-size: 48px; margin-bottom: 24px;">${stars}</div>
        <p style="font-size: 32px; font-weight: 700; margin-bottom: 32px;">
          Level ${completedLevel} Score: ${levelScore} / 6 points
        </p>

        <div class="roles-banner" style="margin-bottom: 36px;">
          <div><strong>New Level ${currentQ.level} Roles:</strong></div>
          <div>🧭 Navigator: <strong>${newRoles.navigator}</strong></div>
          <div>📖 Reader: <strong>${newRoles.reader}</strong></div>
          <div>✅ Checker: <strong>${newRoles.checker}</strong></div>
        </div>

        <button class="btn btn-primary btn-large" onclick="App.continueToNextLevel()">Continue to Level ${currentQ.level} ➡️</button>
      </div>
    `;
  },

  continueToNextLevel() {
    this.currentView = 'escape-question';
    this.render();
  },

  // ESCAPE RESULTS SCREEN
  showEscapeResults(isTimeUp = false) {
    EscapeRoomGame.stopTimer();
    this.isEscapeTimeUp = isTimeUp;
    this.currentView = 'escape-results';
    this.render();
  },

  renderEscapeResultsHTML() {
    const totalScore = EscapeRoomGame.score; // max 18
    const timeRemaining = EscapeRoomGame.timerSeconds;
    const timeUsedSecs = 600 - timeRemaining;
    const minsUsed = Math.floor(timeUsedSecs / 60);
    const secsUsed = timeUsedSecs % 60;
    const timeUsedStr = `${minsUsed}m ${secsUsed}s`;

    let stars = "⭐";
    if (totalScore >= 15) stars = "⭐⭐⭐";
    else if (totalScore >= 9) stars = "⭐⭐";

    const titleText = this.isEscapeTimeUp ? "⏰ Time's up! Great teamwork!" : "🎉 Escape Successful!";

    return `
      <div class="protractor-layout">
        <h2 style="font-size: 56px; color: var(--primary-blue); margin-bottom: 16px;">${titleText}</h2>
        <div style="font-size: 56px; margin-bottom: 20px;">${stars}</div>

        <div style="display: flex; justify-content: center; gap: 48px; font-size: 36px; font-weight: 800; margin-bottom: 28px;">
          <div>Total Score: <span style="color: var(--success-green);">${totalScore} / 18</span></div>
          <div>Time Used: <span style="color: var(--primary-blue);">${timeUsedStr}</span></div>
        </div>

        <h3 style="font-size: 32px; margin-bottom: 16px;">Question Evidence Breakdown:</h3>
        <table class="results-table">
          <thead>
            <tr>
              <th>Q#</th>
              <th>Level</th>
              <th>Question</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            ${EscapeRoomGame.shuffledQuestions.map((q, idx) => {
              const res = EscapeRoomGame.questionResults.find(r => r.id === q.id);
              let icon = "❌";
              if (res) {
                if (res.isCorrect && !res.retried) icon = "✅";
                else if (res.isCorrect && res.retried) icon = "🔁 ✅";
                else icon = "❌";
              }
              return `
                <tr>
                  <td>Q${idx + 1}</td>
                  <td>Level ${q.level}</td>
                  <td style="text-align: left;">${q.question}</td>
                  <td>${icon}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <button class="btn btn-primary btn-large" style="margin-top: 24px;" onclick="App.startEscapeIntro()">🔄 Play Again</button>
      </div>
    `;
  },

  // GAME 2: HUMAN PROTRACTOR
  showProtractorStart() {
    this.currentView = 'protractor-start';
    this.render();
  },

  renderProtractorStartHTML() {
    return `
      <div class="protractor-layout">
        <h2 style="font-size: 56px; color: var(--primary-blue); margin-bottom: 24px;">🙋‍♂️ Game 2: Human Protractor</h2>
        <p style="font-size: 36px; font-weight: 800; margin-bottom: 24px;">
          Stand in front of the TV camera!
        </p>
        <p style="font-size: 30px; margin-bottom: 36px;">
          One arm is the horizontal baseline.<br>
          Move your other arm to make the target angle.<br>
          You have <strong>30 seconds</strong> for each round!
        </p>

        <div style="margin-bottom: 36px;">
          <label style="font-size: 28px; font-weight: 700; cursor: pointer;">
            <input type="checkbox" id="practice-toggle" style="width: 28px; height: 28px; vertical-align: middle; margin-right: 12px;" ${HumanProtractorGame.practiceMode ? 'checked' : ''} onchange="App.togglePracticeMode(this.checked)">
            Practice Mode (show angle type hint during countdown)
          </label>
        </div>

        <button class="btn btn-success btn-large" onclick="App.startProtractorGame()">▶️ Start Game</button>
      </div>
    `;
  },

  togglePracticeMode(val) {
    HumanProtractorGame.practiceMode = val;
  },

  startProtractorGame() {
    HumanProtractorGame.startNewGame();
    this.currentView = 'protractor-round';
    this.render();
  },

  updateProtractorTimerUI() {
    const timerEl = document.getElementById('protractor-circle-timer');
    if (timerEl) {
      timerEl.textContent = `${HumanProtractorGame.timerSeconds}s`;
      if (HumanProtractorGame.timerSeconds <= 5) {
        timerEl.style.borderColor = "var(--answer-red)";
        timerEl.style.color = "var(--answer-red)";
      } else {
        timerEl.style.borderColor = "var(--primary-blue)";
        timerEl.style.color = "var(--text-dark)";
      }
    }
  },

  renderProtractorRoundHTML() {
    const targetDeg = ANGLES[HumanProtractorGame.currentRound];
    const classification = HumanProtractorGame.getAngleClassification(targetDeg);
    const isRevealed = HumanProtractorGame.isRevealed;

    return `
      <div class="protractor-layout">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div style="font-size: 32px; font-weight: 800;">Round ${HumanProtractorGame.currentRound + 1} of ${ANGLES.length}</div>
          <div style="font-size: 32px; font-weight: 800; color: var(--warning-orange);">🎁 Gifts Given: ${HumanProtractorGame.giftsCount}</div>
        </div>

        <div class="huge-text">Make an angle of ${targetDeg}°</div>

        ${!isRevealed ? `
          <div id="protractor-circle-timer" class="circle-timer">${HumanProtractorGame.timerSeconds}s</div>
          ${HumanProtractorGame.practiceMode ? `
            <div style="font-size: 32px; font-weight: 800; color: var(--accent-purple); margin: 16px 0;">
              Hint: This is an ${classification} Angle!
            </div>
          ` : ''}
          <div style="margin-top: 28px;">
            <button class="btn btn-warning btn-large" onclick="HumanProtractorGame.revealAnswer()">🔍 Reveal Answer (R)</button>
          </div>
        ` : `
          <div style="margin: 20px 0;">
            ${SVGRenderer.renderProtractorReveal(targetDeg, classification)}
          </div>

          <div style="display: flex; justify-content: center; gap: 32px; margin-top: 28px;">
            <button class="btn btn-success btn-large" onclick="App.handleTeacherGift(true)">✅ Correct, give gift 🎁</button>
            <button class="btn btn-danger btn-large" onclick="App.handleTeacherGift(false)">❌ Not this time</button>
          </div>
        `}

        <div class="shortcuts-hint">
          <strong>Teacher Shortcuts:</strong> Space = Next Angle | R = Reveal Now | P = Pause/Resume | M = Mute
        </div>
      </div>
    `;
  },

  renderProtractorScreen() {
    this.render();
  },

  handleTeacherGift(given) {
    if (given) {
      SoundManager.playCorrect();
      HumanProtractorGame.giftsCount++;
      this.triggerConfetti();
    } else {
      SoundManager.playWrong();
    }

    this.handleProtractorNextRound();
  },

  handleProtractorNextRound() {
    if (HumanProtractorGame.currentRound + 1 < ANGLES.length) {
      HumanProtractorGame.startRound(HumanProtractorGame.currentRound + 1);
      this.currentView = 'protractor-round';
    } else {
      // Finished all rounds!
      HumanProtractorGame.stopTimer();
      this.currentView = 'protractor-finish';
    }
    this.render();
  },

  renderProtractorFinishHTML() {
    return `
      <div class="protractor-layout">
        <div style="font-size: 80px; margin-bottom: 12px;">🎉</div>
        <h2 style="font-size: 56px; color: var(--primary-blue); margin-bottom: 20px;">Great job, Protractors! 🎉</h2>

        <p style="font-size: 38px; font-weight: 800; margin-bottom: 36px;">
          Total Gifts Earned: <span style="color: var(--warning-orange);">${HumanProtractorGame.giftsCount} 🎁</span>
        </p>

        <button class="btn btn-primary btn-large" onclick="App.showProtractorStart()">🔄 Play Again</button>
      </div>
    `;
  }
};

window.App = App;

// Launch on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
