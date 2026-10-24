import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Award, Medal, Sparkles } from 'lucide-react';

export const Achievements: React.FC = () => {
  const { achievements, language } = useApp();
  const isBn = language === 'bn';

  return (
    <div className="min-h-screen py-16 animate-fade-in">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Trophy className="w-4 h-4" />
          <span>{isBn ? 'ক্লাব ট্রফি ও সম্মাননা' : 'Honors & Trophies'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {isBn ? 'গৌরবময় ট্রফি ও সাফল্য' : 'Championship Honors & Awards'}
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          {isBn
            ? 'আমাদের বীর খেলোয়াড় ও সমর্থকদের পরিশ্রমে অর্জিত গৌরবময় কাপ ও চ্যাম্পিয়নশিপ।'
            : 'Celebrating our historic trophies, regional tournament victories, and football awards.'}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl transition hover:-translate-y-1"
            >
              <div className="relative aspect-16/9 bg-slate-950 overflow-hidden">
                <img
                  src={ach.photoUrl || 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=800&auto=format&fit=crop'}
                  alt={ach.trophyName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow">
                  {ach.year} • {ach.position}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {ach.tournamentName}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {ach.trophyName}
                </h3>
                {ach.description && (
                  <p className="text-slate-300 text-sm leading-relaxed pt-2">
                    {ach.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
