import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageUploader } from '../../components/common/ImageUploader';
import { submitPlayerRegistration, DEFAULT_LOGO_SVG } from '../../services/db';
import { PlayerRegistration } from '../../types';
import {
  UserCheck,
  Shield,
  CheckCircle2,
  AlertCircle,
  Copy,
  Printer,
  Calendar,
  Phone,
  MapPin,
  Award,
  ArrowLeft,
  Share2,
  Sparkles,
  Loader2,
  Info,
} from 'lucide-react';

export const PlayerRegistrationPage: React.FC = () => {
  const {
    settings,
    sportCategories,
    registrationSettings,
    showToast,
    setCurrentRoute,
  } = useApp();

  // Form State
  const [fullNameBn, setFullNameBn] = useState('');
  const [fullNameEn, setFullNameEn] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [altMobileNumber, setAltMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [sport, setSport] = useState(
    registrationSettings.allowedSports[0] || 'football'
  );
  const [position, setPosition] = useState('Midfielder');
  const [sportRole, setSportRole] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState<string>('');
  const [previousClub, setPreviousClub] = useState('');
  const [experience, setExperience] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [submittedRegistration, setSubmittedRegistration] =
    useState<PlayerRegistration | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Filter allowed sports
  const availableSportCategories = sportCategories.filter(
    (sc) =>
      sc.isActive &&
      (registrationSettings.allowedSports.length === 0 ||
        registrationSettings.allowedSports.includes(sc.key))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registrationSettings.isOpen) {
      showToast('বর্তমানে অনলাইন খেলোয়াড় নিবন্ধন সাময়িকভাবে স্থগিত রয়েছে।', 'error');
      return;
    }

    if (!fullNameBn.trim() || !fullNameEn.trim()) {
      showToast('বাংলা এবং ইংরেজিতে পূর্ণ নাম আবশ্যক।', 'error');
      return;
    }

    if (!fatherName.trim()) {
      showToast('পিতার নাম আবশ্যক।', 'error');
      return;
    }

    if (!dateOfBirth) {
      showToast('জন্ম তারিখ আবশ্যক।', 'error');
      return;
    }

    if (!mobileNumber.trim() || mobileNumber.length < 10) {
      showToast('সঠিক মোবাইল নম্বর প্রদান করুন (কমপক্ষে ১০ ডিজিট)।', 'error');
      return;
    }

    if (!address.trim()) {
      showToast('বর্তমান ঠিকানা ও গ্রাম আবশ্যক।', 'error');
      return;
    }

    if (!isAgreed) {
      showToast('ক্লাবের নিয়মাবলী ও সত্যতা সংক্রান্ত ঘোষণায় সম্মতি প্রদান করুন।', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const regData = {
        fullNameBn: fullNameBn.trim(),
        fullNameEn: fullNameEn.trim(),
        fatherName: fatherName.trim(),
        dateOfBirth,
        mobileNumber: mobileNumber.trim(),
        altMobileNumber: altMobileNumber.trim() || undefined,
        address: address.trim(),
        photoUrl: photoUrl.trim() || '',
        sport,
        position,
        sportRole: sportRole.trim() || position,
        jerseyNumber: jerseyNumber ? Number(jerseyNumber) : undefined,
        previousClub: previousClub.trim() || undefined,
        experience: experience.trim() || undefined,
        emergencyContact: emergencyContact.trim() || undefined,
        additionalInfo: additionalInfo.trim() || undefined,
      };

      const result = await submitPlayerRegistration(regData);
      setSubmittedRegistration(result);
      showToast('আপনার আবেদন সফলভাবে জমা হয়েছে!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Registration submission error:', err);
      showToast(
        `আবেদন জমা দিতে সমস্যা হয়েছে: ${err.message || 'নেটওয়ার্ক ত্রুটি, পুনরায় চেষ্টা করুন'}`,
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#player-registration`;
    navigator.clipboard.writeText(url);
    showToast('নিবন্ধন লিংক ক্লিপবোর্ডে কপি করা হয়েছে!', 'success');
  };

  const handleCopyTrackingNo = (regNo: string) => {
    navigator.clipboard.writeText(regNo);
    setCopiedTracking(true);
    showToast(`রেজিস্ট্রেশন নম্বর (${regNo}) কপি করা হয়েছে!`, 'success');
    setTimeout(() => setCopiedTracking(false), 2500);
  };

  // SUCCESS CONFIRMATION SLIP VIEW
  if (submittedRegistration) {
    return (
      <div className="py-12 px-4 max-w-3xl mx-auto animate-fade-in text-slate-100">
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Success Header */}
          <div className="text-center pb-6 border-b border-slate-800">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              আবেদন সফলভাবে গৃহীত হয়েছে
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-3">
              {settings.clubNameBn}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              খেলোয়াড় ও সদস্য ভর্তি নিবন্ধন স্বীকৃতিপত্র
            </p>
          </div>

          {/* Tracking Number Card */}
          <div className="my-6 p-4 sm:p-6 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block font-medium">
                আপনার অফিসিয়াল রেজিস্ট্রেশন ট্র্যাকিং নম্বর:
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400 tracking-wider">
                {submittedRegistration.registrationNo}
              </span>
            </div>
            <button
              onClick={() => handleCopyTrackingNo(submittedRegistration.registrationNo)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition border border-slate-700"
            >
              <Copy className="w-4 h-4 text-emerald-400" />
              <span>{copiedTracking ? 'কপি হয়েছে!' : 'নম্বর কপি করুন'}</span>
            </button>
          </div>

          {/* Application Details Summary */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>আবেদনকারীর বিবরণী</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 items-center">
              {/* Photo */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500/30 flex items-center justify-center shadow-inner">
                  {submittedRegistration.photoUrl ? (
                    <img
                      src={submittedRegistration.photoUrl}
                      alt={submittedRegistration.fullNameBn}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCheck className="w-12 h-12 text-slate-600" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1">প্রতিকৃতি ছবি</span>
              </div>

              {/* Info columns */}
              <div className="sm:col-span-2 space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">নাম (বাংলা):</span>
                  <span className="font-bold text-white">{submittedRegistration.fullNameBn}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">নাম (English):</span>
                  <span className="font-bold text-white">{submittedRegistration.fullNameEn}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">পিতার নাম:</span>
                  <span className="font-medium text-slate-200">{submittedRegistration.fatherName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">ক্রীড়া ও পজিশন:</span>
                  <span className="font-bold text-emerald-400">
                    {submittedRegistration.sport.toUpperCase()} • {submittedRegistration.position}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">মোবাইল নম্বর:</span>
                  <span className="font-mono text-slate-200">{submittedRegistration.mobileNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-400">আবেদনের স্ট্যাটাস:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    বিচারাধীন (Pending Approval)
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">আবেদনের সময়:</span>
                  <span className="text-slate-400">
                    {new Date(submittedRegistration.submittedAt).toLocaleDateString('bn-BD', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines Notice */}
          <div className="mt-6 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200/90 space-y-1.5">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              <span>পরবর্তী পদক্ষেপ ও যাচাই-বাছাই:</span>
            </div>
            <p>
              আপনার আবেদনটি ক্লাবের প্রশাসনিক প্যানেলে সফলভাবে জমা হয়েছে। ক্লাবের নির্বাচন ও যাচাই-বাছাই কমিটি আবেদনের সকল তথ্য যাচাই করার পর আপনাকে যোগাযোগ করবে এবং অনুমোদিত হলে অফিসিয়াল স্কোয়াড ও লাইনআপ বোর্ডে অন্তর্ভুক্ত করা হবে।
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition border border-slate-700"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>স্লিপ প্রিন্ট / সংরক্ষণ</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSubmittedRegistration(null);
                  setFullNameBn('');
                  setFullNameEn('');
                  setFatherName('');
                  setMobileNumber('');
                  setPhotoUrl('');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-800 cursor-pointer"
              >
                নতুন আবেদন করুন
              </button>
              <button
                onClick={() => setCurrentRoute('home')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg cursor-pointer transition"
              >
                মূল ওয়েবসাইটে যান
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN REGISTRATION FORM VIEW
  return (
    <div className="py-10 px-4 max-w-4xl mx-auto text-slate-100 animate-fade-in">
      {/* Top Breadcrumb & Share Button */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          onClick={() => setCurrentRoute('home')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হোমপেজে ফিরুন</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 transition cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>নিবন্ধন লিংক শেয়ার করুন</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10 mb-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={settings.logoUrl || DEFAULT_LOGO_SVG}
            alt={settings.clubNameBn}
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain shrink-0 drop-shadow-xl p-2 bg-slate-950 rounded-2xl border border-slate-800"
          />
          <div className="text-center sm:text-left flex-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              অনলাইন খেলোয়াড় ও সদস্য ভর্তি ফরম
            </span>
            <h1 className="text-xl sm:text-3xl font-black text-white">
              {settings.clubNameBn}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {settings.clubNameEn} • অফিসিয়াল সেলফ-রেজিস্ট্রেশন প্ল্যাটফর্ম
            </p>
          </div>
        </div>

        {/* Announcement / Notice Box */}
        {registrationSettings.announcementBn && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-start gap-3 text-xs text-amber-200/90 bg-amber-950/20 p-4 rounded-2xl border border-amber-500/20">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block mb-0.5">জরুরি নির্দেশনা:</span>
              <span>{registrationSettings.announcementBn}</span>
              {registrationSettings.deadline && (
                <div className="mt-2 text-[11px] font-bold text-amber-400">
                  📅 আবেদনের শেষ সময়সীমা: {registrationSettings.deadline}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Closed Registration Notice */}
      {!registrationSettings.isOpen ? (
        <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">নিবন্ধন বর্তমানে সাময়িকভাবে বন্ধ রয়েছে</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            ক্লাবের এই মৌসুমের খেলোয়াড় বাছাই প্রক্রিয়া সাময়িকভাবে সমাপ্ত হয়েছে। পরবর্তী বিজ্ঞপ্তি পর্যন্ত অপেক্ষা করুন অথবা সরাসরি ক্লাবের সাথে যোগাযোগ করুন।
          </p>
          {registrationSettings.contactNumber && (
            <div className="text-xs font-mono text-emerald-400">
              যোগাযোগ: {registrationSettings.contactNumber}
            </div>
          )}
        </div>
      ) : (
        /* The Active Form */
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Information */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                ১. আবেদনকারীর ব্যক্তিগত তথ্যাবলী (Personal Information)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  বাংলায় পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="উদা: মোঃ আব্দুর রাজ্জাক"
                  value={fullNameBn}
                  onChange={(e) => setFullNameBn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  ইংরেজিতে পূর্ণ নাম (Full Name in English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Md. Abdur Razzak"
                  value={fullNameEn}
                  onChange={(e) => setFullNameEn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  পিতার নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="উদা: মোঃ রফিকুল ইসলাম"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  জন্ম তারিখ (Date of Birth) *
                </label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  মোবাইল নম্বর (প্রধান) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  বিকল্প মোবাইল নম্বর / হোয়াটসঅ্যাপ (ঐচ্ছিক)
                </label>
                <input
                  type="tel"
                  placeholder="018XXXXXXXX"
                  value={altMobileNumber}
                  onChange={(e) => setAltMobileNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">
                  স্থায়ী ও বর্তমান ঠিকানা (গ্রাম, ডাকঘর, উপজেলা, জেলা) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="গ্রাম: ছোটখাতা, ডাকঘর: ছোটখাতা, উপজেলা: ডিমলা, জেলা: নীলফামারী"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Profile Photo Upload */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
              <Award className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                ২. প্রতিকৃতি ছবি আপলোড (Profile Photograph)
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              পাসপোর্ট সাইজের স্পষ্ট ও সাম্প্রতিক ছবি আপলোড করুন। এটি আপনার অফিসিয়াল খেলোয়াড় প্রোফাইল ও স্কোয়াড বোর্ডে প্রদর্শিত হবে।
            </p>
            <ImageUploader
              label="খেলোয়াড়ের স্পষ্ট ছবি সংযুক্ত করুন:"
              value={photoUrl}
              onChange={setPhotoUrl}
              onUploadingChange={setIsUploadingPhoto}
              folder="player_registrations"
              aspectHint="JPG, PNG, WebP (পাসপোর্ট সাইজ বা সেলফি, সর্বোচ্চ ১০ মেগাবাইট)"
            />
          </div>

          {/* Section 3: Sport & Playing Information */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                ৩. ক্রীড়া পছন্দ ও পারফরম্যান্স তথ্য (Sport & Discipline)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Preferred Sport */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  পছন্দের ক্রীড়া / বিভাগ (Preferred Sport) *
                </label>
                <select
                  value={sport}
                  onChange={(e) => {
                    const newSport = e.target.value;
                    setSport(newSport);
                    // set default position for the selected sport
                    if (newSport === 'cricket') setPosition('All-Rounder');
                    else if (newSport === 'badminton') setPosition('Shuttler');
                    else if (newSport === 'volleyball') setPosition('Spiker');
                    else if (newSport === 'athletics') setPosition('Sprinter');
                    else if (newSport === 'cultural') setPosition('Performer');
                    else setPosition('Midfielder');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                >
                  {availableSportCategories.map((sc) => (
                    <option key={sc.id} value={sc.key}>
                      {sc.iconEmoji} {sc.nameBn} ({sc.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Position / Role based on sport */}
              {sport === 'football' ? (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      খেলার পজিশন (Position) *
                    </label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Goalkeeper">গোলরক্ষক (Goalkeeper)</option>
                      <option value="Defender">ডিফেন্ডার (Defender)</option>
                      <option value="Midfielder">মিডফিল্ডার (Midfielder)</option>
                      <option value="Attacking Midfielder">অ্যাটাকিং মিডফিল্ডার (AM)</option>
                      <option value="Striker">স্ট্রাইকার (Striker)</option>
                      <option value="Forward">ফরওয়ার্ড (Forward)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      পছন্দের জার্সি নম্বর (ঐচ্ছিক)
                    </label>
                    <input
                      type="number"
                      placeholder="উদা: 7, 10, 9"
                      value={jerseyNumber}
                      onChange={(e) => setJerseyNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      পছন্দের পা (Preferred Foot)
                    </label>
                    <select
                      value={sportRole}
                      onChange={(e) => setSportRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                    >
                      <option value="Right-Footed">ডান পা (Right-Footed)</option>
                      <option value="Left-Footed">বাঁ পা (Left-Footed)</option>
                      <option value="Both-Feet">উভয় পা (Both)</option>
                    </select>
                  </div>
                </>
              ) : sport === 'cricket' ? (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      ক্রিকেট ভূমিকা (Cricket Role) *
                    </label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Batsman">ব্যাটসম্যান (Batsman)</option>
                      <option value="Bowler">বোলার (Bowler)</option>
                      <option value="All-Rounder">অলরাউন্ডার (All-Rounder)</option>
                      <option value="Wicket-Keeper">উইকেটকিপার (Wicket-Keeper)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      ব্যাটিং ও বোলিং স্টাইল
                    </label>
                    <input
                      type="text"
                      placeholder="উদা: ডানহাতি ব্যাটিং, ডানহাতি মিডিয়াম ফাস্ট বল"
                      value={sportRole}
                      onChange={(e) => setSportRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      পছন্দের জার্সি নম্বর (ঐচ্ছিক)
                    </label>
                    <input
                      type="number"
                      placeholder="উদা: 18, 7"
                      value={jerseyNumber}
                      onChange={(e) => setJerseyNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                    />
                  </div>
                </>
              ) : sport === 'athletics' ? (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      প্রধান ইভেন্ট ক্যাটাগরি *
                    </label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="১০০মি স্প্রিন্ট">১০০ মিটার স্প্রিন্ট (100m Sprint)</option>
                      <option value="২০০মি স্প্রিন্ট">২০০ মিটার স্প্রিন্ট (200m Sprint)</option>
                      <option value="৪০০মি দৌড়">৪০০ মিটার দৌড় (400m)</option>
                      <option value="দূরপাল্লার দৌড়">দূরপাল্লার দৌড় (Long Distance)</option>
                      <option value="লং জাম্প">লং জাম্প (Long Jump)</option>
                      <option value="হাই জাম্প">হাই জাম্প (High Jump)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      ব্যক্তিগত সেরা টাইমিং / রেকর্ড (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      placeholder="উদা: ১১.২ সেকেন্ড (জেলা চ্যাম্পিয়নশিপ)"
                      value={sportRole}
                      onChange={(e) => setSportRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                    />
                  </div>
                </>
              ) : sport === 'cultural' ? (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      সাংস্কৃতিক ভূমিকা *
                    </label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Performer">শিল্পী / পারফর্মার (Performer)</option>
                      <option value="Organizer">সাংস্কৃতিক সংগঠক (Organizer)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      শিল্পধারা / মাধ্যম *
                    </label>
                    <input
                      type="text"
                      placeholder="উদা: লোকসঙ্গীত, আবৃত্তি, নাটক, তবলা, গিটার"
                      value={sportRole}
                      onChange={(e) => setSportRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    খেলার ভূমিকা বা ক্যাটাগরি *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="উদা: একক খেলোয়াড়, স্পাইকার, ডিফেন্ডার"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  />
                </div>
              )}

              {/* Previous Club & Experience */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  পূর্ববর্তী দল বা ক্লাব (যদি থাকে)
                </label>
                <input
                  type="text"
                  placeholder="উদা: ছোটখাতা হাই স্কুল দল / ডিমলা একাদশ"
                  value={previousClub}
                  onChange={(e) => setPreviousClub(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  খেলার বা অনুশীলনের অভিজ্ঞতা
                </label>
                <input
                  type="text"
                  placeholder="উদা: ২ বছর স্থানীয় ও উপজেলা পর্যায়ে"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  জরুরি অভিভাবকের যোগাযোগ নম্বর ও সম্পর্ক
                </label>
                <input
                  type="text"
                  placeholder="017XXXXXXXX (পিতা / বড় ভাই)"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">
                  অতিরিক্ত তথ্য বা বিশেষ অর্জন (যদি থাকে)
                </label>
                <textarea
                  rows={2}
                  placeholder="বিগত কোনো টুর্নামেন্টের ম্যান অব দ্য ম্যাচ, ট্রফি, ব্যক্তিগত লক্ষ্য বা বিশেষ দক্ষতা..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Declaration & Terms */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 bg-slate-950 border-slate-700 mt-0.5 shrink-0 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                আমি প্রত্যয়ন করছি যে এই ফরমের সকল তথ্য সত্য ও নির্ভুল। আমি <strong className="text-white">{settings.clubNameBn}</strong>-এর নিয়ম-কানুন, ক্লাব শৃঙ্খলা, এবং ব্যবস্থাপনা কমিটির সকল সিদ্ধান্ত মেনে চলব।
              </span>
            </label>
          </div>

          {/* Submission Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-slate-400">
              * চিহ্নিত প্রতিটি ঘর সঠিকভাবে পূরণ করা আবশ্যক।
            </span>

            <button
              type="submit"
              disabled={isSubmitting || isUploadingPhoto}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm shadow-xl shadow-emerald-950/40 cursor-pointer flex items-center justify-center gap-2 transition transform active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>তথ্য জমা হচ্ছে...</span>
                </>
              ) : isUploadingPhoto ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>ছবি প্রসেসিং হচ্ছে...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>নিবন্ধন ফরম জমা দিন</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
