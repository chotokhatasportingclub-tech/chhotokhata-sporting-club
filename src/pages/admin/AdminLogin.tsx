import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  RefreshCw,
  Info,
} from 'lucide-react';
import { DEFAULT_LOGO_SVG } from '../../services/db';

export const AdminLogin: React.FC = () => {
  const { loginWithGoogle, logout, currentUser, isAdmin, setCurrentRoute, language, settings } = useApp();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{
    code: string;
    title: string;
    message: string;
    steps?: string[];
  } | null>(null);

  const handleGoogleLogin = async () => {
    setErrorDetails(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Login action error:', err);
      const code = err.code || '';
      const msg = err.message || '';

      if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain') || msg.includes('not authorized')) {
        setErrorDetails({
          code: 'auth/unauthorized-domain',
          title: 'ডোমেইন অনুমোদন প্রয়োজন (Domain Not Authorized)',
          message: 'আপনার হোস্টিং ডোমেইনটি (chotokhata-sporting-club.web.app) ফায়ারবেস অথেনটিকেশনের অনুমোদিত তালিকায় যুক্ত নেই।',
          steps: [
            'Firebase Console (console.firebase.google.com) এ যান।',
            'বাম পাশের মেনু থেকে Authentication → Settings (বা Authorized Domains) ট্যাবে যান।',
            '"Add domain" বাটনে ক্লিক করে chotokhata-sporting-club.web.app যোগ করুন।',
            'ডোমেইন যুক্ত হওয়ার পর এই পেজে ফিরে এসে পুনরায় লগইন করুন।',
          ],
        });
      } else if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
        setErrorDetails({
          code: 'auth/operation-not-allowed',
          title: 'Google Sign-In সক্রিয় করা নেই (Provider Disabled)',
          message: 'আপনার ফায়ারবেস প্রজেক্টে Google সাইন-ইন মেথড এখনো এনাবল (Enable) করা হয়নি।',
          steps: [
            'Firebase Console (console.firebase.google.com) এ যান।',
            'Authentication → Sign-in method ট্যাবে যান।',
            'Sign-in providers তালিকা থেকে Google নির্বাচন করুন।',
            'Enable টগলটি চালু করুন, প্রজেক্ট সাপোর্ট ইমেইল হিসেবে chotokhatasportingclub@gmail.com নির্বাচন করে Save করুন।',
          ],
        });
      } else if (code === 'auth/popup-blocked' || msg.includes('popup-blocked')) {
        setErrorDetails({
          code: 'auth/popup-blocked',
          title: 'পপআপ ব্লক হয়েছে (Browser Popup Blocked)',
          message: 'আপনার ব্রাউজার Google লগইন উইন্ডোটি ব্লক করেছে।',
          steps: [
            'ব্রাউজারের এড্রেস বারের ডান পাশে থাকা "পপআপ ব্লক" আইকনে ক্লিক করুন।',
            '"Always allow pop-ups and redirects from this site" অপশনটি সিলেক্ট করে Done চাপুন।',
            'আবার লগইন বাটনে চাপুন।',
          ],
        });
      } else if (code === 'auth/popup-closed-by-user') {
        setErrorDetails({
          code: 'auth/popup-closed-by-user',
          title: 'লগইন উইন্ডো বন্ধ করা হয়েছে',
          message: 'লগইন প্রক্রিয়া সম্পন্ন হওয়ার আগেই পপআপ উইন্ডোটি বন্ধ করা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        });
      } else {
        setErrorDetails({
          code: code || 'auth/unknown',
          title: 'লগইন ত্রুটি (Login Error)',
          message: msg || 'লগইন সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchAccount = async () => {
    try {
      await logout();
      await handleGoogleLogin();
    } catch (e) {
      console.warn('Switch account error:', e);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 animate-fade-in">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative text-center">
        {/* Crest */}
        <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-slate-800 p-2 mx-auto mb-6 shadow-inner flex items-center justify-center">
          <img src={settings.logoUrl || DEFAULT_LOGO_SVG} alt="Logo" className="w-full h-full object-contain" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Lock className="w-3.5 h-3.5" />
          <span>{isBn ? 'সুরক্ষিত অ্যাডমিন পোর্টাল' : 'Secure Admin Portal'}</span>
        </div>

        <h2 className="text-2xl font-black text-white mb-2">
          {isBn ? settings.clubNameBn : settings.clubNameEn}
        </h2>
        <p className="text-xs text-slate-400 mb-8 leading-relaxed">
          {isBn
            ? 'ক্লাবের ওয়েবসাইট সেটিংস, খেলোয়াড় তালিকা, ম্যাচ রেজাল্ট ও মিডিয়া পরিচালনার জন্য প্রবেশ করুন।'
            : 'Authorized club officers login to manage scores, players, banners, news, and site configuration.'}
        </p>

        {currentUser && !isAdmin ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>অননুমোদিত একাউন্ট ({currentUser.email})</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                আপনি যে ইমেইল দিয়ে লগইন করেছেন তা ক্লাবের অনুমোদিত অ্যাডমিন তালিকায় নেই। ক্লাবের প্রধান প্রশাসনিক ইমেইল{' '}
                <span className="font-mono text-emerald-400 font-bold">chotokhatasportingclub@gmail.com</span> দিয়ে লগইন করুন।
              </p>
            </div>

            <button
              onClick={handleSwitchAccount}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>সঠিক অ্যাডমিন একাউন্টে পরিবর্তন করুন</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Detailed Diagnostic Error Box if an error occurred */}
            {errorDetails && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-left space-y-2 mb-4 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorDetails.title}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {errorDetails.message}
                </p>

                {errorDetails.steps && errorDetails.steps.length > 0 && (
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5 mt-2">
                    <span className="font-bold text-[11px] text-amber-400 block">কীভাবে ঠিক করবেন (সমাধান):</span>
                    <ol className="list-decimal list-inside space-y-1 text-[10px] text-slate-300">
                      {errorDetails.steps.map((step, idx) => (
                        <li key={idx} className="leading-normal">{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl transition cursor-pointer flex items-center justify-center gap-3 disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'যাচাই করা হচ্ছে...' : 'Google দিয়ে অ্যাডমিন লগইন'}</span>
            </button>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              {isBn ? 'অনুমোদিত সুপার অ্যাডমিন:' : 'Designated Super Admin:'}{' '}
              <span className="font-mono text-emerald-400 font-semibold">chotokhatasportingclub@gmail.com</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
