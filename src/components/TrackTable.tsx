import { useState } from 'react';
import { Play, Pause, Clock, MoreHorizontal } from 'lucide-react';
import type { Track } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { LikeButton } from './LikeButton';
import { EqualizerBars } from './EqualizerBars';
import { formatTime, formatAddedDate } from '../lib/utils';

interface TrackTableProps {
  tracks: Track[];
  onToggleLike: (trackId: string) => void;
  showAddedAt?: boolean;
  showAlbum?: boolean;
}

export function TrackTable({ tracks, onToggleLike, showAddedAt = true, showAlbum = true }: TrackTableProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const handleRowClick = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, tracks);
    }
  };

  if (tracks.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-500">
        <Clock size={48} className="mx-auto mb-3 opacity-40" />
        <p className="text-lg font-medium">No tracks in this playlist yet</p>
        <p className="text-sm mt-1">Add some tracks to get started</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Table header */}
      <div className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_3fr_2fr_56px] gap-4 px-4 py-2 text-xs text-neutral-400 uppercase tracking-wider border-b border-white/10 mb-2 sticky top-0 bg-gradient-to-b from-black/80 to-spotify-base/80 backdrop-blur-sm z-10">
        <div className="text-center">#</div>
        <div>Title</div>
        {showAlbum && <div className="hidden md:block">Album</div>}
        {showAddedAt && <div className="hidden md:block">Date Added</div>}
        <div className="flex justify-end">
          <Clock size={14} />
        </div>
      </div>

      {/* Track rows */}
      {tracks.map((track, index) => {
        const isCurrent = currentTrack?.id === track.id;
        const isCurrentPlaying = isCurrent && isPlaying;
        const isHovered = hoveredRow === track.id;

        return (
          <div
            key={track.id}
            onMouseEnter={() => setHoveredRow(track.id)}
            onMouseLeave={() => setHoveredRow(null)}
            onDoubleClick={() => handleRowClick(track)}
            onClick={() => handleRowClick(track)}
            className={`grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_3fr_2fr_56px] gap-4 px-4 py-2 rounded-md transition-colors cursor-pointer group ${
              isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            {/* Track number / play indicator */}
            <div className="flex items-center justify-center text-sm">
              {isCurrentPlaying ? (
                <div className="flex items-center justify-center w-4 h-4">
                  <EqualizerBars className="h-4" />
                </div>
              ) : isHovered ? (
                <Play size={14} className="text-white fill-white" />
              ) : (
                <span className={isCurrent ? 'text-spotify-accent' : 'text-neutral-400'}>
                  {index + 1}
                </span>
              )}
            </div>

            {/* Title + cover + artist */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-10 h-10 rounded object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <div className={`text-sm font-medium truncate ${isCurrent ? 'text-spotify-accent' : 'text-white'}`}>
                  {track.title}
                </div>
                <div className="text-sm text-neutral-400 truncate hover:text-white hover:underline transition-colors">
                  {track.artist}
                </div>
              </div>
            </div>

            {/* Album */}
            {showAlbum && (
              <div className="hidden md:flex items-center text-sm text-neutral-400 truncate hover:text-white transition-colors">
                {track.album}
              </div>
            )}

            {/* Date added + like */}
            {showAddedAt && (
              <div className="hidden md:flex items-center gap-3 text-sm text-neutral-400">
                <span className="truncate">{formatAddedDate(track.createdAt)}</span>
                <LikeButton
                  liked={track.liked}
                  onToggle={() => onToggleLike(track.id)}
                />
              </div>
            )}

            {/* Duration + mobile like */}
            <div className="flex items-center justify-end gap-2 text-sm text-neutral-400">
              <span className="hidden md:inline">{formatTime(track.duration)}</span>
              <div className="md:hidden">
                <LikeButton liked={track.liked} onToggle={() => onToggleLike(track.id)} size={14} />
              </div>
              <button
                className="hidden md:flex text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
                aria-label="More options"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
