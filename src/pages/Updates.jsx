import { useState, useEffect } from 'react';

const typeStyles = {
  breaking: { bg: 'var(--danger-soft)', color: 'var(--danger)', label: 'BREAKING' },
  important: { bg: 'var(--warning-soft)', color: 'var(--warning)', label: 'IMPORTANT' },
  result: { bg: 'var(--success-soft)', color: 'var(--success)', label: 'RESULT' },
  exam: { bg: 'var(--info-soft)', color: 'var(--info)', label: 'EXAM' },
  general: { bg: 'var(--glass)', color: 'var(--text-secondary)', label: 'UPDATE' },
};

// Format the actual date from JSON data
function formatUpdateDate(dateString) {
  const d = new Date(dateString + 'T12:00:00');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayStr = days[d.getDay()];
  const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const agoStr = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Yesterday' : `${diffDays}d ago`;
  
  return { dayStr, dateStr, agoStr };
}

// Check if date string is within the selected time range
function isWithinTimeRange(dateStr, range) {
  if (range === 'All Time' || !dateStr) return true;
  
  const itemDate = new Date(dateStr + 'T12:00:00');
  const now = new Date();
  const diffMs = now - itemDate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (range === 'Last 24h 🔥') {
    return diffDays <= 1.5 && diffDays >= -1;
  }
  if (range === 'Last 7 Days 📅') {
    return diffDays <= 7.5 && diffDays >= -1;
  }
  if (range === 'Last 30 Days 🗓️') {
    return diffDays <= 30.5 && diffDays >= -1;
  }
  return true;
}

