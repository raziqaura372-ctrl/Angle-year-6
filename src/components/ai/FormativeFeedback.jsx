import React from 'react';
import { CheckCircle, AlertTriangle, Info, ArrowRight } from 'lucide-react';

export default function FormativeFeedback({
  currentAngle = 0,
  targetAngle = 90,
  tolerance = 3,
  onSuccess = () => {},
  customMessage = null
}) {
  const diff = Math.abs(currentAngle - targetAngle);
  const isCorrect = diff <= tolerance;

  let feedbackType = 'info'; // 'success', 'warning', 'info'
  let feedbackMessage = '';

  if (customMessage) {
    feedbackMessage = customMessage;
  } else if (isCorrect) {
    feedbackType = 'success';
    feedbackMessage = `Excellent precision! Your measurement of ${currentAngle}° is perfectly aligned with the target of ${targetAngle}°. You have unlocked the next stage.`;
  } else if (currentAngle < targetAngle) {
    feedbackType = 'warning';
    const gap = targetAngle - currentAngle;
    feedbackMessage = `Your angle is ${currentAngle}°, which is ${gap}° smaller than the target gate angle of ${targetAngle}°. Try rotating the top arm clockwise to widen the angle arc.`;
  } else {
    feedbackType = 'warning';
    const gap = currentAngle - targetAngle;
    feedbackMessage = `Your angle is ${currentAngle}°, which is ${gap}° larger than the target gate angle of ${targetAngle}°. Try rotating the top arm counter-clockwise to narrow the angle arc.`;
  }

  return (
    <div className={`p-4 rounded-xl border transition-all shadow-md ${
      feedbackType === 'success'
        ? 'bg-oasis-900/40 border-oasis-500/60 text-oasis-100'
        : feedbackType === 'warning'
        ? 'bg-terracotta-900/40 border-terracotta-500/60 text-sand-100'
        : 'bg-desertNavy-800/80 border-sand-500/40 text-sand-200'
    }`}>
      <div className="flex items-start gap-3">
        {feedbackType === 'success' && <CheckCircle className="w-5 h-5 text-oasis-400 shrink-0 mt-0.5" />}
        {feedbackType === 'warning' && <AlertTriangle className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />}
        {feedbackType === 'info' && <Info className="w-5 h-5 text-sand-400 shrink-0 mt-0.5" />}

        <div className="flex-1 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-sand-300">
            {feedbackType === 'success' ? 'Formative Feedback: Verification Passed' : 'Formative Feedback & Scaffolding'}
          </div>
          <p className="text-sm leading-relaxed">{feedbackMessage}</p>

          {isCorrect && (
            <button
              onClick={onSuccess}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-oasis-500 text-desertNavy-950 font-bold text-xs hover:bg-oasis-400 transition-all gold-glow"
            >
              <span>Continue Expedition</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
