import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { processAudio } from '../utils/audioProcessor';
import { AudioContextType, AudioState } from '../types';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioState, setAudioState] = useState<AudioState>({
    originalAudio: null,
    processedAudio: null,
    isProcessing: false,
    fileName: '',
    fileType: '',
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    filterSettings: {
      frequency: 1000,
      quality: 1,
    },
  });

  const audioContext = useRef<AudioContext | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const sourceNode = useRef<AudioBufferSourceNode | null>(null);
  const analyserNode = useRef<AnalyserNode | null>(null);
  const filterNode = useRef<BiquadFilterNode | null>(null);

  const loadAudio = useCallback(async (file: File) => {
    setAudioState((prev) => ({
      ...prev,
      isProcessing: true,
      fileName: file.name.split('.').slice(0, -1).join('.'),
      fileType: file.type,
    }));

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Create AudioContext if it doesn't exist
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);
      
      setAudioState((prev) => ({
        ...prev,
        originalAudio: audioBuffer,
        duration: audioBuffer.duration,
        isProcessing: false,
      }));
      
      // Process the audio with initial filter settings
      await applyFilter(audioBuffer);
    } catch (error) {
      console.error('Error loading audio:', error);
      setAudioState((prev) => ({
        ...prev,
        isProcessing: false,
      }));
    }
  }, []);

  const applyFilter = useCallback(async (buffer: AudioBuffer) => {
    setAudioState((prev) => ({ ...prev, isProcessing: true }));
    
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const processedBuffer = await processAudio(
        audioContext.current,
        buffer,
        audioState.filterSettings
      );
      
      setAudioState((prev) => ({
        ...prev,
        processedAudio: processedBuffer,
        isProcessing: false,
      }));
    } catch (error) {
      console.error('Error processing audio:', error);
      setAudioState((prev) => ({ ...prev, isProcessing: false }));
    }
  }, [audioState.filterSettings]);

  const updateFilterSettings = useCallback((settings: Partial<typeof audioState.filterSettings>) => {
    setAudioState((prev) => ({
      ...prev,
      filterSettings: {
        ...prev.filterSettings,
        ...settings,
      },
    }));
    
    if (audioState.originalAudio) {
      applyFilter(audioState.originalAudio);
    }
  }, [applyFilter, audioState.originalAudio]);

  const playAudio = useCallback((processed: boolean = true) => {
    const buffer = processed 
      ? audioState.processedAudio 
      : audioState.originalAudio;
      
    if (!buffer || !audioContext.current) return;
    
    // Stop any currently playing audio
    if (sourceNode.current) {
      sourceNode.current.stop();
      sourceNode.current.disconnect();
    }
    
    // Create new source
    sourceNode.current = audioContext.current.createBufferSource();
    sourceNode.current.buffer = buffer;
    
    // Set up analyzer for visualization
    analyserNode.current = audioContext.current.createAnalyser();
    analyserNode.current.fftSize = 2048;
    
    // Connect nodes
    sourceNode.current.connect(analyserNode.current);
    analyserNode.current.connect(audioContext.current.destination);
    
    // Play
    sourceNode.current.start();
    setAudioState((prev) => ({ ...prev, isPlaying: true }));
    
    // Handle when playback ends
    sourceNode.current.onended = () => {
      setAudioState((prev) => ({ ...prev, isPlaying: false }));
    };
  }, [audioState.originalAudio, audioState.processedAudio]);

  const stopAudio = useCallback(() => {
    if (sourceNode.current) {
      sourceNode.current.stop();
      sourceNode.current.disconnect();
      setAudioState((prev) => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const getAnalyserData = useCallback(() => {
    if (!analyserNode.current) return new Uint8Array(0);
    
    const bufferLength = analyserNode.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserNode.current.getByteTimeDomainData(dataArray);
    return dataArray;
  }, []);

  const value = {
    audioState,
    loadAudio,
    updateFilterSettings,
    playAudio,
    stopAudio,
    applyFilter,
    getAnalyserData,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};