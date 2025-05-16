import React from 'react';
import { AudioWaveform as Waveform } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white bg-opacity-80 backdrop-blur-md shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Waveform size={24} className="text-blue-600" />
          <h1 className="text-xl font-semibold text-slate-800">AudioFilter</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200"
              >
                Github
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200"
              >
                Help
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;