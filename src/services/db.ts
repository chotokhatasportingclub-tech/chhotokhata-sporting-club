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
  PlayerPosition,
  FormationType,
  LineupSlot,
  MatchLineup,
  CustomSquad,
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
  SportCategory,
  SportType,
  PlayerRegistration,
  RegistrationSettings,
  RegistrationStatus,
} from '../types';

export const DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><defs><linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="50%" stop-color="%23071426"/><stop offset="100%" stop-color="%2316a34a"/></linearGradient><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23facc15"/><stop offset="100%" stop-color="%23ca8a04"/></linearGradient></defs><path d="M100 10 L180 45 C180 120, 100 185, 100 185 C100 185, 20 120, 20 45 Z" fill="url(%23shieldGrad)" stroke="%23facc15" stroke-width="6"/><path d="M100 22 L168 52 C168 115, 100 172, 100 172 C100 172, 32 115, 32 52 Z" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/><circle cx="100" cy="85" r="32" fill="%23ffffff" stroke="%23071426" stroke-width="3"/><polygon points="100,73 108,80 105,90 95,90 92,80" fill="%23071426"/><polygon points="85,62 93,65 92,75 80,75 78,67" fill="%23071426"/><polygon points="115,62 122,67 120,75 108,75 107,65" fill="%23071426"/><polygon points="73,95 82,90 89,97 85,107 75,105" fill="%23071426"/><polygon points="127,95 125,105 115,107 111,97 118,90" fill="%23071426"/><text x="100" y="132" font-family="Arial, sans-serif" font-weight="900" font-size="18" fill="%23facc15" text-anchor="middle" letter-spacing="1.5">CCSC</text><text x="100" y="148" font-family="Arial, sans-serif" font-weight="700" font-size="10" fill="%23ffffff" text-anchor="middle">EST. 2014</text><text x="100" y="162" font-family="Arial, sans-serif" font-size="8.5" font-weight="700" fill="%2386efac" text-anchor="middle">ছোটখাতা চৌপথী</text></svg>`;

