import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Music, Heart } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  albumArt: string;
  audioUrl: string;
  duration: string;
  meaning: string;
}

const playlist: Song[] = [
  {
    id: 1,
    title: "Perfect",
    artist: "Ed Sheeran",
    albumArt: "/Sarah/img/perfect-cover.jpg",
    audioUrl: "/Sarah/perfect.mp3",
    duration: "4:23",
    meaning: "This song reminds me of our first dance together."
  },
  {
    id: 2,
    title: "All of Me",
    artist: "John Legend",
    albumArt: "/Sarah/img/all-of-me-cover.jpg",
    audioUrl: "/Sarah/all-of-me.mp3",
    duration: "4:29",
    meaning: "Because you love all of me, and I love all of you."
  },
  {
    id: 3,
    title: "Thinking Out Loud",
    artist: "Ed Sheeran",
    albumArt: "/Sarah/img/thinking-out-loud-cover.jpg",
    audioUrl: "/Sarah/thinking-out-loud.mp3",
    duration: "4:41",
    meaning: "I want to love you until we're 70, and beyond."
  }
  // {
  //   id: 4,
  //   title: "A Thousand Years",
  //   artist: "Christina Perri",
  //   albumArt: "/Sarah/img/thousand-years-cover.jpg",
  //   audioUrl: "/Sarah/thousand-years.mp3",
  //   duration: "4:45",
  //   meaning: "I have loved you for a thousand years, and I'll love you for a thousand more."
  // },
  // {
  //   id: 5,
  //   title: "Can't Help Myself",
  //   artist: "Four Tops",
  //   albumArt: "/Sarah/img/cant-help-myself-cover.jpg",
  //   audioUrl: "/Sarah/cant-help-myself.mp3",
  //   duration: "2:44",
  //   meaning: "Our song from that night we danced in the kitchen."
  //}
];

const EnhancedMusicPlayer: React.FC = () => {
  const [currentSong, setCurrentSong] = useState(playlist[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    let nextIndex;
    
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    
    setCurrentSong(playlist[nextIndex]);
  };

  const prevSong = () => {
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentSong(playlist[prevIndex]);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      setProgress(progressPercent);
    }
  };

  const handleEnded = () => {
    if (isRepeating) {
      audioRef.current?.play();
    } else {
      nextSong();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audio.currentTime = percent * audio.duration;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <audio
          ref={audioRef}
          src={currentSong.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Main Player */}
        <div className="p-4 w-80">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={currentSong.albumArt}
              alt={currentSong.title}
              className="w-16 h-16 rounded-lg object-cover shadow-lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate">{currentSong.title}</h3>
              <p className="text-sm text-gray-600 truncate">{currentSong.artist}</p>
              <p className="text-xs text-pink-500 italic mt-1 line-clamp-2">
                {currentSong.meaning}
              </p>
            </div>
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Music className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div
            className="w-full bg-gray-200 rounded-full h-2 cursor-pointer mb-4"
            onClick={handleProgressClick}
          >
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`p-2 rounded-full transition-colors ${
                  isShuffled ? 'text-purple-600 bg-purple-100' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                onClick={prevSong}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-full shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </motion.button>

            <div className="flex items-center gap-2">
              <button
                onClick={nextSong}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsRepeating(!isRepeating)}
                className={`p-2 rounded-full transition-colors ${
                  isRepeating ? 'text-purple-600 bg-purple-100' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Playlist */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 bg-gray-50"
            >
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  Our Playlist
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {playlist.map((song) => (
                    <motion.div
                      key={song.id}
                      whileHover={{ backgroundColor: 'rgba(139, 69, 19, 0.05)' }}
                      onClick={() => setCurrentSong(song)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        currentSong.id === song.id ? 'bg-purple-100' : ''
                      }`}
                    >
                      <img
                        src={song.albumArt}
                        alt={song.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          currentSong.id === song.id ? 'text-purple-600' : 'text-gray-800'
                        }`}>
                          {song.title}
                        </p>
                        <p className="text-xs text-gray-600 truncate">{song.artist}</p>
                      </div>
                      <span className="text-xs text-gray-500">{song.duration}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EnhancedMusicPlayer;