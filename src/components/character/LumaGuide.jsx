import React, { useState } from 'react';
import { Sparkles, HelpCircle, MessageCircle, Volume2, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function LumaGuide({
  mood = 'happy', // 'happy' | 'excited' | 'thinking' | 'celebrating'
  title = "LUMA The Desert Explorer",
  message = "Welcome, explorer! I'm LUMA! Ready to explore geometric mysteries across the desert?",
  hint = null,
  onAskHint = null,
  whyPrompt = null,
  showCelebration = false
}) {
  const [showHintBox, setShowHintBox] = useState(false);
  const [showWhyBox, setShowWhyBox] = useState(false);

  return (
    <div className="glass-panel p-4 rounded-2xl border-2 border-sand-500/50 bg-gradient-to-r from-desertNavy-950 via-desertNavy-900 to-sand-950/60 shadow-2xl relative overflow-hidden my-4">
      {/* Background Decorative Palms & Dunes SVG */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <svg width="200" height="100" viewBox="0 0 200 100">
          <path d="M 0 80 Q 50 40 100 80 T 200 80 L 200 100 L 0 100 Z" fill="#D4AF37" />
          <path d="M 160 50 Q 170 20 180 50 M 170 30 Q 150 20 170 35 M 170 30 Q 190 20 170 35" stroke="#00A896" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 relative z-10">
        {/* Animated LUMA SVG Avatar */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300 p-1 shadow-lg gold-glow animate-float">
            <div className="w-full h-full rounded-full bg-desertNavy-950 flex items-center justify-center overflow-hidden relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Background Sun glow */}
                <circle cx="50" cy="50" r="45" fill="#172A45" />

                {/* Explorer Hat */}
                <path d="M 15 38 Q 50 12 85 38 L 90 42 Q 50 32 10 42 Z" fill="#C85A32" stroke="#FFD166" strokeWidth="2" />
                <rect x="35" y="22" width="30" height="16" rx="4" fill="#D4AF37" />
                <circle cx="50" cy="30" r="4" fill="#00A896" />

                {/* Face */}
                <circle cx="50" cy="58" r="28" fill="#F5EFE6" />

                {/* Cheeks */}
                <circle cx="34" cy="62" r="5" fill="#FF9999" opacity="0.6" />
                <circle cx="66" cy="62" r="5" fill="#FF9999" opacity="0.6" />

                {/* Eyes - Animated based on mood */}
                {mood === 'celebrating' || mood === 'excited' ? (
                  <>
                    <path d="M 36 52 Q 40 45 44 52" stroke="#0A192F" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M 56 52 Q 60 45 64 52" stroke="#0A192F" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </>
                ) : mood === 'thinking' ? (
                  <>
                    <circle cx="40" cy="50" r="3" fill="#0A192F" />
                    <path d="M 56 47 L 64 51" stroke="#0A192F" strokeWidth="2.5" />
                    <circle cx="60" cy="52" r="3" fill="#0A192F" />
                  </>
                ) : (
                  <>
                    <circle cx="40" cy="52" r="4.5" fill="#0A192F" />
                    <circle cx="42" cy="50" r="1.5" fill="#FFFFFF" />
                    <circle cx="60" cy="52" r="4.5" fill="#0A192F" />
                    <circle cx="62" cy="50" r="1.5" fill="#FFFFFF" />
                  </>
                )}

                {/* Smile / Mouth */}
                {mood === 'celebrating' || mood === 'excited' ? (
                  <path d="M 38 65 Q 50 78 62 65 Z" fill="#FF6B6B" stroke="#0A192F" strokeWidth="1.5" />
                ) : mood === 'thinking' ? (
                  <path d="M 42 66 Q 50 63 58 66" stroke="#0A192F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                ) : (
                  <path d="M 38 64 Q 50 74 62 64" stroke="#0A192F" strokeWidth="3" fill="none" strokeLinecap="round" />
                )}

                {/* Explorer Scarf */}
                <path d="M 30 78 Q 50 92 70 78 L 75 92 Q 50 98 25 92 Z" fill="#00A896" />
                <circle cx="50" cy="86" r="3" fill="#FFD166" />
              </svg>
            </div>
          </div>

          <span className="mt-1 px-2.5 py-0.5 rounded-full bg-sand-500/20 text-sand-300 border border-sand-500/40 text-[10px] font-extrabold uppercase tracking-wider">
            LUMA GUIDE
          </span>
        </div>

        {/* Speech Bubble Content */}
        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-serif font-extrabold text-sand-100 text-base md:text-lg flex items-center justify-center md:justify-start gap-2">
              <span>{title}</span>
              <Sparkles className="w-4 h-4 text-sand-400 animate-pulse" />
            </h4>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-2">
              {hint && (
                <button
                  onClick={() => {
                    setShowHintBox(!showHintBox);
                    if (onAskHint) onAskHint();
                  }}
                  className="btn-playful btn-gold px-3 py-1 text-xs"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHintBox ? 'Hide Hint' : 'USE HINT'}</span>
                </button>
              )}

              {whyPrompt && (
                <button
                  onClick={() => setShowWhyBox(!showWhyBox)}
                  className="btn-playful btn-oasis px-3 py-1 text-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>DISCOVER WHY</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Character Dialogue Message */}
          <p className="text-sm text-sand-100 leading-relaxed font-medium bg-desertNavy-900/90 p-3 rounded-xl border border-sand-500/30 shadow-inner">
            "{message}"
          </p>

          {/* Expanded Hint Box */}
          {showHintBox && hint && (
            <div className="p-3 bg-amber-950/70 rounded-xl border border-amber-500/50 text-xs text-amber-200 animate-fadeIn space-y-1">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Luma's Explorer Clue:</span>
              </div>
              <p className="leading-relaxed">{hint}</p>
            </div>
          )}

          {/* Expanded Metacognitive Prompt Box */}
          {showWhyBox && whyPrompt && (
            <div className="p-3 bg-teal-950/70 rounded-xl border border-teal-500/50 text-xs text-teal-200 animate-fadeIn space-y-1">
              <div className="font-bold text-teal-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-coral-400" />
                <span>Mathematical Reflection Question:</span>
              </div>
              <p className="leading-relaxed italic">"{whyPrompt}"</p>
            </div>
          )}

          {/* Celebration Display Banner */}
          {showCelebration && (
            <div className="p-3 bg-emerald-900/80 rounded-xl border-2 border-emerald-400 text-xs text-emerald-100 font-bold flex items-center gap-2 gold-glow">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <span>Fantastic exploration! You solved the geometric challenge! +100 Desert Coins earned!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
