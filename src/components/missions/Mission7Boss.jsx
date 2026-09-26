import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import PolygonGridCanvas from '../geometry/PolygonGridCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import LumaGuide from '../character/LumaGuide';
import { useGame } from '../../context/GameContext';
import { Crown, Sparkles, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission7Boss({ onComplete }) {
  const [stage, setStage] = useState(1); // Stage 1: Entrance Gate Angle, Stage 2: Central Oasis Polygon, Stage 3: Written Justification
  const [angle, setAngle] = useState(60);
  const targetGateAngle = 135;
  const [polygonData, setPolygonData] = useState(null);
  const [justificationText, setJustificationText] = useState('');
  const [completed, setCompleted] = useState(false);
  const { completeMission, addReflection } = useGame();

  const handleStage1Next = () => {
    if (Math.abs(angle - targetGateAngle) <= 2) {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      setStage(2);
    }
  };

  const handleStage2Next = () => {
    if (polygonData && polygonData.sides === 8) {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      setStage(3);
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!justificationText.trim()) return;

    try {
      confetti({
        particleCount: 150,
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
    completeMission(7, 200, 3);
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-6">
      <LumaGuide
        mood={completed ? 'celebrating' : stage === 3 ? 'excited' : 'happy'}
        title="Final Stage: The Hidden Oasis Architect"
        message={
          completed
            ? "TREMENDOUS VICTORY! You unlocked the Hidden Oasis and proved your mastery as a Master Geometer!"
            : stage === 1
            ? "Explorer Luma has arrived at the legendary Hidden Oasis! Construct the entrance gate angle to 135° to enter."
            : stage === 2
            ? "Great job opening the gate! Now construct the 8-sided Octagon courtyard perimeter tile on the grid."
            : "Final stage! Explain WHY an 8-sided polygon has a total interior angle sum of 1080°."
        }
        hint={
          stage === 1
            ? "Drag the coral ray to 135°."
            : stage === 2
            ? "Select 8 Sisi (Oktagon) and ensure vertices form a complete 8-sided polygon perimeter."
            : "Remember: An octagon can be divided into (8-2) = 6 triangles from one vertex. 6 × 180° = 1080°!"
        }
        whyPrompt="How does connecting geometry principles with mathematical reasoning help us solve real engineering problems?"
        showCelebration={completed}
      />

      {/* Title Header */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-fuchsia-400 gold-glow bg-gradient-to-r from-desertNavy-950 via-purple-950 to-desertNavy-900">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-fuchsia-500 to-purple-600 flex items-center justify-center text-desertNavy-950 shadow-lg font-bold text-2xl">
            🏆
          </div>
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-sand-100 tracking-wide">
              FINAL BOSS CHALLENGE: THE HIDDEN OASIS
            </h2>
            <p className="text-sand-300 text-xs md:text-sm font-semibold">
              3-Part Dynamic Geometry Mastery Challenge
            </p>
          </div>
        </div>

        {/* Multi-Stage Tracker */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-extrabold text-center">
          <div className={`p-2.5 rounded-xl border-2 transition-all ${stage >= 1 ? 'bg-amber-400 text-desertNavy-950 border-amber-300' : 'bg-desertNavy-800 text-sand-400 border-sand-500/20'}`}>
            1. Gate Angle (135°)
          </div>
          <div className={`p-2.5 rounded-xl border-2 transition-all ${stage >= 2 ? 'bg-amber-400 text-desertNavy-950 border-amber-300' : 'bg-desertNavy-800 text-sand-400 border-sand-500/20'}`}>
            2. Octagon Courtyard (8 Sisi)
          </div>
          <div className={`p-2.5 rounded-xl border-2 transition-all ${stage >= 3 ? 'bg-amber-400 text-desertNavy-950 border-amber-300' : 'bg-desertNavy-800 text-sand-400 border-sand-500/20'}`}>
            3. Written Justification
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
          <div className="bg-desertNavy-800/90 p-4 rounded-xl border border-sand-500/30 text-xs text-sand-200">
            <strong>Stage 2 Requirement:</strong> Select an 8-sided <strong>Oktagon</strong> polygon, drag vertices on the grid lines, and verify that total interior angle sum equals <strong>(8-2) × 180° = 1080°</strong>.
          </div>

          <PolygonGridCanvas
            onPolygonChange={(data) => setPolygonData(data)}
            initialSides={8}
          />

          {polygonData && polygonData.sides === 8 && (
            <div className="p-4 bg-emerald-950/80 rounded-xl border-2 border-emerald-400 text-center space-y-3 gold-glow">
              <h4 className="font-serif font-extrabold text-emerald-300">Octagon Courtyard Verified! (Total Interior Sum: {polygonData.totalInteriorSum}°)</h4>
              <button
                onClick={handleStage2Next}
                className="btn-playful btn-gold px-8 py-2.5 text-sm"
              >
                <span>PROCEED TO STAGE 3: MATHEMATICAL JUSTIFICATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stage 3: Written Justification */}
      {stage === 3 && !completed && (
        <form onSubmit={handleFinalSubmit} className="glass-panel p-6 rounded-2xl border-2 border-amber-400 space-y-4 bg-desertNavy-900/90">
          <h3 className="font-serif text-lg font-extrabold text-sand-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Stage 3: Mathematical Reasoning & Explanation</span>
          </h3>
          <p className="text-xs text-sand-200 leading-relaxed font-medium">
            Explain <strong>WHY</strong> the total interior angle sum of an 8-sided polygon is 1080°, and how dynamic manipulation on a grid helped you prove this mathematical relationship.
          </p>

          <textarea
            rows="5"
            value={justificationText}
            onChange={(e) => setJustificationText(e.target.value)}
            placeholder="Write your mathematical explanation here (e.g. 'An octagon can be partitioned into 6 triangles from a single vertex. Since each triangle has 180°, (8-2) × 180° = 1080°...')"
            className="w-full bg-desertNavy-950 border-2 border-sand-500/40 rounded-xl p-3 text-sm text-sand-100 focus:outline-none focus:border-amber-400"
            required
          />

          <button
            type="submit"
            className="w-full btn-playful btn-purple py-3.5 text-base font-extrabold gold-glow"
          >
            <span>SUBMIT FINAL JUSTIFICATION & CLAIM MASTER GEOMETER RANK</span>
            <Crown className="w-5 h-5" />
          </button>
        </form>
      )}

      {/* Completed Banner */}
      {completed && (
        <div className="glass-panel p-8 rounded-3xl border-4 border-amber-400 oasis-glow text-center space-y-4 bg-gradient-to-b from-purple-950/90 via-desertNavy-950 to-desertNavy-950">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-desertNavy-950 flex items-center justify-center mx-auto text-4xl shadow-2xl animate-float">
            👑
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-amber-300 tracking-wide">
            EXPEDITION COMPLETE!
          </h2>
          <p className="text-sand-100 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
            You have successfully completed the <strong>Desert Geometry Expedition</strong>! You demonstrated advanced relational understanding of angles (DSKP 6.1.1 & 6.1.2) and unlocked the highest rank: <strong>Master of the Hidden Oasis</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