export const DEFAULT_SETTINGS: SiteSettings = {
  clubNameBn: 'ছোটখাতা চৌপথী স্পোর্টস এন্ড কালচারাল ক্লাব',
  clubNameEn: 'Chhotokhata Choupathi Sports & Cultural Club',
  shortName: 'ছোটখাতা চৌপথী ক্লাব',
  websiteTitle: 'ছোটখাতা চৌপথী স্পোর্টস এন্ড কালচারাল ক্লাব | Chhotokhata Choupathi Sports & Cultural Club',
  websiteDescription: 'ছোটখাতা চৌপথী স্পোর্টস এন্ড কালচারাল ক্লাবের অফিসিয়াল ওয়েবসাইট। ফুটবল, ক্রিকেট, ব্যাডমিন্টন, ভলিবল, টেবিল টেনিস, অ্যাথলেটিক্স এবং সাংস্কৃতিক ও সামাজিক কার্যক্রমের সমন্বিত ক্রীড়া প্ল্যাটফর্ম।',
  tagline: 'ক্রীড়ায় আনন্দ, সংস্কৃতিতে প্রাণ, সমাজসেবায় ঐক্য',
  taglineEn: 'Sportsmanship in Game, Soul in Culture, Unity in Community',
  foundingYear: '২০১৪ (2014)',
  history: 'ছোটখাতা চৌপথী স্পোর্টস এন্ড কালচারাল ক্লাব উত্তরবঙ্গের ঐতিহ্যবাহী বহুমাত্রিক ক্রীড়া ও সাংস্কৃতিক প্রতিষ্ঠান। ফুটবল, ক্রিকেট, ব্যাডমিন্টন, ভলিবল সহ নানা ক্রীড়া এবং বার্ষিক সাংস্কৃতিক অনুষ্ঠান, নাটক, কবিতা ও সমাজকল্যাণমূলক কার্যক্রম পরিচালনা করে আসছে ক্লাবটি। তৃণমূল পর্যায়ে ক্রীড়া প্রতিভা অন্বেষণ ও সুস্থ সাংস্কৃতিক বিকাশই আমাদের মূল ব্রত।',
  historyEn: 'Chhotokhata Choupathi Sports & Cultural Club is a premier multi-sport and cultural organization in North Bengal. Established to foster athletic excellence in football, cricket, badminton, volleyball, and track events, alongside vibrant cultural celebrations, drama, and youth community development.',
  mission: 'যুবসমাজকে মাদক ও সামাজিক অবক্ষয় মুক্ত রেখে ফুটবল, ক্রিকেট সহ বহুবিধ খেলাধুলা ও সুস্থ সংস্কৃতির মাধ্যমে সুশৃঙ্খল সমাজ গঠন এবং জাতীয় মানের ক্রীড়াবিদ ও সংস্কৃতিকর্মী তৈরি করা।',
  missionEn: 'To empower the youth away from negative distractions through diverse athletic training, sportsmanship, and cultural heritage, fostering healthy community bonds.',
  vision: 'উত্তরবঙ্গের শীর্ষস্থানীয় সমন্বিত ক্রীড়া ও সাংস্কৃতিক একাডেমি হিসেবে জাতীয় পর্যায়ে পরিচিতি অর্জন।',
  visionEn: 'To transform into a premier multi-sport training and cultural academy in Bangladesh.',
  phone: '+880 1712-345678',
  email: 'chotokhatasportingclub@gmail.com',
  address: 'ছোটখাতা চৌপথী বাজার সংলগ্ন, ডিমলা, নীলফামারী, রংপুর বিভাগ, বাংলাদেশ',
  homeGround: 'ছোটখাতা উচ্চ বিদ্যালয় ময়দান ও ক্লাব কমপ্লেক্স',
  mapsUrl: 'https://maps.google.com/?q=Chhotokhata,Dimla,Nilphamari',
  facebookUrl: 'https://facebook.com/chotokhatasportingclub',
  youtubeUrl: 'https://youtube.com/@chotokhatasportingclub',
  instagramUrl: 'https://instagram.com/chotokhatasportingclub',
  footerText: '© ২০২৬ ছোটখাতা চৌপথী স্পোর্টস এন্ড কালচারাল ক্লাব (Chhotokhata Choupathi Sports & Cultural Club). সর্বস্বত্ব সংরক্ষিত।',
  logoUrl: DEFAULT_LOGO_SVG,
  logoSize: 'medium',
  primaryColor: '#071426',
  secondaryColor: '#16a34a',
  accentColor: '#eab308',
  isDarkMode: true,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_SPORT_CATEGORIES: SportCategory[] = [
  {
    id: 'sport-football',
    key: 'football',
    nameBn: 'ফুটবল',
    nameEn: 'Football',
    iconEmoji: '⚽',
    descriptionBn: 'ক্লাবের ঐতিহ্যবাহী মূল ফুটবল দল, নকআউট টুর্নামেন্ট ও যুব ফুটবল একাডেমি।',
    descriptionEn: 'Official football squad, leagues, knockouts, and youth academy.',
    isActive: true,
    order: 1,
    supportsPointsTable: true,
    scoreType: 'goals',
    allowedPositions: ['Goalkeeper', 'Defender', 'Midfielder', 'Attacking Midfielder', 'Striker', 'Forward'],
  },
  {
    id: 'sport-cricket',
    key: 'cricket',
    nameBn: 'ক্রিকেট',
    nameEn: 'Cricket',
    iconEmoji: '🏏',
    descriptionBn: 'টি-টোয়েন্টি ও ওয়ানডে টুর্নামেন্টে প্রতিনিধিত্বকারী শক্তিশালী ক্রিকেট দল।',
    descriptionEn: 'Cricket team for T20, One Day, and local competitive tournaments.',
    isActive: true,
    order: 2,
    supportsPointsTable: true,
    scoreType: 'cricket_score',
    allowedPositions: ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'],
  },
  {
    id: 'sport-badminton',
    key: 'badminton',
    nameBn: 'ব্যাডমিন্টন',
    nameEn: 'Badminton',
    iconEmoji: '🏸',
    descriptionBn: 'শীতকালীন ব্যাডমিন্টন চ্যাম্পিয়নশিপ, একক ও দ্বৈত প্রতিযোগিতা।',
    descriptionEn: 'Annual winter badminton tournament, singles and doubles.',
    isActive: true,
    order: 3,
    supportsPointsTable: false,
    scoreType: 'sets_points',
    allowedPositions: ['Shuttler'],
  },
  {
    id: 'sport-volleyball',
    key: 'volleyball',
    nameBn: 'ভলিবল',
    nameEn: 'Volleyball',
    iconEmoji: '🏐',
    descriptionBn: 'অঞ্চলভিত্তিক ভলিবল লিগ ও ক্লাবের নিয়মিত ভলিবল স্কোয়াড।',
    descriptionEn: 'Regional volleyball championships and club squad.',
    isActive: true,
    order: 4,
    supportsPointsTable: true,
    scoreType: 'sets_points',
    allowedPositions: ['Spiker', 'Setter', 'Defender'],
  },
  {
    id: 'sport-table-tennis',
    key: 'table_tennis',
    nameBn: 'টেবিল টেনিস',
    nameEn: 'Table Tennis',
    iconEmoji: '🏓',
    descriptionBn: 'ক্লাব হাউজের ইনডোর টেবিল টেনিস প্রতিযোগিতা ও প্রশিক্ষণ।',
    descriptionEn: 'Indoor table tennis singles and doubles events.',
    isActive: true,
    order: 5,
    supportsPointsTable: false,
    scoreType: 'sets_points',
    allowedPositions: ['Paddler'],
  },
  {
    id: 'sport-athletics',
    key: 'athletics',
    nameBn: 'অ্যাথলেটিক্স ও ট্র্যাক',
    nameEn: 'Athletics & Track',
    iconEmoji: '🏃‍♂️',
    descriptionBn: '১০০মি, ২০০মি, হাই জাম্প, লং জাম্প ও বার্ষিক দৌড় প্রতিযোগিতা।',
    descriptionEn: 'Sprint, relay, track and field, and annual athletic meets.',
    isActive: true,
    order: 6,
    supportsPointsTable: false,
    scoreType: 'athletics_rank',
    allowedPositions: ['Sprinter', 'Athlete'],
  },
  {
    id: 'sport-cultural',
    key: 'cultural',
    nameBn: 'সাংস্কৃতিক ও সামাজিক কার্যক্রম',
    nameEn: 'Cultural & Community',
    iconEmoji: '🎭',
    descriptionBn: 'বার্ষিক সাংস্কৃতিক উৎসব, নাটক, আবৃত্তি, জাতীয় দিবস উদযাপন ও সমাজকল্যাণ।',
    descriptionEn: 'Cultural events, drama, recitations, music, and community service.',
    isActive: true,
    order: 7,
    supportsPointsTable: false,
    scoreType: 'event_program',
    allowedPositions: ['Performer', 'Organizer'],
  },
];

export const DEFAULT_SECTIONS: HomepageSection[] = [
  { id: 'sec-hero', sectionKey: 'hero', titleBn: 'প্রধান ব্যানার স্লাইডার', titleEn: 'Hero Banner', order: 1, isVisible: true },
  { id: 'sec-sports', sectionKey: 'sports', titleBn: 'ক্রীড়া ও সাংস্কৃতিক বিভাগসমূহ', titleEn: 'Sports & Cultural Disciplines', order: 2, isVisible: true },
  { id: 'sec-quickmatch', sectionKey: 'quickMatch', titleBn: 'আসন্ন ম্যাচ ও লাইভ স্কোর', titleEn: 'Next Match & Live Score', order: 3, isVisible: true },
  { id: 'sec-about', sectionKey: 'about', titleBn: 'ক্লাব পরিচিতি ও ঐতিহ্য', titleEn: 'About Club & Heritage', order: 4, isVisible: true },
  { id: 'sec-players', sectionKey: 'players', titleBn: 'খেলোয়াড় ও সদস্যবৃন্দ', titleEn: 'Players & Members', order: 5, isVisible: true },
  { id: 'sec-matches', sectionKey: 'matches', titleBn: 'ম্যাচ ফিক্সচার ও সময়সূচী', titleEn: 'Fixtures & Schedule', order: 6, isVisible: true },
  { id: 'sec-standings', sectionKey: 'standings', titleBn: 'পয়েন্ট টেবিল', titleEn: 'League Standings', order: 7, isVisible: true },
  { id: 'sec-news', sectionKey: 'news', titleBn: 'সর্বশেষ খবর ও নোটিশ', titleEn: 'Latest News & Notices', order: 8, isVisible: true },
  { id: 'sec-gallery', sectionKey: 'gallery', titleBn: 'ফটো ও ভিডিও গ্যালারি', titleEn: 'Photo & Video Gallery', order: 9, isVisible: true },
  { id: 'sec-achievements', sectionKey: 'achievements', titleBn: 'ট্রফি ও সম্মাননা', titleEn: 'Trophies & Honors', order: 10, isVisible: true },
  { id: 'sec-sponsors', sectionKey: 'sponsors', titleBn: 'অফিসিয়াল স্পন্সর ও পার্টনার', titleEn: 'Official Sponsors & Partners', order: 11, isVisible: true },
  { id: 'sec-contact', sectionKey: 'contact', titleBn: 'যোগাযোগ ও হোম গ্রাউন্ড', titleEn: 'Contact & Home Ground', order: 12, isVisible: true },
];

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    title: 'ছোটখাতা চৌপথী স্পোর্টস এন্ড কালচারাল ক্লাব',
    titleEn: 'Chhotokhata Choupathi Sports & Cultural Club',
    subtitle: 'ফুটবল, ক্রিকেট, ব্যাডমিন্টন, ভলিবল ও সাংস্কৃতিক ঐতিহ্যের মিলনমেলা',
    subtitleEn: 'Inspiring youth through athletic excellence and cultural heritage',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1600&auto=format&fit=crop',
    mobileImageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    primaryButtonText: 'ক্রীড়া ও কার্যক্রম দেখুন',
    primaryButtonLink: '#sports',
    secondaryButtonText: 'ম্যাচ সময়সূচী',
    secondaryButtonLink: '#matches',
    textAlignment: 'center',
    overlayOpacity: 65,
    order: 1,
    isActive: true,
  },
  {
    id: 'banner-2',
    title: 'টি-২০ ক্রিকেট ও ফুটবল টুর্নামেন্ট ২০২৬',
    titleEn: 'T20 Cricket & Football Tournaments 2026',
    subtitle: 'মাঠে লড়ছে উত্তরবঙ্গের উদীয়মান ক্রিকেট ও ফুটবল প্রতিভারা',
    subtitleEn: 'Celebrating competitive sports across regional divisions',
    imageUrl: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?q=80&w=1600&auto=format&fit=crop',
    mobileImageUrl: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?q=80&w=800&auto=format&fit=crop',
    primaryButtonText: 'পয়েন্ট টেবিল',
    primaryButtonLink: '#standings',
    secondaryButtonText: 'খেলোয়াড় তালিকা',
    secondaryButtonLink: '#players',
    textAlignment: 'left',
    overlayOpacity: 70,
    order: 2,
    isActive: true,
  },
  {
    id: 'banner-3',
    title: 'সাহিত্য, সংস্কৃতি ও যুব সমাজকল্যাণ',
    titleEn: 'Arts, Culture & Community Development',
    subtitle: 'বার্ষিক সাংস্কৃতিক উৎসব, নাটক ও মাদকবিরোধী সুস্থ যুবসমাজ বিনির্মাণে আমাদের অঙ্গীকার',
    subtitleEn: 'Enriching lives through traditional culture, drama, and youth empowerment',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
    mobileImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    primaryButtonText: 'ক্লাব পরিচিতি',
    primaryButtonLink: '#about',
    secondaryButtonText: 'যোগাযোগ ও সদস্যপদ',
    secondaryButtonLink: '#contact',
    textAlignment: 'center',
    overlayOpacity: 65,
    order: 3,
    isActive: true,
  },
];

