import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Landmark, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission1({ onComplete }) {
  const [angle, setAngle] = useState(120);
  const [selectedType, setSelectedType] = useState(null);
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const classifyAngle = (deg) => {
    if (deg < 90) return 'acute';
    if (deg === 90) return 'right';
    if (deg < 180) return 'obtuse';
    return 'straight';
  };

  const handleCheckClassification = (type) => {
    setSelectedType(type);
    const actual = classifyAngle(angle);
    if (type === actual && !completed) {
      setCompleted(true);
      completeMission(1, 100, 3);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="desert-card p-6 rounded-3xl border-2 border-amber-400/60 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md border border-emerald-200">
            <Landmark className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-black uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" /> MISSION 1 – CLASSIFICATION
            </div>
            <h2 className="text-2xl font-extrabold text-amber-300 tracking-wide mt-0.5">
              THE DUNE OF ANGLES
            </h2>
          </div>
        </div>
        <p className="text-amber-100 text-sm leading-relaxed font-medium">
          🤠 <strong>Luma says:</strong> "Look at the giant sand dunes! Angles come in different types. Can you classify the current dune slope angle into <strong>Sudut Tirus (Acute)</strong>, <strong>Sudut Tegak (Right)</strong>, <strong>Sudut Cakah (Obtuse)</strong>, or <strong>Sudut Lurus (Straight)</strong>?"
        </p>
      </div>

      {/* Dynamic Angle Canvas */}
      <DynamicAngleCanvas
        label="Dune Slope Simulator"
        onAngleChange={(a) => {
          setAngle(a);
          setSelectedType(null);
        }}
        initialAngle={120}
      />

      {/* Interactive Classification Card */}
      <div className="desert-card p-6 rounded-3xl border-2 border-amber-400/60 space-y-4 shadow-xl">
        <h3 className="font-extrabold text-lg text-amber-300 flex items-center gap-2">
          <span>Classify Angle: <span className="text-emerald-400 font-mono text-xl">{angle}°</span></span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {[
            { id: 'acute', label: 'Sudut Tirus', desc: 'Acute (< 90°)', emoji: '📐' },
            { id: 'right', label: 'Sudut Tegak', desc: 'Right (= 90°)', emoji: 'square' },
            { id: 'obtuse', label: 'Sudut Cakah', desc: 'Obtuse (> 90°)', emoji: '👐' },
            { id: 'straight', label: 'Sudut Lurus', desc: 'Straight (= 180°)', emoji: '➖' },
          ].map((item) => {
            const isSelected = selectedType === item.id;
            const isCorrect = classifyAngle(angle) === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleCheckClassification(item.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all playful-btn ${
                  isSelected
                    ? isCorrect
                      ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-black shadow-lg scale-102'
                      : 'bg-rose-500 text-white border-rose-300 font-bold'
                    : 'bg-slate-950/80 text-amber-100 border-amber-400/30 hover:border-amber-400 hover:bg-slate-900'
                }`}
              >
                <div className="text-base font-black flex items-center gap-1.5">
                  <span>{item.label}</span>
                </div>
                <div className="text-[11px] opacity-90 font-medium mt-1">{item.desc}</div>
              </button>
            );
          })}
        </div>

        {selectedType && (
          <FormativeFeedback
            customMessage={
              selectedType === classifyAngle(angle)
                ? `Fantastic discovery! ${angle}° is indeed a ${classifyAngle(angle).toUpperCase()} angle! DSKP 6.1 classification badge unlocked!`
                : `Not quite, explorer! ${angle}° is not a ${selectedType.toUpperCase()} angle. Take a closer look at whether it's less or greater than 90°.`
            }
          />
        )}
      </div>

      {completed && (
        <div className="p-6 bg-slate-900 rounded-3xl border-2 border-emerald-400/80 oasis-glow text-center space-y-4 shadow-2xl">
          <div className="text-3xl">🏅 Mission 1 Completed! 🏅</div>
          <h3 className="font-black text-xl text-emerald-300">
            Badge Unlocked: Angle Tracker
          </h3>
          {onComplete && (
            <button
              onClick={onComplete}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-slate-950 font-black text-sm playful-btn hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
            >
              PROCEED TO OASIS COMPASS <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
