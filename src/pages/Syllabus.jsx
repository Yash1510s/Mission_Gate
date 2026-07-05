import { useState, useEffect } from 'react';
import { useProgressStore } from '../stores/useProgressStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import ProgressRing from '../components/ui/ProgressRing';

export default function Syllabus() {
  const [syllabus, setSyllabus] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, done
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [activePaperTab, setActivePaperTab] = useState('cs'); // 'cs' or 'da'

  const checked = useProgressStore(s => s.checked);
  const toggleTopic = useProgressStore(s => s.toggleTopic);
  const getPaperCounts = useProgressStore(s => s.getPaperCounts);
  const getSectionCounts = useProgressStore(s => s.getSectionCounts);
  const userName = useSettingsStore(s => s.userName) || 'GATE Aspirant';

  useEffect(() => {
    fetch('/data/syllabus.json')
      .then(r => r.json())
      .then(setSyllabus)
      .catch(console.error);
  }, []);

  if (!syllabus) return <div className="empty-state"><div className="animate-pulse">Loading syllabus...</div></div>;

  const csCounts = getPaperCounts(syllabus, 'cs');
  const daCounts = getPaperCounts(syllabus, 'da');
  const csPct = csCounts.total ? Math.round((csCounts.done / csCounts.total) * 100) : 0;
  const daPct = daCounts.total ? Math.round((daCounts.done / daCounts.total) * 100) : 0;

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubjectCardClick = (paperId, si) => {
    const key = `${paperId}-${si}`;
    setExpandedSections(prev => ({ ...prev, [key]: true })); // ensure open
    setTimeout(() => {
      const el = document.getElementById(`section-${key}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const expandAll = () => {
    const allKeys = {};
    ['cs', 'da'].forEach(paperId => {
      syllabus[paperId].sections.forEach((_, si) => {
        allKeys[`${paperId}-${si}`] = true;
      });
    });
    setExpandedSections(allKeys);
  };

  const collapseAll = () => setExpandedSections({});
  const allExpanded = Object.values(expandedSections).some(Boolean);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <p className="page-header__eyebrow">Track Your Progress</p>
        <h1 className="page-header__title">Syllabus Tracker</h1>
        <p className="page-header__subtitle">
          CS + DA, subject-wise separated. Tick off topics as you finish them — your progress is saved automatically.
        </p>
      </div>

      {/* Progress Rings */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div 
          className={`card card--glow-cs ${activePaperTab === 'cs' ? 'active' : ''}`} 
          style={{ flex: '1 1 220px', cursor: 'pointer', border: activePaperTab === 'cs' ? '1px solid var(--accent-cs)' : undefined }}
          onClick={() => setActivePaperTab('cs')}
        >
          <div style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
            <ProgressRing size={74} percentage={csPct} color="var(--accent-cs)">
              {csPct}%
            </ProgressRing>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h4 style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", fontSize: 19, marginBottom: 2 }}>GATE CS</h4>
                <span className="tag tag--cs">13 Subjects</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                {csCounts.done} / {csCounts.total} topics
              </p>
            </div>
          </div>
        </div>

        <div 
          className={`card card--glow-da ${activePaperTab === 'da' ? 'active' : ''}`} 
          style={{ flex: '1 1 220px', cursor: 'pointer', border: activePaperTab === 'da' ? '1px solid var(--accent-da)' : undefined }}
          onClick={() => setActivePaperTab('da')}
        >
          <div style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
            <ProgressRing size={74} percentage={daPct} color="var(--accent-da)">
              {daPct}%
            </ProgressRing>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h4 style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", fontSize: 19, marginBottom: 2 }}>GATE DA</h4>
                <span className="tag tag--da">10 Subjects</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                {daCounts.done} / {daCounts.total} topics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Paper Toggle Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div className="seg-control">
          <button
            className={`seg-control__btn ${activePaperTab === 'cs' ? 'active' : ''}`}
            onClick={() => setActivePaperTab('cs')}
          >
            GATE CS (13 Subjects)
          </button>
          <button
            className={`seg-control__btn ${activePaperTab === 'da' ? 'active' : ''}`}
            onClick={() => setActivePaperTab('da')}
            style={activePaperTab === 'da' ? { background: 'var(--accent-da)', color: 'var(--text-inverse)' } : {}}
          >
            GATE DA (10 Subjects)
          </button>
        </div>

        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>
          💡 Click any subject card below to jump to its topic checklist
        </span>
      </div>

      {/* SUBJECT CARDS GRID (Match Screenshot UI) */}
      {(() => {
        const paper = syllabus[activePaperTab];
        const isDA = activePaperTab === 'da';
        const barColor = isDA ? 'var(--accent-da)' : 'var(--accent-cs)';

        return (
          <div className="subject-grid">
            {paper.sections.map((sec, si) => {
              const { total, done } = getSectionCounts(activePaperTab, si, sec);
              const pct = total ? Math.round((done / total) * 100) : 0;
              const cleanName = sec.name.replace(/^\d+\.\s*/, '');
              const badgeText = sec.badge || cleanName.slice(0, 2);
              const sectionKey = `${activePaperTab}-${si}`;
              const isOpen = !!expandedSections[sectionKey];

              return (
                <div
                  key={si}
                  className={`subject-card ${isDA ? 'subject-card--da' : ''} ${isOpen ? 'active' : ''}`}
                  onClick={() => handleSubjectCardClick(activePaperTab, si)}
                >
                  <div className="subject-card__left">
                    <div className="subject-card__badge">{badgeText}</div>
                    <div className="subject-card__title" title={cleanName}>{cleanName}</div>
                  </div>
                  <div className="subject-card__right">
                    <div className="subject-card__stats">
                      <span className="subject-card__pct">{pct}%</span>
                      <div className="subject-card__bar">
                        <div className="subject-card__bar-fill" style={{ width: `${pct}%`, background: barColor }} />
                      </div>
                    </div>
                    <span className="subject-card__arrow">›</span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Controls */}
      <div className="page-header__actions" style={{ marginBottom: 22 }}>
        <div className="seg-control">
          {['all', 'pending', 'done'].map(f => (
            <button
              key={f}
              className={`seg-control__btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="topbar__search" style={{ maxWidth: 260 }}>
          <svg className="topbar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ flex: 1 }} />
        <button className="btn" onClick={allExpanded ? collapseAll : expandAll}>
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Syllabus Sections List */}
      {['cs', 'da'].map(paperId => {
        if (paperId !== activePaperTab) return null; // Only show active paper's checklist below grid
        const paper = syllabus[paperId];

        return (
          <div key={paperId}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '28px 0 14px' }}>
              <h2>{paper.label} Topic Checklist</h2>
              <span className={`tag tag--${paper.cls}`}>{paper.tag}</span>
            </div>

            {paper.sections.map((sec, si) => {
              const sectionKey = `${paperId}-${si}`;
              const isOpen = !!expandedSections[sectionKey];
              const { total, done } = getSectionCounts(paperId, si, sec);
              const pct = total ? Math.round((done / total) * 100) : 0;
              const barColor = paperId === 'cs' ? 'var(--accent-cs)' : 'var(--accent-da)';
              const cleanName = sec.name.replace(/^\d+\.\s*/, '');
              const badgeText = sec.badge || cleanName.slice(0, 2);

              // Check if any topic matches search/filter
              let hasVisibleTopics = false;
              const renderedGroups = sec.groups.map((grp, gi) => {
                const showGroupLabel = grp.name !== 'Core Topics';
                const rows = grp.topics.map((topic, ti) => {
                  const id = `${paperId}-${si}-${gi}-${ti}`;
                  const isChecked = !!checked[id];

                  // Filter
                  if (filter === 'done' && !isChecked) return null;
                  if (filter === 'pending' && isChecked) return null;

                  // Search
                  if (searchQuery && !topic.toLowerCase().includes(searchQuery.toLowerCase())) return null;

                  hasVisibleTopics = true;

                  return (
                    <label
                      key={id}
                      className={`topic-row ${isChecked ? 'topic-row--checked' : ''} ${paperId === 'da' ? 'topic-row--da' : ''}`}
                    >
                      <input
                        type="checkbox"
                        className="topic-row__checkbox"
                        checked={isChecked}
                        onChange={() => toggleTopic(id)}
                      />
                      <span className="topic-row__text">{topic}</span>
                    </label>
                  );
                }).filter(Boolean);

                if (rows.length === 0) return null;

                return (
                  <div key={gi}>
                    {showGroupLabel && <div className="group-label">{grp.name}</div>}
                    {rows}
                  </div>
                );
              }).filter(Boolean);

              // Don't render section if no visible topics (except in 'all' filter with no search)
              if (!hasVisibleTopics && (filter !== 'all' || searchQuery)) return null;

              return (
                <div key={sectionKey} id={`section-${sectionKey}`} className="section-accordion">
                  <div
                    className="section-accordion__header"
                    onClick={() => toggleSection(sectionKey)}
                  >
                    <svg
                      className={`section-accordion__chevron ${isOpen ? 'section-accordion__chevron--open' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                      <span className="tag" style={{ background: paperId === 'cs' ? 'var(--accent-cs-soft)' : 'var(--accent-da-soft)', color: barColor, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                        {badgeText}
                      </span>
                      <span className="section-accordion__name">{sec.name}</span>
                    </div>
                    <span className="section-accordion__bar">
                      <div
                        className="section-accordion__bar-fill"
                        style={{ width: `${pct}%`, background: barColor }}
                      />
                    </span>
                    <span className="section-accordion__count">{done}/{total}</span>
                  </div>
                  {isOpen && (
                    <div className="section-accordion__body">
                      {renderedGroups}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Footer */}
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 40 }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
          Progress saved automatically in localStorage
        </p>
        <p style={{ marginTop: 6, opacity: 0.6 }}>{userName} — GATE Prep Companion</p>
      </div>
    </div>
  );
}
