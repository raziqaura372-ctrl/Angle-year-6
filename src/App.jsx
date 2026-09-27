import React from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import CanvasWorkspace from './components/CanvasWorkspace';
import ClassGallery from './components/ClassGallery';
import PresentationMode from './components/PresentationMode';
import TeacherDashboard from './components/TeacherDashboard';

function MainContent() {
  const { activeTab } = useStudio();

  return (
    <main className="flex-1 p-4 md:p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-950 min-h-[calc(100vh-70px)] text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto">
        {activeTab === 'utama' && <HomeView />}
        {activeTab === 'kanvas' && <CanvasWorkspace />}
        {activeTab === 'galeri' && <ClassGallery />}
        {activeTab === 'pembentangan' && <PresentationMode />}
        {activeTab === 'guru' && <TeacherDashboard />}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <StudioProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
        <Navbar />
        <MainContent />
      </div>
    </StudioProvider>
  );
}
