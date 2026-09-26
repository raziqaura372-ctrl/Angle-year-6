import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Header from './components/Header';
import SidebarNav from './components/SidebarNav';

import Mission0 from './components/missions/Mission0';
import Mission1 from './components/missions/Mission1';
import Mission2 from './components/missions/Mission2';
import Mission3 from './components/missions/Mission3';
import Mission4 from './components/missions/Mission4';
import Mission5 from './components/missions/Mission5';
import Mission6 from './components/missions/Mission6';
import Mission7Boss from './components/missions/Mission7Boss';

import DuneCompanion from './components/ai/DuneCompanion';
import BadgeSanctuary from './components/gamification/BadgeSanctuary';
import ReflectionJournal from './components/journal/ReflectionJournal';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import AcademicHub from './components/academic/AcademicHub';

import { Map, Flag, ChevronRight, Lock, CheckCircle2, Award, Crown, Star, Sparkles, Navigation, Sun, Compass, Target, Key, Hexagon, Shield, Landmark } from 'lucide-react';

function ExpeditionMap() {
  const { setActiveTab, setActiveMissionId, missionProgress } = useGame();

  const mapLocations = [
    {
      id: 0,
      name: '🏜️ Dune Valley',
      title: 'Mission 0: Desert Arrival',
      desc: 'Master the Dynamic Ray Controls & Ray Exploration',
      icon: Compass,
      color: 'from-amber-400 to-yellow-500',
      badge: 'Arrival Explorer'
    },
    {
      id: 1,
      name: '🌴 Oasis Compass',
      title: 'Mission 1: Dune of Angles',
      desc: 'Classify Acute, Right, Obtuse & Straight Angles',
      icon: MountainIcon,
      color: 'from-emerald-400 to-teal-500',
      badge: 'Angle Classifier'
    },
    {
      id: 2,
      name: '🏛️ Ancient Gate',
      title: 'Mission 2: Oasis Protractor',
      desc: 'Measure Exact Angles with Virtual Protractor',
      icon: Target,
      color: 'from-sky-400 to-blue-500',
      badge: 'Precision Measurer'
    },
    {
      id: 3,
      name: '🔑 Gate Construction',
      title: 'Mission 3: Ancient Gate Construction',
      desc: 'DSKP 6.1.2: Construct Exact Angles to Unlock Ancient Archways',
      icon: Key,
      color: 'from-orange-400 to-amber-500',
      badge: 'Gate Key Master'
    },
    {
      id: 4,
      name: '🔺 Geometry Temple',
      title: 'Mission 4: Geometry Temple',
      desc: 'DSKP 6.1.1: Draw Dynamic Polygons (3-8 Sides) on Grids',
      icon: Hexagon,
      color: 'from-purple-400 to-indigo-500',
      badge: 'Temple Builder'
    },
    {
      id: 5,
      name: '🧭 Navigation Camp',
      title: 'Mission 5: Lost Desert Map',
      desc: 'Caravan Navigation & Turn Angle Bearing Coordinates',
      icon: Navigation,
      color: 'from-rose-400 to-pink-500',
      badge: 'Desert Navigator'
    },
    {
      id: 6,
      name: '💎 Treasure Cave',
      title: 'Mission 6: Architect Challenge',
      desc: 'Open-Ended Solar Collector Architecture & Reflection',
      icon: Sun,
      color: 'from-amber-300 to-orange-500',
      badge: 'Solar Architect'
    },
    {
      id: 7,
      name: '🏰 Desert Fortress ➔ 🌟 Hidden Oasis',
      title: 'Mission 7: Final Boss Challenge',
      desc: 'The Hidden Oasis Multi-Stage Master Geometer Sanctuary',
      icon: Crown,
      color: 'from-yellow-300 via-amber-400 to-emerald-400',
      badge: 'Master Geometer'
    },
  ];

  function MountainIcon(props) {
    return <Landmark {...props} />;
  }

  // Calculate overall progress percentage
  const completedCount = Object.keys(missionProgress).filter(
    (k) => missionProgress[k]?.completed
  ).length;
  const progressPercent = Math.round((completedCount / mapLocations.length) * 100);

  const handleLaunchMission = (mId) => {
    setActiveMissionId(mId);
    setActiveTab('mission');
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Banner & Progress Bar */}
      <div className="desert-card p-6 md:p-8 rounded-3xl border-2 border-amber-400/60 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 shadow-2xl relative overflow-hidden">
        {/* Ambient Desert Backdrop Lights */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Interactive Desert Adventure World
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-amber-300 tracking-wide">
              DESERT EXPEDITION MAP
            </h2>
            <p className="text-amber-100/90 text-xs md:text-sm max-w-xl font-medium">
              Join Explorer <strong className="text-amber-300">LUMA</strong> across 8 interactive geometric locations! Reconstruct ancient ruins, measure angle gateways, and unlock the 🌟 Hidden Oasis.
            </p>
          </div>

          <div className="w-full md:w-80 bg-slate-950/90 p-4 rounded-2xl border border-amber-400/40 space-y-2 shadow-inner">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-amber-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                Journey to the Hidden Oasis
              </span>
              <span className="text-emerald-400 font-mono text-sm">{progressPercent}%</span>
            </div>
            <div className="w-full h-4 bg-slate-900 rounded-full border border-amber-400/30 overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 rounded-full transition-all duration-700 shadow"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-amber-200/70 font-bold">
              <span>0% Desert Gate</span>
              <span>50% Temple</span>
              <span>100% Hidden Oasis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {mapLocations.map((loc) => {
          const IconComp = loc.icon;
          const prog = missionProgress[`mission${loc.id}`] || { completed: false };
          const isUnlocked = loc.id === 0 || (missionProgress[`mission${loc.id - 1}`]?.completed);

          return (
            <div
              key={loc.id}
              onClick={() => handleLaunchMission(loc.id)}
              className={`desert-card-interactive p-5 rounded-3xl cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                prog.completed
                  ? 'border-emerald-400/80 oasis-glow bg-gradient-to-b from-slate-900/90 to-emerald-950/40'
                  : isUnlocked
                  ? 'border-amber-400/60 gold-glow bg-gradient-to-b from-slate-900/90 to-amber-950/30'
                  : 'border-slate-800 opacity-80 hover:opacity-100 bg-slate-950/60'
              }`}
            >
              {/* Completed Badge Glow */}
              {prog.completed && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-bl-2xl flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-slate-950" /> COMPLETED
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-slate-950 text-amber-300 border border-amber-400/30 shadow-inner">
                    LOCATION {loc.id + 1}
                  </span>
                  <div className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${loc.color} flex items-center justify-center text-slate-950 font-black shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>

                <div className="text-xs font-black text-amber-400/90 uppercase tracking-wider mb-1">
                  {loc.name}
                </div>
                <h3 className="font-extrabold text-amber-100 text-base mb-2 group-hover:text-amber-300 transition-colors">
                  {loc.title}
                </h3>
                <p className="text-xs text-amber-200/80 leading-relaxed font-medium">
                  {loc.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-amber-400/20 flex justify-between items-center text-xs font-black">
                <span className={`flex items-center gap-1 ${prog.completed ? 'text-emerald-400' : 'text-amber-300'}`}>
                  {prog.completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Badge Unlocked!
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-4 h-4 text-amber-400" /> Start Expedition
                    </>
                  )}
                </span>
                <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/30">
                  +{loc.id === 7 ? 300 : 100} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MainContent() {
  const { activeTab, activeMissionId, setActiveMissionId } = useGame();

  const renderMissionComponent = () => {
    switch (activeMissionId) {
      case 0: return <Mission0 onComplete={() => setActiveMissionId(1)} />;
      case 1: return <Mission1 onComplete={() => setActiveMissionId(2)} />;
      case 2: return <Mission2 onComplete={() => setActiveMissionId(3)} />;
      case 3: return <Mission3 onComplete={() => setActiveMissionId(4)} />;
      case 4: return <Mission4 onComplete={() => setActiveMissionId(5)} />;
      case 5: return <Mission5 onComplete={() => setActiveMissionId(6)} />;
      case 6: return <Mission6 onComplete={() => setActiveMissionId(7)} />;
      case 7: return <Mission7Boss onComplete={() => {}} />;
      default: return <Mission0 />;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 min-h-[calc(100vh-65px)]">
      <div className="max-w-7xl mx-auto space-y-6">
        {activeTab === 'map' && <ExpeditionMap />}
        {activeTab === 'mission' && renderMissionComponent()}
        {activeTab === 'badges' && <BadgeSanctuary />}
        {activeTab === 'journal' && <ReflectionJournal />}
        {activeTab === 'teacher' && <TeacherDashboard />}
        {activeTab === 'academic' && <AcademicHub />}
      </div>
      <DuneCompanion />
    </main>
  );
}

export default function App() {
  return (
    <GameProvider>
      <div className="min-h-screen text-amber-100 flex flex-col font-sans">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <SidebarNav />
          <MainContent />
        </div>
      </div>
    </GameProvider>
  );
}
