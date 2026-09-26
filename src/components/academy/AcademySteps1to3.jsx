import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import { Compass, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Step1Welcome({ onNext }) {
  const [gateAngle, setGateAngle] = useState(20);

  return (
    <div className="space-y-5">
      <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/40">
        <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
          Step 1: Real-World Desert Context
        </span>
        <h3 className="font-serif text-2xl font-black text-amber-200 mt-2">1. WELCOME TO ANGLES</h3>
        <p className="text-sm text-slate-200 leading-relaxed mt-1">
          In the vast desert, angles are everywhere! When two paths meet at a single point, or when a desert gate opens, an <strong>ANGLE</strong> is created.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/30 text-center space-y-4">
        <h4 className="font-bold text-cyan-300 text-base">"What happens when two directions meet at one point?"</h4>
        <p className="text-xs text-slate-300">Drag the slider below to open the ancient desert gate and observe the angle forming!</p>

        {/* Visual Gate Animation */}
        <div className="relative w-full h-40 bg-slate-950 rounded-xl border border-amber-400/30 overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 400 160" className="w-full h-full">
            {/* Fixed Left Wall */}
            <rect x="20" y="30" width="40" height="100" fill="#78350F" stroke="#F59E0B" strokeWidth="2" />
            <text x="40" y="25" fill="#F59E0B" fontSize="10" fontWeight="bold" textAnchor="middle">Gate Post V</text>

            {/* Rotatable Gate Door */}
            <g transform="translate(60, 80)">
              <line x1="0" y1="0" x2="100" y2="0" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
              <line
                x1="0"
                y1="0"
                x2={100 * Math.cos(-gateAngle * (Math.PI / 180))}
                y2={100 * Math.sin(-gateAngle * (Math.PI / 180))}
                stroke="#10B981"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="0" cy="0" r="6" fill="#06B6D4" />
            </g>

            {/* Angle Value Display */}
            <text x="250" y="85" fill="#FFE600" fontSize="18" fontWeight="900">
              Gate Angle: {gateAngle}°
            </text>
          </svg>
        </div>

        <input
          type="range"
          min="10"
          max="120"
          value={gateAngle}
          onChange={(e) => setGateAngle(parseInt(e.target.value, 10))}
          className="w-full max-w-md accent-amber-400 cursor-pointer"
        />

        <button
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm gold-glow inline-flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <span>Continue to Step 2: What is an Angle?</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function Step2WhatIsAnAngle({ onNext }) {
  const [angle, setAngle] = useState(45);

  return (
    <div className="space-y-5">
      <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/40">
        <span className="bg-cyan-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
          Step 2: Basic Concept & Visual Parts
        </span>
        <h3 className="font-serif text-2xl font-black text-amber-200 mt-2">2. WHAT IS AN ANGLE?</h3>
        <p className="text-sm text-slate-200 leading-relaxed mt-1">
          An angle is formed when two <strong>rays or arms (lengan sudut)</strong> share a common endpoint called the <strong>vertex (titik sudut)</strong>.
        </p>
      </div>

      <DynamicAngleCanvas
        label="Interactive Visual Diagram: Identify Vertex, Rays & Region"
        onAngleChange={(a) => setAngle(a)}
        initialAngle={50}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-center font-bold">
        <div className="p-3 bg-slate-900 rounded-xl border border-cyan-400/40 text-cyan-300">
          <div className="text-amber-400 font-black text-sm">VERTEX (V)</div>
          <div>The shared starting point where both arms meet.</div>
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-amber-400/40 text-amber-300">
          <div className="text-amber-400 font-black text-sm">RAYS / ARMS</div>
          <div>The two straight lines stretching out from the vertex.</div>
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-emerald-400/40 text-emerald-300">
          <div className="text-emerald-400 font-black text-sm">ANGLE REGION</div>
          <div>The space or turn between the two rays.</div>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm gold-glow inline-flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <span>Continue to Step 3: Measuring Scale</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function Step3HowMeasured({ onNext }) {
  const [angle, setAngle] = useState(30);

  return (
    <div className="space-y-5">
      <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/40">
        <span className="bg-emerald-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
          Step 3: Measuring Unit & Scale
        </span>
        <h3 className="font-serif text-2xl font-black text-amber-200 mt-2">3. HOW ANGLES ARE MEASURED</h3>
        <p className="text-sm text-slate-200 leading-relaxed mt-1">
          Angles are measured in <strong>DEGREES</strong> using the degree symbol (<strong>°</strong>). The degree measures the amount of rotation between the two arms.
        </p>
      </div>

      <DynamicAngleCanvas
        label="Visual 0° - 180° Degree Scale Explorer"
        onAngleChange={(a) => setAngle(a)}
        initialAngle={angle}
      />

      <div className="p-4 bg-slate-900 rounded-2xl border border-amber-400/30 text-xs text-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>
          <span className="font-bold text-amber-300">Discovery Rule:</span>
          <p className="text-slate-300 mt-0.5">
            {angle < 60 ? 'Smaller rotation = Smaller angle measurement (Narrow opening).' : 'Larger rotation = Larger angle measurement (Wide opening).'}
          </p>
        </div>

        <button
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm gold-glow inline-flex items-center gap-2 hover:scale-105 transition-transform shrink-0"
        >
          <span>Continue to Step 4: Types of Angles</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
