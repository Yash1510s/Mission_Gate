import { useState, useEffect } from 'react';
import { useProgressStore } from '../stores/useProgressStore';
import ProgressRing from '../components/ui/ProgressRing';

export default function Analytics() {
  const [syllabus, setSyllabus] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState('cs'); // 'cs' or 'da'
  const getPaperCounts = useProgressStore(s => s.getPaperCounts);
  const getSectionCounts = useProgressStore(s => s.getSectionCounts);
  const getStreak = useProgressStore(s => s.getStreak);
  const lastStudied = useProgressStore(s => s.lastStudied);

  useEffect(() => {
    fetch('/data/syllabus.json')
      .then(r => r.json())
      .then(setSyllabus)
      .catch(console.error);
  }, []);

  if (!syllabus) {
    return <div className="empty-state"><div className="animate-pulse">Loading Analytics...</div></div>;
  }

  const csCounts = getPaperCounts(syllabus, 'cs');
  const daCounts = getPaperCounts(syllabus, 'da');
  const activeCounts = selectedPaper === 'cs' ? csCounts : daCounts;
  const totalDone = activeCounts.done;
  const totalTopics = activeCounts.total;
  const overallPct = totalTopics ? Math.round((totalDone / totalTopics) * 100) : 0;
  const streak = getStreak();

  // Score Predictor Algorithm (Base 25 + up to 60 marks from syllabus + 15 marks consistency bonus)
  const predictedScore = Math.min(100, Math.round(20 + (overallPct * 0.65) + (Math.min(streak, 30) * 0.5)));
  const predictedRank = predictedScore > 85 ? 'AIR 1 - 50 🏆' : predictedScore > 70 ? 'AIR 51 - 300 ⭐' : predictedScore > 55 ? 'AIR 301 - 1000 📈' : 'AIR 1000+ 🚀';
  const predictedGateScore = Math.min(1000, Math.round(350 + (predictedScore * 6.5)));

  // Subject-wise readiness
  const subjectData = syllabus[selectedPaper].sections.map((sec, si) => {
    const { total, done } = getSectionCounts(selectedPaper, si, sec);
    const pct = total ? Math.round((done / total) * 100) : 0;
    let status = 'Needs Attention';
    let badgeColor = '#f87171';
    if (pct >= 80) { status = 'Strong Mastery'; badgeColor = '#4ade80'; }
    else if (pct >= 40) { status = 'Moderate Progress'; badgeColor = '#fbbf24'; }
    return { name: sec.name.replace(/^\d+\.\s*/, ''), total, done, pct, status, badgeColor };
  });

  // Activity heatmap — last 30 days
  const activityMap = {};
  Object.values(lastStudied).forEach(ts => {
    const day = new Date(ts).toDateString();
    activityMap[day] = (activityMap[day] || 0) + 1;
  });

  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    last30Days.push({
      date: d,
      count: activityMap[key] || 0,
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    });
  }

  const maxActivity = Math.max(1, ...last30Days.map(d => d.count));

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p className="page-header__eyebrow">AI Score Predictor & Heatmaps</p>
          <h1 className="page-header__title">Performance Analytics Hub</h1>
          <p className="page-header__subtitle">
            AI-driven GATE score estimation, subject-wise strength/weakness heatmaps, and 30-day consistency tracking.
          </p>
        </div>

        {/* Paper Switcher */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: 6, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => setSelectedPaper('cs')}
            style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: selectedPaper === 'cs' ? 'var(--accent-cs)' : 'transparent', color: selectedPaper === 'cs' ? '#fff' : 'var(--text-secondary)' }}
          >
            💻 GATE CS ({csCounts.done}/{csCounts.total})
          </button>
          <button
            onClick={() => setSelectedPaper('da')}
            style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: selectedPaper === 'da' ? 'var(--accent-da)' : 'transparent', color: selectedPaper === 'da' ? '#fff' : 'var(--text-secondary)' }}
          >
            🤖 GATE DA ({daCounts.done}/{daCounts.total})
          </button>
        </div>
      </div>

      {/* AI GATE SCORE PREDICTOR BANNER */}
      <div className="card" style={{ marginBottom: 28, padding: '24px', background: 'linear-gradient(135deg, rgba(91,140,255,0.18) 0%, rgba(168,85,247,0.18) 50%, rgba(224,95,208,0.18) 100%)', border: '2px solid rgba(91,140,255,0.5)', borderRadius: 20, boxShadow: '0 0 30px rgba(91,140,255,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ flex: '1 1 300px' }}>
            <span className="tag tag--cs" style={{ marginBottom: 10, display: 'inline-block' }}>🤖 AI Rank Prediction Engine</span>
            <h2 style={{ fontSize: 24, margin: '6px 0', color: 'var(--text-primary)' }}>Expected GATE Performance</h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Calculated dynamically based on your current {selectedPaper.toUpperCase()} syllabus mastery ({overallPct}%) and daily consistency streak ({streak} days). Complete more syllabus topics and mock tests to improve your estimated rank!
            </p>
          </div>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.4)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', minWidth: 140 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Expected Marks</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#60a5fa', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>~{predictedScore}/100</div>
            </div>
            <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.4)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', minWidth: 140 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>GATE Score</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#f082e6', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{predictedGateScore}</div>
            </div>
            <div style={{ padding: '16px 24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.3) 100%)', borderRadius: 16, border: '1px solid #10b981', textAlign: 'center', minWidth: 160 }}>
              <div style={{ fontSize: 11, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: 1 }}>Estimated Rank</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 8 }}>{predictedRank}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="dashboard-grid" style={{ marginBottom: 28 }}>
        <div className="card">
          <div className="stat-card">
            <ProgressRing size={64} percentage={overallPct} color={selectedPaper === 'cs' ? 'var(--accent-cs)' : 'var(--accent-da)'}>
              {overallPct}%
            </ProgressRing>
            <div className="stat-card__content">
              <div className="stat-card__label">{selectedPaper.toUpperCase()} Readiness</div>
              <div className="stat-card__value">{totalDone}/{totalTopics}</div>
              <div className="stat-card__sub">topics completed</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--warning">
              <span className="streak-fire">🔥</span>
            </div>
            <div className="stat-card__content">
              <div className="stat-card__label">Current Streak</div>
              <div className="stat-card__value">{streak}</div>
              <div className="stat-card__sub">consecutive days</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--success">📈</div>
            <div className="stat-card__content">
              <div className="stat-card__label">Avg Topics/Day</div>
              <div className="stat-card__value">
                {Object.keys(activityMap).length > 0
                  ? (totalDone / Object.keys(activityMap).length).toFixed(1)
                  : '0'}
              </div>
              <div className="stat-card__sub">over active days</div>
            </div>
          </div>
        </div>
      </div>

      {/* SUBJECT-WISE STRENGTH & WEAKNESS HEATMAP */}
      <h3 style={{ marginBottom: 16 }}>🎯 Subject-wise Strength & Weakness Heatmap ({selectedPaper.toUpperCase()})</h3>
      <div className="card" style={{ marginBottom: 28, padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {subjectData.map((sub, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px 20px', borderRadius: 14,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', flexDirection: 'column', justify: 'space-between', gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{sub.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: `${sub.badgeColor}22`, color: sub.badgeColor, border: `1px solid ${sub.badgeColor}55`, whiteSpace: 'nowrap' }}>
                  {sub.status}
                </span>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  <span>Progress</span>
                  <span style={{ fontWeight: 700, color: sub.badgeColor }}>{sub.done}/{sub.total} topics ({sub.pct}%)</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${sub.pct}%`, height: '100%', background: sub.badgeColor, borderRadius: 4, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Heatmap */}
      <h3 style={{ marginBottom: 14 }}>📊 30-Day Consistency Heatmap</h3>
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card__body">
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 120, padding: '10px 0' }}>
            {last30Days.map((d, i) => (
              <div
                key={i}
                className="tooltip"
                data-tooltip={`${d.label}: ${d.count} topics`}
                style={{
                  flex: 1,
                  height: `${Math.max(4, (d.count / maxActivity) * 100)}%`,
                  background: d.count === 0
                    ? 'rgba(255,255,255,0.04)'
                    : `rgba(91, 140, 255, ${0.2 + (d.count / maxActivity) * 0.8})`,
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease',
                  minHeight: 4,
                }}
              />
            ))}
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace",
            marginTop: 8,
          }}>
            <span>{last30Days[0]?.label}</span>
            <span>{last30Days[14]?.label}</span>
            <span>{last30Days[29]?.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
