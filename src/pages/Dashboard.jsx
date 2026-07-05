import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProgressStore } from '../stores/useProgressStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import ProgressRing from '../components/ui/ProgressRing';
import { CONCEPTS_LIBRARY } from '../data/concepts';

const quotes = [
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Your limitation — it's only your imagination.", author: "Unknown" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
];


const quickActions = [
  { to: '/syllabus', icon: '📚', bg: 'var(--accent-cs-soft)', label: 'Continue Studying', sub: 'Pick up where you left off' },
  { to: '/pyqs', icon: '📝', bg: 'var(--accent-da-soft)', label: 'Solve PYQs', sub: 'Practice with past papers' },
  { to: '/resources', icon: '📖', bg: 'var(--success-soft)', label: 'Watch Lectures', sub: 'Free video resources' },
  { to: '/jobs', icon: '💼', bg: 'var(--warning-soft)', label: 'Job Opportunities', sub: 'PSU, Govt & M.Tech' },
  { to: '/formulas', icon: '📋', bg: 'var(--info-soft)', label: 'Formula Sheets', sub: 'Quick revision notes' },
  { to: '/news', icon: '📰', bg: 'var(--danger-soft)', label: 'GATE News', sub: 'Latest updates' },
];

export default function Dashboard() {
  const [syllabus, setSyllabus] = useState(null);
  const getPaperCounts = useProgressStore(s => s.getPaperCounts);
  const getRecentActivity = useProgressStore(s => s.getRecentActivity);
  const getStreak = useProgressStore(s => s.getStreak);
  const daysLeft = useSettingsStore(s => s.getDaysUntilExam)();
  const userName = useSettingsStore(s => s.userName) || 'GATE Aspirant';
  const examDateStr = useSettingsStore(s => s.examDate) || '2027-02-01';

  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  const [conceptIdx, setConceptIdx] = useState(() => Math.floor(Math.random() * CONCEPTS_LIBRARY.length));

  // Live Clock & Precision Countdown State
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/data/syllabus.json')
      .then(r => r.json())
      .then(setSyllabus)
      .catch(console.error);
  }, []);

  if (!syllabus) return <div className="empty-state"><div className="animate-pulse">Loading...</div></div>;

  const csCounts = getPaperCounts(syllabus, 'cs');
  const daCounts = getPaperCounts(syllabus, 'da');
  const totalDone = csCounts.done + daCounts.done;
  const totalTopics = csCounts.total + daCounts.total;
  const overallPct = totalTopics ? Math.round((totalDone / totalTopics) * 100) : 0;
  const csPct = csCounts.total ? Math.round((csCounts.done / csCounts.total) * 100) : 0;
  const daPct = daCounts.total ? Math.round((daCounts.done / daCounts.total) * 100) : 0;
  const streak = getStreak();
  const recentActivity = getRecentActivity(syllabus, 5);

  // Precision Countdown calculations
  const examDateObj = new Date(examDateStr + 'T09:00:00');
  const diffMs = Math.max(0, examDateObj - now);
  const cDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const cHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const cMinutes = Math.floor((diffMs / 1000 / 60) % 60);
  const cSeconds = Math.floor((diffMs / 1000) % 60);

  // Time formatting
  const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateString = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const hours24 = now.getHours();
  const greeting = hours24 < 12 ? `Good Morning, ${userName}! 🌅` : hours24 < 18 ? `Good Afternoon, ${userName}! ☀️` : `Good Evening, ${userName}! 🌙`;

  const currentConcept = CONCEPTS_LIBRARY[conceptIdx];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <p className="page-header__eyebrow">GATE Prep Companion • Command Center</p>
        <h1 className="page-header__title">Dashboard</h1>
        <p className="page-header__subtitle">
          Track your progress, monitor exam timeline, and master high-yield concepts daily.
        </p>
      </div>

      {/* Hero Command Grid: Precision Countdown & Live Clock + Formula Widget */}
      <div className="hero-command-grid">
        
        {/* Left Widget: GATE Precision Countdown Timer */}
        <div className="card card--glow-cs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 22px', background: 'rgba(18, 24, 40, 0.75)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-cs)', textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>⏳</span> MISSION COUNTDOWN
              </span>
              <span className="tag tag--cs" style={{ fontSize: 11 }}>TARGET GATE</span>
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 4, color: 'var(--text-primary)' }}>Target: Top 100 AIR 🎯</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
              Target Exam Date: {examDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Precision Ticking Box Timer */}
          <div className="countdown-grid">
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 4px', borderRadius: 10, border: '1px solid rgba(96, 165, 250, 0.2)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: '#60a5fa' }}>{cDays}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>Days</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 4px', borderRadius: 10, border: '1px solid rgba(96, 165, 250, 0.2)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: '#60a5fa' }}>{String(cHours).padStart(2, '0')}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>Hours</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 4px', borderRadius: 10, border: '1px solid rgba(96, 165, 250, 0.2)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: '#60a5fa' }}>{String(cMinutes).padStart(2, '0')}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>Mins</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 4px', borderRadius: 10, border: '1px solid rgba(192, 132, 252, 0.3)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: '#c084fc' }}>{String(cSeconds).padStart(2, '0')}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>Secs</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
            <span>⚡ Every second counts. Keep studying!</span>
            <Link to="/planner" style={{ color: 'var(--accent-cs)', fontWeight: 600, textDecoration: 'none' }}>Open Planner →</Link>
          </div>
        </div>

        {/* Right Widget Column: Live Clock + Formula of the Day */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Top Half: Live Clock & Date Banner */}
          <div className="card" style={{ padding: '16px 20px', background: 'rgba(18, 24, 40, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{greeting}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📅 {dateString}</div>
            </div>
            <div style={{ textAlign: 'right', background: 'rgba(255, 255, 255, 0.04)', padding: '8px 14px', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent-da)', letterSpacing: 1 }}>
                {timeString}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>IST / Indian Standard Time</div>
            </div>
          </div>

          {/* Bottom Half: Concept of the Day (Formulas, Theories, Rules, Theorems) */}
          <div className="card card--glow-da" style={{ padding: '16px 20px', background: 'rgba(18, 24, 40, 0.75)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>💡</span> CONCEPT OF THE DAY
                </span>
                <button
                  onClick={() => {
                    setConceptIdx((prev) => {
                      let nextIdx;
                      do {
                        nextIdx = Math.floor(Math.random() * CONCEPTS_LIBRARY.length);
                      } while (nextIdx === prev && CONCEPTS_LIBRARY.length > 1);
                      return nextIdx;
                    });
                  }}
                  style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.3)', padding: '5px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(192, 132, 252, 0.25)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(192, 132, 252, 0.15)'}
                >
                  ⚡ Next Concept
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentConcept.title}
                </span>
                <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 6, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {currentConcept.paper}
                </span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: 6,
                  letterSpacing: 0.5,
                  background: currentConcept.type === 'Formula' ? 'rgba(74, 222, 128, 0.15)' : currentConcept.type === 'Theory' ? 'rgba(96, 165, 250, 0.15)' : currentConcept.type === 'Rule' ? 'rgba(192, 132, 252, 0.15)' : currentConcept.type === 'Algorithm' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(244, 114, 182, 0.15)',
                  color: currentConcept.type === 'Formula' ? '#4ade80' : currentConcept.type === 'Theory' ? '#60a5fa' : currentConcept.type === 'Rule' ? '#c084fc' : currentConcept.type === 'Algorithm' ? '#fbbf24' : '#f472b6',
                  border: `1px solid ${currentConcept.type === 'Formula' ? 'rgba(74, 222, 128, 0.3)' : currentConcept.type === 'Theory' ? 'rgba(96, 165, 250, 0.3)' : currentConcept.type === 'Rule' ? 'rgba(192, 132, 252, 0.3)' : currentConcept.type === 'Algorithm' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(244, 114, 182, 0.3)'}`
                }}>
                  {currentConcept.type}
                </span>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                padding: '10px 14px',
                borderRadius: 10,
                fontFamily: currentConcept.type === 'Formula' ? "'JetBrains Mono', monospace" : "'Inter', 'Plus Jakarta Sans', sans-serif",
                fontSize: 13,
                fontWeight: currentConcept.type === 'Formula' ? 600 : 600,
                color: currentConcept.type === 'Formula' ? '#4ade80' : currentConcept.type === 'Theory' ? '#82a8ff' : currentConcept.type === 'Rule' ? '#d8b4fe' : currentConcept.type === 'Algorithm' ? '#fde047' : '#f472b6',
                marginBottom: 8,
                borderLeft: `3px solid ${currentConcept.type === 'Formula' ? '#4ade80' : currentConcept.type === 'Theory' ? '#60a5fa' : currentConcept.type === 'Rule' ? '#c084fc' : currentConcept.type === 'Algorithm' ? '#fbbf24' : '#f472b6'}`,
                lineHeight: 1.45,
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {currentConcept.content}
              </div>

              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--text-secondary)' }}>📌 GATE Note / Tip: </strong>{currentConcept.desc}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        {/* Overall Progress */}
        <div className="card card--glow-cs">
          <div className="stat-card">
            <ProgressRing size={70} percentage={overallPct} color="url(#gradient-ring)" />
            <div className="stat-card__content">
              <div className="stat-card__label">Overall Progress</div>
              <div className="stat-card__value">{overallPct}%</div>
              <div className="stat-card__sub">{totalDone} / {totalTopics} topics</div>
            </div>
          </div>
        </div>

        {/* Study Streak */}
        <div className="card">
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--warning">
              <span className="streak-fire">🔥</span>
            </div>
            <div className="stat-card__content">
              <div className="stat-card__label">Study Streak</div>
              <div className="stat-card__value">{streak}</div>
              <div className="stat-card__sub">{streak === 0 ? 'Start today!' : streak === 1 ? 'day — keep going!' : 'days — on fire!'}</div>
            </div>
          </div>
        </div>

        {/* Topics Today */}
        <div className="card">
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--success">✅</div>
            <div className="stat-card__content">
              <div className="stat-card__label">Topics Completed</div>
              <div className="stat-card__value">{totalDone}</div>
              <div className="stat-card__sub">{totalTopics - totalDone} remaining</div>
            </div>
          </div>
        </div>

        {/* Daily Motivation Quote */}
        <div className="card">
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--info">💡</div>
            <div className="stat-card__content">
              <div className="stat-card__label">Daily Motivation</div>
              <div className="stat-card__value" style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, color: 'var(--text-primary)' }}>
                "{quote.text.slice(0, 48)}..."
              </div>
              <div className="stat-card__sub">— {quote.author}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Paper Progress Cards */}
      <div className="dashboard-grid--wide">
        {/* CS Progress */}
        <div className="card card--glow-cs">
          <div className="card__body" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ProgressRing size={90} percentage={csPct} color="var(--accent-cs)">
              {csPct}%
            </ProgressRing>
            <div>
              <h3 style={{ marginBottom: 4, fontSize: 20 }}>GATE CS</h3>
              <span className="tag tag--cs">CS & IT</span>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>
                {csCounts.done} / {csCounts.total} topics
              </p>
              <div style={{ width: '100%', height: 6, borderRadius: 4, background: 'var(--glass-border)', marginTop: 8, overflow: 'hidden' }}>
                <div style={{ width: `${csPct}%`, height: '100%', borderRadius: 4, background: 'var(--accent-cs)', transition: 'width 0.6s var(--ease-out)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* DA Progress */}
        <div className="card card--glow-da">
          <div className="card__body" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ProgressRing size={90} percentage={daPct} color="var(--accent-da)">
              {daPct}%
            </ProgressRing>
            <div>
              <h3 style={{ marginBottom: 4, fontSize: 20 }}>GATE DA</h3>
              <span className="tag tag--da">Data Science & AI</span>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>
                {daCounts.done} / {daCounts.total} topics
              </p>
              <div style={{ width: '100%', height: 6, borderRadius: 4, background: 'var(--glass-border)', marginTop: 8, overflow: 'hidden' }}>
                <div style={{ width: `${daPct}%`, height: '100%', borderRadius: 4, background: 'var(--accent-da)', transition: 'width 0.6s var(--ease-out)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 style={{ marginBottom: 16 }}>Quick Actions</h3>
      <div className="quick-actions" style={{ marginBottom: 28 }}>
        {quickActions.map(action => (
          <Link key={action.to} to={action.to} className="quick-action">
            <div className="quick-action__icon" style={{ background: action.bg }}>
              {action.icon}
            </div>
            <div>
              <div className="quick-action__text">{action.label}</div>
              <div className="quick-action__sub">{action.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <h3 style={{ marginBottom: 16 }}>Recent Activity</h3>
      <div className="card">
        <div className="card__body">
          {recentActivity.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <div className="empty-state__icon">📖</div>
              <div className="empty-state__title">No activity yet</div>
              <div className="empty-state__desc">Start checking off topics to see your progress here!</div>
            </div>
          ) : (
            recentActivity.map((item, i) => (
              <div key={item.id} className="activity-item">
                <div
                  className="activity-item__dot"
                  style={{ background: item.paperId === 'cs' ? 'var(--accent-cs)' : 'var(--accent-da)' }}
                />
                <div className="activity-item__content">
                  <div className="activity-item__text">
                    Completed <strong>{item.topic}</strong>
                    <span style={{ opacity: 0.6 }}> in {item.section}</span>
                  </div>
                  <div className="activity-item__time">
                    {formatTimeAgo(item.timestamp)}
                  </div>
                </div>
                <span className={`tag tag--${item.paperId === 'cs' ? 'cs' : 'da'}`}>
                  {item.paperId.toUpperCase()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hidden SVG Gradient for ProgressRing */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5b8cff" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#e05fd0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
