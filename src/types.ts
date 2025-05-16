export interface FilterSettings {
  frequency: number;
  quality: number;
}

export interface AudioState {
  originalAudio: AudioBuffer | null;
  processedAudio: AudioBuffer | null;
  isProcessing: boolean;
  fileName: string;
  fileType: string;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  filterSettings: FilterSettings;
}

export interface AudioContextType {
  audioState: AudioState;
  loadAudio: (file: File) => Promise<void>;
  updateFilterSettings: (settings: Partial<FilterSettings>) => void;
  playAudio: (processed?: boolean) => void;
  stopAudio: () => void;
  applyFilter: (buffer: AudioBuffer) => Promise<void>;
  getAnalyserData: () => Uint8Array;
}

export interface AudioExportOptions {
  type: 'audio/mp3' | 'audio/wav';
  fileName: string;
}