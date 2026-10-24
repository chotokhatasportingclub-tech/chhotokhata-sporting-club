import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Shield, Info } from 'lucide-react';

export const Standings: React.FC = () => {
  const { standings, tournaments, language } = useApp();
  const isBn = language === 'bn';

  // Get distinct tournament names
  const availableTournaments = Array.from(new Set(standings.map((s) => s.tournamentName))).filter(Boolean);
  const [selectedTournament, setSelectedTournament] = useState<string>(
    availableTournaments[0] || (tournaments[0]?.name ?? '')
  );

  const currentStandings = standings
    .filter((s) => !selectedTournament || s.tournamentName === selectedTournament)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

  return (
    <div className="min-h-screen py-16 animate-fade-in">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Trophy className="w-4 h-4" />
          <span>{isBn ? 'পয়েন্ট টেবিল ও অবস্থান' : 'League Standings & Table'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {isBn ? 'অফিসিয়াল লিগ পয়েন্ট টেবিল' : 'Official Championship Standings'}
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          {isBn
            ? 'ম্যাচ জয় (৩ পয়েন্ট), ড্র (১ পয়েন্ট), হার (০ পয়েন্ট) ভিত্তিক হালনাগাদ স্কোরবোর্ড।'
            : 'Standard tournament calculation: 3 points for a Win, 1 point for a Draw, 0 for Loss.'}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Tournament Switcher */}
        {availableTournaments.length > 1 && (
          <div className="flex items-center justify-center gap-2 pb-2">
            <span className="text-xs font-bold text-slate-400">{isBn ? 'টুর্নামেন্ট নির্বাচন করুন:' : 'Select Tournament:'}</span>
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer shadow-lg"
            >
              {availableTournaments.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Table Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">
                {selectedTournament || (isBn ? 'টুর্নামেন্ট পয়েন্ট টেবিল' : 'Tournament Points Table')}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {isBn ? `মোট দল: ${currentStandings.length}` : `Teams: ${currentStandings.length}`}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-4 px-4 text-center w-12">#</th>
                  <th className="py-4 px-4">{isBn ? 'দলের নাম' : 'Club / Team'}</th>
                  <th className="py-4 px-3 text-center">{isBn ? 'ম্যাচ (P)' : 'P'}</th>
                  <th className="py-4 px-3 text-center text-emerald-400">{isBn ? 'জয় (W)' : 'W'}</th>
                  <th className="py-4 px-3 text-center text-slate-300">{isBn ? 'ড্র (D)' : 'D'}</th>
                  <th className="py-4 px-3 text-center text-rose-400">{isBn ? 'হার (L)' : 'L'}</th>
                  <th className="py-4 px-3 text-center hidden md:table-cell">{isBn ? 'পক্ষে গোল' : 'GF'}</th>
                  <th className="py-4 px-3 text-center hidden md:table-cell">{isBn ? 'বিপক্ষে গোল' : 'GA'}</th>
                  <th className="py-4 px-3 text-center font-mono">{isBn ? 'ব্যবধান (GD)' : 'GD'}</th>
                  <th className="py-4 px-5 text-center font-black text-white text-base">{isBn ? 'পয়েন্ট' : 'PTS'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {currentStandings.map((row, idx) => {
                  const isHome =
                    row.teamName.toLowerCase().includes('chhotokhata') || row.teamName.includes('ছোটখাতা');
                  return (
                    <tr
                      key={row.id}
                      className={`transition hover:bg-slate-800/40 ${
                        isHome ? 'bg-emerald-950/30 border-l-4 border-l-emerald-500' : ''
                      }`}
                    >
                      <td className="py-4 px-4 text-center font-bold text-slate-400">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                            idx === 0
                              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950'
                              : idx === 1
                              ? 'bg-slate-300 text-slate-950'
                              : idx === 2
                              ? 'bg-amber-700 text-white'
                              : 'text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                        {row.teamLogo && (
                          <img src={row.teamLogo} alt="" className="w-7 h-7 object-contain shrink-0" />
                        )}
                        <span className="truncate max-w-[220px]">{row.teamName}</span>
                        {isHome && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            হোম ক্লাব
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-center text-slate-300">{row.played}</td>
                      <td className="py-4 px-3 text-center font-semibold text-emerald-400">{row.won}</td>
                      <td className="py-4 px-3 text-center text-slate-300">{row.drawn}</td>
                      <td className="py-4 px-3 text-center text-rose-400">{row.lost}</td>
                      <td className="py-4 px-3 text-center text-slate-400 hidden md:table-cell">{row.goalsFor}</td>
                      <td className="py-4 px-3 text-center text-slate-400 hidden md:table-cell">{row.goalsAgainst}</td>
                      <td className="py-4 px-3 text-center font-mono font-bold text-slate-300">
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="py-4 px-5 text-center font-black text-lg text-emerald-400 font-mono">
                        {row.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span>১ম স্থান: চ্যাম্পিয়নশিপ কোয়ালিফায়ার</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Info className="w-3.5 h-3.5" />
              <span>P: ম্যাচ | W: জয় | D: ড্র | L: হার | GD: গোল ব্যবধান | PTS: পয়েন্ট</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
