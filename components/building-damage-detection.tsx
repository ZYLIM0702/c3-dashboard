import React, { useState, useRef } from 'react';

const PREDEFINED_IMAGE_1 =
  'https://xuxxudtsqfdbchssrouw.supabase.co/storage/v1/object/public/video//2013.png';
const PREDEFINED_IMAGE_2 =
  'https://xuxxudtsqfdbchssrouw.supabase.co/storage/v1/object/public/video//2019.png';

const ChangeDetection = () => {
  const [image1, setImage1] = useState<string | null>(PREDEFINED_IMAGE_1);
  const [image2, setImage2] = useState<string | null>(PREDEFINED_IMAGE_2);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [threshold, setThreshold] = useState(76);
  const [sliderValue, setSliderValue] = useState(0.5); // For before/after slider
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle file upload for before/after
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setImage: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setImage(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const detectChanges = async () => {
    if (!image1 || !image2) return;
    setProcessing(true);
    setResultUrl(null);

    const img1 = await loadImage(image1);
    const img2 = await loadImage(image2);

    const width = Math.min(img1.width, img2.width);
    const height = Math.min(img1.height, img2.height);

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = width;
    canvas.height = height;

    // Draw and get data from first image
    ctx.drawImage(img1, 0, 0, width, height);
    const data1 = ctx.getImageData(0, 0, width, height);

    // Draw and get data from second image
    ctx.drawImage(img2, 0, 0, width, height);
    const data2 = ctx.getImageData(0, 0, width, height);

    // Create a diff overlay
    const diff = ctx.createImageData(width, height);
    for (let i = 0; i < data1.data.length; i += 4) {
      const rDiff = Math.abs(data1.data[i] - data2.data[i]);
      const gDiff = Math.abs(data1.data[i + 1] - data2.data[i + 1]);
      const bDiff = Math.abs(data1.data[i + 2] - data2.data[i + 2]);
      const totalDiff = (rDiff + gDiff + bDiff) / 3;

      if (totalDiff > threshold) {
        // Highlight change in red overlay
        diff.data[i] = 255;
        diff.data[i + 1] = 0;
        diff.data[i + 2] = 0;
        diff.data[i + 3] = 120; // semi-transparent
      } else {
        // Keep original image
        diff.data[i] = data1.data[i];
        diff.data[i + 1] = data1.data[i + 1];
        diff.data[i + 2] = data1.data[i + 2];
        diff.data[i + 3] = 255;
      }
    }

    // Draw diff overlay
    ctx.putImageData(diff, 0, 0);
    setResultUrl(canvas.toDataURL());
    setProcessing(false);
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.src = src;
    });
  };

  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 flex flex-col items-center">
          <label className="mb-1 text-sm text-muted-foreground">Before Disaster</label>
          <div className="w-full flex flex-col items-center">
            <img
              src={image1!}
              alt="Before Disaster"
              className="mt-2 rounded shadow border border-muted max-h-64 object-contain"
            />
            <input
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={e => handleImageUpload(e, setImage1)}
            />
            <span className="text-xs text-muted-foreground mt-1">Upload or use sample</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <label className="mb-1 text-sm text-muted-foreground">After Disaster</label>
          <div className="w-full flex flex-col items-center">
            <img
              src={image2!}
              alt="After Disaster"
              className="mt-2 rounded shadow border border-muted max-h-64 object-contain"
            />
            <input
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={e => handleImageUpload(e, setImage2)}
            />
            <span className="text-xs text-muted-foreground mt-1">Upload or use sample</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1">
          <label className="block mb-1 text-sm text-muted-foreground">Change Detection Threshold: <span className="font-semibold text-primary">{threshold}</span></label>
          <input
            type="range"
            min={0}
            max={255}
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        {resultUrl && (
          <div className="flex-1">
            <label className="block mb-1 text-sm text-muted-foreground">Before/After Slider</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={sliderValue}
              onChange={e => setSliderValue(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        )}
      </div>

      <button
        onClick={detectChanges}
        className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition font-semibold shadow"
      >
        {processing ? 'Processing...' : 'Detect Changes'}
      </button>

      {processing && (
        <div className="mt-6 text-lg text-muted-foreground animate-pulse">Analyzing images...</div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {resultUrl && image1 && image2 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Result (Changes Highlighted in Red)</h2>
          <div className="relative w-full max-w-2xl mx-auto h-[500px] rounded overflow-hidden border border-muted shadow-lg bg-black">
            <div className="absolute inset-0">
              <img
                src={image1}
                alt="Before Disaster"
                className="w-full h-full object-contain absolute left-0 top-0"
                style={{ clipPath: `inset(0 ${100 - sliderValue * 100}% 0 0)` }}
              />
              <img
                src={image2}
                alt="After Disaster"
                className="w-full h-full object-contain absolute left-0 top-0"
                style={{ clipPath: `inset(0 0 0 ${sliderValue * 100}%)` }}
              />
              <img
                src={resultUrl}
                alt="Change Detection Result"
                className="w-full h-full object-contain absolute left-0 top-0 opacity-80 pointer-events-none"
                style={{ mixBlendMode: 'lighten' }}
              />
            </div>
            {/* Slider handle visual */}
            <div
              className="absolute top-0 bottom-0"
              style={{ left: `${sliderValue * 100}%`, width: '3px', background: 'rgba(59,130,246,0.7)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeDetection;
