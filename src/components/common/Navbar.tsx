import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  X,
  Shield,
  Trophy,
  Calendar,
  Users,
  BarChart3,
  Image,
  Newspaper,
  Phone,
  Globe,
  Lock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { DEFAULT_LOGO_SVG } from '../../services/db';

export const Navbar: React.FC = () => {
  const { settings, language, setLanguage, currentRoute, setCurrentRoute, currentUser, isAdmin } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isBn = language === 'bn';

  const navItems = [
    { key: 'home', labelBn: 'হোম', labelEn: 'Home' },
    { key: 'about', labelBn: 'ক্লাব পরিচিতি', labelEn: 'About' },
    { key: 'players', labelBn: 'খেলোয়াড় স্কোয়াড', labelEn: 'Squad' },
    { key: 'lineup', labelBn: 'ম্যাচ লাইনআপ', labelEn: 'Lineup' },
    { key: 'squad-builder', labelBn: 'দল তৈরি করুন', labelEn: 'Squad Builder' },
    { key: 'matches', labelBn: 'ম্যাচ ও ফলাফল', labelEn: 'Fixtures' },
    { key: 'standings', labelBn: 'পয়েন্ট টেবিল', labelEn: 'Standings' },
    { key: 'tournaments', labelBn: 'টুর্নামেন্ট', labelEn: 'Tournaments' },
    { key: 'gallery', labelBn: 'গ্যালারি', labelEn: 'Gallery' },
    { key: 'news', labelBn: 'খবর ও নোটিশ', labelEn: 'News' },
    { key: 'achievements', labelBn: 'অর্জন ও ট্রফি', labelEn: 'Trophies' },
    { key: 'contact', labelBn: 'যোগাযোগ', labelEn: 'Contact' },
  ];

  const handleNavClick = (key: string) => {
    setCurrentRoute(key);
    setMobileMenuOpen(false);
  };

  // Determine logo dimension
  const logoDimensions =
    settings.logoSize === 'small'
      ? 'h-10 w-10 md:h-12 md:w-12'
      : settings.logoSize === 'large'
      ? 'h-14 w-14 md:h-16 md:w-16'
      : 'h-12 w-12 md:h-14 md:w-14';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      {/* Top micro bar for quick club info & admin link */}
      <div className="bg-slate-900/90 border-b border-slate-800/40 px-4 py-1 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-medium">
              <Sparkles className="w-3 h-3" /> {isBn ? 'ঐতিহ্যবাহী ফুটবল ক্লাব' : 'Grassroots Football Pride'}
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="truncate">{settings.tagline}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(isBn ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer text-[11px] font-semibold"
              title="Change Language"
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>{isBn ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Admin entry button */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition cursor-pointer ${
                isAdmin
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>{isAdmin ? (isBn ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal') : (isBn ? 'অ্যাডমিন লগইন' : 'Admin Login')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo and Club Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div className={`relative shrink-0 ${logoDimensions} transition-transform group-hover:scale-105`}>
              <img
                src={settings.logoUrl || DEFAULT_LOGO_SVG}
                alt={settings.clubNameBn}
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-extrabold text-white tracking-tight leading-tight group-hover:text-emerald-400 transition-colors">
                {isBn ? settings.clubNameBn : settings.clubNameEn}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                  {settings.shortName}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {isBn ? `প্রতিষ্ঠা: ${settings.foundingYear}` : `Est. ${settings.foundingYear}`}
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentRoute === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {isBn ? item.labelBn : item.labelEn}
                </button>
              );
            })}
          </nav>

          {/* Quick Match CTA and Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavClick('matches')}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition-all cursor-pointer hover:shadow-emerald-900/50"
            >
              <Calendar className="w-4 h-4" />
              <span>{isBn ? 'ফিক্সচার' : 'Fixtures'}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 animate-fade-in backdrop-blur-xl">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentRoute === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-left transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span>{isBn ? item.labelBn : item.labelEn}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              );
            })}

            <div className="pt-4 mt-2 border-t border-slate-800/80 flex gap-2">
              <button
                onClick={() => handleNavClick('admin')}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{isAdmin ? (isBn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard') : (isBn ? 'অ্যাডমিন লগইন' : 'Admin Login')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
