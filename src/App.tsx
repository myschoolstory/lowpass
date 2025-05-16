import React from 'react';
import { AudioProvider } from './context/AudioContext';
import Header from './components/Header';
import AudioProcessor from './components/AudioProcessor';
import Footer from './components/Footer';

function App() {
  return (
    <AudioProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <AudioProcessor />
        </main>
        <Footer />
      </div>
    </AudioProvider>
  );
}

export default App;