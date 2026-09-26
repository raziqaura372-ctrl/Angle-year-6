import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { BookOpen, Send, Sparkles, FileText } from 'lucide-react';

export default function ReflectionJournal() {
  const { reflections, addReflection } = useGame();
  const [topic, setTopic] = useState('Dynamic Tool Discovery');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    addReflection({
      topic,
      text: text.trim()
    });

    setText('');
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl border border-sand-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-sand-500/20 flex items-center justify-center text-sand-500">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-sand-100">STUDENT REFLECTION JOURNAL</h2>
            <p className="text-sand-300 text-xs">Metacognitive Reflection & Justification Prompts</p>
          </div>
        </div>
        <p className="text-sand-200 text-sm leading-relaxed mt-2">
          Document your mathematical discoveries, strategies, and reflections on how dynamic software helped you conceptualize angles and geometric properties.
        </p>
      </div>

      {/* New Reflection Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-xl border border-sand-500/30 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-serif font-bold text-sand-200 text-base">New Journal Entry</h3>
          <span className="text-xs text-oasis-300 font-medium">Metacognitive Scaffolding</span>
        </div>

        <div>
          <label className="text-xs text-sand-300 font-semibold block mb-1">Select Reflection Topic:</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-desertNavy-950 text-sand-100 border border-sand-500/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-sand-500"
          >
            <option value="Dynamic Tool Discovery">What did you discover about angles using the virtual protractor?</option>
            <option value="Changing Vertices">How did moving one vertex point affect all connected interior angles?</option>
            <option value="Problem Solving Strategy">Which geometric strategy helped you solve the ancient gate challenge?</option>
            <option value="Real-World Connection">How do angle measurements connect to desert architecture and solar structures?</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-sand-300 font-semibold block mb-1">Your Explanation / Reflection:</label>
          <textarea
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your mathematical reasoning and discoveries here..."
            className="w-full bg-desertNavy-950 text-sand-100 border border-sand-500/30 rounded p-3 text-sm focus:outline-none focus:border-sand-500"
            required
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-sand-500 to-terracotta-500 text-desertNavy-950 font-bold text-sm gold-glow flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Send className="w-4 h-4" />
          Save Journal Entry
        </button>
      </form>

      {/* Saved Reflections List */}
      <div className="space-y-3">
        <h3 className="font-serif font-bold text-sand-200 text-base">Previous Journal Entries ({reflections.length})</h3>

        {reflections.length === 0 ? (
          <div className="p-4 bg-desertNavy-900/60 rounded-xl border border-sand-500/20 text-center text-xs text-sand-400">
            No reflection entries recorded yet. Complete a mission and submit your first journal entry!
          </div>
        ) : (
          reflections.map((r) => (
            <div key={r.id} className="glass-panel p-4 rounded-xl border border-sand-500/20 space-y-2">
              <div className="flex justify-between items-center text-xs text-sand-400">
                <span className="font-bold text-oasis-300">{r.topic}</span>
                <span>{r.date}</span>
              </div>
              <p className="text-sm text-sand-100 leading-relaxed italic">"{r.text}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
