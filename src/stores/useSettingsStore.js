import { create } from 'zustand';

const STORAGE_KEY = 'gate-prep-companion-settings';

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSettings(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

const stored = loadSettings();

export const useSettingsStore = create((set) => ({
  // GATE 2027 default exam date: Feb 1, 2027
  examDate: stored.examDate || '2027-02-01',

  // Active paper filter: 'both', 'cs', 'da'
  activePaper: stored.activePaper || 'both',

  // Theme: 'dark' (only dark for now, light coming later)
  theme: stored.theme || 'dark',

  // Background Wallpaper preset: 'sonoma', 'lofi', 'cyber', 'obsidian', 'ocean', 'minimal'
  wallpaper: stored.wallpaper || 'sonoma',

  // User name
  userName: stored.userName || 'GATE Aspirant',

  // Sidebar collapsed state
  sidebarCollapsed: stored.sidebarCollapsed || false,

  setExamDate: (date) => {
    set(state => {
      const newState = { ...state, examDate: date };
      saveSettings(newState);
      return newState;
    });
  },

  setActivePaper: (paper) => {
    set(state => {
      const newState = { ...state, activePaper: paper };
      saveSettings(newState);
      return newState;
    });
  },

  setTheme: (theme) => {
    set(state => {
      const newState = { ...state, theme };
      saveSettings(newState);
      return newState;
    });
  },

  setWallpaper: (wallpaper) => {
    set(state => {
      const newState = { ...state, wallpaper };
      saveSettings(newState);
      return newState;
    });
  },

  setUserName: (name) => {
    set(state => {
      const newState = { ...state, userName: name };
      saveSettings(newState);
      return newState;
    });
  },

  toggleSidebar: () => {
    set(state => {
      const newState = { ...state, sidebarCollapsed: !state.sidebarCollapsed };
      saveSettings(newState);
      return newState;
    });
  },

  // Mobile drawer menu state (transient, not persisted to localStorage)
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set(state => ({ mobileMenuOpen: !state.mobileMenuOpen })),


  // Get days until exam
  getDaysUntilExam: () => {
    const { examDate } = useSettingsStore.getState();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    const diff = exam - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  },

  // Export settings for cross-device sync / backup
  exportSettings: () => {
    const state = useSettingsStore.getState();
    return {
      examDate: state.examDate,
      activePaper: state.activePaper,
      theme: state.theme,
      wallpaper: state.wallpaper,
      userName: state.userName,
      sidebarCollapsed: state.sidebarCollapsed,
    };
  },

  // Import and restore settings from backup or sync code
  importSettings: (data) => {
    if (!data || typeof data !== 'object') return false;
    set(state => {
      const newState = {
        ...state,
        examDate: data.examDate || state.examDate,
        activePaper: data.activePaper || state.activePaper,
        theme: data.theme || state.theme,
        wallpaper: data.wallpaper || state.wallpaper,
        userName: data.userName || state.userName,
        sidebarCollapsed: data.sidebarCollapsed !== undefined ? data.sidebarCollapsed : state.sidebarCollapsed,
      };
      saveSettings(newState);
      return newState;
    });
    return true;
  },
}));

