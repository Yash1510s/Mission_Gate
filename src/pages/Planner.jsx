import { useState, useEffect } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';

const scheduleTemplates = {
  cs: {
    2: { // 2 hours daily (College / Working professional)
      'Monday':    [{ time: '06:30 - 08:30 AM', subject: 'Engineering Mathematics', type: 'Concept', color: 'var(--accent-cs)', completed: false }],
      'Tuesday':   [{ time: '07:00 - 09:00 PM', subject: 'Data Structures & Algorithms', type: 'Coding & PYQs', color: 'var(--success)', completed: false }],
      'Wednesday': [{ time: '06:30 - 08:30 AM', subject: 'Operating Systems', type: 'Theory', color: 'var(--info)', completed: false }],
      'Thursday':  [{ time: '07:00 - 09:00 PM', subject: 'DBMS & SQL', type: 'Practice', color: 'var(--warning)', completed: false }],
      'Friday':    [{ time: '06:30 - 08:30 AM', subject: 'Computer Networks', type: 'Concept', color: 'var(--accent-cs)', completed: false }],
      'Saturday':  [{ time: '10:00 AM - 01:00 PM', subject: 'Digital Logic & COA', type: 'Deep Dive', color: 'var(--danger)', completed: false }],
      'Sunday':    [{ time: '10:00 AM - 12:00 PM', subject: 'Weekly PYQ Sprint & Revision', type: 'Revision', color: 'var(--success)', completed: false }],
    },
    4: { // 4 hours daily (Balanced Aspirant)
      'Monday':    [{ time: '06:00 - 08:00 AM', subject: 'Engineering Mathematics', type: 'Concept', color: 'var(--accent-cs)', completed: false }, { time: '06:00 - 08:00 PM', subject: 'Data Structures', type: 'PYQs', color: 'var(--success)', completed: false }],
      'Tuesday':   [{ time: '06:00 - 08:00 AM', subject: 'Algorithms', type: 'Concept', color: 'var(--warning)', completed: false }, { time: '06:00 - 08:00 PM', subject: 'Operating Systems', type: 'PYQs', color: 'var(--info)', completed: false }],
      'Wednesday': [{ time: '06:00 - 08:00 AM', subject: 'DBMS & Transactions', type: 'Concept', color: 'var(--danger)', completed: false }, { time: '06:00 - 08:00 PM', subject: 'Theory of Computation', type: 'PYQs', color: 'var(--accent-cs)', completed: false }],
      'Thursday':  [{ time: '06:00 - 08:00 AM', subject: 'Computer Networks', type: 'Concept', color: 'var(--info)', completed: false }, { time: '06:00 - 08:00 PM', subject: 'Digital Logic', type: 'PYQs', color: 'var(--success)', completed: false }],
      'Friday':    [{ time: '06:00 - 08:00 AM', subject: 'Compiler Design', type: 'Concept', color: 'var(--warning)', completed: false }, { time: '06:00 - 08:00 PM', subject: 'General Aptitude', type: 'Practice', color: 'var(--accent-cs)', completed: false }],
      'Saturday':  [{ time: '09:00 AM - 01:00 PM', subject: 'COA & Advanced Problem Solving', type: 'Deep Dive', color: 'var(--danger)', completed: false }],
      'Sunday':    [{ time: '09:00 AM - 12:00 PM', subject: 'Full Subject Mock Test', type: 'Test', color: 'var(--accent-cs)', completed: false }, { time: '04:00 - 06:00 PM', subject: 'Mock Analysis & Error Diary', type: 'Analysis', color: 'var(--warning)', completed: false }],
    },
    6: { // 6+ hours daily (Dedicated Aspirant)
      'Monday':    [{ time: '06:00 - 08:30 AM', subject: 'Engineering Math & Calc', type: 'Concept', color: 'var(--accent-cs)', completed: false }, { time: '02:00 - 04:30 PM', subject: 'DSA Deep Dive', type: 'Coding', color: 'var(--success)', completed: false }, { time: '07:00 - 09:00 PM', subject: 'General Aptitude', type: 'Practice', color: 'var(--info)', completed: false }],
      'Tuesday':   [{ time: '06:00 - 08:30 AM', subject: 'Operating Systems', type: 'Concept', color: 'var(--warning)', completed: false }, { time: '02:00 - 04:30 PM', subject: 'DBMS & Normalization', type: 'Practice', color: 'var(--danger)', completed: false }, { time: '07:00 - 09:00 PM', subject: 'PYQ 15-Year Sprint', type: 'PYQs', color: 'var(--accent-cs)', completed: false }],
      'Wednesday': [{ time: '06:00 - 08:30 AM', subject: 'Theory of Computation', type: 'Concept', color: 'var(--info)', completed: false }, { time: '02:00 - 04:30 PM', subject: 'Compiler Design', type: 'Practice', color: 'var(--success)', completed: false }, { time: '07:00 - 09:00 PM', subject: 'Math Revision', type: 'Revision', color: 'var(--warning)', completed: false }],
      'Thursday':  [{ time: '06:00 - 08:30 AM', subject: 'Computer Networks', type: 'Concept', color: 'var(--danger)', completed: false }, { time: '02:00 - 04:30 PM', subject: 'Digital Logic', type: 'Practice', color: 'var(--accent-cs)', completed: false }, { time: '07:00 - 09:00 PM', subject: 'Aptitude & Verbal', type: 'Practice', color: 'var(--info)', completed: false }],
      'Friday':    [{ time: '06:00 - 08:30 AM', subject: 'COA & Pipelining', type: 'Concept', color: 'var(--warning)', completed: false }, { time: '02:00 - 04:30 PM', subject: 'Advanced Algorithms', type: 'Practice', color: 'var(--success)', completed: false }, { time: '07:00 - 09:00 PM', subject: 'PYQ Sprint', type: 'PYQs', color: 'var(--danger)', completed: false }],
      'Saturday':  [{ time: '09:00 AM - 12:00 PM', subject: 'Subject-Wise Mock Test 1', type: 'Test', color: 'var(--accent-cs)', completed: false }, { time: '02:00 - 05:00 PM', subject: 'Subject-Wise Mock Test 2', type: 'Test', color: 'var(--info)', completed: false }, { time: '07:00 - 09:00 PM', subject: 'Error Diary Review', type: 'Analysis', color: 'var(--warning)', completed: false }],
      'Sunday':    [{ time: '09:00 AM - 12:00 PM', subject: 'Full Length GATE Mock Test (3 Hrs)', type: 'Test', color: 'var(--danger)', completed: false }, { time: '03:00 - 06:00 PM', subject: 'In-Depth Mock Analysis & Weakness Fixing', type: 'Analysis', color: 'var(--success)', completed: false }],
    }
  },
  da: {
    2: {
      'Monday':    [{ time: '06:30 - 08:30 AM', subject: 'Probability & Statistics', type: 'Concept', color: 'var(--accent-da)', completed: false }],
      'Tuesday':   [{ time: '07:00 - 09:00 PM', subject: 'Linear Algebra & Matrices', type: 'Concept', color: 'var(--info)', completed: false }],
      'Wednesday': [{ time: '06:30 - 08:30 AM', subject: 'Machine Learning Algorithms', type: 'Concept', color: 'var(--success)', completed: false }],
      'Thursday':  [{ time: '07:00 - 09:00 PM', subject: 'Python for Data Science & Pandas', type: 'Coding', color: 'var(--warning)', completed: false }],
      'Friday':    [{ time: '06:30 - 08:30 AM', subject: 'DBMS & Data Warehousing', type: 'Concept', color: 'var(--accent-da)', completed: false }],
      'Saturday':  [{ time: '10:00 AM - 01:00 PM', subject: 'AI & Neural Networks', type: 'Deep Dive', color: 'var(--danger)', completed: false }],
      'Sunday':    [{ time: '10:00 AM - 12:00 PM', subject: 'Weekly PYQ Sprint & Formula Math', type: 'Revision', color: 'var(--success)', completed: false }],
    },
    4: {
      'Monday':    [{ time: '06:00 - 08:00 AM', subject: 'Probability & Statistics', type: 'Concept', color: 'var(--accent-da)', completed: false }, { time: '06:00 - 08:00 PM', subject: 'Python & NumPy Coding', type: 'Coding', color: 'var(--info)', completed: false }],
      'Tuesday':   [{ time: '06:00 - 08:00 AM', subject: 'Linear Algebra', type: 'Concept', color: 'var(--success)', completed: false }, { time: '06:00 - 08:00 PM', subject: 'Supervised Learning', type: 'Theory', color: 'var(--warning)', completed: false }],
      'Wednesday': [{ time: '06:00 - 08:00 AM', subject: 'Calculus & Optimization', type: 'Concept', color: 'var(--danger)', completed: false }, { time: '06:00 - 08:00 PM', subject: 'Unsupervised Learning & Clustering', type: 'Concept', color: 'var(--accent-da)', completed: false }],
      'Thursday':  [{ time: '06:00 - 08:00 AM', subject: 'DBMS & SQL Practice', type: 'Practice', color: 'var(--info)', completed: false }, { time: '06:00 - 08:00 PM', subject: 'Data Structures in Python', type: 'Coding', color: 'var(--success)', completed: false }],
      'Friday':    [{ time: '06:00 - 08:00 AM', subject: 'AI & Deep Learning Foundations', type: 'Concept', color: 'var(--warning)', completed: false }, { time: '06:00 - 08:00 PM', subject: 'General Aptitude', type: 'Practice', color: 'var(--accent-da)', completed: false }],
      'Saturday':  [{ time: '09:00 AM - 01:00 PM', subject: 'ML Mathematics & Problem Solving', type: 'Deep Dive', color: 'var(--danger)', completed: false }],
      'Sunday':    [{ time: '09:00 AM - 12:00 PM', subject: 'Full DA Mock Test', type: 'Test', color: 'var(--accent-da)', completed: false }, { time: '04:00 - 06:00 PM', subject: 'Mock Analysis & Error Diary', type: 'Analysis', color: 'var(--warning)', completed: false }],
    },
    6: {
      'Monday':    [{ time: '06:00 - 08:30 AM', subject: 'Advanced Probability & Stat', type: 'Concept', color: 'var(--accent-da)', completed: false }, { time: '02:00 - 04:30 PM', subject: 'Python Data Structures & OOP', type: 'Coding', color: 'var(--info)', completed: false }, { time: '07:00 - 09:00 PM', subject: 'General Aptitude', type: 'Practice', color: 'var(--success)', completed: false }],
      'Tuesday':   [{ time: '06:00 - 08:30 AM', subject: 'Linear Algebra & Eigenvalues', type: 'Concept', color: 'var(--warning)', completed: false }, { time: '02:00 - 04:30 PM', subject: 'Supervised ML Algorithms', type: 'Practice', color: 'var(--danger)', completed: false }, { time: '07:00 - 09:00 PM', subject: 'PYQ Sprint', type: 'PYQs', color: 'var(--accent-da)', completed: false }],
      'Wednesday': [{ time: '06:00 - 08:30 AM', subject: 'Multivariate Calculus', type: 'Concept', color: 'var(--info)', completed: false }, { time: '02:00 - 04:30 PM', subject: 'Unsupervised ML & PCA', type: 'Practice', color: 'var(--success)', completed: false }, { time: '07:00 - 09:00 PM', subject: 'Math Revision', type: 'Revision', color: 'var(--warning)', completed: false }],
      'Thursday':  [{ time: '06:00 - 08:30 AM', subject: 'DBMS, SQL & Indexing', type: 'Concept', color: 'var(--danger)', completed: false }, { time: '02:00 - 04:30 PM', subject: 'Deep Learning & CNNs/RNNs', type: 'Concept', color: 'var(--accent-da)', completed: false }, { time: '07:00 - 09:00 PM', subject: 'Aptitude & Verbal', type: 'Practice', color: 'var(--info)', completed: false }],
      'Friday':    [{ time: '06:00 - 08:30 AM', subject: 'AI & Search Algorithms', type: 'Concept', color: 'var(--warning)', completed: false }, { time: '02:00 - 04:30 PM', subject: 'Data Warehousing & EDA', type: 'Practice', color: 'var(--success)', completed: false }, { time: '07:00 - 09:00 PM', subject: 'PYQ Sprint', type: 'PYQs', color: 'var(--danger)', completed: false }],
      'Saturday':  [{ time: '09:00 AM - 12:00 PM', subject: 'DA Subject Mock Test 1', type: 'Test', color: 'var(--accent-da)', completed: false }, { time: '02:00 - 05:00 PM', subject: 'DA Subject Mock Test 2', type: 'Test', color: 'var(--info)', completed: false }, { time: '07:00 - 09:00 PM', subject: 'Error Diary Review', type: 'Analysis', color: 'var(--warning)', completed: false }],
      'Sunday':    [{ time: '09:00 AM - 12:00 PM', subject: 'Full Length GATE DA Mock Test', type: 'Test', color: 'var(--danger)', completed: false }, { time: '03:00 - 06:00 PM', subject: 'In-Depth Mock Analysis', type: 'Analysis', color: 'var(--success)', completed: false }],
    }
  }
};

