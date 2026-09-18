import React, { useEffect, useRef } from 'react';

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

export default function FrameCanvas({ progressRef }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const lastDrawnFrameRef = useRef(-1);
  const boundsRef = useRef({ width: 0, height: 0, dpr: 1 });

  // Preload frame images into memory with async decode for 60fps performance
  useEffect(() => {
    let isMounted = true;
    const total = ALL_FRAME_URLS.length;
    const imgArray = new Array(total);

    ALL_FRAME_URLS.forEach((url, idx) => {
      const img = new Image();
      img.src = url;

      // Off-main-thread image decode if supported to prevent scroll jank
      if ('decode' in img) {
        img.decode().then(() => {
          if (!isMounted) return;
          if (idx === 0 && lastDrawnFrameRef.current === -1) {
            drawFrame();
          }
        }).catch(() => {
          // Fallback on standard load
        });
      }

      img.onload = () => {
        if (!isMounted) return;
        if (lastDrawnFrameRef.current === -1 || lastDrawnFrameRef.current === idx) {
          drawFrame();
        }
      };
      imgArray[idx] = img;
    });

    imagesRef.current = imgArray;

    return () => {
      isMounted = false;
    };
  }, []);

  // Update cached bounds on resize (AVOIDS getBoundingClientRect in render loop)
  const updateBounds = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    boundsRef.current = {
      width: rect.width,
      height: rect.height,
      dpr
    };

    if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    }

    // Force redraw on bounds update
    lastDrawnFrameRef.current = -1;
    drawFrame();
  };

  const drawFrame = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const totalFrames = imagesRef.current.length;
    if (totalFrames === 0) return;

    const currentP = progressRef?.current ?? 0;
    const frameIdx = Math.min(
      totalFrames - 1,
      Math.max(0, Math.floor(currentP * (totalFrames - 1)))
    );

    // SKIP REDRAW IF FRAME INDEX HAS NOT CHANGED (Massive 60 FPS Optimization)
    if (frameIdx === lastDrawnFrameRef.current) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const { width, height, dpr } = boundsRef.current;
    if (width === 0 || height === 0) return;

    lastDrawnFrameRef.current = frameIdx;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Aspect ratio cover-fit calculation
    const imgAspect = img.naturalWidth / img.naturalHeight;
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

    ctx.fillStyle = '#030107';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  };

  // High performance animation loop attached to rAF
  useEffect(() => {
    updateBounds();

    let animationFrameId;
    const loop = () => {
      drawFrame();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    const handleResize = () => {
      updateBounds();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="frame-canvas-mount">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}


