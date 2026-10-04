// Human Protractor Overlay UI and Keyboard Shortcuts Handler

function startHumanProtractorIntro() {
  sounds.playTick();
  hpEngine.currentRound = 0;
  hpEngine.state = 'idle';
  hpEngine.gifts = 0;
  showScreen('hp-game');
  renderHumanProtractorUI();
}

function renderHumanProtractorUI() {
  // Theme attribute
  document.documentElement.setAttribute('data-theme', hpEngine.isLightTheme ? 'light' : 'dark');

  // Render SVG Canvas
  const canvasContainer = document.getElementById('hp-canvas-container');
  if (canvasContainer) {
    canvasContainer.innerHTML = hpEngine.renderProtractorSVG();
  }

  // Teacher UI visibility
  const overlayUI = document.getElementById('hp-overlay-ui');
  if (overlayUI) {
    overlayUI.style.display = hpEngine.hideTeacherUI ? 'none' : 'flex';
  }

  const currentAngleTarget = hpEngine.angles[hpEngine.currentRound] || 90;
  const targetLabel = document.getElementById('hp-target-angle');
  const roundLabel = document.getElementById('hp-round-info');
  const typeHint = document.getElementById('hp-type-hint');
  const countdownTimer = document.getElementById('hp-countdown-timer');

  if (targetLabel) targetLabel.textContent = `Make an angle of ${currentAngleTarget}°`;
  if (roundLabel) roundLabel.textContent = `Round ${hpEngine.currentRound + 1} of ${hpEngine.angles.length}`;

  if (typeHint) {
    if (hpEngine.practiceMode || hpEngine.state === 'revealed') {
      typeHint.textContent = `Type: ${hpEngine.getAngleType(currentAngleTarget)}`;
      typeHint.style.display = 'block';
    } else {
      typeHint.style.display = 'none';
    }
  }

  if (countdownTimer) {
    if (hpEngine.state === 'ready') {
      countdownTimer.textContent = `Get Ready! ${hpEngine.readySeconds}`;
      countdownTimer.style.color = 'var(--accent-yellow)';
    } else if (hpEngine.state === 'countdown') {
      countdownTimer.textContent = `⏱️ ${hpEngine.timerSeconds}s`;
      countdownTimer.style.color = hpEngine.timerSeconds <= 5 ? 'var(--accent-red)' : 'var(--text-main)';
    } else if (hpEngine.state === 'revealed') {
      countdownTimer.textContent = `REVEALED!`;
      countdownTimer.style.color = 'var(--accent-green)';
    } else {
      countdownTimer.textContent = `30s Timer`;
      countdownTimer.style.color = 'var(--text-main)';
    }
  }

  // Teacher Evaluation Buttons
  const evalBtns = document.getElementById('hp-eval-buttons');
  const startNextBtn = document.getElementById('hp-btn-start-next');
  if (evalBtns && startNextBtn) {
    if (hpEngine.state === 'revealed') {
      evalBtns.style.display = 'flex';
      startNextBtn.style.display = 'none';
    } else {
      evalBtns.style.display = 'none';
      startNextBtn.style.display = 'flex';
    }
  }

  // Gift Counter
  const giftCountEl = document.getElementById('hp-gift-count');
  if (giftCountEl) giftCountEl.textContent = `🎁 Gifts: ${hpEngine.gifts}`;
}

function startNextHPRound() {
  if (hpEngine.state === 'countdown' || hpEngine.state === 'ready') return;
  sounds.playTick();

  if (hpEngine.state === 'revealed') {
    hpEngine.currentRound++;
    if (hpEngine.currentRound >= hpEngine.angles.length) {
      showHPFinishModal();
      return;
    }
  }

  hpEngine.state = 'ready';
  hpEngine.readySeconds = 3;
  renderHumanProtractorUI();

  if (hpEngine.timerInterval) clearInterval(hpEngine.timerInterval);
  hpEngine.timerInterval = setInterval(() => {
    if (hpEngine.isPaused) return;

    if (hpEngine.state === 'ready') {
      hpEngine.readySeconds--;
      sounds.playTick();
      if (hpEngine.readySeconds <= 0) {
        hpEngine.state = 'countdown';
        hpEngine.timerSeconds = 30;
      }
    } else if (hpEngine.state === 'countdown') {
      hpEngine.timerSeconds--;
      if (hpEngine.timerSeconds <= 5 && hpEngine.timerSeconds > 0) {
        sounds.playTick();
      }
      if (hpEngine.timerSeconds <= 0) {
        clearInterval(hpEngine.timerInterval);
        sounds.playTimeUp();
        revealHPAngle();
      }
    }
    renderHumanProtractorUI();
  }, 1000);
}

