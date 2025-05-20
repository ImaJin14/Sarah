// Complete fix for MusicPlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);

  useEffect(() => {
    // Create the audio element only once
    audioRef.current = new Audio('/src/components/alex-warren-ordinary.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    
    // Set up event listeners
    audioRef.current.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
      console.log("Audio loaded and ready to play");
    });
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current || !audioLoaded) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // This promise pattern handles autoplay restrictions
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playing successfully");
          })
          .catch(error => {
            console.error("Playback failed:", error);
            // Show user interaction required message
            alert("Please click 'Play Music' again to enable the background music");
          });
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white/80 backdrop-blur-sm rounded-full shadow-lg px-4 py-2 flex items-center gap-3">
      <button 
        onClick={togglePlay}
        className="focus:outline-none text-pink-600 hover:text-pink-700 transition-colors"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <VolumeX size={24} />
        ) : (
          <Volume2 size={24} />
        )}
      </button>
      
      <div className="flex items-center gap-2">
        <span className="text-xs text-pink-600 font-medium">
          {isPlaying ? "Playing" : "Music"}
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-20 h-1.5 bg-pink-200 rounded-lg appearance-none cursor-pointer"
          aria-label="Volume control"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;