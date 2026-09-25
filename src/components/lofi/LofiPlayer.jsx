import React, { useState, useEffect } from 'react';
import { lofiTracks, ambientAudio } from '../../data/lofiTracks';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, ListMusic, Music, 
  ChevronDown, Disc3
} from 'lucide-react';

export default function LofiPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [showTrackList, setShowTrackList] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentTrack = lofiTracks[currentTrackIndex] || lofiTracks[0];

  useEffect(() => {
    ambientAudio.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    // Auto advance when track finishes
    ambientAudio.setTrackEndCallback(() => {
      setCurrentTrackIndex((prev) => {
        const nextIdx = (prev + 1) % lofiTracks.length;
        ambientAudio.playTrack(lofiTracks[nextIdx]);
        return nextIdx;
      });
    });
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      ambientAudio.pause();
      setIsPlaying(false);
    } else {
      ambientAudio.playTrack(currentTrack);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIndex + 1) % lofiTracks.length;
    setCurrentTrackIndex(nextIdx);
    if (isPlaying) {
      ambientAudio.playTrack(lofiTracks[nextIdx]);
    }
  };

  const handlePrev = () => {
    const prevIdx = (currentTrackIndex - 1 + lofiTracks.length) % lofiTracks.length;
    setCurrentTrackIndex(prevIdx);
    if (isPlaying) {
      ambientAudio.playTrack(lofiTracks[prevIdx]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      
      {/* 1. COLLAPSED STATE: FLOATING MUSIC ICON */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[rgb(var(--color-card))]/90 dark:bg-[rgb(var(--color-card))]/90 backdrop-blur-xl border border-[rgb(var(--color-border))] shadow-2xl hover:border-[rgb(var(--color-primary))]/50 hover:shadow-[rgb(var(--color-primary))]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title={isPlaying ? `Playing: ${currentTrack.title}` : "Open Lo-Fi Radio"}
          aria-label="Open Lo-Fi Radio"
        >
          {/* Pulsating ambient aura when playing */}
          {isPlaying && (
            <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[rgb(var(--color-primary))]/30 to-indigo-500/20 blur-sm animate-pulse -z-10" />
          )}

          {/* Equalizer animation when playing, else static Music icon */}
          {isPlaying ? (
            <div className="flex items-end gap-1 h-5">
              <span className="w-1 bg-[rgb(var(--color-primary))] rounded-full animate-bounce [animation-duration:500ms]" style={{ height: '60%' }} />
              <span className="w-1 bg-[rgb(var(--color-primary))] rounded-full animate-bounce [animation-duration:800ms]" style={{ height: '100%' }} />
              <span className="w-1 bg-[rgb(var(--color-primary))] rounded-full animate-bounce [animation-duration:400ms]" style={{ height: '40%' }} />
              <span className="w-1 bg-[rgb(var(--color-primary))] rounded-full animate-bounce [animation-duration:700ms]" style={{ height: '80%' }} />
            </div>
          ) : (
            <Music size={22} className="text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-primary))] transition-colors" />
          )}

          {/* Mini Playing Status Dot */}
          {isPlaying && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[rgb(var(--color-card))]" />
          )}

          {/* Hover Tooltip Pill */}
          <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-lg text-xs font-medium text-[rgb(var(--color-text))] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center gap-2">
            <span className="font-mono text-[11px] text-[rgb(var(--color-primary))] font-bold">LO-FI</span>
            <span>{isPlaying ? currentTrack.title : 'Play Lo-Fi Music'}</span>
          </span>
        </button>
      )}

      {/* 2. EXPANDED STATE: FLOATING LO-FI PLAYER CARD */}
      {isExpanded && (
        <div className="w-[360px] max-w-[calc(100vw-2.5rem)] rounded-3xl bg-[rgb(var(--color-card))]/95 backdrop-blur-2xl border border-[rgb(var(--color-border))] shadow-2xl p-5 space-y-4 animate-fade-in-up text-[rgb(var(--color-text))]">
          
          {/* Header: Title + Minimize button */}
          <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] flex items-center justify-center">
                <Disc3 size={18} className={isPlaying ? 'animate-spin [animation-duration:5s]' : ''} />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[rgb(var(--color-primary))] font-bold leading-tight">
                  RIVISONLY LO-FI RADIO
                </div>
                <div className="text-[11px] text-[rgb(var(--color-muted))] font-mono">
                  Track {currentTrackIndex + 1} of {lofiTracks.length} • Royalty-Free
                </div>
              </div>
            </div>

            {/* Collapse button */}
            <button
              onClick={() => {
                setIsExpanded(false);
                setShowTrackList(false);
              }}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))] transition-colors cursor-pointer"
              title="Minimize Lo-Fi Player"
              aria-label="Minimize"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Current Track Details */}
          <div className="space-y-1">
            <div className="text-sm font-bold truncate text-[rgb(var(--color-text))]">
              {currentTrack.title}
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))]">
              <span>{currentTrack.artist}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-primary))] font-medium">
                {currentTrack.mood}
              </span>
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className="flex items-center justify-center gap-5 pt-1">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
              title="Previous Track"
            >
              <SkipBack size={19} />
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-2xl bg-[rgb(var(--color-primary))] hover:brightness-105 text-white flex items-center justify-center shadow-lg shadow-[rgb(var(--color-primary))]/30 active:scale-95 transition-all cursor-pointer"
              title={isPlaying ? "Pause" : "Play Lo-Fi"}
            >
              {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
              title="Next Track"
            >
              <SkipForward size={19} />
            </button>
          </div>

          {/* Volume and Tracklist Row */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[rgb(var(--color-border))] text-xs">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setVolume(volume > 0 ? 0 : 0.6)}
                className="text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors"
                title={volume === 0 ? "Unmute" : "Mute"}
              >
                {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-[rgb(var(--color-container-high))] rounded-lg appearance-none cursor-pointer accent-[rgb(var(--color-primary))]"
              />
            </div>

            <button
              onClick={() => setShowTrackList(!showTrackList)}
              className="flex items-center gap-1.5 text-xs font-mono text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] px-2.5 py-1 rounded-lg hover:bg-[rgb(var(--color-container-low))] transition-colors cursor-pointer"
              title={`Browse ${lofiTracks.length} Royalty-Free Tracks`}
            >
              <ListMusic size={14} />
              <span>{showTrackList ? `Hide (${lofiTracks.length})` : `${lofiTracks.length} Tracks`}</span>
            </button>
          </div>

          {/* Expandable Tracklist Drawer inside Card */}
          {showTrackList && (
            <div className="max-h-48 overflow-y-auto space-y-1 pt-2 border-t border-[rgb(var(--color-border))] animate-fade-in-up pr-1">
              {lofiTracks.map((track, i) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(i);
                    ambientAudio.playTrack(track);
                    setIsPlaying(true);
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    currentTrackIndex === i
                      ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] font-semibold'
                      : 'hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))]'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="font-mono text-[10px] text-[rgb(var(--color-muted))] mr-1.5">
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    {track.title}
                  </div>
                  <span className="text-[10px] font-mono text-[rgb(var(--color-muted))] shrink-0">{track.duration}</span>
                </button>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
