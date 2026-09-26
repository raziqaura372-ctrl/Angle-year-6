import React from 'react';
import { useGame } from '../../context/GameContext';
import { GraduationCap, Download, CheckCircle2, AlertTriangle, Users, BookOpen, Layers } from 'lucide-react';

export default function TeacherDashboard() {
  const { missionProgress, xp, coins, teacherLogs, reflections, difficulty, setDifficulty } = useGame();

  const completedMissionsCount = Object.values(missionProgress).filter(m => m.completed).length;

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      missionProgress,
      xp,
      coins,
      reflections,
      teacherLogs,
      exportTimestamp: new Date().toISOString()
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `desert_geometry_formative_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-panel p-6 rounded-xl border border-sand-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-sand-100 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-sand-500" />
            TEACHER ANALYTICAL DASHBOARD
          </h2>
          <p className="text-sand-300 text-xs">Real-Time Formative Assessment & Differentiation Control Center</p>
        </div>

        <button
          onClick={exportData}
          className="px-4 py-2 rounded-lg bg-oasis-500 text-desertNavy-950 font-bold text-xs flex items-center gap-2 hover:bg-oasis-400 transition-all gold-glow"
        >
          <Download className="w-4 h-4" />
          Export Formative Data (JSON)
        </button>
      </div>

      {/* Class Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-sand-500/20">
          <div className="text-xs text-sand-400 font-semibold uppercase">Completed Missions</div>
          <div className="font-mono text-3xl font-extrabold text-sand-500 mt-1">{completedMissionsCount} / 8</div>
          <div className="text-[10px] text-sand-400 mt-1">Curriculum progress indicator</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-sand-500/20">
          <div className="text-xs text-sand-400 font-semibold uppercase">Support Level Active</div>
          <div className="font-serif text-2xl font-bold text-oasis-300 mt-1">
            Level {difficulty} ({difficulty === 'A' ? 'Guided' : difficulty === 'B' ? 'Standard' : 'Challenge'})
          </div>
          <div className="text-[10px] text-sand-400 mt-1">Scaffolding level override</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-sand-500/20">
          <div className="text-xs text-sand-400 font-semibold uppercase">Total XP Accumulated</div>
          <div className="font-mono text-3xl font-extrabold text-terracotta-300 mt-1">{xp} XP</div>
          <div className="text-[10px] text-sand-400 mt-1">Gamified engagement score</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-sand-500/20">
          <div className="text-xs text-sand-400 font-semibold uppercase">Reflection Submissions</div>
          <div className="font-mono text-3xl font-extrabold text-sand-100 mt-1">{reflections.length}</div>
          <div className="text-[10px] text-sand-400 mt-1">Metacognitive journal logs</div>
        </div>
      </div>

      {/* Scaffolding Differentiation Override */}
      <div className="glass-panel p-5 rounded-xl border border-sand-500/30 space-y-3">
        <h3 className="font-serif font-bold text-sand-200 text-base">Differentiation & Scaffolding Override</h3>
        <p className="text-xs text-sand-300">Adjust active scaffolding support across all interactive missions:</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { lvl: 'A', title: 'LEVEL A – Guided', desc: 'Maximum visual ray guides, protractor auto-snap, 3-level prompt hints.' },
            { lvl: 'B', title: 'LEVEL B – Standard', desc: 'Standard interactive controls, manual protractor positioning, optional AI prompts.' },
            { lvl: 'C', title: 'LEVEL C – Challenge', desc: 'Minimal scaffolding, open-ended problem solving, higher-order reasoning required.' },
          ].map((item) => (
            <button
              key={item.lvl}
              onClick={() => setDifficulty(item.lvl)}
              className={`p-4 rounded-xl border text-left transition-all ${
                difficulty === item.lvl
                  ? 'bg-sand-500 text-desertNavy-950 border-sand-400 font-bold shadow-md gold-glow'
                  : 'bg-desertNavy-800 text-sand-200 border-sand-500/20 hover:border-sand-500/50'
              }`}
            >
              <div className="text-sm font-bold">{item.title}</div>
              <div className="text-xs mt-1 opacity-80 leading-relaxed">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Formative Student Logs Audit */}
      <div className="glass-panel p-5 rounded-xl border border-sand-500/30 space-y-3">
        <h3 className="font-serif font-bold text-sand-200 text-base">Real-Time Expedition Formative Audit Logs</h3>

        <div className="bg-desertNavy-950/80 rounded-lg p-3 max-h-60 overflow-y-auto space-y-2 border border-sand-500/20 text-xs font-mono">
          {teacherLogs.length === 0 ? (
            <div className="text-sand-400 italic">No expedition events logged yet. Student actions will populate here in real-time.</div>
          ) : (
            teacherLogs.map((log, i) => (
              <div key={i} className="flex gap-3 text-sand-200 border-b border-sand-500/10 pb-1.5">
                <span className="text-oasis-400 font-bold">[{log.timestamp}]</span>
                <span>{log.action}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
