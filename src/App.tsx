import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Players } from './pages/public/Players';
import { Matches } from './pages/public/Matches';
import { Standings } from './pages/public/Standings';
import { Tournaments } from './pages/public/Tournaments';
import { Gallery } from './pages/public/Gallery';
import { News } from './pages/public/News';
import { Achievements } from './pages/public/Achievements';
import { Contact } from './pages/public/Contact';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Shield, Loader2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentRoute, isAdmin, currentUser, loading, settings } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="relative mb-6">
          <img
            src={settings.logoUrl}
            alt="Club Logo"
            className="w-20 h-20 object-contain drop-shadow-2xl animate-pulse"
          />
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm tracking-wider uppercase mb-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>ছোটখাতা স্পোর্টিং ক্লাব</span>
        </div>
        <div className="text-xs text-slate-500">তথ্য লোড হচ্ছে...</div>
      </div>
    );
  }

  // Admin routing
  if (currentRoute === 'admin') {
    if (currentUser && isAdmin) {
      return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
          <AdminDashboard />
          <ToastContainer />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-between">
        <Navbar />
        <AdminLogin />
        <Footer />
        <ToastContainer />
      </div>
    );
  }

  // Public routing
  const renderPublicPage = () => {
    switch (currentRoute) {
      case 'about':
        return <About />;
      case 'players':
        return <Players />;
      case 'matches':
        return <Matches />;
      case 'standings':
        return <Standings />;
      case 'tournaments':
        return <Tournaments />;
      case 'gallery':
        return <Gallery />;
      case 'news':
        return <News />;
      case 'achievements':
        return <Achievements />;
      case 'contact':
        return <Contact />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <main className="flex-1">{renderPublicPage()}</main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