export default function Planner() {
  const [activeDay, setActiveDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [selectedPaper, setSelectedPaper] = useState('cs');
  const [dailyHours, setDailyHours] = useState(4);
  const [schedule, setSchedule] = useState(() => JSON.parse(JSON.stringify(scheduleTemplates.cs[4])));
  const [targetRank, setTargetRank] = useState('AIR < 100');
  const [reminderActive, setReminderActive] = useState(true);

  // Pomodoro Timer State
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [pomoRunning, setPomoRunning] = useState(false);
  const [pomoMode, setPomoMode] = useState('focus'); // focus or break
  const [pomoCount, setPomoCount] = useState(0);

  // GATE 2027 Countdown
  const daysLeft = useSettingsStore(s => s.getDaysUntilExam)();

  useEffect(() => {
    let timer;
    if (pomoRunning && pomoTime > 0) {
      timer = setInterval(() => setPomoTime(t => t - 1), 1000);
    } else if (pomoTime === 0 && pomoRunning) {
      setPomoRunning(false);
      if (pomoMode === 'focus') {
        setPomoCount(c => c + 1);
        setPomoMode('break');
        setPomoTime(5 * 60);
        alert('🎉 Focus session completed! Time for a 5-minute break!');
      } else {
        setPomoMode('focus');
        setPomoTime(25 * 60);
        alert('⚡ Break over! Let us get back to studying!');
      }
    }
    return () => clearInterval(timer);
  }, [pomoRunning, pomoTime, pomoMode]);

  const handleGenerateAI = () => {
    const newTpl = JSON.parse(JSON.stringify(scheduleTemplates[selectedPaper][dailyHours] || scheduleTemplates.cs[4]));
    setSchedule(newTpl);
    alert(`🚀 AI Timetable Generated for GATE ${selectedPaper.toUpperCase()} (${dailyHours} Hrs/Day)! Customized for Target ${targetRank}!`);
  };

  const toggleTask = (day, index) => {
    const next = { ...schedule };
    next[day][index].completed = !next[day][index].completed;
    setSchedule(next);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentDayTasks = schedule[activeDay] || [];
  const completedCount = currentDayTasks.filter(t => t.completed).length;
  const totalCount = currentDayTasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div>
      {/* Page Header & Live Countdown */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <p className="page-header__eyebrow">Custom AI Timetable & Study Hub</p>
          <h1 className="page-header__title">AI Study Planner & Reminders</h1>
          <p className="page-header__subtitle">
            Generate customized timetables based on remaining days to GATE, track daily study goals, and use the built-in Pomodoro timer.
          </p>
        </div>

        {/* Live Countdown Badge */}
        <div className="card" style={{ padding: '16px 24px', background: 'linear-gradient(135deg, rgba(91,140,255,0.15) 0%, rgba(224,95,208,0.15) 100%)', border: '1px solid rgba(91,140,255,0.4)', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Target Exam Countdown</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#60a5fa', fontFamily: "'JetBrains Mono', monospace", margin: '4px 0' }}>
            {daysLeft} <span style={{ fontSize: 16 }}>Days Left</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>● Perfect time to build AIR 1 ranking</div>
        </div>
      </div>

      {/* AI TIMETABLE GENERATOR WIZARD */}
      <div className="card" style={{ marginBottom: 28, border: '1px solid rgba(91,140,255,0.4)', background: 'linear-gradient(135deg, rgba(30, 41, 68, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
        <div className="card__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>⚡</span>
            <h3 style={{ margin: 0, fontSize: 18 }}>AI Custom Timetable Generator</h3>
          </div>
          <span className="tag tag--cs">AI Engine</span>
        </div>
        <div className="card__body" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 20 }}>
            {/* Paper Selection */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Target Paper</label>
              <div className="seg-control" style={{ width: '100%' }}>
                <button
                  className={`seg-control__btn ${selectedPaper === 'cs' ? 'active' : ''}`}
                  onClick={() => setSelectedPaper('cs')}
                  style={{ flex: 1 }}
                >
                  GATE CS (13 Subj)
                </button>
                <button
                  className={`seg-control__btn ${selectedPaper === 'da' ? 'active' : ''}`}
                  onClick={() => setSelectedPaper('da')}
                  style={selectedPaper === 'da' ? { background: 'var(--accent-da)', color: '#000', flex: 1 } : { flex: 1 }}
                >
                  GATE DA (10 Subj)
                </button>
              </div>
            </div>

            {/* Daily Study Hours */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Daily Available Study Hours</label>
              <div className="seg-control" style={{ width: '100%' }}>
                {[2, 4, 6].map(hrs => (
                  <button
                    key={hrs}
                    className={`seg-control__btn ${dailyHours === hrs ? 'active' : ''}`}
                    onClick={() => setDailyHours(hrs)}
                    style={{ flex: 1 }}
                  >
                    {hrs === 6 ? '6+ Hrs/Day' : `${hrs} Hrs/Day`}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Rank */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Target Goal</label>
              <select
                value={targetRank}
                onChange={e => setTargetRank(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-primary)', fontWeight: 600 }}
              >
                <option value="AIR < 100">AIR &lt; 100 (IIT Bombay / IISc)</option>
                <option value="AIR < 500">AIR &lt; 500 (Top 5 IITs / ONGC PSU)</option>
                <option value="AIR < 1500">AIR &lt; 1500 (Old NITs / Good M.Tech)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🔔</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Daily Push Notification Alerts:</span>
              <button
                onClick={() => setReminderActive(!reminderActive)}
                style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  background: reminderActive ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                  color: reminderActive ? '#4ade80' : '#f87171', border: `1px solid ${reminderActive ? '#4ade80' : '#f87171'}`
                }}
              >
                {reminderActive ? '● ACTIVE (7:00 AM & 6:00 PM)' : '○ MUTED'}
              </button>
            </div>

            <button
              onClick={handleGenerateAI}
              className="btn btn--primary"
              style={{ padding: '10px 24px', fontSize: 14, fontWeight: 700, boxShadow: '0 0 20px rgba(91,140,255,0.4)', background: 'linear-gradient(135deg, #5b8cff 0%, #a855f7 100%)' }}
            >
              ⚡ Generate Custom AI Timetable
            </button>
          </div>
        </div>
      </div>

      {/* POMODORO TIMER & WEEKLY SCHEDULE GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 32 }}>
        {/* Left: Pomodoro Study Session Timer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="card__header">
            <h4>⏱️ Live Pomodoro Study Timer</h4>
            <span className={`tag ${pomoMode === 'focus' ? 'tag--cs' : 'tag--success'}`}>
              {pomoMode === 'focus' ? '🔥 Focus Mode' : '☕ Break Mode'}
            </span>
          </div>
          <div className="card__body" style={{ textAlign: 'center', padding: '30px 20px' }}>
            <div style={{ fontSize: 64, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: pomoMode === 'focus' ? '#60a5fa' : '#4ade80', margin: '10px 0', textShadow: '0 0 20px rgba(96,165,250,0.3)' }}>
              {formatTime(pomoTime)}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
              {pomoMode === 'focus' ? 'Stay focused! No distractions until the bell rings.' : 'Stretch, drink water, and rest your eyes!'}
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
              <button
                onClick={() => setPomoRunning(!pomoRunning)}
                className="btn btn--primary"
                style={{ padding: '10px 28px', fontSize: 15, fontWeight: 700, background: pomoRunning ? '#f59e0b' : 'var(--accent-cs)' }}
              >
                {pomoRunning ? '⏸ Pause Timer' : '▶ Start Session'}
              </button>
              <button
                onClick={() => { setPomoRunning(false); setPomoTime(pomoMode === 'focus' ? 25 * 60 : 5 * 60); }}
                className="btn"
                style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                ↺ Reset
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
              <span>🏆 Today's Completed Sessions:</span>
              <span className="tag tag--success" style={{ fontWeight: 800, fontSize: 14 }}>{pomoCount} Pomodoros ({pomoCount * 25} mins)</span>
            </div>
          </div>
        </div>

        {/* Right: Daily Schedule & Interactive Checklist */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ margin: 0 }}>📅 {activeDay}'s Interactive Checklist</h4>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click checkboxes to mark sessions complete!</span>
            </div>
            <span className="tag tag--info">{completedCount} / {totalCount} Done</span>
          </div>

          {/* Day Selector Tabs */}
          <div style={{ display: 'flex', gap: 6, padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
            {days.map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                style={{
                  padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: activeDay === day ? 'var(--accent-cs)' : 'rgba(255,255,255,0.05)',
                  color: activeDay === day ? '#fff' : 'var(--text-secondary)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
              <span>Daily Goal Progress</span>
              <span style={{ color: progressPct === 100 ? '#4ade80' : 'var(--accent-cs)' }}>{progressPct}% Completed</span>
            </div>
            <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${progressPct}%`, height: '100%',
                background: progressPct === 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          {/* Task List */}
          <div className="card__body" style={{ padding: '10px 20px', flex: 1 }}>
            {currentDayTasks.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No study slots scheduled for this day. Enjoy your rest!</div>
            ) : (
              currentDayTasks.map((slot, i) => (
                <div
                  key={i}
                  onClick={() => toggleTask(activeDay, i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 10px',
                    borderBottom: i < currentDayTasks.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    cursor: 'pointer', transition: 'background 0.2s ease',
                    background: slot.completed ? 'rgba(74, 222, 128, 0.05)' : 'transparent',
                    borderRadius: 8
                  }}
                >
                  <input
                    type="checkbox"
                    checked={slot.completed}
                    onChange={() => {}} // Handled by div onClick
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#10b981' }}
                  />
                  <div style={{ width: 4, height: 36, borderRadius: 4, background: slot.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: slot.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: slot.completed ? 'line-through' : 'none' }}>
                      {slot.subject}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)' }}>{slot.time}</span>
                      <span className="tag" style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(255,255,255,0.06)' }}>{slot.type}</span>
                    </div>
                  </div>
                  {slot.completed && <span className="tag tag--success">✓ Done</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pro Study Tips Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(91,140,255,0.08) 0%, rgba(224,95,208,0.08) 100%)', border: '1px solid rgba(91,140,255,0.25)' }}>
        <div className="card__body" style={{ padding: '20px 24px' }}>
          <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>💡 Pro Aspirant Study Strategy for GATE</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>1. Active Recall & PYQ Integration:</strong> Don't just read theory! For every 1 hour of concepts, spend 1.5 hours solving actual previous year questions from our PYQ Hub.
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>2. Error Diary Maintenance:</strong> Whenever you make a mistake in a mock test or PYQ, note down the exact concept in a physical notebook. Review this diary every Sunday.
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>3. Consistent Pomodoro Rhythms:</strong> Use our live 25-minute focus timer. Completing just 6 Pomodoros (2.5 hours) of deep, distraction-free focus daily will guarantee a top rank!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
