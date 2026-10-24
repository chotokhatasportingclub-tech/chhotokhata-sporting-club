import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'নিশ্চিত করুন',
  cancelLabel = 'বাতিল',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-left">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isDestructive ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>

        <p className="text-slate-300 text-sm mb-6 leading-relaxed">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer shadow-lg ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
