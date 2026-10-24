import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../firebase';
import {
  SiteSettings,
  Banner,
  HomepageSection,
  Player,
  Team,
  Match,
  Tournament,
  Standing,
  GalleryAlbum,
  GalleryMedia,
  NewsArticle,
  Achievement,
  Sponsor,
  ContactMessage,
  AdminUser,
  AdminActivityLog,
} from '../types';

export const DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><defs><linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="50%" stop-color="%23071426"/><stop offset="100%" stop-color="%2316a34a"/></linearGradient><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23facc15"/><stop offset="100%" stop-color="%23ca8a04"/></linearGradient></defs><path d="M100 10 L180 45 C180 120, 100 185, 100 185 C100 185, 20 120, 20 45 Z" fill="url(%23shieldGrad)" stroke="%23facc15" stroke-width="6"/><path d="M100 22 L168 52 C168 115, 100 172, 100 172 C100 172, 32 115, 32 52 Z" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/><circle cx="100" cy="85" r="32" fill="%23ffffff" stroke="%23071426" stroke-width="3"/><polygon points="100,73 108,80 105,90 95,90 92,80" fill="%23071426"/><polygon points="85,62 93,65 92,75 80,75 78,67" fill="%23071426"/><polygon points="115,62 122,67 120,75 108,75 107,65" fill="%23071426"/><polygon points="73,95 82,90 89,97 85,107 75,105" fill="%23071426"/><polygon points="127,95 125,105 115,107 111,97 118,90" fill="%23071426"/><text x="100" y="132" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="%23facc15" text-anchor="middle" letter-spacing="2">CSC</text><text x="100" y="148" font-family="Arial, sans-serif" font-weight="700" font-size="10" fill="%23ffffff" text-anchor="middle">EST. 2014</text><text x="100" y="162" font-family="Arial, sans-serif" font-size="9" fill="%2386efac" text-anchor="middle">ছোটখাতা</text></svg>`;

