/**
 * Tech City Angle Quest - Core Game Engine (game.js)
 * Year 6 Mathematics • DSKP 6.1 Angles & Polygons
 * Single-Page Offline Web Application
 */

class GameEngine {
  constructor() {
    this.score = 0;
    this.hearts = 3;
    this.streak = 1;
    this.currentLevel = 0; // 0 = Home, 1-6 = Levels, 7 = Boss, 8 = Results
    this.stars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    this.unlockedLevels = new Set([1]);
    this.badges = new Set();

    // Audio State
    this.isMuted = false;
    this.audioCtx = null;

    // Game Mode & Team Settings
    this.mode = 'single'; // 'single' or 'team'
    this.teamCount = 2;
    this.currentTeamIndex = 0;
    this.teamScores = [0, 0, 0, 0];
    this.teamNames = ['Red Drones 🚁', 'Blue Robots 🤖', 'Green Satellites 📡', 'Yellow Rockets 🚀'];

    // Settings
    this.settings = {
      timerEnabled: true,
      difficulty: 'medium' // 'easy', 'medium', 'hard'
    };

    this.timerInterval = null;
    this.timeLeft = 180; // 3 minutes per level

    // Active Question State for Levels
    this.currentQuestion = null;
    this.questionIndex = 0;
    this.maxLevelQuestions = 5;
    this.questionsList = [];
    this.bossHealth = 100;

    // Level 4 Arm State
    this.level4ArmAngle = 45;

    // Level 5 Grid State
    this.gridState = {
      type: 'square',
      points: [],
      gridNodes: [],
      targetSides: 3,
      targetName: 'Equilateral Triangle',
      expectedAngle: 60
    };

    // Canvas Confetti Particles
    this.confettiParticles = [];
    this.confettiAnimationId = null;

    // Initialize on DOM ready or immediately if already loaded
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  // --- Engine Initialization ---
  init() {
    this.setupEventListeners();
    this.renderMapNodes();
    this.updateHeaderUI();
    this.setMascotSpeech("Welcome Tech Hero! Save Tech City by mastering angles and regular polygons!");
  }

  setupEventListeners() {
    const audioBtn = document.getElementById('btn-audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => this.toggleAudio());
    }

    const teacherBtn = document.getElementById('btn-teacher-panel');
    if (teacherBtn) {
      teacherBtn.addEventListener('click', () => this.toggleTeacherPanel(true));
    }

    // Grid Canvas Listener
    const l5Canvas = document.getElementById('level5-canvas');
    if (l5Canvas) {
      l5Canvas.addEventListener('click', (e) => this.handleGridClick(e));
    }
  }

  // --- Web Audio API Sound Synthesizer ---
  initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleAudio() {
    this.isMuted = !this.isMuted;
    const iconUse = document.getElementById('audio-icon-use');
    if (iconUse) {
      iconUse.setAttribute('href', this.isMuted ? '#icon-sound-off' : '#icon-sound-on');
    }
    this.playSound('click');
  }

  playSound(type) {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    switch (type) {
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case 'correct': {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.3, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.2);
        });
        break;
      }

