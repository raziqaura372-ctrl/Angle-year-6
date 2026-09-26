import React from 'react';
import { useGame } from '../../context/GameContext';
import { Compass, Mountain, Target, Key, Hexagon, Navigation, Sun, Crown, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

export default function GraphicalMap() {
  const { setActiveTab, setActiveMissionId, missionProgress } = useGame();

  const landmarkMissions = [
    { id: 0, title: 'Desert Arrival', desc: 'Tutorial & Dynamic Ray Controls', icon: Compass, color: 'from-amber-400 to-yellow-500', landmark: 'Dune Base Camp' },
    { id: 1, title: 'Dune of Angles', desc: 'Classify Acute, Right, Obtuse & Straight Angles', icon: Mountain, color: 'from-orange-500 to-amber-600', landmark: 'Whispering Dune' },
    { id: 2, title: 'Oasis Compass', desc: 'Measure Exact Angles with Virtual Protractor', icon: Target, color: 'from-cyan-400 to-teal-500', landmark: 'Emerald Spring Oasis' },
    { id: 3, title: 'Ancient Gate', desc: 'DSKP 6.1.2: Construct Angles to Given Values', icon: Key, color: 'from-rose-500 to-red-600', landmark: 'Stone Lintel Gate' },
    { id: 4, title: 'Geometric Temple', desc: 'DSKP 6.1.1: Draw Polygons (3-8 Sisi) on Grids', icon: Hexagon, color: 'from-purple-500 to-indigo-600', landmark: 'Polygonal Sanctuary' },
    { id: 5, title: 'Lost Desert Map', desc: 'Caravan Navigation & Turn Angle Bearings', icon: Navigation, color: 'from-blue-500 to-cyan-600', landmark: 'Caravan Ridge Trail' },
    { id: 6, title: 'Architect Challenge', desc: 'Open-Ended Solar Collector Architecture', icon: Sun, color: 'from-amber-300 to-orange-400', landmark: 'Solar Panel Outpost' },
    { id: 7, title: 'Final Boss Challenge', desc: 'The Hidden Oasis Multi-Stage Master Geometer', icon: Crown, color: 'from-yellow-400 via-amber-500 to-rose-500', landmark: 'Pyramid Citadel' },
  ];

  const handleLaunch = (id) => {
    setActiveMissionId(id);
    setActiveTab('mission');
  };

  return (
    <div className="space-y-6">
      {/* Visual Trail Header */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/40 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/40 flex justify-between items-center">
        <div>
          <span className="bg-cyan-500 text-slate-950 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Interactive Primary Learning Map
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-amber-200 mt-1">
            EXPEDITION LANDMARK TRAIL
          </h2>
          <p className="text-xs text-cyan-200">
            Click on any landmark node to launch interactive dynamic geometry challenges!
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 px-4 py-2 rounded-xl border border-amber-400/30">
          <Crown className="w-5 h-5 text-amber-400 animate-bounce" />
          <span className="text-xs font-bold text-amber-300">Goal: Unlock Hidden Oasis</span>
        </div>
      </div>

      {/* Graphical Grid Trail */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {landmarkMissions.map((m) => {
          const Icon = m.icon;
          const prog = missionProgress[`mission${m.id}`] || { completed: false };

          return (
            <div
              key={m.id}
              onClick={() => handleLaunch(m.id)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer hover-bounce flex flex-col justify-between relative overflow-hidden ${
                prog.completed
                  ? 'bg-slate-900/90 border-cyan-400 oasis-glow'
                  : 'bg-slate-950/80 border-amber-400/30 hover:border-amber-400'
              }`}
            >
              {/* Landmark Color Banner */}
              <div className={`h-2.5 w-full bg-gradient-to-r ${m.color} absolute top-0 left-0`} />

              <div>
                <div className="flex justify-between items-start mb-3 pt-1">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${m.color} flex items-center justify-center text-slate-950 shadow-lg font-black`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                    prog.completed
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                      : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                  }`}>
                    STAGE {m.id}
                  </span>
                </div>

                <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">{m.landmark}</div>
                <h3 className="font-serif font-extrabold text-amber-100 text-base mb-1">{m.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-bold">
                <span className={prog.completed ? 'text-cyan-300 flex items-center gap-1' : 'text-amber-400 flex items-center gap-1'}>
                  {prog.completed ? <CheckCircle2 className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4 text-amber-400" />}
                  {prog.completed ? 'Stage Mastered' : 'Explore Landmark'}
                </span>

                <span className="text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-amber-400/30">
                  +{m.id === 7 ? 300 : 100} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
