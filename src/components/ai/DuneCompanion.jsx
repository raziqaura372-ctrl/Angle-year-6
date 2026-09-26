import React, { useState } from 'react';
import { Bot, Lightbulb, HelpCircle, ChevronRight, Sparkles, MessageSquare } from 'lucide-react';

export default function DuneCompanion({
  missionTitle = "Current Expedition Challenge",
  hintLevel1 = "Visual clue: Observe where the rays intersect at the vertex V.",
  hintLevel2 = "Conceptual hint: Remember an acute angle is less than 90°, while an obtuse angle is between 90° and 180°.",
  hintLevel3 = "Mathematical guidance: Try rotating the upper ray clockwise until the degree readout matches the target angle.",
  reflectionPrompt = "Why does changing the angle size affect the shape of the desert entrance gate?"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hintLevel, setHintLevel] = useState(0); // 0: None, 1: Level 1, 2: Level 2, 3: Level 3
  const [userQuery, setUserQuery] = useState('');
  const [chatLogs, setChatLogs] = useState([
    {
      sender: 'dune',
      text: `Greetings, Expedition Leader! I am DUNE (Digital Understanding & Navigation Educator). I am here to scaffold your geometric thinking across the desert!`
    }
  ]);

  const requestNextHint = () => {
    if (hintLevel < 3) {
      const nextLvl = hintLevel + 1;
      setHintLevel(nextLvl);

      let hintText = '';
      if (nextLvl === 1) hintText = `💡 Level 1 Hint: ${hintLevel1}`;
      if (nextLvl === 2) hintText = `💡 Level 2 Hint: ${hintLevel2}`;
      if (nextLvl === 3) hintText = `💡 Level 3 Hint: ${hintLevel3}`;

      setChatLogs(prev => [
        ...prev,
        { sender: 'dune', text: hintText }
      ]);
    }
  };

  const handleSendQuery = (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery.trim();
    setChatLogs(prev => [...prev, { sender: 'user', text: query }]);
    setUserQuery('');

    // Generate scaffolded AI pedagogical response (never gives direct answer)
    setTimeout(() => {
      let aiReply = "That is an intriguing mathematical observation! ";
      if (query.toLowerCase().includes('answer') || query.toLowerCase().includes('what is')) {
        aiReply += "As your AI companion, I support your thinking rather than simply providing answers. Try experimenting with the virtual protractor or dragging the vertex!";
      } else if (query.toLowerCase().includes('angle') || query.toLowerCase().includes('sudut')) {
        aiReply += "Angles measure the amount of turn between two intersecting rays. Look closely at the vertex point V.";
      } else {
        aiReply += `Consider how ${query} relates to the geometric properties of the structure you are constructing. What changes when you drag the ray?`;
      }

      setChatLogs(prev => [...prev, { sender: 'dune', text: aiReply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-80 md:w-96 glass-panel rounded-xl border border-sand-500/40 shadow-2xl mb-3 overflow-hidden flex flex-col h-[450px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-sand-500 to-terracotta-500 p-3 flex justify-between items-center text-desertNavy-950">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-desertNavy-950 flex items-center justify-center text-sand-500">
                <Bot className="w-5 h-5 text-sand-500" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm tracking-wide">DUNE AI Companion</h4>
                <p className="text-[10px] text-desertNavy-900 font-medium">Digital Understanding & Navigation Educator</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-desertNavy-950 hover:text-white font-bold text-sm px-2"
            >
              ✕
            </button>
          </div>

          {/* Ethics Banner */}
          <div className="bg-desertNavy-950/90 px-3 py-1.5 border-b border-sand-500/20 text-[10px] text-sand-300 italic flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-oasis-400 shrink-0" />
            <span>DUNE supports your thinking. Try the problem first before requesting a hint.</span>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {chatLogs.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'dune' && (
                  <div className="w-6 h-6 rounded-full bg-oasis-500 text-desertNavy-950 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-2.5 rounded-lg max-w-[80%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-sand-500 text-desertNavy-950 font-medium rounded-br-none'
                      : 'bg-desertNavy-800 text-sand-100 border border-sand-500/20 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* 3-Level Hint Button Controller */}
          <div className="p-2 bg-desertNavy-950 border-t border-sand-500/20 space-y-2">
            <div className="flex justify-between items-center text-[11px] text-sand-300">
              <span className="flex items-center gap-1 font-semibold">
                <Lightbulb className="w-3.5 h-3.5 text-sand-500" />
                Scaffolded Hint System ({hintLevel}/3)
              </span>
              <button
                onClick={requestNextHint}
                disabled={hintLevel >= 3}
                className={`px-2 py-1 rounded text-[11px] font-bold border transition-all ${
                  hintLevel >= 3
                    ? 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed'
                    : 'bg-sand-500 text-desertNavy-950 border-sand-400 hover:bg-sand-400'
                }`}
              >
                {hintLevel === 0 ? 'Request Hint 1' : hintLevel === 1 ? 'Request Hint 2' : hintLevel === 2 ? 'Request Hint 3' : 'Max Hints Reached'}
              </button>
            </div>

            {/* Reflection Prompt */}
            <div className="text-[10px] bg-desertNavy-900 p-1.5 rounded border border-oasis-500/30 text-oasis-300">
              <strong>Metacognitive Reflection:</strong> "{reflectionPrompt}"
            </div>

            {/* Custom Question Form */}
            <form onSubmit={handleSendQuery} className="flex gap-1">
              <input
                type="text"
                placeholder="Ask DUNE a question..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="flex-1 bg-desertNavy-800 border border-sand-500/30 rounded px-2.5 py-1 text-xs text-sand-100 focus:outline-none focus:border-sand-500"
              />
              <button
                type="submit"
                className="bg-oasis-500 text-desertNavy-950 p-1.5 rounded hover:bg-oasis-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel p-3.5 rounded-full border-2 border-sand-500/60 shadow-xl gold-glow hover:scale-105 transition-all flex items-center gap-2 bg-gradient-to-tr from-desertNavy-900 via-desertNavy-800 to-sand-500/20 text-sand-100"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-sand-500" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-oasis-500 rounded-full animate-ping" />
        </div>
        <span className="font-serif text-xs font-bold hidden sm:inline-block pr-1">DUNE AI</span>
      </button>
    </div>
  );
}
