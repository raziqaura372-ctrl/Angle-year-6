import React from 'react';
import { useGame } from '../context/GameContext';
import { Map, Flag, Award, BookOpen, GraduationCap, FileText, Layers, Compass } from 'lucide-react';

export default function SidebarNav() {
  const { activeTab, setActiveTab } = useGame();

  const navItems = [
    { id: 'map', label: 'Desert Expedition Map', icon: Map, color: 'from-amber-400 to-orange-400' },
    { id: 'mission', label: 'Active Mission', icon: Flag, color: 'from-emerald-400 to-teal-400' },
    { id: 'badges', label: 'Badge Sanctuary', icon: Award, color: 'from-purple-400 to-indigo-400' },
    { id: 'journal', label: 'Reflection Journal', icon: BookOpen, color: 'from-sky-400 to-blue-400' },
    { id: 'teacher', label: 'Teacher Dashboard', icon: GraduationCap, color: 'from-rose-400 to-pink-400' },
    { id: 'academic', label: 'Academic & NPDL Hub', icon: FileText, color: 'from-amber-300 to-yellow-500' },
  ];

  return (
    <aside className="w-64 glass-panel border-r-2 border-amber-400/30 p-4 flex flex-col justify-between shrink-0 hidden md:flex bg-slate-900/90">
      <div className="space-y-3">
        <div className="text-xs font-black tracking-wider text-amber-300/80 uppercase px-3 py-1 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-amber-400" />
          Expedition Hub
        </div>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-black transition-all playful-btn ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-slate-950 shadow-lg scale-102`
                    : 'text-amber-100 hover:bg-slate-800/80 hover:text-amber-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Curriculum Basis Badge */}
      <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-amber-400/30 text-xs text-amber-200/90 space-y-1.5 shadow-inner">
        <div className="flex items-center gap-1.5 text-amber-300 font-extrabold">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Curriculum Basis</span>
        </div>
        <p className="text-[11px] font-bold text-amber-100 leading-tight">
          SUKATAN DAN GEOMETRI - 6.1 Sudut (DSKP 6.1.1 & 6.1.2)
        </p>
        <p className="text-[10px] text-amber-300/70">
          Relational understanding through dynamic geometry & LUMA AI scaffolding.
        </p>
      </div>
    </aside>
  );
}