export default function Updates() {
  const [newsData, setNewsData] = useState(null);
  const [activeTimeRange, setActiveTimeRange] = useState('All Time');

  useEffect(() => {
    fetch('/data/news.json')
      .then(r => r.json())
      .then(setNewsData)
      .catch(console.error);
  }, []);

  if (!newsData) return <div className="empty-state"><div className="animate-pulse">Loading updates...</div></div>;

  const { updates, importantDates, examPattern } = newsData;
  const filteredUpdates = updates.filter(u => isWithinTimeRange(u.date, activeTimeRange));

  return (
    <div>
      <div className="page-header">
        <p className="page-header__eyebrow">Official Notifications & Dates</p>
        <h1 className="page-header__title">GATE Updates & Schedule</h1>
        <p className="page-header__subtitle">
          Official exam schedule, important dates, exam pattern, question types, and organizing IIT notifications for GATE.
        </p>
      </div>

      {/* Data Source Status Banner */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <div className="card__body" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 10px #10b981' }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                Official GATE Bulletin & Schedule
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Sourced from GATE Organizing Committee & IIT official portals
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            🛡️ Verified against official GATE committee bulletins
          </div>
        </div>
      </div>

      {/* Time Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>📢 Official Bulletins & Notifications</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', background: 'rgba(255, 255, 255, 0.02)', padding: '6px 12px', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>⏳</span> Time:
          </span>
          {['All Time', 'Last 24h 🔥', 'Last 7 Days 📅', 'Last 30 Days 🗓️'].map(range => (
            <button
              key={range}
              onClick={() => setActiveTimeRange(range)}
              style={{
                background: activeTimeRange === range ? 'var(--accent-cs)' : 'rgba(255, 255, 255, 0.05)',
                color: activeTimeRange === range ? '#ffffff' : 'var(--text-secondary)',
                border: activeTimeRange === range ? '1px solid var(--accent-cs)' : '1px solid rgba(255, 255, 255, 0.08)',
                padding: '5px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: activeTimeRange === range ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Official Bulletin Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {filteredUpdates.length === 0 ? (
          <div className="empty-state" style={{ marginBottom: 16 }}>
            <div className="empty-state__icon">📢</div>
            <div className="empty-state__title">No updates found</div>
            <div className="empty-state__desc">
              No official bulletins match your filter in "{activeTimeRange}". Try switching to 'All Time'.
            </div>
            <button
              onClick={() => setActiveTimeRange('All Time')}
              className="btn btn--primary"
              style={{ marginTop: 16, padding: '8px 16px', fontSize: 13 }}
            >
              Reset Time Filter
            </button>
          </div>
        ) : (
          filteredUpdates.map((update, i) => {
          const style = typeStyles[update.type] || typeStyles.general;
          const { dayStr, dateStr, agoStr } = formatUpdateDate(update.date);

          return (
            <div key={i} className="card" style={{ overflow: 'hidden' }}>
              {/* ACTUAL DATE HEADER */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 16px', background: 'rgba(255, 255, 255, 0.04)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--accent-cs)' }}>📅</span> {dayStr}, {dateStr}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--success)' }}>🕒</span> {agoStr} • <span style={{ color: '#4ade80' }}>● Official IIT Notice</span>
                </span>
              </div>

              <div className="card__body" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span className="tag" style={{ background: style.bg, color: style.color, fontWeight: 700 }}>{style.label}</span>
                  <h4 style={{ margin: 0, fontSize: 16, color: 'var(--text-primary)' }}>{update.title}</h4>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {update.description}
                </p>
                {update.link && (
                  <a href={update.link} target="_blank" rel="noopener noreferrer"
                     style={{ fontSize: 13, color: 'var(--accent-cs)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12, fontWeight: 600 }}>
                    Visit Official Portal ↗
                  </a>
                )}
              </div>
            </div>
          );
        })
        )}
      </div>

      {/* Important Dates Timeline Card */}
      <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>📅 Important Dates — GATE Exam Schedule</h3>
      <div className="card" style={{ marginBottom: 28 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 16px', background: 'rgba(255, 255, 255, 0.04)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--accent-cs)' }}>📅</span> GATE 2027 Timeline
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#4ade80' }}>● Master Schedule</span>
          </span>
        </div>
        <div className="card__body">
          {Object.entries(importantDates).map(([key, date]) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
            const dateObj = new Date(date);
            const isPast = dateObj < new Date();
            const formatted = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

            return (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0',
                borderBottom: '1px solid var(--glass-border)',
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: isPast ? 'var(--success)' : 'var(--accent-cs)',
                  boxShadow: isPast ? '0 0 8px var(--success)' : '0 0 8px var(--accent-cs)',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                  color: isPast ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: isPast ? 'line-through' : 'none',
                }}>
                  {formatted}
                </div>
                {isPast && <span className="tag tag--success">Done</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam Pattern & Section Breakdown */}
      <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>📋 Official Exam Pattern & Rules</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div className="card">
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 16px', background: 'rgba(255, 255, 255, 0.04)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)'
          }}>
            <span>📅 Official GATE Exam Pattern</span>
            <span style={{ color: '#4ade80' }}>● Exam Pattern</span>
          </div>
          <div className="card__header"><h4>Section Breakdown</h4></div>
          <div className="card__body">
            {examPattern.sections.map((sec, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
                <span style={{ fontWeight: 500 }}>{sec.name}</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>{sec.marks} marks</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 8 }}>({sec.questions} questions)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ borderColor: 'rgba(248,113,113,0.2)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 16px', background: 'rgba(255, 255, 255, 0.04)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)'
          }}>
            <span>📅 Official Marking Scheme</span>
            <span style={{ color: '#f87171' }}>● Marking Rules</span>
          </div>
          <div className="card__header"><h4>⚠️ Question Types & Negative Marking</h4></div>
          <div className="card__body">
            <div style={{ marginBottom: 12 }}>
              {examPattern.questionTypes.map((qt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0', fontSize: 13, fontWeight: 600 }}>
                  <span>{'📌📍🎯'[i]}</span>
                  <span>{qt}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, padding: '10px', background: 'rgba(248, 113, 113, 0.08)', borderRadius: 8 }}>
              {examPattern.negativeMaking}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
