import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import MobileNav from './components/layout/MobileNav';
import Background3D from './components/layout/Background3D';
import { useSettingsStore } from './stores/useSettingsStore';

import Dashboard from './pages/Dashboard';
import Syllabus from './pages/Syllabus';
import PYQs from './pages/PYQs';
import Resources from './pages/Resources';
import Planner from './pages/Planner';
import Formulas from './pages/Formulas';
import Jobs from './pages/Jobs';
import Updates from './pages/Updates';
import News from './pages/News';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Mocks from './pages/Mocks';
import Calculator from './pages/Calculator';

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
          </div>
        </div>
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}
