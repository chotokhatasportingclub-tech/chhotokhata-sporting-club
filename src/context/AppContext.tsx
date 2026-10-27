import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import {
  SiteSettings,
  Language,
  Banner,
  HomepageSection,
  Player,
  Team,
  Match,
  Standing,
  Tournament,
  NewsArticle,
  Achievement,
  Sponsor,
  GalleryMedia,
  SportCategory,
  PlayerRegistration,
  RegistrationSettings,
} from '../types';
import {
  fetchSiteSettings,
  fetchBanners,
  fetchHomepageSections,
  fetchPlayers,
  fetchTeams,
  fetchMatches,
  fetchStandings,
  fetchTournaments,
  fetchNews,
  fetchAchievements,
  fetchSponsors,
  fetchGalleryMedia,
  fetchAdmins,
  fetchSportCategories,
  fetchRegistrationSettings,
  fetchPlayerRegistrations,
  DEFAULT_SETTINGS,
  DEFAULT_SECTIONS,
  DEFAULT_BANNERS,
  DEFAULT_PLAYERS,
  DEFAULT_TEAMS,
  DEFAULT_MATCHES,
  DEFAULT_STANDINGS,
  DEFAULT_TOURNAMENTS,
  DEFAULT_NEWS,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_SPONSORS,
  DEFAULT_GALLERY,
  DEFAULT_SPORT_CATEGORIES,
  DEFAULT_REGISTRATION_SETTINGS,
  seedInitialDataToFirestore,
} from '../services/db';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  settings: SiteSettings;
  updateSettingsState: (newSettings: Partial<SiteSettings>) => void;
  banners: Banner[];
  sections: HomepageSection[];
  sportCategories: SportCategory[];
  players: Player[];
  teams: Team[];
  matches: Match[];
  standings: Standing[];
  tournaments: Tournament[];
  news: NewsArticle[];
  achievements: Achievement[];
  sponsors: Sponsor[];
  gallery: GalleryMedia[];
  loading: boolean;
  currentUser: User | null;
  isAdmin: boolean;
  adminUsers: AdminUser[];
  registrationSettings: RegistrationSettings;
  setRegistrationSettingsState: (settings: RegistrationSettings) => void;
  registrations: PlayerRegistration[];
  fetchAndSetRegistrations: () => Promise<void>;
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  selectedSportFilter: string;
  setSelectedSportFilter: (sport: string) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAllData: () => Promise<void>;
  seedInitialDatabase: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);
  const [sections, setSections] = useState<HomepageSection[]>(DEFAULT_SECTIONS);
  const [sportCategories, setSportCategories] = useState<SportCategory[]>(DEFAULT_SPORT_CATEGORIES);
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [matches, setMatches] = useState<Match[]>(DEFAULT_MATCHES);
  const [standings, setStandings] = useState<Standing[]>(DEFAULT_STANDINGS);
  const [tournaments, setTournaments] = useState<Tournament[]>(DEFAULT_TOURNAMENTS);
  const [news, setNews] = useState<NewsArticle[]>(DEFAULT_NEWS);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [sponsors, setSponsors] = useState<Sponsor[]>(DEFAULT_SPONSORS);
  const [gallery, setGallery] = useState<GalleryMedia[]>(DEFAULT_GALLERY);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [registrationSettings, setRegistrationSettingsState] = useState<RegistrationSettings>(DEFAULT_REGISTRATION_SETTINGS);
  const [registrations, setRegistrations] = useState<PlayerRegistration[]>([]);
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('all');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Navigation route management (supports /player-registration and #player-registration)
  const getInitialRoute = () => {
    const path = window.location.pathname.replace(/^\//, '');
    if (path === 'player-registration' || path === 'registration') {
      return 'player-registration';
    }
    const hash = window.location.hash.replace('#', '').replace(/^\//, '');
    if (hash === 'player-registration' || hash === 'registration') {
      return 'player-registration';
    }
    return hash || 'home';
  };
  const [currentRoute, setCurrentRouteState] = useState<string>(getInitialRoute());

  const setCurrentRoute = (route: string) => {
    setCurrentRouteState(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').replace(/^\//, '');
      if (hash === 'player-registration' || hash === 'registration') {
        setCurrentRouteState('player-registration');
        return;
      }
      setCurrentRouteState(hash || 'home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync dynamic CSS variables with site settings
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', settings.primaryColor || '#071426');
    document.documentElement.style.setProperty('--color-secondary', settings.secondaryColor || '#16a34a');
    document.documentElement.style.setProperty('--color-accent', settings.accentColor || '#eab308');
  }, [settings.primaryColor, settings.secondaryColor, settings.accentColor]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const ownerEmail = 'chotokhatasportingclub@gmail.com'.toLowerCase().trim();
        const userEmail = (user.email || '').toLowerCase().trim();
        const admins = await fetchAdmins();
        setAdminUsers(admins);
        const hasAdminRole =
          userEmail === ownerEmail ||
          admins.some((a) => (a.email || '').toLowerCase().trim() === userEmail);
        setIsAdmin(hasAdminRole);

        // Sync admin doc in Firestore if user is verified admin
        if (hasAdminRole && user.uid) {
          try {
            await setDoc(doc(db, 'admins', user.uid), {
              email: user.email,
              role: userEmail === ownerEmail ? 'super_admin' : 'admin',
              lastLogin: new Date().toISOString(),
            }, { merge: true });
          } catch (err) {
            console.warn('Could not sync admin document:', err);
          }
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch all initial data from Cloud Firestore
  const refreshAllData = async () => {
    setLoading(true);
    try {
      const [
        sSettings,
        sBanners,
        sSections,
        sSportCategories,
        sPlayers,
        sTeams,
        sMatches,
        sStandings,
        sTournaments,
        sNews,
        sAchievements,
        sSponsors,
        sGallery,
        sAdmins,
        sRegSettings,
        sRegistrations,
      ] = await Promise.all([
        fetchSiteSettings(),
        fetchBanners(),
        fetchHomepageSections(),
        fetchSportCategories(),
        fetchPlayers(),
        fetchTeams(),
        fetchMatches(),
        fetchStandings(),
        fetchTournaments(),
        fetchNews(),
        fetchAchievements(),
        fetchSponsors(),
        fetchGalleryMedia(),
        fetchAdmins(),
        fetchRegistrationSettings(),
        fetchPlayerRegistrations(),
      ]);

      setSettings(sSettings);
      setBanners(sBanners);
      setSections(sSections);
      setSportCategories(sSportCategories);
      setPlayers(sPlayers);
      setTeams(sTeams);
      setMatches(sMatches);
      setStandings(sStandings);
      setTournaments(sTournaments);
      setNews(sNews);
      setAchievements(sAchievements);
      setSponsors(sSponsors);
      setGallery(sGallery);
      setAdminUsers(sAdmins);
      setRegistrationSettingsState(sRegSettings);
      setRegistrations(sRegistrations);

      // Verify admin status again if user logged in
      if (auth.currentUser) {
        const ownerEmail = 'chotokhatasportingclub@gmail.com'.toLowerCase().trim();
        const curEmail = (auth.currentUser.email || '').toLowerCase().trim();
        const isAdm =
          curEmail === ownerEmail ||
          sAdmins.some((a) => (a.email || '').toLowerCase().trim() === curEmail);
        setIsAdmin(isAdm);
      }
    } catch (err) {
      console.warn('Data load notice (fallback active):', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const updateSettingsState = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const res = await signInWithPopup(auth, provider);
      
      const ownerEmail = 'chotokhatasportingclub@gmail.com'.toLowerCase().trim();
      const userEmail = (res.user.email || '').toLowerCase().trim();
      const admins = await fetchAdmins();
      setAdminUsers(admins);
      const hasAdminRole =
        userEmail === ownerEmail ||
        admins.some((a) => (a.email || '').toLowerCase().trim() === userEmail);

      setCurrentUser(res.user);
      setIsAdmin(hasAdminRole);

      if (hasAdminRole && res.user.uid) {
        try {
          await setDoc(doc(db, 'admins', res.user.uid), {
            email: res.user.email,
            role: userEmail === ownerEmail ? 'super_admin' : 'admin',
            lastLogin: new Date().toISOString(),
          }, { merge: true });
        } catch (e) {
          console.warn('Could not update admin doc in firestore:', e);
        }
        showToast(`স্বাগতম, ${res.user.displayName || res.user.email}!`, 'success');
      } else {
        showToast('এই একাউন্টটি ক্লাবের অনুমোদিত অ্যাডমিন তালিকায় নেই।', 'error');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      showToast(`লগইন ব্যর্থ হয়েছে: ${error.message}`, 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
      showToast('লগআউট সফল হয়েছে', 'info');
      setCurrentRoute('home');
    } catch (error: any) {
      showToast(`লগআউট ত্রুটি: ${error.message}`, 'error');
    }
  };

  const seedInitialDatabase = async () => {
    try {
      setLoading(true);
      await seedInitialDataToFirestore();
      await refreshAllData();
      showToast('ক্লাবের অফিসিয়াল ডেটাবেজ সফলভাবে সিড করা হয়েছে!', 'success');
    } catch (err: any) {
      showToast(`ডেটাবেজ সিড ত্রুটি: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAndSetRegistrations = async () => {
    try {
      const regList = await fetchPlayerRegistrations();
      setRegistrations(regList);
    } catch (err) {
      console.warn('Could not fetch registrations:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        settings,
        updateSettingsState,
        banners,
        sections,
        sportCategories,
        players,
        teams,
        matches,
        standings,
        tournaments,
        news,
        achievements,
        sponsors,
        gallery,
        loading,
        currentUser,
        isAdmin,
        adminUsers,
        registrationSettings,
        setRegistrationSettingsState,
        registrations,
        fetchAndSetRegistrations,
        currentRoute,
        setCurrentRoute,
        selectedSportFilter,
        setSelectedSportFilter,
        toasts,
        showToast,
        removeToast,
        loginWithGoogle,
        logout,
        refreshAllData,
        seedInitialDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