      case 'wrong': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }

      case 'boss-hit': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }

      case 'fanfare': {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.4, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.3);
        });
        break;
      }
    }
  }

  // --- Confetti Particle System ---
  launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const colors = ['#FF4B91', '#FF763B', '#FFC436', '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6'];
    this.confettiParticles = [];

    for (let i = 0; i < 90; i++) {
      this.confettiParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 4 + 3,
        speedX: Math.random() * 4 - 2,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        opacity: 1
      });
    }

    if (this.confettiAnimationId) {
      cancelAnimationFrame(this.confettiAnimationId);
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      this.confettiParticles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height - 50) {
          p.opacity -= 0.02;
        }

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        this.confettiAnimationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();
  }

  // --- View Navigation & Mascot UI ---
  navigateTo(screenName) {
    this.playSound('click');
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));

    const targetScreen = document.getElementById(`screen-${screenName}`);
    if (targetScreen) {
      targetScreen.classList.add('active');
    }

    if (screenName === 'map') {
      this.renderMapNodes();
      this.stopTimer();
      this.setMascotSpeech("Select a level on the Tech City map to begin!");
    } else if (screenName === 'home') {
      this.stopTimer();
      this.setMascotSpeech("Choose your game mode and let's get started!");
    }

    this.updateHeaderUI();
  }

  setMascotSpeech(text) {
    const el = document.getElementById('mascot-speech-text');
    if (el) {
      el.innerText = text;
    }
  }

  updateHeaderUI() {
    const scoreEl = document.getElementById('stat-score');
    if (scoreEl) scoreEl.innerText = this.score;

    const streakEl = document.getElementById('stat-streak');
    if (streakEl) streakEl.innerText = `x${this.streak}`;

    const heartsContainer = document.getElementById('stat-hearts');
    if (heartsContainer) {
      heartsContainer.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const heartSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        heartSvg.setAttribute('class', `heart-icon ${i >= this.hearts ? 'lost' : ''}`);
        heartSvg.innerHTML = `<use href="#icon-heart"></use>`;
        heartsContainer.appendChild(heartSvg);
      }
    }

    const teamIndicator = document.getElementById('team-turn-indicator');
    const currentTeamName = document.getElementById('current-team-name');
    if (teamIndicator && currentTeamName) {
      if (this.mode === 'team') {
        teamIndicator.classList.remove('hidden');
        currentTeamName.innerText = this.teamNames[this.currentTeamIndex];
      } else {
        teamIndicator.classList.add('hidden');
      }
    }
  }

  selectMode(modeType) {
    this.mode = modeType;
    this.playSound('click');

    const singleBtn = document.getElementById('mode-single');
    const teamBtn = document.getElementById('mode-team');
    const teamSetup = document.getElementById('team-setup-box');

    if (singleBtn && teamBtn) {
      if (modeType === 'single') {
        singleBtn.classList.add('active');
        teamBtn.classList.remove('active');
        if (teamSetup) teamSetup.classList.add('hidden');
      } else {
        teamBtn.classList.add('active');
        singleBtn.classList.remove('active');
        if (teamSetup) teamSetup.classList.remove('hidden');
      }
    }
  }

  updateTeamCount(val) {
    this.teamCount = parseInt(val, 10);
    this.teamScores = new Array(this.teamCount).fill(0);
  }

  nextTeamTurn() {
    if (this.mode === 'team') {
      this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teamCount;
      this.updateHeaderUI();
      this.setMascotSpeech(`It's now ${this.teamNames[this.currentTeamIndex]}'s turn! 🚀`);
    }
  }

  startTimer() {
    this.stopTimer();
    if (!this.settings.timerEnabled) {
      const timerVal = document.getElementById('stat-timer');
      if (timerVal) timerVal.innerText = '∞';
      return;
    }

    this.timeLeft = 180;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();

      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.playSound('wrong');
        this.setMascotSpeech("Time's up! Let's try this question again!");
        this.handleIncorrectAnswer("Time expired!");
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimerDisplay() {
    const timerVal = document.getElementById('stat-timer');
    if (!timerVal) return;

    if (!this.settings.timerEnabled) {
      timerVal.innerText = '∞';
      return;
    }

    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    timerVal.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  handleCorrectAnswer(points = 50, customMsg = "") {
    this.playSound('correct');
    const awardedPoints = points * this.streak;
    this.score += awardedPoints;

    if (this.mode === 'team') {
      this.teamScores[this.currentTeamIndex] += awardedPoints;
    }

    this.streak = Math.min(this.streak + 1, 5);
    this.updateHeaderUI();

    const msg = customMsg || `Awesome job! +${awardedPoints} points! (Streak x${this.streak}) 🎉`;
    this.setMascotSpeech(msg);
  }

  handleIncorrectAnswer(customMsg = "") {
    this.playSound('wrong');
    this.streak = 1;
    this.hearts--;
    this.updateHeaderUI();

    const msg = customMsg || "Nice try! Let me help you fix the glitch!";
    this.setMascotSpeech(msg);

    if (this.hearts <= 0) {
      setTimeout(() => {
        alert("Out of hearts! Don't worry, let's retry the level!");
        this.hearts = 3;
        this.updateHeaderUI();
        this.navigateTo('map');
      }, 800);
    }
  }

  useHint() {
    if (this.score < 10) {
      this.setMascotSpeech("You need at least 10 points to get a hint!");
      return;
    }
    this.score -= 10;
    this.updateHeaderUI();
    this.playSound('click');

    if (this.currentQuestion && this.currentQuestion.hint) {
      this.setMascotSpeech(`💡 Hint: ${this.currentQuestion.hint}`);
    } else {
      this.setMascotSpeech("💡 Hint: Read the protractor baseline or check polygon interior angle formulas!");
    }
  }

  toggleTeacherPanel(show) {
    const modal = document.getElementById('modal-teacher');
    if (modal) {
      if (show) modal.classList.remove('hidden');
      else modal.classList.add('hidden');
    }
  }

  updateSetting(key, val) {
    this.settings[key] = val;
    this.updateTimerDisplay();
  }

  unlockAllLevels() {
    for (let i = 1; i <= 7; i++) {
      this.unlockedLevels.add(i);
    }
    this.renderMapNodes();
    this.toggleTeacherPanel(false);
    this.setMascotSpeech("All levels unlocked by Teacher settings!");
  }

  restartGame() {
    this.score = 0;
    this.hearts = 3;
    this.streak = 1;
    this.stars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    this.unlockedLevels = new Set([1]);
    this.badges.clear();
    this.teamScores = new Array(this.teamCount).fill(0);
    this.toggleTeacherPanel(false);
    this.navigateTo('home');
  }

  renderMapNodes() {
    const mapContainer = document.getElementById('tech-map-nodes');
    if (!mapContainer) return;

    mapContainer.innerHTML = '';

    const levelData = [
      { id: 1, name: '1. Robot Factory', icon: '#icon-robot', desc: 'Polygon Matching' },
      { id: 2, name: '2. Smartphone Screen', icon: '#icon-smartphone', desc: 'Angle Sorting' },
      { id: 3, name: '3. Drone Pilot', icon: '#icon-drone', desc: 'Measuring Angles' },
      { id: 4, name: '4. Code Builder', icon: '#icon-laptop', desc: 'Constructing Angles' },
      { id: 5, name: '5. Satellite Grid', icon: '#icon-satellite', desc: 'Grid Polygons' },
      { id: 6, name: '6. Spot the Glitch', icon: '#icon-smartwatch', desc: 'Error Detection' },
      { id: 7, name: '🔥 BOSS BATTLE', icon: '#icon-boss', desc: 'Mega Glitch Robot' }
    ];

    levelData.forEach(lvl => {
      const isUnlocked = this.unlockedLevels.has(lvl.id);
      const starsEarned = this.stars[lvl.id] || 0;

      const node = document.createElement('div');
      node.className = `map-node ${isUnlocked ? '' : 'locked'} ${this.currentLevel === lvl.id ? 'active-node' : ''}`;

      if (isUnlocked) {
        node.onclick = () => this.startLevel(lvl.id);
      }

      node.innerHTML = `
        <svg class="node-icon"><use href="${lvl.icon}"></use></svg>
        <div class="node-title">${lvl.name}</div>
        <div style="font-size: 13px; color: #64748B;">${lvl.desc}</div>
        <div class="node-stars">
          ${[1, 2, 3].map(st => `
            <svg class="node-star-icon" style="opacity: ${st <= starsEarned ? '1' : '0.25'}">
              <use href="#icon-star"></use>
            </svg>
          `).join('')}
        </div>
      `;

      mapContainer.appendChild(node);
    });

    const scoreboardPanel = document.getElementById('team-scoreboard-panel');
    const teamScoresList = document.getElementById('team-scores-list');
    if (scoreboardPanel && teamScoresList) {
      if (this.mode === 'team') {
        scoreboardPanel.classList.remove('hidden');
        teamScoresList.innerHTML = this.teamScores.slice(0, this.teamCount).map((score, idx) => `
          <div class="team-score-card ${idx === this.currentTeamIndex ? 'current-turn' : ''}">
            <div style="font-weight: 800; font-size: 15px;">${this.teamNames[idx]}</div>
            <div style="font-size: 22px; font-weight: 900; color: #FACC15;">${score} pts</div>
          </div>
        `).join('');
      } else {
        scoreboardPanel.classList.add('hidden');
      }
    }
  }

  startGame() {
    this.navigateTo('map');
  }

  // --- Virtual Protractor & Canvas Drawing ---
  drawProtractor(ctx, centerX, centerY, radius = 140) {
    ctx.save();
    ctx.translate(centerX, centerY);

    ctx.beginPath();
    ctx.arc(0, 0, radius, Math.PI, 0, false);
    ctx.closePath();
    ctx.fillStyle = 'rgba(224, 242, 254, 0.75)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0284C7';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-radius, 0);
    ctx.lineTo(radius, 0);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0369A1';
    ctx.stroke();

    for (let deg = 0; deg <= 180; deg += 1) {
      const rad = (deg * Math.PI) / 180;
      const isMajor = deg % 10 === 0;
      const isMedium = deg % 5 === 0;

      const outerLength = isMajor ? 15 : (isMedium ? 10 : 5);
      const innerLength = isMajor ? 12 : (isMedium ? 8 : 4);

      const x1 = Math.cos(Math.PI - rad) * radius;
      const y1 = -Math.sin(Math.PI - rad) * radius;
      const x2 = Math.cos(Math.PI - rad) * (radius - outerLength);
      const y2 = -Math.sin(Math.PI - rad) * (radius - outerLength);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = isMajor ? 2 : 1;
      ctx.strokeStyle = '#0369A1';
      ctx.stroke();

      if (isMajor) {
        const lx = Math.cos(Math.PI - rad) * (radius - 24);
        const ly = -Math.sin(Math.PI - rad) * (radius - 24);
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#0F172A';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${deg}°`, lx, ly);
      }

      if (isMajor) {
        const innerRadius = radius - 45;
        const ix1 = Math.cos(rad) * innerRadius;
        const iy1 = -Math.sin(rad) * innerRadius;
        const ix2 = Math.cos(rad) * (innerRadius - innerLength);
        const iy2 = -Math.sin(rad) * (innerRadius - innerLength);

        ctx.beginPath();
        ctx.moveTo(ix1, iy1);
        ctx.lineTo(ix2, iy2);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#BE185D';
        ctx.stroke();

        const lx = Math.cos(rad) * (innerRadius - 16);
        const ly = -Math.sin(rad) * (innerRadius - 16);
        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = '#9D174D';
        ctx.fillText(`${deg}°`, lx, ly);
      }
    }

    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#EF4444';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-15, 0); ctx.lineTo(15, 0);
    ctx.moveTo(0, -15); ctx.lineTo(0, 15);
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  drawAngleOnCanvas(ctx, originX, originY, angleDeg, rayLength = 160, isHighlighted = false) {
    ctx.save();

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + rayLength, originY);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#2563EB';
    ctx.stroke();

    const rad = (angleDeg * Math.PI) / 180;
    const rayX = originX + Math.cos(rad) * rayLength;
    const rayY = originY - Math.sin(rad) * rayLength;

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(rayX, rayY);
    ctx.lineWidth = 4;
    ctx.strokeStyle = isHighlighted ? '#10B981' : '#E11D48';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(originX, originY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#1E1B4B';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(originX, originY, 45, 0, -rad, true);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#F59E0B';
    ctx.stroke();

    const labelRad = (angleDeg / 2 * Math.PI) / 180;
    const labelX = originX + Math.cos(labelRad) * 70;
    const labelY = originY - Math.sin(labelRad) * 70;

    ctx.font = 'bold 18px Fredoka, sans-serif';
    ctx.fillStyle = '#1E1B4B';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(angleDeg)}°`, labelX, labelY);

    ctx.restore();
  }

  setupGridCanvas(canvas, gridType = 'square') {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    this.gridState.gridNodes = [];
    const spacing = 50;

    if (gridType === 'square') {
      for (let x = 50; x < width; x += spacing) {
        for (let y = 50; y < height; y += spacing) {
          this.gridState.gridNodes.push({ x, y });

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#94A3B8';
          ctx.fill();
        }
      }
    } else if (gridType === 'triangular') {
      const triHeight = spacing * Math.sin(Math.PI / 3);
      let row = 0;
      for (let y = 50; y < height; y += triHeight, row++) {
        const offset = (row % 2 === 0) ? 0 : spacing / 2;
        for (let x = 50 + offset; x < width - 30; x += spacing) {
          this.gridState.gridNodes.push({ x, y });

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#38BDF8';
          ctx.fill();
        }
      }
    }
  }

  // --- LEVEL START HANDLER ---
  startLevel(lvlId) {
    this.currentLevel = lvlId;
    this.questionIndex = 0;
    this.startTimer();

    switch (lvlId) {
      case 1:
        this.badges.add("Robot Factory Specialist");
        this.loadLevel1Question();
        this.navigateTo('level1');
        break;
      case 2:
        this.badges.add("Smartphone Sorter");
        this.loadLevel2Question();
        this.navigateTo('level2');
        break;
      case 3:
        this.badges.add("Drone Pilot");
        this.loadLevel3Question();
        this.navigateTo('level3');
        break;
      case 4:
        this.badges.add("Code Master");
        this.loadLevel4Question();
        this.navigateTo('level4');
        break;
      case 5:
        this.badges.add("Grid Explorer");
        this.loadLevel5Question();
        this.navigateTo('level5');
        break;
      case 6:
        this.badges.add("Glitch Hunter");
        this.loadLevel6Question();
        this.navigateTo('level6');
        break;
      case 7:
        this.bossHealth = 100;
        this.loadBossQuestion();
        this.navigateTo('boss');
        break;
    }
  }

  // --- LEVEL 1: ROBOT FACTORY (Polygons) ---
  loadLevel1Question() {
    const polygons = [
      { name: 'Equilateral Triangle', sides: 3, angle: 60, icon: '🔺' },
      { name: 'Square', sides: 4, angle: 90, icon: '🟩' },
      { name: 'Regular Pentagon', sides: 5, angle: 108, icon: '⬟' },
      { name: 'Regular Hexagon', sides: 6, angle: 120, icon: '⬢' },
      { name: 'Regular Heptagon', sides: 7, angle: 128.6, icon: '🛑' },
      { name: 'Regular Octagon', sides: 8, angle: 135, icon: '🛑' }
    ];

    const currentPoly = polygons[this.questionIndex % polygons.length];
    this.currentQuestion = {
      poly: currentPoly,
      hint: `A ${currentPoly.name} has ${currentPoly.sides} equal sides and interior angle of ${currentPoly.angle}°.`
    };

    const card = document.getElementById('level1-question-card');
    if (!card) return;

    this.setMascotSpeech(`Identify the correct properties for this polygon! Question ${this.questionIndex + 1}/${this.maxLevelQuestions}`);

    card.innerHTML = `
      <div class="polygon-svg-display">
        <div style="font-size: 80px; text-align: center;">${currentPoly.icon}</div>
      </div>
      <div style="font-size: var(--font-size-xl); font-weight: 800; color: #1E1B4B;">
        How many sides and what is ONE interior angle of a <u>${currentPoly.name}</u>?
      </div>
      <div class="options-grid">
        <button class="option-btn" onclick="game.submitLevel1Answer(${currentPoly.sides}, ${currentPoly.angle})">
          ${currentPoly.sides} Sides • ${currentPoly.angle}° Angle
        </button>
        <button class="option-btn" onclick="game.submitLevel1Answer(${currentPoly.sides + 1}, 90)">
          ${currentPoly.sides + 1} Sides • 90° Angle
        </button>
        <button class="option-btn" onclick="game.submitLevel1Answer(${currentPoly.sides - 1}, 60)">
          ${Math.max(3, currentPoly.sides - 1)} Sides • 60° Angle
        </button>
      </div>
    `;
  }

  submitLevel1Answer(sides, angle) {
    if (sides === this.currentQuestion.poly.sides && angle === this.currentQuestion.poly.angle) {
      this.handleCorrectAnswer(50, `Spot on! A ${this.currentQuestion.poly.name} has ${sides} equal sides and interior angle of ${angle}°! 🎉`);
      this.questionIndex++;
      if (this.questionIndex >= this.maxLevelQuestions) {
        this.finishLevel(1);
      } else {
        setTimeout(() => this.loadLevel1Question(), 1000);
      }
    } else {
      this.handleIncorrectAnswer(`Glitch detected! Remember, a ${this.currentQuestion.poly.name} has ${this.currentQuestion.poly.sides} equal sides!`);
    }
    this.nextTeamTurn();
  }

  // --- LEVEL 2: SMARTPHONE SCREEN (Angle Types) ---
  loadLevel2Question() {
    const angleTypesList = [
      { type: 'acute', label: 'Laptop Screen Opening (45°)', angle: 45, icon: '#icon-laptop' },
      { type: 'right', label: 'Smartphone Corner (90°)', angle: 90, icon: '#icon-smartphone' },
      { type: 'obtuse', label: 'Drone Wing Sweep (135°)', angle: 135, icon: '#icon-drone' },
      { type: 'straight', label: 'Smartwatch Strap Flat (180°)', angle: 180, icon: '#icon-smartwatch' },
      { type: 'acute', label: 'Rocket Fin Slope (30°)', angle: 30, icon: '#icon-rocket' }
    ];

    const target = angleTypesList[this.questionIndex % angleTypesList.length];
    this.currentQuestion = {
      target: target,
      hint: `Acute is <90°, Right is 90°, Obtuse is 90°-180°, Straight is 180°.`
    };

    const display = document.getElementById('level2-card-display');
    if (display) {
      display.innerHTML = `
        <div class="sorting-image-box">
          <svg style="width: 100px; height: 100px;"><use href="${target.icon}"></use></svg>
        </div>
        <div style="font-size: var(--font-size-xl); font-weight: 800; color: #1E1B4B;">
          ${target.label}
        </div>
        <p>Sort this angle into the correct category below!</p>
      `;
    }

    this.setMascotSpeech(`Categorize the angle type! Question ${this.questionIndex + 1}/${this.maxLevelQuestions}`);
  }

  handleLevel2Answer(selectedType) {
    if (selectedType === this.currentQuestion.target.type) {
      this.handleCorrectAnswer(50, `Correct! ${this.currentQuestion.target.label} is an ${selectedType.toUpperCase()} angle! 🎉`);
      this.questionIndex++;
      if (this.questionIndex >= this.maxLevelQuestions) {
        this.finishLevel(2);
      } else {
        setTimeout(() => this.loadLevel2Question(), 1000);
      }
    } else {
      this.handleIncorrectAnswer(`Nice try! Remember: Acute < 90°, Right = 90°, Obtuse 90°-180°, Straight = 180°.`);
    }
    this.nextTeamTurn();
  }

  // --- LEVEL 3: DRONE PILOT (Measuring Angles) ---
  loadLevel3Question() {
    const testAngles = [30, 45, 60, 90, 120, 135, 150];
    const targetAngle = testAngles[this.questionIndex % testAngles.length];

    this.currentQuestion = {
      targetAngle: targetAngle,
      hint: `Align the protractor origin on the vertex and read the baseline scale!`
    };

    const canvas = document.getElementById('level3-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawAngleOnCanvas(ctx, 200, 250, targetAngle, 180);
      this.drawProtractor(ctx, 200, 250, 140);
    }

    const optionsGrid = document.getElementById('l3-options-grid');
    if (optionsGrid) {
      const choices = [targetAngle, (targetAngle + 30) % 180 || 180, Math.abs(180 - targetAngle)].sort(() => Math.random() - 0.5);
      optionsGrid.innerHTML = choices.map(c => `
        <button class="option-btn" onclick="game.selectLevel3Option(${c})">${c}°</button>
      `).join('');
    }

    this.setMascotSpeech(`Read the protractor reading for this angle! Question ${this.questionIndex + 1}/${this.maxLevelQuestions}`);
  }

  selectLevel3Option(val) {
    const input = document.getElementById('l3-angle-input');
    if (input) input.value = val;
  }

  submitLevel3Answer() {
    const input = document.getElementById('l3-angle-input');
    if (!input || !input.value) {
      this.setMascotSpeech("Please enter or select an angle reading first!");
      return;
    }

    const reading = parseFloat(input.value);
    if (Math.abs(reading - this.currentQuestion.targetAngle) <= 1) {
      this.handleCorrectAnswer(60, `Accurate piloting! Protractor reading is exactly ${this.currentQuestion.targetAngle}°! 🎯`);
      input.value = '';
      this.questionIndex++;
      if (this.questionIndex >= this.maxLevelQuestions) {
        this.finishLevel(3);
      } else {
        setTimeout(() => this.loadLevel3Question(), 1000);
      }
    } else {
      this.handleIncorrectAnswer(`Glitch! The angle reading was ${this.currentQuestion.targetAngle}°. Double check inner vs outer scale!`);
    }
    this.nextTeamTurn();
  }

  // --- LEVEL 4: CODE BUILDER (Constructing Angles) ---
  loadLevel4Question() {
    const targets = [45, 60, 90, 110, 135, 150];
    const target = targets[this.questionIndex % targets.length];

    this.currentQuestion = {
      targetAngle: target,
      hint: `Drag the slider until the red angle arm reaches ${target}°. Tolerance is ±3°!`
    };

    const targetDisp = document.getElementById('l4-target-display');
    if (targetDisp) targetDisp.innerText = `${target}°`;

    this.level4ArmAngle = 0;
    const slider = document.getElementById('l4-arm-slider');
    if (slider) slider.value = 0;

    this.updateLevel4Arm(0);
    this.setMascotSpeech(`Construct a ${target}° angle by rotating the angle arm! Question ${this.questionIndex + 1}/${this.maxLevelQuestions}`);
  }

  updateLevel4Arm(val) {
    this.level4ArmAngle = parseFloat(val);
    const valDisp = document.getElementById('l4-current-arm-val');
    if (valDisp) valDisp.innerText = `${Math.round(this.level4ArmAngle)}°`;

    const canvas = document.getElementById('level4-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawProtractor(ctx, 250, 250, 140);
      this.drawAngleOnCanvas(ctx, 250, 250, this.level4ArmAngle, 170, Math.abs(this.level4ArmAngle - this.currentQuestion.targetAngle) <= 3);
    }
  }

  submitLevel4Answer() {
    const diff = Math.abs(this.level4ArmAngle - this.currentQuestion.targetAngle);
    if (diff <= 3) {
      this.handleCorrectAnswer(60, `Angle Construction Complete! Constructed ${Math.round(this.level4ArmAngle)}° (Target: ${this.currentQuestion.targetAngle}°)! 🛠️`);
      this.questionIndex++;
      if (this.questionIndex >= this.maxLevelQuestions) {
        this.finishLevel(4);
      } else {
        setTimeout(() => this.loadLevel4Question(), 1000);
      }
    } else {
      this.handleIncorrectAnswer(`Close! You constructed ${Math.round(this.level4ArmAngle)}°, target was ${this.currentQuestion.targetAngle}°. Adjust arm closer!`);
    }
    this.nextTeamTurn();
  }

  // --- LEVEL 5: SATELLITE GRID (Polygons on Grid) ---
  loadLevel5Question() {
    const tasks = [
      { name: 'Equilateral Triangle', sides: 3, angle: 60, grid: 'triangular' },
      { name: 'Square', sides: 4, angle: 90, grid: 'square' },
      { name: 'Regular Hexagon', sides: 6, angle: 120, grid: 'triangular' }
    ];

    const task = tasks[this.questionIndex % tasks.length];
    this.gridState.targetSides = task.sides;
    this.gridState.targetName = task.name;
    this.gridState.expectedAngle = task.angle;
    this.gridState.points = [];

    this.switchGridType(task.grid);

    const instr = document.getElementById('l5-instructions');
    if (instr) instr.innerText = `Click grid points to draw a ${task.name} (${task.sides} sides)!`;

    const qBox = document.getElementById('l5-question-box');
    if (qBox) qBox.classList.add('hidden');

    this.setMascotSpeech(`Draw a ${task.name} on the grid! Question ${this.questionIndex + 1}/${this.maxLevelQuestions}`);
  }

  switchGridType(type) {
    this.gridState.type = type;
    this.gridState.points = [];

    const squareBtn = document.getElementById('btn-grid-square');
    const triBtn = document.getElementById('btn-grid-tri');
    if (squareBtn && triBtn) {
      if (type === 'square') {
        squareBtn.classList.add('active');
        triBtn.classList.remove('active');
      } else {
        triBtn.classList.add('active');
        squareBtn.classList.remove('active');
      }
    }

    const canvas = document.getElementById('level5-canvas');
    if (canvas) this.setupGridCanvas(canvas, type);
  }

  resetLevel5Grid() {
    this.gridState.points = [];
    const canvas = document.getElementById('level5-canvas');
    if (canvas) this.setupGridCanvas(canvas, this.gridState.type);
  }

  handleGridClick(e) {
    const canvas = document.getElementById('level5-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let nearest = null;
    let minDist = 25;

    this.gridState.gridNodes.forEach(node => {
      const dist = Math.hypot(node.x - clickX, node.y - clickY);
      if (dist < minDist) {
        minDist = dist;
        nearest = node;
      }
    });

    if (nearest) {
      this.playSound('click');
      this.gridState.points.push(nearest);
      this.redrawGridPolygon(canvas);

      if (this.gridState.points.length === this.gridState.targetSides) {
        this.showLevel5AngleQuestion();
      }
    }
  }

  redrawGridPolygon(canvas) {
    const ctx = canvas.getContext('2d');
    this.setupGridCanvas(canvas, this.gridState.type);

    if (this.gridState.points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(this.gridState.points[0].x, this.gridState.points[0].y);
      for (let i = 1; i < this.gridState.points.length; i++) {
        ctx.lineTo(this.gridState.points[i].x, this.gridState.points[i].y);
      }

      if (this.gridState.points.length === this.gridState.targetSides) {
        ctx.closePath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.fill();
      }

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#10B981';
      ctx.stroke();

      this.gridState.points.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#15803D';
        ctx.fill();
      });
    }
  }

  showLevel5AngleQuestion() {
    const qBox = document.getElementById('l5-question-box');
    const choicesGrid = document.getElementById('l5-choices-grid');
    if (!qBox || !choicesGrid) return;

    qBox.classList.remove('hidden');
    const targetAngle = this.gridState.expectedAngle;
    const choices = [targetAngle, 90, 108, 120, 135].filter((v, i, self) => self.indexOf(v) === i).slice(0, 3);

    choicesGrid.innerHTML = choices.map(c => `
      <button class="option-btn" onclick="game.submitLevel5Answer(${c})">${c}°</button>
    `).join('');

    this.setMascotSpeech(`Polygon drawn! Now answer: What is ONE interior angle of this ${this.gridState.targetName}?`);
  }

  submitLevel5Answer(selectedAngle) {
    if (selectedAngle === this.gridState.expectedAngle) {
      this.handleCorrectAnswer(70, `Grid Satellite Online! One interior angle of a ${this.gridState.targetName} is ${selectedAngle}°! 📡`);
      this.questionIndex++;
      if (this.questionIndex >= this.maxLevelQuestions) {
        this.finishLevel(5);
      } else {
        setTimeout(() => this.loadLevel5Question(), 1000);
      }
    } else {
      this.handleIncorrectAnswer(`Glitch! Remember the formula: (n-2)*180 / n. The interior angle is ${this.gridState.expectedAngle}°.`);
    }
    this.nextTeamTurn();
  }

  // --- LEVEL 6: SPOT THE GLITCH (Error Detection) ---
  loadLevel6Question() {
    const glitches = [
      {
        scenario: "🐛 Glitch Bug: Pupil read outer scale (60°) instead of inner scale when ray opened from the right!",
        correctAngle: 120,
        options: ["Correct angle is 120° (Read inner scale)", "Correct angle is 60° (Keep outer scale)", "Correct angle is 90°"]
      },
      {
        scenario: "🐛 Glitch Bug: Protractor center point misaligned 2cm off the vertex!",
        correctAngle: 45,
        options: ["Move origin crosshair directly onto vertex (True: 45°)", "Ignore origin position", "Rotate protractor upside down"]
      },
      {
        scenario: "🐛 Glitch Bug: Baseline 0° line not resting flat on bottom ray!",
        correctAngle: 90,
        options: ["Align 0° baseline with ray first (True: 90°)", "Baseline position doesn't matter", "Add 20° to reading"]
      }
    ];

    const currentGlitch = glitches[this.questionIndex % glitches.length];
    const correctAnswerText = currentGlitch.options[0];
    const shuffled = currentGlitch.options.map(opt => ({
      text: opt,
      isCorrect: opt === correctAnswerText
    })).sort(() => Math.random() - 0.5);

    this.currentQuestion = {
      ...currentGlitch,
      shuffledOptions: shuffled
    };

    const desc = document.getElementById('l6-glitch-scenario');
    if (desc) desc.innerText = currentGlitch.scenario;

    const canvas = document.getElementById('level6-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawAngleOnCanvas(ctx, 200, 220, currentGlitch.correctAngle, 160);
      this.drawProtractor(ctx, 200, 220, 130);
    }

    const grid = document.getElementById('l6-choices-grid');
    if (grid) {
      grid.innerHTML = shuffled.map((optObj, idx) => `
        <button class="option-btn" onclick="game.submitLevel6Answer(${idx})">${optObj.text}</button>
      `).join('');
    }

    this.setMascotSpeech(`Detect and repair the protractor reading bug! Question ${this.questionIndex + 1}/${this.maxLevelQuestions}`);
  }

  submitLevel6Answer(idx) {
    const selected = this.currentQuestion.shuffledOptions && this.currentQuestion.shuffledOptions[idx];
    if (selected && selected.isCorrect) {
      this.handleCorrectAnswer(70, "Glitch fixed! System restored to 100% precision! 🐛⚡");
      this.questionIndex++;
      if (this.questionIndex >= this.maxLevelQuestions) {
        this.finishLevel(6);
      } else {
        setTimeout(() => this.loadLevel6Question(), 1000);
      }
    } else {
      this.handleIncorrectAnswer("Glitch persisted! Always align center vertex and read the baseline scale!");
    }
    this.nextTeamTurn();
  }

  // --- BOSS BATTLE: MEGA GLITCH ROBOT ---
  loadBossQuestion() {
    const bossQuestions = [
      { q: "What is ONE interior angle of a regular Hexagon (6 sides)?", options: ["120°", "108°", "90°"], ans: 0 },
      { q: "Sort a 135° angle: Is it Acute, Right, or Obtuse?", options: ["Obtuse", "Acute", "Right"], ans: 0 },
      { q: "What is the interior angle sum of a triangle?", options: ["180°", "360°", "90°"], ans: 0 },
      { q: "What is ONE interior angle of an Equilateral Triangle?", options: ["60°", "90°", "120°"], ans: 0 },
      { q: "An angle measuring 90° is called a...", options: ["Right Angle", "Acute Angle", "Obtuse Angle"], ans: 0 }
    ];

    const q = bossQuestions[this.questionIndex % bossQuestions.length];
    const correctAnswerText = q.options[q.ans];
    const shuffled = q.options.map(opt => ({
      text: opt,
      isCorrect: opt === correctAnswerText
    })).sort(() => Math.random() - 0.5);

    this.currentQuestion = {
      ...q,
      shuffledOptions: shuffled
    };

    const card = document.getElementById('boss-question-card');
    if (card) {
      card.innerHTML = `
        <div style="font-size: var(--font-size-xl); font-weight: 800; color: #1E1B4B; margin-bottom: 20px;">
          ${q.q}
        </div>
        <div class="options-grid">
          ${shuffled.map((optObj, idx) => `
            <button class="option-btn" onclick="game.submitBossAnswer(${idx})">${optObj.text}</button>
          `).join('')}
        </div>
      `;
    }

    this.setMascotSpeech("Strike Mega Glitch with accurate angle power!");
  }

  submitBossAnswer(selectedIdx) {
    const selected = this.currentQuestion.shuffledOptions && this.currentQuestion.shuffledOptions[selectedIdx];
    if (selected && selected.isCorrect) {
      this.playSound('boss-hit');
      this.bossHealth -= 25;
      this.handleCorrectAnswer(80, "DIRECT HIT on Mega Glitch Robot! -25 HP! 💥");

      const hpText = document.getElementById('boss-hp-text');
      const hpBar = document.getElementById('boss-hp-bar');
      if (hpText && hpBar) {
        hpText.innerText = `${Math.max(0, this.bossHealth)} / 100`;
        hpBar.style.width = `${Math.max(0, this.bossHealth)}%`;
      }

      if (this.bossHealth <= 0) {
        this.finishBossBattle();
      } else {
        this.questionIndex++;
        setTimeout(() => this.loadBossQuestion(), 1000);
      }
    } else {
      this.handleIncorrectAnswer("Mega Glitch counter-attacked! Stay focused Tech Hero!");
    }
    this.nextTeamTurn();
  }

  finishLevel(lvlId) {
    this.stopTimer();
    this.playSound('fanfare');
    this.launchConfetti();

    this.stars[lvlId] = 3;
    if (lvlId < 7) {
      this.unlockedLevels.add(lvlId + 1);
    }

    this.setMascotSpeech(`Level ${lvlId} Cleared! 3 Stars Earned! ⭐⭐⭐`);
    setTimeout(() => this.navigateTo('map'), 1500);
  }

  finishBossBattle() {
    this.stopTimer();
    this.playSound('fanfare');
    this.launchConfetti();
    this.badges.add("Angle Hero");
    this.badges.add("Tech City Savior");

    this.setMascotSpeech("VICTORY! Mega Glitch Robot Defeated! Tech City is Saved! 🎉");
    setTimeout(() => this.showResultsScreen(), 2000);
  }

  showResultsScreen() {
    this.navigateTo('results');

    const totalStars = Object.values(this.stars).reduce((a, b) => a + b, 0);

    const scoreVal = document.getElementById('res-total-score');
    if (scoreVal) scoreVal.innerText = this.score;

    const starsVal = document.getElementById('res-total-stars');
    if (starsVal) starsVal.innerText = `${totalStars} / 18`;

    const badgesVal = document.getElementById('res-total-badges');
    if (badgesVal) badgesVal.innerText = `${this.badges.size} Unlocked`;

    const starsBanner = document.getElementById('results-stars-display');
    if (starsBanner) {
      starsBanner.innerHTML = [1, 2, 3].map(() => `
        <svg class="star-lg"><use href="#icon-star"></use></svg>
      `).join('');
    }

    const badgesGrid = document.getElementById('badges-grid');
    if (badgesGrid) {
      badgesGrid.innerHTML = Array.from(this.badges).map(b => `
        <div class="badge-card">
          <div style="font-size: 24px;">🏅</div>
          <div>${b}</div>
        </div>
      `).join('');
    }
  }
}

// Global instance
const game = new GameEngine();
window.game = game;
