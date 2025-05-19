import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Pause, Play } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Playlist - replace with actual songs your partner loves
  const playlist = [
    {
      name: "Romantic Background Music",
      // This is just a placeholder URL - replace with actual music URL
      url: "https://example.com/music.mp3", 
    }
  ];
  
  // Set up audio element
  useEffect(() => {
    // In a real implementation, you would use an actual audio file
    // For this example, we're just creating the audio element without a source
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // In a real implementation, you would set the source here if not already set
        // audioRef.current.src = playlist[0].url;
        audioRef.current.play().catch(e => {
          console.log("Auto-play prevented. Please interact with the document first.", e);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div 
      className={`fixed bottom-4 right-4 z-40 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 ${
        expanded ? 'w-64 px-4 py-3' : 'w-12 h-12'
      }`}
    >
      {!expanded ? (
        <button 
          onClick={toggleExpanded}
          className="w-12 h-12 flex items-center justify-center text-purple-600 hover:text-purple-800 transition-colors"
          aria-label="Open music player"
        >
          <Music className="h-6 w-6" />
        </button>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-purple-800 truncate flex-1">
              {playlist[0].name}
            </p>
            <button 
              onClick={toggleExpanded}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close music player"
            >
              <Music className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <button 
              onClick={togglePlay}
              className="text-purple-600 hover:text-purple-800 bg-purple-100 p-1.5 rounded-full"
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            
            <button 
              onClick={toggleMute}
              className="text-purple-600 hover:text-purple-800"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-purple-600 h-1"
              aria-label="Volume control"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;