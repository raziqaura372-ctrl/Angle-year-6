import React, { createContext, useContext, useState, useEffect } from 'react';

const StudioContext = createContext();

export const DEFAULT_GROUPS = [
  {
    id: 'biru',
    name: 'Kumpulan Biru',
    colorName: 'Biru',
    colorHex: '#3b82f6',
    bgClass: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    headerClass: 'from-blue-600 to-indigo-700',
    badgeClass: 'bg-blue-500 text-white',
    question: 'Lukiskan dan warnakan situasi bagi menunjukkan operasi TAMBAH isipadu cecair: 2 L 500 mL + 1 L 250 mL = 3 L 750 mL.',
    status: 'Sedang Melukis',
    canvasData: null,
    lastSaved: null,
    submittedAt: null,
    comments: [
      {
        id: 'c1',
        groupFrom: 'Kumpulan Hijau',
        studentName: 'Ammar Ziqri',
        text: 'Mengapa kamu menggunakan warna biru muda untuk cecair bekas pertama?',
        type: 'soalan',
        timestamp: '10:15 AM'
      },
      {
        id: 'c2',
        groupFrom: 'Kumpulan Merah',
        studentName: 'Dhia Qaisara',
        text: 'Sangat kemas dan jelas visualisasi penggabungan dua isipadu ini!',
        type: 'komen',
        timestamp: '10:18 AM'
      }
    ]
  },
  {
    id: 'hijau',
    name: 'Kumpulan Hijau',
    colorName: 'Hijau',
    colorHex: '#22c55e',
    bgClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    headerClass: 'from-emerald-600 to-teal-700',
    badgeClass: 'bg-emerald-500 text-white',
    question: 'Lukiskan dan warnakan situasi bagi menunjukkan operasi TOLAK isipadu cecair: 4 L 800 mL - 1 L 500 mL = 3 L 300 mL.',
    status: 'Sedang Melukis',
    canvasData: null,
    lastSaved: null,
    submittedAt: null,
    comments: []
  },
  {
    id: 'merah',
    name: 'Kumpulan Merah',
    colorName: 'Merah',
    colorHex: '#ef4444',
    bgClass: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
    headerClass: 'from-rose-600 to-red-700',
    badgeClass: 'bg-rose-500 text-white',
    question: 'Lukiskan dan warnakan situasi bagi menunjukkan operasi TAMBAH isipadu cecair: 1 L 750 mL + 2 L 250 mL = 4 L.',
    status: 'Sedang Melukis',
    canvasData: null,
    lastSaved: null,
    submittedAt: null,
    comments: []
  },
  {
    id: 'kuning',
    name: 'Kumpulan Kuning',
    colorName: 'Kuning',
    colorHex: '#eab308',
    bgClass: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    headerClass: 'from-amber-500 to-yellow-600',
    badgeClass: 'bg-amber-500 text-slate-950',
    question: 'Lukiskan dan warnakan situasi bagi menunjukkan operasi TOLAK isipadu cecair: 3 L 500 mL - 2 L 100 mL = 1 L 400 mL.',
    status: 'Belum Mula',
    canvasData: null,
    lastSaved: null,
    submittedAt: null,
    comments: []
  },
  {
    id: 'ungu',
    name: 'Kumpulan Ungu',
    colorName: 'Ungu',
    colorHex: '#a855f7',
    bgClass: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    headerClass: 'from-purple-600 to-fuchsia-700',
    badgeClass: 'bg-purple-500 text-white',
    question: 'Lukiskan dan warnakan situasi bagi menunjukkan operasi TAMBAH isipadu cecair: 3 L 200 mL + 1 L 600 mL = 4 L 800 mL.',
    status: 'Sedang Melukis',
    canvasData: null,
    lastSaved: null,
    submittedAt: null,
    comments: []
  }
];

export const ROLES = [
  'Ketua Kumpulan',
  'Pelukis',
  'Pewarna',
  'Pencatat',
  'Penyemak',
  'Pembentang'
];