export const DEFAULT_SETTINGS: SiteSettings = {
  clubNameBn: 'ছোটখাতা স্পোর্টিং ক্লাব',
  clubNameEn: 'Chhotokhata Sporting Club',
  shortName: 'Chhotokhata SC',
  websiteTitle: 'ছোটখাতা স্পোর্টিং ক্লাব | Chhotokhata Sporting Club',
  websiteDescription: 'ছোটখাতা স্পোর্টিং ক্লাবের অফিসিয়াল ওয়েবসাইট। ফুটবল দল, খেলোয়াড় তালিকা, ম্যাচ সময়সূচী, লাইভ ফলাফল, পয়েন্ট টেবিল ও সাম্প্রতিক খবর।',
  tagline: 'একতাই বল, ফুটবলেই আনন্দ ও ক্লাবের গৌরব',
  taglineEn: 'Unity in Passion, Pride in Every Goal',
  foundingYear: '২০১৪ (2014)',
  history: 'ছোটখাতা স্পোর্টিং ক্লাব উত্তরবঙ্গের ঐতিহ্যবাহী ফুটবল প্রেমী তরুণদের ঐকান্তিক প্রচেষ্টায় প্রতিষ্ঠিত। স্থানীয় টুর্নামেন্ট থেকে শুরু করে জেলা ও বিভাগীয় পর্যায়ে ক্লাবটি একাধিক গৌরবময় ট্রফি ও সম্মান অর্জন করেছে। তৃণমূল পর্যায়ে নতুন ফুটবল প্রতিভা গড়ে তোলাই আমাদের ক্লাবের প্রধান ব্রত।',
  historyEn: 'Chhotokhata Sporting Club was established by enthusiastic football lovers to foster sportsmanship, teamwork, and community spirit. Over the years, CSC has earned championships in regional and district leagues while nurturing grassroots football talent.',
  mission: 'যুবসমাজকে মাদক ও সামাজিক অবক্ষয় মুক্ত রেখে ফুটবলের মাধ্যমে সুস্থ ও শৃঙ্খলাবদ্ধ সমাজ গঠন এবং জাতীয় মানের খেলোয়াড় তৈরি করা।',
  missionEn: 'To inspire youth through disciplined athletic training, fair play, and healthy competition while developing potential national-level footballers.',
  vision: 'উত্তরবঙ্গের শীর্ষস্থানীয় ও পেশাদার মানসম্পন্ন ফুটবল ক্লাব ও ক্রীড়া একাডেমিতে রূপান্তরিত হওয়া।',
  visionEn: 'To transform into a premier football academy and club recognized across Bangladesh.',
  phone: '+880 1712-345678',
  email: 'chotokhatasportingclub@gmail.com',
  address: 'ছোটখাতা বাজার সংলগ্ন, ডিমলা, নীলফামারী, রংপুর বিভাগ, বাংলাদেশ',
  homeGround: 'ছোটখাতা উচ্চ বিদ্যালয় ফুটবল ময়দান (Chhotokhata High School Ground)',
  mapsUrl: 'https://maps.google.com/?q=Chhotokhata,Dimla,Nilphamari',
  facebookUrl: 'https://facebook.com/chotokhatasportingclub',
  youtubeUrl: 'https://youtube.com/@chotokhatasportingclub',
  instagramUrl: 'https://instagram.com/chotokhatasportingclub',
  footerText: '© ২০২৬ ছোটখাতা স্পোর্টিং ক্লাব (Chhotokhata Sporting Club). সর্বস্বত্ব সংরক্ষিত।',
  logoUrl: DEFAULT_LOGO_SVG,
  logoSize: 'medium',
  primaryColor: '#071426',
  secondaryColor: '#16a34a',
  accentColor: '#eab308',
  isDarkMode: true,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_SECTIONS: HomepageSection[] = [
  { id: 'sec-hero', sectionKey: 'hero', titleBn: 'প্রধান ব্যানার', titleEn: 'Hero Banner', order: 1, isVisible: true },
  { id: 'sec-quickmatch', sectionKey: 'quickMatch', titleBn: 'পরবর্তী ম্যাচ ও সাম্প্রতিক ফলাফল', titleEn: 'Next Match & Latest Result', order: 2, isVisible: true },
  { id: 'sec-about', sectionKey: 'about', titleBn: 'ক্লাব পরিচিতি ও ইতিহাস', titleEn: 'About Club & Heritage', order: 3, isVisible: true },
  { id: 'sec-players', sectionKey: 'players', titleBn: 'আমাদের মূল স্কোয়াড', titleEn: 'Star Players', order: 4, isVisible: true },
  { id: 'sec-matches', sectionKey: 'matches', titleBn: 'আসন্ন ম্যাচ ও সময়সূচী', titleEn: 'Fixtures & Schedule', order: 5, isVisible: true },
  { id: 'sec-standings', sectionKey: 'standings', titleBn: 'পয়েন্ট টেবিল', titleEn: 'League Standings', order: 6, isVisible: true },
  { id: 'sec-news', sectionKey: 'news', titleBn: 'সর্বশেষ খবর ও নোটিশ', titleEn: 'Latest News & Notices', order: 7, isVisible: true },
  { id: 'sec-gallery', sectionKey: 'gallery', titleBn: 'ফটো ও ভিডিও গ্যালারি', titleEn: 'Photo & Video Gallery', order: 8, isVisible: true },
  { id: 'sec-achievements', sectionKey: 'achievements', titleBn: 'ট্রফি ও ক্লাব সম্মাননা', titleEn: 'Trophies & Honors', order: 9, isVisible: true },
  { id: 'sec-sponsors', sectionKey: 'sponsors', titleBn: 'অফিসিয়াল স্পন্সর ও পার্টনার', titleEn: 'Official Sponsors & Partners', order: 10, isVisible: true },
  { id: 'sec-contact', sectionKey: 'contact', titleBn: 'যোগাযোগ ও হোম গ্রাউন্ড', titleEn: 'Contact & Home Ground', order: 11, isVisible: true },
];

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    title: 'ছোটখাতা স্পোর্টিং ক্লাব ফুটবল টিম',
    titleEn: 'Chhotokhata Sporting Club Football Team',
    subtitle: 'ঐতিহ্য, গৌরব ও আত্মবিশ্বাসের সাথে মাঠে লড়ছে আমাদের বীর যোদ্ধারা',
    subtitleEn: 'Striving for excellence with passion, discipline and victory',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop',
    mobileImageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    primaryButtonText: 'আমাদের দল দেখুন',
    primaryButtonLink: '#players',
    secondaryButtonText: 'ম্যাচ সময়সূচী',
    secondaryButtonLink: '#matches',
    textAlignment: 'center',
    overlayOpacity: 65,
    order: 1,
    isActive: true,
  },
  {
    id: 'banner-2',
    title: 'উত্তরবঙ্গ গোল্ডকাপ ফুটবল টুর্নামেন্ট ২০২৬',
    titleEn: 'North Bengal Gold Cup Football 2026',
    subtitle: 'হোম গ্রাউন্ডে আমাদের পরবর্তী মহা ম্যাচ! আসুন, দলের পাশে দাঁড়ান',
    subtitleEn: 'Join us at Chhotokhata Ground and cheer for the home team',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1600&auto=format&fit=crop',
    mobileImageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    primaryButtonText: 'পয়েন্ট টেবিল',
    primaryButtonLink: '#standings',
    secondaryButtonText: 'টিকিট ও অবস্থান',
    secondaryButtonLink: '#contact',
    textAlignment: 'left',
    overlayOpacity: 70,
    order: 2,
    isActive: true,
  },
];