export const DEFAULT_PLAYERS: Player[] = [
  // 1-2 Goalkeepers
  {
    id: 'p-1',
    fullName: 'Abdur Razzak',
    nameBn: 'আবদুর রাজ্জাক',
    jerseyNumber: 1,
    position: 'Goalkeeper',
    photoUrl: '',
    bio: 'ছোটখাতা স্পোর্টিং ক্লাবের মূল গোলরক্ষক। দ্রুত রিফ্লেক্স ও নির্ভরযোগ্য নেতৃত্ব।',
    appearances: 18,
    goals: 0,
    assists: 1,
    cleanSheets: 9,
    isActive: true,
    isCaptain: false,
    order: 1,
  },
  {
    id: 'p-2',
    fullName: 'Dalim',
    nameBn: 'ডালিম',
    jerseyNumber: 2,
    position: 'Goalkeeper',
    photoUrl: '',
    bio: 'বিশ্বস্ত দ্বিতীয় গোলরক্ষক। পেনাল্টি সেভ ও ওয়ান-অন-ওয়ান পরিস্থিতিতে দক্ষ।',
    appearances: 12,
    goals: 0,
    assists: 0,
    cleanSheets: 6,
    isActive: true,
    isCaptain: false,
    order: 2,
  },
  // 3-10 Defenders
  {
    id: 'p-3',
    fullName: 'Rasel',
    nameBn: 'রাসেল',
    jerseyNumber: 3,
    position: 'Defender',
    photoUrl: '',
    bio: 'লেফট ব্যাক। দুর্ভেদ্য রক্ষণ এবং দ্রুত গতিতে কাউন্টার অ্যাটাকে সক্ষম।',
    appearances: 22,
    goals: 2,
    assists: 5,
    cleanSheets: 10,
    isActive: true,
    isCaptain: false,
    order: 3,
  },
  {
    id: 'p-4',
    fullName: 'Sobuj',
    nameBn: 'সবুজ',
    jerseyNumber: 4,
    position: 'Defender',
    photoUrl: '',
    bio: 'সেন্ট্রাল ডিফেন্ডার। শারীরিক শক্তি, হেডিং ও নিখুঁত ইন্টারসেপশনের জন্য পরিচিত।',
    appearances: 24,
    goals: 3,
    assists: 2,
    cleanSheets: 12,
    isActive: true,
    isCaptain: false,
    order: 4,
  },
  {
    id: 'p-5',
    fullName: 'Rofiq',
    nameBn: 'রফিক',
    jerseyNumber: 5,
    position: 'Defender',
    photoUrl: '',
    bio: 'সেন্টার ব্যাক ও রক্ষণভাগের বিশ্বস্ত দুর্গ। ট্যাকলিংয়ে অত্যন্ত নিপুণ।',
    appearances: 25,
    goals: 1,
    assists: 3,
    cleanSheets: 11,
    isActive: true,
    isCaptain: false,
    order: 5,
  },
  {
    id: 'p-6',
    fullName: 'Midul',
    nameBn: 'মিদুল',
    jerseyNumber: 6,
    position: 'Defender',
    photoUrl: '',
    bio: 'রাইট ব্যাক ডিফেন্ডার। দ্রুত গতি ও উইং দিয়ে ওভারল্যাপিং ক্রসিংয়ে দক্ষ।',
    appearances: 20,
    goals: 1,
    assists: 4,
    cleanSheets: 9,
    isActive: true,
    isCaptain: false,
    order: 6,
  },
  {
    id: 'p-7',
    fullName: 'Munna',
    nameBn: 'মুন্না',
    jerseyNumber: 7,
    position: 'Defender',
    photoUrl: '',
    bio: 'বহুমুখী ডিফেন্ডার। রক্ষণভাগের যেকোনো পজিশনে সাবলীল পারফরম্যান্স প্রদর্শন করেন।',
    appearances: 19,
    goals: 2,
    assists: 2,
    cleanSheets: 8,
    isActive: true,
    isCaptain: false,
    order: 7,
  },
  {
    id: 'p-8',
    fullName: 'Arif',
    nameBn: 'আরিফ',
    jerseyNumber: 8,
    position: 'Defender',
    photoUrl: '',
    bio: 'অভিজ্ঞ ডিফেন্ডার। শান্ত মেজাজে প্রতিপক্ষের আক্রমণ নস্যাৎ করতে পারদর্শী।',
    appearances: 26,
    goals: 1,
    assists: 4,
    cleanSheets: 13,
    isActive: true,
    isCaptain: false,
    order: 8,
  },
  {
    id: 'p-9',
    fullName: 'Saiful',
    nameBn: 'সাইফুল',
    jerseyNumber: 9,
    position: 'Defender',
    photoUrl: '',
    bio: 'রক্ষণভাগের অতন্দ্র প্রহরী। প্রতিপক্ষের স্ট্রাইকারদের আটকে রাখতে দক্ষ।',
    appearances: 17,
    goals: 0,
    assists: 3,
    cleanSheets: 8,
    isActive: true,
    isCaptain: false,
    order: 9,
  },
  {
    id: 'p-10',
    fullName: 'Rofiqul',
    nameBn: 'রফিকুল',
    jerseyNumber: 10,
    position: 'Defender',
    photoUrl: '',
    bio: 'ক্লাবের সিনিয়র ডিফেন্ডার ও দলনায়ক। দীর্ঘদিনের অভিজ্ঞতা নিয়ে মাঠ পরিচালনা করেন।',
    appearances: 30,
    goals: 4,
    assists: 6,
    cleanSheets: 15,
    isActive: true,
    isCaptain: true,
    order: 10,
  },
  // 11-14 Midfielders
  {
    id: 'p-11',
    fullName: 'Shuvo',
    nameBn: 'শুভ',
    jerseyNumber: 11,
    position: 'Midfielder',
    photoUrl: '',
    bio: 'সেন্ট্রাল মিডফিল্ডার। মাঠে দুর্দান্ত বল নিয়ন্ত্রণ ও সঠিক পাসিংয়ে খেলা তৈরি করেন।',
    appearances: 25,
    goals: 5,
    assists: 12,
    cleanSheets: 0,
    isActive: true,
    isCaptain: false,
    order: 11,
  },
  {
    id: 'p-12',
    fullName: 'Nayeem',
    nameBn: 'নাঈম',
    jerseyNumber: 12,
    position: 'Midfielder',
    photoUrl: '',
    bio: 'বক্স-টু-বক্স মিডফিল্ডার। আক্রমণ ও রক্ষণ উভয় ক্ষেত্রেই অক্লান্ত পরিশ্রমী।',
    appearances: 22,
    goals: 4,
    assists: 9,
    cleanSheets: 0,
    isActive: true,
    isCaptain: false,
    order: 12,
  },
  {
    id: 'p-13',
    fullName: 'Milon',
    nameBn: 'মিলন',
    jerseyNumber: 13,
    position: 'Midfielder',
    photoUrl: '',
    bio: 'ডিফেন্সিভ মিডফিল্ডার। প্রতিপক্ষের বল ছিনিয়ে নিয়ে প্রতি-আক্রমণ সূচনা করেন।',
    appearances: 20,
    goals: 2,
    assists: 7,
    cleanSheets: 0,
    isActive: true,
    isCaptain: false,
    order: 13,
  },
  {
    id: 'p-14',
    fullName: 'Arif jr',
    nameBn: 'আরিফ জুনিয়র',
    jerseyNumber: 14,
    position: 'Midfielder',
    photoUrl: '',
    bio: 'তরুণ প্রতিভাবান মিডফিল্ডার। গতিশীল ড্রিবলিং ও সৃষ্টিশীল ফুটবলে পারদর্শী।',
    appearances: 16,
    goals: 3,
    assists: 8,
    cleanSheets: 0,
    isActive: true,
    isCaptain: false,
    order: 14,
  },
  // 15-17 Attacking Midfielders
  {
    id: 'p-15',
    fullName: 'Sadikin',
    nameBn: 'সাদিকিন',
    jerseyNumber: 15,
    position: 'Attacking Midfielder',
    photoUrl: '',
    bio: 'প্লেমেকার ও আক্রমণাত্মক মিডফিল্ডার। চোখ ধাঁধানো থ্রু-বল ও নিখুঁত ফ্রি-কিক বিশেষজ্ঞ।',
    appearances: 24,
    goals: 9,
    assists: 15,
    cleanSheets: 0,
    isActive: true,
    isCaptain: false,
    order: 15,
  },
  {
    id: 'p-16',
    fullName: 'Alim',
    nameBn: 'আলিম',
    jerseyNumber: 16,
    position: 'Attacking Midfielder',
    photoUrl: '',
    bio: 'উইঙ্গার ও অ্যাটাকিং মিডফিল্ডার। ক্ষিপ্র ড্রিবলিংয়ে প্রতিপক্ষের রক্ষণ ছিন্নভিন্ন করেন।',
    appearances: 21,
    goals: 8,
    assists: 11,
    cleanSheets: 0,
    isActive: true,
    isCaptain: false,
    order: 16,
  },
  {
    id: 'p-17',
    fullName: 'Najmul',
    nameBn: 'নাজমুল',
    jerseyNumber: 17,
    position: 'Attacking Midfielder',
    photoUrl: '',
    bio: 'আক্রমণভাগের প্রধান চাবিকাঠি। নিখুঁত দূরপাল্লার শট ও উইং প্লেতে পারদর্শী।',
    appearances: 23,
    goals: 7,
    assists: 10,
    cleanSheets: 0,
    isActive: true,
    isCaptain: false,
    order: 17,
  },
  // 18-20 Strikers
  {
    id: 'p-18',
    fullName: 'Alamin',
    nameBn: 'আলামিন',
    jerseyNumber: 18,
    position: 'Striker',
    photoUrl: '',
    bio: 'প্রধান স্ট্রাইকার ও শীর্ষ গোলদাতা। দ্রুত সিদ্ধান্ত গ্রহণ ও ক্লিনিক্যাল ফিনিশিংয়ে অনন্য।',
    appearances: 26,
    goals: 19,
    assists: 7,
    cleanSheets: 0,
    isActive: true,
    isCaptain: false,
    order: 18,
  },
  {
    id: 'p-19',
    fullName: 'Masud',
    nameBn: 'মাসুদ',
    jerseyNumber: 19,
    position: 'Striker',
    photoUrl: '',
    bio: 'গতিশীল সেন্টার ফরোয়ার্ড। বল কন্ট্রোল ও গতি দিয়ে যেকোনো মুহূর্তে গোল করতে পারেন।',
    appearances: 22,
    goals: 14,
    assists: 6,
    cleanSheets: 0,
    isActive: true,
    isCaptain: false,
    order: 19,
  },
  {
    id: 'p-20',
    fullName: 'Mijanur',
    nameBn: 'মিজানুর',
    jerseyNumber: 20,
    position: 'Striker',
    photoUrl: '',
    bio: 'শারীরিক শক্তিসম্পন্ন স্ট্রাইকার। হেডে গোল করা ও বক্সে বল হোল্ড করে আক্রমণ বাড়াতে দক্ষ।',
    appearances: 19,
    goals: 11,
    assists: 5,
    cleanSheets: 0,
    isActive: true,
    isCaptain: false,
    order: 20,
  },
];

