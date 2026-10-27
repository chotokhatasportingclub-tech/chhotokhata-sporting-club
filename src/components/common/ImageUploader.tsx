import React, { useState, useRef } from 'react';
import { Upload, X, Check, Link as LinkIcon, Loader2, AlertCircle } from 'lucide-react';
import { uploadMedia } from '../../services/storage';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  folder?: string;
  label?: string;
  aspectHint?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = '',
  onChange,
  onUploadingChange,
  folder = 'uploads',
  label = 'ছবি আপলোড করুন',
  aspectHint = 'JPG, PNG, WebP বা SVG (সর্বোচ্চ ১০ মেগাবাইট)',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent duplicate upload triggers if an upload is already in progress
    if (isUploading) return;

    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    onUploadingChange?.(true);
    setProgress(5);

    try {
      const url = await uploadMedia(folder, file, (p) => {
        setProgress(p);
      });

      if (url) {
        onChange(url);
        setError(null);
      } else {
        throw new Error('সার্ভার থেকে সঠিক ইমেজ ইউআরএল পাওয়া যায়নি');
      }
    } catch (err: any) {
      console.warn('Upload error in ImageUploader:', err);
      const errorMsg =
        err?.message && !err.message.includes('object Object')
          ? err.message
          : 'ছবি আপলোড প্রক্রিয়া সম্পন্ন হতে পারেনি। পুনরায় চেষ্টা করুন অথবা ছবির ওয়েব লিংক (URL) ব্যবহার করুন।';
      setError(errorMsg);
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
      setError(null);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* When uploading, always show the active upload progress box */}
      {isUploading ? (
        <div className="border-2 border-emerald-500/40 rounded-2xl p-6 bg-slate-900/80 text-center transition shadow-inner">
          <div className="py-3 space-y-3">
            <Loader2 className="w-9 h-9 text-emerald-400 animate-spin mx-auto" />
            <div className="text-sm font-bold text-white">
              আপলোড ও প্রসেসিং হচ্ছে... <span className="text-emerald-400 font-mono">{progress}%</span>
            </div>
            <div className="text-xs text-slate-400">
              {progress < 35
                ? 'ছবি যাচাই ও অপ্টিমাইজেশন চলছে...'
                : progress < 85
                ? 'ডাটা সংরক্ষণ ও ক্লাউড সিঙ্ক হচ্ছে...'
                : 'সম্পন্ন হচ্ছে...'}
            </div>
            <div className="w-56 h-2.5 bg-slate-800 rounded-full mx-auto overflow-hidden border border-slate-700/60 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(progress, 5)}%` }}
              />
            </div>
          </div>
        </div>
      ) : value && value.trim() !== '' ? (
        /* Image Attached & Ready */
        <div className="relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/60 p-3 flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800 shadow-inner">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback icon if image link fails to load
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 mb-1">
              <Check className="w-3.5 h-3.5" /> ছবি সফলভাবে সংযুক্ত রয়েছে
            </div>
            <div className="text-xs text-slate-400 truncate max-w-xs font-mono">
              {value.startsWith('data:')
                ? 'অপ্টিমাইজড ইনলাইন ফটো (Optimized Image)'
                : value.substring(0, 50) + '...'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              পরিবর্তন
            </button>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => onChange('')}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition cursor-pointer"
              title="ছবি মুছে ফেলুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload Zone */
        <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-5 bg-slate-900/40 text-center transition">
          <div className="flex flex-col items-center justify-center gap-2 py-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-white">ছবি নির্বাচন করুন বা ড্রপ করুন</div>
            <div className="text-xs text-slate-400">{aspectHint}</div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-lg shadow-emerald-900/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>ফাইল ব্রাউজ করুন</span>
              </button>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>URL যুক্ত করুন</span>
              </button>
            </div>
          </div>

          {showUrlInput && (
            <form onSubmit={handleUrlSubmit} className="mt-3 flex gap-2 max-w-md mx-auto">
              <input
                type="url"
                placeholder="https://example.com/player-photo.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                সেভ
              </button>
            </form>
          )}
        </div>
      )}

      {/* Error Banner with helpful Bengali message and immediate URL fallback */}
      {error && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 mt-2 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setShowUrlInput(true);
            }}
            className="shrink-0 text-emerald-400 underline font-bold hover:text-emerald-300 cursor-pointer text-xs"
          >
            URL দিন
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        disabled={isUploading}
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
