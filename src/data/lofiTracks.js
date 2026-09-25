export const lofiTracks = [
  {
    id: 1,
    title: 'Simple Rain Sound',
    artist: 'Rivis Ambient',
    duration: '1:44',
    bpm: 60,
    mood: 'Gentle Rainfall',
    url: '/audio/rain.mp3'
  },
  {
    id: 2,
    title: 'Gentle Rain on Window',
    artist: 'Study Beats',
    duration: '2:15',
    bpm: 60,
    mood: 'Morning Flow',
    url: '/audio/rain.mp3'
  },
  {
    id: 3,
    title: 'Rainy Sunday Ambience',
    artist: 'Coffee House',
    duration: '2:30',
    bpm: 58,
    mood: 'Gentle Thought',
    url: '/audio/rain.mp3'
  },
  {
    id: 4,
    title: 'Campus Rain Shower',
    artist: 'Lofi Library',
    duration: '2:16',
    bpm: 56,
    mood: 'Mathematical Flow',
    url: '/audio/rain.mp3'
  },
  {
    id: 5,
    title: 'Midnight Rain Focus',
    artist: 'Night Owl Chill',
    duration: '3:11',
    bpm: 60,
    mood: 'Deep Immersion',
    url: '/audio/rain.mp3'
  },
  {
    id: 6,
    title: 'Quiet Rain Solitude',
    artist: 'Aura Lofi',
    duration: '2:35',
    bpm: 60,
    mood: 'Quiet Solitude',
    url: '/audio/rain.mp3'
  },
  {
    id: 7,
    title: 'Peaceful Soft Rainfall',
    artist: 'Analog Dreams',
    duration: '2:43',
    bpm: 59,
    mood: 'Serene Recall',
    url: '/audio/rain.mp3'
  },
  {
    id: 8,
    title: 'Acoustic Rain Morning',
    artist: 'Study Beats',
    duration: '2:10',
    bpm: 61,
    mood: 'Soft Focus',
    url: '/audio/rain.mp3'
  },
  {
    id: 9,
    title: 'Café Rain Chill',
    artist: 'Coffee House',
    duration: '2:32',
    bpm: 58,
    mood: 'Relaxed Memory',
    url: '/audio/rain.mp3'
  },
  {
    id: 10,
    title: 'Smooth Study Rainfall',
    artist: 'Rivis Ambient',
    duration: '2:50',
    bpm: 60,
    mood: 'Smooth Study',
    url: '/audio/rain.mp3'
  },
  {
    id: 11,
    title: 'Weekend Rain Flow',
    artist: 'Weekend Beats',
    duration: '3:02',
    bpm: 60,
    mood: 'Chill Coding',
    url: '/audio/rain.mp3'
  },
  {
    id: 12,
    title: 'Night Rain Highway',
    artist: 'Night Owl Chill',
    duration: '2:32',
    bpm: 62,
    mood: 'Night Owl Study',
    url: '/audio/rain.mp3'
  },
  {
    id: 13,
    title: 'Lo-Fi Rain Nostalgia',
    artist: 'Analog Dreams',
    duration: '2:15',
    bpm: 60,
    mood: 'Tape Nostalgia',
    url: '/audio/rain.mp3'
  },
  {
    id: 14,
    title: 'Summer Rain Garden',
    artist: 'Lofi Garden',
    duration: '2:40',
    bpm: 60,
    mood: 'Mellow Groove',
    url: '/audio/rain.mp3'
  },
  {
    id: 15,
    title: 'Deep Focus Cloudburst',
    artist: 'Aura Lofi',
    duration: '2:40',
    bpm: 54,
    mood: 'Deep Consolidation',
    url: '/audio/rain.mp3'
  }
];

class LofiAudioEngine {
  constructor() {
    this.audio = typeof Audio !== 'undefined' ? new Audio() : null;
    this.currentTrackUrl = null;
    this.volume = 0.6;
    this.onTrackEndCallback = null;

    if (this.audio) {
      this.audio.volume = this.volume;
      this.audio.preload = 'auto';
      this.audio.loop = true;
      this.audio.addEventListener('ended', () => {
        if (this.onTrackEndCallback) {
          this.onTrackEndCallback();
        }
      });
      this.audio.addEventListener('error', (e) => {
        console.warn('Audio playback notice:', e);
      });
    }
  }

  setTrackEndCallback(callback) {
    this.onTrackEndCallback = callback;
  }

  playTrack(track) {
    if (!this.audio) return;
    if (this.currentTrackUrl !== track.url) {
      this.currentTrackUrl = track.url;
      this.audio.src = track.url;
    } else {
      // Reset position so the track plays fresh on track change
      this.audio.currentTime = 0;
    }
    this.audio.play().catch((err) => {
      console.log('Playback waiting for user interaction:', err);
    });
  }

  play() {
    if (this.audio && this.audio.src) {
      this.audio.play().catch(() => {});
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }
}

export const ambientAudio = new LofiAudioEngine();
