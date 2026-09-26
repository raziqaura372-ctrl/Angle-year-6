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

import { Map, Flag, ChevronRight, Lock, CheckCircle2, Award, Crown } from 'lucide-react';

function ExpeditionMap() {
  const { setActiveTab, setActiveMissionId, missionProgress } = useGame();

  const missions = [
    { id: 0, title: 'Mission 0: Desert Arrival', desc: 'Tutorial & Dynamic Ray Controls', icon: 'Compass' },
    { id: 1, title: 'Mission 1: Dune of Angles', desc: 'Classify Acute, Right, Obtuse & Straight Angles', icon: 'Mountain' },
    { id: 2, title: 'Mission 2: Oasis Compass', desc: 'Measure Exact Angles with Virtual Protractor', icon: 'Target' },
    { id: 3, title: 'Mission 3: Ancient Gate', desc: 'DSKP 6.1.2: Construct Angles to Given Values', icon: 'Key' },
    { id: 4, title: 'Mission 4: Geometric Temple', desc: 'DSKP 6.1.1: Draw Polygons (3-8 Sisi) on Grids', icon: 'Hexagon' },
    { id: 5, title: 'Mission 5: Lost Desert Map', desc: 'Caravan Navigation & Turn Angle Bearings', icon: 'Navigation' },
    { id: 6, title: 'Mission 6: Architect Challenge', desc: 'Open-Ended Solar Collector Architecture', icon: 'Sun' },
    { id: 7, title: 'Mission 7: Final Boss Challenge', desc: 'The Hidden Oasis Multi-Stage Master Geometer', icon: 'Crown' },
  ];

  const handleLaunchMission = (mId) => {
    setActiveMissionId(mId);
    setActiveTab('mission');
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl border border-sand-500/30 bg-gradient-to-r from-desertNavy-950 via-desertNavy-900 to-sand-900/30">
        <h2 className="font-serif text-2xl font-bold text-sand-100 mb-1">DESERT EXPEDITION MAP</h2>
        <p className="text-sand-300 text-xs">Navigate across ancient ruins and reconstruct mathematical structures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {missions.map((m) => {
          const prog = missionProgress[`mission${m.id}`] || { completed: false };
          return (
            <div
              key={m.id}
              onClick={() => handleLaunchMission(m.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between hover:scale-102 ${
                prog.completed
                  ? 'bg-desertNavy-900/90 border-oasis-500/50 oasis-glow'
                  : 'bg-desertNavy-950/80 border-sand-500/20 hover:border-sand-500'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sand-500/20 text-sand-300 border border-sand-500/30">
                    STAGE {m.id}
                  </span>
                  {prog.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-oasis-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-sand-400" />
                  )}
                </div>
                <h3 className="font-serif font-bold text-sand-100 text-base mb-1">{m.title}</h3>
                <p className="text-xs text-sand-300 leading-relaxed">{m.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-sand-500/20 flex justify-between items-center text-xs font-bold">
                <span className={prog.completed ? 'text-oasis-300' : 'text-sand-400'}>
                  {prog.completed ? 'Completed' : 'Start Expedition'}
                </span>
                <span className="text-sand-500">+{m.id === 7 ? 300 : 100} XP</span>
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
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-desertNavy-950 to-desertNavy-900 min-h-[calc(100vh-65px)]">
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
