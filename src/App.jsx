import React, { useState } from 'react';
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

import { Map, Flag, ChevronRight, Lock, CheckCircle2, Award, Crown, Star, Sparkles, Compass } from 'lucide-react';

function ExpeditionMap() {
  const { setActiveTab, setActiveMissionId, missionProgress } = useGame();

  const mapLocations = [
    {
      id: 0,
      name: '🏜️ Dune Valley',
      title: 'Mission 0: Desert Arrival',
      desc: 'Tutorial & Dynamic Ray Controls',
      theme: 'from-amber-600/30 to-yellow-600/20 border-amber-500/50',
      badgeColor: 'bg-amber-500 text-desertNavy-950',
      actionLabel: 'EXPLORE'
    },
    {
      id: 1,
      name: '🌴 Oasis',
      title: 'Mission 1: Dune of Angles',
      desc: 'Classify Acute, Right, Obtuse & Straight Angles',
      theme: 'from-orange-600/30 to-red-600/20 border-orange-500/50',
      badgeColor: 'bg-orange-500 text-white',
      actionLabel: 'CLASSIFY'
    },
    {
      id: 2,
      name: '🏛️ Ancient Gate',
      title: 'Mission 2: Oasis Compass',
      desc: 'Measure Exact Angles with Virtual Protractor',
      theme: 'from-teal-600/30 to-emerald-600/20 border-teal-500/50',
      badgeColor: 'bg-teal-500 text-desertNavy-950',
      actionLabel: 'MEASURE'
    },
    {
      id: 3,
      name: '🔺 Geometry Temple',
      title: 'Mission 3: Ancient Gate',
      desc: 'DSKP 6.1.2: Construct Angles to Given Values',
      theme: 'from-yellow-600/30 to-amber-700/20 border-yellow-500/50',
      badgeColor: 'bg-yellow-400 text-desertNavy-950',
      actionLabel: 'BUILD ANGLE'
    },
    {
      id: 4,
      name: '🧭 Navigation Camp',
      title: 'Mission 4: Geometric Temple',
      desc: 'DSKP 6.1.1: Draw Polygons (3-8 Sisi) on Grids',
      theme: 'from-emerald-600/30 to-teal-700/20 border-emerald-500/50',
      badgeColor: 'bg-emerald-500 text-desertNavy-950',
      actionLabel: 'DRAW POLYGON'
    },
    {
      id: 5,
      name: '💎 Treasure Cave',
      title: 'Mission 5: Lost Desert Map',
      desc: 'Caravan Navigation & Course Turn Bearings',
      theme: 'from-sky-600/30 to-blue-700/20 border-sky-500/50',
      badgeColor: 'bg-sky-400 text-desertNavy-950',
      actionLabel: 'NAVIGATE'
    },
    {
      id: 6,
      name: '🏰 Desert Fortress',
      title: 'Mission 6: Architect Challenge',
      desc: 'Open-Ended Solar Collector Architecture',
      theme: 'from-purple-600/30 to-indigo-700/20 border-purple-500/50',
      badgeColor: 'bg-purple-500 text-white',
      actionLabel: 'DESIGN'
    },
    {
      id: 7,
      name: '🌟 Hidden Oasis',
      title: 'Mission 7: Final Boss Challenge',
      desc: 'The Hidden Oasis Multi-Stage Master Geometer',
      theme: 'from-fuchsia-600/40 via-purple-700/30 to-indigo-950/80 border-fuchsia-400 gold-glow',
      badgeColor: 'bg-gradient-to-r from-amber-400 to-fuchsia-500 text-desertNavy-950',
      actionLabel: 'FINAL CHALLENGE'
    },
  ];

  // Calculate expedition completion percentage
  const completedCount = Object.values(missionProgress).filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / mapLocations.length) * 100);

  const handleLaunchMission = (mId) => {
    setActiveMissionId(mId);
    setActiveTab('mission');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Gamification Journey Progress */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-sand-500/40 bg-gradient-to-r from-desertNavy-950 via-desertNavy-900 to-sand-950/70 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-extrabold uppercase tracking-widest inline-block mb-2">
              DESERT EXPEDITION MAP
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-sand-100 flex items-center gap-2">
              <span>JOURNEY TO THE HIDDEN OASIS</span>
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            </h2>
            <p className="text-sand-300 text-xs md:text-sm mt-1">
              Select an interactive landmark below to guide Explorer Luma through mathematical challenges!
            </p>
          </div>

          {/* Expedition Progress Counter Box */}
          <div className="bg-desertNavy-900/90 p-4 rounded-xl border border-sand-500/30 text-right shrink-0">
            <div className="text-xs text-sand-400 font-bold uppercase tracking-wider">Missions Completed</div>
            <div className="font-serif text-2xl font-extrabold text-amber-400 flex items-center justify-end gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              <span>{completedCount} / {mapLocations.length}</span>
            </div>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-extrabold text-sand-300">
            <span>0% (Camp)</span>
            <span className="text-amber-400 font-mono text-sm">{progressPercent}% Journey Complete</span>
            <span>100% (Hidden Oasis)</span>
          </div>
          <div className="w-full h-4 bg-desertNavy-950 rounded-full overflow-hidden p-0.5 border-2 border-sand-500/40 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-teal-400 to-fuchsia-500 rounded-full transition-all duration-700 gold-glow"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Desert Map Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {mapLocations.map((loc) => {
          const prog = missionProgress[`mission${loc.id}`] || { completed: false, stars: 0 };
          const isUnlocked = loc.id === 0 || missionProgress[`mission${loc.id - 1}`]?.completed;

          return (
            <div
              key={loc.id}
              onClick={() => handleLaunchMission(loc.id)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group hover:scale-[1.03] shadow-xl bg-gradient-to-b ${loc.theme} ${
                prog.completed
                  ? 'oasis-glow border-teal-400'
                  : isUnlocked
                  ? 'hover:border-amber-400'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div>
                {/* Location Header */}
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm ${loc.badgeColor}`}>
                    {loc.name}
                  </span>

                  {prog.completed ? (
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-desertNavy-950 px-2 py-0.5 rounded-full border border-amber-500/40">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>3/3</span>
                    </div>
                  ) : isUnlocked ? (
                    <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <Lock className="w-4 h-4 text-sand-500" />
                  )}
                </div>

                {/* Mission Title & Storyline Description */}
                <h3 className="font-serif font-extrabold text-sand-100 text-base md:text-lg mb-1 group-hover:text-amber-300 transition-colors">
                  {loc.title}
                </h3>
                <p className="text-xs text-sand-200 leading-relaxed font-medium">
                  {loc.desc}
                </p>
              </div>

              {/* Action Button Footer */}
              <div className="mt-5 pt-3 border-t border-sand-500/30 flex justify-between items-center text-xs font-bold">
                <span className={`btn-playful px-3 py-1 text-xs ${
                  prog.completed
                    ? 'btn-oasis'
                    : isUnlocked
                    ? 'btn-gold'
                    : 'bg-desertNavy-800 text-sand-400 border border-sand-500/20'
                }`}>
                  {prog.completed ? 'REVIEW MISSION' : loc.actionLabel}
                </span>

                <span className="text-amber-400 font-mono font-extrabold">
                  +{loc.id === 7 ? '300' : '100'} XP
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
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-desertNavy-950 via-desertNavy-900 to-desertNavy-950 min-h-[calc(100vh-65px)]">
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
      <div className="min-h-screen bg-desertNavy-950 text-sand-100 flex flex-col font-sans">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <SidebarNav />
          <MainContent />
        </div>
      </div>
    </GameProvider>
  );
}
