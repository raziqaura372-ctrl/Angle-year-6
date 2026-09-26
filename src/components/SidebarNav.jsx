import React from 'react';
import { useGame } from '../context/GameContext';
import { Map, Flag, Award, BookOpen, GraduationCap, FileText, Layers, Sparkles } from 'lucide-react';

export default function SidebarNav() {
  const { activeTab, setActiveTab, academyCompleted } = useGame();

  const navItems = [
    { id: 'academy', label: '1. Desert Academy (Learn)', icon: Sparkles },
    { id: 'map', label: '2. Expedition Map Trail', icon: Map },
    { id: 'mission', label: '3. Active Mission', icon: Flag },
    { id: 'badges', label: '4. Badge Sanctuary', icon: Award },
    { id: 'journal', label: '5. Reflection Journal', icon: BookOpen },
    { id: 'teacher', label: '6. Teacher Dashboard', icon: GraduationCap },
    { id: 'academic', label: '7. Academic & NPDL Hub', icon: FileText },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-amber-400/20 p-4 flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="space-y-2">
        <div className="text-xs font-black tracking-wider text-amber-300 uppercase px-3 py-2">
          Expedition Hub
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black shadow-lg gold-glow'
                  : 'text-slate-200 hover:bg-slate-900 hover:text-amber-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-400/20 text-xs text-slate-300 space-y-1">
        <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Curriculum Basis</span>
        </div>
        <p className="text-[11px] leading-tight text-slate-300">
          SUKATAN DAN GEOMETRI - 6.1 Sudut (DSKP 6.1.1 & 6.1.2)
        </p>
        <p className="text-[10px] text-slate-400">
          Relational understanding through mandatory academy & game missions.
        </p>
      </div>
    </aside>
  );
}