export const DEFAULT_PLAYERS: Player[] = [
  {
    id: 'p-1',
    fullName: 'Mohammad Rafiqul Islam',
    nameBn: 'মোঃ রফিকুল ইসলাম',
    jerseyNumber: 10,
    position: 'Forward',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    bio: 'দলের অধিনায়ক ও প্রধান স্ট্রাইকার। গতি ও ড্রিবলিংয়ে পারদর্শী। জেলা পর্যায়ে সেরা গোলদাতার পুরস্কারপ্রাপ্ত।',
    dateOfBirth: '2001-04-12',
    nationality: 'Bangladeshi',
    appearances: 34,
    goals: 28,
    assists: 14,
    cleanSheets: 0,
    isActive: true,
    isCaptain: true,
    order: 1,
  },
  {
    id: 'p-2',
    fullName: 'Tanvir Ahmed Shanto',
    nameBn: 'তানভীর আহমেদ শান্ত',
    jerseyNumber: 1,
    position: 'Goalkeeper',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    bio: 'ক্লাবের বিশ্বস্ত গোলরক্ষক। পেনাল্টি সেভ ও দ্রুত রিফ্লেক্সে অনন্য দক্ষতা রয়েছে।',
    dateOfBirth: '2000-09-18',
    nationality: 'Bangladeshi',
    appearances: 32,
    goals: 0,
    assists: 1,
    cleanSheets: 16,
    isActive: true,
    isCaptain: false,
    order: 2,
  },
  {
    id: 'p-3',
    fullName: 'Shakil Mahmud',
    nameBn: 'শাকিল মাহমুদ',
    jerseyNumber: 4,
    position: 'Defender',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    bio: 'সেন্ট্রাল ডিফেন্ডার। দুর্ভেদ্য রক্ষণাত্মক দেয়াল এবং নিখুঁত ট্যাকলিংয়ের জন্য পরিচিত।',
    dateOfBirth: '2002-01-25',
    nationality: 'Bangladeshi',
    appearances: 30,
    goals: 3,
    assists: 2,
    cleanSheets: 14,
    isActive: true,
    isCaptain: false,
    order: 3,
  },
  {
    id: 'p-4',
    fullName: 'Ariful Hasan',
    nameBn: 'আরিফুল হাসান',
    jerseyNumber: 8,
    position: 'Midfielder',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
    bio: 'প্লে-মেকার ও সেন্ট্রাল মিডফিল্ডার। মাঠে চমৎকার বল নিয়ন্ত্রণ ও লং-পাস দিয়ে সুযোগ তৈরি করেন।',
    dateOfBirth: '2003-06-10',
    nationality: 'Bangladeshi',
    appearances: 28,
    goals: 8,
    assists: 18,
    cleanSheets: 0,
    isActive: true,
    isCaptain: false,
    order: 4,
  },
  {
    id: 'p-5',
    fullName: 'Mehedi Hasan Babu',
    nameBn: 'মেহেদী হাসান বাবু',
    jerseyNumber: 7,
    position: 'Forward',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600&auto=format&fit=crop',
    bio: 'উইঙ্গার। দ্রুত গতির দৌড় ও দুই উইং দিয়ে ক্রস তৈরিতে দক্ষ আক্রমণভাগের খেলোয়াড়।',
    dateOfBirth: '2002-11-05',
    nationality: 'Bangladeshi',
    appearances: 29,
    goals: 14,
    assists: 11,
    cleanSheets: 0,
    isActive: true,
    isCaptain: false,
    order: 5,
  },
  {
    id: 'p-6',
    fullName: 'Kamrul Islam',
    nameBn: 'কামরুল ইসলাম',
    jerseyNumber: 3,
    position: 'Defender',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop',
    bio: 'লেফট ব্যাক। ওভারল্যাপ অ্যাটাকে সক্রিয় ভূমিকা রাখেন এবং ক্রস তৈরিতে দক্ষ।',
    dateOfBirth: '2001-08-14',
    nationality: 'Bangladeshi',
    appearances: 26,
    goals: 2,
    assists: 6,
    cleanSheets: 12,
    isActive: true,
    isCaptain: false,
    order: 6,
  },
];

export const DEFAULT_TEAMS: Team[] = [
  {
    id: 'team-csc',
    name: 'Chhotokhata Sporting Club',
    shortName: 'CSC',
    logoUrl: DEFAULT_LOGO_SVG,
    city: 'Dimla, Nilphamari',
    isHomeClub: true,
  },
  {
    id: 'team-dimla',
    name: 'Dimla Football Academy',
    shortName: 'DFA',
    logoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=200&auto=format&fit=crop',
    city: 'Dimla',
    isHomeClub: false,
  },
  {
    id: 'team-domar',
    name: 'Domar United Club',
    shortName: 'DUC',
    logoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=200&auto=format&fit=crop',
    city: 'Domar',
    isHomeClub: false,
  },
  {
    id: 'team-nilphamari',
    name: 'Nilphamari Sporting Association',
    shortName: 'NSA',
    logoUrl: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=200&auto=format&fit=crop',
    city: 'Nilphamari Sadar',
    isHomeClub: false,
  },
];

