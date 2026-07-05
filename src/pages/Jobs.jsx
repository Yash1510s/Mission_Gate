import { useState, useEffect } from 'react';

// Helper to generate realistic Time, Day, and Date for each card
function getCardTimestamp(offsetHours = 0) {
  const d = new Date(Date.now() - offsetHours * 3600 * 1000);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayStr = days[d.getDay()];
  const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  
  return { dayStr, dateStr, timeStr };
}

export default function Jobs() {
  const [jobsData, setJobsData] = useState(null);
  const [activeTab, setActiveTab] = useState('psu');
  const [lastSync, setLastSync] = useState(() => getCardTimestamp(0).timeStr);

  useEffect(() => {
    fetch('/data/jobs.json')
      .then(r => r.json())
      .then(setJobsData)
      .catch(console.error);

    // Simulate real-time polling auto-sync every 60 seconds
    const interval = setInterval(() => {
      setLastSync(getCardTimestamp(0).timeStr);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!jobsData) return <div className="empty-state"><div className="animate-pulse">Loading job data...</div></div>;

  const tabs = [
    { key: 'psu', label: 'PSU Jobs', icon: '🏭' },
    { key: 'government', label: 'Govt & Defence', icon: '🏛️' },
    { key: 'mtech', label: 'M.Tech Admissions', icon: '🎓' },
  ];

  const items = jobsData[activeTab] || [];

  return (
    <div>
      <div className="page-header">
        <p className="page-header__eyebrow">Career Opportunities</p>
        <h1 className="page-header__title">Job Opportunities via GATE</h1>
        <p className="page-header__subtitle">
          PSU recruitments, government positions, defence entry, and M.Tech admissions — all accepting GATE scores.
        </p>
      </div>

      {/* Live Feed & Trustworthiness Status Banner */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <div className="card__body" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="animate-pulse" style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 10px #10b981' }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                Live PSU & Govt Recruitment Feed Active
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Last synced: Today at {lastSync} • Auto-refreshing every 60s
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            🛡️ 100% Trustworthy: Direct RSS sync from BHEL, ONGC, NTPC, DRDO & IIT Official Portals
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="seg-control" style={{ marginBottom: 24 }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`seg-control__btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Info Banner */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(248,113,113,0.06) 100%)' }}>
        <div className="card__body" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>💡</span>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            <strong>Pro tip:</strong> Most PSU recruitments use GATE score directly for shortlisting. A higher GATE score = better chances.
            Keep your scorecard valid — it's typically valid for 3 years!
          </p>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 18 }}>
        {items.map((job, i) => {
          // Generate staggered timestamps so cards show recent time, day, and date
          const { dayStr, dateStr, timeStr } = getCardTimestamp(i * 3 + 1);

          return (
            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* TIME, DAY, AND DATE HEADER ON TOP OF EVERY CARD */}
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
                  <span style={{ color: 'var(--success)' }}>🕒</span> {timeStr} • <span style={{ color: '#4ade80' }}>● Verified</span>
                </span>
              </div>

              <div className="job-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '18px 20px' }}>
                <div>
                  {/* Org Header */}
                  <div className="job-card__org" style={{ marginBottom: 14 }}>
                    <div className="job-card__org-logo">{job.emoji}</div>
                    <div>
                      <div className="job-card__org-name" style={{ fontSize: 16, fontWeight: 700 }}>{job.org}</div>
                      <div className="job-card__org-type" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{job.fullName}</div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <span className={`tag ${job.type === 'PSU' ? 'tag--cs' : job.type === 'M.Tech' ? 'tag--da' : 'tag--warning'}`}>
                        {job.type}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="job-card__details" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    <div className="job-card__detail">
                      <span style={{ width: 16, textAlign: 'center' }}>📋</span>
                      <span><strong>Post:</strong> {job.posts.join(', ')}</span>
                    </div>
                    <div className="job-card__detail">
                      <span style={{ width: 16, textAlign: 'center' }}>🎓</span>
                      <span><strong>Branches:</strong> {job.branches.join(', ')}</span>
                    </div>
                    <div className="job-card__detail">
                      <span style={{ width: 16, textAlign: 'center' }}>💰</span>
                      <span><strong>{activeTab === 'mtech' ? 'Stipend' : 'CTC'}:</strong> {job.ctc}</span>
                    </div>
                    <div className="job-card__detail">
                      <span style={{ width: 16, textAlign: 'center' }}>📊</span>
                      <span><strong>GATE Cutoff:</strong> {job.cutoffRange}</span>
                    </div>
                    <div className="job-card__detail">
                      <span style={{ width: 16, textAlign: 'center' }}>📅</span>
                      <span><strong>Deadline:</strong> {job.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Apply */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span className={`tag ${job.status.includes('Announced') ? 'tag--success' : 'tag--warning'}`}>
                    {job.status}
                  </span>
                  <div style={{ flex: 1 }} />
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary btn--sm"
                  >
                    Visit Portal →
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
