import React, { useState } from 'react';
import { useStudio, ROLES } from '../context/StudioContext';
import { UserCheck, Users, HelpCircle, Edit3, Eye, Mic, Activity } from 'lucide-react';

export default function TeacherDashboard() {
  const {
    pupils,
    groups,
    updatePupilRole,
    updatePupilGroup,
    updateGroupQuestion,
    globalQuestion,
    setGlobalQuestion,
    setActiveTab,
    setCurrentPupilId,
    startPresentation,
    activities
  } = useStudio();

  const [selectedGroupTab, setSelectedGroupTab] = useState('biru');
  const [editingQuestionGroupId, setEditingQuestionGroupId] = useState(null);
  const [questionInput, setQuestionInput] = useState('');
  const [globalQuestionInput, setGlobalQuestionInput] = useState(globalQuestion);
  const [showGlobalQuestionModal, setShowGlobalQuestionModal] = useState(false);

  const handleSaveGroupQuestion = (groupId) => {
    if (questionInput.trim()) {
      updateGroupQuestion(groupId, questionInput);
    }
    setEditingQuestionGroupId(null);
  };

  const handleSaveGlobalQuestion = () => {
    if (globalQuestionInput.trim()) {
      setGlobalQuestion(globalQuestionInput);
      groups.forEach((g) => updateGroupQuestion(g.id, globalQuestionInput));
    }
    setShowGlobalQuestionModal(false);
  };

  return (
    <div className="space-y-6 py-4 max-w-7xl mx-auto">
      {/* Teacher Dashboard Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 p-6 md:p-8 rounded-3xl shadow-xl text-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/20 text-slate-950 text-xs font-black mb-2">
            <UserCheck className="w-4 h-4" />
            <span>Papan Kawalan Guru / Pentadbir Kelas</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">
            PAPARAN GURU • PENGURUSAN 30 MURID
          </h1>
          <p className="text-xs md:text-sm font-bold text-slate-900 mt-1">
            Pantau aktiviti melukis 5 kumpulan, beri soalan tugasan, dan urus peranan murid secara langsung.
          </p>
        </div>

        <button
          onClick={() => setShowGlobalQuestionModal(true)}
          className="px-5 py-3 rounded-2xl bg-slate-950 text-amber-300 hover:text-amber-200 font-black text-xs md:text-sm shadow-xl flex items-center gap-2 border border-amber-400/30"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Set Soalan Serentak Seluruh Kelas</span>
        </button>
      </div>

      {/* Class Statistics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <div className="text-2xl font-black text-cyan-400">30</div>
          <div className="text-xs font-bold text-slate-400">Jumlah Murid Tahun 4</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <div className="text-2xl font-black text-emerald-400">5</div>
          <div className="text-xs font-bold text-slate-400">Kumpulan (6 Murid / Kumpulan)</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <div className="text-2xl font-black text-amber-400">
            {groups.filter((g) => g.status === 'Dihantar').length} / 5
          </div>
          <div className="text-xs font-bold text-slate-400">Hasil Telah Dihantar</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
          <div className="text-2xl font-black text-purple-400">
            {activities.length}
          </div>
          <div className="text-xs font-bold text-slate-400">Aktiviti Masa Nyata Terakam</div>
        </div>
      </div>

      {/* Group Monitoring Cards (5 Groups Overview) */}
      <div className="space-y-3">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <span>Status Aktiviti 5 Kumpulan</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {groups.map((grp) => {
            const isSelected = grp.id === selectedGroupTab;
            const grpPupils = pupils.filter((p) => p.groupId === grp.id);

            return (
              <div
                key={grp.id}
                onClick={() => setSelectedGroupTab(grp.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? `${grp.bgClass} ring-2 ring-cyan-400 shadow-xl`
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-black ${grp.badgeClass}`}>
                    {grp.name}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300">
                    {grp.status}
                  </span>
                </div>

                <div className="space-y-1.5 mt-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Ahli ({grpPupils.length}):</div>
                  <div className="text-xs text-slate-200 line-clamp-3 font-medium">
                    {grpPupils.map((p) => p.name).join(', ')}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const firstMember = grpPupils[0];
                      if (firstMember) setCurrentPupilId(firstMember.id);
                      setActiveTab('kanvas');
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold flex items-center gap-1"
                    title="Buka Kanvas Kumpulan Ini"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Kanvas</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startPresentation(grp.id);
                    }}
                    className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-sm"
                    title="Mula Pembentangan Kumpulan Ini"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Bentang</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Group Detailed Management Panel */}
      {(() => {
        const currentSelectedGroup = groups.find((g) => g.id === selectedGroupTab) || groups[0];
        const groupMembers = pupils.filter((p) => p.groupId === currentSelectedGroup.id);

        return (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-xl text-sm font-black ${currentSelectedGroup.badgeClass}`}>
                  {currentSelectedGroup.name}
                </span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Pengurusan Ahli & Tugasan Kumpulan
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    Status: <strong className="text-cyan-300">{currentSelectedGroup.status}</strong>
                  </span>
                </div>
              </div>

              {/* Task Question Editing for Group */}
              <div className="flex items-center gap-2">
                {editingQuestionGroupId === currentSelectedGroup.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={questionInput}
                      onChange={(e) => setQuestionInput(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-cyan-400 text-white text-xs font-semibold w-64 md:w-80"
                    />
                    <button
                      onClick={() => handleSaveGroupQuestion(currentSelectedGroup.id)}
                      className="p-2 rounded-xl bg-emerald-500 text-white text-xs font-bold"
                    >
                      Simpan
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingQuestionGroupId(currentSelectedGroup.id);
                      setQuestionInput(currentSelectedGroup.question);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Soalan Tugasan Kumpulan Ini</span>
                  </button>
                )}
              </div>
            </div>

            {/* Current Group Question Banner */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-cyan-500/30 text-slate-200 text-xs md:text-sm font-medium">
              <span className="text-cyan-400 font-bold block mb-1">Soalan Tugasan Kumpulan:</span>
              "{currentSelectedGroup.question}"
            </div>

            {/* Members Table with Role Editing */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                Senarai 6 Murid & Peranan dalam {currentSelectedGroup.name}:
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-black text-cyan-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Murid</th>
                      <th className="py-2.5 px-3">Nama Penuh</th>
                      <th className="py-2.5 px-3">Peranan Tugasan</th>
                      <th className="py-2.5 px-3">Tukar Kumpulan</th>
                      <th className="py-2.5 px-3">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {groupMembers.map((pupil) => (
                      <tr key={pupil.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-200">
                          <span className="text-lg mr-2">{pupil.avatar}</span>
                          #{pupil.id}
                        </td>
                        <td className="py-2.5 px-3 font-black text-white">{pupil.name}</td>
                        <td className="py-2.5 px-3">
                          <select
                            value={pupil.role}
                            onChange={(e) => updatePupilRole(pupil.id, e.target.value)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-bold text-xs"
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-3">
                          <select
                            value={pupil.groupId}
                            onChange={(e) => updatePupilGroup(pupil.id, e.target.value)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-bold text-xs capitalize"
                          >
                            {groups.map((g) => (
                              <option key={g.id} value={g.id}>
                                {g.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-3">
                          <button
                            onClick={() => {
                              setCurrentPupilId(pupil.id);
                              setActiveTab('kanvas');
                            }}
                            className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-[11px] border border-cyan-500/30"
                          >
                            Masuk Kanvas Ini
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Global Real-Time Activity Feed for Teacher */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <span>Log Aktiviti Melukis & Mewarna Terkini (Seluruh Kelas)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Masa Nyata • {activities.length} Aktiviti
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
          {activities.map((act) => {
            const grp = groups.find((g) => g.id === act.groupId);
            return (
              <div
                key={act.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${grp?.badgeClass || 'bg-slate-800'}`}>
                    {grp?.name || act.groupId}
                  </span>
                  <div>
                    <span className="font-bold text-white">{act.studentName}</span>{' '}
                    <span className="text-slate-300">{act.action}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {act.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Setting Global Question */}
      {showGlobalQuestionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>Set Soalan Tugasan Serentak Untuk Semua Kumpulan</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Masukkan soalan tugasan isipadu cecair yang akan dipaparkan di bahagian atas kanvas kelima-lima kumpulan:
            </p>

            <textarea
              rows={3}
              value={globalQuestionInput}
              onChange={(e) => setGlobalQuestionInput(e.target.value)}
              placeholder="Cth: Lukiskan dan warnakan situasi bagi menunjukkan operasi TAMBAH isipadu cecair: 2 L 500 mL + 1 L 250 mL..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium text-xs focus:border-amber-400 focus:outline-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowGlobalQuestionModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSaveGlobalQuestion}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md"
              >
                Hantar Soalan Ke Semua 5 Kumpulan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
