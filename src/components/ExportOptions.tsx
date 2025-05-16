import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { exportAudio } from '../utils/audioProcessor';
import { AudioExportOptions } from '../types';
import { DownloadIcon, FileAudioIcon, ClockIcon } from 'lucide-react';

const ExportOptions: React.FC = () => {
  const { audioState } = useAudio();
  const { processedAudio, fileName } = audioState;
  
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState<'audio/mp3' | 'audio/wav'>('audio/mp3');
  
  const handleExport = async () => {
    if (!processedAudio) return;
    
    setExporting(true);
    
    try {
      const blob = await exportAudio(
        processedAudio,
        exportType,
        fileName
      );
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const extension = exportType === 'audio/mp3' ? 'mp3' : 'wav';
      const a = document.createElement('a');
      
      a.href = url;
      a.download = `${fileName}_filtered.${extension}`;
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting audio:', error);
      alert('Failed to export audio. Please try again.');
    }
    
    setExporting(false);
  };
  
  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-700 mb-6 flex items-center">
        <FileAudioIcon size={20} className="mr-2 text-blue-600" />
        Export Audio
      </h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setExportType('audio/mp3')}
            className={`p-4 rounded-lg border transition-all duration-200 flex items-center ${
              exportType === 'audio/mp3'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className="w-10 h-10 mr-3 rounded-full bg-blue-100 flex items-center justify-center">
              <FileAudioIcon size={20} className="text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium">Export as MP3</p>
              <p className="text-xs text-slate-500">Smaller file size, good quality</p>
            </div>
          </button>
          
          <button
            onClick={() => setExportType('audio/wav')}
            className={`p-4 rounded-lg border transition-all duration-200 flex items-center ${
              exportType === 'audio/wav'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className="w-10 h-10 mr-3 rounded-full bg-blue-100 flex items-center justify-center">
              <FileAudioIcon size={20} className="text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium">Export as WAV</p>
              <p className="text-xs text-slate-500">Lossless quality, larger file size</p>
            </div>
          </button>
        </div>
        
        <div className="flex items-center bg-amber-50 p-3 rounded-lg border border-amber-100">
          <ClockIcon size={16} className="text-amber-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            M4A export format is currently being worked on and will be available soon.
          </p>
        </div>
        
        <button
          onClick={handleExport}
          disabled={exporting || !processedAudio}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200 ${
            exporting || !processedAudio
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {exporting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <DownloadIcon size={18} className="mr-2" />
              <span>Export Filtered Audio</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExportOptions;