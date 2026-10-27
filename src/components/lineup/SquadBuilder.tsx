import React, { useState, useEffect, useMemo } from 'react';
import {
  Player,
  CustomSquad,
  FormationType,
  LineupSlot,
  PlayerPosition,
} from '../../types';
import {
  FORMATION_TEMPLATES,
  fetchCustomSquads,
  saveCustomSquad,
  deleteCustomSquad,
  DEFAULT_LOGO_SVG,
  DEFAULT_PLAYERS,
} from '../../services/db';
import { PlayerKitBadge } from './PlayerKitBadge';
import {
  Users,
  Shield,
  Trophy,
  Search,
  Filter,
  Check,
  Plus,
  Save,
  RotateCcw,
  Sparkles,
  Share2,
  Trash2,
  Edit3,
  Calendar,
  Layers,
  Award,
  CheckCircle2,
  X,
  ChevronRight,
  Loader2,
  FolderOpen,
  ArrowRight,
  Info,
  Clock,
  Printer,
} from 'lucide-react';

interface SquadBuilderProps {
  allPlayers: Player[];
  clubLogo?: string;
  clubNameBn?: string;
  clubNameEn?: string;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onSquadSaved?: (squad: CustomSquad) => void;
}

const POSITION_ORDER: Partial<Record<PlayerPosition, number>> = {
  Goalkeeper: 1,
  Defender: 2,
  Midfielder: 3,
  'Attacking Midfielder': 4,
  Striker: 5,
  Forward: 5,
};

const POSITION_LABELS_BN: Record<string, string> = {
  All: 'সকল পজিশন',
  Goalkeeper: 'গোলরক্ষক (GK)',
  Defender: 'ডিফেন্ডার (DF)',
  Midfielder: 'মিডফিল্ডার (MF)',
  'Attacking Midfielder': 'অ্যাটাকিং মিডফিল্ডার (AM)',
  Striker: 'স্ট্রাইকার (ST)',
};

