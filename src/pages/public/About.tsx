import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Target, Compass, Award, MapPin, Users, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  const { settings, language, achievements } = useApp();
  const isBn = language === 'bn';

  const committeeMembers = [
    { name: 'হাজী মোঃ নুরুল ইসলাম', role: 'সভাপতি (President)', phone: '+880 1711-xxxxxx' },
    { name: 'মোঃ মাহাবুবুর রহমান', role: 'সাধারণ সম্পাদক (General Secretary)', phone: '+880 1712-xxxxxx' },
    { name: 'মোশাররফ হোসেন', role: 'সহ-সভাপতি (Vice President)', phone: '+880 1713-xxxxxx' },
    { name: 'মোঃ সেলিম রেজা', role: 'সাংগঠনিক সম্পাদক (Organizing Secretary)', phone: '+880 1714-xxxxxx' },
    { name: 'মাওলানা মোঃ রফিকুল ইসলাম', role: 'কোষাধ্যক্ষ (Treasurer)', phone: '+880 1715-xxxxxx' },
    { name: 'মোঃ জাহেদুল হক', role: 'প্রধান ফুটবল কোচ (Head Coach)', phone: '+880 1716-xxxxxx' },
  ];

  return (
    <div className="min-h-screen py-16 animate-fade-in">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Shield className="w-4 h-4" />
          <span>{isBn ? 'ক্লাব পরিচিতি ও ঐতিহ্য' : 'About CSC & Heritage'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {isBn ? settings.clubNameBn : settings.clubNameEn}
        </h1>
        <p className="text-lg text-emerald-400 font-semibold max-w-2xl mx-auto">
          {settings.tagline}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* History and Introduction */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-8 bg-emerald-500 rounded-full" />
              <span>{isBn ? 'আমাদের ইতিহাস ও প্রতিষ্ঠার গল্প' : 'Our History & Founding Story'}</span>
            </h2>
            <div className="text-slate-300 text-base sm:text-lg leading-relaxed space-y-4">
              <p>{isBn ? settings.history : settings.historyEn || settings.history}</p>
              <p>
                {isBn
                  ? 'ছোটখাতা চৌপথী খেলার মাঠ ও ক্লাব প্রাঙ্গণ সবসময়ই এলাকার ক্রীড়া ও সংস্কৃতির প্রাণকেন্দ্র। ফুটবল, ক্রিকেট, ব্যাডমিন্টন, ভলিবল, অ্যাথলেটিক্স প্রতিযোগিতা এবং বার্ষিক সাংস্কৃতিক ও নাট্যোৎসব আয়োজনের মাধ্যমে আমাদের ক্লাব উত্তরবঙ্গে সুস্থ সংস্কৃতি ও ক্রীড়াচর্চার এক উজ্জ্বল দৃষ্টান্ত স্থাপন করে চলেছে।'
                  : 'Chhotokhata Choupathi sports ground and club premises have always been the heartbeat of regional athletics and culture. Through football, cricket, badminton, volleyball, athletics meets, and traditional cultural festivals, the club sets an exemplary standard for youth empowerment.'}
              </p>
            </div>
          </div>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4">
              {isBn ? 'আমাদের লক্ষ্য ও উদ্দেশ্য (Mission)' : 'Our Mission'}
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              {isBn ? settings.mission : settings.missionEn || settings.mission}
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4">
              {isBn ? 'ভবিষ্যত রূপকল্প (Vision)' : 'Our Vision'}
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              {isBn ? settings.vision : settings.visionEn || settings.vision}
            </p>
          </div>
        </div>

        {/* Management Committee */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? 'ক্লাব পরিচালনা পরিষদ' : 'Management Committee'}</span>
            </div>
            <h2 className="text-3xl font-black text-white">
              {isBn ? 'দায়িত্বপ্রাপ্ত কর্মকর্তা ও পরিচালনা কমিটি' : 'Executive Committee Officers'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {committeeMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md hover:border-slate-700 transition"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 font-black text-sm flex items-center justify-center mb-4">
                  {idx + 1}
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{member.name}</h4>
                <div className="text-xs font-semibold text-emerald-400 mb-3">{member.role}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>সদস্যপদ সক্রিয়</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Home Ground info */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>{isBn ? 'হোম গ্রাউন্ড ও ট্রেনিং ক্যাম্পাস' : 'Home Ground Venue'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">{settings.homeGround}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {settings.address}
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {settings.mapsUrl && (
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer w-full md:w-auto"
              >
                <MapPin className="w-4 h-4" />
                <span>{isBn ? 'গুগল ম্যাপে লোকেশন দেখুন' : 'View on Google Maps'}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
