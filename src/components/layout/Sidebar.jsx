import { NavLink } from 'react-router-dom';
import { useSettingsStore } from '../../stores/useSettingsStore';

const navItems = [
  { label: 'STUDY', items: [
    { to: '/', icon: '🏠', label: 'Dashboard' },
    { to: '/syllabus', icon: '📚', label: 'Syllabus Tracker' },
    { to: '/pyqs', icon: '📝', label: 'PYQ Hub' },
    { to: '/resources', icon: '📖', label: 'Resources' },
  ]},
  { label: 'PLAN', items: [
    { to: '/planner', icon: '📅', label: 'Study Planner' },
    { to: '/formulas', icon: '📋', label: 'Formula Sheets' },
  ]},
  { label: 'PRACTICE', items: [
    { to: '/mocks', icon: '🎯', label: 'Mock Simulator' },
    { to: '/calculator', icon: '🖩', label: 'Virtual GATE Calc' },
  ]},
  { label: 'EXPLORE', items: [
    { to: '/jobs', icon: '💼', label: 'Job Opportunities' },
    { to: '/updates', icon: '📢', label: 'GATE Updates' },
    { to: '/news', icon: '📰', label: 'GATE News & Feed' },
  ]},
  { label: 'MORE', items: [
    { to: '/analytics', icon: '📊', label: 'Analytics' },
    { to: '/settings', icon: '⚙️', label: 'Settings' },
  ]},
];

export default function Sidebar() {
  const daysUntilExam = useSettingsStore(s => s.getDaysUntilExam)();
  const mobileMenuOpen = useSettingsStore(s => s.mobileMenuOpen);
  const setMobileMenuOpen = useSettingsStore(s => s.setMobileMenuOpen);
  const sidebarCollapsed = useSettingsStore(s => s.sidebarCollapsed);
  const toggleSidebar = useSettingsStore(s => s.toggleSidebar);

  // Rocket shows in sidebar when: desktop-expanded OR mobile-open
  const showRocket = !sidebarCollapsed || mobileMenuOpen;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 998
          }}
        />
      )}

      <aside
        className={`sidebar ${mobileMenuOpen ? 'open' : ''} ${sidebarCollapsed ? 'sidebar--collapsed' : ''}`}
        style={mobileMenuOpen ? { zIndex: 999 } : {}}
      >
        {/* ── Sidebar Header (Logo + Toggle) ── */}
        <div className="sidebar__logo">

          {/* 🚀 Rocket — visible when expanded (desktop) or mobile open */}
          {showRocket && (
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 50%, #f472b6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              boxShadow: '0 8px 24px rgba(192, 132, 252, 0.4)',
              color: '#fff',
              flexShrink: 0,
            }}>
              🚀
            </div>
          )}

          {/* Text — hidden via CSS when collapsed */}
          <div className="sidebar__logo-text">
            <div style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: -0.3,
              background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              GATE Companion
            </div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: '#c084fc',
              textTransform: 'uppercase',
              marginTop: 2,
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              AI Study Partner
            </div>
          </div>

          {/* ≡ Hamburger Toggle — ONLY when sidebar is collapsed (to re-expand it) */}
          {sidebarCollapsed && (
            <button
              className="sidebar__desktop-toggle"
              onClick={toggleSidebar}
              title="Expand Sidebar"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}

          {/* ✕ Close Button — mobile only, when drawer is open */}
          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="sidebar__mobile-close"
              aria-label="Close Menu"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="sidebar__nav">
          {navItems.map((section) => (
            <div key={section.label}>
              <div className="sidebar__section-label">{section.label}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                  end={item.to === '/'}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <span className="sidebar__link-icon">{item.icon}</span>
                  <span className="sidebar__link-text">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* ── Footer Countdown ── */}
        <div className="sidebar__footer">
          <div className="sidebar__exam-countdown">
            <div className="sidebar__exam-countdown-label">Target Exam in</div>
            <div className="sidebar__exam-countdown-days">{daysUntilExam}</div>
            <div className="sidebar__exam-countdown-unit">days remaining</div>
          </div>
        </div>
      </aside>
    </>
  );
}
