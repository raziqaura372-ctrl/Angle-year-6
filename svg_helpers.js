// SVG Diagram Helper for Escape Room Questions
function generateQuestionSVG(questionId) {
  const w = 400;
  const h = 260;
  const cx = 200;
  const cy = 170;

  switch (questionId) {
    case 1: { // 40 deg acute angle
      const rad = (40 * Math.PI) / 180;
      const r = 120;
      const x2 = cx + r * Math.cos(-rad);
      const y2 = cy + r * Math.sin(-rad);
      const arcR = 40;
      const ax = cx + arcR * Math.cos(-rad);
      const ay = cy + arcR * Math.sin(-rad);
      return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#60a5fa" stroke-width="6" stroke-linecap="round"/>
        <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
        <path d="M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 0 0 ${ax} ${ay}" fill="none" stroke="#eab308" stroke-width="4"/>
        <circle cx="${cx}" cy="${cy}" r="6" fill="#fff"/>
      </svg>`;
    }
    case 2: { // 125 deg obtuse angle
      const rad = (125 * Math.PI) / 180;
      const r = 120;
      const x2 = cx + r * Math.cos(-rad);
      const y2 = cy + r * Math.sin(-rad);
      const arcR = 40;
      const ax = cx + arcR * Math.cos(-rad);
      const ay = cy + arcR * Math.sin(-rad);
      return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#60a5fa" stroke-width="6" stroke-linecap="round"/>
        <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
        <path d="M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 0 0 ${ax} ${ay}" fill="none" stroke="#eab308" stroke-width="4"/>
        <circle cx="${cx}" cy="${cy}" r="6" fill="#fff"/>
      </svg>`;
    }
    case 3: { // 250 deg reflex angle
      const rad = (250 * Math.PI) / 180;
      const r = 110;
      const x2 = cx + r * Math.cos(-rad);
      const y2 = cy + r * Math.sin(-rad);
      const arcR = 45;
      const ax = cx + arcR * Math.cos(-rad);
      const ay = cy + arcR * Math.sin(-rad);
      // Outer reflex arc
      return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#60a5fa" stroke-width="6" stroke-linecap="round"/>
        <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
        <path d="M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 1 1 ${ax} ${ay}" fill="none" stroke="#eab308" stroke-width="5" stroke-dasharray="6,4"/>
        <circle cx="${cx}" cy="${cy}" r="6" fill="#fff"/>
      </svg>`;
    }
    case 4: { // Line: 110 and x
      const lineY = 180;
      const splitRad = (110 * Math.PI) / 180;
      const sx = cx + 110 * Math.cos(-splitRad);
      const sy = lineY + 110 * Math.sin(-splitRad);
      return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <line x1="50" y1="${lineY}" x2="350" y2="${lineY}" stroke="#60a5fa" stroke-width="6"/>
        <line x1="${cx}" y1="${lineY}" x2="${sx}" y2="${sy}" stroke="#ef4444" stroke-width="6"/>
        <path d="M ${cx + 35} ${lineY} A 35 35 0 0 0 ${cx + 35 * Math.cos(-splitRad)} ${lineY + 35 * Math.sin(-splitRad)}" fill="none" stroke="#eab308" stroke-width="4"/>
        <text x="${cx + 45}" y="${lineY - 15}" fill="#fff" font-size="22" font-weight="bold">110°</text>
        <path d="M ${cx + 35 * Math.cos(-splitRad)} ${lineY + 35 * Math.sin(-splitRad)} A 35 35 0 0 0 ${cx - 35} ${lineY}" fill="none" stroke="#22c55e" stroke-width="4"/>
        <text x="${cx - 50}" y="${lineY - 15}" fill="#22c55e" font-size="26" font-weight="bold">x</text>
        <circle cx="${cx}" cy="${lineY}" r="6" fill="#fff"/>
      </svg>`;
    }
    case 5: { // Point: 100, 120, x
      const pY = 130;
      const r = 90;
      // Angles: 0 deg (right), 100 deg, 220 deg
      const a1 = 0;
      const a2 = -100 * Math.PI / 180;
      const a3 = -220 * Math.PI / 180;

      const x1 = cx + r * Math.cos(a1), y1 = pY + r * Math.sin(a1);
      const x2 = cx + r * Math.cos(a2), y2 = pY + r * Math.sin(a2);
      const x3 = cx + r * Math.cos(a3), y3 = pY + r * Math.sin(a3);

      return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <line x1="${cx}" y1="${pY}" x2="${x1}" y2="${y1}" stroke="#60a5fa" stroke-width="5"/>
        <line x1="${cx}" y1="${pY}" x2="${x2}" y2="${y2}" stroke="#60a5fa" stroke-width="5"/>
        <line x1="${cx}" y1="${pY}" x2="${x3}" y2="${y3}" stroke="#60a5fa" stroke-width="5"/>
        <text x="${cx + 30}" y="${pY - 25}" fill="#fff" font-size="20" font-weight="bold">100°</text>
        <text x="${cx - 55}" y="${pY - 25}" fill="#fff" font-size="20" font-weight="bold">120°</text>
        <text x="${cx - 10}" y="${pY + 50}" fill="#22c55e" font-size="26" font-weight="bold">x</text>
        <circle cx="${cx}" cy="${pY}" r="6" fill="#fff"/>
      </svg>`;
    }
    case 6: { // Triangle 50, 60, x
      return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <polygon points="100,210 300,210 180,50" fill="none" stroke="#60a5fa" stroke-width="6"/>
        <text x="135" y="195" fill="#fff" font-size="22" font-weight="bold">50°</text>
        <text x="245" y="195" fill="#fff" font-size="22" font-weight="bold">60°</text>
        <text x="170" y="90" fill="#22c55e" font-size="26" font-weight="bold">x</text>
      </svg>`;
    }
    case 7: { // Quadrilateral 90, 80, 100, x
      return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <polygon points="90,210 310,210 270,60 120,70" fill="none" stroke="#60a5fa" stroke-width="6"/>
        <text x="115" y="195" fill="#fff" font-size="20" font-weight="bold">90°</text>
        <text x="260" y="195" fill="#fff" font-size="20" font-weight="bold">80°</text>
        <text x="230" y="95" fill="#fff" font-size="20" font-weight="bold">100°</text>
        <text x="135" y="100" fill="#22c55e" font-size="26" font-weight="bold">x</text>
      </svg>`;
    }
    case 8: { // Pentagon split into 3 triangles
      return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <polygon points="200,40 320,110 280,220 120,220 80,110" fill="none" stroke="#60a5fa" stroke-width="6"/>
        <line x1="200" y1="40" x2="280" y2="220" stroke="#eab308" stroke-width="3" stroke-dasharray="6,4"/>
        <line x1="200" y1="40" x2="120" y2="220" stroke="#eab308" stroke-width="3" stroke-dasharray="6,4"/>
        <text x="190" y="140" fill="#eab308" font-size="24" font-weight="bold">3 Triangles</text>
      </svg>`;
    }
    case 9: { // Hexagon 1 interior angle x
      return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
        <polygon points="200,40 290,90 290,190 200,240 110,190 110,90" fill="none" stroke="#60a5fa" stroke-width="6"/>
        <text x="185" y="80" fill="#22c55e" font-size="26" font-weight="bold">x = ?</text>
      </svg>`;
    }
    default:
      return '';
  }
}
