import React, { useState, useEffect } from 'react';
import {
  Player,
  MatchLineup,
  FormationType,
  LineupSlot,
  Match,
  PlayerPosition,
} from '../../types';
import {
  FORMATION_TEMPLATES,
  generateDefaultLineup,
  saveMatchLineup,
  fetchMatchLineup,
  DEFAULT_PLAYERS,
  DEFAULT_LOGO_SVG,
} from '../../services/db';
import { PlayerKitBadge } from './PlayerKitBadge';
import {
  Shield,
  Trophy,
  Users,
  Search,
  Filter,
  ArrowLeftRight,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Award,
  AlertCircle,
  X,
  ChevronDown,
  Info,
  Calendar,
  MapPin,
  Flame,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface SquadBoardProps {
  match?: Match;
  allMatches?: Match[];
  allPlayers: Player[];
  isEditable?: boolean;
  onSaveSuccess?: (savedLineup: MatchLineup) => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  clubLogo?: string;
  clubNameBn?: string;
  clubNameEn?: string;
}

export const SquadBoard: React.FC<SquadBoardProps> = ({
  match,
  allMatches = [],
  allPlayers,
  isEditable = false,
  onSaveSuccess,
  showToast,
  clubLogo = DEFAULT_LOGO_SVG,
  clubNameBn = 'ছোটখাতা স্পোর্টিং ক্লাব',
  clubNameEn = 'Chhotokhata Sporting Club',
}) => {
  // Use passed match or first available match
  const [selectedMatchId, setSelectedMatchId] = useState<string>(
    match?.id || (allMatches.length > 0 ? allMatches[0].id : 'm-1')
  );

  const activeMatch =
    allMatches.find((m) => m.id === selectedMatchId) ||
    match || {
      id: selectedMatchId,
      homeTeamName: 'Chhotokhata Sporting Club',
      homeTeamLogo: clubLogo,
      awayTeamName: 'Opponent Team',
      awayTeamLogo: clubLogo,
      matchDate: new Date().toISOString().split('T')[0],
      matchTime: '15:30',
      venue: 'ছোটখাতা ফুটবল গ্রাউন্ড',
      tournamentName: 'উত্তরবঙ্গ গোল্ডকাপ ফুটবল ২০২৬',
      matchType: 'Tournament',
      status: 'Upcoming',
    };

  // Lineup state
  const [lineup, setLineup] = useState<MatchLineup>(() =>
    generateDefaultLineup(
      activeMatch.id,
      allPlayers.length > 0 ? allPlayers : DEFAULT_PLAYERS,
      '4-3-3',
      clubNameEn,
      activeMatch.awayTeamName
    )
  );

  const [isLoadingLineup, setIsLoadingLineup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Slot selection for assignment or swapping
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [swapSourceSlotId, setSwapSourceSlotId] = useState<string | null>(null);
  const [showPlayerPickerModal, setShowPlayerPickerModal] = useState(false);

  // Player search and position filter within picker modal
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerPositionFilter, setPickerPositionFilter] = useState<string>('All');

  // Load lineup from Firestore or generate default
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoadingLineup(true);
      try {
        const fetched = await fetchMatchLineup(selectedMatchId);
        if (isMounted) {
          if (fetched && fetched.startingXI && fetched.startingXI.length > 0) {
            // Re-hydrate slot player details from allPlayers to ensure up-to-date data
            const hydratedSlots = fetched.startingXI.map((slot) => {
              if (!slot.playerId) return slot;
              const p = allPlayers.find((pl) => pl.id === slot.playerId);
              if (p) {
                return {
                  ...slot,
                  playerName: p.fullName,
                  nameBn: p.nameBn,
                  jerseyNumber: p.jerseyNumber,
                  photoUrl: p.photoUrl || '',
                  isCaptain: slot.isCaptain || p.isCaptain,
                };
              }
              return slot;
            });
            setLineup({
              ...fetched,
              startingXI: hydratedSlots,
              teamName: clubNameEn,
              opponentName: activeMatch.awayTeamName,
            });
          } else {
            // Fallback to fresh default lineup
            setLineup(
              generateDefaultLineup(
                selectedMatchId,
                allPlayers.length > 0 ? allPlayers : DEFAULT_PLAYERS,
                '4-3-3',
                clubNameEn,
                activeMatch.awayTeamName
              )
            );
          }
        }
      } catch (err) {
        console.warn('Failed to load lineup, using default:', err);
      } finally {
        if (isMounted) setIsLoadingLineup(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [selectedMatchId, allPlayers, clubNameEn, activeMatch.awayTeamName]);

  // Handle changing formation
  const handleFormationChange = (newFormation: FormationType) => {
    const template = FORMATION_TEMPLATES[newFormation];
    if (!template) return;

    // Preserve currently picked starting XI player IDs in order
    const currentStartingPlayerIds = lineup.startingXI
      .map((s) => s.playerId)
      .filter((id): id is string => Boolean(id));

    // Re-assign players to the new formation template slots
    const newStartingXI: LineupSlot[] = template.slots.map((templateSlot, idx) => {
      const assignedPlayerId = currentStartingPlayerIds[idx] || null;
      const playerObj = assignedPlayerId
        ? allPlayers.find((p) => p.id === assignedPlayerId)
        : null;

      return {
        ...templateSlot,
        playerId: assignedPlayerId,
        playerName: playerObj ? playerObj.fullName : undefined,
        nameBn: playerObj ? playerObj.nameBn : undefined,
        jerseyNumber: playerObj ? playerObj.jerseyNumber : undefined,
        photoUrl: playerObj ? playerObj.photoUrl || '' : '',
        isCaptain: playerObj ? playerObj.isCaptain : false,
      };
    });

    // Re-compute substitutes bench (all squad players not in starting XI)
    const usedIds = new Set(newStartingXI.map((s) => s.playerId).filter(Boolean));
    const newSubs = allPlayers.filter((p) => !usedIds.has(p.id)).map((p) => p.id);

    setLineup((prev) => ({
      ...prev,
      formation: newFormation,
      startingXI: newStartingXI,
      substitutes: newSubs,
      updatedAt: new Date().toISOString(),
    }));

    if (showToast) {
      showToast(`ফর্মেশন পরিবর্তন করা হয়েছে: ${template.label}`, 'info');
    }
  };

  // Handle slot click (in edit mode)
  const handleSlotClick = (slotId: string) => {
    if (!isEditable) return;

    // If swap mode was initiated, swap immediately
    if (swapSourceSlotId && swapSourceSlotId !== slotId) {
      swapSlots(swapSourceSlotId, slotId);
      setSwapSourceSlotId(null);
      return;
    }

    setSelectedSlotId(slotId);
    setShowPlayerPickerModal(true);
  };

  // Swap two slots
  const swapSlots = (slotIdA: string, slotIdB: string) => {
    setLineup((prev) => {
      const slotA = prev.startingXI.find((s) => s.slotId === slotIdA);
      const slotB = prev.startingXI.find((s) => s.slotId === slotIdB);

      if (!slotA || !slotB) return prev;

      const newStartingXI = prev.startingXI.map((slot) => {
        if (slot.slotId === slotIdA) {
          return {
            ...slot,
            playerId: slotB.playerId,
            playerName: slotB.playerName,
            nameBn: slotB.nameBn,
            jerseyNumber: slotB.jerseyNumber,
            photoUrl: slotB.photoUrl,
            isCaptain: slotB.isCaptain,
          };
        }
        if (slot.slotId === slotIdB) {
          return {
            ...slot,
            playerId: slotA.playerId,
            playerName: slotA.playerName,
            nameBn: slotA.nameBn,
            jerseyNumber: slotA.jerseyNumber,
            photoUrl: slotA.photoUrl,
            isCaptain: slotA.isCaptain,
          };
        }
        return slot;
      });

      return {
        ...prev,
        startingXI: newStartingXI,
        updatedAt: new Date().toISOString(),
      };
    });

    if (showToast) {
      showToast('পজিশন অদলবদল (Swap) সফল হয়েছে!', 'success');
    }
  };

  // Assign player to selected slot
  const assignPlayerToSlot = (player: Player) => {
    if (!selectedSlotId) return;

    setLineup((prev) => {
      // If this player is already in another slot in startingXI, swap them
      const existingSlot = prev.startingXI.find((s) => s.playerId === player.id);
      const currentSlot = prev.startingXI.find((s) => s.slotId === selectedSlotId);

      let newStartingXI: LineupSlot[];

      if (existingSlot && existingSlot.slotId !== selectedSlotId) {
        // Swap players between existingSlot and currentSlot
        newStartingXI = prev.startingXI.map((s) => {
          if (s.slotId === selectedSlotId) {
            return {
              ...s,
              playerId: player.id,
              playerName: player.fullName,
              nameBn: player.nameBn,
              jerseyNumber: player.jerseyNumber,
              photoUrl: player.photoUrl || '',
              isCaptain: player.isCaptain,
            };
          }
          if (s.slotId === existingSlot.slotId) {
            return {
              ...s,
              playerId: currentSlot?.playerId || null,
              playerName: currentSlot?.playerName,
              nameBn: currentSlot?.nameBn,
              jerseyNumber: currentSlot?.jerseyNumber,
              photoUrl: currentSlot?.photoUrl || '',
              isCaptain: currentSlot?.isCaptain,
            };
          }
          return s;
        });
      } else {
        // Replace current slot
        newStartingXI = prev.startingXI.map((s) => {
          if (s.slotId === selectedSlotId) {
            return {
              ...s,
              playerId: player.id,
              playerName: player.fullName,
              nameBn: player.nameBn,
              jerseyNumber: player.jerseyNumber,
              photoUrl: player.photoUrl || '',
              isCaptain: player.isCaptain,
            };
          }
          return s;
        });
      }

      // Re-calculate bench substitutes
      const usedIds = new Set(newStartingXI.map((s) => s.playerId).filter(Boolean));
      const newSubs = allPlayers.filter((p) => !usedIds.has(p.id)).map((p) => p.id);

      return {
        ...prev,
        startingXI: newStartingXI,
        substitutes: newSubs,
        updatedAt: new Date().toISOString(),
      };
    });

    setShowPlayerPickerModal(false);
    setSelectedSlotId(null);

    if (showToast) {
      showToast(`${player.fullName} (#${player.jerseyNumber}) পজিশনে নিযুক্ত হয়েছেন`, 'success');
    }
  };

  // Toggle captain status for a slot
  const toggleCaptain = (slotId: string) => {
    setLineup((prev) => {
      const newStartingXI = prev.startingXI.map((s) => ({
        ...s,
        isCaptain: s.slotId === slotId ? !s.isCaptain : false,
      }));
      const captain = newStartingXI.find((s) => s.isCaptain);
      return {
        ...prev,
        startingXI: newStartingXI,
        captainId: captain?.playerId || undefined,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  // Save lineup directly to Firestore
  const handleSaveLineup = async () => {
    setIsSaving(true);
    setSaveSuccessMsg(null);
    try {
      const payload: MatchLineup = {
        ...lineup,
        id: selectedMatchId,
        matchId: selectedMatchId,
        matchType: activeMatch.matchType || 'Tournament',
        teamName: clubNameEn,
        opponentName: activeMatch.awayTeamName,
        updatedAt: new Date().toISOString(),
      };

      await saveMatchLineup(payload);

      setSaveSuccessMsg('ম্যাচ লাইনআপ সফলভাবে ক্লাউড ডেটাবেজে সংরক্ষিত হয়েছে!');
      if (showToast) {
        showToast('ম্যাচ লাইনআপ সফলভাবে ক্লাউড ডেটাবেজে সংরক্ষিত হয়েছে!', 'success');
      }
      if (onSaveSuccess) {
        onSaveSuccess(payload);
      }
    } catch (err: any) {
      console.error('Failed to save lineup:', err);
      const errText = err?.message || 'লাইনআপ সংরক্ষণ ব্যর্থ হয়েছে।';
      if (showToast) {
        showToast(`ত্রুটি: ${errText}`, 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Get player object helper
  const getPlayer = (id: string | null | undefined): Player | undefined => {
    if (!id) return undefined;
    return allPlayers.find((p) => p.id === id);
  };

  // Filtered players in the picker modal
  const filteredPickerPlayers = allPlayers.filter((p) => {
    const matchSearch =
      p.fullName.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      (p.nameBn && p.nameBn.includes(pickerSearch)) ||
      p.jerseyNumber.toString().includes(pickerSearch);

    const matchPos =
      pickerPositionFilter === 'All' ||
      p.position === pickerPositionFilter ||
      (pickerPositionFilter === 'Midfielder' && p.position === 'Attacking Midfielder');

    return matchSearch && matchPos;
  });

  // Current slot being edited
  const activeEditingSlot = lineup.startingXI.find((s) => s.slotId === selectedSlotId);

  // Position filter tabs for picker
  const positionFilterTabs: { labelBn: string; labelEn: string; val: string }[] = [
    { labelBn: 'সকল (২০)', labelEn: 'All', val: 'All' },
    { labelBn: 'গোলরক্ষক', labelEn: 'GK', val: 'Goalkeeper' },
    { labelBn: 'ডিফেন্ডার', labelEn: 'DEF', val: 'Defender' },
    { labelBn: 'মিডফিল্ডার', labelEn: 'MID', val: 'Midfielder' },
    { labelBn: 'অ্যাটাকিং মিড', labelEn: 'CAM', val: 'Attacking Midfielder' },
    { labelBn: 'স্ট্রাইকার', labelEn: 'ST', val: 'Striker' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* MATCH & FORMATION CONTROLS BAR (For Admin and Selector) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Match Selector */}
          <div className="w-full lg:w-auto flex-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>ম্যাচ নির্বাচন (Select Match)</span>
            </label>
            {allMatches.length > 0 ? (
              <select
                value={selectedMatchId}
                onChange={(e) => setSelectedMatchId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {allMatches.map((m) => (
                  <option key={m.id} value={m.id}>
                    [{m.matchType || 'Match'}] {m.homeTeamName} vs {m.awayTeamName} ({m.matchDate})
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-xs text-white font-bold bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
                {activeMatch.homeTeamName} vs {activeMatch.awayTeamName}
              </div>
            )}
          </div>

          {/* Formation Picker Tabs */}
          <div className="w-full lg:w-auto">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ট্যাকটিক্যাল ফর্মেশন (Formation)</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {(['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '3-4-3'] as FormationType[]).map((fmt) => {
                const isActive = lineup.formation === fmt;
                return (
                  <button
                    key={fmt}
                    onClick={() => handleFormationChange(fmt)}
                    disabled={!isEditable && false}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950 ring-2 ring-emerald-400/40'
                        : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {fmt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button (Admin Only) */}
          {isEditable && (
            <div className="w-full lg:w-auto flex items-end">
              <button
                onClick={handleSaveLineup}
                disabled={isSaving}
                className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-950 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>লাইনআপ সংরক্ষণ করুন</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Save confirmation banner */}
        {saveSuccessMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button
              onClick={() => setSaveSuccessMsg(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Swap Mode Prompt */}
        {swapSourceSlotId && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              <span>
                স্থানান্তরের জন্য প্রথম প্লেয়ার নির্বাচন করা হয়েছে। এবার মাঠে যার সাথে অদলবদল (Swap)
                করতে চান তার পজিশনে ক্লিক করুন।
              </span>
            </div>
            <button
              onClick={() => setSwapSourceSlotId(null)}
              className="px-2.5 py-1 rounded-lg bg-amber-800/80 hover:bg-amber-700 text-white text-[11px] font-bold"
            >
              বাতিল
            </button>
          </div>
        )}
      </div>

      {/* SQUAD BOARD CONTAINER - REAL SOCIEDAD INSPIRED LUXURY CLUB BOARD */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* PREMIUM TOP HEADER BAR */}
        <div className="relative bg-gradient-to-r from-slate-950 via-[#071426] to-[#0d2a1b] border-b border-emerald-500/30 px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* CSC Crest & Club Branding */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-900/90 border border-emerald-500/40 p-2 shadow-xl flex items-center justify-center shrink-0">
              <img
                src={clubLogo}
                alt="CSC Crest"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                  OFFICIAL STARTING XI
                </span>
                <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider">
                  {lineup.formation}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
                {clubNameBn}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {clubNameEn} • {activeMatch.tournamentName}
              </p>
            </div>
          </div>

          {/* Match & Fixture Context Badge */}
          <div className="text-center md:text-right bg-slate-900/70 border border-slate-800 px-5 py-2.5 rounded-2xl">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-0.5">
              {activeMatch.matchType || 'Tournament'} Match
            </div>
            <div className="text-sm font-black text-white">
              CSC vs {activeMatch.awayTeamName}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-center md:justify-end gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{activeMatch.venue}</span>
            </div>
          </div>
        </div>

        {/* TACTICAL FOOTBALL PITCH SECTION */}
        <div className="p-4 sm:p-8 bg-slate-950 flex flex-col items-center">
          {/* THE PITCH CONTAINER */}
          <div className="relative w-full max-w-4xl aspect-[3/4] sm:aspect-[4/5] md:aspect-[5/6] rounded-3xl overflow-hidden border-4 border-emerald-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] select-none">
            {/* REALISTIC TURF BACKGROUND WITH ALTERNATING GRASS STRIPES */}
            <div
              className="absolute inset-0 z-0 bg-[#165b2d]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    to bottom,
                    rgba(20, 83, 45, 0.95) 0%,
                    rgba(20, 83, 45, 0.95) 10%,
                    rgba(22, 101, 52, 0.95) 10%,
                    rgba(22, 101, 52, 0.95) 20%
                  ),
                  radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)
                `,
              }}
            />

            {/* SUBTLE GRASS WEAVE TEXTURE */}
            <div
              className="absolute inset-0 z-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
              }}
            />

            {/* REGULATION WHITE PITCH MARKINGS */}
            <div className="absolute inset-4 sm:inset-6 z-10 border-2 border-white/70 rounded-xl pointer-events-none">
              {/* Halfway Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/70 -translate-y-1/2" />

              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 w-28 h-28 sm:w-36 sm:h-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70" />

              {/* Center Spot */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />

              {/* TOP GOAL AREA (Attacking End) */}
              {/* 18-Yard Penalty Box */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-24 sm:h-32 border-x-2 border-b-2 border-white/70" />
              {/* 6-Yard Box */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-10 sm:h-14 border-x-2 border-b-2 border-white/70" />
              {/* Penalty Spot */}
              <div className="absolute top-16 sm:top-22 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white" />
              {/* Penalty Arc (D-Box Arc) */}
              <div className="absolute top-24 sm:top-32 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-10 sm:h-12 border-b-2 border-white/70 rounded-b-full" />

              {/* BOTTOM GOAL AREA (Defending End / GK) */}
              {/* 18-Yard Penalty Box */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-24 sm:h-32 border-x-2 border-t-2 border-white/70" />
              {/* 6-Yard Box */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-10 sm:h-14 border-x-2 border-t-2 border-white/70" />
              {/* Penalty Spot */}
              <div className="absolute bottom-16 sm:bottom-22 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white" />
              {/* Penalty Arc */}
              <div className="absolute bottom-24 sm:bottom-32 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-10 sm:h-12 border-t-2 border-white/70 rounded-t-full" />

              {/* Corner Arcs */}
              <div className="absolute top-0 left-0 w-6 h-6 border-r-2 border-b-2 border-white/70 rounded-br-full" />
              <div className="absolute top-0 right-0 w-6 h-6 border-l-2 border-b-2 border-white/70 rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-r-2 border-t-2 border-white/70 rounded-tr-full" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-l-2 border-t-2 border-white/70 rounded-tl-full" />
            </div>

            {/* WATERMARK CSC MONOGRAM ON TURF */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-5 opacity-10 pointer-events-none select-none">
              <span className="text-7xl sm:text-9xl font-black text-white tracking-widest">
                CSC
              </span>
            </div>

            {/* 11 STARTING XI PLAYERS ON PITCH */}
            <div className="absolute inset-0 z-20">
              {lineup.startingXI.map((slot) => {
                const player = getPlayer(slot.playerId);
                const isSelected = selectedSlotId === slot.slotId;
                const isSwapSource = swapSourceSlotId === slot.slotId;

                const displayName =
                  slot.playerName || player?.fullName || slot.slotLabel;
                const displayBn =
                  slot.nameBn || player?.nameBn || '';
                const jerseyNum =
                  slot.jerseyNumber || player?.jerseyNumber || 0;
                const isCaptain =
                  slot.isCaptain || player?.isCaptain || false;
                const photoUrl =
                  slot.photoUrl || player?.photoUrl || '';

                return (
                  <div
                    key={slot.slotId}
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                    }}
                    onClick={() => handleSlotClick(slot.slotId)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform ${
                      isEditable ? 'cursor-pointer hover:scale-110' : ''
                    } ${isSwapSource ? 'scale-115 animate-bounce' : ''}`}
                  >
                    {/* Position Label Tag */}
                    <div className="mb-0.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-emerald-400/30 text-[9px] font-black text-emerald-400 tracking-wider uppercase shadow-md">
                      {slot.slotLabel}
                    </div>

                    {/* Player Badge / Jersey */}
                    <div
                      className={`relative transition-all rounded-full p-1 ${
                        isSelected
                          ? 'ring-4 ring-amber-400 shadow-[0_0_20px_rgba(250,204,21,0.8)]'
                          : isSwapSource
                          ? 'ring-4 ring-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.8)]'
                          : 'group-hover:ring-2 group-hover:ring-white'
                      }`}
                    >
                      <PlayerKitBadge
                        photoUrl={photoUrl}
                        jerseyNumber={jerseyNum}
                        name={displayName}
                        nameBn={displayBn}
                        size="md"
                        isCaptain={isCaptain}
                      />

                      {/* Edit Icon overlay */}
                      {isEditable && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow">
                          <ArrowLeftRight className="w-2.5 h-2.5 text-amber-400" />
                        </div>
                      )}
                    </div>

                    {/* High-Contrast Name Banner Pill (Real Sociedad Style) */}
                    <div className="mt-1 px-2.5 py-0.5 rounded-lg bg-slate-950/90 backdrop-blur-md border border-slate-800 text-center max-w-[100px] sm:max-w-[120px] shadow-lg">
                      <div className="text-[11px] sm:text-xs font-black text-white truncate leading-tight">
                        {displayName}
                      </div>
                      {displayBn && (
                        <div className="text-[9px] text-emerald-400 font-semibold truncate leading-tight">
                          {displayBn}
                        </div>
                      )}
                    </div>

                    {/* Quick Captain Toggle In Edit Mode */}
                    {isEditable && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCaptain(slot.slotId);
                        }}
                        className={`mt-0.5 text-[8px] font-black px-1.5 py-0.2 rounded opacity-0 group-hover:opacity-100 transition ${
                          isCaptain
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-900/90 text-slate-400 hover:text-white'
                        }`}
                        title="Toggle Captain"
                      >
                        {isCaptain ? 'CAPTAIN' : '+ C'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SUBSTITUTES BENCH SECTION (BANQUILLO / ৯ জন রিজার্ভ খেলোয়াড়) */}
        <div className="bg-slate-900/90 border-t border-slate-800 px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                রিজার্ভ বেঞ্চ (Substitutes - {lineup.substitutes.length} Players)
              </h3>
            </div>
            <div className="text-xs text-slate-400">
              {isEditable
                ? 'মাঠের খেলোয়াড়ের সাথে বদল করতে ক্লিক করুন'
                : 'অফিসিয়াল রিজার্ভ ও বিকল্প খেলোয়াড়বৃন্দ'}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {lineup.substitutes.map((subId) => {
              const subPlayer = getPlayer(subId);
              if (!subPlayer) return null;

              return (
                <div
                  key={subId}
                  onClick={() => {
                    if (isEditable) {
                      // Open player assign or direct swap
                      setSelectedSlotId(lineup.startingXI[0].slotId);
                      setShowPlayerPickerModal(true);
                    }
                  }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 transition shadow ${
                    isEditable ? 'hover:border-emerald-500/50 cursor-pointer' : ''
                  }`}
                >
                  <PlayerKitBadge
                    photoUrl={subPlayer.photoUrl}
                    jerseyNumber={subPlayer.jerseyNumber}
                    name={subPlayer.fullName}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-white truncate">
                      {subPlayer.fullName}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold truncate">
                      {subPlayer.nameBn || subPlayer.position}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TACTICAL COACH & MATCH NOTES BAR */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-white font-bold mr-1">টেকনিক্যাল টিম:</span>
              <span>{lineup.coachName || 'ছোটখাতা স্পোর্টিং ক্লাব কোচিং স্টাফ'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 italic truncate max-w-md">
              "{lineup.tacticalNotes || 'হাই-প্রেসিং ও উইং আক্রমণ'}"
            </span>
          </div>
        </div>
      </div>

      {/* PLAYER PICKER & POSITION ASSIGNMENT MODAL (EDIT MODE) */}
      {showPlayerPickerModal && activeEditingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative text-left">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/40">
                    {activeEditingSlot.slotLabel} Slot
                  </span>
                  <h3 className="text-lg font-black text-white">
                    পজিশনে খেলোয়াড় নির্বাচন করুন
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  বর্তমান খেলোয়াড়:{' '}
                  <span className="text-white font-bold">
                    {activeEditingSlot.playerName || 'কেউ নিযুক্ত নেই'}
                  </span>
                </p>
              </div>

              <button
                onClick={() => {
                  setShowPlayerPickerModal(false);
                  setSelectedSlotId(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Swap With Another Pitch Position Option */}
            <div className="mb-4 p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white">মাঠের অন্য খেলোয়াড়ের সাথে অদলবদল?</span>
                <p className="text-[11px] text-slate-500">
                  নিচের বাটনটি চাপুন এবং এরপর মাঠের যেকোনো পজিশনে ক্লিক করুন।
                </p>
              </div>
              <button
                onClick={() => {
                  setSwapSourceSlotId(activeEditingSlot.slotId);
                  setShowPlayerPickerModal(false);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Swap Mode চালু</span>
              </button>
            </div>

            {/* Search & Position Filter Tabs */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="নাম বা জার্সি নম্বর দিয়ে খুঁজুন..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {positionFilterTabs.map((tab) => (
                  <button
                    key={tab.val}
                    onClick={() => setPickerPositionFilter(tab.val)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      pickerPositionFilter === tab.val
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tab.labelBn}
                  </button>
                ))}
              </div>
            </div>

            {/* 20-Player Squad List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredPickerPlayers.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  কোনো খেলোয়াড় পাওয়া যায়নি
                </div>
              ) : (
                filteredPickerPlayers.map((p) => {
                  const isInStartingXI = lineup.startingXI.some((s) => s.playerId === p.id);
                  const isCurrentSlotPlayer = activeEditingSlot.playerId === p.id;

                  return (
                    <div
                      key={p.id}
                      onClick={() => assignPlayerToSlot(p)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer ${
                        isCurrentSlotPlayer
                          ? 'bg-emerald-950/40 border-emerald-500 text-white'
                          : isInStartingXI
                          ? 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 text-slate-200'
                          : 'bg-slate-950 border-slate-800 hover:border-emerald-500/50 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <PlayerKitBadge
                          photoUrl={p.photoUrl}
                          jerseyNumber={p.jerseyNumber}
                          name={p.fullName}
                          size="sm"
                        />
                        <div>
                          <div className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>{p.fullName}</span>
                            {p.nameBn && (
                              <span className="text-[11px] text-emerald-400 font-normal">
                                ({p.nameBn})
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {p.position} • {p.appearances} ম্যাচ • {p.goals} গোল
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCurrentSlotPlayer ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40 flex items-center gap-1">
                            <Check className="w-3 h-3" /> বর্তমান
                          </span>
                        ) : isInStartingXI ? (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-bold">
                            একাদশে আছেন (Swap)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black">
                            নিযুক্ত করুন
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
