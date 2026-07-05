import { useState, useEffect } from 'react';

export default function PYQs() {
  const [pyqData, setPyqData] = useState(null);
  const [activePaper, setActivePaper] = useState('cs');

  useEffect(() => {
    fetch('/data/pyq-links.json')
      .then(r => r.json())
      .then(setPyqData)
      .catch(console.error);
  }, []);

  if (!pyqData) return <div className="empty-state"><div className="animate-pulse">Loading PYQs...</div></div>;

  const papers = pyqData[activePaper] || [];
  const isDA = activePaper === 'da';

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <p className="page-header__eyebrow">Previous Year Questions</p>
        <h1 className="page-header__title">PYQ Hub</h1>
        <p className="page-header__subtitle">
          Access all GATE previous year question papers from 2007 to 2026. Download and practice!
        </p>
      </div>

      {/* Paper Toggle */}
      <div className="seg-control" style={{ marginBottom: 24 }}>
        <button
          className={`seg-control__btn ${activePaper === 'cs' ? 'active' : ''}`}
          onClick={() => setActivePaper('cs')}
        >
          GATE CS
        </button>
        <button
          className={`seg-control__btn ${activePaper === 'da' ? 'active' : ''}`}
          onClick={() => setActivePaper('da')}
          style={activePaper === 'da' ? { background: 'var(--accent-da)', color: 'var(--text-inverse)' } : {}}
        >
          GATE DA
        </button>
      </div>

      {/* Stats Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card__body" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div className="stat-card__icon" style={{ background: isDA ? 'var(--accent-da-soft)' : 'var(--accent-cs-soft)', color: isDA ? 'var(--accent-da)' : 'var(--accent-cs)' }}>
            📝
          </div>
          <div>
            <h3 style={{ fontSize: 20 }}>
              {isDA ? 'GATE DA' : 'GATE CS'} — Previous Year Papers
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
              {papers.length} papers available • {isDA ? '2024–2026' : '2007–2026'}
            </p>
          </div>
          <div style={{ flex: 1 }} />
          <span className={`tag tag--${isDA ? 'da' : 'cs'}`}>
            {isDA ? 'Data Science & AI' : 'CS & IT'}
          </span>
        </div>
      </div>

      {/* PYQ Grid */}
      <div className="pyq-grid">
        {papers.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`pyq-chip ${isDA ? 'pyq-chip--da' : ''}`}
          >
            <span>{item.year}</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        ))}
      </div>

      {/* DA Note */}
      {isDA && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card__body" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>ℹ️</span>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              GATE DA launched in 2024, so only 2024–2026 papers exist officially. Earlier years will be added as they become available.
            </p>
          </div>
        </div>
      )}

      {/* PYQ Weightage Analysis Placeholder */}
      <div style={{ marginTop: 36 }}>
        <h3 style={{ marginBottom: 16 }}>📊 Subject-wise Weightage (Approximate)</h3>
        <div className="card">
          <div className="card__body">
            {(isDA ? daWeightage : csWeightage).map(item => (
              <div key={item.subject} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{item.subject}</span>
                  <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>
                    ~{item.marks} marks
                  </span>
                </div>
                <div style={{
                  width: '100%', height: 8, borderRadius: 4,
                  background: 'rgba(255,255,255,0.06)', overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${item.marks}%`, height: '100%', borderRadius: 4,
                    background: isDA
                      ? `linear-gradient(90deg, var(--accent-da), rgba(224,95,208,0.5))`
                      : `linear-gradient(90deg, var(--accent-cs), rgba(91,140,255,0.5))`,
                    transition: 'width 0.6s var(--ease-out)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Card */}
      <div className="card" style={{ marginTop: 24, background: 'linear-gradient(135deg, rgba(74,222,128,0.06) 0%, rgba(96,165,250,0.06) 100%)' }}>
        <div className="card__body">
          <h4 style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            💡 PYQ Strategy Tips
          </h4>
          <ul style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li>• Start solving PYQs after finishing at least 60% of a subject</li>
            <li>• Solve the last 5 years' papers first — they reflect the latest pattern</li>
            <li>• Time yourself — 3 hours for full paper, 1 hour for subject-wise</li>
            <li>• Mark questions you got wrong and revisit them every week</li>
            <li>• Focus on NAT (Numerical) questions — no negative marking!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const csWeightage = [
  { subject: 'Engineering Mathematics', marks: 13 },
  { subject: 'General Aptitude', marks: 15 },
  { subject: 'Algorithms & DS', marks: 12 },
  { subject: 'DBMS', marks: 8 },
  { subject: 'Operating Systems', marks: 8 },
  { subject: 'Computer Networks', marks: 7 },
  { subject: 'Theory of Computation', marks: 7 },
  { subject: 'Digital Logic', marks: 6 },
  { subject: 'Computer Organization', marks: 6 },
  { subject: 'Compiler Design', marks: 5 },
  { subject: 'Programming & DS', marks: 8 },
];

const daWeightage = [
  { subject: 'Probability & Statistics', marks: 18 },
  { subject: 'Machine Learning', marks: 18 },
  { subject: 'Linear Algebra', marks: 12 },
  { subject: 'Programming, DS & Algo', marks: 12 },
  { subject: 'General Aptitude', marks: 15 },
  { subject: 'Calculus & Optimization', marks: 8 },
  { subject: 'Database Management', marks: 7 },
  { subject: 'Artificial Intelligence', marks: 10 },
];
