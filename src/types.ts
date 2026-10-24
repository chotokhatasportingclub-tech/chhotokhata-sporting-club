export type Language = 'bn' | 'en';

export interface SiteSettings {
  clubNameBn: string;
  clubNameEn: string;
  shortName: string;
  websiteTitle: string;
  websiteDescription: string;
  tagline: string;
  taglineEn?: string;
  foundingYear: string;
  history: string;
  historyEn?: string;
  mission: string;
  missionEn?: string;
  vision: string;
  visionEn?: string;
  phone: string;
  email: string;
  address: string;
  homeGround: string;
  mapsUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  footerText: string;
  logoUrl: string;
  logoSize: 'small' | 'medium' | 'large';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isDarkMode: boolean;
  updatedAt?: string;
}

export interface Banner {
  id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  textAlignment: 'left' | 'center' | 'right';
  overlayOpacity: number;
  order: number;
  isActive: boolean;
}

export interface HomepageSection {
  id: string;
  sectionKey: string;
  titleBn: string;
  titleEn: string;
  subtitle?: string;
  order: number;
  isVisible: boolean;
}

export interface Player {
  id: string;
  fullName: string;
  nameBn?: string;
  jerseyNumber: number;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  photoUrl: string;
  bio?: string;
  dateOfBirth?: string;
  nationality?: string;
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  isActive: boolean;
  isCaptain?: boolean;
  order: number;
}

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  logoUrl: string;
  city?: string;
  isHomeClub?: boolean;
}

export interface Match {
  id: string;
  homeTeamName: string;
  homeTeamLogo: string;
  awayTeamName: string;
  awayTeamLogo: string;
  matchDate: string; // YYYY-MM-DD
  matchTime: string; // HH:mm
  venue: string;
  tournamentName: string;
  homeScore?: number;
  awayScore?: number;
  status: 'Upcoming' | 'Live' | 'Completed' | 'Postponed' | 'Cancelled';
  posterUrl?: string;
  report?: string;
  scorers?: string;
  createdAt?: string;
}

export interface Tournament {
  id: string;
  name: string;
  season: string;
  logoUrl?: string;
  startDate?: string;
  endDate?: string;
  status: 'Upcoming' | 'Active' | 'Completed';
  description?: string;
}

export interface Standing {
  id: string;
  tournamentName: string;
  teamName: string;
  teamLogo?: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  coverUrl: string;
  eventDate?: string;
}

export interface GalleryMedia {
  id: string;
  albumId?: string;
  title: string;
  caption?: string;
  url: string;
  mediaType: 'image' | 'video';
  date?: string;
  order: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleEn?: string;
  content: string;
  summary?: string;
  coverImage?: string;
  category: 'Match Report' | 'Club Announcement' | 'Event' | 'Player News' | 'General';
  status: 'published' | 'draft';
  author: string;
  publishedAt: string;
  isFeatured?: boolean;
}

export interface Achievement {
  id: string;
  trophyName: string;
  tournamentName: string;
  year: string;
  position: string;
  photoUrl?: string;
  description?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  tier: 'Principal Partner' | 'Gold Sponsor' | 'Kit Partner' | 'Official Partner';
  websiteUrl?: string;
  order: number;
  isActive: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  addedAt: string;
}

export interface AdminActivityLog {
  id: string;
  action: string;
  details: string;
  adminEmail: string;
  timestamp: string;
}
