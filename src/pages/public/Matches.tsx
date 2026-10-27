import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Match } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Flame,
  FileText,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { DEFAULT_LOGO_SVG } from '../../services/db';
import { SquadBoard } from '../../components/lineup/SquadBoard';

export const Matches: React.FC = () => {
  const {
    matches,
    players,
    settings,
    sportCategories,
    selectedSportFilter,
    setSelectedSportFilter,
    language,
    setCurrentRoute,
    isAdmin,
    showToast,
    refreshAllData,
  } = useApp();
  const isBn = language === 'bn';

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'live'>('all');
  const [selectedMatchModal, setSelectedMatchModal] = useState<Match | null>(null);
  const [selectedLineupMatch, setSelectedLineupMatch] = useState<Match | null>(null);

  const filteredMatches = matches.filter((m) => {
    // Sport match
    const mSport = m.sport || 'football';
    const matchSport =
      selectedSportFilter === 'all' ||
      mSport === selectedSportFilter ||
      (selectedSportFilter === 'football' && !m.sport);

    // Status match
    let matchStatus = true;
    if (activeTab === 'upcoming') matchStatus = m.status === 'Upcoming';
    else if (activeTab === 'completed') matchStatus = m.status === 'Completed';
    else if (activeTab === 'live') matchStatus = m.status === 'Live';

    return matchSport && matchStatus;
  });

  const liveMatches = matches.filter((m) => m.status === 'Live');

  return (
    <div className="min-h-screen py-16 animate-fade-in">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Calendar className="w-4 h-4" />
          <span>{isBn ? 'ফিক্সচার ও ফলাফল' : 'Fixtures & Match Center'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {isBn ? `${settings.clubNameBn} - ম্যাচ ও সময়সূচী` : `${settings.clubNameEn} - Matches & Fixtures`}
        </h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto mb-6">
          {isBn
            ? 'ফুটবল, ক্রিকেট, ব্যাডমিন্টন, ভলিবল সহ সকল ক্রীড়া প্রতিযোগিতা ও সাংস্কৃতিক ইভেন্টের সময়সূচী এবং ফলাফল।'
            : 'Track upcoming matches, live scoreboards, and official completed results across all disciplines.'}
        </p>

        {/* Top Sport Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setSelectedSportFilter('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedSportFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🏅</span>
            <span>{isBn ? 'সকল খেলাধুলা' : 'All Sports'}</span>
          </button>
          {sportCategories.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedSportFilter(sc.key)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedSportFilter === sc.key
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{sc.iconEmoji}</span>
              <span>{isBn ? sc.nameBn : sc.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Quick Squad Builder CTA */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 p-2 px-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-xs shadow-xl">
          <span className="text-slate-300 font-semibold">
            {isBn ? 'বন্ধুত্বপূর্ণ বা কাস্টম ম্যাচের জন্য একাদশ সাজাতে চান?' : 'Want to create a squad for a friendly match?'}
          </span>
          <button
            onClick={() => setCurrentRoute('squad-builder')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>{isBn ? 'দল তৈরি করুন (Squad Builder)' : 'Build Custom Squad'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Live Match Alert Banner (if any) */}
        {liveMatches.length > 0 && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border-2 border-rose-500/50 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs uppercase tracking-wider animate-pulse">
                <Flame className="w-4 h-4" /> {isBn ? 'ম্যাচ লাইভ চলছে' : 'MATCH IN PROGRESS'}
              </span>
              <span className="text-xs font-bold text-rose-300">
                {liveMatches[0].tournamentName}
              </span>
            </div>

            <div className="flex items-center justify-around py-4">
              <div className="text-center flex-1">
                <img
                  src={liveMatches[0].homeTeamLogo || settings.logoUrl || DEFAULT_LOGO_SVG}
                  alt=""
                  className="w-16 h-16 object-contain mx-auto mb-2 drop-shadow"
                />
                <h4 className="text-base sm:text-lg font-black text-white truncate px-2">
                  {liveMatches[0].homeTeamName}
                </h4>
              </div>

              <div className="px-6 py-2 rounded-2xl bg-slate-950 border border-rose-500/30 text-center shrink-0">
                <div className="text-3xl sm:text-4xl font-black text-rose-400 font-mono tracking-wider">
                  {liveMatches[0].homeScore ?? 0} : {liveMatches[0].awayScore ?? 0}
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  LIVE SCORE
                </span>
              </div>

              <div className="text-center flex-1">
                <img
                  src={liveMatches[0].awayTeamLogo || settings.logoUrl || DEFAULT_LOGO_SVG}
                  alt=""
                  className="w-16 h-16 object-contain mx-auto mb-2 drop-shadow"
                />
                <h4 className="text-base sm:text-lg font-black text-white truncate px-2">
                  {liveMatches[0].awayTeamName}
                </h4>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 mt-2 flex items-center justify-center gap-4">
              <span>{liveMatches[0].venue}</span>
            </div>
          </div>
        )}

        {/* Tab Filters */}
        <div className="flex items-center justify-center gap-2 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {isBn ? 'সকল ম্যাচ' : 'All Matches'}
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {isBn ? 'আসন্ন সূচী' : 'Upcoming'}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {isBn ? 'ফলাফল' : 'Results'}
          </button>
          {liveMatches.length > 0 && (
            <button
              onClick={() => setActiveTab('live')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'live'
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isBn ? 'লাইভ' : 'Live'}</span>
            </button>
          )}
        </div>

        {/* Match List */}
        <div className="space-y-4">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">কোনো ম্যাচ পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-400">এই বিভাগে বর্তমানে কোনো ম্যাচ তালিকাভুক্ত নেই।</p>
            </div>
          ) : (
            filteredMatches.map((match) => (
              <div
                key={match.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl transition"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold text-white">{match.tournamentName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {match.matchDate} {match.matchTime && `• ${match.matchTime}`}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                        match.status === 'Completed'
                          ? 'bg-slate-800 text-slate-300'
                          : match.status === 'Live'
                          ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                          : match.status === 'Cancelled'
                          ? 'bg-rose-950 text-rose-300'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {match.status}
                    </span>
                  </div>
                </div>

                {/* Match Scoreboard */}
                <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4 py-2">
                  {/* Home Team */}
                  <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-3 text-left md:text-right">
                    <span className="text-base sm:text-lg font-black text-white order-2 md:order-1">
                      {match.homeTeamName}
                    </span>
                    <img
                      src={match.homeTeamLogo || settings.logoUrl || DEFAULT_LOGO_SVG}
                      alt={match.homeTeamName}
                      className="w-12 h-12 object-contain rounded-2xl bg-slate-950 p-2 border border-slate-800 shrink-0 order-1 md:order-2"
                    />
                  </div>

                  {/* Score / Time Box */}
                  <div className="md:col-span-1 text-center py-2 flex flex-col items-center justify-center">
                    {match.status === 'Completed' || match.status === 'Live' ? (
                      match.homeScoreDisplay || match.awayScoreDisplay ? (
                        <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[100px]">
                          <div className="text-sm font-black text-amber-400 font-mono leading-tight">
                            {match.homeScoreDisplay || `${match.homeScore ?? 0}`}
                          </div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase my-0.5">বনাম</div>
                          <div className="text-sm font-black text-amber-400 font-mono leading-tight">
                            {match.awayScoreDisplay || `${match.awayScore ?? 0}`}
                          </div>
                        </div>
                      ) : (
                        <div className="inline-block px-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xl font-black text-amber-400 font-mono">
                          {match.homeScore ?? 0} - {match.awayScore ?? 0}
                        </div>
                      )
                    ) : (
                      <div className="text-xs font-black text-emerald-400 uppercase tracking-widest bg-slate-950 py-1.5 px-3 rounded-xl border border-slate-800 inline-block">
                        VS
                      </div>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="md:col-span-3 flex items-center justify-start gap-3 text-left">
                    <img
                      src={match.awayTeamLogo || settings.logoUrl || DEFAULT_LOGO_SVG}
                      alt={match.awayTeamName}
                      className="w-12 h-12 object-contain rounded-2xl bg-slate-950 p-2 border border-slate-800 shrink-0"
                    />
                    <span className="text-base sm:text-lg font-black text-white">
                      {match.awayTeamName}
                    </span>
                  </div>
                </div>

                {/* Event Details / Performer Info (if recorded) */}
                {match.roundOrEventDetails && (
                  <div className="mt-3 text-xs text-amber-300 bg-amber-950/30 p-2.5 rounded-xl border border-amber-800/40 flex items-center gap-2">
                    <span className="font-bold text-amber-400">বিবরণ / পর্ব:</span>
                    <span>{match.roundOrEventDetails}</span>
                  </div>
                )}

                {/* Scorers Preview (if recorded) */}
                {match.scorers && (
                  <div className="mt-3 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-emerald-400 font-semibold mr-1.5">{isBn ? 'গোলদাতা / পারফর্মার:' : 'Scorers / Performers:'}</span>
                    <span>{match.scorers}</span>
                  </div>
                )}

                {/* Footer info: Venue & Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{match.venue}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedLineupMatch(match)}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 hover:bg-amber-500/20 transition"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isBn ? 'লাইনআপ দেখুন' : 'View Lineup'}</span>
                    </button>

                    {match.report && (
                      <button
                        onClick={() => setSelectedMatchModal(match)}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{isBn ? 'রিপোর্ট' : 'Report'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tactical Lineup Modal */}
      {selectedLineupMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl relative text-left my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                  ম্যাচ ট্যাকটিক্যাল একাদশ
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {selectedLineupMatch.homeTeamName} vs {selectedLineupMatch.awayTeamName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLineupMatch(null)}
                className="w-9 h-9 rounded-full bg-slate-950 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SquadBoard
              match={selectedLineupMatch}
              allPlayers={players}
              allMatches={matches}
              isEditable={isAdmin}
              clubLogo={settings.logoUrl || DEFAULT_LOGO_SVG}
              clubNameBn={settings.clubNameBn}
              clubNameEn={settings.clubNameEn}
              showToast={showToast}
              onSaveSuccess={async () => {
                await refreshAllData();
              }}
            />
          </div>
        </div>
      )}

      {/* Match Report Modal */}
      {selectedMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-left">
            <button
              onClick={() => setSelectedMatchModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              {selectedMatchModal.tournamentName}
            </div>
            <h3 className="text-xl font-black text-white mb-4">
              {selectedMatchModal.homeTeamName} vs {selectedMatchModal.awayTeamName}
            </h3>

            {selectedMatchModal.status === 'Completed' && (
              <div className="text-2xl font-black text-amber-400 font-mono mb-4">
                স্কোর: {selectedMatchModal.homeScore} - {selectedMatchModal.awayScore}
              </div>
            )}

            {selectedMatchModal.scorers && (
              <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4">
                <span className="font-bold text-emerald-400 block mb-1">গোল বিবরণ:</span>
                {selectedMatchModal.scorers}
              </div>
            )}

            <div className="text-sm text-slate-300 leading-relaxed max-h-80 overflow-y-auto pr-2">
              <h5 className="font-bold text-white mb-2">ম্যাচ সারসংক্ষেপ ও পর্যালোচনা:</h5>
              <p className="whitespace-pre-line">{selectedMatchModal.report}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
