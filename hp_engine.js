// Human Protractor SVG Renderer and Engine

class HumanProtractorEngine {
  constructor() {
    this.angles = typeof ANGLES !== 'undefined' ? ANGLES : [90, 45, 120, 150];
    this.tolerance = typeof TOLERANCE !== 'undefined' ? TOLERANCE : 10;

    // Calibration state
    this.defaultCx = 960;
    this.defaultCy = 920;
    this.defaultR = 720;

    this.cx = this.defaultCx;
    this.cy = this.defaultCy;
    this.R = this.defaultR;

    this.isFlipped = false;
    this.isLightTheme = false;
    this.hideTeacherUI = false;
    this.practiceMode = false;

    // Round state
    this.currentRound = 0; // 0 to 3
    this.state = 'idle'; // 'idle', 'ready', 'countdown', 'revealed', 'finished'
    this.gifts = 0;

    this.timerSeconds = 30;
    this.readySeconds = 3;
    this.timerInterval = null;
    this.isPaused = false;

    // Animation state for answer arm
    this.currentSweepAngle = 0;
    this.targetAngle = 0;
    this.animFrame = null;
  }

  resetCalibration() {
    this.cx = this.defaultCx;
    this.cy = this.defaultCy;
    this.R = this.defaultR;
  }

  getAngleType(deg) {
    if (deg < 90) return 'Acute Angle';
    if (deg === 90) return 'Right Angle';
    if (deg < 180) return 'Obtuse Angle';
    if (deg === 180) return 'Straight Angle';
    return 'Reflex Angle';
  }

  polarToCartesian(deg, radius) {
    let effectiveDeg = deg;
    if (this.isFlipped) {
      effectiveDeg = 180 - deg;
    }
    const rad = (effectiveDeg * Math.PI) / 180;
    const x = this.cx + radius * Math.cos(rad);
    const y = this.cy - radius * Math.sin(rad);
    return { x, y };
  }

