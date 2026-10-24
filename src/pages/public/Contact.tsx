import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { sendContactMessage } from '../../services/db';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Facebook,
  Youtube,
  Instagram,
  Clock,
  Shield,
  Loader2,
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { settings, language, showToast } = useApp();
  const isBn = language === 'bn';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.name.trim()) {
      setErrorMessage(isBn ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage(isBn ? 'সঠিক ইমেইল ঠিকানা দিন।' : 'Please enter a valid email address.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage(isBn ? 'অনুগ্রহ করে আপনার বার্তা লিখুন।' : 'Please write your message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim() || 'General Inquiry',
        message: formData.message.trim(),
      });

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      showToast(
        isBn
          ? 'আপনার বার্তাটি সফলভাবে ক্লাবের কাছে পাঠানো হয়েছে!'
          : 'Your message has been sent to Chhotokhata SC successfully!',
        'success'
      );
    } catch (err: any) {
      console.error('Contact error:', err);
      setErrorMessage(
        isBn
          ? 'বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'
          : 'Failed to send message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 animate-fade-in">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Mail className="w-4 h-4" />
          <span>{isBn ? 'ক্লাব যোগাযোগ ও সহায়তা' : 'Contact & Inquiries'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {isBn ? 'আমাদের সাথে যোগাযোগ করুন' : 'Get in Touch with CSC'}
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          {isBn
            ? 'খেলোয়াড় ট্রায়াল, সদস্যপদ, স্পনসরশিপ বা যেকোনো তথ্যের জন্য সরাসরি ক্লাব কর্তৃপক্ষের সাথে যোগাযোগ করুন।'
            : 'Have questions about squad trials, membership, tickets or sponsorships? Send us a message.'}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Cards & Ground Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
                {isBn ? 'ক্লাব ঠিকানা ও তথ্য' : 'Official Club Contact'}
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block uppercase">
                      {isBn ? 'কার্যালয় ও গ্রাউন্ড ঠিকানা' : 'Club Location'}
                    </span>
                    <span className="text-slate-200 font-medium leading-relaxed block">
                      {settings.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block uppercase">
                      {isBn ? 'হোম গ্রাউন্ড' : 'Home Stadium'}
                    </span>
                    <span className="text-white font-bold">{settings.homeGround}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block uppercase">
                      {isBn ? 'ফোন নম্বর' : 'Phone'}
                    </span>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-white font-bold hover:text-emerald-400 transition"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block uppercase">
                      {isBn ? 'অফিসিয়াল ইমেইল' : 'Email'}
                    </span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-white font-bold hover:text-emerald-400 transition truncate block max-w-xs"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-500 font-semibold block uppercase mb-3">
                  {isBn ? 'সামাজিক যোগাযোগ মাধ্যম' : 'Social Channels'}
                </span>
                <div className="flex items-center gap-3">
                  {settings.facebookUrl && (
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-white flex items-center gap-2 text-xs font-semibold transition"
                    >
                      <Facebook className="w-4 h-4 text-blue-500" />
                      <span>Facebook</span>
                    </a>
                  )}
                  {settings.youtubeUrl && (
                    <a
                      href={settings.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-white flex items-center gap-2 text-xs font-semibold transition"
                    >
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span>YouTube</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Map Link Box */}
            {settings.mapsUrl && (
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 shadow-xl transition group text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h4 className="text-white font-bold text-sm">
                        {isBn ? 'গুগল ম্যাপে গ্রাউন্ড লোকেশন' : 'Google Maps Ground Location'}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {isBn ? 'সরাসরি রুট ও ডিরেকশন দেখুন' : 'Get directions to the field'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </a>
            )}
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
              <h3 className="text-2xl font-black text-white mb-2">
                {isBn ? 'সরাসরি বার্তা পাঠান' : 'Send Us a Message'}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                {isBn
                  ? 'নিচের ফর্মটি পূরণ করে পাঠান। আমাদের ক্লাব টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।'
                  : 'Fill out this form and our management will get back to you promptly.'}
              </p>

              {success && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold">বার্তা সফলভাবে পাঠানো হয়েছে!</div>
                    <div>আপনার বার্তার জন্য ধন্যবাদ। ক্লাব কর্মকর্তা দ্রুত উত্তর দেবেন।</div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      {isBn ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isBn ? 'উদা: মোঃ আরিফুল ইসলাম' : 'e.g. John Doe'}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      {isBn ? 'ইমেইল ঠিকানা *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      {isBn ? 'ফোন নম্বর (ঐচ্ছিক)' : 'Phone Number (Optional)'}
                    </label>
                    <input
                      type="tel"
                      placeholder="+880 17..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      {isBn ? 'বিষয়' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      placeholder={isBn ? 'উদা: খেলোয়াড় ট্রায়াল / স্পনসরশিপ' : 'e.g. Player Trial'}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {isBn ? 'বার্তা বিবরণী *' : 'Message *'}
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder={isBn ? 'আপনার বার্তাটি বিস্তারিত লিখুন...' : 'Write your inquiry here...'}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white shadow-xl shadow-emerald-950/60 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isBn ? 'বার্তা পাঠানো হচ্ছে...' : 'Sending Message...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isBn ? 'বার্তা নিশ্চিত করুন ও পাঠান' : 'Submit Message'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