// Tactical Formation Slot Configurations
export const FORMATION_TEMPLATES: Record<
  FormationType,
  { label: string; description: string; slots: Omit<LineupSlot, 'playerId'>[] }
> = {
  '4-3-3': {
    label: '4-3-3 Attacking (আক্রমণাত্মক)',
    description: '৪ ডিফেন্ডার, ৩ মিডফিল্ডার এবং ৩ ফরোয়ার্ড আক্রমণাত্মক বিন্যাস',
    slots: [
      { slotId: 'gk', slotLabel: 'GK', positionCategory: 'Goalkeeper', x: 50, y: 88 },
      { slotId: 'lb', slotLabel: 'LB', positionCategory: 'Defender', x: 16, y: 72 },
      { slotId: 'lcb', slotLabel: 'CB', positionCategory: 'Defender', x: 38, y: 74 },
      { slotId: 'rcb', slotLabel: 'CB', positionCategory: 'Defender', x: 62, y: 74 },
      { slotId: 'rb', slotLabel: 'RB', positionCategory: 'Defender', x: 84, y: 72 },
      { slotId: 'lcm', slotLabel: 'CM', positionCategory: 'Midfielder', x: 28, y: 48 },
      { slotId: 'cam', slotLabel: 'CAM', positionCategory: 'Attacking Midfielder', x: 50, y: 44 },
      { slotId: 'rcm', slotLabel: 'CM', positionCategory: 'Midfielder', x: 72, y: 48 },
      { slotId: 'lw', slotLabel: 'LW', positionCategory: 'Attacking Midfielder', x: 20, y: 22 },
      { slotId: 'st', slotLabel: 'ST', positionCategory: 'Striker', x: 50, y: 16 },
      { slotId: 'rw', slotLabel: 'RW', positionCategory: 'Attacking Midfielder', x: 80, y: 22 },
    ],
  },
  '4-4-2': {
    label: '4-4-2 Classic (ঐতিহ্যবাহী)',
    description: '৪ ডিফেন্ডার, ৪ মিডফিল্ডার এবং ২ স্ট্রাইকারের সুষম বিন্যাস',
    slots: [
      { slotId: 'gk', slotLabel: 'GK', positionCategory: 'Goalkeeper', x: 50, y: 88 },
      { slotId: 'lb', slotLabel: 'LB', positionCategory: 'Defender', x: 16, y: 72 },
      { slotId: 'lcb', slotLabel: 'CB', positionCategory: 'Defender', x: 38, y: 74 },
      { slotId: 'rcb', slotLabel: 'CB', positionCategory: 'Defender', x: 62, y: 74 },
      { slotId: 'rb', slotLabel: 'RB', positionCategory: 'Defender', x: 84, y: 72 },
      { slotId: 'lm', slotLabel: 'LM', positionCategory: 'Midfielder', x: 18, y: 48 },
      { slotId: 'lcm', slotLabel: 'CM', positionCategory: 'Midfielder', x: 40, y: 50 },
      { slotId: 'rcm', slotLabel: 'CM', positionCategory: 'Midfielder', x: 60, y: 50 },
      { slotId: 'rm', slotLabel: 'RM', positionCategory: 'Midfielder', x: 82, y: 48 },
      { slotId: 'lst', slotLabel: 'ST', positionCategory: 'Striker', x: 36, y: 18 },
      { slotId: 'rst', slotLabel: 'ST', positionCategory: 'Striker', x: 64, y: 18 },
    ],
  },
  '3-5-2': {
    label: '3-5-2 Tactical (কৌশলগত মিডফিল্ড)',
    description: '৩ সেন্ট্রাল ডিফেন্ডার, ৫ মিডফিল্ডার ও ২ স্ট্রাইকারের নিয়ন্ত্রণমূলক ফর্মেশন',
    slots: [
      { slotId: 'gk', slotLabel: 'GK', positionCategory: 'Goalkeeper', x: 50, y: 88 },
      { slotId: 'lcb', slotLabel: 'CB', positionCategory: 'Defender', x: 26, y: 74 },
      { slotId: 'cb', slotLabel: 'CB', positionCategory: 'Defender', x: 50, y: 75 },
      { slotId: 'rcb', slotLabel: 'CB', positionCategory: 'Defender', x: 74, y: 74 },
      { slotId: 'lwb', slotLabel: 'LWB', positionCategory: 'Midfielder', x: 14, y: 52 },
      { slotId: 'lcm', slotLabel: 'CM', positionCategory: 'Midfielder', x: 36, y: 50 },
      { slotId: 'cam', slotLabel: 'CAM', positionCategory: 'Attacking Midfielder', x: 50, y: 38 },
      { slotId: 'rcm', slotLabel: 'CM', positionCategory: 'Midfielder', x: 64, y: 50 },
      { slotId: 'rwb', slotLabel: 'RWB', positionCategory: 'Midfielder', x: 86, y: 52 },
      { slotId: 'lst', slotLabel: 'ST', positionCategory: 'Striker', x: 36, y: 18 },
      { slotId: 'rst', slotLabel: 'ST', positionCategory: 'Striker', x: 64, y: 18 },
    ],
  },
  '4-2-3-1': {
    label: '4-2-3-1 Modern (আধুনিক আক্রমণ)',
    description: 'ডাবল পিভট ডিফেন্সিভ মিডফিল্ড ও ৩ জন আক্রমণাত্মক মিডফিল্ডার',
    slots: [
      { slotId: 'gk', slotLabel: 'GK', positionCategory: 'Goalkeeper', x: 50, y: 88 },
      { slotId: 'lb', slotLabel: 'LB', positionCategory: 'Defender', x: 16, y: 74 },
      { slotId: 'lcb', slotLabel: 'CB', positionCategory: 'Defender', x: 38, y: 75 },
      { slotId: 'rcb', slotLabel: 'CB', positionCategory: 'Defender', x: 62, y: 75 },
      { slotId: 'rb', slotLabel: 'RB', positionCategory: 'Defender', x: 84, y: 74 },
      { slotId: 'ldm', slotLabel: 'DM', positionCategory: 'Midfielder', x: 36, y: 56 },
      { slotId: 'rdm', slotLabel: 'DM', positionCategory: 'Midfielder', x: 64, y: 56 },
      { slotId: 'lam', slotLabel: 'LAM', positionCategory: 'Attacking Midfielder', x: 22, y: 36 },
      { slotId: 'cam', slotLabel: 'CAM', positionCategory: 'Attacking Midfielder', x: 50, y: 34 },
      { slotId: 'ram', slotLabel: 'RAM', positionCategory: 'Attacking Midfielder', x: 78, y: 36 },
      { slotId: 'st', slotLabel: 'ST', positionCategory: 'Striker', x: 50, y: 16 },
    ],
  },
  '3-4-3': {
    label: '3-4-3 Wide Wing (উইং আক্রমণ)',
    description: 'উইং প্লেয়ার ও ফ্রন্ট থ্রির গতিময় আক্রমণাত্মক ট্যাকটিক্স',
    slots: [
      { slotId: 'gk', slotLabel: 'GK', positionCategory: 'Goalkeeper', x: 50, y: 88 },
      { slotId: 'lcb', slotLabel: 'CB', positionCategory: 'Defender', x: 26, y: 74 },
      { slotId: 'cb', slotLabel: 'CB', positionCategory: 'Defender', x: 50, y: 75 },
      { slotId: 'rcb', slotLabel: 'CB', positionCategory: 'Defender', x: 74, y: 74 },
      { slotId: 'lm', slotLabel: 'LM', positionCategory: 'Midfielder', x: 16, y: 48 },
      { slotId: 'lcm', slotLabel: 'CM', positionCategory: 'Midfielder', x: 38, y: 48 },
      { slotId: 'rcm', slotLabel: 'CM', positionCategory: 'Midfielder', x: 62, y: 48 },
      { slotId: 'rm', slotLabel: 'RM', positionCategory: 'Midfielder', x: 84, y: 48 },
      { slotId: 'lw', slotLabel: 'LW', positionCategory: 'Attacking Midfielder', x: 22, y: 22 },
      { slotId: 'st', slotLabel: 'ST', positionCategory: 'Striker', x: 50, y: 16 },
      { slotId: 'rw', slotLabel: 'RW', positionCategory: 'Attacking Midfielder', x: 78, y: 22 },
    ],
  },
};

