import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Target, HelpCircle, Eye, EyeOff, Sparkles } from 'lucide-react';

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
    if (distToHandle < 30) {
      setIsDragging(true);
      return;
    }

    // Check if clicking near protractor center
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
    if (deg === 0) return "Zero Angle (0°)";
    if (deg < 90) return "Sudut Tirus (Acute Angle)";
    if (deg === 90) return "Sudut Tegak (Right Angle)";
    if (deg < 180) return "Sudut Cakah (Obtuse Angle)";
    if (deg === 180) return "Sudut Lurus (Straight Angle)";
    return "Reflex Angle";
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border-2 border-sand-500/40 flex flex-col items-center select-none shadow-2xl bg-gradient-to-b from-desertNavy-900 to-desertNavy-950">
      {/* Header Bar */}
      <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-3">
        <div>
          <h3 className="font-serif font-extrabold text-sand-100 text-base md:text-lg flex items-center gap-2">
            <span>{label}</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </h3>
          <p className="text-xs text-sand-300">Drag the coral ray handle to open or close the angle arc</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowProtractor(!showProtractor)}
            className={`btn-playful px-3 py-1.5 text-xs ${
              showProtractor ? 'btn-oasis' : 'bg-desertNavy-800 text-sand-200 border-sand-500/40'
            }`}
          >
            {showProtractor ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showProtractor ? 'Hide Protractor' : 'Virtual Protractor'}</span>
          </button>

          {showProtractor && (
            <button
              onClick={() => setProtractorPos({ x: center.x, y: center.y, rotation: 0 })}
              className="p-1.5 rounded-full bg-desertNavy-800 text-sand-200 border border-sand-500/40 hover:text-white"
              title="Snap Protractor to Vertex V"
            >
              <Target className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative border-2 border-sand-500/30 rounded-xl bg-desertNavy-950 overflow-hidden w-full max-w-[500px] shadow-inner">
        <svg
          ref={canvasRef}
          viewBox="0 0 500 320"
          className="w-full h-auto cursor-crosshair touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Background Grid & Desert Sun */}
          <defs>
            <pattern id="desertGrid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(212, 175, 55, 0.12)" strokeWidth="1" />
            </pattern>
            <radialGradient id="vertexSunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 209, 102, 0.45)" />
              <stop offset="60%" stopColor="rgba(212, 175, 55, 0.15)" />
              <stop offset="100%" stopColor="rgba(10, 25, 47, 0)" />
            </radialGradient>
          </defs>
          <rect width="500" height="320" fill="url(#desertGrid)" />

          {/* Vertex Sun Glow Effect */}
          <circle cx={center.x} cy={center.y} r="65" fill="url(#vertexSunGlow)" />

          {/* Target Arc indicator if target angle exists */}
          {targetAngle !== null && (
            <g opacity="0.6">
              <path
                d={`M ${center.x + 55} ${center.y} A 55 55 0 ${targetAngle > 180 ? 1 : 0} 0 ${
                  center.x + 55 * Math.cos(-targetAngle * (Math.PI / 180))
                } ${center.y + 55 * Math.sin(-targetAngle * (Math.PI / 180))}`}
                fill="none"
                stroke="#00A896"
                strokeWidth="4"
                strokeDasharray="6 4"
              />
            </g>
          )}

          {/* Dynamic Angle Arc Indicator */}
          {angle > 0 && (
            <path
              d={`M ${center.x + 45} ${center.y} A 45 45 0 0 0 ${
                center.x + 45 * Math.cos(-angle * (Math.PI / 180))
              } ${center.y + 45 * Math.sin(-angle * (Math.PI / 180))}`}
              fill="rgba(255, 107, 107, 0.25)"
              stroke="#FF6B6B"
              strokeWidth="3"
            />
          )}

          {/* Right Angle Square Symbol if 90 degrees */}
          {angle === 90 && (
            <path
              d={`M ${center.x + 22} ${center.y} L ${center.x + 22} ${center.y - 22} L ${center.x} ${center.y - 22}`}
              fill="none"
              stroke="#FFD166"
              strokeWidth="3"
            />
          )}

          {/* Ray 1 (Base Line / Arm 1 - Warm Sandy Gold) */}
          <line
            x1={center.x}
            y1={center.y}
            x2={ray1X}
            y2={ray1Y}
            stroke="#FFD166"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <polygon
            points={`${ray1X + 12},${ray1Y} ${ray1X},${ray1Y - 6} ${ray1X},${ray1Y + 6}`}
            fill="#FFD166"
          />
          <text x={ray1X + 15} y={ray1Y + 4} fill="#FFD166" fontSize="12" fontWeight="bold">Ray 1</text>

          {/* Ray 2 (Rotatable Arm 2 - Vibrant Coral / Terracotta) */}
          <line
            x1={center.x}
            y1={center.y}
            x2={ray2X}
            y2={ray2Y}
            stroke="#FF6B6B"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <polygon
            points={`${ray2X + 12 * Math.cos(-angle * (Math.PI / 180))},${ray2Y + 12 * Math.sin(-angle * (Math.PI / 180))} ${ray2X - 6 * Math.sin(-angle * (Math.PI / 180))},${ray2Y + 6 * Math.cos(-angle * (Math.PI / 180))} ${ray2X + 6 * Math.sin(-angle * (Math.PI / 180))},${ray2Y - 6 * Math.cos(-angle * (Math.PI / 180))}`}
            fill="#FF6B6B"
          />
          <text x={ray2X + 15 * Math.cos(-angle * (Math.PI / 180))} y={ray2Y + 15 * Math.sin(-angle * (Math.PI / 180))} fill="#FF6B6B" fontSize="12" fontWeight="bold">Ray 2</text>

          {/* Interactive Drag Handle on Ray 2 */}
          <circle
            cx={ray2X}
            cy={ray2Y}
            r="12"
            fill="#FF6B6B"
            stroke="#FFFFFF"
            strokeWidth="3"
            className="cursor-grab hover:scale-125 transition-transform gold-glow"
          />

          {/* Glowing Vertex Point V (Turquoise Oasis) */}
          <circle cx={center.x} cy={center.y} r="8" fill="#00A896" stroke="#FFFFFF" strokeWidth="2.5" />
          <text x={center.x - 18} y={center.y + 22} fill="#80E0D6" fontSize="14" fontWeight="extrabold">V (Vertex)</text>

          {/* Virtual Protractor Overlay */}
          {showProtractor && (
            <g transform={`translate(${protractorPos.x}, ${protractorPos.y})`}>
              {/* Semi-Circle Protractor Base */}
              <path
                d="M -130 0 A 130 130 0 0 1 130 0 Z"
                fill="rgba(0, 168, 150, 0.18)"
                stroke="#00A896"
                strokeWidth="2.5"
              />
              <line x1="-130" y1="0" x2="130" y2="0" stroke="#00A896" strokeWidth="2.5" />
              {/* Degree Ticks */}
              {Array.from({ length: 19 }, (_, i) => i * 10).map((deg) => {
                const rad = -deg * (Math.PI / 180);
                const x1 = 120 * Math.cos(rad);
                const y1 = 120 * Math.sin(rad);
                const x2 = 130 * Math.cos(rad);
                const y2 = 130 * Math.sin(rad);
                const tx = 104 * Math.cos(rad);
                const ty = 104 * Math.sin(rad);
                return (
                  <g key={deg}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#80E0D6" strokeWidth="1.5" />
                    {deg % 30 === 0 && (
                      <text
                        x={tx}
                        y={ty}
                        fill="#E6C280"
                        fontSize="9"
                        fontWeight="bold"
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
              <circle cx="0" cy="0" r="14" fill="rgba(10, 25, 47, 0.9)" stroke="#00A896" strokeWidth="2" className="cursor-move" />
              <circle cx="0" cy="0" r="4" fill="#FFD166" />
            </g>
          )}

          {/* Prominent Angle Measurement Badge */}
          <text
            x={center.x + 65 * Math.cos((-angle / 2) * (Math.PI / 180))}
            y={center.y + 65 * Math.sin((-angle / 2) * (Math.PI / 180))}
            fill="#FFFFFF"
            fontSize="18"
            fontWeight="extrabold"
            textAnchor="middle"
            className="drop-shadow-lg"
          >
            {angle}°
          </text>
        </svg>
      </div>

      {/* Dynamic Measurement Status Box */}
      <div className="w-full mt-3 p-3 bg-desertNavy-800/90 rounded-xl border border-sand-500/30 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-center sm:text-left">
          <div className="text-[10px] text-sand-400 uppercase tracking-wider font-semibold">Angle Value</div>
          <div className="font-mono text-2xl font-extrabold text-amber-400">{angle}°</div>
        </div>

        <div className="text-center sm:text-right">
          <div className="text-[10px] text-sand-400 uppercase tracking-wider font-semibold">DSKP Classification</div>
          <div className="text-sm font-bold text-teal-300">{getAngleType(angle)}</div>
        </div>

        {targetAngle !== null && (
          <div className="text-center bg-desertNavy-950 px-3 py-1.5 rounded-lg border border-sand-500/30">
            <div className="text-[10px] text-sand-400 font-semibold">Target Value</div>
            <div className="font-mono text-lg font-bold text-coral-400">{targetAngle}°</div>
          </div>
        )}
      </div>
    </div>
  );
}
