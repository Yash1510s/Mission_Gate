import { useState } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useProgressStore } from '../stores/useProgressStore';

export default function Settings() {
  const examDate = useSettingsStore(s => s.examDate);
  const setExamDate = useSettingsStore(s => s.setExamDate);
  const userName = useSettingsStore(s => s.userName);
  const setUserName = useSettingsStore(s => s.setUserName);
  const resetAll = useProgressStore(s => s.resetAll);
  const checked = useProgressStore(s => s.checked);

  const [resetConfirm, setResetConfirm] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [syncCode, setSyncCode] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleReset = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
      return;
    }
    resetAll();
    setResetConfirm(false);
  };

  const handleCopyCode = () => {
    const data = {
      progress: localStorage.getItem('gate-prep-companion-progress'),
      settings: localStorage.getItem('gate-prep-companion-settings'),
      timestamp: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(data));
    setExportStatus('✨ Magic Sync Code copied to clipboard! Paste it into WhatsApp/Telegram and send to your phone!');
    setTimeout(() => setExportStatus(''), 5000);
  };

  const handleRestoreCode = () => {
    if (!syncCode.trim()) {
      setExportStatus('⚠️ Please paste your Magic Sync Code first!');
      setTimeout(() => setExportStatus(''), 3000);
      return;
    }
    try {
      const data = JSON.parse(syncCode.trim());
      if (data.progress) localStorage.setItem('gate-prep-companion-progress', data.progress);
      if (data.settings) localStorage.setItem('gate-prep-companion-settings', data.settings);
      setExportStatus('🎉 Progress synced successfully! Reloading screen...');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setExportStatus('❌ Invalid Sync Code! Make sure you copied the exact text from WhatsApp.');
      setTimeout(() => setExportStatus(''), 4000);
    }
  };

  const handleExport = () => {
    const data = {
      progress: localStorage.getItem('gate-prep-companion-progress'),
      settings: localStorage.getItem('gate-prep-companion-settings'),
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gate-prep-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportStatus('📦 Backup file downloaded successfully!');
    setTimeout(() => setExportStatus(''), 3000);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (data.progress) localStorage.setItem('gate-prep-companion-progress', data.progress);
        if (data.settings) localStorage.setItem('gate-prep-companion-settings', data.settings);
        setExportStatus('Backup restored! Refreshing...');
        setTimeout(() => window.location.reload(), 1000);
      } catch {
        setExportStatus('Invalid backup file!');
        setTimeout(() => setExportStatus(''), 2000);
      }
    };
    reader.readAsText(file);
  };

  const totalChecked = Object.keys(checked).filter(k => checked[k]).length;

  return (
    <div>
      <div className="page-header">
        <p className="page-header__eyebrow">Preferences</p>
        <h1 className="page-header__title">Settings</h1>
        <p className="page-header__subtitle">
          Customize your GATE Prep Companion experience.
        </p>
      </div>

      {/* Profile Section */}
      <h3 style={{ marginBottom: 14 }}>👤 Profile</h3>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card__body">
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              style={{
                background: 'var(--glass)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)', padding: '10px 16px',
                color: 'var(--text-primary)', fontSize: 15, width: '100%', maxWidth: 400,
                outline: 'none', transition: 'border-color 0.2s ease',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-cs)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>
        </div>
      </div>

      {/* Exam Settings */}
      <h3 style={{ marginBottom: 14 }}>📅 Exam Settings</h3>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card__body">
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              GATE Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={e => setExamDate(e.target.value)}
              style={{
                background: 'var(--glass)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)', padding: '10px 16px',
                color: 'var(--text-primary)', fontSize: 15, maxWidth: 250,
                outline: 'none', colorScheme: 'dark',
              }}
            />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              Set your target exam date. This affects the countdown timer.
            </p>
          </div>
        </div>
      </div>

      {/* Save & Confirm Settings Action Bar */}
      <div className="card" style={{ marginBottom: 28, padding: '18px 22px', background: saveSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)', border: saveSuccess ? '1px solid #10b981' : '1px solid var(--glass-border)', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: 16, color: saveSuccess ? '#4ade80' : 'var(--text-primary)' }}>
            {saveSuccess ? '✅ Settings Confirmed & Saved!' : '💾 Confirm Your Preferences'}
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            {saveSuccess ? 'Your Name and Exam Date have been updated across all dashboards & timers.' : 'Click to save changes and update across all pages.'}
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          style={{
            background: saveSuccess ? '#10b981' : 'var(--accent-cs)',
            color: saveSuccess ? '#fff' : '#000',
            fontWeight: 800,
            fontSize: 14,
            padding: '10px 24px',
            borderRadius: 20,
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: saveSuccess ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'var(--shadow-glow-cs)',
            transition: 'all 0.2s ease',
          }}
        >
          <span>{saveSuccess ? '✓ Saved Successfully' : '💾 Save Changes'}</span>
        </button>
      </div>


      {/* Cross-Device Cloud Sync & Backup */}
      <h3 style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>📱☁️</span> Cross-Device Sync & Backup (Laptop ↔ Phone)
      </h3>
      <div className="card card--glow-da" style={{ marginBottom: 24, border: '1px solid rgba(192, 132, 252, 0.3)' }}>
        <div className="card__body">
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            Want to show your <strong style={{ color: 'var(--text-primary)' }}>{totalChecked} completed topics</strong> to your professor or study on your phone while traveling? Use our instant cross-device transfer!
          </p>

          {/* Method 1: WhatsApp / Telegram Magic Sync Code */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 12, marginBottom: 16, borderLeft: '3px solid #c084fc' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#c084fc', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>⚡</span> Method 1: Instant WhatsApp / Telegram Sync Code (Easiest!)
            </h4>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              Click button below on your laptop to copy your Magic Sync Code, send it to your WhatsApp/Telegram, and paste it below on your phone!
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
              <button
                className="btn"
                onClick={handleCopyCode}
                style={{ background: 'var(--gradient-primary)', border: 'none', fontWeight: 600 }}
              >
                📋 Copy Magic Sync Code
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="🔑 Paste your Magic Sync Code here from WhatsApp..."
                value={syncCode}
                onChange={(e) => setSyncCode(e.target.value)}
                style={{
                  flex: 1, minWidth: 260, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)', borderRadius: 8,
                  padding: '8px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none'
                }}
              />
              <button
                className="btn"
                onClick={handleRestoreCode}
                style={{ background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.4)', fontWeight: 600 }}
              >
                ⚡ Restore On This Device
              </button>
            </div>
          </div>

          {/* Method 2: Backup File Download / Upload */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: 14, borderRadius: 12, marginBottom: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
              📦 Method 2: Backup File (.json) Download & Restore
            </h4>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn" onClick={handleExport} style={{ fontSize: 12, padding: '6px 14px' }}>
                📤 Download Backup File (.json)
              </button>

              <label className="btn" style={{ cursor: 'pointer', fontSize: 12, padding: '6px 14px', background: 'rgba(255,255,255,0.08)' }}>
                📥 Restore From File (.json)
                <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {exportStatus && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(74, 222, 128, 0.15)', border: '1px solid rgba(74, 222, 128, 0.3)', color: '#4ade80', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
              {exportStatus}
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 16, marginTop: 8 }}>
            <button
              className="btn btn--danger"
              onClick={handleReset}
              style={resetConfirm ? { background: 'var(--danger-soft)' } : { fontSize: 12, padding: '6px 14px' }}
            >
              {resetConfirm ? '⚠️ Click again to confirm reset' : '🗑️ Reset All Progress'}
            </button>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
              This will clear all your syllabus progress, notes, and study data on this device. This action cannot be undone!
            </p>
          </div>
        </div>
      </div>

      {/* About */}
      <h3 style={{ marginBottom: 14 }}>ℹ️ About</h3>
      <div className="card">
        <div className="card__body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: '0 4px 16px rgba(91,140,255,0.25)',
            }}>🎯</div>
            <div>
              <div style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 18 }}>
                GATE Prep Companion
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                v1.0.0 • Built with ❤️ by Yash Vijay Singh
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            A comprehensive, free, and open-source platform for GATE preparation.
            Covers CS & DA papers with syllabus tracking, PYQs, free resources, formula sheets,
            job opportunities, study planner, analytics, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
