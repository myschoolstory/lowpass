import React from 'react';
import { useAudio } from '../context/AudioContext';
import AudioUploader from './AudioUploader';
import FilterControls from './FilterControls';
import AudioPlayer from './AudioPlayer';
import ExportOptions from './ExportOptions';

const AudioProcessor: React.FC = () => {
  const { audioState } = useAudio();
  const { originalAudio, processedAudio, isProcessing } = audioState;

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-lg">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Audio Lowpass Filter</h2>
        
        <div className="space-y-8">
          {!originalAudio && (
            <AudioUploader />
          )}
          
          {isProcessing && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-slate-600">Processing audio...</p>
            </div>
          )}
          
          {originalAudio && !isProcessing && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-4">Original Audio</h3>
                  <AudioPlayer 
                    audioBuffer={originalAudio} 
                    isProcessed={false} 
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-4">Filtered Audio</h3>
                  <AudioPlayer 
                    audioBuffer={processedAudio} 
                    isProcessed={true} 
                  />
                </div>
              </div>
              
              <div className="mt-8">
                <FilterControls />
              </div>
              
              {processedAudio && (
                <div className="mt-8">
                  <ExportOptions />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioProcessor;