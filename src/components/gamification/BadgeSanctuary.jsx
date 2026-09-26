import React from 'react';
import { useGame } from '../../context/GameContext';
import { Award, Compass, Target, Hexagon, Crown, Lock, CheckCircle2 } from 'lucide-react';

export default function BadgeSanctuary() {
  const { badges, xp, coins, getRank } = useGame();
  const rank = getRank();

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl border border-sand-500/30">
        <h2 className="font-serif text-2xl font-bold text-sand-100 mb-1">BADGE SANCTUARY & RANKINGS</h2>
        <p className="text-sand-300 text-xs">Recognizing Mathematical Excellence & Relational Understanding</p>

        {/* Current Player Rank Banner */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-desertNavy-950 via-desertNavy-900 to-sand-900/40 border border-sand-500/40 flex items-center justify-between">
          <div>
            <div className="text-xs text-sand-400 font-semibold uppercase">Current Desert Rank</div>
            <div className="font-serif text-xl font-bold text-sand-500 flex items-center gap-2">
              <Crown className="w-5 h-5 text-sand-500" />
              {rank.title} (Level {rank.level})
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-sand-400 font-semibold uppercase">Accumulated XP</div>
            <div className="font-mono text-2xl font-extrabold text-oasis-300">{xp} XP</div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
              b.unlocked
                ? 'bg-desertNavy-900/90 border-sand-500/50 gold-glow'
                : 'bg-desertNavy-950/60 border-sand-500/10 opacity-60'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  b.unlocked ? 'bg-sand-500 text-desertNavy-950 shadow-md' : 'bg-desertNavy-800 text-sand-500/40'
                }`}>
                  {b.unlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  b.unlocked ? 'bg-oasis-500/20 text-oasis-300 border border-oasis-500/30' : 'bg-gray-800 text-gray-400'
                }`}>
                  {b.unlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
              <h3 className="font-serif font-bold text-sand-100 text-base mb-1">{b.name}</h3>
              <p className="text-xs text-sand-300 leading-relaxed">{b.desc}</p>
            </div>

            {b.unlocked && (
              <div className="mt-4 pt-2 border-t border-sand-500/20 text-[11px] text-oasis-300 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-oasis-400" />
                <span>Earned in Expedition</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
