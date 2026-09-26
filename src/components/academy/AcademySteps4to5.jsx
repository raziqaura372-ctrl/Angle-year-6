import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import { Mountain, Shield, ArrowRight, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

export function Step4TypesOfAngles({ onNext }) {
  const [selectedMatch, setSelectedMatch] = useState({});

  const scenarios = [
    { id: 'path', title: 'Narrow Dune Path', targetType: 'acute', deg: '45°', desc: 'Sudut Tirus (< 90°)' },
    { id: 'shelter', title: 'Corner of Shelter', targetType: 'right', deg: '90°', desc: 'Sudut Tegak (= 90°)' },
    { id: 'gate', title: 'Wide Opening Gate', targetType: 'obtuse', deg: '135°', desc: 'Sudut Cakah (> 90°)' },
    { id: 'trail', title: 'Straight Desert Trail', targetType: 'straight', deg: '180°', desc: 'Sudut Lurus (= 180°)' },
  ];

  const handleSelect = (scenId, type) => {
    setSelectedMatch(prev => ({ ...prev, [scenId]: type }));
  };

  const isAllCorrect = scenarios.every(s => selectedMatch[s.id] === s.targetType);

  return (
    <div className="space-y-5">
      <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/40">
        <span className="bg-purple-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
          Step 4: Classification
        </span>
        <h3 className="font-serif text-2xl font-black text-amber-200 mt-2">4. TYPES OF ANGLES IN THE DESERT</h3>
        <p className="text-sm text-slate-200 leading-relaxed mt-1">
          Angles are classified into four main primary school types depending on their degree measurement:
        </p>
      </div>

      {/* Drag & Match Activity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {scenarios.map((scen) => {
          const userChoice = selectedMatch[scen.id];
          const isCorrect = userChoice === scen.targetType;

          return (
            <div key={scen.id} className="glass-panel p-4 rounded-xl border border-amber-400/30 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-200 text-sm">{scen.title} ({scen.deg})</span>
                <span className="text-xs text-cyan-300 font-mono font-bold">{scen.desc}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {['acute', 'right', 'obtuse', 'straight'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleSelect(scen.id, type)}
                    className={`p-2 rounded-lg border transition-all ${
                      userChoice === type
                        ? isCorrect
                          ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-black'
                          : 'bg-rose-500 text-white border-rose-400 font-black'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    {type === 'acute' ? 'Sudut Tirus' : type === 'right' ? 'Sudut Tegak' : type === 'obtuse' ? 'Sudut Cakah' : 'Sudut Lurus'}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onNext}
          disabled={!isAllCorrect}
          className={`px-6 py-2.5 rounded-xl font-black text-sm inline-flex items-center gap-2 transition-transform ${
            isAllCorrect
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 gold-glow hover:scale-105 cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <span>{isAllCorrect ? 'Classified Correctly! Proceed to Step 5' : 'Match All 4 Angle Types First'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function Step5DynamicExploration({ onNext }) {
  const [angle, setAngle] = useState(60);

  return (
    <div className="space-y-5">
      <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/40">
        <span className="bg-cyan-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
          Step 5: Dynamic GeoGebra-Style Exploration
        </span>
        <h3 className="font-serif text-2xl font-black text-amber-200 mt-2">5. DYNAMIC ANGLE EXPLORATION</h3>
        <p className="text-sm text-slate-200 leading-relaxed mt-1">
          Manipulate the orange arm directly below and discover how mathematical angle measurements change in real-time!
        </p>
      </div>

      <DynamicAngleCanvas
        label="GeoGebra-Style Dynamic Angle Sandbox"
        onAngleChange={(a) => setAngle(a)}
        initialAngle={60}
      />

      {/* Socratic Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-slate-900 rounded-xl border border-cyan-400/30 text-cyan-200 space-y-1">
          <span className="font-bold text-amber-300">"What do you notice when you move the ray?"</span>
          <p className="text-slate-300">As rotation increases from 0° to 180°, the angle region expands.</p>
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-cyan-400/30 text-cyan-200 space-y-1">
          <span className="font-bold text-amber-300">"Can you create exactly 90°?"</span>
          <p className="text-slate-300">Notice how a square symbol appears when the angle reaches a right angle (90°)!</p>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm gold-glow inline-flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <span>Continue to Step 6: Protractor Measurement</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
