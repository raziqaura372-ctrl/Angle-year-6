import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Header from './components/Header';
import SidebarNav from './components/SidebarNav';

import DesertScenery from './components/visuals/DesertScenery';
import MascotAvatars from './components/visuals/MascotAvatars';
import GraphicalMap from './components/visuals/GraphicalMap';

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
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-purple-950 min-h-[calc(100vh-65px)]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Graphic Scenery Banner */}
        <DesertScenery />

        {/* Avatar Selector Bar */}
        <MascotAvatars />

        {/* Tab Routing */}
        {activeTab === 'map' && <GraphicalMap />}
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
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <SidebarNav />
          <MainContent />
        </div>
      </div>
    </GameProvider>
  );
}
