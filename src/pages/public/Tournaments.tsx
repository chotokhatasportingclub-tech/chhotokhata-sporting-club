import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Calendar, Award, ArrowRight, Shield } from 'lucide-react';

export const Tournaments: React.FC = () => {
  const { tournaments, language, setCurrentRoute } = useApp();
  const isBn = language === 'bn';

  return (
    <div className="min-h-screen py-16 animate-fade-in">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Trophy className="w-4 h-4" />
          <span>{isBn ? 'টুর্নামেন্ট ও কাপ চ্যাম্পিয়নশিপ' : 'Tournaments & Cups'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {isBn ? 'টুর্নামেন্ট সমূহ' : 'Official Tournaments'}
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          {isBn
            ? 'আমাদের ক্লাব আয়োজিত এবং অংশ নেওয়া আঞ্চলিক ও জেলা ভিত্তিক ফুটবল প্রতিযোগিতা।'
            : 'Explore football tournaments, leagues, and championship cups featuring Chhotokhata SC.'}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {tournaments.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">কোনো টুর্নামেন্ট তথ্য নেই</h3>
            <p className="text-xs text-slate-400">শীঘ্রই নতুন মৌসুমের টুর্নামেন্ট যুক্ত করা হবে।</p>
          </div>
        ) : (
          tournaments.map((tour) => (
            <div
              key={tour.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-xl transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Trophy className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                      {tour.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{tour.season}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{tour.name}</h3>
                  {tour.description && (
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed pt-1">
                      {tour.description}
                    </p>
                  )}
                  {(tour.startDate || tour.endDate) && (
                    <div className="text-xs text-slate-400 flex items-center gap-2 pt-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {tour.startDate} {tour.endDate && `থেকে ${tour.endDate}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
                <button
                  onClick={() => setCurrentRoute('standings')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer text-center"
                >
                  {isBn ? 'পয়েন্ট টেবিল' : 'View Standings'}
                </button>
                <button
                  onClick={() => setCurrentRoute('matches')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{isBn ? 'ফিক্সচার ও সূচী' : 'View Fixtures'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
