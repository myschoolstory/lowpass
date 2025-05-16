import { FilterSettings } from '../types';

/**
 * Process audio with a lowpass filter
 */
export const processAudio = async (
  audioContext: AudioContext,
  audioBuffer: AudioBuffer,
  filterSettings: FilterSettings
): Promise<AudioBuffer> => {
  // Create an offline audio context to process the audio
  const offlineContext = new OfflineAudioContext({
    numberOfChannels: audioBuffer.numberOfChannels,
    length: audioBuffer.length,
    sampleRate: audioBuffer.sampleRate,
  });

  // Create source and filter nodes
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;

  // Create the lowpass filter
  const filter = offlineContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = filterSettings.frequency;
  filter.Q.value = filterSettings.quality;

  // Connect the nodes
  source.connect(filter);
  filter.connect(offlineContext.destination);

  // Start the source
  source.start(0);

  // Render the audio
  const renderedBuffer = await offlineContext.startRendering();
  return renderedBuffer;
};

/**
 * Export audio buffer to a specified format
 */
export const exportAudio = (
  audioBuffer: AudioBuffer,
  format: 'audio/mp3' | 'audio/wav',
  fileName: string
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Create an offline audio context for encoding
    const offlineContext = new OfflineAudioContext({
      numberOfChannels: audioBuffer.numberOfChannels,
      length: audioBuffer.length,
      sampleRate: audioBuffer.sampleRate,
    });

    // Create a source node
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start(0);

    // Start rendering
    offlineContext.startRendering().then((renderedBuffer) => {
      if (format === 'audio/wav') {
        // Convert to WAV format
        const wavBlob = bufferToWav(renderedBuffer);
        resolve(wavBlob);
      } else if (format === 'audio/mp3') {
        // For MP3, we're using a simple approach
        // Note: In a production app, you would use a proper MP3 encoder library
        const audioElement = document.createElement('audio');
        const mediaRecorder = new MediaRecorder(createMediaStreamFromBuffer(renderedBuffer), {
          mimeType: 'audio/webm',
        });
        
        const chunks: BlobPart[] = [];
        
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/mp3' });
          resolve(blob);
        };
        
        mediaRecorder.start();
        
        // Stop after the duration of the audio
        setTimeout(() => {
          mediaRecorder.stop();
        }, renderedBuffer.duration * 1000);
      } else {
        reject(new Error('Unsupported format'));
      }
    }).catch(reject);
  });
};

/**
 * Create a MediaStream from an AudioBuffer
 */
const createMediaStreamFromBuffer = (audioBuffer: AudioBuffer): MediaStream => {
  const audioContext = new AudioContext();
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  
  const destination = audioContext.createMediaStreamDestination();
  source.connect(destination);
  source.start(0);
  
  return destination.stream;
};

/**
 * Convert an AudioBuffer to a WAV file Blob
 */
const bufferToWav = (audioBuffer: AudioBuffer): Blob => {
  const numOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numOfChannels * 2;
  const sampleRate = audioBuffer.sampleRate;
  
  // Create buffer with header space
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);
  
  // Write WAV header
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  
  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // subchunk1size (PCM = 16)
  view.setUint16(20, 1, true); // audioFormat (PCM = 1)
  view.setUint16(22, numOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numOfChannels * 2, true); // byteRate
  view.setUint16(32, numOfChannels * 2, true); // blockAlign
  view.setUint16(34, 16, true); // bitsPerSample
  
  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);
  
  // Write audio data
  const channelData = [];
  let offset = 44;
  
  for (let i = 0; i < numOfChannels; i++) {
    channelData.push(audioBuffer.getChannelData(i));
  }
  
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numOfChannels; channel++) {
      // Convert float to int16
      const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }
  
  return new Blob([buffer], { type: 'audio/wav' });
};

/**
 * Helper function to write a string to a DataView
 */
const writeString = (view: DataView, offset: number, string: string): void => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};