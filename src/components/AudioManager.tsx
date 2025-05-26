// Global Audio Manager - Singleton pattern to manage all audio/video players
type PlayerID = string;
type PauseCallback = () => void;

interface ActivePlayer {
  id: PlayerID;
  pause: PauseCallback;
  element?: HTMLMediaElement;
}

class GlobalAudioManager {
  private static instance: GlobalAudioManager;
  private activePlayer: ActivePlayer | null = null;
  private registeredPlayers: Map<PlayerID, PauseCallback> = new Map();

  private constructor() {
    // Listen for global play events on all media elements
    document.addEventListener('play', this.handleGlobalPlay.bind(this), true);
    
    // Listen for clicks that might trigger gift modals or other interruptions
    document.addEventListener('click', this.handleGlobalClick.bind(this), true);
  }

  static getInstance(): GlobalAudioManager {
    if (!GlobalAudioManager.instance) {
      GlobalAudioManager.instance = new GlobalAudioManager();
    }
    return GlobalAudioManager.instance;
  }

  registerPlayer(playerId: PlayerID, pauseCallback: PauseCallback, element?: HTMLMediaElement) {
    this.registeredPlayers.set(playerId, pauseCallback);
    
    // If there's already an active player and it's different, pause it
    if (this.activePlayer && this.activePlayer.id !== playerId) {
      this.pauseActivePlayer();
    }
    
    this.activePlayer = { id: playerId, pause: pauseCallback, element };
  }

  unregisterPlayer(playerId: PlayerID) {
    this.registeredPlayers.delete(playerId);
    if (this.activePlayer && this.activePlayer.id === playerId) {
      this.activePlayer = null;
    }
  }

  pauseActivePlayer() {
    if (this.activePlayer) {
      this.activePlayer.pause();
      this.activePlayer = null;
    }
  }

  pauseAllPlayers() {
    this.registeredPlayers.forEach((pauseCallback) => {
      pauseCallback();
    });
    this.activePlayer = null;
  }

  private handleGlobalPlay(event: Event) {
    const target = event.target as HTMLMediaElement;
    
    // Find if this element belongs to any registered player
    let belongsToRegisteredPlayer = false;
    
    if (this.activePlayer?.element === target) {
      belongsToRegisteredPlayer = true;
    }

    // If the playing media doesn't belong to any registered player, pause all registered players
    if (!belongsToRegisteredPlayer) {
      this.pauseAllPlayers();
    }
  }

  private handleGlobalClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Check if clicked element is a gift button or modal trigger
    if (this.isGiftButton(target)) {
      console.log('Gift button clicked, pausing all audio');
      this.pauseAllPlayers();
    }
  }

  private isGiftButton(element: HTMLElement | null): boolean {
    if (!element) return false;
    
    // Check the element and its parents (up to 3 levels)
    let currentElement: HTMLElement | null = element;
    for (let i = 0; i < 3 && currentElement; i++) {
      // Check for gift-related text content
      if (currentElement.textContent?.toLowerCase().includes("open your gift") ||
          currentElement.textContent?.toLowerCase().includes("gift")) {
        return true;
      }
      
      // Check for gift-related classes, IDs, or data attributes
      if (currentElement.classList.contains("gift-button") || 
          currentElement.id.includes("gift") ||
          currentElement.getAttribute("aria-label")?.toLowerCase().includes("gift") ||
          currentElement.dataset.gift ||
          currentElement.dataset.type === "gift") {
        return true;
      }
      
      currentElement = currentElement.parentElement;
    }
    
    return false;
  }
}

export default GlobalAudioManager;