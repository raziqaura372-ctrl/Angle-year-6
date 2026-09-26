import React, { useState, useEffect, useRef } from 'react';
import { Grid, Hexagon, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';

export default function PolygonGridCanvas({
  onPolygonChange = () => {},
  initialSides = 3,
  readOnly = false
}) {
  const [gridType, setGridType] = useState('square');
  const [sides, setSides] = useState(initialSides);
  const [vertices, setVertices] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const canvasRef = useRef(null);

  const center = { x: 250, y: 180 };
  const radius = 100;

  useEffect(() => {
    generateRegularPolygon(sides);
  }, [sides, gridType]);

  const generateRegularPolygon = (numSides) => {
    const newVertices = [];
    for (let i = 0; i < numSides; i++) {
      const angle = (i * 2 * Math.PI) / numSides - Math.PI / 2;
      let x = center.x + radius * Math.cos(angle);
      let y = center.y + radius * Math.sin(angle);

      if (gridType === 'square') {
        x = Math.round(x / 20) * 20;
        y = Math.round(y / 20) * 20;
      }
      newVertices.push({ x, y, label: String.fromCharCode(65 + i) });
    }
    setVertices(newVertices);
  };

  const calculateAngles = () => {
    if (vertices.length < 3) return [];

    return vertices.map((v, i) => {
      const prev = vertices[(i - 1 + vertices.length) % vertices.length];
      const next = vertices[(i + 1) % vertices.length];

      const v1 = { x: prev.x - v.x, y: prev.y - v.y };
      const v2 = { x: next.x - v.x, y: next.y - v.y };

      const dot = v1.x * v2.x + v1.y * v2.y;
      const mag1 = Math.hypot(v1.x, v1.y);
      const mag2 = Math.hypot(v2.x, v2.y);

      if (mag1 === 0 || mag2 === 0) return 0;

      let cosTheta = dot / (mag1 * mag2);
      cosTheta = Math.max(-1, Math.min(1, cosTheta));
      let angleRad = Math.acos(cosTheta);
      let angleDeg = Math.round(angleRad * (180 / Math.PI));

      return angleDeg;
    });
  };

  const angles = calculateAngles();
  const totalInteriorSum = angles.reduce((a, b) => a + b, 0);
  const expectedSum = (sides - 2) * 180;

  useEffect(() => {
    onPolygonChange({
      sides,
      vertices,
      angles,
      totalInteriorSum,
      expectedSum
    });
  }, [vertices, sides]);

  const handlePointerDown = (index, e) => {
    if (readOnly) return;
    e.stopPropagation();
    setDraggedIndex(index);
  };

  const handlePointerMove = (e) => {
    if (draggedIndex === null || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(30, Math.min(470, x));
    y = Math.max(30, Math.min(330, y));

    if (gridType === 'square') {
      x = Math.round(x / 20) * 20;
      y = Math.round(y / 20) * 20;
    } else {
      x = Math.round(x / 25) * 25;
      y = Math.round(y / 21.65) * 21.65;
    }

    const updated = [...vertices];
    updated[draggedIndex] = { ...updated[draggedIndex], x, y };
    setVertices(updated);
  };

  const handlePointerUp = () => {
    setDraggedIndex(null);
  };

  const polygonPath = vertices.length > 0
    ? vertices.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x} ${v.y}`).join(' ') + ' Z'
    : '';

  return (
    <div className="glass-panel rounded-2xl p-5 border-2 border-amber-400/40 shadow-2xl flex flex-col items-center">
      {/* Controls Header */}
      <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-amber-200 font-bold">Grid Pattern:</label>
          <button
            onClick={() => setGridType('square')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all ${
              gridType === 'square'
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                : 'bg-slate-900 text-slate-300 border-amber-400/30'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Square Grid
          </button>
          <button
            onClick={() => setGridType('isometric')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all ${
              gridType === 'isometric'
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-black shadow-md'
                : 'bg-slate-900 text-slate-300 border-amber-400/30'
            }`}
          >
            <Hexagon className="w-3.5 h-3.5" />
            Isometric Grid
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-amber-200 font-bold">Polygon Sides:</label>
          <select
            value={sides}
            onChange={(e) => setSides(parseInt(e.target.value, 10))}
            className="bg-slate-950 text-amber-200 border-2 border-amber-400/40 px-3 py-1.5 rounded-xl text-xs font-black"
          >
            {[3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n} Sides ({n === 3 ? 'Segi Tiga' : n === 4 ? 'Segi Empat' : n === 5 ? 'Pentagon' : n === 6 ? 'Heksagon' : n === 7 ? 'Heptagon' : 'Oktagon'})
              </option>
            ))}
          </select>
          <button
            onClick={() => generateRegularPolygon(sides)}
            className="p-1.5 rounded-xl bg-slate-900 text-amber-300 border border-amber-400/30 hover:text-amber-100"
            title="Reset to Regular Shape"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative border-2 border-amber-400/30 rounded-xl bg-slate-950 overflow-hidden w-full max-w-[500px]">
        <svg
          ref={canvasRef}
          viewBox="0 0 500 360"
          className="w-full h-auto"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <defs>
            <pattern id="squareGridColor" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1" />
            </pattern>
            <pattern id="isometricGridColor" width="25" height="43.3" patternUnits="userSpaceOnUse">
              <path d="M 0 21.65 L 12.5 0 L 25 21.65 L 12.5 43.3 Z M 12.5 0 L 12.5 43.3 M 0 21.65 L 25 21.65" fill="none" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="1" />
            </pattern>
            <linearGradient id="polyFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.35)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0.35)" />
            </linearGradient>
          </defs>
          <rect width="500" height="360" fill={gridType === 'square' ? "url(#squareGridColor)" : "url(#isometricGridColor)"} />

          {/* Polygon Polygon Path */}
          {polygonPath && (
            <path
              d={polygonPath}
              fill="url(#polyFillGrad)"
              stroke="#FFE600"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          )}

          {/* Jewel Vertex Nodes */}
          {vertices.map((v, i) => (
            <g key={i}>
              <circle
                cx={v.x}
                cy={v.y}
                r="12"
                fill="#EF4444"
                stroke="#FFFFFF"
                strokeWidth="3"
                onPointerDown={(e) => handlePointerDown(i, e)}
                className="cursor-grab hover:scale-125 transition-transform"
              />
              <text
                x={v.x}
                y={v.y + 4}
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="900"
                textAnchor="middle"
                pointerEvents="none"
              >
                {v.label}
              </text>

              <text
                x={v.x + (v.x > center.x ? 20 : -20)}
                y={v.y + (v.y > center.y ? 20 : -20)}
                fill="#A5F3FC"
                fontSize="12"
                fontWeight="900"
                textAnchor="middle"
                className="drop-shadow-md"
              >
                {angles[i] || 0}°
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Breakdown Summary */}
      <div className="w-full mt-3 p-3 bg-slate-900/90 rounded-xl border border-amber-400/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-amber-200 font-extrabold uppercase tracking-wider">
            Interior Angles ({sides} Sisi)
          </span>
          <div className="flex items-center gap-1 text-xs text-cyan-300 font-bold">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Target Sum Formula: (n-2) × 180° = {expectedSum}°</span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center font-mono text-xs">
          {angles.map((a, i) => (
            <div key={i} className="bg-slate-950 p-1.5 rounded-lg border border-amber-400/20">
              <div className="text-[10px] text-slate-400 font-bold">{vertices[i]?.label}</div>
              <div className="text-amber-300 font-black">{a}°</div>
            </div>
          ))}
        </div>

        <div className="mt-2 text-right text-xs font-bold text-slate-200">
          Measured Interior Angle Total: <span className="text-amber-400 font-mono text-sm font-black">{totalInteriorSum}°</span>
        </div>
      </div>
    </div>
  );
}