/**
 * Generate a complete default 11 Starting XI + 9 Substitutes lineup from the squad
 */
export function generateDefaultLineup(
  matchId: string,
  squad: Player[] = DEFAULT_PLAYERS,
  formation: FormationType = '4-3-3',
  teamName = 'Chhotokhata Sporting Club',
  opponentName = 'Opponent Team'
): MatchLineup {
  const template = FORMATION_TEMPLATES[formation] || FORMATION_TEMPLATES['4-3-3'];
  const playersPool = [...squad].sort((a, b) => a.order - b.order);
  const usedIds = new Set<string>();

  // Slot assignment by position priority
  const assignedSlots: LineupSlot[] = template.slots.map((slot) => {
    // Find matching candidate
    const candidate = playersPool.find(
      (p) => !usedIds.has(p.id) && (p.position === slot.positionCategory || (slot.positionCategory === 'Attacking Midfielder' && p.position === 'Midfielder'))
    ) || playersPool.find((p) => !usedIds.has(p.id));

    if (candidate) {
      usedIds.add(candidate.id);
      return {
        ...slot,
        playerId: candidate.id,
        playerName: candidate.fullName,
        nameBn: candidate.nameBn,
        jerseyNumber: candidate.jerseyNumber,
        photoUrl: candidate.photoUrl || '',
        isCaptain: candidate.isCaptain,
      };
    }
    return {
      ...slot,
      playerId: null,
    };
  });

  // Remaining players are on the bench substitutes
  const substitutes = playersPool.filter((p) => !usedIds.has(p.id)).map((p) => p.id);

  return {
    id: matchId,
    matchId,
    formation,
    teamName,
    opponentName,
    startingXI: assignedSlots,
    substitutes,
    coachName: 'প্রধান কোচ ও টেকনিক্যাল টিম',
    tacticalNotes: 'হাই-প্রেসিং ও উইং দিয়ে গতিশীল আক্রমণ। ডিফেন্সে নিবিড় শৃঙ্খলা।',
    updatedAt: new Date().toISOString(),
  };
}

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
    sport: 'football',
    homeTeamName: 'Chhotokhata Sporting Club',
    homeTeamLogo: DEFAULT_LOGO_SVG,
    awayTeamName: 'Dimla Football Academy',
    awayTeamLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=200&auto=format&fit=crop',
    matchDate: '2026-11-05',
    matchTime: '15:30',
    venue: 'ছোটখাতা ফুটবল গ্রাউন্ড',
    tournamentName: 'উত্তরবঙ্গ গোল্ডকাপ ফুটবল ২০২৬',
    matchType: 'Tournament',
    status: 'Upcoming',
    posterUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop',
    report: 'টুর্নামেন্টের কোয়ার্টার ফাইনাল ম্যাচ। তীব্র প্রতিদ্বন্দ্বিতাপূর্ণ খেলার প্রত্যাশা।',
  },
  {
    id: 'm-2',
    sport: 'football',
    homeTeamName: 'Domar United Club',
    homeTeamLogo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=200&auto=format&fit=crop',
    awayTeamName: 'Chhotokhata Sporting Club',
    awayTeamLogo: DEFAULT_LOGO_SVG,
    matchDate: '2026-10-20',
    matchTime: '15:00',
    venue: 'ডোমার স্টেডিয়াম মাঠ',
    tournamentName: 'নীলফামারী জেলা লিগ ২০২৬',
    matchType: 'League',
    homeScore: 1,
    awayScore: 3,
    status: 'Completed',
    scorers: 'Rafiqul (18\', 72\'), Babu (54\') [CSC]; Jahid (41\') [DUC]',
    report: 'ছোটখাতা স্পোর্টিং ক্লাব অনবদ্য পারফরম্যান্সে ডোমার ইউনাইটেডকে ৩-১ গোলে পরাজিত করে সেমিফাইনালে তাদের অবস্থান দৃঢ় করেছে। রফিকুল জোড়া গোল করেন।',
  },
  {
    id: 'm-3',
    sport: 'football',
    homeTeamName: 'Chhotokhata Sporting Club',
    homeTeamLogo: DEFAULT_LOGO_SVG,
    awayTeamName: 'Nilphamari Sporting Association',
    awayTeamLogo: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=200&auto=format&fit=crop',
    matchDate: '2026-10-12',
    matchTime: '15:30',
    venue: 'ছোটখাতা ফুটবল গ্রাউন্ড',
    tournamentName: 'উত্তরবঙ্গ গোল্ডকাপ ফুটবল ২০২৬',
    matchType: 'Tournament',
    homeScore: 2,
    awayScore: 0,
    status: 'Completed',
    scorers: 'Ariful (35\'), Rafiqul (88\') [CSC]',
    report: 'হোম ক্রাউডের সামনে দুর্দান্ত জয়। আরিফুল ও অধিনায়ক রফিকুলের গোলে ২-০ ব্যবধানে জয় পায় ছোটখাতা।',
  },
  {
    id: 'm-cricket-1',
    sport: 'cricket',
    homeTeamName: 'ছোটখাতা চৌপথী ক্রিকেট একাদশ',
    homeTeamLogo: DEFAULT_LOGO_SVG,
    awayTeamName: 'তিস্তা রয়্যালস ক্লাব',
    awayTeamLogo: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?q=80&w=200&auto=format&fit=crop',
    matchDate: '2026-10-25',
    matchTime: '10:00',
    venue: 'ছোটখাতা চৌপথী স্পোর্টস এরিনা',
    tournamentName: 'নীলফামারী জেলা টি-২০ চ্যাম্পিয়নশিপ ২০২৬',
    matchType: 'Tournament',
    homeScore: 168,
    awayScore: 156,
    homeScoreDisplay: '১৬৮/৫ (২০ ওভ.)',
    awayScoreDisplay: '১৫৬/৮ (২০ ওভ.)',
    status: 'Completed',
    scorers: 'ম্যান অব দ্য ম্যাচ: রফিক (৫২ রান, ৩ উইকেট)',
    report: '১২ রানে রোমাঞ্চকর জয় ছিনিয়ে নিল ছোটখাতা চৌপথী একাদশ। শেষ ওভারে দুরন্ত বোলিংয়ে ম্যাচ নিজেদের করে নেয় দল।',
  },
  {
    id: 'm-badminton-1',
    sport: 'badminton',
    homeTeamName: 'ছোটখাতা চৌপথী শাটলার জুটি',
    homeTeamLogo: DEFAULT_LOGO_SVG,
    awayTeamName: 'ডোমার ব্যাডমিন্টন ক্লাব',
    awayTeamLogo: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=200&auto=format&fit=crop',
    matchDate: '2026-10-18',
    matchTime: '19:00',
    venue: 'ক্লাব ইনডোর কোর্ট, চৌপথী',
    tournamentName: 'শীতকালীন জেলা ব্যাডমিন্টন ট্রফি',
    matchType: 'Tournament',
    homeScore: 2,
    awayScore: 1,
    homeScoreDisplay: '২ সেট (২১-১৯, ১৮-২১, ২১-১৬)',
    awayScoreDisplay: '১ সেট',
    status: 'Completed',
    scorers: 'চ্যাম্পিয়ন: সাদিকিন ও মিলন জুটি',
    report: 'তিন সেটের রুদ্ধশ্বাস ফাইনালে দুর্দান্ত স্ম্যাশ ও কোর্ট কভারেজে জয় নিশ্চিত করে ছোটখাতা চৌপথী জুটি।',
  },
  {
    id: 'm-cultural-1',
    sport: 'cultural',
    homeTeamName: 'ছোটখাতা চৌপথী স্পোর্টস এন্ড কালচারাল ক্লাব',
    homeTeamLogo: DEFAULT_LOGO_SVG,
    awayTeamName: 'আমন্ত্রিত সাংস্কৃতিক নাট্যদল',
    awayTeamLogo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop',
    matchDate: '2026-11-28',
    matchTime: '18:00',
    venue: 'ক্লাব প্রাঙ্গণ ও উন্মুক্ত সাংস্কৃতিক মঞ্চ',
    tournamentName: 'বার্ষিক সাংস্কৃতিক উৎসব ও নাট্য সন্ধ্যা ২০২৬',
    matchType: 'Custom',
    status: 'Upcoming',
    roundOrEventDetails: 'নাটক, আবৃত্তি, লোকসংগীত ও কৃতি ক্রীড়াবিদ সংবর্ধনা',
    posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    report: 'স্থানীয় গুণীজন, প্রবীণ সদস্য ও যুবসমাজের অংশগ্রহণে অনুষ্ঠিত হতে যাচ্ছে বার্ষিক ঐতিহ্যবাহী সাংস্কৃতিক মহোৎসব।',
  },
  {
    id: 'm-4',
    sport: 'football',
    homeTeamName: 'Chhotokhata Sporting Club',
    homeTeamLogo: DEFAULT_LOGO_SVG,
    awayTeamName: 'Dimla Veteran XI',
    awayTeamLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=200&auto=format&fit=crop',
    matchDate: '2026-11-18',
    matchTime: '16:00',
    venue: 'ছোটখাতা উচ্চ বিদ্যালয় মাঠ',
    tournamentName: 'প্রীতি ফুটবল ম্যাচ (Club Friendly)',
    matchType: 'Friendly',
    status: 'Upcoming',
    posterUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    report: 'ক্লাবের তরুণ স্কোয়াডের দক্ষতা বৃদ্ধির লক্ষ্যে প্রীতি ফুটবল ম্যাচ।',
  },
  {
    id: 'm-5',
    sport: 'football',
    homeTeamName: 'Chhotokhata Sporting Club',
    homeTeamLogo: DEFAULT_LOGO_SVG,
    awayTeamName: 'Rongpur City FC',
    awayTeamLogo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=200&auto=format&fit=crop',
    matchDate: '2026-11-25',
    matchTime: '15:00',
    venue: 'ছোটখাতা স্পোর্টিং ক্লাব এরিনা',
    tournamentName: 'আমন্ত্রণমূলক বিশেষ কাপ (Custom Cup)',
    matchType: 'Custom',
    status: 'Upcoming',
    posterUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
    report: 'বিশেষ আমন্ত্রণে রংপুর সিটি এফসি ক্লাবের বিপক্ষে উত্তেজনাপূর্ণ লড়াই।',
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
    coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
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
    photoUrl: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=600&auto=format&fit=crop',
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
    url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1000&auto=format&fit=crop',
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
      const data = snap.data() as Partial<SiteSettings>;
      return {
        ...DEFAULT_SETTINGS,
        ...data,
        logoUrl: data.logoUrl && data.logoUrl.trim() !== '' ? data.logoUrl : DEFAULT_SETTINGS.logoUrl,
      };
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
    throw error;
  }
}

