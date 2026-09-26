import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Target, Eye, EyeOff, Sparkles } from 'lucide-react';

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

    const distToHandle = Math.hypot(x - ray2X, y - ray2Y);
    if (distToHandle < 30) {
      setIsDragging(true);
      return;
    }

    if (showProtractor) {
      const distToProtractor = Math.hypot(x - protractorPos.x, y - protractorPos.y);
      if (distToProtractor < 45) {
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

  const getAngleColor = (deg) => {
    if (deg < 90) return "#F59E0B"; // Amber Gold
    if (deg === 90) return "#EF4444"; // Vivid Red
    if (deg < 180) return "#06B6D4"; // Cyan Oasis
    return "#8B5CF6"; // Royal Purple
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border-2 border-amber-400/40 shadow-2xl flex flex-col items-center select-none">
      {/* Header Bar */}
      <div className="w-full flex justify-between items-center mb-3">
        <div>
          <h3 className="font-serif font-extrabold text-amber-200 text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {label}
          </h3>
          <p className="text-xs text-slate-300">Drag the glowing orange handle to measure angles!</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowProtractor(!showProtractor)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
              showProtractor
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-md font-bold'
                : 'bg-slate-900 text-slate-200 border-amber-400/40 hover:border-amber-400'
            }`}
          >
            {showProtractor ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {showProtractor ? 'Hide Protractor' : 'Virtual Protractor'}
          </button>

          {showProtractor && (
            <button
              onClick={() => setProtractorPos({ x: center.x, y: center.y, rotation: 0 })}
              className="p-1.5 rounded-xl bg-slate-900 text-amber-300 border border-amber-400/40 hover:text-amber-100"
              title="Snap Protractor to Vertex V"
            >
              <Target className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative border-2 border-amber-400/30 rounded-xl bg-slate-950 overflow-hidden w-full max-w-[500px]">
        <svg
          ref={canvasRef}
          viewBox="0 0 500 320"
          className="w-full h-auto cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <defs>
            <pattern id="colorfulGrid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(245, 158, 11, 0.12)" strokeWidth="1" />
            </pattern>
            <radialGradient id="sunGlowBright" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.5)" />
              <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
            </radialGradient>
          </defs>
          <rect width="500" height="320" fill="url(#colorfulGrid)" />

          {/* Vertex Sun Glow */}
          <circle cx={center.x} cy={center.y} r="65" fill="url(#sunGlowBright)" />

          {/* Target Arc indicator if target angle exists */}
          {targetAngle !== null && (
            <g opacity="0.6">
              <path
                d={`M ${center.x + 55} ${center.y} A 55 55 0 ${targetAngle > 180 ? 1 : 0} 0 ${
                  center.x + 55 * Math.cos(-targetAngle * (Math.PI / 180))
                } ${center.y + 55 * Math.sin(-targetAngle * (Math.PI / 180))}`}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="5"
                strokeDasharray="6 6"
              />
            </g>
          )}

          {/* Angle Sector Fill */}
          {angle > 0 && (
            <path
              d={`M ${center.x} ${center.y} L ${center.x + 45} ${center.y} A 45 45 0 0 0 ${
                center.x + 45 * Math.cos(-angle * (Math.PI / 180))
              } ${center.y + 45 * Math.sin(-angle * (Math.PI / 180))} Z`}
              fill={getAngleColor(angle)}
              fillOpacity="0.3"
              stroke={getAngleColor(angle)}
              strokeWidth="3"
            />
          )}

          {/* Right Angle Square Symbol if 90 degrees */}
          {angle === 90 && (
            <path
              d={`M ${center.x + 22} ${center.y} L ${center.x + 22} ${center.y - 22} L ${center.x} ${center.y - 22}`}
              fill="none"
              stroke="#EF4444"
              strokeWidth="3.5"
            />
          )}

          {/* Ray 1 (Base Line) */}
          <line
            x1={center.x}
            y1={center.y}
            x2={ray1X}
            y2={ray1Y}
            stroke="#F59E0B"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <polygon
            points={`${ray1X + 12},${ray1Y} ${ray1X},${ray1Y - 6} ${ray1X},${ray1Y + 6}`}
            fill="#F59E0B"
          />

          {/* Ray 2 (Rotatable Arm 2) */}
          <line
            x1={center.x}
            y1={center.y}
            x2={ray2X}
            y2={ray2Y}
            stroke="#10B981"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Interactive Handle Ray 2 */}
          <circle
            cx={ray2X}
            cy={ray2Y}
            r="12"
            fill="#EF4444"
            stroke="#FFE600"
            strokeWidth="3.5"
            className="cursor-grab hover:scale-125 transition-transform"
          />

          {/* Vertex Point V */}
          <circle cx={center.x} cy={center.y} r="8" fill="#06B6D4" stroke="#FFFFFF" strokeWidth="2.5" />
          <text x={center.x - 18} y={center.y + 22} fill="#FFE600" fontSize="14" fontWeight="900">V</text>

          {/* Virtual Protractor Overlay */}
          {showProtractor && (
            <g transform={`translate(${protractorPos.x}, ${protractorPos.y})`}>
              <path
                d="M -130 0 A 130 130 0 0 1 130 0 Z"
                fill="rgba(6, 182, 212, 0.22)"
                stroke="#06B6D4"
                strokeWidth="2.5"
              />
              <line x1="-130" y1="0" x2="130" y2="0" stroke="#06B6D4" strokeWidth="2.5" />
              {Array.from({ length: 19 }, (_, i) => i * 10).map((deg) => {
                const rad = -deg * (Math.PI / 180);
                const x1 = 120 * Math.cos(rad);
                const y1 = 120 * Math.sin(rad);
                const x2 = 130 * Math.cos(rad);
                const y2 = 130 * Math.sin(rad);
                const tx = 102 * Math.cos(rad);
                const ty = 102 * Math.sin(rad);
                return (
                  <g key={deg}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#06B6D4" strokeWidth="2" />
                    {deg % 30 === 0 && (
                      <text
                        x={tx}
                        y={ty}
                        fill="#A5F3FC"
                        fontSize="10"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {deg}°
                      </text>
                    )}
                  </g>
                );
              })}
              <circle cx="0" cy="0" r="14" fill="rgba(11, 19, 43, 0.9)" stroke="#06B6D4" strokeWidth="2.5" className="cursor-move" />
              <circle cx="0" cy="0" r="4" fill="#F59E0B" />
            </g>
          )}

          {/* Degree Callout Badge */}
          <text
            x={center.x + 65 * Math.cos((-angle / 2) * (Math.PI / 180))}
            y={center.y + 65 * Math.sin((-angle / 2) * (Math.PI / 180))}
            fill="#FFFFFF"
            fontSize="18"
            fontWeight="900"
            textAnchor="middle"
            className="drop-shadow-lg"
          >
            {angle}°
          </text>
        </svg>
      </div>

      {/* Dynamic Measurement Banner */}
      <div className="w-full mt-3 p-3 bg-slate-900 rounded-xl border border-amber-400/30 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-center sm:text-left">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Degree Measurement</div>
          <div className="font-mono text-3xl font-black text-amber-400">{angle}°</div>
        </div>

        <div className="text-center sm:text-right">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Angle Classification</div>
          <div className="text-sm font-black text-cyan-300">{getAngleType(angle)}</div>
        </div>

        {targetAngle !== null && (
          <div className="text-center bg-slate-950 px-3 py-1.5 rounded-lg border border-cyan-400/40">
            <div className="text-[10px] text-slate-400 font-bold">Target Angle Goal</div>
            <div className="font-mono text-xl font-extrabold text-cyan-400">{targetAngle}°</div>
          </div>
        )}
      </div>
    </div>
  );
}