export const DEFAULT_MATCHES: Match[] = [
  {
    id: 'm-1',
    homeTeamName: 'Chhotokhata Sporting Club',
    homeTeamLogo: DEFAULT_LOGO_SVG,
    awayTeamName: 'Dimla Football Academy',
    awayTeamLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=200&auto=format&fit=crop',
    matchDate: '2026-11-05',
    matchTime: '15:30',
    venue: 'ছোটখাতা ফুটবল গ্রাউন্ড',
    tournamentName: 'উত্তরবঙ্গ গোল্ডকাপ ফুটবল ২০২৬',
    status: 'Upcoming',
    posterUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    report: 'টুর্নামেন্টের কোয়ার্টার ফাইনাল ম্যাচ। তীব্র প্রতিদ্বন্দ্বিতাপূর্ণ খেলার প্রত্যাশা।',
  },
  {
    id: 'm-2',
    homeTeamName: 'Domar United Club',
    homeTeamLogo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=200&auto=format&fit=crop',
    awayTeamName: 'Chhotokhata Sporting Club',
    awayTeamLogo: DEFAULT_LOGO_SVG,
    matchDate: '2026-10-20',
    matchTime: '15:00',
    venue: 'ডোমার স্টেডিয়াম মাঠ',
    tournamentName: 'উত্তরবঙ্গ গোল্ডকাপ ফুটবল ২০২৬',
    homeScore: 1,
    awayScore: 3,
    status: 'Completed',
    scorers: 'Rafiqul (18\', 72\'), Babu (54\') [CSC]; Jahid (41\') [DUC]',
    report: 'ছোটখাতা স্পোর্টিং ক্লাব অনবদ্য পারফরম্যান্সে ডোমার ইউনাইটেডকে ৩-১ গোলে পরাজিত করে সেমিফাইনালে তাদের অবস্থান দৃঢ় করেছে। রফিকুল জোড়া গোল করেন।',
  },
  {
    id: 'm-3',
    homeTeamName: 'Chhotokhata Sporting Club',
    homeTeamLogo: DEFAULT_LOGO_SVG,
    awayTeamName: 'Nilphamari Sporting Association',
    awayTeamLogo: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=200&auto=format&fit=crop',
    matchDate: '2026-10-12',
    matchTime: '15:30',
    venue: 'ছোটখাতা ফুটবল গ্রাউন্ড',
    tournamentName: 'উত্তরবঙ্গ গোল্ডকাপ ফুটবল ২০২৬',
    homeScore: 2,
    awayScore: 0,
    status: 'Completed',
    scorers: 'Ariful (35\'), Rafiqul (88\') [CSC]',
    report: 'হোম ক্রাউডের সামনে দুর্দান্ত জয়। আরিফুল ও অধিনায়ক রফিকুলের গোলে ২-০ ব্যবধানে জয় পায় ছোটখাতা।',
  },
];

export const DEFAULT_STANDINGS: Standing[] = [
  {
    id: 'st-1',
    tournamentName: 'উত্তরবঙ্গ গোল্ডকাপ ফুটবল ২০২৬',
    teamName: 'Chhotokhata Sporting Club',
    teamLogo: DEFAULT_LOGO_SVG,
    position: 1,
    played: 5,
    won: 4,
    drawn: 1,
    lost: 0,
    goalsFor: 12,
    goalsAgainst: 3,
    goalDifference: 9,
    points: 13,
  },
  {
    id: 'st-2',
    tournamentName: 'উত্তরবঙ্গ গোল্ডকাপ ফুটবল ২০২৬',
    teamName: 'Nilphamari Sporting Association',
    position: 2,
    played: 5,
    won: 3,
    drawn: 1,
    lost: 1,
    goalsFor: 9,
    goalsAgainst: 5,
    goalDifference: 4,
    points: 10,
  },
  {
    id: 'st-3',
    tournamentName: 'উত্তরবঙ্গ গোল্ডকাপ ফুটবল ২০২৬',
    teamName: 'Dimla Football Academy',
    position: 3,
    played: 5,
    won: 2,
    drawn: 1,
    lost: 2,
    goalsFor: 7,
    goalsAgainst: 8,
    goalDifference: -1,
    points: 7,
  },
  {
    id: 'st-4',
    tournamentName: 'উত্তরবঙ্গ গোল্ডকাপ ফুটবল ২০২৬',
    teamName: 'Domar United Club',
    position: 4,
    played: 5,
    won: 1,
    drawn: 0,
    lost: 4,
    goalsFor: 4,
    goalsAgainst: 11,
    goalDifference: -7,
    points: 3,
  },
];

export const DEFAULT_TOURNAMENTS: Tournament[] = [
  {
    id: 'tour-1',
    name: 'উত্তরবঙ্গ গোল্ডকাপ ফুটবল ২০২৬',
    season: '২০২৬ (Season 2026)',
    startDate: '2026-10-01',
    endDate: '2026-11-20',
    status: 'Active',
    description: 'রংপুর ও নীলফামারী জেলার সেরা ৮টি ক্লাবের অংশ গ্রহণে অনুষ্ঠিত মর্যাদাপূর্ণ টুর্নামেন্ট।',
  },
];

