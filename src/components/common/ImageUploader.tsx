import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react';
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
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    onUploadingChange?.(true);
    setProgress(0);

    try {
      const url = await uploadMedia(folder, file, (p) => {
        setProgress(p);
      });
      onChange(url);
      setError(null);
    } catch (err: any) {
      console.warn('Upload error in ImageUploader:', err);
      setError(err?.message || 'আপলোড ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন বা URL যুক্ত করুন।');
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
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</label>}

      {value && value.trim() !== '' ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900/60 p-2 flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800">
            <img src={value} alt="Preview" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mb-1">
              <Check className="w-3.5 h-3.5" /> ছবি সংযুক্ত রয়েছে
            </div>
            <div className="text-xs text-slate-400 truncate max-w-xs">{value.substring(0, 60)}...</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition cursor-pointer"
            >
              পরিবর্তন
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
              title="মুছে ফেলুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-4 bg-slate-900/40 text-center transition">
          {isUploading ? (
            <div className="py-6 space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <div className="text-xs font-medium text-slate-300">আপলোড হচ্ছে... {progress}%</div>
              <div className="w-48 h-2 bg-slate-800 rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col items-center justify-center gap-2 py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-white">ছবি নির্বাচন করুন বা ড্র্যাগ করুন</div>
                <div className="text-xs text-slate-400">{aspectHint}</div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 transition cursor-pointer"
                  >
                    ফাইল ব্রাউজ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <LinkIcon className="w-3.5 h-3.5" /> URL যুক্ত করুন
                  </button>
                </div>
              </div>

              {showUrlInput && (
                <form onSubmit={handleUrlSubmit} className="mt-3 flex gap-2 max-w-md mx-auto">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg cursor-pointer"
                  >
                    সেভ
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 mt-2 flex items-start justify-between gap-2">
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setShowUrlInput(true);
            }}
            className="shrink-0 text-emerald-400 underline font-semibold hover:text-emerald-300 cursor-pointer text-[11px]"
          >
            URL দিন
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
