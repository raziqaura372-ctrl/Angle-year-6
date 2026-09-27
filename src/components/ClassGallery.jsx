import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Image, MessageSquare, Mic, Maximize2, X, Send, HelpCircle, CheckCircle, Clock } from 'lucide-react';

export default function ClassGallery() {
  const {
    groups,
    pupils,
    currentPupil,
    currentGroup,
    addComment,
    startPresentation
  } = useStudio();

  const [selectedGroupModal, setSelectedGroupModal] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentType, setCommentType] = useState('komen'); // 'soalan' or 'komen'

  const handleSendComment = (groupId) => {
    if (!commentText.trim()) return;

    addComment(groupId, {
      groupFrom: currentGroup.name,
      studentName: currentPupil.name,
      text: commentText,
      type: commentType
    });

    setCommentText('');
  };

  const presetQuestions = [
    'Mengapa kamu menggunakan operasi tolak?',
    'Bagaimana kamu mendapat jawapan tersebut?',
    'Bahagian biru menunjukkan apa?',
    'Apakah peranan yang anda lakukan dalam kumpulan?'
  ];

  return (
    <div className="space-y-6 py-4 max-w-7xl mx-auto">
      {/* Gallery Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-6 md:p-8 rounded-3xl shadow-xl border border-cyan-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-xs font-bold mb-2">
            <Image className="w-4 h-4" />
            <span>Pameran Hasil Kerja Murid</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white">
            GALERI HASIL KELAS
          </h1>
          <p className="text-slate-200 text-xs md:text-sm mt-1 font-medium">
            Lihat hasil lukisan visualisasi isipadu cecair daripada 5 kumpulan kelas Tahun 4!
          </p>
        </div>
      </div>

      {/* 5 Group Submissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((grp) => {
          const members = pupils.filter((p) => p.groupId === grp.id);
          const isSubmitted = grp.status === 'Dihantar';

          return (
            <div
              key={grp.id}
              className={`bg-slate-900/90 border rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all hover:border-cyan-500/50 ${grp.bgClass}`}
            >
              {/* Card Header */}
              <div className={`p-4 bg-gradient-to-r ${grp.headerClass} text-white flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black bg-white/20 backdrop-blur-sm`}>
                    {grp.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  {isSubmitted ? (
                    <span className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Dihantar
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-amber-500/30 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" /> {grp.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Task Question */}
              <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
                <p className="text-xs font-medium text-slate-200 line-clamp-2">
                  "{grp.question}"
                </p>
              </div>

              {/* Canvas Preview Image / Thumbnail */}
              <div className="p-4 bg-slate-950 flex flex-col items-center justify-center min-h-[220px] relative group">
                {grp.canvasData ? (
                  <img
                    src={grp.canvasData}
                    alt={grp.name}
                    className="w-full h-48 object-contain rounded-xl bg-white shadow-inner"
                  />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-2xl">
                      🎨
                    </div>
                    <p className="text-xs text-slate-400 font-semibold">
                      Kumpulan ini sedang melukis kanvas...
                    </p>
                  </div>
                )}

                {/* Hover Overlay Button to Zoom */}
                {grp.canvasData && (
                  <button
                    onClick={() => setSelectedGroupModal(grp)}
                    className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs bg-cyan-500/20 backdrop-blur-xs rounded-xl"
                  >
                    <Maximize2 className="w-5 h-5 text-cyan-300" />
                    <span>Buka Saiz Besar</span>
                  </button>
                )}
              </div>

              {/* Card Footer: Members & Q&A Summary */}
              <div className="p-4 space-y-3 bg-slate-900">
                <div className="text-[10px] font-bold text-slate-400 flex flex-wrap gap-1">
                  {members.map((m) => (
                    <span key={m.id} className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                      {m.name}
                    </span>
                  ))}
                </div>

                {/* Comment & Presentation Trigger Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedGroupModal(grp)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Soalan / Komen ({grp.comments?.length || 0})</span>
                  </button>

                  <button
                    onClick={() => startPresentation(grp.id)}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Bentang</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal View for Detailed Image & Inter-Group Q&A Comments */}
      {selectedGroupModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className={`p-4 md:p-6 bg-gradient-to-r ${selectedGroupModal.headerClass} text-white flex items-center justify-between`}>
              <div>
                <span className="px-3 py-1 rounded-lg text-xs font-black bg-white/20">
                  {selectedGroupModal.name}
                </span>
                <h3 className="text-base md:text-xl font-black mt-2">
                  {selectedGroupModal.question}
                </h3>
              </div>

              <button
                onClick={() => setSelectedGroupModal(null)}
                className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 md:p-6 overflow-y-auto space-y-6">
              {/* High Res Canvas Artwork */}
              <div className="bg-white p-3 rounded-2xl shadow-inner border border-slate-700 flex items-center justify-center">
                {selectedGroupModal.canvasData ? (
                  <img
                    src={selectedGroupModal.canvasData}
                    alt={selectedGroupModal.name}
                    className="max-h-[400px] w-auto object-contain rounded-lg"
                  />
                ) : (
                  <div className="p-12 text-center text-slate-500 font-bold">
                    Tiada lukisan untuk dipaparkan.
                  </div>
                )}
              </div>

              {/* Inter-Group Comments & Question Form (Section 13) */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm md:text-base font-black text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <span>Ruang Soalan & Komen Kumpulan Lain</span>
                  </h4>
                  <span className="text-xs text-slate-400 font-semibold">
                    {selectedGroupModal.comments?.length || 0} Maklum Balas
                  </span>
                </div>

                {/* Preset Prompt Buttons for Year 4 */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    ⚡ Cadangan Soalan Pantas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {presetQuestions.map((pq) => (
                      <button
                        key={pq}
                        onClick={() => {
                          setCommentText(pq);
                          setCommentType('soalan');
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-slate-700 transition-colors"
                      >
                        "{pq}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Input Box */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={commentType}
                    onChange={(e) => setCommentType(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-bold text-xs"
                  >
                    <option value="soalan">❓ Tanya Soalan</option>
                    <option value="komen">💬 Beri Komen</option>
                  </select>

                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Tuliskan soalan atau komen anda di sini..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium text-xs focus:border-cyan-400 focus:outline-none"
                  />

                  <button
                    onClick={() => handleSendComment(selectedGroupModal.id)}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Hantar</span>
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedGroupModal.comments?.map((c) => (
                    <div
                      key={c.id}
                      className={`p-3 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                        c.type === 'soalan'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                          : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <strong className="text-white">{c.studentName}</strong> ({c.groupFrom})
                        </span>
                        <span className="font-mono text-slate-500">{c.timestamp}</span>
                      </div>
                      <p className="text-slate-100 font-medium">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedGroupModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Tutup
              </button>

              <button
                onClick={() => {
                  const id = selectedGroupModal.id;
                  setSelectedGroupModal(null);
                  startPresentation(id);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs shadow-lg flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>MULA PEMBENTANGAN KUMPULAN INI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
