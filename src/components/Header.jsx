import React from 'react';
import { useGame } from '../context/GameContext';
import { Compass, Coins, Award, Sparkles, Star, Gem, Flame, Settings } from 'lucide-react';

export default function Header() {
  const { xp, coins, streak, getRank, difficulty, setDifficulty, missionProgress } = useGame();
  const rank = getRank();

  // Total stars calculation
  const totalStars = Object.values(missionProgress).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const totalGems = Math.floor(xp / 100);

  return (
    <header className="glass-panel sticky top-0 z-40 px-4 py-3 border-b-2 border-sand-500/40 flex items-center justify-between shadow-xl bg-gradient-to-r from-desertNavy-950 via-desertNavy-900 to-sand-950/80">
      <div className="flex items-center space-x-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center font-serif text-xl font-extrabold text-desertNavy-950 shadow-lg gold-glow animate-float">
          🏜️
        </div>
        <div>
          <h1 className="font-serif text-lg md:text-xl font-extrabold tracking-wide text-sand-100 flex items-center gap-2">
            <span>DESERT GEOMETRY EXPEDITION</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sand-500/20 text-sand-200 border border-sand-500/40 font-sans hidden sm:inline-block">
              MTES6032 Task 2
            </span>
          </h1>
          <p className="text-xs text-sand-300 flex items-center gap-2">
            <span>DSKP 6.1 Sudut</span> • <span className="text-teal-300 font-bold">Rank: {rank.title} (Lvl {rank.level})</span>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Stars Counter */}
        <div className="flex items-center gap-1 bg-desertNavy-800/90 px-2.5 py-1.5 rounded-full border border-amber-500/50 text-xs gold-glow">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-amber-300 font-extrabold">{totalStars}</span>
        </div>

        {/* Gems Counter */}
        <div className="hidden sm:flex items-center gap-1 bg-desertNavy-800/90 px-2.5 py-1.5 rounded-full border border-sky-500/50 text-xs">
          <Gem className="w-4 h-4 text-sky-400 fill-sky-400" />
          <span className="text-sky-300 font-extrabold">{totalGems}</span>
        </div>

        {/* Streak Counter */}
        <div className="hidden md:flex items-center gap-1 bg-desertNavy-800/90 px-2.5 py-1.5 rounded-full border border-orange-500/50 text-xs">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
          <span className="text-orange-200 font-bold">{streak} Day Streak</span>
        </div>

        {/* Coins Counter */}
        <div className="flex items-center gap-1 bg-desertNavy-800/90 px-2.5 py-1.5 rounded-full border border-amber-500/50 text-xs">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="text-sand-100 font-extrabold">{coins} Coins</span>
        </div>

        {/* XP Progress Bar */}
        <div className="hidden lg:flex flex-col items-end w-28">
          <div className="flex justify-between w-full text-[10px] text-sand-300 font-bold mb-0.5">
            <span>XP</span>
            <span className="font-mono text-amber-400">{xp}</span>
          </div>
          <div className="w-full h-2 bg-desertNavy-950 rounded-full overflow-hidden border border-sand-500/30">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-teal-400 transition-all duration-500"
              style={{ width: `${Math.min(100, (xp % 500) / 5)}%` }}
            />
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 bg-desertNavy-950 p-1 rounded-full border border-sand-500/30 text-xs">
          <Settings className="w-3.5 h-3.5 text-sand-400 ml-1" />
          {['A', 'B', 'C'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficulty(lvl)}
              title={lvl === 'A' ? 'Guided Support' : lvl === 'B' ? 'Standard Challenge' : 'Advanced Problem Solving'}
              className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all ${
                difficulty === lvl
                  ? 'bg-amber-400 text-desertNavy-950 shadow-sm'
                  : 'text-sand-400 hover:text-white'
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
