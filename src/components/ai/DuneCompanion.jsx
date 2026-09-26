import React, { useState } from 'react';
import { Compass, Lightbulb, ChevronRight, Sparkles, Heart, MessageCircle } from 'lucide-react';

export default function DuneCompanion({
  missionTitle = "Current Expedition Challenge",
  hintLevel1 = "Visual clue: Observe where the two colorful rays intersect at the vertex V!",
  hintLevel2 = "Conceptual hint: Remember an acute angle is sharp and small (< 90°), while an obtuse angle is wide open (> 90°).",
  hintLevel3 = "Mathematical guidance: Try rotating the upper ray clockwise until the angle arc matches your target measurement!",
  reflectionPrompt = "Why does changing the angle size affect the shape of the desert entrance gate?"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [userQuery, setUserQuery] = useState('');
  const [chatLogs, setChatLogs] = useState([
    {
      sender: 'luma',
      text: `Salam Explorer! I'm LUMA THE DESERT EXPLORER 🤠✨ I'm here to explore geometry together with you across the desert!`
    }
  ]);

  const requestNextHint = () => {
    if (hintLevel < 3) {
      const nextLvl = hintLevel + 1;
      setHintLevel(nextLvl);

      let hintText = '';
      if (nextLvl === 1) hintText = `💡 Level 1 Clue: ${hintLevel1}`;
      if (nextLvl === 2) hintText = `🔍 Level 2 Hint: ${hintLevel2}`;
      if (nextLvl === 3) hintText = `⭐ Level 3 Explorer Guide: ${hintLevel3}`;

      setChatLogs(prev => [
        ...prev,
        { sender: 'luma', text: hintText }
      ]);
    }
  };

  const handleSendQuery = (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery.trim();
    setChatLogs(prev => [...prev, { sender: 'user', text: query }]);
    setUserQuery('');

    // Generate scaffolded AI pedagogical response (Luma never gives direct answers)
    setTimeout(() => {
      let aiReply = "Great exploration thinking! 🌟 ";
      const qLower = query.toLowerCase();

      if (qLower.includes('answer') || qLower.includes('what is') || qLower.includes('jawapan')) {
        aiReply += "As your geometry explorer guide, I want to help you discover it yourself! What happens if you try moving the ray or using the virtual protractor?";
      } else if (qLower.includes('angle') || qLower.includes('sudut')) {
        aiReply += "An angle is formed when two rays meet at a common vertex point V. Look closely at how wide the opening is!";
      } else if (qLower.includes('help') || qLower.includes('tolong')) {
        aiReply += "You're doing fantastic! Click the 'Request Hint' button above so I can give you a friendly clue step-by-step!";
      } else {
        aiReply += `I love how you're thinking about "${query}"! Look closely at the geometric clues on screen. What patterns do you notice?`;
      }

      setChatLogs(prev => [...prev, { sender: 'luma', text: aiReply }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans">
      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-80 md:w-96 desert-card rounded-2xl border-2 border-amber-400/60 shadow-2xl mb-3 overflow-hidden flex flex-col h-[460px] animate-float">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-3.5 flex justify-between items-center text-slate-900 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800 text-xl font-bold shadow-inner">
                🤠
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-wide text-slate-950 flex items-center gap-1">
                  LUMA Explorer
                  <Sparkles className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
                </h4>
                <p className="text-[11px] text-slate-900 font-bold">Your Desert Geometry Guide</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 hover:text-white font-extrabold text-sm flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>

          {/* Friendly Mindset Banner */}
          <div className="bg-amber-950/80 px-3 py-1.5 border-b border-amber-500/30 text-[11px] text-amber-200 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 shrink-0" />
            <span>Mistakes are proof that you are learning! Ask Luma anything.</span>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs bg-slate-950/40">
            {chatLogs.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'luma' && (
                  <div className="w-7 h-7 rounded-full bg-amber-500 border border-amber-300 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0 shadow">
                    🤠
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-400 text-slate-950 font-bold rounded-br-none shadow'
                      : 'bg-slate-800/90 text-amber-50 border border-amber-500/30 rounded-bl-none shadow'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* 3-Level Hint & Reflection Box */}
          <div className="p-2.5 bg-slate-900 border-t border-amber-500/30 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="flex items-center gap-1 font-bold text-amber-300">
                <Lightbulb className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
                Luma's Clues ({hintLevel}/3)
              </span>
              <button
                onClick={requestNextHint}
                disabled={hintLevel >= 3}
                className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all playful-btn ${
                  hintLevel >= 3
                    ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 hover:from-amber-300 hover:to-orange-300'
                }`}
              >
                {hintLevel === 0 ? '💡 Get Clue 1' : hintLevel === 1 ? '🔍 Get Clue 2' : hintLevel === 2 ? '⭐ Get Clue 3' : 'All Clues Unlocked!'}
              </button>
            </div>

            {/* Reflection Prompt */}
            <div className="text-[11px] bg-slate-950/80 p-2 rounded-xl border border-emerald-500/40 text-emerald-300 leading-snug">
              <strong className="text-emerald-400">🤔 Think About It:</strong> "{reflectionPrompt}"
            </div>

            {/* Question Form */}
            <form onSubmit={handleSendQuery} className="flex gap-1.5">
              <input
                type="text"
                placeholder="Ask Luma a question..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs text-amber-100 placeholder-amber-500/60 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center shadow"
              >
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="desert-card-interactive px-4 py-3 rounded-full border-2 border-amber-400/80 shadow-2xl gold-glow hover:scale-105 transition-all flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black"
      >
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-lg border border-amber-300 shadow-inner">
          🤠
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-black tracking-wide text-slate-950 leading-none">LUMA EXPLORER</div>
          <div className="text-[10px] text-slate-900 font-bold leading-none mt-0.5">Click for Clues & Help!</div>
        </div>
      </button>
    </div>
  );
}