export const DEFAULT_PUPILS = [
  // Kumpulan Biru
  { id: 1, name: 'Adam Rayyan', groupId: 'biru', role: 'Ketua Kumpulan', avatar: '👦' },
  { id: 2, name: 'Aina Sofea', groupId: 'biru', role: 'Pelukis', avatar: '👧' },
  { id: 3, name: 'Hakim Daniel', groupId: 'biru', role: 'Pewarna', avatar: '👦' },
  { id: 4, name: 'Siti Sarah', groupId: 'biru', role: 'Pencatat', avatar: '👧' },
  { id: 5, name: 'Muhammad Danish', groupId: 'biru', role: 'Penyemak', avatar: '👦' },
  { id: 6, name: 'Nur Zara', groupId: 'biru', role: 'Pembentang', avatar: '👧' },

  // Kumpulan Hijau
  { id: 7, name: 'Ammar Ziqri', groupId: 'hijau', role: 'Ketua Kumpulan', avatar: '👦' },
  { id: 8, name: 'Nurul Iman', groupId: 'hijau', role: 'Pelukis', avatar: '👧' },
  { id: 9, name: 'Harith Irfan', groupId: 'hijau', role: 'Pewarna', avatar: '👦' },
  { id: 10, name: 'Mia Sara', groupId: 'hijau', role: 'Pencatat', avatar: '👧' },
  { id: 11, name: 'Aqil Rifqi', groupId: 'hijau', role: 'Penyemak', avatar: '👦' },
  { id: 12, name: 'Hannah Jasmine', groupId: 'hijau', role: 'Pembentang', avatar: '👧' },

  // Kumpulan Merah
  { id: 13, name: 'Rayyan Mikael', groupId: 'merah', role: 'Ketua Kumpulan', avatar: '👦' },
  { id: 14, name: 'Dhia Qaisara', groupId: 'merah', role: 'Pelukis', avatar: '👧' },
  { id: 15, name: 'Faris Hazim', groupId: 'merah', role: 'Pewarna', avatar: '👦' },
  { id: 16, name: 'Damia Erina', groupId: 'merah', role: 'Pencatat', avatar: '👧' },
  { id: 17, name: 'Luqman Nulhakim', groupId: 'merah', role: 'Penyemak', avatar: '👦' },
  { id: 18, name: 'Aleeya Maisarah', groupId: 'merah', role: 'Pembentang', avatar: '👧' },

  // Kumpulan Kuning
  { id: 19, name: 'Danish Aniq', groupId: 'kuning', role: 'Ketua Kumpulan', avatar: '👦' },
  { id: 20, name: 'Iris Nur', groupId: 'kuning', role: 'Pelukis', avatar: '👧' },
  { id: 21, name: 'Tengku Zaim', groupId: 'kuning', role: 'Pewarna', avatar: '👦' },
  { id: 22, name: 'Puteri Balqis', groupId: 'kuning', role: 'Pencatat', avatar: '👧' },
  { id: 23, name: 'Megat Izham', groupId: 'kuning', role: 'Penyemak', avatar: '👦' },
  { id: 24, name: 'Sofia Medina', groupId: 'kuning', role: 'Pembentang', avatar: '👧' },

  // Kumpulan Ungu
  { id: 25, name: 'Umar Al-Farooq', groupId: 'ungu', role: 'Ketua Kumpulan', avatar: '👦' },
  { id: 26, name: 'Batrisya Humaira', groupId: 'ungu', role: 'Pelukis', avatar: '👧' },
  { id: 27, name: 'Izz Qaisar', groupId: 'ungu', role: 'Pewarna', avatar: '👦' },
  { id: 28, name: 'Nur Medina', groupId: 'ungu', role: 'Pencatat', avatar: '👧' },
  { id: 29, name: 'Zafran Syah', groupId: 'ungu', role: 'Penyemak', avatar: '👦' },
  { id: 30, name: 'Qisya Damia', groupId: 'ungu', role: 'Pembentang', avatar: '👧' }
];

export const DEFAULT_QUESTION = "Lukiskan dan warnakan visualisasi operasi tambah atau tolak isipadu cecair mengikut soalan kumpulan anda!";

