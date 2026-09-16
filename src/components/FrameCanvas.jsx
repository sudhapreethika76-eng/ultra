import React, { useEffect, useRef, useState } from 'react';

// Use Vite import.meta.glob to eager load frame image URLs from assets/Frame1 and assets/Frame2
const frame1Glob = import.meta.glob('../assets/Frame1/*.png', { eager: true, import: 'default' });
const frame2Glob = import.meta.glob('../assets/Frame2/*.png', { eager: true, import: 'default' });

const getOrderedUrls = (globObj) => {
  return Object.keys(globObj)
    .sort((a, b) => {
      const numA = parseInt(a.match(/frame_(\d+)\.png/)?.[1] || '0', 10);
      const numB = parseInt(b.match(/frame_(\d+)\.png/)?.[1] || '0', 10);
      return numA - numB;
    })
    .map((key) => globObj[key]);
};

const frame1Urls = getOrderedUrls(frame1Glob);
const frame2Urls = getOrderedUrls(frame2Glob);
const ALL_FRAME_URLS = [...frame1Urls, ...frame2Urls];

export default function FrameCanvas({ progress }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [renderTrigger, setRenderTrigger] = useState(0);

  // Preload frame images into memory in background without blocking screen
  useEffect(() => {
    let isMounted = true;
    const total = ALL_FRAME_URLS.length;
    const imgArray = new Array(total);

    ALL_FRAME_URLS.forEach((url, idx) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (!isMounted) return;
        // Trigger canvas redraw when key initial frames or current frame loads
        setRenderTrigger((prev) => prev + 1);
      };
      imgArray[idx] = img;
    });

    imagesRef.current = imgArray;

    return () => {
      isMounted = false;
    };
  }, []);

  // Draw current frame on canvas based on progress
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const totalFrames = imagesRef.current.length;
    if (totalFrames === 0) return;

    const frameIdx = Math.min(
      totalFrames - 1,
      Math.max(0, Math.floor(progress * (totalFrames - 1)))
    );

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete) return;

    // Canvas size adjustment matching display size
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Aspect ratio cover-fit calculation
    const imgAspect = img.width / img.height;
    const canvasAspect = width / height;

    let drawW, drawH, drawX, drawY;

    if (canvasAspect > imgAspect) {
      drawW = width;
      drawH = width / imgAspect;
      drawX = 0;
      drawY = (height - drawH) / 2;
    } else {
      drawH = height;
      drawW = height * imgAspect;
      drawX = (width - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  }, [progress, renderTrigger]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        setRenderTrigger((prev) => prev + 1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="frame-canvas-mount">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

