import React, { useState } from 'react';
import { User, Shield, Sparkles, Check } from 'lucide-react';

export const AVATARS = [
  { id: 'jax', name: 'Explorer Jax', role: 'Dune Navigator', bg: 'from-amber-400 to-orange-500', color: '#F59E0B' },
  { id: 'maya', name: 'Architect Maya', role: 'Geometry Master', bg: 'from-cyan-400 to-blue-600', color: '#06B6D4' },
  { id: 'dune_bot', name: 'DUNE AI Unit', role: 'Socratic Helper', bg: 'from-emerald-400 to-teal-600', color: '#10B981' },
];

export default function MascotAvatars() {
  const [selectedAvatar, setSelectedAvatar] = useState('jax');

  return (
    <div className="glass-panel p-4 rounded-xl border border-amber-400/30 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-serif font-bold text-amber-200 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          Select Expedition Mascot Avatar
        </h3>
        <span className="text-[11px] text-cyan-300 font-bold">Personalized Learning Journey</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {AVATARS.map((av) => {
          const isSelected = selectedAvatar === av.id;
          return (
            <button
              key={av.id}
              onClick={() => setSelectedAvatar(av.id)}
              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center relative ${
                isSelected
                  ? 'bg-slate-900 border-amber-400 shadow-lg scale-105 gold-glow'
                  : 'bg-slate-950/80 border-slate-700/50 hover:border-slate-500'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${av.bg} flex items-center justify-center text-slate-950 font-black text-lg shadow-md mb-2`}>
                {av.name.charAt(0)}
              </div>

              <div className="font-bold text-xs text-slate-100">{av.name}</div>
              <div className="text-[10px] text-amber-300 font-medium">{av.role}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
