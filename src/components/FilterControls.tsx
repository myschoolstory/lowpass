import React, { useCallback } from 'react';
import { useAudio } from '../context/AudioContext';
import { Sliders, SlidersHorizontalIcon as SliderHorizontalIcon } from 'lucide-react';

const FilterControls: React.FC = () => {
  const { audioState, updateFilterSettings } = useAudio();
  const { filterSettings } = audioState;

  const handleFrequencyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      updateFilterSettings({ frequency: value });
    },
    [updateFilterSettings]
  );

  const handleQualityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      updateFilterSettings({ quality: value });
    },
    [updateFilterSettings]
  );

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-700 mb-6 flex items-center">
        <SliderHorizontalIcon size={20} className="mr-2 text-blue-600" />
        Filter Controls
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="frequency" className="text-sm font-medium text-slate-600">
              Frequency: {filterSettings.frequency} Hz
            </label>
            <span className="text-xs text-slate-500">
              Cutoff frequency
            </span>
          </div>
          
          <input
            id="frequency"
            type="range"
            min="20"
            max="20000"
            step="10"
            value={filterSettings.frequency}
            onChange={handleFrequencyChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>20 Hz</span>
            <span>1 kHz</span>
            <span>20 kHz</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="quality" className="text-sm font-medium text-slate-600">
              Resonance: {filterSettings.quality.toFixed(1)}
            </label>
            <span className="text-xs text-slate-500">
              Q factor
            </span>
          </div>
          
          <input
            id="quality"
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={filterSettings.quality}
            onChange={handleQualityChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0.1</span>
            <span>5.0</span>
            <span>10.0</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
          <Sliders size={16} className="mr-2" />
          What do these controls do?
        </h4>
        <p className="text-sm text-blue-700">
          <strong>Frequency</strong>: Controls the cutoff point where frequencies above are filtered out. Lower values create a more muffled sound.
        </p>
        <p className="text-sm text-blue-700 mt-1">
          <strong>Resonance</strong>: Boosts frequencies near the cutoff point. Higher values create a more pronounced filter effect.
        </p>
      </div>
    </div>
  );
};

export default FilterControls;