  renderProtractorSVG() {
    const svgWidth = 1920;
    const svgHeight = 1080;
    const outerR = this.R;
    const innerR = this.R * 0.78;

    let elements = [];

    // Outer Semicircle Body
    const pStart = this.polarToCartesian(0, outerR);
    const pEnd = this.polarToCartesian(180, outerR);

    elements.push(`<path d="M ${pStart.x} ${pStart.y} A ${outerR} ${outerR} 0 0 0 ${pEnd.x} ${pEnd.y} Z"
      fill="var(--protractor-fill)" stroke="var(--protractor-stroke)" stroke-width="6"/>`);

    // Inner cutout arc indicator
    const pInnerStart = this.polarToCartesian(0, innerR);
    const pInnerEnd = this.polarToCartesian(180, innerR);
    elements.push(`<path d="M ${pInnerStart.x} ${pInnerStart.y} A ${innerR} ${innerR} 0 0 0 ${pInnerEnd.x} ${pInnerEnd.y}"
      fill="none" stroke="var(--protractor-stroke)" stroke-width="3" stroke-dasharray="4,4"/>`);

    // Baseline horizontal line
    elements.push(`<line x1="${pStart.x}" y1="${pStart.y}" x2="${pEnd.x}" y2="${pEnd.y}" stroke="var(--protractor-stroke)" stroke-width="8"/>`);

    // Baseline labels
    const pLabel0 = this.polarToCartesian(0, outerR + 40);
    const pLabel180 = this.polarToCartesian(180, outerR + 40);
    elements.push(`<text x="${pLabel0.x}" y="${pLabel0.y}" fill="var(--text-main)" font-size="32" font-weight="bold" text-anchor="middle" dominant-baseline="middle">0°</text>`);
    elements.push(`<text x="${pLabel180.x}" y="${pLabel180.y}" fill="var(--text-main)" font-size="32" font-weight="bold" text-anchor="middle" dominant-baseline="middle">180°</text>`);

    // Ticks and Numbers
    for (let deg = 0; deg <= 180; deg++) {
      let tickLength = 12;
      let tickWidth = 2;
      let isMajor = false;

      if (deg % 10 === 0) {
        tickLength = 35;
        tickWidth = 4;
        isMajor = true;
      } else if (deg % 5 === 0) {
        tickLength = 22;
        tickWidth = 3;
      }

      const pOuter = this.polarToCartesian(deg, outerR);
      const pInner = this.polarToCartesian(deg, outerR - tickLength);

      elements.push(`<line x1="${pOuter.x}" y1="${pOuter.y}" x2="${pInner.x}" y2="${pInner.y}" stroke="var(--text-main)" stroke-width="${tickWidth}"/>`);

      if (isMajor) {
        // Outer Scale Number (0 to 180)
        const outerDegVal = deg;
        const pOuterText = this.polarToCartesian(deg, outerR - 65);
        elements.push(`<text x="${pOuterText.x}" y="${pOuterText.y}" fill="var(--text-main)" font-size="28" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${outerDegVal}</text>`);

        // Inner Scale Number (180 to 0)
        const innerDegVal = 180 - deg;
        const pInnerText = this.polarToCartesian(deg, innerR - 35);
        elements.push(`<text x="${pInnerText.x}" y="${pInnerText.y}" fill="var(--accent-cyan)" font-size="22" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${innerDegVal}</text>`);
      }
    }

    // 90 Degree Marker
    const p90Outer = this.polarToCartesian(90, outerR + 15);
    const p90Inner = this.polarToCartesian(90, outerR - 45);
    elements.push(`<line x1="${p90Outer.x}" y1="${p90Outer.y}" x2="${p90Inner.x}" y2="${p90Inner.y}" stroke="var(--accent-yellow)" stroke-width="6"/>`);
    const sqSize = 30;
    const pSq1 = this.polarToCartesian(0, sqSize);
    const pSq2 = { x: pSq1.x, y: this.cy - sqSize };
    const pSq3 = { x: this.cx, y: this.cy - sqSize };
    elements.push(`<path d="M ${this.cx} ${this.cy} L ${pSq1.x} ${pSq1.y} L ${pSq2.x} ${pSq2.y} L ${pSq3.x} ${pSq3.y} Z" fill="none" stroke="var(--accent-yellow)" stroke-width="3"/>`);

    // Center Cross-Hair
    elements.push(`<circle cx="${this.cx}" cy="${this.cy}" r="12" fill="none" stroke="var(--accent-yellow)" stroke-width="4"/>`);
    elements.push(`<line x1="${this.cx - 25}" y1="${this.cy}" x2="${this.cx + 25}" y2="${this.cy}" stroke="var(--accent-yellow)" stroke-width="3"/>`);
    elements.push(`<line x1="${this.cx}" y1="${this.cy - 25}" x2="${this.cx}" y2="${this.cy + 25}" stroke="var(--accent-yellow)" stroke-width="3"/>`);

    // Baseline Blue Arm Guide
    const pBlueEnd = this.polarToCartesian(0, outerR + 60);
    elements.push(`<line x1="${this.cx}" y1="${this.cy}" x2="${pBlueEnd.x}" y2="${pBlueEnd.y}" stroke="var(--baseline-arm)" stroke-width="12" stroke-linecap="round"/>`);
    elements.push(`<circle cx="${pBlueEnd.x}" cy="${pBlueEnd.y}" r="10" fill="var(--baseline-arm)"/>`);

    // REVEAL STATE DRAWINGS
    if (this.state === 'revealed' || this.state === 'finished') {
      const target = this.targetAngle;
      const current = this.currentSweepAngle;

      // Tolerance Wedge
      const minDeg = Math.max(0, target - this.tolerance);
      const maxDeg = Math.min(180, target + this.tolerance);
      const pWedgeMin = this.polarToCartesian(minDeg, outerR + 70);
      const pWedgeMax = this.polarToCartesian(maxDeg, outerR + 70);

      const largeArc = (maxDeg - minDeg) > 180 ? 1 : 0;
      elements.push(`<path d="M ${this.cx} ${this.cy} L ${pWedgeMin.x} ${pWedgeMin.y} A ${outerR + 70} ${outerR + 70} 0 ${largeArc} 0 ${pWedgeMax.x} ${pWedgeMax.y} Z" fill="var(--tolerance-wedge)" stroke="var(--accent-red)" stroke-width="2" stroke-dasharray="6,4"/>`);

      // Angle Arc
      if (current > 0) {
        const arcR = outerR * 0.4;
        const pArcStart = this.polarToCartesian(0, arcR);
        const pArcEnd = this.polarToCartesian(current, arcR);
        elements.push(`<path d="M ${pArcStart.x} ${pArcStart.y} A ${arcR} ${arcR} 0 0 0 ${pArcEnd.x} ${pArcEnd.y}" fill="none" stroke="var(--accent-yellow)" stroke-width="8"/>`);
      }

      // Animated Red Answer Arm
      const pRedEnd = this.polarToCartesian(current, outerR + 80);
      elements.push(`<line x1="${this.cx}" y1="${this.cy}" x2="${pRedEnd.x}" y2="${pRedEnd.y}" stroke="var(--answer-arm)" stroke-width="14" stroke-linecap="round"/>`);
      elements.push(`<circle cx="${pRedEnd.x}" cy="${pRedEnd.y}" r="12" fill="var(--answer-arm)"/>`);

      // Highlight target degree label on scale
      const pHighlight = this.polarToCartesian(target, outerR + 40);
      elements.push(`<circle cx="${pHighlight.x}" cy="${pHighlight.y}" r="35" fill="rgba(239, 68, 68, 0.8)"/>`);
      elements.push(`<text x="${pHighlight.x}" y="${pHighlight.y}" fill="#ffffff" font-size="28" font-weight="900" text-anchor="middle" dominant-baseline="middle">${target}°</text>`);
    }

    return `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      ${elements.join('')}
    </svg>`;
  }
}

const hpEngine = new HumanProtractorEngine();
