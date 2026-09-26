import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import PolygonGridCanvas from '../geometry/PolygonGridCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Crown, Sparkles, FileText, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission7Boss({ onComplete }) {
  const [stage, setStage] = useState(1);
  const [angle, setAngle] = useState(60);
  const targetGateAngle = 135;
  const [polygonData, setPolygonData] = useState(null);
  const [justificationText, setJustificationText] = useState('');
  const [completed, setCompleted] = useState(false);
  const { completeMission, addReflection } = useGame();

  const handleStage1Next = () => {
    if (Math.abs(angle - targetGateAngle) <= 2) {
      setStage(2);
    }
  };

  const handleStage2Next = () => {
    if (polygonData && polygonData.sides === 8) {
      setStage(3);
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!justificationText.trim()) return;

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    addReflection({
      topic: 'Hidden Oasis Boss Final Justification',
      text: justificationText,
      mission: 7
    });

    setCompleted(true);
    completeMission(7, 300, 3);
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="desert-card p-6 md:p-8 rounded-3xl border-2 border-amber-400/80 gold-glow bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-300 via-yellow-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg border border-amber-200 animate-bounce-gentle">
            <Crown className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-black uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> FINAL BOSS EXPEDITION
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-amber-300 tracking-wide mt-0.5">
              THE HIDDEN OASIS ARCHITECT SANCTUARY
            </h2>
          </div>
        </div>
        <p className="text-amber-100 text-sm leading-relaxed font-medium max-w-2xl">
          🤠 <strong>Luma says:</strong> "You have reached the legendary 🌟 <strong>Hidden Oasis</strong>! To restore the sanctuary, complete this 3-stage Master Geometer challenge!"
        </p>

        {/* Multi-Stage Tracker */}
        <div className="grid grid-cols-3 gap-3 mt-5 text-xs font-black text-center">
          <div className={`p-3 rounded-2xl border-2 transition-all ${stage >= 1 ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md' : 'bg-slate-950 text-amber-300/60 border-amber-400/20'}`}>
            1. Gate Angle (135°)
          </div>
          <div className={`p-3 rounded-2xl border-2 transition-all ${stage >= 2 ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md' : 'bg-slate-950 text-amber-300/60 border-amber-400/20'}`}>
            2. Octagon Courtyard (8 Sisi)
          </div>
          <div className={`p-3 rounded-2xl border-2 transition-all ${stage >= 3 ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md' : 'bg-slate-950 text-amber-300/60 border-amber-400/20'}`}>
            3. Mathematical Reason
          </div>
        </div>
      </div>

      {/* Stage 1: Entrance Gate Angle */}
      {stage === 1 && (
        <div className="space-y-4">
          <DynamicAngleCanvas
            label="Stage 1: Construct Gate Unlock Angle (Target: 135°)"
            targetAngle={targetGateAngle}
            onAngleChange={(a) => setAngle(a)}
            showProtractorDefault={true}
            initialAngle={60}
          />

          <FormativeFeedback
            currentAngle={angle}
            targetAngle={targetGateAngle}
            tolerance={2}
            onSuccess={handleStage1Next}
          />
        </div>
      )}

      {/* Stage 2: Octagon Courtyard */}
      {stage === 2 && (
        <div className="space-y-4">
          <div className="desert-card p-4 rounded-2xl border border-amber-400/40 text-xs text-amber-100 font-medium">
            <strong>Stage 2 Requirement:</strong> Select an 8-sided <strong>Oktagon</strong> polygon, drag the grid handles, and verify that the interior angle sum equals <strong>(8-2) × 180° = 1080°</strong>.
          </div>

          <PolygonGridCanvas
            onPolygonChange={(data) => setPolygonData(data)}
            initialSides={8}
          />

          {polygonData && polygonData.sides === 8 && (
            <div className="p-6 bg-slate-900 rounded-3xl border-2 border-emerald-400/80 oasis-glow text-center space-y-4 shadow-2xl">
              <h4 className="font-extrabold text-lg text-emerald-300">
                Octagon Courtyard Verified! (Total Interior Sum: {polygonData.totalInteriorSum}°)
              </h4>
              <button
                onClick={handleStage2Next}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-slate-950 font-black text-sm playful-btn hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
              >
                PROCEED TO REASONING <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stage 3: Written Justification */}
      {stage === 3 && !completed && (
        <form onSubmit={handleFinalSubmit} className="desert-card p-6 rounded-3xl border-2 border-amber-400/60 space-y-4 shadow-xl">
          <h3 className="font-extrabold text-lg text-amber-300 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Stage 3: Mathematical Reasoning & Explanation (DSKP KKG5)
          </h3>
          <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
            Explain <strong>WHY</strong> the total interior angle sum of an 8-sided polygon is 1080°, and how dynamic manipulation on a grid helped you prove this mathematical relationship.
          </p>

          <textarea
            rows="4"
            value={justificationText}
            onChange={(e) => setJustificationText(e.target.value)}
            placeholder="Write your explanation here (e.g., 'An octagon can be split into 6 triangles from one vertex. Since each triangle sum is 180°, (8-2) × 180° = 1080°...')"
            className="w-full bg-slate-950 border-2 border-amber-400/40 rounded-2xl p-3.5 text-xs text-amber-100 placeholder-amber-500/50 focus:outline-none focus:border-amber-400 font-medium"
            required
          />

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 text-slate-950 font-black text-base playful-btn shadow-xl hover:scale-102 transition-transform"
          >
            CLAIM MASTER GEOMETER TROPHY 🏆
          </button>
        </form>
      )}

      {/* Completed Banner */}
      {completed && (
        <div className="desert-card p-8 rounded-3xl border-2 border-emerald-400 oasis-glow text-center space-y-4 bg-gradient-to-b from-slate-900 to-emerald-950/60 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto text-3xl font-black shadow-xl border-2 border-amber-200 animate-bounce-gentle">
            🏆
          </div>
          <h2 className="font-black text-3xl text-amber-300">EXPEDITION COMPLETE!</h2>
          <p className="text-amber-100 text-sm max-w-xl mx-auto leading-relaxed font-medium">
            You have successfully completed the <strong>Desert Geometry Expedition</strong>! You demonstrated advanced relational understanding of angles (DSKP 6.1.1 & 6.1.2) and unlocked the highest rank: <strong>Master Geometer of the Hidden Oasis</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
