import React from 'react';
import { useGame } from '../../context/GameContext';
import { Award, Lock, CheckCircle2, Crown, Sparkles, Star } from 'lucide-react';

export default function BadgeSanctuary() {
  const { badges, xp, getRank } = useGame();
  const rank = getRank();

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/40">
        <h2 className="font-serif text-2xl font-black text-amber-200 mb-1">BADGE SANCTUARY & RANKINGS</h2>
        <p className="text-slate-300 text-xs">Unlock Vibrant Expedition Trophies & Mathematical Mastery Badges</p>

        {/* Current Rank Banner */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/60 border-2 border-amber-400/50 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Expedition Rank</div>
            <div className="font-serif text-2xl font-black text-amber-300 flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400 animate-bounce" />
              {rank.title} (Level {rank.level})
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Earned XP</div>
            <div className="font-mono text-3xl font-black text-cyan-300">{xp} XP</div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between hover-bounce ${
              b.unlocked
                ? 'bg-slate-900/90 border-amber-400 gold-glow'
                : 'bg-slate-950/60 border-slate-800 opacity-60'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${
                  b.unlocked ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 text-slate-950 shadow-xl' : 'bg-slate-800 text-slate-500'
                }`}>
                  {b.unlocked ? <Award className="w-8 h-8" /> : <Lock className="w-6 h-6" />}
                </div>

                <div className="flex gap-0.5">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${b.unlocked ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="font-serif font-extrabold text-amber-100 text-base mb-1">{b.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{b.desc}</p>
            </div>

            {b.unlocked && (
              <div className="mt-4 pt-2 border-t border-amber-400/20 text-[11px] text-cyan-300 flex items-center gap-1 font-extrabold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Unlocked & Verified</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