function sanitizeBanner(data: Banner, id: string): Banner {
  const rawUrl = (data.imageUrl || '').trim();
  const isDeadUrl = !rawUrl || rawUrl.includes('photo-1508098682722');
  const validImageUrl = isDeadUrl ? DEFAULT_BANNERS[0].imageUrl : rawUrl;

  const rawMobileUrl = (data.mobileImageUrl || '').trim();
  const isDeadMobile = rawMobileUrl.includes('photo-1508098682722');
  const validMobileUrl = isDeadMobile ? (DEFAULT_BANNERS[0].mobileImageUrl || '') : rawMobileUrl;

  return {
    ...data,
    id,
    order: Number(data.order) || 1,
    overlayOpacity: Number(data.overlayOpacity) ?? 65,
    isActive: data.isActive !== false,
    imageUrl: validImageUrl,
    mobileImageUrl: validMobileUrl,
  };
}

export async function fetchBanners(): Promise<Banner[]> {
  const path = 'banners';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('order', 'asc')));
    if (!snap.empty) {
      return snap.docs.map((d) => sanitizeBanner(d.data() as Banner, d.id));
    }
    // Fallback if query returns empty due to missing 'order' field on documents
    const simpleSnap = await getDocs(collection(db, path));
    if (!simpleSnap.empty) {
      const items = simpleSnap.docs.map((d) => sanitizeBanner(d.data() as Banner, d.id));
      items.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      return items;
    }
    return DEFAULT_BANNERS;
  } catch (error) {
    console.warn('Querying banners with order failed, falling back to simple collection get:', error);
    try {
      const simpleSnap = await getDocs(collection(db, path));
      if (!simpleSnap.empty) {
        const items = simpleSnap.docs.map((d) => sanitizeBanner(d.data() as Banner, d.id));
        items.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
        return items;
      }
    } catch (e2) {
      console.warn('Using default banners fallback:', e2);
    }
    return DEFAULT_BANNERS;
  }
}

