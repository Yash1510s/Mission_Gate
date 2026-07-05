import { create } from 'zustand';

const STORAGE_KEY = 'gate-prep-companion-progress';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      checked: state.checked,
      notes: state.notes,
      difficulty: state.difficulty,
      confidence: state.confidence,
      revisionCount: state.revisionCount,
      lastStudied: state.lastStudied,
    }));
  } catch (e) {
    console.warn('Failed to save progress:', e);
  }
}

const stored = loadFromStorage();

export const useProgressStore = create((set, get) => ({
  // Topic completion state: { "cs-0-0-0": true, ... }
  checked: stored.checked || {},

  // Personal notes per topic: { "cs-0-0-0": "My note here", ... }
  notes: stored.notes || {},

  // Difficulty rating per topic: { "cs-0-0-0": "medium", ... }
  difficulty: stored.difficulty || {},

  // Confidence level per topic: { "cs-0-0-0": "learning", ... }
  // Values: "not_started", "learning", "revision", "mastered"
  confidence: stored.confidence || {},

  // Revision count per topic: { "cs-0-0-0": 2, ... }
  revisionCount: stored.revisionCount || {},

  // Last studied timestamp: { "cs-0-0-0": 1720000000000, ... }
  lastStudied: stored.lastStudied || {},

  // Toggle a topic's completion
  toggleTopic: (id) => {
    set(state => {
      const newChecked = { ...state.checked };
      const newLastStudied = { ...state.lastStudied };
      if (newChecked[id]) {
        delete newChecked[id];
      } else {
        newChecked[id] = true;
        newLastStudied[id] = Date.now();
      }
      const newState = { ...state, checked: newChecked, lastStudied: newLastStudied };
      saveToStorage(newState);
      return newState;
    });
  },

  // Set a note for a topic
  setNote: (id, note) => {
    set(state => {
      const newNotes = { ...state.notes, [id]: note };
      const newState = { ...state, notes: newNotes };
      saveToStorage(newState);
      return newState;
    });
  },

  // Set difficulty for a topic
  setDifficulty: (id, level) => {
    set(state => {
      const newDifficulty = { ...state.difficulty, [id]: level };
      const newState = { ...state, difficulty: newDifficulty };
      saveToStorage(newState);
      return newState;
    });
  },

  // Set confidence level for a topic
  setConfidence: (id, level) => {
    set(state => {
      const newConfidence = { ...state.confidence, [id]: level };
      const newState = { ...state, confidence: newConfidence };
      saveToStorage(newState);
      return newState;
    });
  },

  // Increment revision count
  addRevision: (id) => {
    set(state => {
      const newRevisionCount = { ...state.revisionCount };
      newRevisionCount[id] = (newRevisionCount[id] || 0) + 1;
      const newLastStudied = { ...state.lastStudied, [id]: Date.now() };
      const newState = { ...state, revisionCount: newRevisionCount, lastStudied: newLastStudied };
      saveToStorage(newState);
      return newState;
    });
  },

  // Reset all progress
  resetAll: () => {
    set(() => {
      const newState = {
        checked: {},
        notes: {},
        difficulty: {},
        confidence: {},
        revisionCount: {},
        lastStudied: {},
      };
      saveToStorage(newState);
      return newState;
    });
  },

  // Get counts for a paper (cs or da)
  getPaperCounts: (syllabus, paperId) => {
    const { checked } = get();
    const paper = syllabus[paperId];
    if (!paper) return { total: 0, done: 0 };
    let total = 0, done = 0;
    paper.sections.forEach((sec, si) => {
      sec.groups.forEach((grp, gi) => {
        grp.topics.forEach((_, ti) => {
          total++;
          if (checked[`${paperId}-${si}-${gi}-${ti}`]) done++;
        });
      });
    });
    return { total, done };
  },

  // Get counts for a specific section
  getSectionCounts: (paperId, si, section) => {
    const { checked } = get();
    let total = 0, done = 0;
    section.groups.forEach((grp, gi) => {
      grp.topics.forEach((_, ti) => {
        total++;
        if (checked[`${paperId}-${si}-${gi}-${ti}`]) done++;
      });
    });
    return { total, done };
  },

  // Get recent activity (last N completed topics)
  getRecentActivity: (syllabus, count = 5) => {
    const { lastStudied, checked } = get();
    const entries = Object.entries(lastStudied)
      .filter(([id]) => checked[id])
      .sort(([, a], [, b]) => b - a)
      .slice(0, count);

    return entries.map(([id, timestamp]) => {
      const [paperId, si, gi, ti] = id.split('-');
      const paper = syllabus[paperId];
      if (!paper) return null;
      const section = paper.sections[Number(si)];
      const group = section?.groups[Number(gi)];
      const topic = group?.topics[Number(ti)];
      return { id, paperId, topic, section: section?.name, group: group?.name, timestamp };
    }).filter(Boolean);
  },

  // Get streak count (consecutive days with at least one topic studied)
  getStreak: () => {
    const { lastStudied } = get();
    const dates = [...new Set(
      Object.values(lastStudied).map(ts => new Date(ts).toDateString())
    )].sort((a, b) => new Date(b) - new Date(a));

    if (dates.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      date.setHours(0, 0, 0, 0);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (date.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  },

  // Export progress for cross-device sync / backup
  exportProgress: () => {
    const state = get();
    return {
      checked: state.checked,
      notes: state.notes,
      difficulty: state.difficulty,
      confidence: state.confidence,
      revisionCount: state.revisionCount,
      lastStudied: state.lastStudied,
    };
  },

  // Import and restore progress from backup or sync code
  importProgress: (data) => {
    if (!data || typeof data !== 'object') return false;
    set({
      checked: data.checked || {},
      notes: data.notes || {},
      difficulty: data.difficulty || {},
      confidence: data.confidence || {},
      revisionCount: data.revisionCount || {},
      lastStudied: data.lastStudied || {},
    });
    saveToStorage(get());
    return true;
  },
}));

