import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import PolygonGridCanvas from '../geometry/PolygonGridCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Crown, Sparkles, CheckCircle2, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission7Boss({ onComplete }) {
  const [stage, setStage] = useState(1); // Stage 1: Entrance Gate Angle, Stage 2: Central Oasis Polygon, Stage 3: Written Justification
  const [angle, setAngle] = useState(45);
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

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Fallback if confetti script not available
    }

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
      {/* Title Header */}
      <div className="glass-panel p-6 rounded-xl border-2 border-sand-500 gold-glow bg-gradient-to-r from-desertNavy-950 via-desertNavy-900 to-sand-900/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sand-500 to-terracotta-500 flex items-center justify-center text-desertNavy-950 shadow-lg">
            <Crown className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-sand-100 tracking-wide">
              FINAL BOSS CHALLENGE: THE HIDDEN OASIS ARCHITECT
            </h2>
            <p className="text-sand-300 text-xs md:text-sm font-medium">
              Multi-Stage Dynamic Geometry & Mathematical Justification Integration
            </p>
          </div>
        </div>
        <p className="text-sand-200 text-sm leading-relaxed mt-2">
          You have reached the legendary Hidden Oasis! To restore its ancient geometric ecosystem, you must complete a 3-part mastery challenge combining precise angle construction, octagonal polygon design, and rigorous mathematical justification.
        </p>

        {/* Multi-Stage Tracker */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-bold text-center">
          <div className={`p-2 rounded border ${stage >= 1 ? 'bg-sand-500 text-desertNavy-950 border-sand-400' : 'bg-desertNavy-800 text-sand-400 border-sand-500/20'}`}>
            1. Gate Angle (135°)
          </div>
          <div className={`p-2 rounded border ${stage >= 2 ? 'bg-sand-500 text-desertNavy-950 border-sand-400' : 'bg-desertNavy-800 text-sand-400 border-sand-500/20'}`}>
            2. Octagon Courtyard (8 Sisi)
          </div>
          <div className={`p-2 rounded border ${stage >= 3 ? 'bg-sand-500 text-desertNavy-950 border-sand-400' : 'bg-desertNavy-800 text-sand-400 border-sand-500/20'}`}>
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
          <div className="bg-desertNavy-800 p-4 rounded-xl border border-sand-500/30 text-xs text-sand-200">
            <strong>Stage 2 Requirement:</strong> Select an 8-sided <strong>Oktagon</strong> polygon, drag the vertices on the grid to complete the courtyard perimeter, and verify that the total interior angle sum equals <strong>(8-2) × 180° = 1080°</strong>.
          </div>

          <PolygonGridCanvas
            onPolygonChange={(data) => setPolygonData(data)}
            initialSides={8}
          />

          {polygonData && polygonData.sides === 8 && (
            <div className="p-4 bg-oasis-900/60 rounded-xl border border-oasis-500 text-center space-y-3">
              <h4 className="font-serif font-bold text-oasis-300">Octagon Courtyard Verified! (Total Interior Sum: {polygonData.totalInteriorSum}°)</h4>
              <button
                onClick={handleStage2Next}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-sand-500 to-terracotta-500 text-desertNavy-950 font-bold text-sm gold-glow hover:scale-105 transition-transform"
              >
                Proceed to Stage 3: Mathematical Justification
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stage 3: Written Justification */}
      {stage === 3 && !completed && (
        <form onSubmit={handleFinalSubmit} className="glass-panel p-6 rounded-xl border border-sand-500/40 space-y-4">
          <h3 className="font-serif text-lg font-bold text-sand-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-oasis-400" />
            Stage 3: Mathematical Reasoning & Explanation (DSKP KKG5)
          </h3>
          <p className="text-xs text-sand-300 leading-relaxed">
            Explain <strong>WHY</strong> the total interior angle sum of an 8-sided polygon is 1080°, and how dynamic manipulation on a grid helped you prove this mathematical relationship.
          </p>

          <textarea
            rows="5"
            value={justificationText}
            onChange={(e) => setJustificationText(e.target.value)}
            placeholder="Write your mathematical explanation here (e.g. 'An octagon can be partitioned into 6 triangles from a single vertex. Since each triangle has 180°, (8-2) × 180° = 1080°...')"
            className="w-full bg-desertNavy-950 border border-sand-500/30 rounded-lg p-3 text-sm text-sand-100 focus:outline-none focus:border-sand-500"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sand-500 via-terracotta-500 to-oasis-500 text-desertNavy-950 font-extrabold text-base gold-glow hover:scale-[1.02] transition-transform"
          >
            Submit Final Expedition Justification & Claim Master Geometer Rank
          </button>
        </form>
      )}

      {/* Completed Banner */}
      {completed && (
        <div className="glass-panel p-8 rounded-2xl border-2 border-oasis-400 oasis-glow text-center space-y-4 bg-gradient-to-b from-oasis-950/80 to-desertNavy-950">
          <div className="w-16 h-16 rounded-full bg-sand-500 text-desertNavy-950 flex items-center justify-center mx-auto text-2xl font-bold shadow-xl">
            🏆
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-sand-100">EXPEDITION COMPLETE!</h2>
          <p className="text-sand-200 text-sm max-w-xl mx-auto leading-relaxed">
            You have successfully completed the <strong>Desert Geometry Expedition</strong>! You demonstrated advanced relational understanding of angles (DSKP 6.1.1 & 6.1.2) and unlocked the highest rank: <strong>Master of the Hidden Oasis</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