export function StudioProvider({ children }) {
  const [activeTab, setActiveTab] = useState('utama'); // 'utama', 'kanvas', 'galeri', 'pembentangan', 'guru'
  const [pupils, setPupils] = useState(() => {
    const saved = localStorage.getItem('studio_pupils');
    return saved ? JSON.parse(saved) : DEFAULT_PUPILS;
  });

  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem('studio_groups');
    return saved ? JSON.parse(saved) : DEFAULT_GROUPS;
  });

  const [currentPupilId, setCurrentPupilId] = useState(2); // Aina Sofea (Kumpulan Biru)
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [globalQuestion, setGlobalQuestion] = useState(DEFAULT_QUESTION);
  const [presentationGroupId, setPresentationGroupId] = useState('biru');

  const [activities, setActivities] = useState([
    { id: 'act-1', studentName: 'Aina Sofea', groupId: 'biru', action: 'melukis silinder penyukat 2 L', timestamp: '10:10 AM' },
    { id: 'act-2', studentName: 'Hakim Daniel', groupId: 'biru', action: 'mewarna air biru 500 mL', timestamp: '10:12 AM' },
    { id: 'act-3', studentName: 'Siti Sarah', groupId: 'biru', action: 'menulis label "+ 1 L 250 mL"', timestamp: '10:14 AM' },
    { id: 'act-4', studentName: 'Nurul Iman', groupId: 'hijau', action: 'melukis beker 5 L', timestamp: '10:15 AM' }
  ]);

  useEffect(() => {
    localStorage.setItem('studio_pupils', JSON.stringify(pupils));
  }, [pupils]);

  useEffect(() => {
    localStorage.setItem('studio_groups', JSON.stringify(groups));
  }, [groups]);

  const currentPupil = pupils.find(p => p.id === currentPupilId) || pupils[0];
  const currentGroup = groups.find(g => g.id === currentPupil.groupId) || groups[0];
  const currentGroupMembers = pupils.filter(p => p.groupId === currentGroup.id);

  const logActivity = (studentName, groupId, action) => {
    const newAct = {
      id: `act-${Date.now()}`,
      studentName,
      groupId,
      action,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setActivities(prev => [newAct, ...prev.slice(0, 19)]);
  };

  const saveGroupCanvas = (groupId, canvasData) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          canvasData,
          lastSaved: now,
          status: g.status === 'Belum Mula' ? 'Sedang Melukis' : g.status
        };
      }
      return g;
    }));
    logActivity(currentPupil.name, groupId, 'menyimpan hasil kanvas lukisan');
  };

  const submitGroupCanvas = (groupId, canvasData) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          canvasData: canvasData || g.canvasData,
          submittedAt: now,
          status: 'Dihantar'
        };
      }
      return g;
    }));
    logActivity(currentPupil.name, groupId, 'menghantar hasil kumpulan ke Galeri Kelas');
  };

  const updatePupilRole = (pupilId, newRole) => {
    setPupils(prev => prev.map(p => p.id === pupilId ? { ...p, role: newRole } : p));
  };

  const updatePupilGroup = (pupilId, newGroupId) => {
    setPupils(prev => prev.map(p => p.id === pupilId ? { ...p, groupId: newGroupId } : p));
  };

  const updateGroupQuestion = (groupId, question) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, question } : g));
  };

  const addComment = (targetGroupId, commentObj) => {
    const newComment = {
      id: `c-${Date.now()}`,
      groupFrom: commentObj.groupFrom || currentGroup.name,
      studentName: commentObj.studentName || currentPupil.name,
      text: commentObj.text,
      type: commentObj.type || 'komen',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGroups(prev => prev.map(g => {
      if (g.id === targetGroupId) {
        return {
          ...g,
          comments: [...g.comments, newComment]
        };
      }
      return g;
    }));
  };

  const startPresentation = (groupId) => {
    setPresentationGroupId(groupId);
    setActiveTab('pembentangan');
    const grp = groups.find(g => g.id === groupId);
    logActivity('Guru', groupId, `memulakan pembentangan bagi ${grp?.name || groupId}`);
  };

  return (
    <StudioContext.Provider value={{
      activeTab,
      setActiveTab,
      pupils,
      setPupils,
      groups,
      setGroups,
      currentPupilId,
      setCurrentPupilId,
      currentPupil,
      currentGroup,
      currentGroupMembers,
      isTeacherMode,
      setIsTeacherMode,
      globalQuestion,
      setGlobalQuestion,
      presentationGroupId,
      setPresentationGroupId,
      activities,
      logActivity,
      saveGroupCanvas,
      submitGroupCanvas,
      updatePupilRole,
      updatePupilGroup,
      updateGroupQuestion,
      addComment,
      startPresentation
    }}>
      {children}
    </StudioContext.Provider>
  );
}

export const useStudio = () => useContext(StudioContext);