export const DEFAULT_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'ডোমার ইউনাইটেডের বিরুদ্ধে ছোটখাতা স্পোর্টিং ক্লাবের বিশাল জয়',
    content: 'উত্তরবঙ্গ গোল্ডকাপ ফুটবলের গুরুত্বপূর্ণ অ্যাওয়ে ম্যাচে ডোমার ইউনাইটেডকে ৩-১ গোলে উড়িয়ে দিয়েছে ছোটখাতা স্পোর্টিং ক্লাব। ম্যাচের শুরু থেকেই আক্রমণাত্মক ফুটবলের পসরা সাজায় ছোটখাতার দামাল ছেলেরা। ১৮ মিনিটে অধিনায়ক রফিকুল দলের পক্ষে প্রথম গোল করেন। বাবু ৫৪ মিনিটে ব্যবধান বাড়ান এবং ৭২ মিনিটে রফিকুল ব্যক্তিগত দ্বিতীয় গোল করে দলের জয় নিশ্চিত করেন। স্থানীয় সমর্থক ও শুভানুধ্যায়ীরা দলের এই দারুণ জয়ে আনন্দ মিছিল বের করে।',
    summary: '৩-১ গোলের দুর্দান্ত জয়ে উত্তরবঙ্গ গোল্ডকাপ ফুটবলের পয়েন্ট টেবিলের শীর্ষে অবস্থান ধরে রাখলো ছোটখাতা স্পোর্টিং ক্লাব।',
    coverImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    category: 'Match Report',
    status: 'published',
    author: 'ক্লাব প্রেস উইং',
    publishedAt: '2026-10-21',
    isFeatured: true,
  },
  {
    id: 'news-2',
    title: 'নতুন মৌসুমের জন্য তরুণ ফুটবলার বাছাই ও ট্রায়াল শুরু',
    content: 'ছোটখাতা স্পোর্টিং ক্লাব একাডেমির আগামী মৌসুমের জন্য অনূর্ধ্ব-১৬ ও অনূর্ধ্ব-১৮ ক্যাটাগরিতে তৃণমূলের নতুন খেলোয়াড় বাছাই প্রক্রিয়া শুরু হতে যাচ্ছে। আগামী মাসের প্রথম সপ্তাহে ছোটখাতা ফুটবল মাঠে ট্রায়াল অনুষ্ঠিত হবে। আগ্রহীদের ক্লাব কার্যালয় থেকে ফরম সংগ্রহ করার অনুরোধ জানানো হয়েছে।',
    summary: 'তৃণমূল পর্যায়ে নতুন প্রতিভা সন্ধানে অনূর্ধ্ব-১৬ ও অনূর্ধ্ব-১৮ ফুটবলার বাছাই ক্যাম্পের আয়োজন।',
    coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    category: 'Club Announcement',
    status: 'published',
    author: 'প্রধান কোচ ও ম্যানেজমেন্ট',
    publishedAt: '2026-10-15',
    isFeatured: false,
  },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    trophyName: 'চ্যাম্পিয়ন ট্রফি - ডিমলা উপজেলা ফুটবল টুর্নামেন্ট',
    tournamentName: 'উপজেলা স্বাধীনতা গোল্ডকাপ',
    year: '২০২৪',
    position: 'Champion (চ্যাম্পিয়ন)',
    photoUrl: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=600&auto=format&fit=crop',
    description: 'ফাইনালে টাইব্রেকারে ৪-৩ গোলে বিজয়ী হয়ে ক্লাবের ইতিহাসে নতুন গৌরব সংযোজন।',
  },
  {
    id: 'ach-2',
    trophyName: 'রানার্স-আপ ট্রফি - নীলফামারী জেলা লিগ',
    tournamentName: 'নীলফামারী জেলা ফুটবল চ্যাম্পিয়নশিপ',
    year: '২০২৩',
    position: 'Runners-up (রানার্স-আপ)',
    photoUrl: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?q=80&w=600&auto=format&fit=crop',
    description: 'জেলায় প্রথম অংশগ্রহণেই রানার্স-আপ ট্রফি অর্জন করে জেলাজুড়ে প্রশংসা কুড়ায় ছোটখাতা স্পোর্টিং ক্লাব।',
  },
];

export const DEFAULT_SPONSORS: Sponsor[] = [
  {
    id: 'sp-1',
    name: 'উত্তরবঙ্গ এগ্রো ফুডস',
    logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=300&auto=format&fit=crop',
    tier: 'Principal Partner',
    websiteUrl: 'https://example.com',
    order: 1,
    isActive: true,
  },
  {
    id: 'sp-2',
    name: 'তিস্তা স্পোর্টস গিয়ার',
    logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=300&auto=format&fit=crop',
    tier: 'Kit Partner',
    websiteUrl: 'https://example.com',
    order: 2,
    isActive: true,
  },
];

