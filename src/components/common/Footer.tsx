import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Youtube,
  Instagram,
  Shield,
  ArrowUp,
  Heart,
  Lock,
} from 'lucide-react';
import { DEFAULT_LOGO_SVG } from '../../services/db';

export const Footer: React.FC = () => {
  const { settings, language, setCurrentRoute, isAdmin } = useApp();
  const isBn = language === 'bn';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm">
      {/* Top Banner */}
      <div className="bg-emerald-950/40 border-b border-emerald-900/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">
                {isBn ? settings.clubNameBn : settings.clubNameEn}
              </h4>
              <p className="text-emerald-400/90 text-xs font-medium">
                {settings.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentRoute('contact')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950 transition cursor-pointer"
            >
              {isBn ? 'যোগাযোগ করুন' : 'Contact Club'}
            </button>
            <button
              onClick={() => setCurrentRoute('matches')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition cursor-pointer"
            >
              {isBn ? 'ম্যাচ সূচী' : 'Fixtures'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={settings.logoUrl || DEFAULT_LOGO_SVG} alt="Logo" className="w-10 h-10 object-contain" />
              <div>
                <h5 className="text-white font-bold text-base leading-tight">
                  {settings.shortName}
                </h5>
                <span className="text-xs text-slate-500 font-medium">
                  {isBn ? `প্রতিষ্ঠা: ${settings.foundingYear}` : `Est. ${settings.foundingYear}`}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
              {isBn ? settings.history : settings.historyEn || settings.history}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-800"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-800"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-800"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm tracking-wider uppercase border-b border-slate-800 pb-2">
              {isBn ? 'প্রয়োজনীয় লিংক' : 'Quick Links'}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentRoute('about')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  {isBn ? 'ক্লাব পরিচিতি ও কমিটি' : 'About & Committee'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('players')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  {isBn ? 'খেলোয়াড় স্কোয়াড' : 'Team Squad & Players'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('matches')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  {isBn ? 'ম্যাচ ও ফলাফল' : 'Matches & Results'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('standings')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  {isBn ? 'পয়েন্ট টেবিল' : 'League Standings'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('achievements')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  {isBn ? 'ট্রফি ও সম্মাননা' : 'Trophies & Honors'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('gallery')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  {isBn ? 'ফটো গ্যালারি' : 'Photo Gallery'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Ground */}
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm tracking-wider uppercase border-b border-slate-800 pb-2">
              {isBn ? 'ঠিকানা ও মাঠ' : 'Contact & Ground'}
            </h5>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">{isBn ? 'হোম গ্রাউন্ড:' : 'Home Ground:'}</span>
                  <span className="text-white font-medium">{settings.homeGround}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-emerald-400 transition">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-emerald-400 transition truncate">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Admin Access & Ground Map */}
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm tracking-wider uppercase border-b border-slate-800 pb-2">
              {isBn ? 'অফিসিয়াল পোর্টাল' : 'Official Portal'}
            </h5>
            <p className="text-xs text-slate-400">
              {isBn
                ? 'ক্লাবের ওয়েবসাইট পরিচালনা, স্কোরবোর্ড আপডেট এবং নতুন খেলোয়াড় তালিকাভুক্তির জন্য সুরক্ষিত অ্যাডমিন প্যানেলে লগইন করুন।'
                : 'Authorized club officials can log into the administration portal to update scores, rosters, banners, and settings.'}
            </p>
            <button
              onClick={() => setCurrentRoute('admin')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{isAdmin ? (isBn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Open Admin Dashboard') : (isBn ? 'ক্লাব অ্যাডমিন লগইন' : 'Official Admin Login')}</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright & Scroll to top */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-500 text-center sm:text-left">
            {settings.footerText || `© 2026 ${settings.clubNameBn}. সর্বস্বত্ব সংরক্ষিত।`}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition cursor-pointer"
          >
            <span>{isBn ? 'উপরে ফিরুন' : 'Back to Top'}</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
