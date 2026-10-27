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
  updatedAt?: string;
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

export type SportType =
  | 'football'
  | 'cricket'
  | 'badminton'
  | 'volleyball'
  | 'table_tennis'
  | 'athletics'
  | 'cultural'
  | 'other';

export interface SportCategory {
  id: string;
  key: string;
  nameBn: string;
  nameEn: string;
  iconEmoji: string;
  descriptionBn?: string;
  descriptionEn?: string;
  isActive: boolean;
  order: number;
  supportsPointsTable: boolean;
  scoreType: 'goals' | 'cricket_score' | 'sets_points' | 'athletics_rank' | 'event_program';
  allowedPositions: string[];
}

export type PlayerPosition =
  | 'Goalkeeper'
  | 'Defender'
  | 'Midfielder'
  | 'Attacking Midfielder'
  | 'Striker'
  | 'Forward'
  | 'Batsman'
  | 'Bowler'
  | 'All-Rounder'
  | 'Wicket-Keeper'
  | 'Shuttler'
  | 'Spiker'
  | 'Setter'
  | 'Paddler'
  | 'Sprinter'
  | 'Athlete'
  | 'Performer'
  | 'Organizer';

export interface Player {
  id: string;
  fullName: string;
  nameBn?: string;
  jerseyNumber: number;
  position: PlayerPosition;
  sport?: string; // e.g. 'football' | 'cricket' | 'badminton' | 'volleyball' | 'table_tennis' | 'athletics' | 'cultural'
  sportRole?: string; // Display role for the sport
  photoUrl: string;
  bio?: string;
  dateOfBirth?: string;
  nationality?: string;
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  // Multi-sport and cultural specific fields
  runsScored?: number;
  wicketsTaken?: number;
  setsWon?: number;
  personalBest?: string;
  medalsWon?: string | number;
  culturalGenre?: string;
  isActive: boolean;
  isCaptain?: boolean;
  order: number;
}

export type FormationType = '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1' | '3-4-3';

export interface LineupSlot {
  slotId: string;
  slotLabel: string;
  positionCategory: PlayerPosition;
  x: number; // percentage 0-100 across width
  y: number; // percentage 0-100 down pitch
  playerId: string | null;
  playerName?: string;
  nameBn?: string;
  jerseyNumber?: number;
  photoUrl?: string;
  isCaptain?: boolean;
}

export interface MatchLineup {
  id: string; // usually matchId
  matchId: string;
  matchType?: 'League' | 'Tournament' | 'Friendly' | 'Custom';
  formation: FormationType;
  teamName: string;
  opponentName?: string;
  startingXI: LineupSlot[];
  substitutes: string[]; // array of player IDs
  captainId?: string;
  coachName?: string;
  tacticalNotes?: string;
  updatedAt?: string;
}

export interface CustomSquad {
  id: string;
  squadName: string;
  formation: FormationType;
  matchType?: 'Friendly' | 'Custom' | 'League' | 'Tournament';
  matchId?: string;
  selectedPlayerIds: string[];
  startingXI: LineupSlot[];
  substitutes: string[];
  captainId?: string;
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  logoUrl: string;
  city?: string;
  isHomeClub?: boolean;
  sport?: string;
}

export interface Match {
  id: string;
  sport?: string; // 'football' | 'cricket' | 'badminton' | 'volleyball' | 'table_tennis' | 'athletics' | 'cultural'
  homeTeamName: string;
  homeTeamLogo: string;
  awayTeamName: string;
  awayTeamLogo: string;
  matchDate: string; // YYYY-MM-DD
  matchTime: string; // HH:mm
  venue: string;
  tournamentName: string;
  matchType?: 'League' | 'Tournament' | 'Friendly' | 'Custom';
  homeScore?: number;
  awayScore?: number;
  homeScoreDisplay?: string; // Cricket overs/wickets, Badminton sets e.g. "185/6 (20 ov)"
  awayScoreDisplay?: string;
  roundOrEventDetails?: string; // e.g. "১০০ মিটার স্প্রিন্ট ফাইনাল"
  performerOrWinner?: string;
  status: 'Upcoming' | 'Live' | 'Completed' | 'Postponed' | 'Cancelled';
  posterUrl?: string;
  report?: string;
  scorers?: string;
  hasLineup?: boolean;
  createdAt?: string;
}

export interface Tournament {
  id: string;
  name: string;
  season: string;
  sport?: string;
  category?: 'sports' | 'cultural' | 'community';
  logoUrl?: string;
  startDate?: string;
  endDate?: string;
  status: 'Upcoming' | 'Active' | 'Completed';
  description?: string;
}

export interface Standing {
  id: string;
  tournamentName: string;
  sport?: string;
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
  netRunRate?: string;
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
