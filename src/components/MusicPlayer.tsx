import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Pause, Play } from 'lucide-react';

// Define types for the audio manager
type PlayerID = string;
type PauseCallback = () => void;
type ActivePlayer = { id: PlayerID; pause: PauseCallback } | null;

// Create a global audio manager as a singleton
const AudioManagerSingleton = () => {
  let instance: {
    activePlayer: ActivePlayer;
    registerPlayer: (playerId: PlayerID, pauseCallback: PauseCallback) => void;
    unregisterPlayer: (playerId: PlayerID) => void;
  };

  return () => {
    if (!instance) {
      instance = {
        activePlayer: null,
        registerPlayer: function(playerId: PlayerID, pauseCallback: PauseCallback) {
          // If there's already an active player, pause it
          if (this.activePlayer && this.activePlayer.id !== playerId) {
            this.activePlayer.pause();
          }
          this.activePlayer = { id: playerId, pause: pauseCallback };
        },
        unregisterPlayer: function(playerId: PlayerID) {
          if (this.activePlayer && this.activePlayer.id === playerId) {
            this.activePlayer = null;
          }
        }
      };
    }
    return instance;
  };
};

// Get the singleton instance
const getAudioManager = AudioManagerSingleton();

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const playerIdRef = useRef<PlayerID>(`player-${Math.random().toString(36).substr(2, 9)}`);
  const audioManager = getAudioManager();
  
  // Playlist - replace with actual songs your partner loves
  const playlist = [
    {
      name: "Romantic Background Music",
      url: "/Sarah/alex-warren-ordinary.mp3", 
    }
  ];
  
  // Pause function that can be called by the audio manager
  const pauseAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  // Set up audio element
  useEffect(() => {
    // Create the audio element
    audioRef.current = new Audio(playlist[0].url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    // Set up event listeners
    const handleCanPlayThrough = () => {
      setAudioLoaded(true);
      console.log("Audio loaded and ready to play");
      
      // Try to autoplay when loaded
      if (audioRef.current) {
        // Register with audio manager
        audioManager.registerPlayer(playerIdRef.current, pauseAudio);
        
        // Attempt to play
        audioRef.current.play()
          .then(() => {
            console.log("Autoplay successful");
            setIsPlaying(true);
          })
          .catch(error => {
            console.log("Autoplay prevented by browser policy:", error);
            audioManager.unregisterPlayer(playerIdRef.current);
          });
      }
    };
    
    // Add event listener for when audio can play
    audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
    
    // Add global media event listeners to detect when other media starts playing
    const handlePlayEvent = (event: Event) => {
      const target = event.target as HTMLMediaElement;
      // Check if the playing media is not our audio element
      if (target !== audioRef.current && isPlaying && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        audioManager.unregisterPlayer(playerIdRef.current);
      }
    };
    
    // Listen for play events on all media elements
    document.addEventListener('play', handlePlayEvent, true);
    
    // Listen for clicks on "Open your gift" buttons
    const handleGiftButtonClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if clicked element or its parent is the gift button
      // Look for elements with text containing "Open your gift" or specific class/id
      const isGiftButton = (element: HTMLElement | null): boolean => {
        if (!element) return false;
        
        // Check if the element or its children contain "Open your gift" text
        if (element.textContent?.toLowerCase().includes("open your gift")) {
          return true;
        }
        
        // Check specific classes or IDs that might be used for gift buttons
        if (element.classList.contains("gift-button") || 
            element.id.includes("gift") ||
            element.getAttribute("aria-label")?.toLowerCase().includes("gift")) {
          return true;
        }
        
        // Check for data attributes
        if (element.dataset.gift || element.dataset.type === "gift") {
          return true;
        }
        
        return false;
      };
      
      // Check the clicked element and its parent elements (up to 3 levels)
      let currentElement: HTMLElement | null = target;
      for (let i = 0; i < 3 && currentElement; i++) {
        if (isGiftButton(currentElement)) {
          // If a gift button is clicked, pause the audio
          if (isPlaying && audioRef.current) {
            console.log("Gift button clicked, pausing audio");
            audioRef.current.pause();
            setIsPlaying(false);
            audioManager.unregisterPlayer(playerIdRef.current);
          }
          break;
        }
        currentElement = currentElement.parentElement;
      }
    };
    
    // Listen for all clicks to detect gift button clicks
    document.addEventListener('click', handleGiftButtonClick, true);
    
    return () => {
      if (audioRef.current) {
        // Clean up event listeners
        audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
        audioRef.current.pause();
        audioRef.current.src = "";
        audioManager.unregisterPlayer(playerIdRef.current);
      }
      
      // Remove global event listeners
      document.removeEventListener('play', handlePlayEvent, true);
      document.removeEventListener('click', handleGiftButtonClick, true);
    };
  }, []);
  
  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  const togglePlay = () => {
    if (!audioRef.current || !audioLoaded) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      audioManager.unregisterPlayer(playerIdRef.current);
    } else {
      // Register with audio manager before playing
      audioManager.registerPlayer(playerIdRef.current, pauseAudio);
      
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
            audioManager.unregisterPlayer(playerIdRef.current);
          });
      }
    }
    setIsPlaying(!isPlaying);
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