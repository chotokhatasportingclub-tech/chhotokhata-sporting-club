import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  SiteSettings,
  Banner,
  HomepageSection,
  Player,
  Team,
  Match,
  Tournament,
  Standing,
  GalleryMedia,
  NewsArticle,
  Achievement,
  Sponsor,
  ContactMessage,
  AdminUser,
} from '../../types';
import {
  saveSiteSettings,
  saveBanner,
  deleteBanner,
  saveHomepageSections,
  savePlayer,
  deletePlayer,
  saveTeam,
  deleteTeam,
  saveMatch,
  deleteMatch,
  saveTournament,
  deleteTournament,
  saveStanding,
  deleteStanding,
  saveGalleryMedia,
  deleteGalleryMedia,
  saveNews,
  deleteNews,
  saveAchievement,
  deleteAchievement,
  saveSponsor,
  deleteSponsor,
  updateContactMessageStatus,
  deleteContactMessage,
  fetchContactMessages,
  addAdminUser,
  removeAdminUser,
  fetchAuditLogs,
  DEFAULT_SETTINGS,
  DEFAULT_SECTIONS,
  DEFAULT_BANNERS,
  DEFAULT_PLAYERS,
  DEFAULT_MATCHES,
  DEFAULT_STANDINGS,
  DEFAULT_TOURNAMENTS,
  DEFAULT_NEWS,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_SPONSORS,
  DEFAULT_GALLERY,
} from '../../services/db';
import { ImageUploader } from '../../components/common/ImageUploader';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  LayoutDashboard,
  Settings,
  Image as ImageIcon,
  Sliders,
  Palette,
  Layers,
  Eye,
  Users,
  Shield,
  Calendar,
  Trophy,
  BarChart3,
  Camera,
  Newspaper,
  Award,
  Briefcase,
  Mail,
  UserCheck,
  Database,
  History,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Flame,
  Globe,
  Upload,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    settings,
    updateSettingsState,
    banners,
    sections,
    players,
    teams,
    matches,
    tournaments,
    standings,
    gallery,
    news,
    achievements,
    sponsors,
    adminUsers,
    currentUser,
    logout,
    refreshAllData,
    showToast,
    setCurrentRoute,
    seedInitialDatabase,
    language,
  } = useApp();

  const isBn = language === 'bn';

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Forms state for settings
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...settings });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Editing Modals / Forms
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [editingStanding, setEditingStanding] = useState<Standing | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryMedia | null>(null);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Messages state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Confirm Modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Sync settings form when global settings change
  React.useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  // Load contact messages when tab opened
  React.useEffect(() => {
    if (activeTab === 'messages') {
      loadMessages();
    } else if (activeTab === 'logs') {
      loadLogs();
    }
  }, [activeTab]);

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const msgs = await fetchContactMessages();
      setContactMessages(msgs);
    } catch (err) {
      console.warn('Could not fetch contact messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadLogs = async () => {
    setLoadingLogs(true);
    try {
      const logs = await fetchAuditLogs(40);
      setAuditLogs(logs);
    } catch (err) {
      console.warn('Could not fetch audit logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Save Settings handler
  const handleSaveSettings = async (customSettings?: Partial<SiteSettings>) => {
    setIsSavingSettings(true);
    try {
      const toSave = customSettings ? { ...settingsForm, ...customSettings } : settingsForm;
      await saveSiteSettings(toSave);
      updateSettingsState(toSave);
      showToast('ওয়েবসাইট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!', 'success');
    } catch (err: any) {
      showToast(`সংরক্ষণে ত্রুটি: ${err.message}`, 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Reorder homepage section
  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections].sort((a, b) => a.order - b.order);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    // Swap order
    const tempOrder = newSections[index].order;
    newSections[index].order = newSections[targetIndex].order;
    newSections[targetIndex].order = tempOrder;

    try {
      await saveHomepageSections(newSections);
      await refreshAllData();
      showToast('সেকশন ক্রম সফলভাবে সংরক্ষিত!', 'success');
    } catch (err: any) {
      showToast(`ত্রুটি: ${err.message}`, 'error');
    }
  };

  // Toggle homepage section visibility
  const handleToggleSectionVisibility = async (secId: string, isVisible: boolean) => {
    const updated = sections.map((s) => (s.id === secId ? { ...s, isVisible } : s));
    try {
      await saveHomepageSections(updated);
      await refreshAllData();
      showToast('সেকশন দৃশ্যমানতা পরিবর্তিত হয়েছে', 'info');
    } catch (err: any) {
      showToast(`ত্রুটি: ${err.message}`, 'error');
    }
  };

  // Auto calculate standings from matches
  const handleAutoCalculateStandings = async () => {
    const completedMatches = matches.filter((m) => m.status === 'Completed');
    if (completedMatches.length === 0) {
      showToast('হিসাব করার জন্য কোনো সমাপ্ত ম্যাচ পাওয়া যায়নি', 'info');
      return;
    }

    const map = new Map<string, { played: number; won: number; drawn: number; lost: number; gf: number; ga: number; pts: number }>();

    for (const m of completedMatches) {
      const hName = m.homeTeamName;
      const aName = m.awayTeamName;
      const hScore = m.homeScore ?? 0;
      const aScore = m.awayScore ?? 0;

      if (!map.has(hName)) map.set(hName, { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 });
      if (!map.has(aName)) map.set(aName, { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 });

      const hStats = map.get(hName)!;
      const aStats = map.get(aName)!;

      hStats.played += 1;
      aStats.played += 1;
      hStats.gf += hScore;
      hStats.ga += aScore;
      aStats.gf += aScore;
      aStats.ga += hScore;

      if (hScore > aScore) {
        hStats.won += 1;
        hStats.pts += 3;
        aStats.lost += 1;
      } else if (aScore > hScore) {
        aStats.won += 1;
        aStats.pts += 3;
        hStats.lost += 1;
      } else {
        hStats.drawn += 1;
        aStats.drawn += 1;
        hStats.pts += 1;
        aStats.pts += 1;
      }
    }

    // Save standings
    try {
      let pos = 1;
      const sortedTeams = Array.from(map.entries()).sort((a, b) => {
        if (b[1].pts !== a[1].pts) return b[1].pts - a[1].pts;
        const gdB = b[1].gf - b[1].ga;
        const gdA = a[1].gf - a[1].ga;
        return gdB - gdA;
      });

      for (const [teamName, stats] of sortedTeams) {
        const id = `st_${teamName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        await saveStanding({
          id,
          tournamentName: completedMatches[0].tournamentName || 'চ্যাম্পিয়নশিপ',
          teamName,
          position: pos++,
          played: stats.played,
          won: stats.won,
          drawn: stats.drawn,
          lost: stats.lost,
          goalsFor: stats.gf,
          goalsAgainst: stats.ga,
          goalDifference: stats.gf - stats.ga,
          points: stats.pts,
        });
      }

      await refreshAllData();
      showToast('ম্যাচ ফলাফল থেকে সফলভাবে পয়েন্ট টেবিল প্রস্তুত করা হয়েছে!', 'success');
    } catch (err: any) {
      showToast(`হিসাবে ত্রুটি: ${err.message}`, 'error');
    }
  };

  // Export full JSON database
  const handleExportData = () => {
    const fullBackup = {
      settings,
      banners,
      sections,
      players,
      teams,
      matches,
      tournaments,
      standings,
      gallery,
      news,
      achievements,
      sponsors,
      exportedAt: new Date().toISOString(),
      club: 'Chhotokhata Sporting Club',
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chhotokhata_sc_database_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('সম্পূর্ণ ক্লাব ডেটাবেজ ব্যাকআপ ফাইল ডাউনলোড হয়েছে', 'success');
  };

  // Nav items configuration for sidebar
  const adminNav = [
    { key: 'overview', label: 'ড্যাশবোর্ড সারসংক্ষেপ', icon: LayoutDashboard },
    { key: 'visual_builder', label: 'ভিজ্যুয়াল সাইট এডিটর', icon: Eye, badge: 'Live' },
    { key: 'settings', label: 'সাধারণ ওয়েবসাইট সেটিংস', icon: Settings },
    { key: 'branding', label: 'লোগো ও ব্র্যান্ডিং', icon: ImageIcon },
    { key: 'banners', label: 'হিরো ব্যানার স্লাইডার', icon: Sliders },
    { key: 'theme', label: 'থিম ও কালার স্কিম', icon: Palette },
    { key: 'sections', label: 'হোমপেজ সেকশন নিয়ন্ত্রণ', icon: Layers },
    { key: 'players', label: 'খেলোয়াড় স্কোয়াড (CRUD)', icon: Users },
    { key: 'matches', label: 'ম্যাচ ও ফলাফল', icon: Calendar },
    { key: 'standings', label: 'পয়েন্ট টেবিল', icon: BarChart3 },
    { key: 'tournaments', label: 'টুর্নামেন্ট সমূহ', icon: Trophy },
    { key: 'teams', label: 'প্রতিপক্ষ ও ক্লাব দল', icon: Shield },
    { key: 'gallery', label: 'ফটো ও মিডিয়া গ্যালারি', icon: Camera },
    { key: 'news', label: 'খবর ও নোটিশ', icon: Newspaper },
    { key: 'achievements', label: 'ট্রফি ও সম্মাননা', icon: Award },
    { key: 'sponsors', label: 'স্পন্সর ও পার্টনার', icon: Briefcase },
    { key: 'messages', label: 'অনুসন্ধান বার্তা', icon: Mail },
    { key: 'admins', label: 'অ্যাডমিন ইউজার', icon: UserCheck },
    { key: 'backup', label: 'ব্যাকআপ ও রিসেট', icon: Database },
    { key: 'logs', label: 'অডিট লগ', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Admin Action Header */}
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <img src={settings.logoUrl} alt="" className="w-8 h-8 object-contain" />
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              {settings.shortName} অ্যাডমিন প্যানেল
            </h2>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ক্লাউড ফায়ারস্টোর কানেক্টেড</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentRoute('home')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>পাবলিক ওয়েবসাইট</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 backdrop-blur-xl ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-60px)] space-y-1">
            <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-500">
              ম্যানেজমেন্ট মেনু
            </div>
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-slate-950 uppercase">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400">
            <div className="truncate font-semibold text-white">{currentUser?.email}</div>
            <div className="text-[11px] text-emerald-400">সুপার অ্যাডমিন ভূমিকা</div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* 1. OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white">
                      ক্লাব অ্যাডমিন কন্ট্রোল প্যানেল
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {settings.clubNameBn} এর সমস্ত তথ্য ও কার্যক্রম পরিচালনার সার্বিক পরিসংখ্যান।
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('visual_builder')}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>ভিজ্যুয়াল সাইট এডিটর</span>
                    </button>
                    <button
                      onClick={refreshAllData}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
                      title="রিফ্রেশ করুন"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-semibold">খেলোয়াড় স্কোয়াড</span>
                      <Users className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">{players.length}</div>
                    <div className="text-[11px] text-emerald-400 mt-1">সক্রিয় নিবন্ধিত</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-semibold">আসন্ন ফিক্সচার</span>
                      <Calendar className="w-4 h-4 text-sky-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {matches.filter((m) => m.status === 'Upcoming' || m.status === 'Live').length}
                    </div>
                    <div className="text-[11px] text-sky-400 mt-1">তফসিলভুক্ত ম্যাচ</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-semibold">সমাপ্ত ম্যাচ রেজাল্ট</span>
                      <Trophy className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {matches.filter((m) => m.status === 'Completed').length}
                    </div>
                    <div className="text-[11px] text-amber-400 mt-1">রেকর্ড সংরক্ষিত</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-semibold">প্রকাশিত খবর</span>
                      <Newspaper className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white">{news.length}</div>
                    <div className="text-[11px] text-purple-400 mt-1">আর্টিকেল ও নোটিশ</div>
                  </div>
                </div>

                {/* Quick Action Shortcuts */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                    দ্রুত ব্যবস্থাপনা শর্টকাট
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => setActiveTab('players')}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left transition cursor-pointer"
                    >
                      <Users className="w-5 h-5 text-emerald-400 mb-2" />
                      <div className="text-xs font-bold text-white">নতুন খেলোয়াড় যুক্ত</div>
                      <div className="text-[10px] text-slate-500">প্রোফাইল ও ছবি আপলোড</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('matches')}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left transition cursor-pointer"
                    >
                      <Calendar className="w-5 h-5 text-sky-400 mb-2" />
                      <div className="text-xs font-bold text-white">ম্যাচ স্কোর আপডেট</div>
                      <div className="text-[10px] text-slate-500">লাইভ ও সম্পন্ন ফলাফল</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('banners')}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left transition cursor-pointer"
                    >
                      <Sliders className="w-5 h-5 text-amber-400 mb-2" />
                      <div className="text-xs font-bold text-white">হিরো ব্যানার পরিবর্তন</div>
                      <div className="text-[10px] text-slate-500">মোবাইল ও পিসি ব্যানার</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left transition cursor-pointer"
                    >
                      <Settings className="w-5 h-5 text-purple-400 mb-2" />
                      <div className="text-xs font-bold text-white">ওয়েবসাইট কাস্টমাইজ</div>
                      <div className="text-[10px] text-slate-500">নাম, ঠিকানা ও ব্র্যান্ডিং</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. VISUAL WEBSITE BUILDER */}
            {activeTab === 'visual_builder' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-bold text-xs uppercase mb-1">
                      <Eye className="w-3.5 h-3.5" /> Visual Website Editor
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white">ভিজ্যুয়াল ওয়েবসাইট বিল্ডার</h1>
                    <p className="text-xs text-slate-400 mt-1">
                      কোডিং ছাড়াই যেকোনো সেকশনের শিরোনাম পরিবর্তন করুন, ছবি আপলোড করুন, সেকশনের ক্রম সাজান ও তাৎক্ষণিক প্রকাশ করুন।
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSaveSettings()}
                      disabled={isSavingSettings}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl transition cursor-pointer flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingSettings ? 'সংরক্ষিত হচ্ছে...' : 'পরিবর্তন প্রকাশ করুন (Publish)'}</span>
                    </button>
                  </div>
                </div>

                {/* Section toggles and live controls */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Homepage Section Manager */}
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
                      <span>হোমপেজ সেকশন তালিকা ও ক্রম</span>
                      <span className="text-xs text-slate-500 font-normal">উপরে/নিচে সরান বা বন্ধ করুন</span>
                    </h3>

                    <div className="space-y-3">
                      {[...sections]
                        .sort((a, b) => a.order - b.order)
                        .map((sec, idx) => (
                          <div
                            key={sec.id}
                            className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                              sec.isVisible
                                ? 'bg-slate-900 border-slate-800'
                                : 'bg-slate-950/60 border-slate-800/40 opacity-60'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <div>
                                <h4 className="text-sm font-bold text-white">{sec.titleBn}</h4>
                                <div className="text-[11px] text-slate-500">{sec.titleEn}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Move buttons */}
                              <button
                                onClick={() => handleMoveSection(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white cursor-pointer"
                                title="উপরে তুলুন"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveSection(idx, 'down')}
                                disabled={idx === sections.length - 1}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white cursor-pointer"
                                title="নিচে নামান"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>

                              {/* Visibility Toggle */}
                              <button
                                onClick={() => handleToggleSectionVisibility(sec.id, !sec.isVisible)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                  sec.isVisible
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {sec.isVisible ? 'দৃশ্যমান' : 'লুকানো'}
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Right Column: Instant Live Customizer */}
                  <div className="lg:col-span-6 space-y-6 bg-slate-900 border border-slate-800 rounded-3xl p-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                      তাৎক্ষণিক টেক্সট ও ব্র্যান্ডিং এডিটর
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        ক্লাবের পূর্ণ বাংলা নাম:
                      </label>
                      <input
                        type="text"
                        value={settingsForm.clubNameBn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, clubNameBn: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Club Name in English:
                      </label>
                      <input
                        type="text"
                        value={settingsForm.clubNameEn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, clubNameEn: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        প্রধান স্লোগান (Tagline):
                      </label>
                      <input
                        type="text"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <ImageUploader
                        label="ক্লাবের অফিসিয়াল লোগো পরিবর্তন:"
                        value={settingsForm.logoUrl}
                        onChange={(url) => setSettingsForm({ ...settingsForm, logoUrl: url })}
                        folder="club_branding"
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => handleSaveSettings()}
                        className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
                      >
                        পরিবর্তনগুলো সেভ করুন
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. GENERAL WEBSITE SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">সাধারণ ওয়েবসাইট সেটিংস</h2>
                    <p className="text-xs text-slate-400">
                      ক্লাবের নাম, পরিচিতি, ইতিহাস, লক্ষ্য, উদ্দেশ্য ও যোগাযোগ তথ্য সম্পাদনা করুন।
                    </p>
                  </div>
                  <button
                    onClick={() => handleSaveSettings()}
                    disabled={isSavingSettings}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingSettings ? 'সেভ হচ্ছে...' : 'সেভ করুন'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      ক্লাবের নাম (বাংলায়)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.clubNameBn}
                      onChange={(e) => setSettingsForm({ ...settingsForm, clubNameBn: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Club Name (English)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.clubNameEn}
                      onChange={(e) => setSettingsForm({ ...settingsForm, clubNameEn: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      সংক্ষিপ্ত নাম (Short Name)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.shortName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, shortName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      প্রতিষ্ঠার বছর / সাল
                    </label>
                    <input
                      type="text"
                      value={settingsForm.foundingYear}
                      onChange={(e) => setSettingsForm({ ...settingsForm, foundingYear: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      প্রধান স্লোগান (Tagline)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      ক্লাবের ইতিহাস ও প্রেক্ষাপট
                    </label>
                    <textarea
                      rows={4}
                      value={settingsForm.history}
                      onChange={(e) => setSettingsForm({ ...settingsForm, history: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      লক্ষ্য ও উদ্দেশ্য (Mission)
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.mission}
                      onChange={(e) => setSettingsForm({ ...settingsForm, mission: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      ভবিষ্যত রূপকল্প (Vision)
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.vision}
                      onChange={(e) => setSettingsForm({ ...settingsForm, vision: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      ফোন নম্বর
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      অফিসিয়াল ইমেইল
                    </label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      ক্লাবের ঠিকানা
                    </label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      হোম গ্রাউন্ড স্টেডিয়াম
                    </label>
                    <input
                      type="text"
                      value={settingsForm.homeGround}
                      onChange={(e) => setSettingsForm({ ...settingsForm, homeGround: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Google Maps লিংক
                    </label>
                    <input
                      type="url"
                      value={settingsForm.mapsUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, mapsUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Facebook পেজ লিংক
                    </label>
                    <input
                      type="url"
                      value={settingsForm.facebookUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      YouTube চ্যানেল লিংক
                    </label>
                    <input
                      type="url"
                      value={settingsForm.youtubeUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      ফুটার কপিরাইট টেক্সট
                    </label>
                    <input
                      type="text"
                      value={settingsForm.footerText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. LOGO AND BRANDING */}
            {activeTab === 'branding' && (
              <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">ক্লাব লোগো ও ব্র্যান্ডিং</h2>
                    <p className="text-xs text-slate-400">
                      ক্লাবের নতুন লোগো আপলোড বা পরিবর্তন করুন। এটি সম্পূর্ণ ওয়েবসাইটে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে।
                    </p>
                  </div>
                  <button
                    onClick={() => handleSaveSettings()}
                    disabled={isSavingSettings}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>লোগো সংরক্ষণ করুন</span>
                  </button>
                </div>

                <div className="max-w-xl mx-auto space-y-6">
                  <ImageUploader
                    label="ক্লাবের লোগো ফাইল আপলোড করুন (PNG, SVG, WebP)"
                    value={settingsForm.logoUrl}
                    onChange={(url) => setSettingsForm({ ...settingsForm, logoUrl: url })}
                    folder="logos"
                    aspectHint="স্বচ্ছ ব্যাকগ্রাউন্ডের (Transparent PNG/SVG) লোগো সুপারিশকৃত"
                  />

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      লোগো প্রদর্শন সাইজ (Display Size)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['small', 'medium', 'large'] as const).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, logoSize: size })}
                          className={`py-3 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                            settingsForm.logoSize === size
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-slate-950 text-slate-400 hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview across header */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-xs font-semibold text-slate-400 block mb-2">
                      ওয়েবসাইট হেডারে প্রিভিউ:
                    </span>
                    <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <img src={settingsForm.logoUrl} alt="" className="h-12 w-12 object-contain" />
                      <div>
                        <div className="text-sm font-bold text-white">{settingsForm.clubNameBn}</div>
                        <div className="text-xs text-emerald-400">{settingsForm.shortName}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. HERO BANNERS */}
            {activeTab === 'banners' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">হিরো ব্যানার স্লাইডার</h2>
                    <p className="text-xs text-slate-400">
                      হোমপেজের মূল ব্যানার স্লাইড তৈরি, সম্পাদনা ও মোবাইল-অপ্টিমাইজড ব্যানার আপলোড করুন।
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditingBanner({
                        id: `banner_${Date.now()}`,
                        title: 'নতুন ব্যানার স্লাইড',
                        subtitle: 'ব্যানার বিবরণী এখানে লিখুন',
                        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop',
                        primaryButtonText: 'আমাদের দল দেখুন',
                        primaryButtonLink: '#players',
                        textAlignment: 'center',
                        overlayOpacity: 65,
                        order: banners.length + 1,
                        isActive: true,
                      })
                    }
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন ব্যানার যুক্ত করুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {banners.map((b) => (
                    <div
                      key={b.id}
                      className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
                    >
                      <div className="relative aspect-16/9 bg-slate-950">
                        <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-white border border-slate-700">
                          {b.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <h4 className="text-base font-bold text-white">{b.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2">{b.subtitle}</p>
                      </div>

                      <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-500">ক্রম: {b.order}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingBanner({ ...b })}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                          >
                            সম্পাদনা
                          </button>
                          <button
                            onClick={() =>
                              setConfirmConfig({
                                isOpen: true,
                                title: 'ব্যানার মুছে ফেলুন',
                                message: 'আপনি কি নিশ্চিত এই ব্যানার স্লাইডটি মুছে ফেলতে চান?',
                                onConfirm: async () => {
                                  await deleteBanner(b.id);
                                  await refreshAllData();
                                  setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
                                  showToast('ব্যানার মুছে ফেলা হয়েছে', 'info');
                                },
                              })
                            }
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Banner Edit Modal */}
                {editingBanner && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-lg font-bold text-white">ব্যানার স্লাইড সম্পাদনা</h3>
                        <button onClick={() => setEditingBanner(null)} className="text-slate-400 hover:text-white">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <ImageUploader
                        label="ডেস্কটপ ব্যানার ছবি (Desktop Banner 16:9)"
                        value={editingBanner.imageUrl}
                        onChange={(url) => setEditingBanner({ ...editingBanner, imageUrl: url })}
                        folder="banners"
                      />

                      <ImageUploader
                        label="মোবাইল ব্যানার ছবি (ঐচ্ছিক Mobile Banner)"
                        value={editingBanner.mobileImageUrl || ''}
                        onChange={(url) => setEditingBanner({ ...editingBanner, mobileImageUrl: url })}
                        folder="banners_mobile"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">শিরোনাম (Title)</label>
                          <input
                            type="text"
                            value={editingBanner.title}
                            onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">উপশিরোনাম (Subtitle)</label>
                          <input
                            type="text"
                            value={editingBanner.subtitle}
                            onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">বাটন টেক্সট</label>
                          <input
                            type="text"
                            value={editingBanner.primaryButtonText}
                            onChange={(e) =>
                              setEditingBanner({ ...editingBanner, primaryButtonText: e.target.value })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">বাটন লিংক</label>
                          <input
                            type="text"
                            value={editingBanner.primaryButtonLink}
                            onChange={(e) =>
                              setEditingBanner({ ...editingBanner, primaryButtonLink: e.target.value })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">লেখা সাজানো (Align)</label>
                          <select
                            value={editingBanner.textAlignment}
                            onChange={(e) =>
                              setEditingBanner({ ...editingBanner, textAlignment: e.target.value as any })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          >
                            <option value="center">মাঝখানে (Center)</option>
                            <option value="left">বামে (Left)</option>
                            <option value="right">ডানে (Right)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">ডার্ক ওভারলে অপাসিটি (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editingBanner.overlayOpacity}
                            onChange={(e) =>
                              setEditingBanner({ ...editingBanner, overlayOpacity: Number(e.target.value) })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="bannerActive"
                          checked={editingBanner.isActive}
                          onChange={(e) => setEditingBanner({ ...editingBanner, isActive: e.target.checked })}
                          className="w-4 h-4 text-emerald-600 rounded bg-slate-950 border-slate-800"
                        />
                        <label htmlFor="bannerActive" className="text-xs text-white font-medium cursor-pointer">
                          ব্যানারটি ওয়েবসাইটে প্রদর্শন সক্রিয় রাখুন
                        </label>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                        <button
                          onClick={() => setEditingBanner(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs"
                        >
                          বাতিল
                        </button>
                        <button
                          onClick={async () => {
                            await saveBanner(editingBanner);
                            await refreshAllData();
                            setEditingBanner(null);
                            showToast('ব্যানার সফলভাবে সংরক্ষিত হয়েছে!', 'success');
                          }}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          সংরক্ষণ করুন
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. THEME AND COLORS */}
            {activeTab === 'theme' && (
              <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">থিম ও রং নির্বাচন (Colors & Branding)</h2>
                    <p className="text-xs text-slate-400">
                      ওয়েবসাইটের প্রাইমারি, সেকেন্ডারি ও অ্যাকসেন্ট রং পরিবর্তন করুন।
                    </p>
                  </div>
                  <button
                    onClick={() => handleSaveSettings()}
                    disabled={isSavingSettings}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>থিম সংরক্ষণ করুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <label className="block text-xs font-bold text-white">প্রাইমারি কালার (Primary)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settingsForm.primaryColor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={settingsForm.primaryColor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <label className="block text-xs font-bold text-white">সেকেন্ডারি কালার (Football Green)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settingsForm.secondaryColor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, secondaryColor: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={settingsForm.secondaryColor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, secondaryColor: e.target.value })}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <label className="block text-xs font-bold text-white">অ্যাকসেন্ট কালার (Gold/Accent)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settingsForm.accentColor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, accentColor: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={settingsForm.accentColor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, accentColor: e.target.value })}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Palettes */}
                <div className="pt-4 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block mb-3">
                    প্রস্তুতকৃত কালার প্রিসেট নির্বাচন:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setSettingsForm({
                          ...settingsForm,
                          primaryColor: '#071426',
                          secondaryColor: '#16a34a',
                          accentColor: '#eab308',
                        })
                      }
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left cursor-pointer flex items-center gap-3"
                    >
                      <div className="flex -space-x-1">
                        <span className="w-5 h-5 rounded-full bg-[#071426] border border-slate-700" />
                        <span className="w-5 h-5 rounded-full bg-[#16a34a]" />
                        <span className="w-5 h-5 rounded-full bg-[#eab308]" />
                      </div>
                      <span className="text-xs font-bold text-white">ক্লাসিক ফুটবল গ্রিন ও নেভি</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSettingsForm({
                          ...settingsForm,
                          primaryColor: '#0b1329',
                          secondaryColor: '#2563eb',
                          accentColor: '#38bdf8',
                        })
                      }
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left cursor-pointer flex items-center gap-3"
                    >
                      <div className="flex -space-x-1">
                        <span className="w-5 h-5 rounded-full bg-[#0b1329] border border-slate-700" />
                        <span className="w-5 h-5 rounded-full bg-[#2563eb]" />
                        <span className="w-5 h-5 rounded-full bg-[#38bdf8]" />
                      </div>
                      <span className="text-xs font-bold text-white">রয়েল ব্লু স্পোর্টিং</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSettingsForm({
                          ...settingsForm,
                          primaryColor: '#18181b',
                          secondaryColor: '#dc2626',
                          accentColor: '#f97316',
                        })
                      }
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left cursor-pointer flex items-center gap-3"
                    >
                      <div className="flex -space-x-1">
                        <span className="w-5 h-5 rounded-full bg-[#18181b] border border-slate-700" />
                        <span className="w-5 h-5 rounded-full bg-[#dc2626]" />
                        <span className="w-5 h-5 rounded-full bg-[#f97316]" />
                      </div>
                      <span className="text-xs font-bold text-white">প্যাশন রেড ও ব্ল্যাক</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 7. PLAYERS MANAGEMENT */}
            {activeTab === 'players' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">খেলোয়াড় স্কোয়াড ব্যবস্থাপনা</h2>
                    <p className="text-xs text-slate-400">
                      ক্লাবের খেলোয়াড়দের ছবি আপলোড, পজিশন, জার্সি নম্বর ও গোল পরিসংখ্যান আপডেট করুন।
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditingPlayer({
                        id: `player_${Date.now()}`,
                        fullName: '',
                        nameBn: '',
                        jerseyNumber: players.length + 1,
                        position: 'Forward',
                        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
                        bio: '',
                        appearances: 0,
                        goals: 0,
                        assists: 0,
                        cleanSheets: 0,
                        isActive: true,
                        isCaptain: false,
                        order: players.length + 1,
                      })
                    }
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন খেলোয়াড় যোগ করুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {players.map((p) => (
                    <div
                      key={p.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
                    >
                      <div className="relative aspect-4/5 bg-slate-950">
                        <img src={p.photoUrl} alt="" className="w-full h-full object-cover object-top" />
                        <div className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-emerald-600 text-white font-mono font-black text-sm flex items-center justify-center">
                          #{p.jerseyNumber}
                        </div>
                        {p.isCaptain && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[9px]">
                            C
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="text-[10px] text-emerald-400 font-bold block">{p.position}</span>
                          <h4 className="text-sm font-bold text-white truncate">{p.fullName}</h4>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950/60 flex items-center justify-between text-xs">
                        <span className="text-slate-400">{p.goals} গোল • {p.appearances} ম্যাচ</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setEditingPlayer({ ...p })}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmConfig({
                                isOpen: true,
                                title: 'খেলোয়াড় মুছুন',
                                message: `আপনি কি নিশ্চিত ${p.fullName} কে স্কোয়াড থেকে মুছে ফেলতে চান?`,
                                onConfirm: async () => {
                                  await deletePlayer(p.id);
                                  await refreshAllData();
                                  setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
                                  showToast('খেলোয়াড় রেকর্ড মোছা হয়েছে', 'info');
                                },
                              })
                            }
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Player Edit Modal */}
                {editingPlayer && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-lg font-bold text-white">খেলোয়াড়ের তথ্য সম্পাদনা</h3>
                        <button onClick={() => setEditingPlayer(null)} className="text-slate-400 hover:text-white">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <ImageUploader
                        label="খেলোয়াড়ের প্রতিকৃতি ছবি (Player Portrait Photo)"
                        value={editingPlayer.photoUrl}
                        onChange={(url) => setEditingPlayer({ ...editingPlayer, photoUrl: url })}
                        folder="players"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">পূর্ণ নাম (Full Name) *</label>
                          <input
                            type="text"
                            required
                            value={editingPlayer.fullName}
                            onChange={(e) => setEditingPlayer({ ...editingPlayer, fullName: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">বাংলায় নাম (ঐচ্ছিক)</label>
                          <input
                            type="text"
                            value={editingPlayer.nameBn || ''}
                            onChange={(e) => setEditingPlayer({ ...editingPlayer, nameBn: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">জার্সি নম্বর (Jersey No) *</label>
                          <input
                            type="number"
                            required
                            value={editingPlayer.jerseyNumber}
                            onChange={(e) =>
                              setEditingPlayer({ ...editingPlayer, jerseyNumber: Number(e.target.value) })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">খেলার পজিশন *</label>
                          <select
                            value={editingPlayer.position}
                            onChange={(e) => setEditingPlayer({ ...editingPlayer, position: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          >
                            <option value="Goalkeeper">গোলরক্ষক (Goalkeeper)</option>
                            <option value="Defender">ডিফেন্ডার (Defender)</option>
                            <option value="Midfielder">মিডফিল্ডার (Midfielder)</option>
                            <option value="Forward">ফরওয়ার্ড (Forward)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">মোট ম্যাচ (Caps)</label>
                          <input
                            type="number"
                            value={editingPlayer.appearances}
                            onChange={(e) =>
                              setEditingPlayer({ ...editingPlayer, appearances: Number(e.target.value) })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">মোট গোল</label>
                          <input
                            type="number"
                            value={editingPlayer.goals}
                            onChange={(e) =>
                              setEditingPlayer({ ...editingPlayer, goals: Number(e.target.value) })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">অ্যাসিস্ট</label>
                          <input
                            type="number"
                            value={editingPlayer.assists}
                            onChange={(e) =>
                              setEditingPlayer({ ...editingPlayer, assists: Number(e.target.value) })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">ক্লিন শিট (গোলরক্ষকের জন্য)</label>
                          <input
                            type="number"
                            value={editingPlayer.cleanSheets}
                            onChange={(e) =>
                              setEditingPlayer({ ...editingPlayer, cleanSheets: Number(e.target.value) })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 font-semibold mb-1">খেলোয়াড়ের সংক্ষিপ্ত বিবরণী</label>
                        <textarea
                          rows={3}
                          value={editingPlayer.bio || ''}
                          onChange={(e) => setEditingPlayer({ ...editingPlayer, bio: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                        />
                      </div>

                      <div className="flex items-center gap-4 pt-1">
                        <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingPlayer.isCaptain}
                            onChange={(e) => setEditingPlayer({ ...editingPlayer, isCaptain: e.target.checked })}
                            className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-800"
                          />
                          <span>অধিনায়ক (Captain)</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingPlayer.isActive}
                            onChange={(e) => setEditingPlayer({ ...editingPlayer, isActive: e.target.checked })}
                            className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-800"
                          />
                          <span>বর্তমান স্কোয়াডে সক্রিয়</span>
                        </label>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                        <button
                          onClick={() => setEditingPlayer(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs"
                        >
                          বাতিল
                        </button>
                        <button
                          onClick={async () => {
                            if (!editingPlayer.fullName.trim()) {
                              showToast('খেলোয়াড়ের নাম আবশ্যক', 'error');
                              return;
                            }
                            await savePlayer(editingPlayer);
                            await refreshAllData();
                            setEditingPlayer(null);
                            showToast('খেলোয়াড় সফলভাবে সংরক্ষিত হয়েছে!', 'success');
                          }}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          সংরক্ষণ করুন
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 8. MATCHES AND RESULTS */}
            {activeTab === 'matches' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">ম্যাচ ফিক্সচার ও স্কোরবোর্ড</h2>
                    <p className="text-xs text-slate-400">
                      আসন্ন খেলার সময়সূচী তৈরি করুন এবং লাইভ বা সমাপ্ত ম্যাচের ফলাফল ও গোলদাতা লিপিবদ্ধ করুন।
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAutoCalculateStandings}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                    >
                      পয়েন্ট টেবিল অটো-ক্যালকুলেট
                    </button>
                    <button
                      onClick={() =>
                        setEditingMatch({
                          id: `match_${Date.now()}`,
                          homeTeamName: settings.clubNameBn,
                          homeTeamLogo: settings.logoUrl,
                          awayTeamName: 'প্রতিপক্ষ দল',
                          awayTeamLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=200&auto=format&fit=crop',
                          matchDate: new Date().toISOString().split('T')[0],
                          matchTime: '15:30',
                          venue: settings.homeGround,
                          tournamentName: 'উত্তরবঙ্গ গোল্ডকাপ ফুটবল ২০২৬',
                          homeScore: 0,
                          awayScore: 0,
                          status: 'Upcoming',
                          report: '',
                          scorers: '',
                        })
                      }
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন ম্যাচ যুক্ত করুন</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {matches.map((m) => (
                    <div
                      key={m.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-400">{m.tournamentName}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              m.status === 'Completed'
                                ? 'bg-slate-800 text-slate-300'
                                : m.status === 'Live'
                                ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {m.status}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-white">
                          {m.homeTeamName} {m.status === 'Completed' || m.status === 'Live' ? `(${m.homeScore ?? 0})` : ''} vs{' '}
                          {m.awayTeamName} {m.status === 'Completed' || m.status === 'Live' ? `(${m.awayScore ?? 0})` : ''}
                        </h4>
                        <div className="text-xs text-slate-400">
                          {m.matchDate} • {m.venue}
                        </div>
                        {m.scorers && <div className="text-xs text-slate-500">গোলদাতা: {m.scorers}</div>}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingMatch({ ...m })}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                        >
                          স্কোর / তথ্য সম্পাদনা
                        </button>
                        <button
                          onClick={() =>
                            setConfirmConfig({
                              isOpen: true,
                              title: 'ম্যাচ মুছুন',
                              message: 'আপনি কি নিশ্চিত এই ম্যাচ রেকর্ডটি মুছে ফেলতে চান?',
                              onConfirm: async () => {
                                await deleteMatch(m.id);
                                await refreshAllData();
                                setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
                                showToast('ম্যাচ মোছা হয়েছে', 'info');
                              },
                            })
                          }
                          className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Match Modal */}
                {editingMatch && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-lg font-bold text-white">ম্যাচ ও স্কোরবোর্ড সম্পাদনা</h3>
                        <button onClick={() => setEditingMatch(null)} className="text-slate-400 hover:text-white">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">হোম টিম (Home Team)</label>
                          <input
                            type="text"
                            value={editingMatch.homeTeamName}
                            onChange={(e) => setEditingMatch({ ...editingMatch, homeTeamName: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">অ্যাওয়ে টিম (Away Team)</label>
                          <input
                            type="text"
                            value={editingMatch.awayTeamName}
                            onChange={(e) => setEditingMatch({ ...editingMatch, awayTeamName: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">ম্যাচ স্ট্যাটাস</label>
                          <select
                            value={editingMatch.status}
                            onChange={(e) => setEditingMatch({ ...editingMatch, status: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          >
                            <option value="Upcoming">আসন্ন (Upcoming)</option>
                            <option value="Live">লাইভ চলছে (Live)</option>
                            <option value="Completed">সম্পন্ন (Completed)</option>
                            <option value="Postponed">স্থগিত (Postponed)</option>
                            <option value="Cancelled">বাতিল (Cancelled)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">টুর্নামেন্টের নাম</label>
                          <input
                            type="text"
                            value={editingMatch.tournamentName}
                            onChange={(e) => setEditingMatch({ ...editingMatch, tournamentName: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">হোম টিম স্কোর (Goals)</label>
                          <input
                            type="number"
                            min="0"
                            value={editingMatch.homeScore ?? 0}
                            onChange={(e) =>
                              setEditingMatch({ ...editingMatch, homeScore: Number(e.target.value) })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">অ্যাওয়ে টিম স্কোর (Goals)</label>
                          <input
                            type="number"
                            min="0"
                            value={editingMatch.awayScore ?? 0}
                            onChange={(e) =>
                              setEditingMatch({ ...editingMatch, awayScore: Number(e.target.value) })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">তারিখ (YYYY-MM-DD)</label>
                          <input
                            type="date"
                            value={editingMatch.matchDate}
                            onChange={(e) => setEditingMatch({ ...editingMatch, matchDate: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">সময় (Kickoff)</label>
                          <input
                            type="time"
                            value={editingMatch.matchTime}
                            onChange={(e) => setEditingMatch({ ...editingMatch, matchTime: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-slate-300 font-semibold mb-1">ভেন্যু / খেলার মাঠ</label>
                          <input
                            type="text"
                            value={editingMatch.venue}
                            onChange={(e) => setEditingMatch({ ...editingMatch, venue: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-slate-300 font-semibold mb-1">গোলদাতাদের বিবরণ</label>
                          <input
                            type="text"
                            placeholder="উদা: রফিকুল (১৮', ৭২'), বাবু (৫৪')"
                            value={editingMatch.scorers || ''}
                            onChange={(e) => setEditingMatch({ ...editingMatch, scorers: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-slate-300 font-semibold mb-1">ম্যাচ রিপোর্ট ও সারসংক্ষেপ</label>
                          <textarea
                            rows={4}
                            value={editingMatch.report || ''}
                            onChange={(e) => setEditingMatch({ ...editingMatch, report: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                        <button
                          onClick={() => setEditingMatch(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs"
                        >
                          বাতিল
                        </button>
                        <button
                          onClick={async () => {
                            await saveMatch(editingMatch);
                            await refreshAllData();
                            setEditingMatch(null);
                            showToast('ম্যাচ তথ্য সংরক্ষিত হয়েছে!', 'success');
                          }}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          সংরক্ষণ করুন
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 9. CONTACT MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">ইনকোয়ারি ও যোগাযোগ বার্তা</h2>
                    <p className="text-xs text-slate-400">
                      পাবলিক ওয়েবসাইট থেকে দর্শনার্থীদের পাঠানো বার্তাগুলো দেখুন ও উত্তর দিন।
                    </p>
                  </div>
                  <button
                    onClick={loadMessages}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {loadingMessages ? (
                  <div className="py-12 text-center text-xs text-slate-400">বার্তা লোড হচ্ছে...</div>
                ) : contactMessages.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8">
                    <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white mb-1">কোনো নতুন বার্তা নেই</h3>
                    <p className="text-xs text-slate-400">পাবলিক কন্টাক্ট ফর্ম থেকে বার্তা আসলে এখানে দেখা যাবে।</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-white">{msg.name}</h4>
                            <span className="text-xs text-emerald-400 font-mono">{msg.email}</span>
                            {msg.phone && <span className="text-xs text-slate-400 font-mono">{msg.phone}</span>}
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              msg.status === 'new'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {msg.status}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-slate-300">{msg.subject}</div>
                        <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                          {msg.message}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                          <span>{msg.createdAt}</span>
                          <div className="flex gap-2">
                            {msg.status === 'new' && (
                              <button
                                onClick={async () => {
                                  await updateContactMessageStatus(msg.id, 'read');
                                  await loadMessages();
                                }}
                                className="px-3 py-1 rounded-lg bg-slate-800 text-white text-xs hover:bg-slate-700"
                              >
                                পঠিত হিসেবে মার্ক করুন
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setConfirmConfig({
                                  isOpen: true,
                                  title: 'বার্তা মুছুন',
                                  message: 'আপনি কি নিশ্চিত এই বার্তাটি মুছে ফেলতে চান?',
                                  onConfirm: async () => {
                                    await deleteContactMessage(msg.id);
                                    await loadMessages();
                                    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
                                    showToast('বার্তা মুছে ফেলা হয়েছে', 'info');
                                  },
                                })
                              }
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 10. ADMIN USERS */}
            {activeTab === 'admins' && (
              <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-white">অ্যাডমিন ইউজার ও অনুমতি (RBAC)</h2>
                  <p className="text-xs text-slate-400">
                    যে সকল ক্লাব কর্মকর্তা ওয়েবসাইটে লগইন করে তথ্য পরিবর্তন করতে পারবেন তাদের তালিকা।
                  </p>
                </div>

                {/* Add new admin */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
                      showToast('সঠিক ইমেইল ঠিকানা দিন', 'error');
                      return;
                    }
                    const cleanId = `admin_${newAdminEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
                    await addAdminUser({
                      id: cleanId,
                      email: newAdminEmail.trim().toLowerCase(),
                      role: 'admin',
                      addedAt: new Date().toISOString(),
                    });
                    setNewAdminEmail('');
                    await refreshAllData();
                    showToast('নতুন অ্যাডমিন সফলভাবে অন্তর্ভুক্ত করা হয়েছে!', 'success');
                  }}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    required
                    placeholder="official@gmail.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer shrink-0"
                  >
                    + অ্যাডমিন যুক্ত করুন
                  </button>
                </form>

                {/* Admins list */}
                <div className="space-y-3">
                  {adminUsers.map((adm) => (
                    <div
                      key={adm.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white text-xs">{adm.email}</div>
                        <div className="text-[11px] text-emerald-400 font-semibold">{adm.role}</div>
                      </div>

                      {adm.email !== 'chotokhatasportingclub@gmail.com' && (
                        <button
                          onClick={() =>
                            setConfirmConfig({
                              isOpen: true,
                              title: 'অ্যাডমিন অনুমতি বাতিল',
                              message: `আপনি কি ${adm.email} এর অ্যাডমিন অনুমতি প্রত্যাহার করতে চান?`,
                              onConfirm: async () => {
                                await removeAdminUser(adm.id);
                                await refreshAllData();
                                setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
                                showToast('অ্যাডমিন অনুমতি প্রত্যাহার করা হয়েছে', 'info');
                              },
                            })
                          }
                          className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. BACKUP & DATA EXPORT */}
            {activeTab === 'backup' && (
              <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-white">ডেটা ব্যাকআপ ও রিসেট ব্যবস্থাপনা</h2>
                  <p className="text-xs text-slate-400">
                    ক্লাবের সমস্ত ডেটা অফলাইন ব্যাকআপ ফাইল হিসেবে ডাউনলোড করুন অথবা ডিফল্ট তথ্যে ফিরিয়ে নিন।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <Database className="w-8 h-8 text-emerald-400" />
                    <h3 className="text-base font-bold text-white">সম্পূর্ণ ডেটাবেজ এক্সপোর্ট (JSON)</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      ক্লাবের সমস্ত সেটিংস, খেলোয়াড় তালিকা, ম্যাচ, খবর, গ্যালারি ও ফলাফল একটি মাত্র ফাইলে সংরক্ষণ করুন।
                    </p>
                    <button
                      onClick={handleExportData}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
                    >
                      JSON ব্যাকআপ ডাউনলোড করুন
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-4">
                    <History className="w-8 h-8 text-rose-400" />
                    <h3 className="text-base font-bold text-white">ডিফল্ট ডেটায় রিসেট করুন</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      ক্লাবের অফিসিয়াল তথ্য কাঠামো পুনরায় ক্লাউড ফায়ারস্টোরে সিড করুন।
                    </p>
                    <button
                      onClick={() =>
                        setConfirmConfig({
                          isOpen: true,
                          title: 'ডিফল্ট ডেটায় রিসেট নিশ্চিতকরণ',
                          message: 'আপনি কি নিশ্চিত সমস্ত তথ্য প্রাথমিক অফিসিয়াল সেটিংসে ফিরিয়ে নিতে চান?',
                          onConfirm: async () => {
                            await seedInitialDatabase();
                            setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
                          },
                        })
                      }
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
                    >
                      ডিফল্ট ডেটা সিড / রিসেট
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 12. AUDIT LOGS */}
            {activeTab === 'logs' && (
              <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">প্রশাসনিক অডিট ও অ্যাক্টিভিটি লগ</h2>
                    <p className="text-xs text-slate-400">
                      কোন অ্যাডমিন কখন কী তথ্য সম্পাদনা করেছেন তার নিরাপদ অডিট রেকর্ড।
                    </p>
                  </div>
                  <button
                    onClick={loadLogs}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {loadingLogs ? (
                  <div className="py-12 text-center text-xs text-slate-400">লগ লোড হচ্ছে...</div>
                ) : auditLogs.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">কোনো অ্যাক্টিভিটি রেকর্ড পাওয়া যায়নি।</div>
                ) : (
                  <div className="space-y-3">
                    {auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-emerald-400">{log.action}</div>
                          <div className="text-slate-300">{log.details}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{log.adminEmail}</div>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
