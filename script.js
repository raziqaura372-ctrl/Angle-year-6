/**
 * Angle Explorer Lab 🧪✨
 * JavaScript Application Logic
 */

// ==========================================
// 1. Web Audio API Synthesizer (Sound Engine)
// ==========================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = true; // Muted by default per specification
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

  toggleSound() {
    this.muted = !this.muted;
    if (!this.muted) {
      this.init();
      this.playPop();
    }
    return this.muted;
  }

  playPop(freq = 440, duration = 0.08) {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  playSnap() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.05); // E5
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  playCelebration() {
    if (this.muted || !this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.2);
      });
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }
}

const audio = new SoundEngine();

// ==========================================
// 2. Robot Mascot Companion (Inline SVG Render)
// ==========================================
function renderMascotSVG(expression = 'happy') {
  const container = document.getElementById('mascot-svg-container');
  if (!container) return;

  let eyeLeft = '<circle cx="32" cy="35" r="5" fill="#48DBFB"/>';
  let eyeRight = '<circle cx="48" cy="35" r="5" fill="#48DBFB"/>';
  let mouth = '<path d="M 32 48 Q 40 55 48 48" stroke="#FECA57" stroke-width="3" fill="none" stroke-linecap="round"/>';

  if (expression === 'excited') {
    eyeLeft = '<circle cx="32" cy="35" r="6" fill="#FECA57"/><circle cx="32" cy="35" r="2" fill="#FFF"/>';
    eyeRight = '<circle cx="48" cy="35" r="6" fill="#FECA57"/><circle cx="48" cy="35" r="2" fill="#FFF"/>';
    mouth = '<path d="M 30 46 Q 40 58 50 46 Z" fill="#FECA57"/>';
  } else if (expression === 'thinking') {
    eyeLeft = '<circle cx="32" cy="33" r="4" fill="#48DBFB"/>';
    eyeRight = '<circle cx="48" cy="37" r="5" fill="#48DBFB"/>';
    mouth = '<path d="M 34 50 L 46 48" stroke="#FECA57" stroke-width="3" fill="none" stroke-linecap="round"/>';
  } else if (expression === 'surprised') {
    mouth = '<ellipse cx="40" cy="48" rx="5" ry="7" fill="#FECA57"/>';
  }

  const svg = `
    <svg width="70" height="70" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <!-- Antenna -->
      <line x1="40" y1="18" x2="40" y2="8" stroke="#54A0FF" stroke-width="3"/>
      <circle cx="40" cy="6" r="4" fill="#FF6B9B"/>

      <!-- Head Body -->
      <rect x="18" y="18" width="44" height="42" rx="10" fill="#283B57" stroke="#54A0FF" stroke-width="3"/>
      <!-- Screen Face -->
      <rect x="22" y="24" width="36" height="30" rx="6" fill="#111C2B"/>

      <!-- Eyes & Mouth -->
      ${eyeLeft}
      ${eyeRight}
      ${mouth}

      <!-- Ears -->
      <rect x="12" y="32" width="6" height="14" rx="2" fill="#FF9F43"/>
      <rect x="62" y="32" width="6" height="14" rx="2" fill="#FF9F43"/>

      <!-- Cheeks -->
      <circle cx="26" cy="42" r="3" fill="#FF6B9B" opacity="0.6"/>
      <circle cx="54" cy="42" r="3" fill="#FF6B9B" opacity="0.6"/>
    </svg>
  `;

  container.innerHTML = svg;
}

function speakMascot(text, expression = 'happy') {
  const speechBubble = document.getElementById('mascot-speech');
  if (speechBubble) {
    speechBubble.textContent = text;
  }
  renderMascotSVG(expression);
}

