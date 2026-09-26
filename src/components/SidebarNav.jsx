import React from 'react';
import { useGame } from '../context/GameContext';
import { Map, Flag, Award, BookOpen, GraduationCap, FileText, Layers } from 'lucide-react';

export default function SidebarNav() {
  const { activeTab, setActiveTab } = useGame();

  const navItems = [
    { id: 'map', label: 'Desert Expedition Map', icon: Map },
    { id: 'mission', label: 'Active Mission', icon: Flag },
    { id: 'badges', label: 'Badge Sanctuary', icon: Award },
    { id: 'journal', label: 'Reflection Journal', icon: BookOpen },
    { id: 'teacher', label: 'Teacher Dashboard', icon: GraduationCap },
    { id: 'academic', label: 'Academic & NPDL Hub', icon: FileText },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-sand-500/20 p-4 flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="space-y-2">
        <div className="text-xs font-semibold tracking-wider text-sand-400 uppercase px-3 py-2">
          Expedition Hub
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-sand-500 to-terracotta-500 text-desertNavy-950 font-bold shadow-md gold-glow'
                  : 'text-sand-200 hover:bg-desertNavy-800/80 hover:text-sand-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-desertNavy-950' : 'text-sand-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Curriculum Summary Badge */}
      <div className="bg-desertNavy-900/90 p-3 rounded-lg border border-sand-500/20 text-xs text-sand-300 space-y-1">
        <div className="flex items-center gap-1.5 text-sand-400 font-semibold">
          <Layers className="w-4 h-4 text-oasis-400" />
          <span>Curriculum Basis</span>
        </div>
        <p className="text-[11px] leading-tight text-sand-300">
          SUKATAN DAN GEOMETRI - 6.1 Sudut (DSKP 6.1.1 & 6.1.2)
        </p>
        <p className="text-[10px] text-sand-400">
          Relational understanding through dynamic geometry & AI scaffolding.
        </p>
      </div>
    </aside>
  );
}
