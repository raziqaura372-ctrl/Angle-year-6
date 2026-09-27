import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Home, Palette, Image, Mic, UserCheck, Droplets, Sparkles, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    pupils,
    currentPupilId,
    setCurrentPupilId,
    currentPupil,
    currentGroup,
    isTeacherMode,
    setIsTeacherMode
  } = useStudio();

  const [showPupilMenu, setShowPupilMenu] = useState(false);

  const navItems = [
    { id: 'utama', label: 'Utama', icon: Home, emoji: '🏠' },
    { id: 'kanvas', label: 'Kanvas Kumpulan', icon: Palette, emoji: '🎨' },
    { id: 'galeri', label: 'Galeri Kelas', icon: Image, emoji: '🖼️' },
    { id: 'pembentangan', label: 'Pembentangan', icon: Mic, emoji: '🎤' },
    { id: 'guru', label: 'Papan Guru', icon: UserCheck, emoji: '👩‍🏫' }
  ];

  return (
    <header className="bg-slate-900/90 border-b border-cyan-500/30 sticky top-0 z-50 backdrop-blur-md shadow-lg shadow-cyan-950/40">
      <div className="max-w-7xl mx-auto px-3 py-2 md:px-6 md:py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('utama')}>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 transform hover:scale-105 transition-transform">
            <Droplets className="w-6 h-6 text-white animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg md:text-xl font-black bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-300 bg-clip-text text-transparent tracking-wide">
                STUDIO LUKISAN MATEMATIK
              </span>
              <Sparkles className="w-4 h-4 text-amber-400 hidden sm:block" />
            </div>
            <p className="text-xs font-semibold text-cyan-300/80">
              Visualisasi Isipadu Cecair • Tahun 4
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 max-w-full">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl font-bold text-sm transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 scale-105 ring-2 ring-cyan-300/50'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
                }`}
              >
                <span className="text-base">{item.emoji}</span>
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Switcher / Profile Bar */}
        <div className="relative">
          <button
            onClick={() => setShowPupilMenu(!showPupilMenu)}
            className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 hover:border-cyan-400/50 px-3 py-1.5 rounded-2xl shadow-inner transition-all hover:bg-slate-750"
          >
            {isTeacherMode ? (
              <div className="flex items-center gap-2">
                <span className="text-lg">👩‍🏫</span>
                <div className="text-left leading-tight hidden sm:block">
                  <div className="text-xs font-black text-amber-400">Mod Guru</div>
                  <div className="text-[10px] text-slate-400">Pentadbir Kelas</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentPupil.avatar}</span>
                <div className="text-left leading-tight hidden sm:block">
                  <div className="text-xs font-black text-slate-100 flex items-center gap-1">
                    {currentPupil.name}
                  </div>
                  <div className="text-[10px] font-semibold flex items-center gap-1">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${currentGroup.badgeClass}`}>
                      {currentGroup.name}
                    </span>
                    <span className="text-slate-400 font-normal">({currentPupil.role})</span>
                  </div>
                </div>
              </div>
            )}
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {/* Pupil Picker Dropdown */}
          {showPupilMenu && (
            <div className="absolute right-0 mt-2 w-72 md:w-80 bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl p-3 z-50 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Pilih Murid (30 Murid)
                </span>
                <button
                  onClick={() => {
                    setIsTeacherMode(!isTeacherMode);
                    setShowPupilMenu(false);
                  }}
                  className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                    isTeacherMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-300 hover:bg-amber-500/20'
                  }`}
                >
                  {isTeacherMode ? 'Tukar ke Mod Murid' : '👩‍🏫 Mod Guru'}
                </button>
              </div>

              <div className="space-y-1">
                {pupils.map((p) => {
                  const isSelected = !isTeacherMode && p.id === currentPupilId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setCurrentPupilId(p.id);
                        setIsTeacherMode(false);
                        setShowPupilMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-bold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{p.avatar}</span>
                        <div>
                          <div className="font-bold text-slate-100">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.role}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold capitalize px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {p.groupId}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