// ==========================================
// Helper Utilities for Canvas Drawing
// ==========================================
function getAngleType(degrees) {
  if (degrees < 90) {
    return { name: 'Acute angle', type: 'acute', emoji: '🌱', color: '#1DD1A1' };
  } else if (degrees === 90) {
    return { name: 'Right angle', type: 'right', emoji: '📐', color: '#54A0FF' };
  } else if (degrees < 180) {
    return { name: 'Obtuse angle', type: 'obtuse', emoji: '🟧', color: '#FF9F43' };
  } else {
    return { name: 'Straight line', type: 'straight', emoji: '🟣', color: '#9B59B6' };
  }
}

function drawVirtualProtractor(ctx, originX, originY, radius) {
  ctx.save();
  ctx.translate(originX, originY);

  ctx.beginPath();
  ctx.arc(0, 0, radius, Math.PI, 0, false);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-radius, 0);
  ctx.lineTo(radius, 0);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.stroke();

  for (let deg = 0; deg <= 180; deg += 5) {
    const rad = (deg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const isMajor = deg % 10 === 0;
    const isMain = deg % 30 === 0;
    const tickLen = isMain ? 14 : isMajor ? 9 : 5;

    const x1 = -cos * radius;
    const y1 = -sin * radius;
    const x2 = -cos * (radius - tickLen);
    const y2 = -sin * (radius - tickLen);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isMain ? '#FECA57' : 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = isMain ? 2 : 1;
    ctx.stroke();

    if (isMain) {
      const textXOuter = -cos * (radius - 24);
      const textYOuter = -sin * (radius - 24);
      ctx.fillStyle = '#48DBFB';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(deg.toString(), textXOuter, textYOuter);

      const textXInner = -cos * (radius - 38);
      const textYInner = -sin * (radius - 38);
      ctx.fillStyle = '#FF9F43';
      ctx.font = '10px sans-serif';
      ctx.fillText((180 - deg).toString(), textXInner, textYInner);
    }
  }

  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.strokeStyle = '#FECA57';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

function drawSparkles(ctx, x, y, color = '#FECA57') {
  ctx.save();
  ctx.fillStyle = color;
  const numSparkles = 5;
  for (let i = 0; i < numSparkles; i++) {
    const angle = (i * Math.PI * 2) / numSparkles + Date.now() * 0.003;
    const dist = 25 + Math.sin(Date.now() * 0.01 + i) * 5;
    const sx = x + Math.cos(angle) * dist;
    const sy = y + Math.sin(angle) * dist;

    ctx.beginPath();
    ctx.arc(sx, sy, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ==========================================
// 3. ZONE 1: Angle Playground Logic
// ==========================================
class AnglePlayground {
  constructor() {
    this.canvas = document.getElementById('playground-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.angle = 45; // Degrees (0 to 180)
    this.isDragging = false;
    this.showProtractor = false;
    this.estimateMode = false;
    this.sparkleTimer = 0;
    this.lastSnappedAngle = null;

    this.snapPoints = [30, 45, 60, 90, 120, 180];

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;

    const protractorBtn = document.getElementById('pg-protractor-btn');
    if (protractorBtn) {
      protractorBtn.addEventListener('click', () => {
        audio.playPop(480, 0.06);
        this.showProtractor = !this.showProtractor;
        protractorBtn.classList.toggle('active', this.showProtractor);
        protractorBtn.querySelector('.status-text').textContent = this.showProtractor ? 'ON' : 'OFF';
        this.render();
      });
    }

    const estimateBtn = document.getElementById('pg-estimate-btn');
    const estimatePanel = document.getElementById('pg-estimate-panel');

    if (estimateBtn) {
      estimateBtn.addEventListener('click', () => {
        audio.playPop(480, 0.06);
        this.estimateMode = !this.estimateMode;
        estimateBtn.classList.toggle('active', this.estimateMode);
        estimateBtn.querySelector('.status-text').textContent = this.estimateMode ? 'ON' : 'OFF';
        if (estimatePanel) estimatePanel.classList.toggle('hidden', !this.estimateMode);

        if (this.estimateMode) {
          speakMascot("Estimate mode is ON! Guess the angle size before revealing! 💭", "thinking");
        } else {
          speakMascot("Estimate mode OFF. Direct viewing active! 📐", "happy");
        }
        this.updateUI();
        this.render();
      });
    }

    const checkGuessBtn = document.getElementById('pg-check-guess-btn');
    const guessInput = document.getElementById('pg-guess-input');
    const guessFeedback = document.getElementById('pg-guess-feedback');

    if (checkGuessBtn && guessInput && guessFeedback) {
      checkGuessBtn.addEventListener('click', () => {
        const guessVal = parseFloat(guessInput.value);
        if (isNaN(guessVal) || guessVal < 0 || guessVal > 180) {
          guessFeedback.textContent = "Please enter a valid angle between 0° and 180°!";
          guessFeedback.classList.remove('hidden');
          return;
        }

        const diff = Math.abs(guessVal - Math.round(this.angle));
        guessFeedback.classList.remove('hidden');
        if (diff === 0) {
          guessFeedback.textContent = `🎯 Spot on! Exact match: ${Math.round(this.angle)}°!`;
          speakMascot("WOW! Perfectly accurate guess! You have superhero eyes! 🌟", "excited");
          audio.playCelebration();
        } else {
          guessFeedback.textContent = `Difference: ${diff}° away! (Real angle is ${Math.round(this.angle)}°)`;
          speakMascot(`Great guess! You were off by only ${diff}°. Drag again to test more! 🧪`, "happy");
          audio.playPop(600, 0.1);
        }
      });
    }

    this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
    window.addEventListener('pointercancel', (e) => this.onPointerUp(e));

    this.updateUI();
    this.render();
  }

  getCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  onPointerDown(e) {
    const coords = this.getCanvasCoords(e);
    const originX = this.canvas.width / 2;
    const originY = this.canvas.height * 0.75;
    const rayLength = 160;

    const rad = (this.angle * Math.PI) / 180;
    const handleX = originX - Math.cos(rad) * rayLength;
    const handleY = originY - Math.sin(rad) * rayLength;

    const dx = coords.x - handleX;
    const dy = coords.y - handleY;
    if (Math.sqrt(dx * dx + dy * dy) <= 35) {
      this.isDragging = true;
      this.canvas.setPointerCapture(e.pointerId);
      audio.playPop(400, 0.05);
    }
  }

  onPointerMove(e) {
    if (!this.isDragging) return;

    const coords = this.getCanvasCoords(e);
    const originX = this.canvas.width / 2;
    const originY = this.canvas.height * 0.75;

    let rad = Math.atan2(originY - coords.y, originX - coords.x);
    let deg = (rad * 180) / Math.PI;

    if (deg < 0) {
      if (coords.x > originX) deg = 0;
      else deg = 180;
    }
    deg = Math.max(0, Math.min(180, deg));

    let snapped = false;
    for (const snap of this.snapPoints) {
      if (Math.abs(deg - snap) <= 3.5) {
        if (this.lastSnappedAngle !== snap) {
          audio.playSnap();
          this.sparkleTimer = Date.now() + 600;
          this.lastSnappedAngle = snap;
          speakMascot(`Snapped to ${snap}°! ${getAngleType(snap).name}! ✨`, "excited");
        }
        deg = snap;
        snapped = true;
        break;
      }
    }
    if (!snapped) {
      this.lastSnappedAngle = null;
    }

    this.angle = deg;
    this.updateUI();
    this.render();
  }

  onPointerUp(e) {
    if (this.isDragging) {
      this.isDragging = false;
      try {
        this.canvas.releasePointerCapture(e.pointerId);
      } catch (eRelease) {
        console.warn('Pointer capture release note:', eRelease);
      }
    }
  }

  updateUI() {
    const degreeVal = document.getElementById('pg-degree-val');
    const typeBadge = document.getElementById('pg-type-badge');
    const typeEmoji = document.getElementById('pg-type-emoji');
    const typeLabel = document.getElementById('pg-type-label');

    const roundedAngle = Math.round(this.angle);
    const info = getAngleType(roundedAngle);

    if (degreeVal) {
      degreeVal.textContent = this.estimateMode ? '???°' : `${roundedAngle}°`;
    }

    if (typeBadge) {
      typeBadge.className = `angle-badge badge-${info.type}`;
      typeEmoji.textContent = info.emoji;
      typeLabel.textContent = this.estimateMode ? 'Hidden' : info.name;
    }
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);

    const originX = width / 2;
    const originY = height * 0.75;
    const rayLength = 160;

    if (this.showProtractor) {
      drawVirtualProtractor(ctx, originX, originY, 150);
    }

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + rayLength, originY);
    ctx.strokeStyle = '#54A0FF';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(originX + rayLength, originY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#54A0FF';
    ctx.fill();

    const rad = (this.angle * Math.PI) / 180;
    const moveX = originX - Math.cos(rad) * rayLength;
    const moveY = originY - Math.sin(rad) * rayLength;

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(moveX, moveY);
    ctx.strokeStyle = '#FF9F43';
    ctx.lineWidth = 5;
    ctx.stroke();

    const roundedDeg = Math.round(this.angle);
    const info = getAngleType(roundedDeg);
    ctx.beginPath();
    ctx.arc(originX, originY, 60, 0, -rad, true);
    ctx.strokeStyle = info.color;
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.arc(originX, originY, 60, 0, -rad, true);
    ctx.closePath();
    ctx.fillStyle = info.color + '33';
    ctx.fill();

    if (roundedDeg === 90) {
      ctx.beginPath();
      const sqSize = 20;
      ctx.moveTo(originX, originY - sqSize);
      ctx.lineTo(originX + sqSize, originY - sqSize);
      ctx.lineTo(originX + sqSize, originY);
      ctx.strokeStyle = '#54A0FF';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(originX, originY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#FECA57';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(moveX, moveY, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#FF9F43';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(moveX, moveY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    if (Date.now() < this.sparkleTimer) {
      drawSparkles(ctx, moveX, moveY, '#FECA57');
      requestAnimationFrame(() => this.render());
    }
  }
}

// ==========================================
// 4. ZONE 2: Polygon Lab Logic
// ==========================================
class PolygonLab {
  constructor() {
    this.canvas = document.getElementById('polygon-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.sides = 3; // 3 to 8
    this.showAllAngles = false;
    this.gridMode = 'square'; // 'square', 'triangular', 'none'
    this.animScale = 1.0;

    this.polygonData = {
      3: { name: 'Equilateral Triangle', angle: 60, color: '#1DD1A1' },
      4: { name: 'Square', angle: 90, color: '#54A0FF' },
      5: { name: 'Regular Pentagon', angle: 108, color: '#FECA57' },
      6: { name: 'Regular Hexagon', angle: 120, color: '#FF9F43' },
      7: { name: 'Regular Heptagon', angle: 128.6, color: '#FF6B9B', displayAngle: 'about 129°' },
      8: { name: 'Regular Octagon', angle: 135, color: '#9B59B6' }
    };

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;

    const sidesRange = document.getElementById('poly-sides-range');
    const minusBtn = document.getElementById('poly-minus-btn');
    const plusBtn = document.getElementById('poly-plus-btn');

    const updateSides = (newSides) => {
      newSides = Math.max(3, Math.min(8, newSides));
      if (this.sides !== newSides) {
        this.sides = newSides;
        audio.playPop(400 + newSides * 60, 0.08);
        this.triggerAnim();
        this.updateUI();
        this.render();

        const data = this.polygonData[this.sides];
        speakMascot(`Changed to a ${data.name}! Each interior angle is ${data.displayAngle || data.angle + '°'}! 🛑✨`, 'excited');
      }
    };

    if (sidesRange) {
      sidesRange.addEventListener('input', (e) => updateSides(parseInt(e.target.value)));
    }
    if (minusBtn) {
      minusBtn.addEventListener('click', () => updateSides(this.sides - 1));
    }
    if (plusBtn) {
      plusBtn.addEventListener('click', () => updateSides(this.sides + 1));
    }

    const allAnglesBtn = document.getElementById('poly-all-angles-btn');
    if (allAnglesBtn) {
      allAnglesBtn.addEventListener('click', () => {
        audio.playPop(480, 0.06);
        this.showAllAngles = !this.showAllAngles;
        allAnglesBtn.classList.toggle('active', this.showAllAngles);
        allAnglesBtn.querySelector('.status-text').textContent = this.showAllAngles ? 'ON' : 'OFF';
        this.render();
      });
    }

    const gridBtn = document.getElementById('poly-grid-btn');
    const gridLabel = document.getElementById('poly-grid-label');
    if (gridBtn) {
      gridBtn.addEventListener('click', () => {
        audio.playPop(480, 0.06);
        if (this.gridMode === 'square') {
          this.gridMode = 'triangular';
          if (gridLabel) gridLabel.textContent = 'Triangular Grid';
        } else if (this.gridMode === 'triangular') {
          this.gridMode = 'none';
          if (gridLabel) gridLabel.textContent = 'Grid: OFF';
        } else {
          this.gridMode = 'square';
          if (gridLabel) gridLabel.textContent = 'Square Grid';
        }
        this.render();
      });
    }

    this.updateUI();
    this.render();
  }

  triggerAnim() {
    this.animScale = 0.85;
    const animate = () => {
      this.animScale += 0.03;
      if (this.animScale < 1.0) {
        this.render();
        requestAnimationFrame(animate);
      } else {
        this.animScale = 1.0;
        this.render();
      }
    };
    animate();
  }

  updateUI() {
    const sidesRange = document.getElementById('poly-sides-range');
    const sidesVal = document.getElementById('poly-sides-val');
    const polyName = document.getElementById('poly-name');
    const angleVal = document.getElementById('poly-angle-val');
    const sidesCount = document.getElementById('poly-sides-count');
    const sumVal = document.getElementById('poly-sum-val');

    const data = this.polygonData[this.sides];

    if (sidesRange) sidesRange.value = this.sides;
    if (sidesVal) sidesVal.textContent = `${this.sides} Sides`;
    if (polyName) polyName.textContent = data.name;
    if (angleVal) angleVal.textContent = data.displayAngle || `${data.angle}°`;
    if (sidesCount) sidesCount.textContent = this.sides.toString();

    const sum = (this.sides - 2) * 180;
    if (sumVal) sumVal.textContent = `${sum}°`;
  }

  drawGrid(ctx, width, height) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;

    if (this.gridMode === 'square') {
      const step = 30;
      for (let x = 0; x <= width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (this.gridMode === 'triangular') {
      const step = 40;
      const h = step * Math.sin(Math.PI / 3);
      for (let y = -height; y <= height * 2; y += h) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y + width * Math.tan(Math.PI / 3));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y - width * Math.tan(Math.PI / 3));
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);

    this.drawGrid(ctx, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 120 * this.animScale;

    const vertices = [];
    const angleStep = (2 * Math.PI) / this.sides;
    const startAngle = -Math.PI / 2 + (this.sides % 2 === 0 ? angleStep / 2 : 0);

    for (let i = 0; i < this.sides; i++) {
      const a = startAngle + i * angleStep;
      vertices.push({
        x: centerX + radius * Math.cos(a),
        y: centerY + radius * Math.sin(a),
        angle: a
      });
    }

    const data = this.polygonData[this.sides];

    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();

    ctx.fillStyle = data.color + '25';
    ctx.fill();
    ctx.strokeStyle = data.color;
    ctx.lineWidth = 5;
    ctx.stroke();

    const numAngleArcs = this.showAllAngles ? this.sides : 1;
    for (let i = 0; i < numAngleArcs; i++) {
      const prev = vertices[(i - 1 + this.sides) % this.sides];
      const curr = vertices[i];
      const next = vertices[(i + 1) % this.sides];

      const a1 = Math.atan2(prev.y - curr.y, prev.x - curr.x);
      const a2 = Math.atan2(next.y - curr.y, next.x - curr.x);

      ctx.beginPath();
      ctx.arc(curr.x, curr.y, 30, a1, a2, false);
      ctx.strokeStyle = '#FECA57';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(curr.x, curr.y);
      ctx.arc(curr.x, curr.y, 30, a1, a2, false);
      ctx.closePath();
      ctx.fillStyle = '#FECA5744';
      ctx.fill();

      const midA = a1 + (a2 - a1) / 2;
      const lx = curr.x + Math.cos(midA) * 48;
      const ly = curr.y + Math.sin(midA) * 48;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(data.displayAngle || `${data.angle}°`, lx, ly);
    }

    vertices.forEach(v => {
      ctx.beginPath();
      ctx.arc(v.x, v.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = data.color;
      ctx.lineWidth = 3;
      ctx.stroke();
    });
  }
}

// ==========================================
// 5. ZONE 3: Construct Studio Logic
// ==========================================
class ConstructStudio {
  constructor() {
    this.canvas = document.getElementById('construct-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.targetAngle = 60; // Target in degrees
    this.currentAngle = 20; // Current constructed angle in degrees
    this.isDragging = false;
    this.showProtractor = false;
    this.particles = [];
    this.celebrated = false;

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;

    const presetBtns = document.querySelectorAll('.btn-preset');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.angle);
        this.setTargetAngle(val);
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    const setTargetBtn = document.getElementById('construct-set-target-btn');
    const targetInput = document.getElementById('construct-target-input');
    if (setTargetBtn && targetInput) {
      setTargetBtn.addEventListener('click', () => {
        const val = parseInt(targetInput.value);
        if (!isNaN(val) && val >= 0 && val <= 180) {
          this.setTargetAngle(val);
          presetBtns.forEach(b => b.classList.remove('active'));
        }
      });
    }

    const protractorBtn = document.getElementById('construct-protractor-btn');
    if (protractorBtn) {
      protractorBtn.addEventListener('click', () => {
        audio.playPop(480, 0.06);
        this.showProtractor = !this.showProtractor;
        protractorBtn.classList.toggle('active', this.showProtractor);
        protractorBtn.querySelector('.status-text').textContent = this.showProtractor ? 'ON' : 'OFF';
        this.render();
      });
    }

    this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
    window.addEventListener('pointercancel', (e) => this.onPointerUp(e));

    this.updateUI();
    this.render();
  }

  setTargetAngle(val) {
    this.targetAngle = Math.max(0, Math.min(180, val));
    this.celebrated = false;
    audio.playPop(550, 0.08);
    speakMascot(`Target set to ${this.targetAngle}°! Drag the ray to construct it! 🎯`, 'thinking');
    this.updateUI();
    this.render();
  }

  getCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  onPointerDown(e) {
    const coords = this.getCanvasCoords(e);
    const originX = this.canvas.width / 2;
    const originY = this.canvas.height * 0.75;
    const rayLength = 160;

    const rad = (this.currentAngle * Math.PI) / 180;
    const handleX = originX - Math.cos(rad) * rayLength;
    const handleY = originY - Math.sin(rad) * rayLength;

    const dx = coords.x - handleX;
    const dy = coords.y - handleY;
    if (Math.sqrt(dx * dx + dy * dy) <= 35) {
      this.isDragging = true;
      this.canvas.setPointerCapture(e.pointerId);
      audio.playPop(400, 0.05);
    }
  }

  onPointerMove(e) {
    if (!this.isDragging) return;

    const coords = this.getCanvasCoords(e);
    const originX = this.canvas.width / 2;
    const originY = this.canvas.height * 0.75;

    let rad = Math.atan2(originY - coords.y, originX - coords.x);
    let deg = (rad * 180) / Math.PI;

    if (deg < 0) {
      if (coords.x > originX) deg = 0;
      else deg = 180;
    }
    deg = Math.max(0, Math.min(180, deg));

    this.currentAngle = Math.round(deg);
    const diff = Math.abs(this.currentAngle - this.targetAngle);

    if (diff <= 2 && !this.celebrated) {
      this.celebrated = true;
      audio.playCelebration();
      this.spawnConfetti();
      speakMascot(`AMAZING! You constructed ${this.currentAngle}°! Perfectly matched target ${this.targetAngle}°! 🎉✨`, 'excited');
    } else if (diff > 2) {
      this.celebrated = false;
    }

    this.updateUI();
    this.render();
  }

  onPointerUp(e) {
    if (this.isDragging) {
      this.isDragging = false;
      try {
        this.canvas.releasePointerCapture(e.pointerId);
      } catch (eRelease) {
        console.warn('Pointer capture release note:', eRelease);
      }
    }
  }

  spawnConfetti() {
    const originX = this.canvas.width / 2;
    const originY = this.canvas.height * 0.5;
    const colors = ['#FF6B9B', '#FF9F43', '#FECA57', '#1DD1A1', '#48DBFB', '#54A0FF', '#9B59B6'];

    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 12,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0
      });
    }
  }

  updateUI() {
    const diffDisplay = document.getElementById('construct-diff-display');
    const progressFill = document.getElementById('construct-progress-fill');
    const statusMsg = document.getElementById('construct-status-msg');

    const diff = Math.abs(this.currentAngle - this.targetAngle);

    if (diffDisplay) {
      if (diff === 0) {
        diffDisplay.textContent = '🎯 Perfect Match! (0° away)';
      } else {
        diffDisplay.textContent = `You are ${diff}° away`;
      }
    }

    const accuracyPct = Math.max(0, Math.min(100, 100 - (diff / 90) * 100));
    if (progressFill) {
      progressFill.style.width = `${accuracyPct}%`;
    }

    if (statusMsg) {
      if (diff <= 2) {
        statusMsg.textContent = '🎉 Awesome! You built it super accurately!';
      } else if (diff <= 10) {
        statusMsg.textContent = '🔥 So close! Just a tiny adjustment needed!';
      } else {
        statusMsg.textContent = 'Keep dragging the ray to reach your target!';
      }
    }
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);

    const originX = width / 2;
    const originY = height * 0.75;
    const rayLength = 160;

    if (this.showProtractor) {
      drawVirtualProtractor(ctx, originX, originY, 150);
    }

    ctx.beginPath();
    ctx.moveTo(originX - rayLength - 20, originY);
    ctx.lineTo(originX + rayLength + 20, originY);
    ctx.strokeStyle = '#54A0FF';
    ctx.lineWidth = 4;
    ctx.stroke();

    for (let x = originX - rayLength; x <= originX + rayLength; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, originY);
      ctx.lineTo(x, originY + 8);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    const targetRad = (this.targetAngle * Math.PI) / 180;
    const targetX = originX - Math.cos(targetRad) * rayLength;
    const targetY = originY - Math.sin(targetRad) * rayLength;

    ctx.beginPath();
    ctx.setLineDash([6, 6]);
    ctx.moveTo(originX, originY);
    ctx.lineTo(targetX, targetY);
    ctx.strokeStyle = '#FECA5788';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.setLineDash([]);

    const currentRad = (this.currentAngle * Math.PI) / 180;
    const currentX = originX - Math.cos(currentRad) * rayLength;
    const currentY = originY - Math.sin(currentRad) * rayLength;

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = '#FF9F43';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(originX, originY, 50, 0, -currentRad, true);
    ctx.strokeStyle = '#1DD1A1';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.currentAngle}°`, currentX, currentY - 22);

    ctx.beginPath();
    ctx.arc(originX, originY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#FECA57';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(currentX, currentY, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#FF9F43';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    if (this.particles.length > 0) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life -= 0.02;

        if (p.life <= 0) {
          this.particles.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }
      requestAnimationFrame(() => this.render());
    }
  }
}

// ==========================================
// 6. Reflection Prompts Engine
// ==========================================
class ReflectionEngine {
  constructor() {
    this.questions = {
      playground: [
        "What happens to the angle type when you drag past 90°?",
        "How is a 90° right angle different from an acute angle?",
        "What do you notice when the angle reaches 180°?"
      ],
      polygon: [
        "What do you notice about the interior angle when there are more sides?",
        "Why does a square have 90° interior angles?",
        "How does the sum of interior angles change as sides increase?"
      ],
      construct: [
        "Can you build 150° without using the protractor?",
        "Which was easier to construct: 35° or 90°? Why?",
        "How close can you get to your target angle on the first try?"
      ]
    };

    this.indices = { playground: 0, polygon: 0, construct: 0 };
    this.init();
  }

  init() {
    const setupZoneReflection = (zoneKey) => {
      const nextBtn = document.getElementById(`${zoneKey === 'playground' ? 'pg' : zoneKey === 'polygon' ? 'poly' : 'construct'}-next-reflection`);
      const promptText = document.getElementById(`${zoneKey === 'playground' ? 'pg' : zoneKey === 'polygon' ? 'poly' : 'construct'}-reflection-text`);
      const inputEl = document.getElementById(`${zoneKey === 'playground' ? 'pg' : zoneKey === 'polygon' ? 'poly' : 'construct'}-reflection-input`);
      const shareBtn = document.getElementById(`${zoneKey === 'playground' ? 'pg' : zoneKey === 'polygon' ? 'poly' : 'construct'}-share-idea-btn`);

      if (nextBtn && promptText) {
        nextBtn.addEventListener('click', () => {
          audio.playPop(500, 0.05);
          this.indices[zoneKey] = (this.indices[zoneKey] + 1) % this.questions[zoneKey].length;
          promptText.textContent = this.questions[zoneKey][this.indices[zoneKey]];
        });
      }

      if (shareBtn && inputEl) {
        shareBtn.addEventListener('click', () => {
          const userText = inputEl.value.trim();
          if (userText) {
            audio.playCelebration();
            speakMascot(`💡 Brilliant idea! You shared: "${userText}"! Keep exploring! 🚀`, 'excited');
            inputEl.value = '';
          } else {
            speakMascot("Type your thoughts in the box before sharing! 💬", 'thinking');
          }
        });
      }
    };

    setupZoneReflection('playground');
    setupZoneReflection('polygon');
    setupZoneReflection('construct');
  }
}

// Global initialization listeners
document.addEventListener('DOMContentLoaded', () => {
  renderMascotSVG('happy');

  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundLabel = document.getElementById('sound-label');

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = audio.toggleSound();
      soundIcon.textContent = isMuted ? 'FFFF' : '🔊';
      soundIcon.textContent = isMuted ? 'FF' : '🔊';
      soundIcon.textContent = isMuted ? '🔈' : '🔊';
      soundLabel.textContent = isMuted ? 'Sound: OFF' : 'Sound: ON';
      soundBtn.classList.toggle('active', !isMuted);
    });
  }

  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      audio.playPop(520, 0.05);
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetZone = tab.dataset.zone;
      document.querySelectorAll('.zone-content').forEach(zone => {
        zone.classList.remove('active');
      });
      const activeZone = document.getElementById(`zone-${targetZone}`);
      if (activeZone) {
        activeZone.classList.add('active');
      }

      if (targetZone === 'playground') {
        speakMascot("Welcome to the Angle Playground! Drag the handle to measure angles! 📐✨", "happy");
      } else if (targetZone === 'polygon') {
        speakMascot("Explore regular polygons! What happens as we add more sides? 🛑", "excited");
      } else if (targetZone === 'construct') {
        speakMascot("Let's build angles! Pick a target and drag the ray! 🎯", "thinking");
      }
    });
  });

  // Initialize Engines
  window.anglePlayground = new AnglePlayground();
  window.polygonLab = new PolygonLab();
  window.constructStudio = new ConstructStudio();
  window.reflectionEngine = new ReflectionEngine();
});
