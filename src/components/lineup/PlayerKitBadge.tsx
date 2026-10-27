import React from 'react';
import { Shield } from 'lucide-react';

interface PlayerKitBadgeProps {
  photoUrl?: string;
  jerseyNumber: number;
  name: string;
  nameBn?: string;
  size?: 'sm' | 'md' | 'lg';
  isCaptain?: boolean;
  className?: string;
}

export const PlayerKitBadge: React.FC<PlayerKitBadgeProps> = ({
  photoUrl,
  jerseyNumber,
  name,
  nameBn,
  size = 'md',
  isCaptain = false,
  className = '',
}) => {
  const [imgError, setImgError] = React.useState(false);
  const hasAuthenticPhoto = Boolean(!imgError && photoUrl && photoUrl.trim() !== '');

  // Dimensions based on size
  const sizeClasses = {
    sm: 'w-11 h-11',
    md: 'w-14 h-14 md:w-16 md:h-16',
    lg: 'w-20 h-20 md:w-24 md:h-24',
  }[size];

  const numberSizeClasses = {
    sm: 'text-[11px] font-black',
    md: 'text-sm md:text-base font-black',
    lg: 'text-xl font-black',
  }[size];

  const captainTagClasses = {
    sm: 'text-[9px] -top-1 -right-1 px-1 py-0.2',
    md: 'text-[10px] -top-1 -right-1.5 px-1.5 py-0.5',
    lg: 'text-xs -top-1.5 -right-2 px-2 py-0.5',
  }[size];

  return (
    <div className={`relative inline-block select-none ${className}`}>
      {hasAuthenticPhoto ? (
        <div
          className={`${sizeClasses} rounded-full overflow-hidden border-2 border-emerald-400/90 shadow-xl bg-slate-900 ring-2 ring-emerald-500/20`}
        >
          <img
            src={photoUrl}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ) : (
        /* CSC Authentic Kit Vector / Badge */
        <div
          className={`${sizeClasses} rounded-full flex flex-col items-center justify-center relative overflow-hidden border-2 border-amber-400/90 shadow-2xl bg-gradient-to-br from-emerald-800 via-emerald-950 to-slate-950 ring-2 ring-emerald-500/40`}
          title={`${name} (#${jerseyNumber})`}
        >
          {/* Subtle jersey stripe texture */}
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.15)_4px,rgba(255,255,255,0.15)_8px)]" />

          {/* Golden jersey V-neck collar detail */}
          <div className="absolute top-0 w-6 h-2 border-b border-amber-400 rounded-b-full bg-emerald-900/50" />

          {/* Jersey Number */}
          <span
            className={`relative z-10 font-mono tracking-tight text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${numberSizeClasses}`}
          >
            {jerseyNumber}
          </span>

          {/* CSC Crest / Est micro badge */}
          <span className="relative z-10 text-[8px] tracking-widest font-extrabold text-emerald-300/80 uppercase">
            CSC
          </span>
        </div>
      )}

      {/* Captaincy Armband Tag */}
      {isCaptain && (
        <span
          className={`absolute z-20 rounded-md bg-amber-500 text-slate-950 font-black tracking-widest uppercase shadow-lg border border-amber-300 ${captainTagClasses}`}
          title="Team Captain"
        >
          C
        </span>
      )}
    </div>
  );
};