export const DEFAULT_GALLERY: GalleryMedia[] = [
  {
    id: 'gal-1',
    title: 'ফুটবল ম্যাচের আক্রমণাত্মক মুহূর্ত',
    caption: 'উত্তরবঙ্গ গোল্ডকাপের টানটান উত্তেজনার মুহূর্ত',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    date: '2026-10-20',
    order: 1,
  },
  {
    id: 'gal-2',
    title: 'ছোটখাতা গ্রাউন্ডে প্র্যাকটিস সেশন',
    caption: 'ম্যাচের আগে খেলোয়াড়দের নিবিড় অনুশীলন ও প্রস্তুতি',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    date: '2026-10-18',
    order: 2,
  },
  {
    id: 'gal-3',
    title: 'ট্রফি উদযাপন আনন্দ মিছিল',
    caption: 'উপজেলা চ্যাম্পিয়নশিপের ট্রফি নিয়ে সমর্থকদের উল্লাস',
    url: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    date: '2026-09-15',
    order: 3,
  },
];

// Database operations helper

export async function logAdminActivity(action: string, details: string) {
  try {
    const adminEmail = auth.currentUser?.email || 'admin@csc.org';
    const logId = `log_${Date.now()}`;
    await setDoc(doc(db, 'adminActivityLogs', logId), {
      action,
      details,
      adminEmail,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Could not record activity log:', err);
  }
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const path = 'siteSettings/general';
  try {
    const snap = await getDoc(doc(db, 'siteSettings', 'general'));
    if (snap.exists()) {
      return { ...DEFAULT_SETTINGS, ...(snap.data() as Partial<SiteSettings>) };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.warn('Using default settings fallback:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const path = 'siteSettings/general';
  try {
    const payload = {
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'siteSettings', 'general'), payload, { merge: true });
    await logAdminActivity('Update Site Settings', `Updated website configuration/branding`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchBanners(): Promise<Banner[]> {
  const path = 'banners';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('order', 'asc')));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Banner));
    }
    return DEFAULT_BANNERS;
  } catch (error) {
    console.warn('Using default banners fallback:', error);
    return DEFAULT_BANNERS;
  }
}

export async function saveBanner(banner: Banner): Promise<void> {
  const path = `banners/${banner.id}`;
  try {
    await setDoc(doc(db, 'banners', banner.id), banner, { merge: true });
    await logAdminActivity('Save Banner', `Saved banner slide: ${banner.title}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteBanner(id: string): Promise<void> {
  const path = `banners/${id}`;
  try {
    await deleteDoc(doc(db, 'banners', id));
    await logAdminActivity('Delete Banner', `Deleted banner ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchHomepageSections(): Promise<HomepageSection[]> {
  const path = 'homepageSections';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('order', 'asc')));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as HomepageSection));
    }
    return DEFAULT_SECTIONS;
  } catch (error) {
    console.warn('Using default sections fallback:', error);
    return DEFAULT_SECTIONS;
  }
}

export async function saveHomepageSections(sections: HomepageSection[]): Promise<void> {
  try {
    for (const sec of sections) {
      await setDoc(doc(db, 'homepageSections', sec.id), sec, { merge: true });
    }
    await logAdminActivity('Save Sections', `Updated homepage section order and visibility`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'homepageSections');
  }
}

export async function fetchPlayers(): Promise<Player[]> {
  const path = 'players';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('order', 'asc')));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Player));
    }
    return DEFAULT_PLAYERS;
  } catch (error) {
    console.warn('Using default players fallback:', error);
    return DEFAULT_PLAYERS;
  }
}