export const SquadBuilder: React.FC<SquadBuilderProps> = ({
  allPlayers = [],
  clubLogo = DEFAULT_LOGO_SVG,
  clubNameBn = 'ছোটখাতা স্পোর্টিং ক্লাব',
  clubNameEn = 'Chhotokhata Sporting Club',
  showToast,
  onSquadSaved,
}) => {
  // Available pool of 20 players sorted by jersey number
  const playerPool = useMemo(() => {
    const list = allPlayers.length > 0 ? allPlayers : DEFAULT_PLAYERS;
    return [...list].sort((a, b) => a.jerseyNumber - b.jerseyNumber);
  }, [allPlayers]);

  // Squad State
  const [squadId, setSquadId] = useState<string>(() => `squad_${Date.now()}`);
  const [squadName, setSquadName] = useState<string>('ছোটখাতা ফ্রেন্ডস একাদশ');
  const [matchType, setMatchType] = useState<'Friendly' | 'Custom' | 'League' | 'Tournament'>('Friendly');
  const [formation, setFormation] = useState<FormationType>('4-3-3');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [startingXI, setStartingXI] = useState<LineupSlot[]>([]);
  const [substitutes, setSubstitutes] = useState<string[]>([]);
  const [captainId, setCaptainId] = useState<string | undefined>(undefined);
  const [tacticalNotes, setTacticalNotes] = useState<string>('বন্ধুত্বপূর্ণ ও প্রতিযোগিতামূলক ম্যাচের জন্য প্রস্তুতকৃত বিশেষ স্কোয়াড।');

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('All');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSquads, setSavedSquads] = useState<CustomSquad[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [showSavedListModal, setShowSavedListModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'builder' | 'pitch' | 'saved'>('builder');
  const [selectedSlotForSwap, setSelectedSlotForSwap] = useState<string | null>(null);

  // Auto-generate starting XI layout based on chosen formation and selected players
  const rebuildStartingXI = (
    currentFormation: FormationType,
    playerIds: string[],
    currentCaptain?: string
  ) => {
    const template = FORMATION_TEMPLATES[currentFormation] || FORMATION_TEMPLATES['4-3-3'];
    const chosenPlayers = playerPool.filter((p) => playerIds.includes(p.id));

    const usedIds = new Set<string>();
    const slots: LineupSlot[] = template.slots.map((slot) => {
      // Find candidate matching slot position
      const candidate =
        chosenPlayers.find(
          (p) =>
            !usedIds.has(p.id) &&
            (p.position === slot.positionCategory ||
              (slot.positionCategory === 'Attacking Midfielder' && p.position === 'Midfielder'))
        ) || chosenPlayers.find((p) => !usedIds.has(p.id));

      if (candidate) {
        usedIds.add(candidate.id);
        const isCap = currentCaptain ? candidate.id === currentCaptain : candidate.isCaptain;
        return {
          ...slot,
          playerId: candidate.id,
          playerName: candidate.fullName,
          nameBn: candidate.nameBn,
          jerseyNumber: candidate.jerseyNumber,
          photoUrl: candidate.photoUrl || '',
          isCaptain: Boolean(isCap),
        };
      }
      return {
        ...slot,
        playerId: null,
      };
    });

    const bench = playerIds.filter((id) => !usedIds.has(id));
    setStartingXI(slots);
    setSubstitutes(bench);
  };

  // Initialize with first 11 players on first load
  useEffect(() => {
    if (selectedPlayerIds.length === 0 && playerPool.length >= 11) {
      const initial11 = playerPool.slice(0, 11).map((p) => p.id);
      setSelectedPlayerIds(initial11);
      const cap = playerPool.find((p) => p.isCaptain)?.id || initial11[0];
      setCaptainId(cap);
      rebuildStartingXI('4-3-3', initial11, cap);
    }
  }, [playerPool]);

  // Load saved squads from Firestore
  const loadSavedSquads = async () => {
    setIsLoadingSaved(true);
    try {
      const list = await fetchCustomSquads();
      setSavedSquads(list);
    } catch (err) {
      console.warn('Could not load custom squads:', err);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  useEffect(() => {
    loadSavedSquads();
  }, []);

  // Toggle player selection
  const handleTogglePlayer = (player: Player) => {
    const isSelected = selectedPlayerIds.includes(player.id);
    let newSelected: string[];

    if (isSelected) {
      // Deselect player
      newSelected = selectedPlayerIds.filter((id) => id !== player.id);
      if (captainId === player.id) {
        setCaptainId(newSelected[0] || undefined);
      }
    } else {
      // Select player
      newSelected = [...selectedPlayerIds, player.id];
      if (!captainId && player.isCaptain) {
        setCaptainId(player.id);
      }
    }

    setSelectedPlayerIds(newSelected);
    rebuildStartingXI(formation, newSelected, captainId);
  };

  // Select all 20 players
  const handleSelectAll = () => {
    const allIds = playerPool.map((p) => p.id);
    setSelectedPlayerIds(allIds);
    rebuildStartingXI(formation, allIds, captainId);
    if (showToast) showToast('সকল ২০ জন খেলোয়াড় স্কোয়াডে নির্বাচন করা হয়েছে', 'info');
  };

  // Clear all selections
  const handleClearAll = () => {
    setSelectedPlayerIds([]);
    setStartingXI([]);
    setSubstitutes([]);
    setCaptainId(undefined);
    if (showToast) showToast('খেলোয়াড় নির্বাচন মুছে ফেলা হয়েছে', 'info');
  };

  // Auto-fill balanced Starting XI (1 GK, 4 DEF, 3 MID/AM, 3 STR/FW)
  const handleAutoBalancedXI = () => {
    const gks = playerPool.filter((p) => p.position === 'Goalkeeper').slice(0, 1);
    const defs = playerPool.filter((p) => p.position === 'Defender').slice(0, 4);
    const mids = playerPool
      .filter((p) => p.position === 'Midfielder' || p.position === 'Attacking Midfielder')
      .slice(0, 3);
    const strs = playerPool
      .filter((p) => p.position === 'Striker' || p.position === 'Forward')
      .slice(0, 3);

    const balancedXI = [...gks, ...defs, ...mids, ...strs];
    // If not enough by category, pad with others
    const balancedIds = balancedXI.map((p) => p.id);
    const remaining = playerPool.filter((p) => !balancedIds.includes(p.id));
    while (balancedIds.length < 11 && remaining.length > 0) {
      balancedIds.push(remaining.shift()!.id);
    }

    setSelectedPlayerIds(balancedIds);
    const cap = balancedXI.find((p) => p.isCaptain)?.id || balancedIds[0];
    setCaptainId(cap);
    rebuildStartingXI(formation, balancedIds, cap);
    if (showToast) showToast('ব্যালান্সড একাদশ প্রস্তুত করা হয়েছে!', 'success');
  };

  // Formation change
  const handleFormationChange = (newFormation: FormationType) => {
    setFormation(newFormation);
    rebuildStartingXI(newFormation, selectedPlayerIds, captainId);
  };

  // Captain selection
  const handleSetCaptain = (id: string) => {
    setCaptainId(id);
    setStartingXI((prev) =>
      prev.map((s) => ({
        ...s,
        isCaptain: s.playerId === id,
      }))
    );
    const capName = playerPool.find((p) => p.id === id)?.fullName;
    if (showToast) showToast(`${capName} কে অধিনায়ক (Captain) নির্বাচন করা হয়েছে`, 'info');
  };

  // Swap slots in starting XI
  const handleSlotClick = (slotId: string) => {
    if (!selectedSlotForSwap) {
      setSelectedSlotForSwap(slotId);
      return;
    }

    if (selectedSlotForSwap === slotId) {
      setSelectedSlotForSwap(null);
      return;
    }

    // Swap players between slots
    setStartingXI((prev) => {
      const slotA = prev.find((s) => s.slotId === selectedSlotForSwap);
      const slotB = prev.find((s) => s.slotId === slotId);
      if (!slotA || !slotB) return prev;

      return prev.map((s) => {
        if (s.slotId === selectedSlotForSwap) {
          return {
            ...s,
            playerId: slotB.playerId,
            playerName: slotB.playerName,
            nameBn: slotB.nameBn,
            jerseyNumber: slotB.jerseyNumber,
            photoUrl: slotB.photoUrl,
            isCaptain: slotB.isCaptain,
          };
        }
        if (s.slotId === slotId) {
          return {
            ...s,
            playerId: slotA.playerId,
            playerName: slotA.playerName,
            nameBn: slotA.nameBn,
            jerseyNumber: slotA.jerseyNumber,
            photoUrl: slotA.photoUrl,
            isCaptain: slotA.isCaptain,
          };
        }
        return s;
      });
    });

    setSelectedSlotForSwap(null);
    if (showToast) showToast('পজিশন অদলবদল সফল হয়েছে!', 'success');
  };

  // Save Squad genuinely into Firestore
  const handleSaveSquad = async () => {
    if (!squadName.trim()) {
      if (showToast) showToast('দলের একটি নাম প্রদান করুন (যেমন: ছোটখাতা ফ্রেন্ডস ইলেভেন)', 'error');
      return;
    }

    if (selectedPlayerIds.length === 0) {
      if (showToast) showToast('কমপক্ষে ১ জন খেলোয়াড় স্কোয়াডে নির্বাচন করুন', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const squadPayload: CustomSquad = {
        id: squadId,
        squadName: squadName.trim(),
        formation,
        matchType,
        selectedPlayerIds,
        startingXI,
        substitutes,
        captainId,
        notes: tacticalNotes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveCustomSquad(squadPayload);
      await loadSavedSquads();

      if (showToast) {
        showToast(`"${squadName}" স্কোয়াড সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে!`, 'success');
      }
      if (onSquadSaved) {
        onSquadSaved(squadPayload);
      }
    } catch (err: any) {
      console.error('Failed to save squad:', err);
      if (showToast) {
        showToast(`স্কোয়াড সংরক্ষণে ত্রুটি: ${err.message || 'ডাটাবেজ সমস্যা'}`, 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Reopen and edit a saved squad
  const handleLoadSavedSquad = (s: CustomSquad) => {
    setSquadId(s.id);
    setSquadName(s.squadName);
    setMatchType(s.matchType || 'Friendly');
    setFormation(s.formation || '4-3-3');
    setSelectedPlayerIds(s.selectedPlayerIds || []);
    setCaptainId(s.captainId);
    setTacticalNotes(s.notes || '');

    if (s.startingXI && s.startingXI.length > 0) {
      setStartingXI(s.startingXI);
      setSubstitutes(s.substitutes || []);
    } else {
      rebuildStartingXI(s.formation || '4-3-3', s.selectedPlayerIds || [], s.captainId);
    }

    setShowSavedListModal(false);
    setActiveTab('pitch');
    if (showToast) {
      showToast(`"${s.squadName}" স্কোয়াড সফলভাবে লোড করা হয়েছে!`, 'success');
    }
  };

  // Delete saved squad from Firestore (Never deletes registered players!)
  const handleDeleteSavedSquad = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteCustomSquad(id);
      await loadSavedSquads();
      if (showToast) {
        showToast(`"${name}" স্কোয়াড সফলভাবে মুছে ফেলা হয়েছে`, 'success');
      }
      if (squadId === id) {
        // Reset to new ID
        setSquadId(`squad_${Date.now()}`);
      }
    } catch (err: any) {
      if (showToast) {
        showToast(`স্কোয়াড মুছতে ব্যর্থ হয়েছে: ${err.message || 'ত্রুটি'}`, 'error');
      }
    }
  };

  // Share squad summary
  const handleShareSquad = () => {
    const startingNames = startingXI
      .filter((s) => s.playerName)
      .map((s) => `#${s.jerseyNumber} ${s.playerName} (${s.slotLabel}${s.isCaptain ? ' - C' : ''})`)
      .join('\n');

    const benchNames = substitutes
      .map((id) => {
        const p = playerPool.find((pl) => pl.id === id);
        return p ? `#${p.jerseyNumber} ${p.fullName} (${p.position})` : '';
      })
      .filter(Boolean)
      .join(', ');

    const shareText = `⚽ ${squadName} - স্কোয়াড লাইনআপ\nদল: ${clubNameBn}\nম্যাচ ধরন: ${matchType}\nফরমেশন: ${formation}\n\n🌟 মূল একাদশ (Starting XI):\n${startingNames}\n\n🪑 বিকল্প (Substitutes):\n${benchNames || 'নেই'}\n\nছোটখাতা স্পোর্টিং ক্লাব অফিসিয়াল প্ল্যাটফর্ম।`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      if (showToast) showToast('স্কোয়াড বিবরণী ক্লিপবোর্ডে কপি করা হয়েছে!', 'success');
    }
  };

  // Filtered player list based on search and position
  const filteredPlayers = useMemo(() => {
    return playerPool.filter((p) => {
      const matchesSearch =
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.nameBn && p.nameBn.includes(searchQuery)) ||
        p.jerseyNumber.toString().includes(searchQuery);

      const matchesPos = positionFilter === 'All' || p.position === positionFilter;

      return matchesSearch && matchesPos;
    });
  }, [playerPool, searchQuery, positionFilter]);

  const startingCount = startingXI.filter((s) => s.playerId).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/70 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>দল তৈরি করুন • Squad Builder</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                {clubNameBn} অফিসিয়াল স্কোয়াড
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="text"
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                placeholder="দলের নাম লিখুন (যেমন: ছোটখাতা ফ্রেন্ডস ইলেভেন)..."
                className="text-xl sm:text-2xl font-black text-white bg-slate-950/80 border border-slate-700 focus:border-emerald-500 rounded-2xl px-4 py-2 w-full sm:w-80 md:w-96 focus:outline-none transition"
              />
              <select
                value={matchType}
                onChange={(e) => setMatchType(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 text-emerald-400 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="Friendly">বন্ধুত্বপূর্ণ ম্যাচ (Friendly Match)</option>
                <option value="Custom">কাস্টম ম্যাচ (Custom Match)</option>
                <option value="League">ক্লাব লিগ ম্যাচ (League Match)</option>
                <option value="Tournament">টুর্নামেন্ট ম্যাচ (Tournament)</option>
              </select>
            </div>

            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              নিবন্ধিত ২০ জন খেলোয়াড় ডাটাবেজ থেকে পছন্দের খেলোয়াড় বাছাই করে নিজস্ব দল সাজান। 
              বন্ধু-বান্ধবের সাথে বন্ধুত্বপূর্ণ ম্যাচ কিংবা টুর্নামেন্টের জন্য যে কোনো ম্যাচ ফরমেশন (4-3-3, 4-4-2, 3-5-2) নির্ধারণ করে সংরক্ষণ করুন।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowSavedListModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition shadow cursor-pointer border border-slate-700"
            >
              <FolderOpen className="w-4 h-4 text-amber-400" />
              <span>সংরক্ষিত দল সমূহ ({savedSquads.length})</span>
            </button>

            <button
              onClick={handleShareSquad}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
              title="স্কোয়াড কপি বা শেয়ার করুন"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">শেয়ার</span>
            </button>

            <button
              onClick={handleSaveSquad}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs shadow-lg transition flex items-center gap-2 cursor-pointer ring-2 ring-emerald-400/30"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>দল সংরক্ষণ করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>খেলোয়াড় নির্বাচন ({selectedPlayerIds.length}/২০)</span>
          </button>

          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'pitch'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>ট্যাকটিক্যাল পিচ বোর্ড ({formation})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: PLAYER SELECTION PANEL */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Player Selection Grid */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="খেলোয়াড়ের নাম বা জার্সি নম্বর দিয়ে খুঁজুন..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAutoBalancedXI}
                    className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                    title="স্বয়ংক্রিয় সুষম ১১ জন বাছাই করুন"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>ব্যালান্সড একাদশ</span>
                  </button>
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                  >
                    সবাইকে নির্বাচন
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition cursor-pointer"
                  >
                    রিসেট
                  </button>
                </div>
              </div>

              {/* Position Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
                {['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Attacking Midfielder', 'Striker'].map((pos) => {
                  const isCur = positionFilter === pos;
                  const label = POSITION_LABELS_BN[pos] || pos;
                  return (
                    <button
                      key={pos}
                      onClick={() => setPositionFilter(pos)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        isCur
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Players Grid (20 players max pool) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {filteredPlayers.map((player) => {
                const isSelected = selectedPlayerIds.includes(player.id);
                const isCap = captainId === player.id;
                const isInStartingXI = startingXI.some((s) => s.playerId === player.id);

                return (
                  <div
                    key={player.id}
                    onClick={() => handleTogglePlayer(player)}
                    className={`relative rounded-2xl p-3 border transition cursor-pointer select-none flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-emerald-950/80 to-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/40'
                        : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* Top Row: Jersey and Selection Checkbox */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-md bg-slate-950 border border-slate-800 text-white text-[11px] font-mono font-black flex items-center justify-center">
                        #{player.jerseyNumber}
                      </span>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-700 bg-slate-950'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Player Badge / Portrait */}
                    <div className="flex flex-col items-center py-1">
                      <PlayerKitBadge
                        photoUrl={player.photoUrl}
                        jerseyNumber={player.jerseyNumber}
                        name={player.fullName}
                        nameBn={player.nameBn}
                        size="md"
                        isCaptain={isCap}
                      />

                      <div className="text-center mt-2 w-full">
                        <h4 className="text-xs font-bold text-white truncate">{player.fullName}</h4>
                        {player.nameBn && (
                          <div className="text-[10px] text-slate-400 truncate">{player.nameBn}</div>
                        )}
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-950/90 text-emerald-400 border border-slate-800">
                          {player.position}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Status Tags */}
                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                      {isSelected ? (
                        isInStartingXI ? (
                          <span className="text-emerald-400 font-bold">শুরুর একাদশ</span>
                        ) : (
                          <span className="text-amber-400 font-semibold">রিজার্ভ বেঞ্চ</span>
                        )
                      ) : (
                        <span className="text-slate-500">অনির্বাচিত</span>
                      )}

                      {isSelected && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetCaptain(player.id);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase transition ${
                            isCap
                              ? 'bg-amber-400 text-slate-950 shadow'
                              : 'text-slate-400 hover:text-amber-300'
                          }`}
                          title="অধিনায়ক করুন"
                        >
                          {isCap ? 'C (Captain)' : 'Make C'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Squad Summary & Quick Tactics */}
          <div className="space-y-4">
            {/* Squad Checklist & Formation Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>স্কোয়াড কনফিগারেশন</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {selectedPlayerIds.length}/২০ জন নির্বাচিত
                </span>
              </h3>

              {/* Formation Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  ম্যাচ ফরমেশন নির্বাচন (Formation)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '3-4-3'] as FormationType[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => handleFormationChange(f)}
                      className={`py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                        formation === f
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Meter */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">শুরুর একাদশ পূর্ণতা:</span>
                  <span
                    className={
                      startingCount >= 11
                        ? 'text-emerald-400 font-bold'
                        : 'text-amber-400 font-bold'
                    }
                  >
                    {startingCount}/১১ জন
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      startingCount >= 11 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (startingCount / 11) * 100)}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  {selectedPlayerIds.length < 11
                    ? `আরও ${11 - selectedPlayerIds.length} জন খেলোয়াড় নির্বাচন করলে পূর্ণাঙ্গ একাদশ তৈরি হবে।`
                    : `১১ জন শুরুর একাদশে এবং ${selectedPlayerIds.length - 11} জন রিজার্ভ বেঞ্চে থাকবেন।`}
                </div>
              </div>

              {/* Tactical Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  ম্যাচ কৌশল ও নোট (Tactical Notes)
                </label>
                <textarea
                  rows={3}
                  value={tacticalNotes}
                  onChange={(e) => setTacticalNotes(e.target.value)}
                  placeholder="ম্যাচ স্ট্র্যাটেজি বা নির্দেশিকা..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Switch to Pitch View CTA */}
              <button
                onClick={() => setActiveTab('pitch')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
              >
                <span>পিচে একাদশ সাজান (Pitch Board)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: REAL SOCIEDAD STYLE TACTICAL PITCH BOARD */}
      {activeTab === 'pitch' && (
        <div className="space-y-6 animate-fade-in">
          {/* Pitch Board Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6">
            {/* Top Team Display */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={clubLogo}
                  alt=""
                  className="w-12 h-12 object-contain filter drop-shadow"
                />
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{squadName}</h3>
                  <div className="text-xs text-emerald-400 font-semibold flex items-center gap-2">
                    <span>{clubNameBn}</span>
                    <span>•</span>
                    <span className="text-amber-400">{matchType}</span>
                    <span>•</span>
                    <span className="font-mono">{formation}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 mr-1">ফরমেশন:</span>
                {(['4-3-3', '4-4-2', '3-5-2'] as FormationType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFormationChange(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                      formation === f
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Instruction Banner */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  পজিশন অদলবদল (Swap) করতে যেকোনো খেলোয়াড় কার্ডে ক্লিক করে দ্বিতীয়টিতে ক্লিক করুন।
                </span>
              </div>
              {selectedSlotForSwap && (
                <button
                  onClick={() => setSelectedSlotForSwap(null)}
                  className="text-amber-400 hover:text-white text-xs font-bold"
                >
                  বাতিল করুন
                </button>
              )}
            </div>

            {/* TURF PITCH (REAL SOCIEDAD AESTHETIC) */}
            <div
              className="relative w-full max-w-4xl mx-auto aspect-3/4 sm:aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800/90 select-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, #0d4422 0%, #092c16 65%, #05190d 100%)',
              }}
            >
              {/* Grass Pattern Striping */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0, 0, 0, 0.4) 40px, rgba(0, 0, 0, 0.4) 80px)',
                }}
              />

              {/* Pitch Markings (White Lines) */}
              <div className="absolute inset-4 sm:inset-6 border-2 border-white/40 pointer-events-none rounded-xl" />
              {/* Half-way Line */}
              <div className="absolute left-4 right-4 sm:left-6 sm:right-6 top-1/2 -translate-y-1/2 border-t-2 border-white/40 pointer-events-none" />
              {/* Center Circle */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-white/40 pointer-events-none" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white/50 pointer-events-none" />
              {/* Penalty Boxes */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 w-56 sm:w-72 h-24 sm:h-32 border-t-2 border-x-2 border-white/40 pointer-events-none" />
              <div className="absolute left-1/2 -translate-x-1/2 top-4 sm:top-6 w-56 sm:w-72 h-24 sm:h-32 border-b-2 border-x-2 border-white/40 pointer-events-none" />

              {/* CSC Club Watermark on Pitch */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <img src={clubLogo} alt="" className="w-64 h-64 object-contain filter grayscale" />
              </div>

              {/* Starting XI Player Slots */}
              {startingXI.map((slot) => {
                const isSelectedForSwap = selectedSlotForSwap === slot.slotId;
                const isAssigned = Boolean(slot.playerId);

                return (
                  <div
                    key={slot.slotId}
                    onClick={() => handleSlotClick(slot.slotId)}
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute flex flex-col items-center cursor-pointer transition-all duration-200 z-10 ${
                      isSelectedForSwap ? 'scale-115 animate-bounce ring-4 ring-amber-400 rounded-full' : 'hover:scale-110'
                    }`}
                  >
                    {isAssigned ? (
                      <div className="flex flex-col items-center">
                        <PlayerKitBadge
                          photoUrl={slot.photoUrl}
                          jerseyNumber={slot.jerseyNumber || 1}
                          name={slot.playerName || ''}
                          nameBn={slot.nameBn}
                          size="md"
                          isCaptain={slot.isCaptain}
                        />

                        {/* Name and Position Pill */}
                        <div className="mt-1 flex flex-col items-center">
                          <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-white font-bold text-[10px] sm:text-xs shadow border border-slate-700/80 max-w-[85px] sm:max-w-[110px] truncate text-center backdrop-blur-sm">
                            {slot.playerName}
                          </span>
                          <span className="text-[9px] font-black uppercase text-amber-300 drop-shadow">
                            {slot.slotLabel}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Empty Slot */
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/40 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center text-white/60 hover:border-emerald-400 hover:text-emerald-400 transition">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-white/60 mt-1 uppercase">
                          {slot.slotLabel}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Substitutes Bench */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>রিজার্ভ একাদশ ও বদলি খেলোয়াড় (Substitutes - {substitutes.length} জন)</span>
              </h4>

              {substitutes.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  কোনো রিজার্ভ খেলোয়াড় নির্বাচিত নেই। মূল প্যানেলে আরও খেলোয়াড় যুক্ত করলে এখানে প্রদর্শিত হবে।
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {substitutes.map((id) => {
                    const p = playerPool.find((pl) => pl.id === id);
                    if (!p) return null;
                    return (
                      <div
                        key={p.id}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5"
                      >
                        <PlayerKitBadge
                          photoUrl={p.photoUrl}
                          jerseyNumber={p.jerseyNumber}
                          name={p.fullName}
                          size="sm"
                          isCaptain={captainId === p.id}
                        />
                        <div className="truncate">
                          <h5 className="text-xs font-bold text-white truncate">{p.fullName}</h5>
                          <div className="text-[10px] text-emerald-400">{p.position}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveTab('builder')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <span>খেলোয়াড় পরিবর্তন করুন</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleShareSquad}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>কপি / শেয়ার</span>
                </button>

                <button
                  onClick={handleSaveSquad}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>স্কোয়াড সংরক্ষণ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SAVED SQUADS LIST (REOPEN & EDIT) */}
      {showSavedListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-amber-400" />
                  <span>সংরক্ষিত স্কোয়াড সমূহ (Saved Squads)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  পূর্বে সংরক্ষিত যে কোনো কাস্টম স্কোয়াড পুনরায় খুলুন বা সম্পাদনা করুন।
                </p>
              </div>
              <button
                onClick={() => setShowSavedListModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingSaved ? (
              <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                <span>স্কোয়াড তালিকা লোড হচ্ছে...</span>
              </div>
            ) : savedSquads.length === 0 ? (
              <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-2">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">কোনো সংরক্ষিত স্কোয়াড নেই</h4>
                <p className="text-xs text-slate-400">
                  উপরে আপনার দলের নাম লিখে "দল সংরক্ষণ করুন" বাটনে ক্লিক করলে তা এখানে পাওয়া যাবে।
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedSquads.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleLoadSavedSquad(s)}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                          {s.squadName}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300">
                          {s.formation}
                        </span>
                        {s.matchType && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                            {s.matchType}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        খেলোয়াড়: {s.selectedPlayerIds?.length || 0} জন • আপডেট:{' '}
                        {new Date(s.updatedAt || s.createdAt).toLocaleDateString('bn-BD')}
                      </div>
                      {s.notes && (
                        <div className="text-[11px] text-slate-500 line-clamp-1 italic">{s.notes}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline text-xs font-bold text-emerald-400 group-hover:underline">
                        লোড করুন
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSavedSquad(s.id, s.squadName, e)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                        title="স্কোয়াড মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