export async function saveBanner(banner: Banner): Promise<void> {
  const path = `banners/${banner.id}`;
  try {
    const payload: Banner = {
      ...banner,
      order: Number(banner.order) || 1,
      overlayOpacity: Number(banner.overlayOpacity) ?? 65,
      isActive: banner.isActive !== false,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'banners', banner.id), payload, { merge: true });
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
      return snap.docs.map((d) => {
        const data = d.data() as Player;
        return {
          ...data,
          id: d.id,
          photoUrl: data.photoUrl ? data.photoUrl.trim() : '',
        };
      });
    }
    const metaSnap = await getDoc(doc(db, 'system', 'playersMeta'));
    if (metaSnap.exists()) {
      return [];
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
    await setDoc(doc(db, 'system', 'playersMeta'), { initialized: true, updatedAt: new Date().toISOString() }, { merge: true });
    await logAdminActivity('Save Player', `Saved player ${player.fullName} (#${player.jerseyNumber})`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function deletePlayer(id: string): Promise<void> {
  const path = `players/${id}`;
  try {
    const snap = await getDocs(collection(db, 'players'));
    if (snap.empty) {
      for (const p of DEFAULT_PLAYERS) {
        if (p.id !== id) {
          await setDoc(doc(db, 'players', p.id), p);
        }
      }
      await setDoc(doc(db, 'system', 'playersMeta'), { initialized: true, updatedAt: new Date().toISOString() });
    } else {
      await deleteDoc(doc(db, 'players', id));
      const checkSnap = await getDocs(collection(db, 'players'));
      if (checkSnap.empty) {
        await setDoc(doc(db, 'system', 'playersMeta'), { initialized: true, updatedAt: new Date().toISOString() });
      }
    }
    await logAdminActivity('Delete Player', `Deleted player ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
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
    const metaSnap = await getDoc(doc(db, 'system', 'matchesMeta'));
    if (metaSnap.exists()) {
      return [];
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
    await setDoc(doc(db, 'system', 'matchesMeta'), { initialized: true, updatedAt: new Date().toISOString() }, { merge: true });
    await logAdminActivity('Save Match', `Saved match: ${match.homeTeamName} vs ${match.awayTeamName} (${match.status})`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function deleteMatch(id: string): Promise<void> {
  const path = `matches/${id}`;
  try {
    const snap = await getDocs(collection(db, 'matches'));
    if (snap.empty) {
      // First time delete: seed the remaining default matches so this deleted match is genuinely eliminated
      for (const m of DEFAULT_MATCHES) {
        if (m.id !== id) {
          await setDoc(doc(db, 'matches', m.id), m);
        }
      }
      await setDoc(doc(db, 'system', 'matchesMeta'), { initialized: true, updatedAt: new Date().toISOString() });
    } else {
      await deleteDoc(doc(db, 'matches', id));
      const checkSnap = await getDocs(collection(db, 'matches'));
      if (checkSnap.empty) {
        await setDoc(doc(db, 'system', 'matchesMeta'), { initialized: true, updatedAt: new Date().toISOString() });
      }
    }
    // Also remove match lineup if exists
    try {
      await deleteDoc(doc(db, 'matchLineups', id));
    } catch {
      // ignore
    }
    await logAdminActivity('Delete Match', `Deleted match ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// -------------------------------------------------------------
// SQUAD & MATCH LINEUP FIRESTORE FUNCTIONS
// -------------------------------------------------------------

export async function fetchMatchLineup(matchId: string): Promise<MatchLineup | null> {
  const path = `matchLineups/${matchId}`;
  try {
    const snap = await getDoc(doc(db, 'matchLineups', matchId));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as MatchLineup;
    }
    return null;
  } catch (error) {
    console.warn(`Could not fetch lineup for match ${matchId}:`, error);
    return null;
  }
}

export async function fetchAllMatchLineups(): Promise<MatchLineup[]> {
  const path = 'matchLineups';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MatchLineup));
    }
    return [];
  } catch (error) {
    console.warn('Could not fetch match lineups:', error);
    return [];
  }
}

export async function saveMatchLineup(lineup: MatchLineup): Promise<void> {
  const docId = lineup.id || lineup.matchId;
  const path = `matchLineups/${docId}`;
  try {
    const dataToSave: MatchLineup = {
      ...lineup,
      id: docId,
      matchId: lineup.matchId || docId,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'matchLineups', docId), dataToSave, { merge: true });
    await logAdminActivity(
      'Save Match Lineup',
      `Saved formation ${lineup.formation} for match: ${lineup.teamName} vs ${lineup.opponentName || 'Opponent'}`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function deleteMatchLineup(matchId: string): Promise<void> {
  const path = `matchLineups/${matchId}`;
  try {
    await deleteDoc(doc(db, 'matchLineups', matchId));
    await logAdminActivity('Delete Match Lineup', `Deleted lineup for match ID: ${matchId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// -------------------------------------------------------------
// CUSTOM SQUAD (দল তৈরি করুন) FIRESTORE FUNCTIONS
// -------------------------------------------------------------

export async function fetchCustomSquads(): Promise<CustomSquad[]> {
  const path = 'customSquads';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CustomSquad));
      list.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
      return list;
    }
    return [];
  } catch (error) {
    console.warn('Could not fetch custom squads from Firestore:', error);
    return [];
  }
}

export async function fetchCustomSquad(id: string): Promise<CustomSquad | null> {
  const path = `customSquads/${id}`;
  try {
    const snap = await getDoc(doc(db, 'customSquads', id));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as CustomSquad;
    }
    return null;
  } catch (error) {
    console.warn(`Could not fetch custom squad ${id}:`, error);
    return null;
  }
}

export async function saveCustomSquad(squad: CustomSquad): Promise<void> {
  const docId = squad.id || `squad_${Date.now()}`;
  const path = `customSquads/${docId}`;
  try {
    const payload: CustomSquad = {
      ...squad,
      id: docId,
      updatedAt: new Date().toISOString(),
      createdAt: squad.createdAt || new Date().toISOString(),
    };
    await setDoc(doc(db, 'customSquads', docId), payload, { merge: true });
    await logAdminActivity('Save Custom Squad', `Saved custom friendly squad: ${squad.squadName} (${squad.formation})`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function deleteCustomSquad(id: string): Promise<void> {
  const path = `customSquads/${id}`;
  try {
    await deleteDoc(doc(db, 'customSquads', id));
    await logAdminActivity('Delete Custom Squad', `Deleted custom squad ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Synchronize the official 20-player squad to Firestore.
 * Preserves any existing player records and photos without duplicate IDs.
 */
export async function syncOfficialSquadToFirestore(
  officialPlayers: Player[] = DEFAULT_PLAYERS
): Promise<{ reused: number; created: number; reusedPlayers: string[]; createdPlayers: string[] }> {
  try {
    const snap = await getDocs(collection(db, 'players'));
    const existingDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Player));

    let reused = 0;
    let created = 0;
    const reusedPlayers: string[] = [];
    const createdPlayers: string[] = [];

    for (const official of officialPlayers) {
      // Check if existing record matches by id, fullName, or jerseyNumber
      const existing = existingDocs.find(
        (p) =>
          p.id === official.id ||
          p.fullName.trim().toLowerCase() === official.fullName.trim().toLowerCase() ||
          p.jerseyNumber === official.jerseyNumber
      );

      if (existing) {
        reused++;
        reusedPlayers.push(`${official.jerseyNumber}. ${official.fullName} (ID: ${existing.id})`);
        const updatedData: Player = {
          ...official,
          id: existing.id,
          photoUrl: existing.photoUrl && existing.photoUrl.trim() !== '' ? existing.photoUrl : official.photoUrl || '',
          appearances: existing.appearances ?? official.appearances,
          goals: existing.goals ?? official.goals,
          assists: existing.assists ?? official.assists,
          cleanSheets: existing.cleanSheets ?? official.cleanSheets,
        };
        await setDoc(doc(db, 'players', existing.id), updatedData, { merge: true });
      } else {
        created++;
        createdPlayers.push(`${official.jerseyNumber}. ${official.fullName} (ID: ${official.id})`);
        await setDoc(doc(db, 'players', official.id), official, { merge: true });
      }
    }

    await logAdminActivity(
      'Sync Squad',
      `Synchronized official 20-player squad: ${reused} reused, ${created} created in Firestore.`
    );

    return { reused, created, reusedPlayers, createdPlayers };
  } catch (error) {
    console.error('Error synchronizing official squad:', error);
    throw error;
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

export async function fetchSportCategories(): Promise<SportCategory[]> {
  const path = 'sportCategories';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('order', 'asc')));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SportCategory));
    }
    const metaSnap = await getDoc(doc(db, 'system', 'sportCategoriesMeta'));
    if (metaSnap.exists()) {
      return [];
    }
    return DEFAULT_SPORT_CATEGORIES;
  } catch (error) {
    console.warn('Using default sport categories fallback:', error);
    return DEFAULT_SPORT_CATEGORIES;
  }
}

