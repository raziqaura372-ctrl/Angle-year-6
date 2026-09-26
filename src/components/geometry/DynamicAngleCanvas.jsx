import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Target, HelpCircle, Eye, EyeOff } from 'lucide-react';

export default function DynamicAngleCanvas({
  targetAngle = null,
  onAngleChange = () => {},
  showProtractorDefault = false,
  readOnly = false,
  initialAngle = 45,
  label = "Dynamic Angle Manipulator"
}) {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(initialAngle);
  const [isDragging, setIsDragging] = useState(false);
  const [showProtractor, setShowProtractor] = useState(showProtractorDefault);
  const [protractorPos, setProtractorPos] = useState({ x: 250, y: 220, rotation: 0 });
  const [isDraggingProtractor, setIsDraggingProtractor] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const center = { x: 250, y: 220 };
  const rayLength = 160;

  useEffect(() => {
    onAngleChange(angle);
  }, [angle]);

  // Ray 1 is fixed along positive X-axis (0 degrees relative to horizontal)
  // Ray 2 angle measured counter-clockwise
  const ray2X = center.x + rayLength * Math.cos(-angle * (Math.PI / 180));
  const ray2Y = center.y + rayLength * Math.sin(-angle * (Math.PI / 180));

  const ray1X = center.x + rayLength;
  const ray1Y = center.y;

  const handlePointerDown = (e) => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking near ray 2 handle
    const distToHandle = Math.hypot(x - ray2X, y - ray2Y);
    if (distToHandle < 25) {
      setIsDragging(true);
      return;
    }

    // Check if clicking near protractor center
    if (showProtractor) {
      const distToProtractor = Math.hypot(x - protractorPos.x, y - protractorPos.y);
      if (distToProtractor < 40) {
        setIsDraggingProtractor(true);
        setDragOffset({ x: x - protractorPos.x, y: y - protractorPos.y });
      }
    }
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      const dx = x - center.x;
      const dy = y - center.y;
      let rad = Math.atan2(-dy, dx);
      let deg = Math.round(rad * (180 / Math.PI));
      if (deg < 0) deg += 360;
      if (deg > 180) {
        deg = deg > 270 ? 0 : 180;
      }
      setAngle(deg);
    } else if (isDraggingProtractor) {
      setProtractorPos({
        ...protractorPos,
        x: x - dragOffset.x,
        y: y - dragOffset.y
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsDraggingProtractor(false);
  };

  const getAngleType = (deg) => {
    if (deg === 0) return "Zero Angle";
    if (deg < 90) return "Sudut Tirus (Acute Angle)";
    if (deg === 90) return "Sudut Tegak (Right Angle)";
    if (deg < 180) return "Sudut Cakah (Obtuse Angle)";
    if (deg === 180) return "Sudut Lurus (Straight Angle)";
    return "Reflex Angle";
  };

  return (
    <div className="bg-desertNavy-900/90 rounded-xl p-4 border border-sand-500/30 flex flex-col items-center select-none shadow-xl">
      {/* Header Bar */}
      <div className="w-full flex justify-between items-center mb-3">
        <div>
          <h3 className="font-serif font-bold text-sand-200 text-base">{label}</h3>
          <p className="text-xs text-sand-400">Drag the golden ray handle to adjust angle value</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowProtractor(!showProtractor)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
              showProtractor
                ? 'bg-oasis-500 text-desertNavy-950 border-oasis-400 font-bold shadow-md'
                : 'bg-desertNavy-800 text-sand-300 border-sand-500/30 hover:border-sand-500'
            }`}
          >
            {showProtractor ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {showProtractor ? 'Hide Protractor' : 'Virtual Protractor'}
          </button>

          {showProtractor && (
            <button
              onClick={() => setProtractorPos({ x: center.x, y: center.y, rotation: 0 })}
              className="p-1.5 rounded bg-desertNavy-800 text-sand-300 border border-sand-500/30 hover:text-sand-100"
              title="Snap Protractor to Vertex"
            >
              <Target className="w-4 h-4 text-sand-400" />
            </button>
          )}
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative border border-sand-500/20 rounded-lg bg-desertNavy-950/80 overflow-hidden w-full max-w-[500px]">
        <svg
          ref={canvasRef}
          viewBox="0 0 500 320"
          className="w-full h-auto cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Background Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(212, 175, 55, 0.08)" strokeWidth="1" />
            </pattern>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(212, 175, 55, 0.3)" />
              <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
            </radialGradient>
          </defs>
          <rect width="500" height="320" fill="url(#grid)" />

          {/* Vertex Sun Glow */}
          <circle cx={center.x} cy={center.y} r="50" fill="url(#sunGlow)" />

          {/* Target Arc indicator if target angle exists */}
          {targetAngle !== null && (
            <g opacity="0.4">
              <path
                d={`M ${center.x + 50} ${center.y} A 50 50 0 ${targetAngle > 180 ? 1 : 0} 0 ${
                  center.x + 50 * Math.cos(-targetAngle * (Math.PI / 180))
                } ${center.y + 50 * Math.sin(-targetAngle * (Math.PI / 180))}`}
                fill="none"
                stroke="#00A896"
                strokeWidth="4"
                strokeDasharray="4 4"
              />
            </g>
          )}

          {/* Angle Arc Indicator */}
          {angle > 0 && (
            <path
              d={`M ${center.x + 40} ${center.y} A 40 40 0 0 0 ${
                center.x + 40 * Math.cos(-angle * (Math.PI / 180))
              } ${center.y + 40 * Math.sin(-angle * (Math.PI / 180))}`}
              fill="rgba(212, 175, 55, 0.2)"
              stroke="#D4AF37"
              strokeWidth="2.5"
            />
          )}

          {/* Right Angle Square Symbol if 90 degrees */}
          {angle === 90 && (
            <path
              d={`M ${center.x + 20} ${center.y} L ${center.x + 20} ${center.y - 20} L ${center.x} ${center.y - 20}`}
              fill="none"
              stroke="#C85A32"
              strokeWidth="2"
            />
          )}

          {/* Ray 1 (Base Line / Arm 1) */}
          <line
            x1={center.x}
            y1={center.y}
            x2={ray1X}
            y2={ray1Y}
            stroke="#E6C280"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Arrowhead Ray 1 */}
          <polygon
            points={`${ray1X + 10},${ray1Y} ${ray1X},${ray1Y - 5} ${ray1X},${ray1Y + 5}`}
            fill="#E6C280"
          />

          {/* Ray 2 (Rotatable Arm 2) */}
          <line
            x1={center.x}
            y1={center.y}
            x2={ray2X}
            y2={ray2Y}
            stroke="#D4AF37"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Arrowhead Ray 2 */}
          <circle
            cx={ray2X}
            cy={ray2Y}
            r="10"
            fill="#C85A32"
            stroke="#D4AF37"
            strokeWidth="3"
            className="cursor-grab hover:scale-125 transition-transform"
          />

          {/* Vertex Point */}
          <circle cx={center.x} cy={center.y} r="7" fill="#00A896" stroke="#FFFFFF" strokeWidth="2" />
          <text x={center.x - 15} y={center.y + 20} fill="#E6C280" fontSize="12" fontWeight="bold">V</text>

          {/* Virtual Protractor Overlay */}
          {showProtractor && (
            <g transform={`translate(${protractorPos.x}, ${protractorPos.y})`}>
              {/* Semi-Circle Protractor Base */}
              <path
                d="M -120 0 A 120 120 0 0 1 120 0 Z"
                fill="rgba(0, 168, 150, 0.15)"
                stroke="#00A896"
                strokeWidth="2"
              />
              <line x1="-120" y1="0" x2="120" y2="0" stroke="#00A896" strokeWidth="2" />
              {/* Degree Ticks */}
              {Array.from({ length: 19 }, (_, i) => i * 10).map((deg) => {
                const rad = -deg * (Math.PI / 180);
                const x1 = 110 * Math.cos(rad);
                const y1 = 110 * Math.sin(rad);
                const x2 = 120 * Math.cos(rad);
                const y2 = 120 * Math.sin(rad);
                const tx = 95 * Math.cos(rad);
                const ty = 95 * Math.sin(rad);
                return (
                  <g key={deg}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00A896" strokeWidth="1.5" />
                    {deg % 30 === 0 && (
                      <text
                        x={tx}
                        y={ty}
                        fill="#80E0D6"
                        fontSize="9"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {deg}°
                      </text>
                    )}
                  </g>
                );
              })}
              {/* Center handle icon */}
              <circle cx="0" cy="0" r="12" fill="rgba(10, 25, 47, 0.8)" stroke="#00A896" strokeWidth="2" className="cursor-move" />
              <circle cx="0" cy="0" r="3" fill="#D4AF37" />
            </g>
          )}

          {/* Degree Text Display */}
          <text
            x={center.x + 55 * Math.cos((-angle / 2) * (Math.PI / 180))}
            y={center.y + 55 * Math.sin((-angle / 2) * (Math.PI / 180))}
            fill="#FFFFFF"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
            className="drop-shadow-md"
          >
            {angle}°
          </text>
        </svg>
      </div>

      {/* Dynamic Measurement Status Box */}
      <div className="w-full mt-3 p-3 bg-desertNavy-800/90 rounded-lg border border-sand-500/30 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-center sm:text-left">
          <div className="text-xs text-sand-400 uppercase tracking-wider">Current Measurement</div>
          <div className="font-mono text-2xl font-extrabold text-sand-500">{angle}°</div>
        </div>

        <div className="text-center sm:text-right">
          <div className="text-xs text-sand-400 uppercase tracking-wider">Angle Classification</div>
          <div className="text-sm font-bold text-oasis-300">{getAngleType(angle)}</div>
        </div>

        {targetAngle !== null && (
          <div className="text-center bg-desertNavy-950 px-3 py-1.5 rounded border border-sand-500/30">
            <div className="text-xs text-sand-400">Target Angle</div>
            <div className="font-mono text-lg font-bold text-terracotta-300">{targetAngle}°</div>
          </div>
        )}
      </div>
    </div>
  );
}
