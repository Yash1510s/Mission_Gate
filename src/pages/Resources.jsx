import { useState, useEffect } from 'react';

const typeIcons = {
  playlist: '🎬',
  notes: '📄',
  portal: '🌐',
  course: '🎓',
  book: '📚',
  sheet: '📋',
};

export default function Resources() {
  const [resources, setResources] = useState(null);
  const [activePaper, setActivePaper] = useState('cs');
  const [filterType, setFilterType] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    fetch('/data/resources.json')
      .then(r => r.json())
      .then(setResources)
      .catch(console.error);
  }, []);

  if (!resources) return <div className="empty-state"><div className="animate-pulse">Loading study materials...</div></div>;

  const subjects = resources[activePaper] || [];
  const isDA = activePaper === 'da';
  const allTypes = ['all', ...new Set(subjects.flatMap(s => s.resources.map(r => r.type)))];

  const handleSubjectClick = (subjName) => {
    if (selectedSubject === subjName) {
      setSelectedSubject('all');
      window.scrollTo({ top: 180, behavior: 'smooth' });
    } else {
      setSelectedSubject(subjName);
      setTimeout(() => {
        const el = document.getElementById(`res-sec-${subjName.replace(/\s+/g, '-')}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const handleCloseSection = () => {
    setSelectedSubject('all');
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="page-header">
        <p className="page-header__eyebrow">Study Materials</p>
        <h1 className="page-header__title">Free Resources & Playlists</h1>
        <p className="page-header__subtitle">
          Curated collection of the best free YouTube playlists, notes, courses, and practice portals. Subjects separated cleanly!
        </p>
      </div>

      {/* Paper & Type Controls */}
      <div className="resources-controls">
        <div className="seg-control">
          <button
            className={`seg-control__btn ${activePaper === 'cs' ? 'active' : ''}`}
            onClick={() => { setActivePaper('cs'); setSelectedSubject('all'); }}
          >
            GATE CS (13 Subjects)
          </button>
          <button
            className={`seg-control__btn ${activePaper === 'da' ? 'active' : ''}`}
            onClick={() => { setActivePaper('da'); setSelectedSubject('all'); }}
            style={activePaper === 'da' ? { background: 'var(--accent-da)', color: 'var(--text-inverse)' } : {}}
          >
            GATE DA (10 Subjects)
          </button>
        </div>

        <div className="resources-filter-bar">
          {allTypes.map(t => (
            <button
              key={t}
              className={`seg-control__btn ${filterType === t ? 'active' : ''}`}
              onClick={() => setFilterType(t)}
              style={filterType === t ? { background: 'var(--success)', color: 'var(--text-inverse)' } : {}}
            >
              {t === 'all' ? 'All Formats' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Hint Row */}
      <div className="resources-hint-row">
        <span style={{ fontSize: 13, color: 'var(--text-muted)', flex: 1 }}>
          💡 Click any subject card to open and jump to its resources. Click again or press Close to collapse!
        </span>
        {selectedSubject !== 'all' && (
          <button
            onClick={handleCloseSection}
            style={{
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              background: 'rgba(248, 113, 113, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
          >
            ✕ Show All
          </button>
        )}
      </div>

      <div className="subject-grid">
        {subjects.map((subj, idx) => {
          const badgeText = subj.badge || subj.subject.slice(0, 2);
          const resCount = subj.resources.length;
          const isSelected = selectedSubject === subj.subject;
          const barColor = isDA ? 'var(--accent-da)' : 'var(--accent-cs)';

          return (
            <div
              key={idx}
              className={`subject-card ${isDA ? 'subject-card--da' : ''} ${isSelected ? 'active' : ''}`}
              onClick={() => handleSubjectClick(subj.subject)}
            >
              <div className="subject-card__left">
                <div className="subject-card__badge">{badgeText}</div>
                <div className="subject-card__title" title={subj.subject}>{subj.subject}</div>
              </div>
              <div className="subject-card__right">
                <div className="subject-card__stats">
                  <span className="subject-card__pct">{resCount} items</span>
                  <div className="subject-card__bar">
                    <div className="subject-card__bar-fill" style={{ width: '100%', background: barColor, opacity: 0.7 }} />
                  </div>
                </div>
                <span className="subject-card__arrow">{isSelected ? '✕' : '›'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resources by Subject */}
      <div style={{ marginTop: 32 }}>
        {subjects.map((subjectGroup, idx) => {
          if (selectedSubject !== 'all' && selectedSubject !== subjectGroup.subject) return null;

          const filteredResources = filterType === 'all'
            ? subjectGroup.resources
            : subjectGroup.resources.filter(r => r.type === filterType);

          if (filteredResources.length === 0) return null;

          const badgeText = subjectGroup.badge || subjectGroup.subject.slice(0, 2);
          const barColor = isDA ? 'var(--accent-da)' : 'var(--accent-cs)';
          const isSingleView = selectedSubject === subjectGroup.subject;

          return (
            <div key={idx} id={`res-sec-${subjectGroup.subject.replace(/\s+/g, '-')}`} style={{ marginBottom: 36, padding: isSingleView ? '16px' : '0', background: isSingleView ? 'rgba(255, 255, 255, 0.02)' : 'transparent', borderRadius: 16, border: isSingleView ? '1px solid rgba(255, 255, 255, 0.08)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="tag" style={{ background: isDA ? 'var(--accent-da-soft)' : 'var(--accent-cs-soft)', color: barColor, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14, padding: '4px 10px' }}>
                    {badgeText}
                  </span>
                  <h3 style={{ margin: 0, fontSize: 18 }}>{subjectGroup.subject}</h3>
                  <span className={`tag tag--${isDA ? 'da' : 'cs'}`}>{filteredResources.length} resources</span>
                </div>

                {/* Prominent Close Section Button when opened */}
                {isSingleView && (
                  <button
                    onClick={handleCloseSection}
                    style={{
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-primary)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 8,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(248, 113, 113, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                  >
                    <span>✕ Close Section</span>
                  </button>
                )}
              </div>

              <div className="resources-cards-grid">
                {filteredResources.map((res, ri) => (
                  <a
                    key={ri}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card card--interactive"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="resource-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                        <span style={{ fontSize: 24, lineHeight: 1 }}>{typeIcons[res.type] || '📎'}</span>
                        <div style={{ flex: 1 }}>
                          <div className="resource-card__title" style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, lineHeight: 1.4 }}>{res.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{res.author}</div>
                        </div>
                      </div>
                      <div className="resource-card__meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <span className="tag" style={{
                          background: res.type === 'playlist' ? 'rgba(236,72,153,0.15)' : res.type === 'notes' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)',
                          color: res.type === 'playlist' ? '#f472b6' : res.type === 'notes' ? '#60a5fa' : '#34d399',
                          textTransform: 'uppercase',
                          fontSize: 10,
                          fontWeight: 700
                        }}>
                          {res.type}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--accent-cs)', fontWeight: 600 }}>Open Link ↗</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
