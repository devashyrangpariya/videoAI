/**
 * VideoPlayer Component
 * 
 * A custom video player with playback controls, volume adjustment, and fullscreen support.
 * Features include play/pause, volume control, progress bar, and time display.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  SkipBack, SkipForward, Settings, Download
} from 'lucide-react';

interface VideoPlayerProps {
  /** URL of the video to play */
  src: string;
  /** URL of the poster image to show before video plays */
  poster?: string;
  /** Title of the video */
  title?: string;
  /** Whether to autoplay the video */
  autoPlay?: boolean;
  /** Callback function called when video playback ends */
  onEnded?: () => void;
}

export default function VideoPlayer({ 
  src, 
  poster, 
  title, 
  autoPlay = false,
  onEnded 
}: VideoPlayerProps) {
  // Refs for DOM elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  // State for player controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  /**
   * Initialize video and load metadata
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [src]);

  /**
   * Handle play/pause state changes
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(error => {
        console.error("Error playing video:", error);
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  /**
   * Handle video time updates and ended event
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  /**
   * Handle volume changes
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  /**
   * Handle fullscreen changes
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  /**
   * Auto-hide controls when playing
   */
  useEffect(() => {
    if (!isPlaying) return;

    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      const timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
      
      setControlsTimeout(timeout);
    };

    const playerElement = playerRef.current;
    if (playerElement) {
      playerElement.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (playerElement) {
        playerElement.removeEventListener('mousemove', handleMouseMove);
      }
      
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [isPlaying, controlsTimeout]);

  /**
   * Format time (seconds -> MM:SS)
   */
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  /**
   * Handle progress bar click to seek
   */
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    
    videoRef.current.currentTime = pos * duration;
  };

  /**
   * Toggle play/pause
   */
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  /**
   * Toggle mute
   */
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  /**
   * Toggle fullscreen
   */
  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  /**
   * Skip forward/backward by specified seconds
   */
  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  return (
    <div 
      ref={playerRef}
      className="relative w-full bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Main Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full"
        onClick={togglePlay}
        autoPlay={autoPlay}
      />
      
      {/* Video Title Overlay */}
      {title && (
        <div className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent text-white transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}
      
      {/* Video Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Progress Bar */}
        <div 
          ref={progressRef}
          className="h-1 w-full bg-gray-600 rounded-full mb-4 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-purple-500 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-purple-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {/* Left Controls Group */}
          <div className="flex items-center space-x-4">
            {/* Play/Pause Button */}
            <button 
              onClick={togglePlay}
              className="text-white hover:text-purple-400 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            
            {/* Skip Buttons */}
            <button 
              onClick={() => skip(-10)}
              className="text-white hover:text-purple-400 transition-colors"
              aria-label="Skip back 10 seconds"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => skip(10)}
              className="text-white hover:text-purple-400 transition-colors"
              aria-label="Skip forward 10 seconds"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            
            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMute}
                className="text-white hover:text-purple-400 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  setIsMuted(newVolume === 0);
                }}
                className="w-16 accent-purple-500"
                aria-label="Volume"
              />
            </div>
            
            {/* Time Display */}
            <div className="text-white text-sm">
              <span>{formatTime(currentTime)}</span>
              <span> / </span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Right Controls Group */}
          <div className="flex items-center space-x-4">
            {/* Settings Button */}
            <button 
              className="text-white hover:text-purple-400 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            {/* Download Button */}
            <a 
              href={src} 
              download
              className="text-white hover:text-purple-400 transition-colors"
              aria-label="Download"
            >
              <Download className="w-5 h-5" />
            </a>
            
            {/* Fullscreen Button */}
            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-purple-400 transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Big Play Button (when paused) */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-purple-600/80 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors"
          aria-label="Play"
        >
          <Play className="w-10 h-10 text-white ml-1" />
        </button>
      )}
    </div>
  );
} 