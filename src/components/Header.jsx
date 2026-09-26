import React from 'react';
import { useGame } from '../context/GameContext';
import { Compass, Coins, Award, Sparkles, UserCheck, Settings } from 'lucide-react';

export default function Header() {
  const { xp, coins, streak, getRank, difficulty, setDifficulty } = useGame();
  const rank = getRank();

  return (
    <header className="glass-panel sticky top-0 z-40 px-4 py-3 border-b border-sand-500/30 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sand-500 to-terracotta-500 flex items-center justify-center font-serif text-lg font-bold text-desertNavy-950 shadow-md">
          DG
        </div>
        <div>
          <h1 className="font-serif text-lg md:text-xl font-bold tracking-wide text-sand-100 flex items-center gap-2">
            DESERT GEOMETRY EXPEDITION
            <span className="text-xs px-2 py-0.5 rounded bg-sand-500/20 text-sand-300 border border-sand-500/30 font-sans hidden sm:inline-block">
              MTES6032 Task 2
            </span>
          </h1>
          <p className="text-xs text-sand-300 flex items-center gap-2">
            <span>DSKP 6.1 Sudut</span> • <span className="text-oasis-300 font-medium">Rank: {rank.title} (Lvl {rank.level})</span>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Streak Counter */}
        <div className="hidden sm:flex items-center gap-1.5 bg-desertNavy-800/80 px-3 py-1.5 rounded-lg border border-terracotta-500/40 text-xs">
          <Sparkles className="w-4 h-4 text-terracotta-500 animate-pulse" />
          <span className="text-sand-200 font-semibold">{streak} Day Streak</span>
        </div>

        {/* Coins Counter */}
        <div className="flex items-center gap-1.5 bg-desertNavy-800/80 px-3 py-1.5 rounded-lg border border-sand-500/40 text-xs">
          <Coins className="w-4 h-4 text-sand-500" />
          <span className="text-sand-100 font-bold">{coins} Coins</span>
        </div>

        {/* XP Progress */}
        <div className="hidden md:flex flex-col items-end w-32">
          <div className="flex justify-between w-full text-xs text-sand-300 mb-1">
            <span>XP</span>
            <span className="font-mono text-sand-500">{xp}</span>
          </div>
          <div className="w-full h-2 bg-desertNavy-950 rounded-full overflow-hidden border border-sand-500/20">
            <div
              className="h-full bg-gradient-to-r from-sand-500 to-oasis-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (xp % 500) / 5)}%` }}
            />
          </div>
        </div>

        {/* Differentiation Level Selector */}
        <div className="flex items-center gap-1 bg-desertNavy-950 p-1 rounded-lg border border-sand-500/30 text-xs">
          <Settings className="w-3.5 h-3.5 text-sand-400 ml-1" />
          {['A', 'B', 'C'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficulty(lvl)}
              title={lvl === 'A' ? 'Guided Support' : lvl === 'B' ? 'Standard Challenge' : 'Advanced Problem Solving'}
              className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                difficulty === lvl
                  ? 'bg-sand-500 text-desertNavy-950 shadow-sm'
                  : 'text-sand-400 hover:text-sand-100'
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
