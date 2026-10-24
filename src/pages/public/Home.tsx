import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Trophy,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  Flame,
  Award,
  ChevronUp,
} from 'lucide-react';

export const Home: React.FC = () => {
  const {
    settings,
    language,
    banners,
    sections,
    players,
    matches,
    standings,
    news,
    achievements,
    sponsors,
    gallery,
    setCurrentRoute,
  } = useApp();

  const isBn = language === 'bn';
  const [currentSlide, setCurrentSlide] = useState(0);

  // Active banners
  const activeBanners = banners.filter((b) => b.isActive).sort((a, b) => a.order - b.order);

  // Auto advance banner slide
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  // Find next match or live match
  const liveMatch = matches.find((m) => m.status === 'Live');
  const upcomingMatch = matches.find((m) => m.status === 'Upcoming');
  const latestResult = matches.find((m) => m.status === 'Completed');

  // Sorted and visible sections
  const visibleSections = [...sections]
    .filter((s) => s.isVisible)
    .sort((a, b) => a.order - b.order);

  // RENDER SECTIONS DYNAMICALLY
  const renderSection = (sec: any) => {
    switch (sec.sectionKey) {
      case 'hero':
        if (activeBanners.length === 0) return null;
        const currentBanner = activeBanners[currentSlide] || activeBanners[0];
        return (
          <section key={sec.id} className="relative min-h-[520px] md:min-h-[620px] flex items-center overflow-hidden bg-slate-950">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
              <picture>
                {currentBanner.mobileImageUrl && (
                  <source media="(max-width: 640px)" srcSet={currentBanner.mobileImageUrl} />
                )}
                <img
                  src={currentBanner.imageUrl}
                  alt={currentBanner.title}
                  className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
                />
              </picture>
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40"
                style={{ opacity: currentBanner.overlayOpacity ? currentBanner.overlayOpacity / 100 : 0.65 }}
              />
              <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-slate-950/80" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
              <div
                className={`max-w-2xl ${
                  currentBanner.textAlignment === 'center'
                    ? 'mx-auto text-center'
                    : currentBanner.textAlignment === 'right'
                    ? 'ml-auto text-right'
                    : 'text-left'
                }`}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{isBn ? settings.clubNameBn : settings.clubNameEn}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-lg">
                  {isBn ? currentBanner.title : currentBanner.titleEn || currentBanner.title}
                </h1>

                <p className="text-base sm:text-lg text-slate-200 mb-8 leading-relaxed font-medium drop-shadow">
                  {isBn ? currentBanner.subtitle : currentBanner.subtitleEn || currentBanner.subtitle}
                </p>

                <div
                  className={`flex flex-wrap gap-3 ${
                    currentBanner.textAlignment === 'center'
                      ? 'justify-center'
                      : currentBanner.textAlignment === 'right'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  {currentBanner.primaryButtonText && (
                    <button
                      onClick={() => {
                        const target = currentBanner.primaryButtonLink.replace('#', '');
                        setCurrentRoute(target || 'players');
                      }}
                      className="px-6 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/60 transition-all cursor-pointer transform hover:-translate-y-0.5"
                    >
                      {currentBanner.primaryButtonText}
                    </button>
                  )}
                  {currentBanner.secondaryButtonText && (
                    <button
                      onClick={() => {
                        const target = (currentBanner.secondaryButtonLink || '').replace('#', '');
                        setCurrentRoute(target || 'matches');
                      }}
                      className="px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 backdrop-blur-md transition-all cursor-pointer"
                    >
                      {currentBanner.secondaryButtonText}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Slider Controls */}
            {activeBanners.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-900 text-white border border-slate-800 backdrop-blur-md transition cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-900 text-white border border-slate-800 backdrop-blur-md transition cursor-pointer"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {activeBanners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx ? 'w-8 bg-emerald-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        );

      case 'quickMatch':
        const targetMatch = liveMatch || upcomingMatch || latestResult;
        if (!targetMatch) return null;
        return (
          <section key={sec.id} className="relative z-20 -mt-8 max-w-5xl mx-auto px-4">
            <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {targetMatch.status === 'Live' ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500 text-rose-400 font-bold text-xs uppercase tracking-wider animate-pulse">
                      <Flame className="w-3.5 h-3.5" /> LIVE MATCH
                    </span>
                  ) : targetMatch.status === 'Upcoming' ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" /> {isBn ? 'আসন্ন ম্যাচ' : 'Upcoming Match'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider">
                      {isBn ? 'সাম্প্রতিক ফলাফল' : 'Latest Result'}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    {targetMatch.tournamentName}
                  </span>
                </div>

                {/* Score / Teams Row */}
                <div className="flex items-center justify-center gap-4 sm:gap-8 w-full md:w-auto">
                  {/* Home Team */}
                  <div className="flex items-center gap-3 text-right flex-1 sm:flex-initial justify-end">
                    <span className="font-bold text-sm sm:text-base text-white truncate max-w-[140px]">
                      {targetMatch.homeTeamName}
                    </span>
                    <img
                      src={targetMatch.homeTeamLogo || settings.logoUrl}
                      alt={targetMatch.homeTeamName}
                      className="w-10 h-10 object-contain rounded-full bg-slate-950 p-1 border border-slate-800 shrink-0"
                    />
                  </div>

                  {/* Score or VS */}
                  <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0">
                    {targetMatch.status === 'Completed' || targetMatch.status === 'Live' ? (
                      <div className="text-lg sm:text-xl font-black text-amber-400 tracking-wider">
                        {targetMatch.homeScore ?? 0} - {targetMatch.awayScore ?? 0}
                      </div>
                    ) : (
                      <div className="text-xs font-black text-emerald-400 uppercase tracking-widest px-1">
                        VS
                      </div>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center gap-3 text-left flex-1 sm:flex-initial">
                    <img
                      src={targetMatch.awayTeamLogo || settings.logoUrl}
                      alt={targetMatch.awayTeamName}
                      className="w-10 h-10 object-contain rounded-full bg-slate-950 p-1 border border-slate-800 shrink-0"
                    />
                    <span className="font-bold text-sm sm:text-base text-white truncate max-w-[140px]">
                      {targetMatch.awayTeamName}
                    </span>
                  </div>
                </div>

                {/* Details Button */}
                <button
                  onClick={() => setCurrentRoute('matches')}
                  className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{isBn ? 'বিস্তারিত দেখুন' : 'Match Center'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key={sec.id} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{isBn ? sec.titleBn : sec.titleEn}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {isBn ? settings.clubNameBn : settings.clubNameEn}
                </h2>

                <p className="text-slate-300 text-base leading-relaxed">
                  {isBn ? settings.history : settings.historyEn || settings.history}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-2xl font-black text-emerald-400 mb-1">{settings.foundingYear}</div>
                    <div className="text-xs text-slate-400 font-medium">{isBn ? 'প্রতিষ্ঠার বছর' : 'Founding Year'}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-2xl font-black text-amber-400 mb-1">{players.length}+</div>
                    <div className="text-xs text-slate-400 font-medium">{isBn ? 'নিবন্ধিত খেলোয়াড়' : 'Registered Players'}</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setCurrentRoute('about')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs transition cursor-pointer"
                  >
                    <span>{isBn ? 'সম্পূর্ণ পরিচিতি ও পরিচালনা পরিষদ' : 'Learn More & Management'}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              </div>

              {/* Club Badge Graphic / Ground Preview */}
              <div className="relative">
                <div className="aspect-4/3 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop"
                    alt="Chhotokhata Sporting Club Action"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80">
                      <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs text-slate-400 font-medium">{isBn ? 'হোম ভেন্যু:' : 'Home Ground:'}</div>
                        <div className="text-sm font-bold text-white">{settings.homeGround}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'players':
        const featuredPlayers = players.filter((p) => p.isActive).slice(0, 4);
        return (
          <section key={sec.id} className="py-20 bg-slate-950/50 border-y border-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>{isBn ? sec.titleBn : sec.titleEn}</span>
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    {isBn ? 'আমাদের প্রধান খেলোয়াড়বৃন্দ' : 'Key Squad Players'}
                  </h2>
                </div>

                <button
                  onClick={() => setCurrentRoute('players')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold transition cursor-pointer self-start sm:self-auto"
                >
                  <span>{isBn ? 'সকল খেলোয়াড় দেখুন' : 'View Full Squad'}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
              </div>

              {/* Player Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredPlayers.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => setCurrentRoute('players')}
                    className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-4/5 overflow-hidden bg-slate-950">
                      <img
                        src={player.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'}
                        alt={player.fullName}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

                      {/* Jersey number badge */}
                      <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-emerald-600/90 text-white font-black text-lg flex items-center justify-center shadow-lg backdrop-blur-sm border border-emerald-400/40 font-mono">
                        #{player.jerseyNumber}
                      </div>

                      {player.isCaptain && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow">
                          CAPTAIN
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                          {player.position}
                        </span>
                        <h3 className="text-lg font-black text-white truncate">
                          {isBn ? player.nameBn || player.fullName : player.fullName}
                        </h3>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <div>
                        <span className="text-white font-bold block">{player.appearances}</span>
                        <span>{isBn ? 'ম্যাচ' : 'Matches'}</span>
                      </div>
                      <div>
                        <span className="text-emerald-400 font-bold block">{player.goals}</span>
                        <span>{isBn ? 'গোল' : 'Goals'}</span>
                      </div>
                      <div>
                        <span className="text-amber-400 font-bold block">{player.assists}</span>
                        <span>{isBn ? 'অ্যাসিস্ট' : 'Assists'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'matches':
        const recentAndUpcoming = matches.slice(0, 3);
        return (
          <section key={sec.id} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isBn ? sec.titleBn : sec.titleEn}</span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {isBn ? 'ম্যাচ সূচী ও ফলাফল' : 'Fixtures & Scores'}
                </h2>
              </div>

              <button
                onClick={() => setCurrentRoute('matches')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold transition cursor-pointer self-start sm:self-auto"
              >
                <span>{isBn ? 'সকল ম্যাচ দেখুন' : 'View All Matches'}</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentAndUpcoming.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setCurrentRoute('matches')}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800">
                      <span className="font-semibold text-emerald-400 truncate max-w-[180px]">{match.tournamentName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        match.status === 'Completed'
                          ? 'bg-slate-800 text-slate-300'
                          : match.status === 'Live'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {match.status}
                      </span>
                    </div>

                    <div className="space-y-4 my-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={match.homeTeamLogo || settings.logoUrl}
                            alt={match.homeTeamName}
                            className="w-8 h-8 object-contain rounded-full bg-slate-950 p-1 border border-slate-800"
                          />
                          <span className="font-bold text-sm text-white">{match.homeTeamName}</span>
                        </div>
                        {match.status === 'Completed' && (
                          <span className="text-base font-black text-white">{match.homeScore}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={match.awayTeamLogo || settings.logoUrl}
                            alt={match.awayTeamName}
                            className="w-8 h-8 object-contain rounded-full bg-slate-950 p-1 border border-slate-800"
                          />
                          <span className="font-bold text-sm text-white">{match.awayTeamName}</span>
                        </div>
                        {match.status === 'Completed' && (
                          <span className="text-base font-black text-white">{match.awayScore}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{match.venue}</span>
                    </div>
                    <span className="text-slate-300 font-medium shrink-0">{match.matchDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'standings':
        return (
          <section key={sec.id} className="py-20 bg-slate-950/40 border-y border-slate-900">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{isBn ? sec.titleBn : sec.titleEn}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {standings[0]?.tournamentName || (isBn ? 'পয়েন্ট টেবিল' : 'League Standings')}
                  </h2>
                </div>

                <button
                  onClick={() => setCurrentRoute('standings')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>{isBn ? 'সম্পূর্ণ টেবিল' : 'Full Table'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Responsive Standings Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 text-center w-12">#</th>
                        <th className="py-3 px-4">{isBn ? 'দল' : 'Team'}</th>
                        <th className="py-3 px-3 text-center">{isBn ? 'ম্যাচ' : 'P'}</th>
                        <th className="py-3 px-3 text-center">{isBn ? 'জয়' : 'W'}</th>
                        <th className="py-3 px-3 text-center">{isBn ? 'ড্র' : 'D'}</th>
                        <th className="py-3 px-3 text-center">{isBn ? 'হার' : 'L'}</th>
                        <th className="py-3 px-3 text-center hidden sm:table-cell">{isBn ? 'গোল ব্যবধান' : 'GD'}</th>
                        <th className="py-3 px-4 text-center font-black text-white">{isBn ? 'পয়েন্ট' : 'PTS'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {standings.slice(0, 5).map((row, idx) => {
                        const isHome = row.teamName.toLowerCase().includes('chhotokhata') || row.teamName.includes('ছোটখাতা');
                        return (
                          <tr
                            key={row.id}
                            className={`transition hover:bg-slate-800/40 ${isHome ? 'bg-emerald-950/20' : ''}`}
                          >
                            <td className="py-3 px-4 text-center font-bold text-slate-400">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                                idx === 0 ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'
                              }`}>
                                {row.position || idx + 1}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-white flex items-center gap-2.5">
                              {row.teamLogo && (
                                <img src={row.teamLogo} alt="" className="w-6 h-6 object-contain shrink-0" />
                              )}
                              <span className="truncate max-w-[200px]">{row.teamName}</span>
                              {isHome && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                                  CSC
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-center text-slate-300">{row.played}</td>
                            <td className="py-3 px-3 text-center text-slate-300">{row.won}</td>
                            <td className="py-3 px-3 text-center text-slate-300">{row.drawn}</td>
                            <td className="py-3 px-3 text-center text-slate-300">{row.lost}</td>
                            <td className="py-3 px-3 text-center text-slate-400 hidden sm:table-cell font-mono">
                              {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                            </td>
                            <td className="py-3 px-4 text-center font-black text-base text-emerald-400 font-mono">
                              {row.points}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        );

      case 'news':
        return (
          <section key={sec.id} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isBn ? sec.titleBn : sec.titleEn}</span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {isBn ? 'ক্লাব সংবাদ ও আপডেট' : 'Latest News & Updates'}
                </h2>
              </div>

              <button
                onClick={() => setCurrentRoute('news')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold transition cursor-pointer self-start sm:self-auto"
              >
                <span>{isBn ? 'সকল খবর পড়ুন' : 'All Articles'}</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {news.slice(0, 2).map((article) => (
                <div
                  key={article.id}
                  onClick={() => setCurrentRoute('news')}
                  className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl transition hover:-translate-y-1 cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-16/9 overflow-hidden bg-slate-950">
                    <img
                      src={article.coverImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-bold text-emerald-400">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-slate-400 mb-2">{article.publishedAt}</div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-3 leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {article.summary || article.content}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
                      <span>{isBn ? 'বিস্তারিত পড়ুন' : 'Read Full Story'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'gallery':
        return (
          <section key={sec.id} className="py-20 bg-slate-950/40 border-y border-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isBn ? sec.titleBn : sec.titleEn}</span>
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    {isBn ? 'স্মরণীয় মুহূর্তগুলো' : 'Photo & Video Gallery'}
                  </h2>
                </div>

                <button
                  onClick={() => setCurrentRoute('gallery')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>{isBn ? 'সম্পূর্ণ অ্যালবাম' : 'View Full Gallery'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {gallery.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setCurrentRoute('gallery')}
                    className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl cursor-pointer"
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-sm font-bold text-white mb-0.5">{item.title}</h4>
                      <p className="text-xs text-slate-300 truncate">{item.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'achievements':
        return (
          <section key={sec.id} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>{isBn ? sec.titleBn : sec.titleEn}</span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {isBn ? 'ক্লাবের গৌরবময় ট্রফি ও সম্মান' : 'Trophies & Milestones'}
                </h2>
              </div>

              <button
                onClick={() => setCurrentRoute('achievements')}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{isBn ? 'সকল ট্রফি' : 'All Trophies'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-5 shadow-xl"
                >
                  <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Trophy className="w-10 h-10 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {ach.year} • {ach.position}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-1">{ach.trophyName}</h3>
                    <p className="text-xs text-slate-400">{ach.tournamentName}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'sponsors':
        const activeSponsors = sponsors.filter((s) => s.isActive);
        if (activeSponsors.length === 0) return null;
        return (
          <section key={sec.id} className="py-16 bg-slate-950/80 border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-6">
                {isBn ? sec.titleBn : sec.titleEn}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {activeSponsors.map((sp) => (
                  <div
                    key={sp.id}
                    className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition opacity-70 hover:opacity-100"
                  >
                    <img src={sp.logoUrl} alt={sp.name} className="h-12 w-auto max-w-[140px] object-contain rounded-lg" />
                    <span className="text-[11px] font-semibold text-slate-400">{sp.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key={sec.id} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  {isBn ? 'যোগাযোগ ও ট্রায়াল' : 'Join or Contact CSC'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 mb-4">
                  {isBn ? 'ছোটখাতা স্পোর্টিং ক্লাবের সাথে যুক্ত হোন' : 'Get Involved with Chhotokhata SC'}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {isBn
                    ? 'আমাদের ফুটবল একাডেমি, ক্লাবের সদস্যপদ, ম্যাচ স্পনসরশিপ বা যেকোনো অনুসন্ধানের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।'
                    : 'Reach out to our club committee regarding player trials, academy enrolment, match tickets, or sponsorship.'}
                </p>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{settings.address}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => setCurrentRoute('contact')}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950 transition cursor-pointer text-center"
                >
                  {isBn ? 'মেসেজ পাঠান' : 'Send Message'}
                </button>
                <a
                  href={`tel:${settings.phone}`}
                  className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition text-center"
                >
                  {settings.phone}
                </a>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-slate-100 animate-fade-in pb-12">
      {visibleSections.map((sec) => renderSection(sec))}
    </div>
  );
};
