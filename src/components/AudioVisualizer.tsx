import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  analyserData: Uint8Array;
  color?: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  analyserData,
  color = '#3B82F6' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || analyserData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    
    // Scale the drawing
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set line style
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    
    // Start drawing
    ctx.beginPath();
    
    const sliceWidth = (canvas.width / analyserData.length) * 0.5;
    let x = 0;
    
    for (let i = 0; i < analyserData.length; i++) {
      const v = analyserData[i] / 128.0;
      const y = (v * canvas.height) / 4 + canvas.height / 4;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }, [analyserData, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-24 rounded-lg"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
    />
  );
};

export default AudioVisualizer;