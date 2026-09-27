import React from 'react';
import { useStudio } from '../context/StudioContext';
import { Users, HelpCircle, ArrowRight, Sparkles, Droplets } from 'lucide-react';

export default function HomeView() {
  const {
    currentPupil,
    currentGroup,
    currentGroupMembers,
    groups,
    setActiveTab
  } = useStudio();

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-6 md:p-10 shadow-2xl border border-cyan-400/30">
        <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none">
          <Droplets className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cyan-200 text-xs md:text-sm font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Studio Lukisan & Mewarna Kolaboratif</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
            SELAMAT DATANG KE STUDIO MATEMATIK!
          </h1>

          <p className="text-slate-100 text-sm md:text-lg max-w-2xl font-medium">
            Visualisasikan operasi tambah dan tolak isipadu cecair bersama rakan sekumpulan anda melalui lukisan, warna, label, dan pengiraan!
          </p>
        </div>
      </div>

      {/* Pupil Profile Card & Big Action Button */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20">
                {currentPupil.avatar}
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                  Profil Murid
                </div>
                <h2 className="text-2xl font-black text-white">{currentPupil.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-black ${currentGroup.badgeClass}`}>
                    {currentGroup.name}
                  </span>
                  <span className="text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                    Peranan: <strong className="text-amber-300">{currentPupil.role}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Group Question Preview */}
          <div className="bg-slate-950/60 border border-cyan-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Tugasan Matematik Kumpulan Anda</span>
            </div>
            <p className="text-sm md:text-base font-semibold text-slate-100 leading-relaxed">
              "{currentGroup.question}"
            </p>
          </div>

          {/* Group Members Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Ahli {currentGroup.name} (6 Murid)</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {currentGroupMembers.map((member) => (
                <div
                  key={member.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    member.id === currentPupil.id
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md ring-1 ring-cyan-400/30'
                      : 'bg-slate-800/60 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{member.avatar}</span>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-slate-100 truncate">
                        {member.name}
                      </div>
                      <div className="text-[10px] font-semibold text-cyan-400 truncate">
                        {member.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Big Action Column */}
        <div className="flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/60 border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-2xl">
              🎨
            </div>
            <h3 className="text-xl font-black text-white">
              Ruang Lukisan Digital
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Semua 6 ahli kumpulan akan bekerjasama melukis bekas cecair, mewarnakan isipadu, menambah label pengiraan, dan mempamerkan jawapan akhir secara langsung!
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setActiveTab('kanvas')}
              className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-lg md:text-xl shadow-xl shadow-teal-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 ring-4 ring-emerald-400/30"
            >
              <span>MASUK KE KANVAS KUMPULAN</span>
              <ArrowRight className="w-6 h-6 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab('galeri')}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <span>🖼️ Lihat Galeri Hasil Kelas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Class Overview Cards (5 Groups) */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <span>👥 Status 5 Kumpulan Kelas Tahun 4 (30 Murid)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {groups.map((grp) => {
            const isMyGroup = grp.id === currentGroup.id;
            return (
              <div
                key={grp.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isMyGroup
                    ? 'bg-slate-800 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-black ${grp.badgeClass}`}>
                    {grp.name}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {grp.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium line-clamp-2 mt-2">
                  "{grp.question}"
                </p>
                {isMyGroup && (
                  <div className="mt-3 text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                    <span>✨ Kumpulan Anda</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