function revealHPAngle() {
  if (hpEngine.state === 'revealed') return;
  if (hpEngine.timerInterval) clearInterval(hpEngine.timerInterval);

  hpEngine.state = 'revealed';
  hpEngine.targetAngle = hpEngine.angles[hpEngine.currentRound];
  hpEngine.currentSweepAngle = 0;

  // Animate sweep over 1s (approx 60 frames)
  const duration = 1000;
  const startTime = performance.now();

  function animateSweep(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    hpEngine.currentSweepAngle = hpEngine.targetAngle * progress;

    renderHumanProtractorUI();

    if (progress < 1) {
      hpEngine.animFrame = requestAnimationFrame(animateSweep);
    }
  }

  hpEngine.animFrame = requestAnimationFrame(animateSweep);
}

function recordHPResult(isSuccess) {
  sounds.playTick();
  if (isSuccess) {
    sounds.playCorrect();
    hpEngine.gifts++;
    triggerConfetti();
  }
  // Enable start next
  hpEngine.state = 'revealed'; // keep revealed, allow start next
  renderHumanProtractorUI();
  document.getElementById('hp-eval-buttons').style.display = 'none';
  document.getElementById('hp-btn-start-next').style.display = 'flex';
}

function showHPFinishModal() {
  hpEngine.state = 'finished';
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content">
      <h1 class="title-large" style="color: var(--accent-yellow)">Great job, Protractors! 🎉</h1>
      <p class="instruction-text">Total Gifts Earned: 🎁 ${hpEngine.gifts}</p>
      <button class="btn btn-success" id="btn-hp-replay">Play Again 🔄</button>
      <button class="btn btn-purple" id="btn-hp-home">Main Menu 🏠</button>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('btn-hp-replay').onclick = () => {
    sounds.playTick();
    document.body.removeChild(overlay);
    startHumanProtractorIntro();
  };
  document.getElementById('btn-hp-home').onclick = () => {
    sounds.playTick();
    document.body.removeChild(overlay);
    goHome();
  };
}

function triggerConfetti() {
  // Lightweight Web Audio or DOM animation
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '200';

  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = `-20px`;
    confetti.style.width = '15px';
    confetti.style.height = '15px';
    confetti.style.backgroundColor = ['#22c55e', '#eab308', '#ef4444', '#06b6d4', '#a855f7'][Math.floor(Math.random() * 5)];
    confetti.style.borderRadius = '50%';
    confetti.style.transition = 'all 1.5s ease-out';
    container.appendChild(confetti);

    setTimeout(() => {
      confetti.style.transform = `translateY(${window.innerHeight + 50}px) rotate(${Math.random() * 360}deg)`;
      confetti.style.opacity = '0';
    }, 50);
  }

  document.body.appendChild(container);
  setTimeout(() => document.body.removeChild(container), 1600);
}

// Global Keyboard Listener for Teacher Controls
window.addEventListener('keydown', (e) => {
  // Only handle if human protractor screen is active
  const hpScreen = document.getElementById('screen-hp-game');
  if (!hpScreen || hpScreen.classList.contains('hidden')) return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      if (hpEngine.state === 'revealed') {
        startNextHPRound();
      } else if (hpEngine.state === 'idle') {
        startNextHPRound();
      }
      break;
    case 'KeyR':
      e.preventDefault();
      revealHPAngle();
      break;
    case 'KeyP':
      e.preventDefault();
      hpEngine.isPaused = !hpEngine.isPaused;
      break;
    case 'KeyM':
      e.preventDefault();
      toggleMute();
      break;
    case 'KeyF':
      e.preventDefault();
      hpEngine.isFlipped = !hpEngine.isFlipped;
      renderHumanProtractorUI();
      break;
    case 'KeyT':
      e.preventDefault();
      hpEngine.isLightTheme = !hpEngine.isLightTheme;
      renderHumanProtractorUI();
      break;
    case 'KeyH':
      e.preventDefault();
      hpEngine.hideTeacherUI = !hpEngine.hideTeacherUI;
      renderHumanProtractorUI();
      break;
    case 'ArrowUp':
      e.preventDefault();
      hpEngine.cy -= 15;
      renderHumanProtractorUI();
      break;
    case 'ArrowDown':
      e.preventDefault();
      hpEngine.cy += 15;
      renderHumanProtractorUI();
      break;
    case 'Equal': // +
    case 'NumpadAdd':
      e.preventDefault();
      hpEngine.R += 20;
      renderHumanProtractorUI();
      break;
    case 'Minus': // -
    case 'NumpadSubtract':
      e.preventDefault();
      hpEngine.R = Math.max(200, hpEngine.R - 20);
      renderHumanProtractorUI();
      break;
    case 'Digit0':
    case 'Numpad0':
      e.preventDefault();
      hpEngine.resetCalibration();
      renderHumanProtractorUI();
      break;
  }
});