export async function saveSportCategory(cat: SportCategory): Promise<void> {
  const path = `sportCategories/${cat.id}`;
  try {
    await setDoc(doc(db, 'sportCategories', cat.id), cat, { merge: true });
    await setDoc(doc(db, 'system', 'sportCategoriesMeta'), { initialized: true, updatedAt: new Date().toISOString() }, { merge: true });
    await logAdminActivity('Save Sport Category', `Saved sport category: ${cat.nameBn} (${cat.key})`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function deleteSportCategory(id: string): Promise<void> {
  const path = `sportCategories/${id}`;
  try {
    const snap = await getDocs(collection(db, 'sportCategories'));
    if (snap.empty) {
      for (const cat of DEFAULT_SPORT_CATEGORIES) {
        if (cat.id !== id) {
          await setDoc(doc(db, 'sportCategories', cat.id), cat);
        }
      }
      await setDoc(doc(db, 'system', 'sportCategoriesMeta'), { initialized: true, updatedAt: new Date().toISOString() });
    } else {
      await deleteDoc(doc(db, 'sportCategories', id));
      const checkSnap = await getDocs(collection(db, 'sportCategories'));
      if (checkSnap.empty) {
        await setDoc(doc(db, 'system', 'sportCategoriesMeta'), { initialized: true, updatedAt: new Date().toISOString() });
      }
    }
    await logAdminActivity('Delete Sport Category', `Deleted sport category ID: ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

export const DEFAULT_REGISTRATION_SETTINGS: RegistrationSettings = {
  isOpen: true,
  deadline: '',
  announcementBn: 'ছোটখাতা চৌপথী স্পোর্টস এন্ড কালচারাল ক্লাবে ২০২৬ মৌসুমের জন্য নতুন খেলোয়াড় ও প্রতিভাবান ক্রীড়াবিদ নিবন্ধন কার্যক্রম চলছে। আগ্রহী সকল খেলোয়াড়দের দ্রুত আবেদন করার আহ্বান জানানো হচ্ছে।',
  announcementEn: 'Player registration is open for season 2026. Talented players and athletes are welcomed to apply.',
  allowedSports: ['football', 'cricket', 'badminton', 'volleyball', 'table_tennis', 'athletics', 'cultural'],
  instructionsBn: 'সঠিক তথ্য ও স্পষ্ট ছবি দিয়ে আবেদন ফরমটি সম্পূর্ণ করুন। আবেদন সফলভাবে জমা হলে আপনি একটি ট্র্যাকিং রেজিস্ট্রেশন নম্বর পাবেন। ক্লাবের যাচাই-বাছাই কমিটির অনুমোদনের পর খেলোয়াড় স্কোয়াডে অন্তর্ভুক্ত হবেন।',
  contactNumber: '+880 1712-345678',
  updatedAt: new Date().toISOString(),
};

export async function fetchRegistrationSettings(): Promise<RegistrationSettings> {
  const path = 'registrationSettings/general';
  try {
    const snap = await getDoc(doc(db, 'registrationSettings', 'general'));
    if (snap.exists()) {
      return { ...DEFAULT_REGISTRATION_SETTINGS, ...(snap.data() as RegistrationSettings) };
    }
    return DEFAULT_REGISTRATION_SETTINGS;
  } catch (error) {
    console.warn('Using default registration settings fallback:', error);
    return DEFAULT_REGISTRATION_SETTINGS;
  }
}

export async function saveRegistrationSettings(settings: RegistrationSettings): Promise<void> {
  const path = 'registrationSettings/general';
  try {
    await setDoc(doc(db, 'registrationSettings', 'general'), {
      ...settings,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    await logAdminActivity('Save Registration Settings', 'Updated player registration rules, allowed sports, and announcement');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function submitPlayerRegistration(
  data: Omit<PlayerRegistration, 'id' | 'registrationNo' | 'status' | 'submittedAt'>
): Promise<PlayerRegistration> {
  const cleanId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const path = `playerRegistrations/${cleanId}`;
  
  // Format registration number: CSC-2026-XXXX
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const registrationNo = `CSC-2026-${randomSuffix}`;

  const registrationRecord: PlayerRegistration = {
    ...data,
    id: cleanId,
    registrationNo,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'playerRegistrations', cleanId), registrationRecord);
    return registrationRecord;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function fetchPlayerRegistrations(): Promise<PlayerRegistration[]> {
  const path = 'playerRegistrations';
  try {
    const snap = await getDocs(collection(db, 'playerRegistrations'));
    if (snap.empty) {
      return [];
    }
    const list: PlayerRegistration[] = [];
    snap.forEach((d) => {
      list.push(d.data() as PlayerRegistration);
    });
    return list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  } catch (error) {
    console.warn('Error fetching player registrations:', error);
    return [];
  }
}

export async function updatePlayerRegistrationStatus(
  id: string,
  status: RegistrationStatus,
  rejectionReason?: string
): Promise<void> {
  const path = `playerRegistrations/${id}`;
  try {
    const updatePayload: Partial<PlayerRegistration> = {
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy: auth.currentUser?.email || 'admin',
    };
    if (rejectionReason !== undefined) {
      updatePayload.rejectionReason = rejectionReason;
    }
    await updateDoc(doc(db, 'playerRegistrations', id), updatePayload);
    await logAdminActivity('Update Registration Status', `Updated registration ${id} status to ${status}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function approveAndPromotePlayer(reg: PlayerRegistration): Promise<Player> {
  const regPath = `playerRegistrations/${reg.id}`;
  try {
    // 1. Check existing players in database
    const allPlayers = await fetchPlayers();
    
    // Check if player matches an existing record (by English name or Bengali name)
    let existingPlayer = allPlayers.find((p) => 
      (p.fullName && reg.fullNameEn && p.fullName.toLowerCase().trim() === reg.fullNameEn.toLowerCase().trim()) ||
      (p.nameBn && reg.fullNameBn && p.nameBn.trim() === reg.fullNameBn.trim())
    );

    let targetPlayer: Player;

    if (existingPlayer) {
      // Merge into existing player record without creating duplicate
      targetPlayer = {
        ...existingPlayer,
        fullName: reg.fullNameEn || existingPlayer.fullName,
        nameBn: reg.fullNameBn || existingPlayer.nameBn,
        position: (reg.position as PlayerPosition) || existingPlayer.position,
        sport: reg.sport || existingPlayer.sport || 'football',
        sportRole: reg.sportRole || reg.position || existingPlayer.sportRole,
        photoUrl: reg.photoUrl || existingPlayer.photoUrl,
        dateOfBirth: reg.dateOfBirth || existingPlayer.dateOfBirth,
        jerseyNumber: reg.jerseyNumber || existingPlayer.jerseyNumber,
        bio: reg.additionalInfo || existingPlayer.bio,
        isActive: true,
      };
      await savePlayer(targetPlayer);
    } else {
      // Create new player record
      const newPlayerId = `p-${Date.now()}`;
      targetPlayer = {
        id: newPlayerId,
        fullName: reg.fullNameEn,
        nameBn: reg.fullNameBn,
        jerseyNumber: reg.jerseyNumber || (allPlayers.length + 1),
        position: (reg.position as PlayerPosition) || 'Midfielder',
        sport: reg.sport || 'football',
        sportRole: reg.sportRole || reg.position,
        photoUrl: reg.photoUrl || '',
        bio: reg.additionalInfo || `${reg.sport} খেলোয়াড়। অভিজ্ঞতা: ${reg.experience || 'নবাগত'}`,
        dateOfBirth: reg.dateOfBirth,
        appearances: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        runsScored: 0,
        wicketsTaken: 0,
        setsWon: 0,
        personalBest: '',
        medalsWon: 0,
        culturalGenre: reg.sport === 'cultural' ? (reg.sportRole || '') : '',
        isActive: true,
        isCaptain: false,
        order: allPlayers.length + 1,
      };
      await savePlayer(targetPlayer);
    }

    // 2. Update registration document with approved status & playerId
    await updateDoc(doc(db, 'playerRegistrations', reg.id), {
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: auth.currentUser?.email || 'admin',
      approvedPlayerId: targetPlayer.id,
    });

    await logAdminActivity('Approve Player Registration', `Approved registration ${reg.registrationNo} for ${reg.fullNameBn} (${targetPlayer.fullName})`);
    return targetPlayer;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, regPath);
    throw error;
  }
}

export async function deletePlayerRegistration(id: string): Promise<void> {
  const path = `playerRegistrations/${id}`;
  try {
    await deleteDoc(doc(db, 'playerRegistrations', id));
    await logAdminActivity('Delete Player Registration', `Deleted application ${id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

export async function seedInitialDataToFirestore(): Promise<void> {
  try {
    await setDoc(doc(db, 'siteSettings', 'general'), DEFAULT_SETTINGS, { merge: true });
    
    // Seed Sport Categories
    for (const sc of DEFAULT_SPORT_CATEGORIES) {
      await setDoc(doc(db, 'sportCategories', sc.id), sc, { merge: true });
    }
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

    await logAdminActivity('Database Initialize', 'Seeded complete initial multi-sport & cultural club data into Cloud Firestore');
  } catch (err) {
    console.error('Error seeding initial Firestore data:', err);
    throw err;
  }
}
