/* ==========================================================================
   Angles Around Us - Angle Detective Town
   Interactive JavaScript Application
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. SOUND EFFECTS SYSTEM (Web Audio API)
     Muted by default, activated on user toggle.
     ------------------------------------------------------------------------ */
  let audioCtx = null;
  let isMuted = true; // Muted by default as per guidelines

  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = document.getElementById('sound-text');

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  soundToggleBtn.addEventListener('click', () => {
    initAudio();
    isMuted = !isMuted;
    if (isMuted) {
      soundIcon.textContent = '🔈';
      soundText.textContent = 'Sound: OFF';
    } else {
      soundIcon.textContent = '🔊';
      soundText.textContent = 'Sound: ON';
      playSound('click');
    }
  });

  function playSound(type) {
    if (isMuted || !audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'tick') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'turn') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(659.25, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(200, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'discover') {
        // Arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.connect(g);
          g.connect(audioCtx.destination);
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + idx * 0.08);
          g.gain.setValueAtTime(0.12, now + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);
          o.start(now + idx * 0.08);
          o.stop(now + idx * 0.08 + 0.15);
        });
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  /* ------------------------------------------------------------------------
     2. TAB NAVIGATION & MASCOT SPEECH GUIDE
     ------------------------------------------------------------------------ */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const placeSections = document.querySelectorAll('.place-section');
  const speechText = document.getElementById('speech-text');

  const mascotPrompts = {
    clock: "Look at the clock tower! ⏰ Drag the minute or hour hand. What angle do they make?",
    roof: "Notice how pointed the roof is! 🏠 Drag the peak up and down to see rain slide off or gather!",
    door: "Safety first! 🚪 Open the door and check if there's enough space for the person to stand safely!",
    turns: "Ready to navigate? 🤖 Turn left or right and move step-by-step to reach the star!",
    hunt: "Angle Detective on duty! 🔎 Tap all 7 glowing spots to discover hidden real-world angles!"
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      initAudio();
      playSound('click');
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      placeSections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetSection = document.getElementById(`tab-${targetTab}`);
      if (targetSection) {
        targetSection.classList.add('active');
      }

      if (mascotPrompts[targetTab]) {
        speechText.textContent = mascotPrompts[targetTab];
      }
    });
  });

  /* ------------------------------------------------------------------------
     3. HELPER MATH FUNCTIONS
     - Always calculate smaller angle between two vectors (0° to 180°).
     - Angle type categorization.
     ------------------------------------------------------------------------ */
  function getSmallerAngle(deg1, deg2) {
    let diff = Math.abs(deg1 - deg2) % 360;
    if (diff > 180) {
      diff = 360 - diff;
    }
    return Math.round(diff);
  }

  function classifyAngle(deg) {
    deg = Math.round(deg);
    if (deg === 0) return { name: 'Aligned (0°)', class: 'straight' };
    if (deg < 90) return { name: 'Acute Angle 📐', class: 'acute' };
    if (deg === 90) return { name: 'Right Angle 📐', class: 'right-angle' };
    if (deg < 180) return { name: 'Obtuse Angle 📐', class: 'obtuse' };
    if (deg === 180) return { name: 'Straight Line 📐', class: 'straight' };
    return { name: 'Angle', class: 'acute' };
  }

  /* SVG Sector Arc Generator */
  function describeArc(cx, cy, radius, startAngleDeg, endAngleDeg) {
    // Convert to radians (0 deg is UP / -90 deg standard math)
    const startRad = (startAngleDeg - 90) * Math.PI / 180.0;
    const endRad = (endAngleDeg - 90) * Math.PI / 180.0;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArcFlag = Math.abs(endAngleDeg - startAngleDeg) <= 180 ? '0' : '1';
    const sweepFlag = endAngleDeg >= startAngleDeg ? '1' : '0';

    return [
      'M', cx, cy,
      'L', x1, y1,
      'A', radius, radius, 0, largeArcFlag, sweepFlag, x2, y2,
      'Z'
    ].join(' ');
  }

  /* ------------------------------------------------------------------------
     4. PLACE 1: CLOCK TOWER LOGIC
     ------------------------------------------------------------------------ */
  const clockNumbersGroup = document.getElementById('clock-numbers');
  const minuteHandGroup = document.getElementById('minute-hand-group');
  const hourHandGroup = document.getElementById('hour-hand-group');
  const clockAngleArc = document.getElementById('clock-angle-arc');
  const digitalTimeDisplay = document.getElementById('digital-time');
  const clockAngleVal = document.getElementById('clock-angle-val');
  const clockAngleType = document.getElementById('clock-angle-type');
  const clockPresetBtns = document.querySelectorAll('.btn-preset');

  // Render clock numbers (1 to 12)
  if (clockNumbersGroup) {
    for (let i = 1; i <= 12; i++) {
      const angleRad = (i * 30 - 90) * Math.PI / 180;
      const x = 160 + 108 * Math.cos(angleRad);
      const y = 160 + 108 * Math.sin(angleRad);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y + 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#F8F9FA');
      text.setAttribute('font-size', '16');
      text.setAttribute('font-weight', 'bold');
      text.textContent = i;
      clockNumbersGroup.appendChild(text);

      // Ticks
      const tx1 = 160 + 122 * Math.cos(angleRad);
      const ty1 = 160 + 122 * Math.sin(angleRad);
      const tx2 = 160 + 128 * Math.cos(angleRad);
      const ty2 = 160 + 128 * Math.sin(angleRad);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', tx1);
      line.setAttribute('y1', ty1);
      line.setAttribute('x2', tx2);
      line.setAttribute('y2', ty2);
      line.setAttribute('stroke', '#FFD166');
      line.setAttribute('stroke-width', '3');
      clockNumbersGroup.appendChild(line);
    }
  }

  // Clock state in total minutes past 12:00 (0 to 719)
  let totalMinutes = 180; // Default 3:00

  function updateClockDisplay() {
    totalMinutes = (totalMinutes + 720) % 720;

    const hours = Math.floor(totalMinutes / 60) || 12;
    const minutes = Math.floor(totalMinutes % 60);

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    digitalTimeDisplay.textContent = `${formattedHours}:${formattedMinutes}`;

    // Calculate rotation angles from top (12 o'clock = 0 deg)
    const minuteAngle = (totalMinutes % 60) * 6; // 360° / 60 min = 6° per min
    const hourAngle = (totalMinutes / 720) * 360; // 360° / 12 hours = 0.5° per min

    minuteHandGroup.setAttribute('transform', `rotate(${minuteAngle}, 160, 160)`);
    hourHandGroup.setAttribute('transform', `rotate(${hourAngle}, 160, 160)`);

    // Smaller angle calculation (0° to 180°)
    const angleDiff = getSmallerAngle(minuteAngle, hourAngle);
    clockAngleVal.textContent = `${angleDiff}°`;

    const info = classifyAngle(angleDiff);
    clockAngleType.textContent = info.name;
    clockAngleType.className = `stat-value type-pill ${info.class}`;

    // Render Arc between hands (drawing short arc <= 180°)
    let a1 = minuteAngle;
    let a2 = hourAngle;
    let diff = (a2 - a1 + 360) % 360;

    let start = a1;
    let end = a2;
    if (diff > 180) {
      start = a2;
      end = a1;
    }

    if (Math.abs(start - end) < 0.1 || angleDiff === 0) {
      clockAngleArc.setAttribute('d', '');
    } else {
      clockAngleArc.setAttribute('d', describeArc(160, 160, 50, start, end));
    }
  }

  // Preset Buttons (3:00, 6:00, 9:00, 12:00)
  clockPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      initAudio();
      playSound('tick');
      const timeStr = btn.getAttribute('data-time');
      if (timeStr === '03:00') totalMinutes = 180;
      else if (timeStr === '06:00') totalMinutes = 360;
      else if (timeStr === '09:00') totalMinutes = 540;
      else if (timeStr === '12:00') totalMinutes = 0;

      updateClockDisplay();
    });
  });

  // Dragging clock hands via Pointer Events
  let isDraggingClock = false;
  let activeHand = null;

  function handleClockPointerDown(e, handType) {
    initAudio();
    isDraggingClock = true;
    activeHand = handType;
    e.target.setPointerCapture(e.pointerId);
  }

  function handleClockPointerMove(e) {
    if (!isDraggingClock) return;
    const svg = document.getElementById('clock-svg');
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // Angle in degrees from 12 o'clock (top) clockwise
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    if (activeHand === 'minute') {
      const min = Math.round(angle / 6) % 60;
      const currentHour = Math.floor(totalMinutes / 60);
      totalMinutes = currentHour * 60 + min;
    } else if (activeHand === 'hour') {
      const hourVal = (angle / 30) % 12;
      totalMinutes = Math.round(hourVal * 60);
    }

    updateClockDisplay();
    playSound('tick');
  }

  function handleClockPointerUp(e) {
    if (isDraggingClock) {
      isDraggingClock = false;
      activeHand = null;
    }
  }

  minuteHandGroup.addEventListener('pointerdown', (e) => handleClockPointerDown(e, 'minute'));
  hourHandGroup.addEventListener('pointerdown', (e) => handleClockPointerDown(e, 'hour'));
  document.getElementById('clock-svg').addEventListener('pointermove', handleClockPointerMove);
  document.getElementById('clock-svg').addEventListener('pointerup', handleClockPointerUp);

  updateClockDisplay(); // Initialize

  /* ------------------------------------------------------------------------
     5. PLACE 2: ROOF BUILDER LOGIC
     ------------------------------------------------------------------------ */
  const roofPolygon = document.getElementById('roof-polygon');
  const roofAngleArc = document.getElementById('roof-angle-arc');
  const roofHandle = document.getElementById('roof-handle');
  const roofHandleOuter = document.getElementById('roof-handle-outer');
  const roofAngleVal = document.getElementById('roof-angle-val');
  const roofAngleType = document.getElementById('roof-angle-type');
  const roofWeatherStatus = document.getElementById('roof-weather-status');
  const roofStatusText = document.getElementById('roof-status-text');
  const roofRaindropsGroup = document.getElementById('roof-raindrops');
  const roofPuddlesGroup = document.getElementById('roof-puddles');

  // Roof apex drag state (Peak Y between 40px [steep, ~60°] and 130px [flat, ~150°])
  let roofApexY = 70;
  const houseLeftX = 70;
  const houseRightX = 290;
  const houseRoofBaseY = 150;
  const roofApexX = 180;

  function updateRoofDisplay() {
    // Roof apex angle at top (Apex = (180, roofApexY))
    // Left vector: (70 - 180, 150 - roofApexY) = (-110, 150 - roofApexY)
    // Right vector: (290 - 180, 150 - roofApexY) = (110, 150 - roofApexY)
    const halfWidth = 110;
    const height = houseRoofBaseY - roofApexY;

    // Angle at peak in degrees = 2 * atan(halfWidth / height) in deg
    let angleRad = 2 * Math.atan2(halfWidth, height);
    let angleDeg = Math.round(angleRad * (180 / Math.PI));

    // Clamp angle representation between 60° and 150°
    if (angleDeg < 60) angleDeg = 60;
    if (angleDeg > 150) angleDeg = 150;

    // Update Roof Polygon
    roofPolygon.setAttribute('points', `${houseLeftX},${houseRoofBaseY} ${roofApexX},${roofApexY} ${houseRightX},${houseRoofBaseY}`);

    // Update Handle Group Position
    roofHandle.setAttribute('transform', `translate(0, ${roofApexY - 70})`);

    // Update Stats
    roofAngleVal.textContent = `${angleDeg}°`;
    const info = classifyAngle(angleDeg);
    roofAngleType.textContent = info.name;
    roofAngleType.className = `stat-value type-pill ${info.class}`;

    // Render Arc at apex
    const arcRadius = 30;
    const leftAngle = Math.atan2(houseRoofBaseY - roofApexY, houseLeftX - roofApexX) * (180 / Math.PI) + 90;
    const rightAngle = Math.atan2(houseRoofBaseY - roofApexY, houseRightX - roofApexX) * (180 / Math.PI) + 90;

    roofAngleArc.setAttribute('d', describeArc(roofApexX, roofApexY, arcRadius, leftAngle, rightAngle));

    // Dynamic Weather Status (Steep vs Flat)
    if (angleDeg <= 100) {
      roofWeatherStatus.className = 'weather-status steep-status';
      roofStatusText.textContent = `Steep roof (${angleDeg}°) — Rain slides off quickly! 🌧️⚡`;
      renderRaindrops(true);
    } else {
      roofWeatherStatus.className = 'weather-status flat-status';
      roofStatusText.textContent = `Flat roof (${angleDeg}°) — Puddles collect on the top! 🌧️⚠️`;
      renderRaindrops(false);
    }
  }

  function renderRaindrops(isSteep) {
    roofRaindropsGroup.innerHTML = '';
    roofPuddlesGroup.innerHTML = '';

    if (isSteep) {
      // Animated falling raindrops sliding down left and right slopes
      for (let i = 0; i < 6; i++) {
        const drop = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        drop.setAttribute('r', '3');
        drop.setAttribute('class', 'raindrop');

        // Stagger positions along roof slope
        const t = (i / 5);
        const x = houseLeftX + t * (roofApexX - houseLeftX);
        const y = houseRoofBaseY + t * (roofApexY - houseRoofBaseY);

        drop.setAttribute('cx', x);
        drop.setAttribute('cy', y - 5);
        drop.style.animationDelay = `${i * 0.15}s`;
        roofRaindropsGroup.appendChild(drop);
      }
    } else {
      // Puddle circles collecting near apex on roof
      const puddle1 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      puddle1.setAttribute('cx', roofApexX - 15);
      puddle1.setAttribute('cy', roofApexY + 8);
      puddle1.setAttribute('rx', '18');
      puddle1.setAttribute('ry', '4');
      puddle1.setAttribute('fill', '#00B4D8');
      puddle1.setAttribute('opacity', '0.8');

      const puddle2 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      puddle2.setAttribute('cx', roofApexX + 15);
      puddle2.setAttribute('cy', roofApexY + 8);
      puddle2.setAttribute('rx', '20');
      puddle2.setAttribute('ry', '5');
      puddle2.setAttribute('fill', '#00B4D8');
      puddle2.setAttribute('opacity', '0.8');

      roofPuddlesGroup.appendChild(puddle1);
      roofPuddlesGroup.appendChild(puddle2);
    }
  }

  let isDraggingRoof = false;

  roofHandle.addEventListener('pointerdown', (e) => {
    initAudio();
    isDraggingRoof = true;
    roofHandleOuter.setAttribute('fill', '#FFD166');
    e.target.setPointerCapture(e.pointerId);
  });

  document.getElementById('roof-svg').addEventListener('pointermove', (e) => {
    if (!isDraggingRoof) return;
    const svg = document.getElementById('roof-svg');
    const rect = svg.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    // Scale SVG viewport coordinates
    const scaleY = 280 / rect.height;
    let svgY = mouseY * scaleY;

    // Limit Apex Y between 35px (~60° angle) and 130px (~150° angle)
    if (svgY < 35) svgY = 35;
    if (svgY > 130) svgY = 130;

    roofApexY = svgY;
    updateRoofDisplay();
    playSound('tick');
  });

  const stopRoofDrag = () => {
    if (isDraggingRoof) {
      isDraggingRoof = false;
      roofHandleOuter.setAttribute('fill', '#EF476F');
    }
  };

  document.getElementById('roof-svg').addEventListener('pointerup', stopRoofDrag);
  document.getElementById('roof-svg').addEventListener('pointercancel', stopRoofDrag);

  updateRoofDisplay(); // Initialize

  /* ------------------------------------------------------------------------
     6. PLACE 3: DOOR SAFETY LOGIC
     ------------------------------------------------------------------------ */
  const doorSector = document.getElementById('door-sector');
  const doorBlade = document.getElementById('door-blade');
  const doorHandleGroup = document.getElementById('door-handle-group');
  const personGroup = document.getElementById('person-group');
  const doorAngleVal = document.getElementById('door-angle-val');
  const doorAngleType = document.getElementById('door-angle-type');
  const doorSafetyAlert = document.getElementById('door-safety-alert');
  const safetyIcon = document.getElementById('safety-icon');
  const safetyText = document.getElementById('safety-text');

  // Door hinge point (120, 140), door blade length 120
  const hingeX = 120;
  const hingeY = 140;
  const doorLength = 120;

  let doorAngleDeg = 45; // Default 45° open
  let personX = 220;
  let personY = 80;

  function updateDoorDisplay() {
    // Clamp door angle 0° to 180°
    if (doorAngleDeg < 0) doorAngleDeg = 0;
    if (doorAngleDeg > 180) doorAngleDeg = 180;

    doorAngleVal.textContent = `${Math.round(doorAngleDeg)}°`;
    const info = classifyAngle(doorAngleDeg);
    doorAngleType.textContent = info.name;
    doorAngleType.className = `stat-value type-pill ${info.class}`;

    // Calculate door tip position
    // 0° is closed (pointing right along +X axis, angle 90 in SVG standard)
    // Opening counter-clockwise / upward (angle = 0° to 180°)
    const doorRad = (doorAngleDeg) * Math.PI / 180;
    const tipX = hingeX + doorLength * Math.cos(doorRad);
    const tipY = hingeY - doorLength * Math.sin(doorRad);

    doorBlade.setAttribute('x2', tipX);
    doorBlade.setAttribute('y2', tipY);
    doorHandleGroup.setAttribute('transform', `translate(${tipX - 240}, ${tipY - 140})`);

    // Draw Sector Arc from 0° up to doorAngleDeg
    if (doorAngleDeg > 0.5) {
      // Sector arc SVG from angle 0 (right) up to doorAngleDeg (counter-clockwise)
      const startAngleSVG = 90; // 0 deg in math = 90 deg from top in describeArc
      const endAngleSVG = 90 - doorAngleDeg;
      doorSector.setAttribute('d', describeArc(hingeX, hingeY, doorLength, endAngleSVG, startAngleSVG));
    } else {
      doorSector.setAttribute('d', '');
    }

    // Safety Collision Detection
    // Distance from person to hinge point
    const dx = personX - hingeX;
    const dy = personY - hingeY;
    const distToHinge = Math.sqrt(dx * dx + dy * dy);

    // Person angle relative to hinge (0° to 180° in room frame)
    let personAngleRad = Math.atan2(-dy, dx);
    let personAngleDeg = personAngleRad * (180 / Math.PI);
    if (personAngleDeg < 0) personAngleDeg += 360;

    let isInsideSwing = false;
    // Inside swing if distance <= doorLength + buffer (30px) AND angle is between 0 and doorAngleDeg
    if (distToHinge <= doorLength + 25 && personAngleDeg >= -5 && personAngleDeg <= doorAngleDeg + 5) {
      isInsideSwing = true;
    }

    if (isInsideSwing && doorAngleDeg > 0) {
      doorSector.setAttribute('fill', 'rgba(239, 71, 111, 0.45)');
      doorSector.setAttribute('stroke', '#EF476F');
      doorSafetyAlert.className = 'safety-status danger';
      safetyIcon.textContent = '⚠️';
      safetyText.textContent = "Careful! Person is in the door swing area! Leave space!";
      speechText.textContent = "Careful! Leave space for the door to open safely! 🛑";
      playSound('alert');
    } else {
      doorSector.setAttribute('fill', 'rgba(6, 214, 160, 0.3)');
      doorSector.setAttribute('stroke', '#06D6A0');
      doorSafetyAlert.className = 'safety-status safe';
      safetyIcon.textContent = '✅';
      safetyText.textContent = 'Safe! Person is standing clear of the door swing area.';
    }
  }

  let isDraggingDoor = false;
  let isDraggingPerson = false;

  doorHandleGroup.addEventListener('pointerdown', (e) => {
    initAudio();
    isDraggingDoor = true;
    e.target.setPointerCapture(e.pointerId);
  });

  personGroup.addEventListener('pointerdown', (e) => {
    initAudio();
    isDraggingPerson = true;
    e.target.setPointerCapture(e.pointerId);
  });

  document.getElementById('door-svg').addEventListener('pointermove', (e) => {
    const svg = document.getElementById('door-svg');
    const rect = svg.getBoundingClientRect();
    const scaleX = 360 / rect.width;
    const scaleY = 280 / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    if (isDraggingDoor) {
      const dx = mouseX - hingeX;
      const dy = mouseY - hingeY;
      let angle = Math.atan2(-dy, dx) * (180 / Math.PI);
      if (angle < 0) angle = 0;
      if (angle > 180) angle = 180;
      doorAngleDeg = angle;
      updateDoorDisplay();
      playSound('tick');
    } else if (isDraggingPerson) {
      // Clamp person inside room bounds
      personX = Math.max(30, Math.min(330, mouseX));
      personY = Math.max(30, Math.min(250, mouseY));
      personGroup.setAttribute('transform', `translate(${personX}, ${personY})`);
      updateDoorDisplay();
    }
  });

  const stopDoorDrag = () => {
    isDraggingDoor = false;
    isDraggingPerson = false;
  };

  document.getElementById('door-svg').addEventListener('pointerup', stopDoorDrag);
  document.getElementById('door-svg').addEventListener('pointercancel', stopDoorDrag);

  updateDoorDisplay(); // Initialize

  /* ------------------------------------------------------------------------
     7. PLACE 4: GAME TURNS LOGIC
     ------------------------------------------------------------------------ */
  const robotCharacter = document.getElementById('robot-character');
  const facingDegDisplay = document.getElementById('facing-deg');
  const turnArcOverlay = document.getElementById('turn-arc-overlay');
  const historyList = document.getElementById('history-list');
  const btnMoveForward = document.getElementById('btn-move-forward');
  const btnResetTurns = document.getElementById('btn-reset-turns');
  const turnBtns = document.querySelectorAll('.btn-turn');
  const starTarget = document.getElementById('star-target');

  // Robot Grid Position (5x5 grid, cell width = 60px, center offset = 30px)
  // Grid col 0 to 4 (X: 30, 90, 150, 210, 270)
  // Grid row 0 to 4 (Y: 30, 90, 150, 210, 270)
  let robotCol = 1; // X = 90
  let robotRow = 3; // Y = 210
  let robotFacingAngle = 0; // 0° = UP, 90° = RIGHT, 180° = DOWN, 270° = LEFT

  let starCol = 3; // X = 210
  let starRow = 1; // Y = 90

  function getFacingDirectionText(angle) {
    const norm = (angle % 360 + 360) % 360;
    if (norm === 0) return `${norm}° (UP)`;
    if (norm === 45) return `${norm}° (UP-RIGHT)`;
    if (norm === 90) return `${norm}° (RIGHT)`;
    if (norm === 135) return `${norm}° (DOWN-RIGHT)`;
    if (norm === 180) return `${norm}° (DOWN)`;
    if (norm === 225) return `${norm}° (DOWN-LEFT)`;
    if (norm === 270) return `${norm}° (LEFT)`;
    if (norm === 315) return `${norm}° (UP-LEFT)`;
    return `${norm}°`;
  }

  function updateRobotDisplay() {
    const robotX = robotCol * 60 + 30;
    const robotY = robotRow * 60 + 30;

    robotCharacter.setAttribute('transform', `translate(${robotX}, ${robotY}) rotate(${robotFacingAngle})`);
    facingDegDisplay.textContent = getFacingDirectionText(robotFacingAngle);

    // Update Star Position
    const starX = starCol * 60 + 30;
    const starY = starRow * 60 + 30;
    starTarget.setAttribute('transform', `translate(${starX}, ${starY})`);

    // Check Star Reach
    if (robotCol === starCol && robotRow === starRow) {
      playSound('discover');
      speechText.textContent = "⭐ Woohoo! You reached the star! Amazing navigation, Detective!";
      addHistoryLog("⭐ REACHED THE STAR!");
    }
  }

  function addHistoryLog(text) {
    const emptyMsg = historyList.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    const li = document.createElement('li');
    li.textContent = text;
    if (text.includes('STAR')) {
      li.className = 'star-reached';
    }
    historyList.prepend(li);
  }

  function showTurnArcEffect(turnAngle, direction) {
    const robotX = robotCol * 60 + 30;
    const robotY = robotRow * 60 + 30;

    let start = robotFacingAngle - (direction === 'right' ? turnAngle : 0);
    let end = robotFacingAngle + (direction === 'left' ? turnAngle : 0);

    turnArcOverlay.setAttribute('d', describeArc(robotX, robotY, 40, start, end));
    turnArcOverlay.style.opacity = '1';

    setTimeout(() => {
      turnArcOverlay.style.opacity = '0';
    }, 400);
  }

  turnBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      initAudio();
      playSound('turn');
      const dir = btn.getAttribute('data-dir');
      const angle = parseInt(btn.getAttribute('data-angle'), 10);

      const oldFacing = robotFacingAngle;
      if (dir === 'left') {
        robotFacingAngle = (robotFacingAngle - angle + 360) % 360;
      } else {
        robotFacingAngle = (robotFacingAngle + angle) % 360;
      }

      showTurnArcEffect(angle, dir);
      updateRobotDisplay();
      addHistoryLog(`Turn ${dir} ${angle}° ➔ Facing ${getFacingDirectionText(robotFacingAngle)}`);
    });
  });

  btnMoveForward.addEventListener('click', () => {
    initAudio();
    playSound('click');

    // Movement vector based on facing angle
    const norm = (robotFacingAngle % 360 + 360) % 360;
    let dr = 0, dc = 0;

    if (norm === 0) dr = -1; // UP
    else if (norm === 45) { dr = -1; dc = 1; } // UP-RIGHT
    else if (norm === 90) dc = 1; // RIGHT
    else if (norm === 135) { dr = 1; dc = 1; } // DOWN-RIGHT
    else if (norm === 180) dr = 1; // DOWN
    else if (norm === 225) { dr = 1; dc = -1; } // DOWN-LEFT
    else if (norm === 270) dc = -1; // LEFT
    else if (norm === 315) { dr = -1; dc = -1; } // UP-LEFT

    const newRow = robotRow + dr;
    const newCol = robotCol + dc;

    // Check bounds (0 to 4)
    if (newRow >= 0 && newRow <= 4 && newCol >= 0 && newCol <= 4) {
      robotRow = newRow;
      robotCol = newCol;
      updateRobotDisplay();
      addHistoryLog(`Moved forward 1 step`);
    } else {
      playSound('alert');
      speechText.textContent = "Oops! That's the edge of the board. Turn around to stay on grid! 🛑";
    }
  });

  btnResetTurns.addEventListener('click', () => {
    initAudio();
    playSound('click');
    robotCol = 1;
    robotRow = 3;
    robotFacingAngle = 0;
    historyList.innerHTML = '<li class="empty-msg">No moves yet. Try turning or moving!</li>';
    updateRobotDisplay();
  });

  updateRobotDisplay(); // Initialize

  /* ------------------------------------------------------------------------
     8. PLACE 5: ANGLE HUNT LOGIC
     ------------------------------------------------------------------------ */
  const huntModal = document.getElementById('hunt-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalIcon = document.getElementById('modal-icon');
  const modalAngleVal = document.getElementById('modal-angle-val');
  const modalAngleType = document.getElementById('modal-angle-type');
  const modalFact = document.getElementById('modal-fact');
  const modalSvgContainer = document.getElementById('modal-svg-container');
  const huntProgressText = document.getElementById('hunt-progress-text');
  const huntProgressFill = document.getElementById('hunt-progress-fill');

  const hotspotData = {
    swing: {
      title: "Playground Swing",
      icon: "🛝",
      angle: 45,
      type: "Acute Angle 📐",
      typeClass: "acute",
      fact: "The swing chains form a sharp acute angle (45°) at the top beam so it stays strong and balanced while you swing high!",
      previewSvg: `<svg viewBox="0 0 160 160" width="140" height="140">
        <line x1="20" y1="140" x2="80" y2="20" stroke="#E07A5F" stroke-width="8"/>
        <line x1="140" y1="140" x2="80" y2="20" stroke="#E07A5F" stroke-width="8"/>
        <path d="M 68 50 A 30 30 0 0 1 92 50" fill="none" stroke="#FFD166" stroke-width="4"/>
        <text x="80" y="80" text-anchor="middle" fill="#FFD166" font-size="16" font-weight="bold">45°</text>
      </svg>`
    },
    laptop: {
      title: "Open Laptop Screen",
      icon: "💻",
      angle: 120,
      type: "Obtuse Angle 📐",
      typeClass: "obtuse",
      fact: "When you open a laptop screen to 120°, it creates a wide obtuse angle so you can view the screen comfortably!",
      previewSvg: `<svg viewBox="0 0 160 160" width="140" height="140">
        <line x1="30" y1="120" x2="130" y2="120" stroke="#8D99AE" stroke-width="8"/>
        <line x1="130" y1="120" x2="60" y2="30" stroke="#118AB2" stroke-width="8"/>
        <path d="M 110 120 A 25 25 0 0 0 115 100" fill="none" stroke="#FFD166" stroke-width="4"/>
        <text x="80" y="80" text-anchor="middle" fill="#FFD166" font-size="16" font-weight="bold">120°</text>
      </svg>`
    },
    scissors: {
      title: "Open Scissors",
      icon: "✂️",
      angle: 35,
      type: "Acute Angle 📐",
      typeClass: "acute",
      fact: "Scissors form an acute angle when open. A sharp acute vertex helps concentrate force to cut paper easily!",
      previewSvg: `<svg viewBox="0 0 160 160" width="140" height="140">
        <line x1="20" y1="130" x2="140" y2="30" stroke="#C0C0C0" stroke-width="8"/>
        <line x1="20" y1="30" x2="140" y2="130" stroke="#C0C0C0" stroke-width="8"/>
        <circle cx="80" cy="80" r="8" fill="#EF476F"/>
        <path d="M 100 63 A 25 25 0 0 1 100 97" fill="none" stroke="#FFD166" stroke-width="4"/>
        <text x="125" y="85" text-anchor="middle" fill="#FFD166" font-size="16" font-weight="bold">35°</text>
      </svg>`
    },
    pizza: {
      title: "Slice of Pizza",
      icon: "🍕",
      angle: 45,
      type: "Acute Angle 📐",
      typeClass: "acute",
      fact: "Cutting a round pizza into 8 equal slices gives each slice a tasty 45° acute angle at the tip! (8 x 45° = 360°)",
      previewSvg: `<svg viewBox="0 0 160 160" width="140" height="140">
        <path d="M 30 80 L 130 30 A 100 100 0 0 1 130 130 Z" fill="#FFB703" stroke="#FB8500" stroke-width="4"/>
        <path d="M 60 67 A 30 30 0 0 1 60 93" fill="none" stroke="#EF476F" stroke-width="4"/>
        <text x="75" y="85" text-anchor="middle" fill="#073B4C" font-size="16" font-weight="bold">45°</text>
      </svg>`
    },
    ladder: {
      title: "Safety Ladder",
      icon: "🪜",
      angle: 75,
      type: "Acute Angle 📐",
      typeClass: "acute",
      fact: "Safety experts recommend leaning a ladder at a 75° acute angle with the ground so it won't slip or fall backwards!",
      previewSvg: `<svg viewBox="0 0 160 160" width="140" height="140">
        <line x1="20" y1="140" x2="140" y2="140" stroke="#8D99AE" stroke-width="6"/>
        <line x1="140" y1="140" x2="140" y2="20" stroke="#8D99AE" stroke-width="6"/>
        <line x1="30" y1="140" x2="120" y2="20" stroke="#F4A261" stroke-width="8"/>
        <path d="M 60 140 A 30 30 0 0 1 52 110" fill="none" stroke="#FFD166" stroke-width="4"/>
        <text x="70" y="115" text-anchor="middle" fill="#FFD166" font-size="16" font-weight="bold">75°</text>
      </svg>`
    },
    ramp: {
      title: "Skate Park Ramp",
      icon: "🛹",
      angle: 150,
      type: "Obtuse Angle 📐",
      typeClass: "obtuse",
      fact: "A wide 150° obtuse angle ramp creates a smooth gentle slope that lets skateboarders glide safely up and down!",
      previewSvg: `<svg viewBox="0 0 160 160" width="140" height="140">
        <polygon points="20,130 140,130 140,70" fill="#E07A5F" stroke="#073B4C" stroke-width="4"/>
        <path d="M 115 130 A 25 25 0 0 1 125 115" fill="none" stroke="#FFD166" stroke-width="4"/>
        <text x="90" y="110" text-anchor="middle" fill="#FFD166" font-size="16" font-weight="bold">150°</text>
      </svg>`
    },
    signpost: {
      title: "Street Signpost",
      icon: "🪧",
      angle: 90,
      type: "Right Angle 📐",
      typeClass: "right-angle",
      fact: "The sign meets the vertical post at a perfect 90° right angle, making it sturdy and easy to read from far away!",
      previewSvg: `<svg viewBox="0 0 160 160" width="140" height="140">
        <line x1="50" y1="140" x2="50" y2="20" stroke="#8D99AE" stroke-width="8"/>
        <rect x="50" y="40" width="80" height="30" fill="#06D6A0" stroke="#073B4C" stroke-width="3"/>
        <rect x="50" y="55" width="15" height="15" fill="none" stroke="#FFD166" stroke-width="3"/>
        <text x="85" y="100" text-anchor="middle" fill="#FFD166" font-size="16" font-weight="bold">90°</text>
      </svg>`
    }
  };

  const foundHotspots = new Set();

  document.querySelectorAll('.hotspot-item').forEach(item => {
    item.addEventListener('click', () => {
      initAudio();
      playSound('discover');
      const id = item.getAttribute('data-id');
      const data = hotspotData[id];

      if (data) {
        foundHotspots.add(id);
        item.classList.add('found');

        modalTitle.textContent = data.title;
        modalIcon.textContent = data.icon;
        modalAngleVal.textContent = `${data.angle}°`;
        modalAngleType.textContent = data.type;
        modalAngleType.className = `stat-value type-pill ${data.typeClass}`;
        modalFact.textContent = data.fact;
        modalSvgContainer.innerHTML = data.previewSvg;

        huntModal.classList.remove('hidden');

        // Update discovery meter
        const foundCount = foundHotspots.size;
        huntProgressText.textContent = `Found ${foundCount} of 7 angles`;
        huntProgressFill.style.width = `${(foundCount / 7) * 100}%`;

        if (foundCount === 7) {
          speechText.textContent = "🎉 Outstanding! You found all 7 angles in Angle Detective Town! You are a master Angle Detective! 🕵️‍♂️✨";
        }
      }
    });
  });

  modalCloseBtn.addEventListener('click', () => {
    initAudio();
    playSound('click');
    huntModal.classList.add('hidden');
  });

  huntModal.addEventListener('click', (e) => {
    if (e.target === huntModal) {
      huntModal.classList.add('hidden');
    }
  });

  /* ------------------------------------------------------------------------
     9. REFLECTION CARDS ("Share my idea" logic)
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.reflection-card').forEach(card => {
    const btnShare = card.querySelector('.btn-share');
    const input = card.querySelector('.reflection-input');
    const bubbleContainer = card.querySelector('.shared-bubble-container');

    btnShare.addEventListener('click', () => {
      initAudio();
      const text = input.value.trim();
      if (!text) return;

      playSound('click');

      const bubble = document.createElement('div');
      bubble.className = 'user-idea-bubble';
      bubble.textContent = `💡 "${text}"`;

      bubbleContainer.innerHTML = ''; // Replace previous or append
      bubbleContainer.appendChild(bubble);

      input.value = ''; // Clear text box after sharing
      speechText.textContent = "Awesome idea! Sharing your thoughts helps you learn geometry deeper! 🌟";
    });
  });

});