export async function savePlayer(player: Player): Promise<void> {
  const path = `players/${player.id}`;
  try {
    await setDoc(doc(db, 'players', player.id), player, { merge: true });
    await logAdminActivity('Save Player', `Saved player ${player.fullName} (#${player.jerseyNumber})`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePlayer(id: string): Promise<void> {
  const path = `players/${id}`;
  try {
    await deleteDoc(doc(db, 'players', id));
    await logAdminActivity('Delete Player', `Deleted player ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchTeams(): Promise<Team[]> {
  const path = 'teams';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Team));
    }
    return DEFAULT_TEAMS;
  } catch (error) {
    console.warn('Using default teams fallback:', error);
    return DEFAULT_TEAMS;
  }
}

export async function saveTeam(team: Team): Promise<void> {
  const path = `teams/${team.id}`;
  try {
    await setDoc(doc(db, 'teams', team.id), team, { merge: true });
    await logAdminActivity('Save Team', `Saved team ${team.name}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTeam(id: string): Promise<void> {
  const path = `teams/${id}`;
  try {
    await deleteDoc(doc(db, 'teams', id));
    await logAdminActivity('Delete Team', `Deleted team ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchMatches(): Promise<Match[]> {
  const path = 'matches';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('matchDate', 'desc')));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Match));
    }
    return DEFAULT_MATCHES;
  } catch (error) {
    console.warn('Using default matches fallback:', error);
    return DEFAULT_MATCHES;
  }
}

export async function saveMatch(match: Match): Promise<void> {
  const path = `matches/${match.id}`;
  try {
    await setDoc(doc(db, 'matches', match.id), match, { merge: true });
    await logAdminActivity('Save Match', `Saved match: ${match.homeTeamName} vs ${match.awayTeamName} (${match.status})`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMatch(id: string): Promise<void> {
  const path = `matches/${id}`;
  try {
    await deleteDoc(doc(db, 'matches', id));
    await logAdminActivity('Delete Match', `Deleted match ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchTournaments(): Promise<Tournament[]> {
  const path = 'tournaments';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Tournament));
    }
    return DEFAULT_TOURNAMENTS;
  } catch (error) {
    console.warn('Using default tournaments fallback:', error);
    return DEFAULT_TOURNAMENTS;
  }
}

export async function saveTournament(tournament: Tournament): Promise<void> {
  const path = `tournaments/${tournament.id}`;
  try {
    await setDoc(doc(db, 'tournaments', tournament.id), tournament, { merge: true });
    await logAdminActivity('Save Tournament', `Saved tournament ${tournament.name}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTournament(id: string): Promise<void> {
  const path = `tournaments/${id}`;
  try {
    await deleteDoc(doc(db, 'tournaments', id));
    await logAdminActivity('Delete Tournament', `Deleted tournament ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchStandings(): Promise<Standing[]> {
  const path = 'standings';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('points', 'desc')));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Standing));
    }
    return DEFAULT_STANDINGS;
  } catch (error) {
    console.warn('Using default standings fallback:', error);
    return DEFAULT_STANDINGS;
  }
}

export async function saveStanding(standing: Standing): Promise<void> {
  const path = `standings/${standing.id}`;
  try {
    await setDoc(doc(db, 'standings', standing.id), standing, { merge: true });
    await logAdminActivity('Save Standing', `Updated standings for ${standing.teamName}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteStanding(id: string): Promise<void> {
  const path = `standings/${id}`;
  try {
    await deleteDoc(doc(db, 'standings', id));
    await logAdminActivity('Delete Standing', `Deleted standing ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchGalleryMedia(): Promise<GalleryMedia[]> {
  const path = 'galleryMedia';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('order', 'asc')));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryMedia));
    }
    return DEFAULT_GALLERY;
  } catch (error) {
    console.warn('Using default gallery fallback:', error);
    return DEFAULT_GALLERY;
  }
}

export async function saveGalleryMedia(media: GalleryMedia): Promise<void> {
  const path = `galleryMedia/${media.id}`;
  try {
    await setDoc(doc(db, 'galleryMedia', media.id), media, { merge: true });
    await logAdminActivity('Save Media', `Saved gallery item: ${media.title}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteGalleryMedia(id: string): Promise<void> {
  const path = `galleryMedia/${id}`;
  try {
    await deleteDoc(doc(db, 'galleryMedia', id));
    await logAdminActivity('Delete Media', `Deleted gallery media ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchNews(): Promise<NewsArticle[]> {
  const path = 'news';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('publishedAt', 'desc')));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as NewsArticle));
    }
    return DEFAULT_NEWS;
  } catch (error) {
    console.warn('Using default news fallback:', error);
    return DEFAULT_NEWS;
  }
}

