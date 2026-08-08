// FloodGuard AI / JeevanSetu — Main Application Shell with Mandatory Firebase Auth

import { AppProvider, useApp } from './contexts/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import FloodMap from './components/map/FloodMap';
import RoutePanel from './components/routing/RoutePanel';
import AlertCenter from './components/alerts/AlertCenter';
import CitizenReports from './components/reports/CitizenReports';
import FloodSimulator from './components/simulation/FloodSimulator';
import AIAssistant from './components/assistant/AIAssistant';
import SystemStatus from './components/status/SystemStatus';
import LoginGateway from './components/auth/LoginGateway';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { activePage, currentUser, authLoading } = useApp();

  // Loading state during auth check
  if (authLoading) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-sans">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
        <p className="text-xs font-mono text-slate-400">Verifying Firebase Operator Credentials...</p>
      </div>
    );
  }

  // Mandatory Login Wall — user must be authenticated to access website
  if (!currentUser) {
    return <LoginGateway />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'map': return <FloodMap />;
      case 'routing': return <RoutePanel />;
      case 'alerts': return <AlertCenter />;
      case 'reports': return <CitizenReports />;
      case 'simulation': return <FloodSimulator />;
      case 'assistant': return <AIAssistant />;
      case 'status': return <SystemStatus />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden font-sans bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden flex flex-col">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
