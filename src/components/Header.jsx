import React from 'react';
import { useGame } from '../context/GameContext';
import { Coins, Flame, Trophy, Sparkles, Settings, Compass } from 'lucide-react';

export default function Header() {
  const { xp, coins, streak, getRank, difficulty, setDifficulty } = useGame();
  const rank = getRank();

  return (
    <header className="glass-panel sticky top-0 z-40 px-4 py-3 border-b-2 border-amber-400/50 flex items-center justify-between shadow-xl bg-slate-900/95 backdrop-blur-md">
      {/* Brand & Explorer Title */}
      <div className="flex items-center space-x-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 flex items-center justify-center font-black text-2xl text-slate-950 shadow-md transform hover:rotate-6 transition-transform cursor-pointer border border-amber-200">
          🤠
        </div>
        <div>
          <h1 className="font-extrabold text-lg md:text-xl tracking-wide text-amber-300 flex items-center gap-2 drop-shadow">
            DESERT GEOMETRY EXPEDITION
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/40 font-bold hidden sm:inline-block">
              Primary Math Adventure
            </span>
          </h1>
          <p className="text-xs text-amber-200/80 flex items-center gap-2 font-medium">
            <span>DSKP 6.1 Sudut</span> • <span className="text-emerald-400 font-bold">Rank: {rank.title} (Lvl {rank.level})</span>
          </p>
        </div>
      </div>

      {/* Stats Counters & Mode Select */}
      <div className="flex items-center space-x-3 md:space-x-5">
        {/* Streak Counter */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-2xl border-2 border-orange-500/50 text-xs shadow-inner">
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-bounce-gentle" />
          <span className="text-orange-200 font-extrabold">{streak} Day Streak</span>
        </div>

        {/* Coins Counter */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-2xl border-2 border-amber-400/50 text-xs shadow-inner">
          <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-yellow-300 font-black">{coins} Coins</span>
        </div>

        {/* XP Progress Bar */}
        <div className="hidden md:flex flex-col items-end w-36">
          <div className="flex justify-between w-full text-[11px] text-amber-200/90 font-bold mb-1">
            <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-400" /> XP</span>
            <span className="font-mono text-amber-300">{xp}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-amber-400/30 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 rounded-full transition-all duration-500 shadow"
              style={{ width: `${Math.min(100, (xp % 500) / 5)}%` }}
            />
          </div>
        </div>

        {/* Difficulty Level Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border-2 border-amber-400/40 text-xs">
          <Settings className="w-3.5 h-3.5 text-amber-400 ml-1" />
          {['A', 'B', 'C'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficulty(lvl)}
              title={lvl === 'A' ? 'Guided Support Mode' : lvl === 'B' ? 'Standard Challenge Mode' : 'Master Geometer Mode'}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                difficulty === lvl
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'text-amber-300/60 hover:text-amber-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
