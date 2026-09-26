import React, { useState, useEffect, useRef } from 'react';
import { Grid, Hexagon, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function PolygonGridCanvas({
  onPolygonChange = () => {},
  initialSides = 3,
  readOnly = false
}) {
  const [gridType, setGridType] = useState('square'); // 'square' or 'isometric'
  const [sides, setSides] = useState(initialSides); // 3 to 8
  const [vertices, setVertices] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const canvasRef = useRef(null);

  const center = { x: 250, y: 180 };
  const radius = 100;

  // Initialize regular polygon vertices
  useEffect(() => {
    generateRegularPolygon(sides);
  }, [sides, gridType]);

  const generateRegularPolygon = (numSides) => {
    const newVertices = [];
    for (let i = 0; i < numSides; i++) {
      const angle = (i * 2 * Math.PI) / numSides - Math.PI / 2;
      let x = center.x + radius * Math.cos(angle);
      let y = center.y + radius * Math.sin(angle);

      // Snap to grid
      if (gridType === 'square') {
        x = Math.round(x / 20) * 20;
        y = Math.round(y / 20) * 20;
      }
      newVertices.push({ x, y, label: String.fromCharCode(65 + i) });
    }
    setVertices(newVertices);
  };

  // Calculate Interior Angles for each vertex
  const calculateAngles = () => {
    if (vertices.length < 3) return [];

    return vertices.map((v, i) => {
      const prev = vertices[(i - 1 + vertices.length) % vertices.length];
      const next = vertices[(i + 1) % vertices.length];

      // Vectors v -> prev and v -> next
      const v1 = { x: prev.x - v.x, y: prev.y - v.y };
      const v2 = { x: next.x - v.x, y: next.y - v.y };

      const dot = v1.x * v2.x + v1.y * v2.y;
      const mag1 = Math.hypot(v1.x, v1.y);
      const mag2 = Math.hypot(v2.x, v2.y);

      if (mag1 === 0 || mag2 === 0) return 0;

      let cosTheta = dot / (mag1 * mag2);
      cosTheta = Math.max(-1, Math.min(1, cosTheta)); // Clamp
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

    // Clamp inside canvas
    x = Math.max(30, Math.min(470, x));
    y = Math.max(30, Math.min(330, y));

    // Snap to grid
    if (gridType === 'square') {
      x = Math.round(x / 20) * 20;
      y = Math.round(y / 20) * 20;
    } else {
      // Triangular / Isometric grid snap
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
    <div className="bg-desertNavy-900/90 rounded-xl p-4 border border-sand-500/30 shadow-xl flex flex-col items-center">
      {/* Controls Header */}
      <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-sand-300 font-semibold">Grid Type:</label>
          <button
            onClick={() => setGridType('square')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              gridType === 'square'
                ? 'bg-sand-500 text-desertNavy-950 border-sand-400 font-bold'
                : 'bg-desertNavy-800 text-sand-300 border-sand-500/30'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Grid Segi Empat Sama
          </button>
          <button
            onClick={() => setGridType('isometric')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              gridType === 'isometric'
                ? 'bg-oasis-500 text-desertNavy-950 border-oasis-400 font-bold'
                : 'bg-desertNavy-800 text-sand-300 border-sand-500/30'
            }`}
          >
            <Hexagon className="w-3.5 h-3.5" />
            Grid Segi Tiga Sama Sisi
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-sand-300 font-semibold">Bilangan Sisi (Sides):</label>
          <select
            value={sides}
            onChange={(e) => setSides(parseInt(e.target.value, 10))}
            className="bg-desertNavy-950 text-sand-100 border border-sand-500/30 px-3 py-1 rounded text-xs font-bold"
          >
            {[3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n} Sisi ({n === 3 ? 'Segi Tiga' : n === 4 ? 'Segi Empat' : n === 5 ? 'Pentagon' : n === 6 ? 'Heksagon' : n === 7 ? 'Heptagon' : 'Oktagon'})
              </option>
            ))}
          </select>
          <button
            onClick={() => generateRegularPolygon(sides)}
            className="p-1.5 rounded bg-desertNavy-800 text-sand-300 border border-sand-500/30 hover:text-sand-100"
            title="Reset to Regular Polygon"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative border border-sand-500/20 rounded-lg bg-desertNavy-950 overflow-hidden w-full max-w-[500px]">
        <svg
          ref={canvasRef}
          viewBox="0 0 500 360"
          className="w-full h-auto"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Grid Background */}
          <defs>
            <pattern id="squareGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(212, 175, 55, 0.1)" strokeWidth="1" />
            </pattern>
            <pattern id="isometricGrid" width="25" height="43.3" patternUnits="userSpaceOnUse">
              <path d="M 0 21.65 L 12.5 0 L 25 21.65 L 12.5 43.3 Z M 12.5 0 L 12.5 43.3 M 0 21.65 L 25 21.65" fill="none" stroke="rgba(0, 168, 150, 0.12)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="500" height="360" fill={gridType === 'square' ? "url(#squareGrid)" : "url(#isometricGrid)"} />

          {/* Polygon Fill & Outline */}
          {polygonPath && (
            <path
              d={polygonPath}
              fill="rgba(212, 175, 55, 0.15)"
              stroke="#D4AF37"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          )}

          {/* Vertices & Angles Overlay */}
          {vertices.map((v, i) => (
            <g key={i}>
              {/* Vertex Drag Handle */}
              <circle
                cx={v.x}
                cy={v.y}
                r="10"
                fill="#C85A32"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                onPointerDown={(e) => handlePointerDown(i, e)}
                className="cursor-grab hover:scale-125 transition-transform"
              />
              <text
                x={v.x}
                y={v.y + 4}
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                pointerEvents="none"
              >
                {v.label}
              </text>

              {/* Interior Angle Label near Vertex */}
              <text
                x={v.x + (v.x > center.x ? 18 : -18)}
                y={v.y + (v.y > center.y ? 18 : -18)}
                fill="#80E0D6"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                className="drop-shadow"
              >
                {angles[i] || 0}°
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Interior Angles Breakdown Table */}
      <div className="w-full mt-3 p-3 bg-desertNavy-800/90 rounded-lg border border-sand-500/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-sand-300 font-bold uppercase tracking-wider">
            Sudut Pedalaman ({sides} Sisi Poligon)
          </span>
          <div className="flex items-center gap-1 text-xs text-oasis-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-oasis-400" />
            <span>Formula: (n-2) × 180° = {expectedSum}°</span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-center font-mono text-xs">
          {angles.map((a, i) => (
            <div key={i} className="bg-desertNavy-950 p-1.5 rounded border border-sand-500/20">
              <div className="text-[10px] text-sand-400">{vertices[i]?.label}</div>
              <div className="text-sand-100 font-bold">{a}°</div>
            </div>
          ))}
        </div>

        <div className="mt-2 text-right text-xs font-semibold text-sand-200">
          Jumlah Sudut Pedalaman Measured: <span className="text-sand-500 font-mono text-sm">{totalInteriorSum}°</span>
        </div>
      </div>
    </div>
  );
}
