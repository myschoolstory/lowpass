import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAudio } from '../context/AudioContext';
import AudioVisualizer from './AudioVisualizer';
import { PlayIcon, PauseIcon, VolumeIcon } from 'lucide-react';

interface AudioPlayerProps {
  audioBuffer: AudioBuffer | null;
  isProcessed: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioBuffer, isProcessed }) => {
  const { audioState, playAudio, stopAudio, getAnalyserData } = useAudio();
  const { isPlaying } = audioState;
  
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const [visualizerData, setVisualizerData] = useState<Uint8Array>(new Uint8Array(128));
  
  const animationFrameRef = useRef<number | null>(null);
  
  // Handle play/pause
  const togglePlayback = useCallback(() => {
    if (localIsPlaying) {
      stopAudio();
      setLocalIsPlaying(false);
    } else {
      playAudio(isProcessed);
      setLocalIsPlaying(true);
    }
  }, [localIsPlaying, playAudio, stopAudio, isProcessed]);
  
  // Update visualizer
  const updateVisualizer = useCallback(() => {
    if (localIsPlaying) {
      setVisualizerData(getAnalyserData());
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    }
  }, [localIsPlaying, getAnalyserData]);
  
  // Start/stop visualizer with playback
  useEffect(() => {
    if (localIsPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [localIsPlaying, updateVisualizer]);
  
  // Sync local state with global audio state
  useEffect(() => {
    // If global playback stopped, update local state
    if (!isPlaying && localIsPlaying) {
      setLocalIsPlaying(false);
    }
  }, [isPlaying, localIsPlaying]);
  
  if (!audioBuffer) return null;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-md">
      <div className="p-4">
        <AudioVisualizer 
          analyserData={visualizerData}
          color={isProcessed ? "#4F46E5" : "#3B82F6"} 
        />
        
        <div className="flex items-center mt-4">
          <button
            onClick={togglePlayback}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
              localIsPlaying 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            {localIsPlaying ? (
              <PauseIcon size={20} />
            ) : (
              <PlayIcon size={20} />
            )}
          </button>
          
          <div className="ml-4 flex-grow">
            <div className="flex items-center">
              <VolumeIcon size={16} className="text-slate-500 mr-2" />
              <div className="h-1 flex-grow bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${isProcessed ? 'bg-indigo-500' : 'bg-blue-500'}`}
                  style={{ width: `${isProcessed ? 80 : 100}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 mt-1">
              {audioBuffer.duration.toFixed(2)}s • {audioBuffer.sampleRate}Hz • 
              {audioBuffer.numberOfChannels === 1 ? ' Mono' : ' Stereo'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;