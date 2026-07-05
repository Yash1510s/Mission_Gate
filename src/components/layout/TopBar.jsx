import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { WALLPAPER_PRESETS } from '../../data/wallpapers';

const pageTitles = {
  '/': 'Dashboard',
  '/syllabus': 'Syllabus Tracker',
  '/pyqs': 'PYQ Hub',
  '/resources': 'Free Resources',
  '/planner': 'Study Planner',
  '/formulas': 'Formula Sheets',
  '/jobs': 'Job Opportunities',
  '/updates': 'GATE Updates & Schedule',
  '/news': 'GATE News & World Feed',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

// Built-in search index for lightning fast global search
const searchIndex = [
  // Pages
  { title: 'Dashboard & Overview', category: 'Page', url: '/', icon: '📊', desc: 'Main progress summary and stats' },
  { title: 'Syllabus Tracker (CS & DA)', category: 'Page', url: '/syllabus', icon: '📋', desc: 'Subject-wise topic checklists with badges' },
  { title: 'PYQ Hub (Previous Year Questions)', category: 'Page', url: '/pyqs', icon: '📝', desc: 'Solved GATE exam papers from 2015 to 2024' },
  { title: 'Free Study Resources & Playlists', category: 'Page', url: '/resources', icon: '📚', desc: 'GATE Wallah, Abdul Bari, Neso Academy, etc.' },
  { title: 'Study Planner & Timetable Generator', category: 'Page', url: '/planner', icon: '📅', desc: 'Daily study schedules and reminders' },
  { title: 'Formula Sheets & Quick Revision', category: 'Page', url: '/formulas', icon: '⚡', desc: 'Cheat sheets for Math, DSA, OS, DBMS' },
  { title: 'Job Opportunities & PSU Recruitment', category: 'Page', url: '/jobs', icon: '💼', desc: 'GATE score based job openings & internships' },
  { title: 'GATE Updates & Exam Schedule', category: 'Page', url: '/updates', icon: '📢', desc: 'Official notifications, dates, syllabus changes' },
  { title: 'GATE News & Tech World Feed', category: 'Page', url: '/news', icon: '📰', desc: 'Latest articles, AI breakthroughs, exam tips' },
  
  // CS Subjects
  { title: 'Engineering Mathematics (CS/DA)', category: 'Subject', url: '/syllabus', icon: '📐', desc: 'Linear Algebra, Calculus, Probability' },
  { title: 'Discrete Mathematics', category: 'Subject', url: '/syllabus', icon: '🧮', desc: 'Logic, Sets, Graph Theory, Combinatorics' },
  { title: 'Digital Logic', category: 'Subject', url: '/syllabus', icon: '🔌', desc: 'Boolean Algebra, K-Maps, Flip-Flops' },
  { title: 'Computer Organization & Architecture (COA)', category: 'Subject', url: '/syllabus', icon: '🖥️', desc: 'Pipelining, Cache, Addressing Modes' },
  { title: 'C Programming', category: 'Subject', url: '/syllabus', icon: '💻', desc: 'Pointers, Arrays, Recursion, Memory' },
  { title: 'Data Structures (DSA)', category: 'Subject', url: '/syllabus', icon: '🌳', desc: 'Trees, Graphs, Stacks, Queues, BST, Heaps' },
  { title: 'Algorithms', category: 'Subject', url: '/syllabus', icon: '⚡', desc: 'Sorting, Greedy, Dynamic Programming, Graph' },
  { title: 'Theory of Computation (TOC)', category: 'Subject', url: '/syllabus', icon: '🤖', desc: 'DFA, NFA, CFG, Turing Machines' },
  { title: 'Compiler Design', category: 'Subject', url: '/syllabus', icon: '⚙️', desc: 'Lexical Analysis, Parsing, Syntax Translation' },
  { title: 'Operating Systems (OS)', category: 'Subject', url: '/syllabus', icon: '💽', desc: 'CPU Scheduling, Deadlock, Virtual Memory' },
  { title: 'Database Management Systems (DBMS)', category: 'Subject', url: '/syllabus', icon: '🗄️', desc: 'SQL, Normalization, Transactions, B-Trees' },
  { title: 'Computer Networks (CN)', category: 'Subject', url: '/syllabus', icon: '🌐', desc: 'OSI, TCP/IP, Routing, Subnetting, HTTP' },
  
  // DA Subjects
  { title: 'Probability & Statistics (DA)', category: 'Subject', url: '/syllabus', icon: '📊', desc: 'Bayes Theorem, Random Variables, Distributions' },
  { title: 'Linear Algebra (DA)', category: 'Subject', url: '/syllabus', icon: '🔢', desc: 'Matrices, Eigenvalues, SVD, PCA' },
  { title: 'Machine Learning (ML)', category: 'Subject', url: '/syllabus', icon: '🧠', desc: 'Regression, Classification, SVM, Clustering' },
  { title: 'Artificial Intelligence (AI)', category: 'Subject', url: '/syllabus', icon: '🤖', desc: 'A* Search, Minimax, Logic, Reinforcement Learning' },
  { title: 'Python & C Programming (DA)', category: 'Subject', url: '/syllabus', icon: '🐍', desc: 'Python basics, Data structures, File handling' },
  
  // Top Resources
  { title: 'GATE Wallah Crash Course 2026/2025', category: 'Resource', url: '/resources', icon: '🎬', desc: 'Complete playlists for all CS and DA subjects' },
  { title: 'Abdul Bari Algorithms & DSA', category: 'Resource', url: '/resources', icon: '🎬', desc: 'Deep dive tutorials on trees, graphs, sorting' },
  { title: 'Gate Smashers Playlists', category: 'Resource', url: '/resources', icon: '🎬', desc: 'OS, DBMS, TOC, Discrete Math video lectures' },
  { title: 'Neso Academy Digital Logic & TOC', category: 'Resource', url: '/resources', icon: '🎬', desc: 'Standard GATE exam reference playlists' },
  { title: 'GeeksforGeeks (GFG) GATE Notes', category: 'Resource', url: '/resources', icon: '📄', desc: 'Comprehensive written revision notes' },
];

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || 'GATE Prep Companion';

  const currentWallpaper = useSettingsStore(s => s.wallpaper) || 'sonoma';
  const setWallpaper = useSettingsStore(s => s.setWallpaper);
  const toggleMobileMenu = useSettingsStore(s => s.toggleMobileMenu);
  const toggleSidebar = useSettingsStore(s => s.toggleSidebar);
  const sidebarCollapsed = useSettingsStore(s => s.sidebarCollapsed);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const wallpaperRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'GATE 2026 Organizing Committee', desc: 'Official notifications & syllabus updates expected soon. Start early!', time: '2h ago', read: false, type: 'info' },
    { id: 2, title: 'Daily Study Reminder', desc: 'Time to practice 5 questions of Engineering Mathematics!', time: '4h ago', read: false, type: 'reminder' },
    { id: 3, title: 'New Subject Cards Live', desc: 'Subject-wise separated cards with 2-letter badges added to Syllabus & Resources.', time: '1d ago', read: true, type: 'success' },
    { id: 4, title: 'PYQ Hub Explanations', desc: 'GATE 2024 & 2023 solved papers with detailed solutions are ready.', time: '2d ago', read: true, type: 'update' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Filter search results
  const filteredResults = searchQuery.trim() === ''
    ? searchIndex.slice(0, 6) // show suggestions by default
    : searchIndex.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Close modals on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchModal(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (wallpaperRef.current && !wallpaperRef.current.contains(e.target)) {
        setShowWallpaperModal(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowSearchModal(false);
        setShowNotifications(false);
        setShowWallpaperModal(false);
      }
      // Ctrl+K or Cmd+K shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectResult = (url) => {
    setShowSearchModal(false);
    setSearchQuery('');
    navigate(url);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <header className="topbar">
      {/* ─── Mobile Hamburger (hidden on desktop via CSS) ─── */}
      <button
        className="topbar__hamburger"
        onClick={toggleMobileMenu}
        title="Open Menu"
        aria-label="Open Navigation"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* ─── Desktop: ✕ close when expanded, 🚀 rocket when collapsed ─── */}
      {!sidebarCollapsed ? (
        /* Sidebar is OPEN → show ✕ next to page title */
        <button
          className="topbar__sidebar-close"
          onClick={toggleSidebar}
          title="Collapse Sidebar"
          aria-label="Collapse Sidebar"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      ) : (
        /* Sidebar is COLLAPSED → show 🚀 to re-open */
        <button
          className="topbar__sidebar-rocket"
          onClick={toggleSidebar}
          title="Expand Sidebar"
          aria-label="Expand Sidebar"
        >
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 50%, #f472b6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            boxShadow: '0 4px 16px rgba(192, 132, 252, 0.4)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}>
            🚀
          </div>
        </button>
      )}

      <h2 className="topbar__page-title">{title}</h2>
      <div className="topbar__spacer" />

      {/* Global Search Box */}
      <div className="topbar__search" ref={searchRef} style={{ position: 'relative' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', width: '100%', cursor: 'pointer' }}
          onClick={() => setShowSearchModal(true)}
        >
          <svg className="topbar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search topics, resources... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchModal(true);
            }}
            onFocus={() => setShowSearchModal(true)}
          />
        </div>

        {/* Quick Search Dropdown Modal */}
        {showSearchModal && (
          <div
            className="topbar__dropdown-panel"
            style={{
              position: 'absolute',
              top: '120%',
              left: 0,
              right: 0,
              minWidth: 360,
              background: 'rgba(13, 14, 28, 0.95)',
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 16,
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)',
              padding: 12,
              zIndex: 1000,
              maxHeight: 420,
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px 10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
                {searchQuery ? `Results (${filteredResults.length})` : 'Quick Navigation'}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>ESC to close</span>
            </div>

            {filteredResults.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                No topics or resources found for "{searchQuery}"
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {filteredResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectResult(item.url)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                      background: 'rgba(255, 255, 255, 0.03)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(91, 140, 255, 0.12)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                  >
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.desc}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: item.category === 'Subject' ? 'rgba(91, 140, 255, 0.15)' : item.category === 'Resource' ? 'rgba(224, 95, 208, 0.15)' : 'rgba(74, 222, 128, 0.15)',
                        color: item.category === 'Subject' ? '#82a8ff' : item.category === 'Resource' ? '#f082e6' : '#4ade80',
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wallpaper Studio Selector Button & Dropdown */}
      <div className="topbar__actions" ref={wallpaperRef} style={{ position: 'relative', flexShrink: 0, marginLeft: 8 }}>
        <button
          title="Change Wallpaper & Theme"
          onClick={() => setShowWallpaperModal(prev => !prev)}
          className="topbar__wallpaper-btn"
          style={{
            height: '38px',
            width: 'auto',
            background: showWallpaperModal ? 'rgba(96, 165, 250, 0.2)' : 'rgba(255, 255, 255, 0.06)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '0 16px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-primary)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          <span style={{ fontSize: 16 }}>🎨</span>
          <span className="topbar__wallpaper-text" style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", letterSpacing: 0.3 }}>Wallpaper</span>
        </button>

        {/* Wallpaper Picker Modal */}
        {showWallpaperModal && (
          <div
            className="topbar__dropdown-panel"
            style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: 'min(360px, calc(100vw - 32px))',
              background: 'rgba(13, 14, 28, 0.96)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 16,
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.7)',
              padding: 16,
              zIndex: 1000,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: 12 }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 15, fontFamily: "'Inter', sans-serif" }}>🎨 Wallpaper Studio</h4>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Choose an aesthetic background</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>Live 4K</span>
                <button onClick={() => setShowWallpaperModal(false)} style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#fff', borderRadius: 6, width: 24, height: 24, cursor: 'pointer', fontSize: 12 }}>✕</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, maxHeight: 460, overflowY: 'auto', paddingRight: 4 }}>
              {WALLPAPER_PRESETS.map(preset => {
                const isSelected = currentWallpaper === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setWallpaper(preset.id);
                      setShowWallpaperModal(false);
                    }}
                    style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      border: isSelected ? `2px solid ${preset.accent}` : '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      boxShadow: isSelected ? `0 0 15px ${preset.accent}40` : 'none',
                    }}
                  >
                    <div
                      style={{
                        height: 70,
                        width: '100%',
                        background: preset.url ? `url(${preset.url}) center/cover no-repeat` : '#080a14',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div style={{ position: 'absolute', inset: 0, background: preset.overlay }} />
                      {!preset.url && <span style={{ position: 'relative', fontSize: 12, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>Dot Grid</span>}
                      {isSelected && (
                        <span style={{ position: 'relative', background: preset.accent, color: '#000', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>
                          ACTIVE ✓
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '8px 10px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{preset.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.3 }}>{preset.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Notifications Button & Dropdown */}
      <div className="topbar__actions" ref={notifRef} style={{ position: 'relative', flexShrink: 0, marginLeft: 4 }}>
        <button
          className="topbar__icon-btn"
          title="Notifications"
          onClick={() => setShowNotifications(prev => !prev)}
          style={showNotifications ? { background: 'rgba(255, 255, 255, 0.1)' } : {}}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && <span className="badge-dot" style={{ background: '#f87171' }} />}
        </button>

        {/* Notifications Panel */}
        {showNotifications && (
          <div
            className="topbar__dropdown-panel"
            style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: 340,
              background: 'rgba(13, 14, 28, 0.96)',
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 16,
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)',
              padding: 14,
              zIndex: 1000,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h4 style={{ margin: 0, fontSize: 15, fontFamily: "'Inter', sans-serif" }}>Notifications</h4>
                {unreadCount > 0 && (
                  <span style={{ fontSize: 11, background: 'rgba(248, 113, 113, 0.2)', color: '#f87171', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ fontSize: 11, color: 'var(--accent-cs)', cursor: 'pointer', fontWeight: 600 }}>
                    Mark read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={clearNotifications} style={{ fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>
                    Clear
                  </button>
                )}
              </div>
            </div>

            {notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                🎉 All caught up! No notifications.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: n.read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(91, 140, 255, 0.08)',
                      borderLeft: n.read ? '3px solid transparent' : '3px solid var(--accent-cs)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                        {n.title}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                        {n.time}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
