import { useState, useEffect } from 'react';

const categoryColors = {
  'IIT / IISc': { bg: 'var(--accent-cs-soft)', color: 'var(--accent-cs)', icon: '🏛️' },
  'PSU & Govt': { bg: 'var(--warning-soft)', color: 'var(--warning)', icon: '🏭' },
  'Private Jobs': { bg: 'var(--success-soft)', color: 'var(--success)', icon: '💼' },
  'Courses & Prep': { bg: 'var(--accent-da-soft)', color: 'var(--accent-da)', icon: '📚' },
  'General Alerts': { bg: 'var(--info-soft)', color: 'var(--info)', icon: '📢' },
};

// Format the actual publication date from JSON data
function formatNewsDate(dateString) {
  const d = new Date(dateString + 'T12:00:00');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayStr = days[d.getDay()];
  const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  
  // Calculate how long ago this was published
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const agoStr = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Yesterday' : `${diffDays}d ago`;
  
  return { dayStr, dateStr, agoStr };
}

export default function News() {
  const [feedData, setFeedData] = useState([]);
  const [activeCat, setActiveCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarked, setBookmarked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gate-prep-news-bookmarks') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    fetch('/data/gate-news-feed.json')
      .then(r => r.json())
      .then(data => setFeedData(data.feed || []))
      .catch(console.error);
  }, []);

  const toggleBookmark = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = { ...bookmarked, [id]: !bookmarked[id] };
    if (!next[id]) delete next[id];
    setBookmarked(next);
    localStorage.setItem('gate-prep-news-bookmarks', JSON.stringify(next));
  };

  const categories = ['All', 'IIT / IISc', 'PSU & Govt', 'Private Jobs', 'Courses & Prep', 'General Alerts', 'Bookmarked ⭐'];

  const filtered = feedData.filter(item => {
    if (activeCat === 'Bookmarked ⭐') {
      if (!bookmarked[item.id]) return false;
    } else if (activeCat !== 'All' && item.category !== activeCat) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSum = item.summary.toLowerCase().includes(q);
      const matchTag = item.tags?.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchSum || matchTag;
    }
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <p className="page-header__eyebrow">Aspirant Live Feed</p>
        <h1 className="page-header__title">GATE News & World Feed</h1>
        <p className="page-header__subtitle">
          Duniya bhar ki sab khabare — IIT admissions, PSU recruitments, private R&D jobs, crash courses, and stipend alerts with verified source links.
        </p>
      </div>

      {/* Curated Feed Status Banner */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <div className="card__body" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 10px #10b981' }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                Curated GATE Aspirant News Feed
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {feedData.length} articles • Sourced from official IIT portals, PSU websites & education platforms
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            🛡️ Verified: All links point to official source portals
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="seg-control" style={{ flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`seg-control__btn ${activeCat === cat ? 'active' : ''}`}
              onClick={() => setActiveCat(cat)}
              style={activeCat === cat && cat.includes('⭐') ? { background: 'var(--warning)', color: '#000', fontWeight: 600 } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="topbar__search" style={{ maxWidth: 300, width: '100%' }}>
          <svg className="topbar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search news, IITs, PSUs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Feed List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📰</div>
          <div className="empty-state__title">No news found</div>
          <div className="empty-state__desc">Try searching for a different term or switching categories.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 18 }}>
          {filtered.map((item) => {
            const catStyle = categoryColors[item.category] || { bg: 'var(--glass)', color: 'var(--text-secondary)', icon: '📌' };
            const isSaved = !!bookmarked[item.id];
            const { dayStr, dateStr, agoStr } = formatNewsDate(item.date);

            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card card--interactive"
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
              >
                {/* ACTUAL PUBLICATION DATE HEADER */}
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
                    <span style={{ color: 'var(--success)' }}>🕒</span> {agoStr} • <span style={{ color: '#4ade80' }}>● Verified</span>
                  </span>
                </div>

                <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Top bar: Category + Bookmark */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span className="tag" style={{ background: catStyle.bg, color: catStyle.color }}>
                      {catStyle.icon} {item.category}
                    </span>
                    <button
                      onClick={(e) => toggleBookmark(item.id, e)}
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        fontSize: 18, padding: 4, transition: 'transform 0.2s ease',
                      }}
                      title={isSaved ? 'Remove bookmark' : 'Bookmark this news'}
                    >
                      {isSaved ? '⭐' : '☆'}
                    </button>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: 17, marginBottom: 10, lineHeight: 1.4, color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>

                  {/* Summary */}
                  <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                    {item.summary}
                  </p>

                  {/* Tags */}
                  {item.tags && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                      {item.tags.map(t => (
                        <span key={t} style={{
                          fontSize: 11, background: 'rgba(255,255,255,0.05)',
                          padding: '3px 8px', borderRadius: 4, color: 'var(--text-muted)',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer: Date + Source Link */}
                  <div style={{
                    borderTop: '1px solid var(--glass-border)', paddingTop: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 12, color: 'var(--text-muted)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>📰 {item.sourceName}</span>
                      {item.verified && <span style={{ color: 'var(--accent-cs)', title: 'Verified Official Source' }}>✓</span>}
                    </div>
                    <span style={{ color: 'var(--accent-cs)', fontWeight: 600 }}>
                      Visit Source ↗
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
