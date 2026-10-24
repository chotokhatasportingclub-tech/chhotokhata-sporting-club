import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  KeyRound,
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginWithGoogle, currentUser, isAdmin, setCurrentRoute, language, settings } = useApp();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 animate-fade-in">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative text-center">
        {/* Crest */}
        <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-slate-800 p-2 mx-auto mb-6 shadow-inner flex items-center justify-center">
          <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
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

        {currentUser && isAdmin ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div className="text-left">
                <div className="font-bold">অ্যাডমিন প্রবেশাধিকার সক্রিয়</div>
                <div>ইমেইল: {currentUser.email}</div>
              </div>
            </div>

            <button
              onClick={() => setCurrentRoute('admin')}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isBn ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'Go to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : currentUser && !isAdmin ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-3 text-left">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-bold">অননুমোদিত একাউন্ট ({currentUser.email})</div>
                <div className="text-[11px] text-amber-300 mt-1">
                  এই ইমেইলটি ক্লাবের অনুমোদিত অ্যাডমিন তালিকায় নেই। অনুগ্রহ করে ক্লাবের মূল ইমেইল{' '}
                  <span className="font-mono text-white">chotokhatasportingclub@gmail.com</span> অথবা দায়িত্বপ্রাপ্ত অ্যাডমিন দিয়ে লগইন করুন।
                </div>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
            >
              ভিন্ন একাউন্টে লগইন করুন
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-left mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl transition cursor-pointer flex items-center justify-center gap-3"
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
              {isBn ? 'স্বীকৃত সুপার অ্যাডমিন:' : 'Designated Super Admin:'}{' '}
              <span className="font-mono text-slate-400">chotokhatasportingclub@gmail.com</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
