import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import MobileNav from './components/layout/MobileNav';
import Background3D from './components/layout/Background3D';
import { useSettingsStore } from './stores/useSettingsStore';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

// Direct imports for lightweight/frequently-visited pages
import Dashboard from './pages/Dashboard';
import Syllabus from './pages/Syllabus';
import PYQs from './pages/PYQs';
import Resources from './pages/Resources';
import Formulas from './pages/Formulas';
import Jobs from './pages/Jobs';
import Updates from './pages/Updates';
import News from './pages/News';
import Settings from './pages/Settings';

// Lazy-load heavy pages for smaller initial bundle
const Planner = lazy(() => import('./pages/Planner'));
const Mocks = lazy(() => import('./pages/Mocks'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Analytics = lazy(() => import('./pages/Analytics'));

function LoadingFallback() {
  return (
    <div className="empty-state" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-pulse" style={{ fontSize: 15, color: 'var(--text-muted)' }}>Loading...</div>
    </div>
  );
}

export default function App() {
  const sidebarCollapsed = useSettingsStore(s => s.sidebarCollapsed);

  return (
    <BrowserRouter>
      <Background3D />
      <div className={`app-layout ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
        <Sidebar />
        <div className="app-layout__main">
          <TopBar />
          <div className="app-layout__content">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/syllabus" element={<Syllabus />} />
                <Route path="/pyqs" element={<PYQs />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/formulas" element={<Formulas />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/updates" element={<Updates />} />
                <Route path="/news" element={<News />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/mocks" element={<Mocks />} />
                <Route path="/calculator" element={<Calculator />} />
              </Routes>
            </Suspense>
          </div>
        </div>
        <MobileNav />
      </div>
      <VercelAnalytics />
    </BrowserRouter>
  );
}
