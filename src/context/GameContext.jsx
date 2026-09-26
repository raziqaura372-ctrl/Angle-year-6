import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const INITIAL_BADGES = [
  { id: 'angle_tracker', name: 'Angle Tracker', icon: 'Compass', desc: 'Mastered angle classification (Acute, Right, Obtuse, Straight)', unlocked: false },
  { id: 'precision_builder', name: 'Precision Builder', icon: 'Target', desc: 'Constructed angles with millimeter accuracy', unlocked: false },
  { id: 'polygon_navigator', name: 'Polygon Navigator', icon: 'Hexagon', desc: 'Explored 3-8 sided polygons on square & triangular grids', unlocked: false },
  { id: 'oasis_architect', name: 'Oasis Architect', icon: 'Award', desc: 'Designed geometric structures for desert survival', unlocked: false },
  { id: 'master_geometer', name: 'Master Geometer', icon: 'Crown', desc: 'Completed the Hidden Oasis Final Boss Challenge', unlocked: false },
];

export const INITIAL_PROGRESS = {
  mission0: { completed: false, score: 0, stars: 0 },
  mission1: { completed: false, score: 0, stars: 0 },
  mission2: { completed: false, score: 0, stars: 0 },
  mission3: { completed: false, score: 0, stars: 0 },
  mission4: { completed: false, score: 0, stars: 0 },
  mission5: { completed: false, score: 0, stars: 0 },
  mission6: { completed: false, score: 0, stars: 0 },
  mission7: { completed: false, score: 0, stars: 0 },
};

export function GameProvider({ children }) {
  const [activeTab, setActiveTab] = useState('academy'); // 'academy', 'map', 'mission', 'badges', 'journal', 'teacher', 'academic'
  const [activeMissionId, setActiveMissionId] = useState(0);
  const [academyCompleted, setAcademyCompleted] = useState(() => {
    return localStorage.getItem('dge_academy_completed') === 'true';
  });
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('dge_xp') || '0', 10));
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem('dge_coins') || '50', 10));
  const [streak, setStreak] = useState(1);
  const [difficulty, setDifficulty] = useState('B'); // 'A': Guided, 'B': Standard, 'C': Challenge
  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('dge_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });
  const [missionProgress, setMissionProgress] = useState(() => {
    const saved = localStorage.getItem('dge_progress');
    return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
  });
  const [reflections, setReflections] = useState(() => {
    const saved = localStorage.getItem('dge_reflections');
    return saved ? JSON.parse(saved) : [];
  });
  const [teacherLogs, setTeacherLogs] = useState([]);

  useEffect(() => {
    localStorage.setItem('dge_academy_completed', academyCompleted.toString());
  }, [academyCompleted]);

  useEffect(() => {
    localStorage.setItem('dge_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('dge_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('dge_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('dge_progress', JSON.stringify(missionProgress));
  }, [missionProgress]);

  useEffect(() => {
    localStorage.setItem('dge_reflections', JSON.stringify(reflections));
  }, [reflections]);

  const completeAcademy = () => {
    setAcademyCompleted(true);
    addXp(150);
    setActiveTab('map');
  };

  const addXp = (amount) => {
    setXp(prev => prev + amount);
    setCoins(prev => prev + Math.floor(amount / 2));
  };

  const unlockBadge = (badgeId) => {
    setBadges(prev => prev.map(b => b.id === badgeId ? { ...b, unlocked: true } : b));
  };

  const completeMission = (missionId, score, stars) => {
    setMissionProgress(prev => ({
      ...prev,
      [`mission${missionId}`]: { completed: true, score, stars }
    }));
    addXp(100 * stars);

    if (missionId === 1) unlockBadge('angle_tracker');
    if (missionId === 3) unlockBadge('precision_builder');
    if (missionId === 4) unlockBadge('polygon_navigator');
    if (missionId === 6) unlockBadge('oasis_architect');
    if (missionId === 7) unlockBadge('master_geometer');

    setTeacherLogs(prev => [
      { timestamp: new Date().toLocaleTimeString(), action: `Completed Mission ${missionId} with ${stars} stars (Score: ${score})` },
      ...prev
    ]);
  };

  const addReflection = (reflectionData) => {
    setReflections(prev => [
      { id: Date.now(), date: new Date().toLocaleDateString(), ...reflectionData },
      ...prev
    ]);
  };

  const getRank = () => {
    if (xp < 200) return { title: 'Sand Explorer', level: 1, icon: 'Compass' };
    if (xp < 500) return { title: 'Angle Navigator', level: 2, icon: 'Navigation' };
    if (xp < 900) return { title: 'Oasis Architect', level: 3, icon: 'Shield' };
    if (xp < 1400) return { title: 'Geometry Pathfinder', level: 4, icon: 'Map' };
    return { title: 'Master of the Hidden Oasis', level: 5, icon: 'Crown' };
  };

  return (
    <GameContext.Provider value={{
      activeTab,
      setActiveTab,
      activeMissionId,
      setActiveMissionId,
      academyCompleted,
      completeAcademy,
      xp,
      addXp,
      coins,
      streak,
      badges,
      unlockBadge,
      missionProgress,
      completeMission,
      difficulty,
      setDifficulty,
      reflections,
      addReflection,
      teacherLogs,
      getRank
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
