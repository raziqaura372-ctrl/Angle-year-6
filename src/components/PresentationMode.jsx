import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Mic, MessageSquare, Send, Users, Sparkles, ChevronLeft, ChevronRight, Award, HelpCircle } from 'lucide-react';

export default function PresentationMode() {
  const {
    groups,
    pupils,
    presentationGroupId,
    setPresentationGroupId,
    currentGroup,
    currentPupil,
    addComment
  } = useStudio();

  const activeGroup = groups.find((g) => g.id === presentationGroupId) || groups[0];
  const activeMembers = pupils.filter((p) => p.groupId === activeGroup.id);
  const presenter = activeMembers.find((m) => m.role === 'Pembentang') || activeMembers[0];

  const [commentText, setCommentText] = useState('');
  const [commentType, setCommentType] = useState('soalan');

  const handleSendComment = () => {
    if (!commentText.trim()) return;

    addComment(activeGroup.id, {
      groupFrom: currentGroup.name,
      studentName: currentPupil.name,
      text: commentText,
      type: commentType
    });

    setCommentText('');
  };

  const presetQuestions = [
    'Mengapa kamu menggunakan warna biru untuk air?',
    'Bagaimana kamu menyemak jawapan akhir?',
    'Bahagian manakah menunjukkan isipadu yang ditambah/ditolak?'
  ];

  const groupIndex = groups.findIndex((g) => g.id === activeGroup.id);

  const prevGroup = () => {
    const prevIdx = (groupIndex - 1 + groups.length) % groups.length;
    setPresentationGroupId(groups[prevIdx].id);
  };

  const nextGroup = () => {
    const nextIdx = (groupIndex + 1) % groups.length;
    setPresentationGroupId(groups[nextIdx].id);
  };

  return (
    <div className="space-y-6 py-4 max-w-7xl mx-auto min-h-[calc(100vh-120px)] flex flex-col justify-between">
      {/* Top Group Switcher Bar for Presentation */}
      <div className="bg-slate-900/90 border border-cyan-500/30 p-4 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                Mod Pembentangan Kelas
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500 text-slate-950">
                Layar Skrin Projeksi
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white">
              PEMBENTANGAN {activeGroup.name.toUpperCase()}
            </h1>
          </div>
        </div>

        {/* Group Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {groups.map((g) => {
            const isSelected = g.id === activeGroup.id;
            return (
              <button
                key={g.id}
                onClick={() => setPresentationGroupId(g.id)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                  isSelected
                    ? `${g.badgeClass} ring-2 ring-white shadow-lg scale-105`
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Fullscreen Presentation Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Artwork & Presentation View (9 Cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          {/* Header Banner */}
          <div className={`p-4 rounded-2xl bg-gradient-to-r ${activeGroup.headerClass} text-white shadow-md flex items-center justify-between`}>
            <div>
              <div className="text-xs font-bold opacity-90">Tugasan Pembentangan:</div>
              <h2 className="text-sm md:text-lg font-black">{activeGroup.question}</h2>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-bold uppercase opacity-80">Pembentang Utama:</div>
              <div className="text-sm font-black flex items-center gap-1">
                <span>🎤 {presenter?.name || 'Wakil Kumpulan'}</span>
              </div>
            </div>
          </div>

          {/* Large Screen Artwork Display */}
          <div className="bg-white p-4 rounded-2xl shadow-inner border-2 border-slate-700 flex-1 flex items-center justify-center min-h-[380px] relative">
            {activeGroup.canvasData ? (
              <img
                src={activeGroup.canvasData}
                alt={activeGroup.name}
                className="max-h-[500px] w-full object-contain rounded-xl"
              />
            ) : (
              <div className="text-center p-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-3xl shadow-inner">
                  🖼️
                </div>
                <p className="text-base font-bold text-slate-600">
                  Hasil lukisan bagi {activeGroup.name} belum disiapkan.
                </p>
              </div>
            )}

            {/* Navigation Arrows on Artwork */}
            <button
              onClick={prevGroup}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-2xl border border-slate-700 transition-transform active:scale-90"
              title="Kumpulan Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextGroup}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-2xl border border-slate-700 transition-transform active:scale-90"
              title="Kumpulan Seterusnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Presentation Guide Lines for Year 4 Pupils */}
          <div className="bg-slate-950/80 border border-cyan-500/30 p-4 rounded-2xl space-y-2">
            <span className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Panduan Pembentang Kumpulan (Tahun 4):</span>
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-semibold text-slate-300">
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                1️⃣ Terangkan apa yang anda lukis (bekas / cecair).
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                2️⃣ Jelaskan warna yang digunakan.
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                3️⃣ Tunjukkan operasi (Tambah / Tolak).
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                4️⃣ Bacakan jawapan akhir isipadu cecair.
              </div>
            </div>
          </div>
        </div>

        {/* Right Q&A & Inter-Group Discussion Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
          {/* Members List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>Ahli {activeGroup.name} (6 Murid)</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {activeMembers.map((m) => (
                <div
                  key={m.id}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px]"
                >
                  <div className="font-bold text-slate-100 flex items-center gap-1">
                    <span>{m.avatar}</span>
                    <span className="truncate">{m.name}</span>
                  </div>
                  <div className="text-[10px] text-cyan-400 font-semibold">{m.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Class Q&A List */}
          <div className="flex-1 space-y-3 border-t border-slate-800 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>Soalan & Komen Rakan Kelas</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {activeGroup.comments?.length || 0} Maklum Balas
              </span>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {activeGroup.comments?.length > 0 ? (
                activeGroup.comments.map((c) => (
                  <div
                    key={c.id}
                    className={`p-2.5 rounded-2xl border text-xs leading-relaxed ${
                      c.type === 'soalan'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 mb-1">
                      <span>
                        <strong className="text-white">{c.studentName}</strong> ({c.groupFrom})
                      </span>
                      <span className="font-mono text-slate-500">{c.timestamp}</span>
                    </div>
                    <p className="font-medium">{c.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs font-semibold">
                  Belum ada soalan. Sila kemukakan soalan untuk pembentang!
                </div>
              )}
            </div>
          </div>

          {/* Send Question Form */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex flex-wrap gap-1">
              {presetQuestions.map((pq) => (
                <button
                  key={pq}
                  onClick={() => {
                    setCommentText(pq);
                    setCommentType('soalan');
                  }}
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-slate-700"
                >
                  "{pq}"
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Kemukakan soalan..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium text-xs focus:border-cyan-400 focus:outline-none"
              />

              <button
                onClick={handleSendComment}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Hantar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
