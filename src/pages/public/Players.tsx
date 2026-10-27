import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Player } from '../../types';
import { PlayerKitBadge } from '../../components/lineup/PlayerKitBadge';
import {
  Users,
  Search,
  Filter,
  Shield,
  Trophy,
  X,
  Calendar,
  Flag,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react';

export const Players: React.FC = () => {
  const {
    players,
    language,
    settings,
    sportCategories,
    selectedSportFilter,
    setSelectedSportFilter,
    setCurrentRoute,
  } = useApp();
  const isBn = language === 'bn';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'number' | 'goals' | 'appearances'>('number');
  const [activePlayerModal, setActivePlayerModal] = useState<Player | null>(null);

  const footballPositions = ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Attacking Midfielder', 'Striker'];
  const cricketPositions = ['All', 'Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'];

  // Filter and sort players
  const filteredPlayers = players
    .filter((player) => {
      // Sport match
      const pSport = player.sport || 'football';
      const matchSport =
        selectedSportFilter === 'all' ||
        pSport === selectedSportFilter ||
        (selectedSportFilter === 'football' && !player.sport);

      // Position match
      const matchPos =
        selectedPosition === 'All' ||
        player.position === selectedPosition ||
        player.sportRole === selectedPosition;

      // Search match
      const matchSearch =
        player.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (player.nameBn && player.nameBn.includes(searchTerm)) ||
        player.jerseyNumber.toString().includes(searchTerm);

      return matchSport && matchPos && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'goals') return (b.goals || b.runsScored || 0) - (a.goals || a.runsScored || 0);
      if (sortBy === 'appearances') return b.appearances - a.appearances;
      return a.jerseyNumber - b.jerseyNumber;
    });

  return (
    <div className="min-h-screen py-16 animate-fade-in">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Users className="w-4 h-4" />
          <span>{isBn ? 'ক্লাব স্কোয়াড ও খেলোয়াড়বৃন্দ' : 'Club Squad & Players'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {isBn ? `${settings.clubNameBn} - খেলোয়াড় ও সদস্যবৃন্দ` : `${settings.clubNameEn} - Players & Members`}
        </h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto">
          {isBn
            ? 'ফুটবল, ক্রিকেট, ব্যাডমিন্টন, ভলিবল, অ্যাথলেটিক্স ও সাংস্কৃতিক অঙ্গনের সদস্যদের প্রোফাইল ও পরিচিতি।'
            : 'Explore full profiles, roles, and achievements of our athletes and cultural performers.'}
        </p>

        {/* Top Sport Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => {
              setSelectedSportFilter('all');
              setSelectedPosition('All');
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedSportFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🏅</span>
            <span>{isBn ? 'সকল শাখা' : 'All Sports'}</span>
          </button>
          {sportCategories.map((sc) => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedSportFilter(sc.key);
                setSelectedPosition('All');
              }}
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls: Search, Position Filter, Sort */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isBn ? 'খেলোয়াড়ের নাম বা জার্সি নং খুঁজুন...' : 'Search player name or jersey...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Position Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            {(selectedSportFilter === 'cricket'
              ? cricketPositions
              : selectedSportFilter === 'athletics'
              ? ['All', 'Sprinter', 'Athlete']
              : selectedSportFilter === 'cultural'
              ? ['All', 'Performer', 'Organizer']
              : footballPositions
            ).map((pos) => {
              const isActive = selectedPosition === pos;
              const posLabel =
                pos === 'All'
                  ? isBn
                    ? 'সকল'
                    : 'All'
                  : pos === 'Goalkeeper'
                  ? isBn
                    ? 'গোলরক্ষক'
                    : 'GK'
                  : pos === 'Defender'
                  ? isBn
                    ? 'ডিফেন্ডার'
                    : 'DEF'
                  : pos === 'Midfielder'
                  ? isBn
                    ? 'মিডফিল্ডার'
                    : 'MID'
                  : pos === 'Attacking Midfielder'
                  ? isBn
                    ? 'অ্যাটাকিং মিডফিল্ডার'
                    : 'CAM'
                  : pos === 'Striker'
                  ? isBn
                    ? 'স্ট্রাইকার'
                    : 'ST'
                  : pos;

              return (
                <button
                  key={pos}
                  onClick={() => setSelectedPosition(pos)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {posLabel}
                </button>
              );
            })}
          </div>

          {/* Lineup & Sort Selector */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <button
              onClick={() => setCurrentRoute('lineup')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBn ? 'ট্যাকটিক্যাল বোর্ড' : 'Tactical Board'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">{isBn ? 'সাজান:' : 'Sort:'}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="number">{isBn ? 'জার্সি নম্বর' : 'Jersey Number'}</option>
                <option value="goals">{isBn ? 'সর্বোচ্চ গোল' : 'Most Goals'}</option>
                <option value="appearances">{isBn ? 'ম্যাচ সংখ্যা' : 'Most Appearances'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Players Grid */}
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">কোনো খেলোয়াড় পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-400">অনুসন্ধান বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => {
              const hasPhoto = Boolean(player.photoUrl && player.photoUrl.trim() !== '');

              return (
                <div
                  key={player.id}
                  onClick={() => setActivePlayerModal(player)}
                  className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
                >
                  {/* Photo or CSC Jersey Kit Card Header */}
                  <div className="relative aspect-4/5 overflow-hidden bg-slate-950 flex items-center justify-center">
                    {hasPhoto ? (
                      <img
                        src={player.photoUrl}
                        alt={player.fullName}
                        onError={(e) => {
                          // Hide broken image and show kit badge fallback
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-[#0a2315] via-slate-950 to-slate-950 flex flex-col items-center justify-center p-6 relative">
                        <PlayerKitBadge
                          photoUrl=""
                          jerseyNumber={player.jerseyNumber}
                          name={player.fullName}
                          size="lg"
                          isCaptain={player.isCaptain}
                        />
                        <span className="mt-3 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                          CSC Official Kit
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 pointer-events-none" />

                    {/* Jersey number */}
                    <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-lg border border-emerald-400/30 font-mono">
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

                  {/* Stats row */}
                  <div className="p-4 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    {player.sport === 'cricket' ? (
                      <>
                        <div>
                          <span className="text-white font-bold block">{player.runsScored ?? 0}</span>
                          <span>{isBn ? 'রান' : 'Runs'}</span>
                        </div>
                        <div>
                          <span className="text-emerald-400 font-bold block">{player.wicketsTaken ?? 0}</span>
                          <span>{isBn ? 'উইকেট' : 'Wkts'}</span>
                        </div>
                        <div>
                          <span className="text-amber-400 font-bold block">{player.appearances}</span>
                          <span>{isBn ? 'ম্যাচ' : 'Matches'}</span>
                        </div>
                      </>
                    ) : player.sport === 'athletics' ? (
                      <>
                        <div>
                          <span className="text-amber-400 font-bold block">{player.medalsWon ?? 0}</span>
                          <span>{isBn ? 'পদক' : 'Medals'}</span>
                        </div>
                        <div className="text-center truncate px-1">
                          <span className="text-emerald-400 font-bold block truncate">{player.personalBest || 'রেকর্ড'}</span>
                          <span>{isBn ? 'সেরা সময়' : 'Best'}</span>
                        </div>
                        <div>
                          <span className="text-white font-bold block">{player.appearances}</span>
                          <span>{isBn ? 'ইভেন্ট' : 'Meets'}</span>
                        </div>
                      </>
                    ) : player.sport === 'cultural' ? (
                      <>
                        <div className="truncate flex-1">
                          <span className="text-emerald-400 font-bold block truncate">{player.culturalGenre || 'সাংস্কৃতিক'}</span>
                          <span>{isBn ? 'শাখা' : 'Genre'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-bold block">{player.appearances}</span>
                          <span>{isBn ? 'অনুষ্ঠান' : 'Events'}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-white font-bold block">{player.appearances}</span>
                          <span>{isBn ? 'ম্যাচ' : 'Caps'}</span>
                        </div>
                        <div>
                          <span className="text-emerald-400 font-bold block">
                            {player.position === 'Goalkeeper' ? player.cleanSheets : player.goals}
                          </span>
                          <span>{player.position === 'Goalkeeper' ? (isBn ? 'ক্লিন শিট' : 'Clean') : (isBn ? 'গোল' : 'Goals')}</span>
                        </div>
                        <div>
                          <span className="text-amber-400 font-bold block">{player.assists}</span>
                          <span>{isBn ? 'অ্যাসিস্ট' : 'Assists'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Individual Player Profile Modal */}
      {activePlayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative text-left">
            <button
              onClick={() => setActivePlayerModal(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-4/5 md:aspect-auto bg-slate-950 relative flex items-center justify-center">
                {activePlayerModal.photoUrl && activePlayerModal.photoUrl.trim() !== '' ? (
                  <img
                    src={activePlayerModal.photoUrl}
                    alt={activePlayerModal.fullName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full min-h-[280px] bg-gradient-to-b from-[#071d11] via-slate-950 to-slate-950 flex flex-col items-center justify-center p-6">
                    <PlayerKitBadge
                      photoUrl=""
                      jerseyNumber={activePlayerModal.jerseyNumber}
                      name={activePlayerModal.fullName}
                      size="lg"
                      isCaptain={activePlayerModal.isCaptain}
                    />
                    <span className="mt-4 text-xs font-black uppercase tracking-widest text-emerald-400">
                      Chhotokhata SC # {activePlayerModal.jerseyNumber}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:hidden" />
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                      #{activePlayerModal.jerseyNumber} • {activePlayerModal.position}
                    </span>
                    {activePlayerModal.isCaptain && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
                        CAPTAIN
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-white leading-tight mb-1">
                    {activePlayerModal.fullName}
                  </h3>
                  {activePlayerModal.nameBn && (
                    <div className="text-sm text-slate-400 font-semibold mb-4">
                      {activePlayerModal.nameBn}
                    </div>
                  )}

                  <div className="space-y-2 text-xs text-slate-300 py-3 border-y border-slate-800 my-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{isBn ? 'জাতীয়তা:' : 'Nationality:'}</span>
                      <span className="font-semibold text-white">{activePlayerModal.nationality || 'বাংলাদেশি'}</span>
                    </div>
                    {activePlayerModal.dateOfBirth && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{isBn ? 'জন্ম তারিখ / বয়স:' : 'Date of Birth:'}</span>
                        <span className="font-semibold text-white">{activePlayerModal.dateOfBirth}</span>
                      </div>
                    )}
                  </div>

                  {activePlayerModal.bio && (
                    <div className="text-xs text-slate-300 leading-relaxed mb-6">
                      <h5 className="font-bold text-white mb-1">{isBn ? 'জীবনী ও ভূমিকা:' : 'Player Profile:'}</h5>
                      <p>{activePlayerModal.bio}</p>
                    </div>
                  )}
                </div>

                {/* Big Stats */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <div>
                    <span className="text-xl font-black text-white">{activePlayerModal.appearances}</span>
                    <span className="text-[10px] text-slate-500 block uppercase">{isBn ? 'ম্যাচ' : 'Caps'}</span>
                  </div>
                  <div>
                    <span className="text-xl font-black text-emerald-400">
                      {activePlayerModal.position === 'Goalkeeper' ? activePlayerModal.cleanSheets : activePlayerModal.goals}
                    </span>
                    <span className="text-[10px] text-slate-500 block uppercase">
                      {activePlayerModal.position === 'Goalkeeper' ? (isBn ? 'ক্লিন শিট' : 'Clean') : (isBn ? 'গোল' : 'Goals')}
                    </span>
                  </div>
                  <div>
                    <span className="text-xl font-black text-amber-400">{activePlayerModal.assists}</span>
                    <span className="text-[10px] text-slate-500 block uppercase">{isBn ? 'অ্যাসিস্ট' : 'Assists'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