export async function saveNews(article: NewsArticle): Promise<void> {
  const path = `news/${article.id}`;
  try {
    await setDoc(doc(db, 'news', article.id), article, { merge: true });
    await logAdminActivity('Save News', `Saved article: ${article.title} (${article.status})`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteNews(id: string): Promise<void> {
  const path = `news/${id}`;
  try {
    await deleteDoc(doc(db, 'news', id));
    await logAdminActivity('Delete News', `Deleted article ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchAchievements(): Promise<Achievement[]> {
  const path = 'achievements';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Achievement));
    }
    return DEFAULT_ACHIEVEMENTS;
  } catch (error) {
    console.warn('Using default achievements fallback:', error);
    return DEFAULT_ACHIEVEMENTS;
  }
}

export async function saveAchievement(achievement: Achievement): Promise<void> {
  const path = `achievements/${achievement.id}`;
  try {
    await setDoc(doc(db, 'achievements', achievement.id), achievement, { merge: true });
    await logAdminActivity('Save Achievement', `Saved achievement: ${achievement.trophyName}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteAchievement(id: string): Promise<void> {
  const path = `achievements/${id}`;
  try {
    await deleteDoc(doc(db, 'achievements', id));
    await logAdminActivity('Delete Achievement', `Deleted achievement ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchSponsors(): Promise<Sponsor[]> {
  const path = 'sponsors';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('order', 'asc')));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Sponsor));
    }
    return DEFAULT_SPONSORS;
  } catch (error) {
    console.warn('Using default sponsors fallback:', error);
    return DEFAULT_SPONSORS;
  }
}

export async function saveSponsor(sponsor: Sponsor): Promise<void> {
  const path = `sponsors/${sponsor.id}`;
  try {
    await setDoc(doc(db, 'sponsors', sponsor.id), sponsor, { merge: true });
    await logAdminActivity('Save Sponsor', `Saved sponsor ${sponsor.name}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSponsor(id: string): Promise<void> {
  const path = `sponsors/${id}`;
  try {
    await deleteDoc(doc(db, 'sponsors', id));
    await logAdminActivity('Delete Sponsor', `Deleted sponsor ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function sendContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<void> {
  const messageId = `msg_${Date.now()}`;
  const path = `contactMessages/${messageId}`;
  try {
    const newMsg: ContactMessage = {
      ...msg,
      id: messageId,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'contactMessages', messageId), newMsg);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const path = 'contactMessages';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('createdAt', 'desc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessage));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function updateContactMessageStatus(id: string, status: 'new' | 'read' | 'replied'): Promise<void> {
  const path = `contactMessages/${id}`;
  try {
    await updateDoc(doc(db, 'contactMessages', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  const path = `contactMessages/${id}`;
  try {
    await deleteDoc(doc(db, 'contactMessages', id));
    await logAdminActivity('Delete Contact Message', `Deleted contact message ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchAdmins(): Promise<AdminUser[]> {
  const path = 'admins';
  try {
    const snap = await getDocs(collection(db, path));
    const admins: AdminUser[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminUser));
    // Always include master owner email if not present
    if (!admins.some((a) => a.email === 'chotokhatasportingclub@gmail.com')) {
      admins.unshift({
        id: 'master-owner',
        email: 'chotokhatasportingclub@gmail.com',
        role: 'super_admin',
        addedAt: '2026-01-01',
      });
    }
    return admins;
  } catch (error) {
    console.warn('Using admin default fallback:', error);
    return [
      {
        id: 'master-owner',
        email: 'chotokhatasportingclub@gmail.com',
        role: 'super_admin',
        addedAt: '2026-01-01',
      },
    ];
  }
}

export async function addAdminUser(admin: AdminUser): Promise<void> {
  const path = `admins/${admin.id}`;
  try {
    await setDoc(doc(db, 'admins', admin.id), admin);
    await logAdminActivity('Add Admin', `Added admin privilege for: ${admin.email}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeAdminUser(id: string): Promise<void> {
  const path = `admins/${id}`;
  try {
    await deleteDoc(doc(db, 'admins', id));
    await logAdminActivity('Remove Admin', `Revoked admin user ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchAuditLogs(limitCount = 50): Promise<AdminActivityLog[]> {
  const path = 'adminActivityLogs';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('timestamp', 'desc'), limit(limitCount)));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminActivityLog));
  } catch (error) {
    console.warn('Could not fetch audit logs:', error);
    return [];
  }
}

export async function seedInitialDataToFirestore(): Promise<void> {
  try {
    await setDoc(doc(db, 'siteSettings', 'general'), DEFAULT_SETTINGS, { merge: true });
    
    // Seed Banners
    for (const b of DEFAULT_BANNERS) {
      await setDoc(doc(db, 'banners', b.id), b, { merge: true });
    }
    // Seed Sections
    for (const s of DEFAULT_SECTIONS) {
      await setDoc(doc(db, 'homepageSections', s.id), s, { merge: true });
    }
    // Seed Players
    for (const p of DEFAULT_PLAYERS) {
      await setDoc(doc(db, 'players', p.id), p, { merge: true });
    }
    // Seed Teams
    for (const t of DEFAULT_TEAMS) {
      await setDoc(doc(db, 'teams', t.id), t, { merge: true });
    }
    // Seed Matches
    for (const m of DEFAULT_MATCHES) {
      await setDoc(doc(db, 'matches', m.id), m, { merge: true });
    }
    // Seed Standings
    for (const st of DEFAULT_STANDINGS) {
      await setDoc(doc(db, 'standings', st.id), st, { merge: true });
    }
    // Seed Tournaments
    for (const tour of DEFAULT_TOURNAMENTS) {
      await setDoc(doc(db, 'tournaments', tour.id), tour, { merge: true });
    }
    // Seed News
    for (const n of DEFAULT_NEWS) {
      await setDoc(doc(db, 'news', n.id), n, { merge: true });
    }
    // Seed Achievements
    for (const a of DEFAULT_ACHIEVEMENTS) {
      await setDoc(doc(db, 'achievements', a.id), a, { merge: true });
    }
    // Seed Sponsors
    for (const sp of DEFAULT_SPONSORS) {
      await setDoc(doc(db, 'sponsors', sp.id), sp, { merge: true });
    }
    // Seed Gallery
    for (const g of DEFAULT_GALLERY) {
      await setDoc(doc(db, 'galleryMedia', g.id), g, { merge: true });
    }
    // Ensure Super Admin record
    await setDoc(doc(db, 'admins', 'owner-main'), {
      email: 'chotokhatasportingclub@gmail.com',
      role: 'super_admin',
      addedAt: new Date().toISOString(),
    }, { merge: true });

    await logAdminActivity('Database Initialize', 'Seeded complete initial club data into Cloud Firestore');
  } catch (err) {
    console.error('Error seeding initial Firestore data:', err);
    throw err;
  }
}
