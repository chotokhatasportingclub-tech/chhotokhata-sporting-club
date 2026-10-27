import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SquadBoard } from '../../components/lineup/SquadBoard';
import { SquadBuilder } from '../../components/lineup/SquadBuilder';
import { PlayerKitBadge } from '../../components/lineup/PlayerKitBadge';
import {
  Trophy,
  Users,
  Shield,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Lock,
  PlusCircle,
} from 'lucide-react';
import { DEFAULT_LOGO_SVG } from '../../services/db';

interface LineupPageProps {
  initialTab?: 'board' | 'builder' | 'squad';
}

export const LineupPage: React.FC<LineupPageProps> = ({ initialTab = 'board' }) => {
  const { players, matches, settings, language, setCurrentRoute, isAdmin, showToast } = useApp();
  const isBn = language === 'bn';

  const [activeTab, setActiveTab] = useState<'board' | 'builder' | 'squad'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="min-h-screen py-16 animate-fade-in bg-slate-950">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>{isBn ? 'ম্যাচ ট্যাকটিক্যাল লাইনআপ ও স্কোয়াড' : 'Official Match Lineup & Squad'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {isBn ? 'ছোটখাতা স্পোর্টিং ক্লাব ট্যাকটিক্যাল বোর্ড ও স্কোয়াড' : 'CSC Tactical Formation & Squad Builder'}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          {isBn
            ? 'ম্যাচ ট্যাকটিক্যাল লাইনআপ বোর্ড, বন্ধুদের সাথে বন্ধুত্বপূর্ণ ম্যাচের জন্য নিজস্ব স্কোয়াড তৈরি (Squad Builder) এবং ২০ জন নিবন্ধিত খেলোয়াড়ের তালিকা।'
            : 'Explore starting XI formations, build custom friendly match squads from registered players, and browse the official 20-player roster.'}
        </p>

        {/* Admin Manage CTA */}
        {isAdmin && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setCurrentRoute('admin')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>অ্যাডমিন প্যানেল থেকে লাইনআপ পরিবর্তন ও কাস্টমাইজ করুন</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* View Toggle Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'board'
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-950 ring-2 ring-emerald-400/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{isBn ? 'ম্যাচ ট্যাকটিক্যাল বোর্ড' : 'Tactical Pitch Board'}</span>
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'builder'
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-950 ring-2 ring-emerald-400/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>{isBn ? 'দল তৈরি করুন (Squad Builder)' : 'Build Custom Squad'}</span>
          </button>

          <button
            onClick={() => setActiveTab('squad')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'squad'
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-950 ring-2 ring-emerald-400/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isBn ? '২০ জন অফিসিয়াল খেলোয়াড়' : '20-Player Squad List'}</span>
          </button>
        </div>

        {activeTab === 'board' ? (
          <SquadBoard
            allPlayers={players}
            allMatches={matches}
            isEditable={false}
            clubLogo={settings.logoUrl || DEFAULT_LOGO_SVG}
            clubNameBn={settings.clubNameBn}
            clubNameEn={settings.clubNameEn}
            showToast={showToast}
          />
        ) : activeTab === 'builder' ? (
          <SquadBuilder
            allPlayers={players}
            clubLogo={settings.logoUrl || DEFAULT_LOGO_SVG}
            clubNameBn={settings.clubNameBn}
            clubNameEn={settings.clubNameEn}
            showToast={showToast}
          />
        ) : (
          /* Official 20-Player Squad Grid */
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="border-b border-slate-800 pb-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-white">
                  {isBn ? 'অফিসিয়াল ২০ জন নিবন্ধিত ফুটবলার' : 'Official 20 Registered Players'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  গোলরক্ষক (১-২), ডিফেন্ডার (৩-১০), মিডফিল্ডার (১১-১৪), অ্যাটাকিং মিডফিল্ডার (১৫-১৭), স্ট্রাইকার (১৮-২০)
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                ২০ জন প্রস্তুত যোদ্ধা
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 transition shadow-lg flex items-center gap-3.5"
                >
                  <PlayerKitBadge
                    photoUrl={p.photoUrl}
                    jerseyNumber={p.jerseyNumber}
                    name={p.fullName}
                    nameBn={p.nameBn}
                    size="md"
                    isCaptain={p.isCaptain}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-amber-400 font-mono">
                        #{p.jerseyNumber}
                      </span>
                      <h4 className="text-sm font-black text-white truncate">
                        {p.fullName}
                      </h4>
                    </div>
                    {p.nameBn && (
                      <p className="text-xs text-emerald-400 truncate">
                        {p.nameBn}
                      </p>
                    )}
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md">
                      {p.position}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
