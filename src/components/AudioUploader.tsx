import React, { useCallback, useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { FileUpIcon, AlertTriangle } from 'lucide-react';

const ACCEPTED_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-m4a', 'audio/m4a'];

const AudioUploader: React.FC = () => {
  const { loadAudio } = useAudio();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    
    if (!file) {
      setError('No file selected');
      return;
    }
    
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload an MP3, WAV, or M4A file');
      return;
    }
    
    loadAudio(file);
  }, [loadAudio]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${
        dragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <FileUpIcon size={28} className="text-blue-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-700">Upload Audio File</h3>
        
        <p className="text-slate-500 max-w-md">
          Drag and drop your audio file here, or click to select a file.
          Supported formats: MP3, WAV, M4A
        </p>
        
        <label className="mt-4">
          <input
            type="file"
            accept=".mp3,.wav,.m4a,audio/*"
            onChange={handleChange}
            className="hidden"
          />
          <span className="px-6 py-2.5 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors duration-200 inline-block">
            Select File
          </span>
        </label>
        
        {error && (
          <div className="flex items-center mt-4 text-red-500">
            <AlertTriangle size={18} className="mr-2" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioUploader;