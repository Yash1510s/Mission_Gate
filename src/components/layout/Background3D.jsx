import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { WALLPAPER_PRESETS } from '../../data/wallpapers';

export default function Background3D() {
  const canvasRef = useRef(null);
  const wallpaperId = useSettingsStore(s => s.wallpaper) || 'sonoma';
  const activePreset = WALLPAPER_PRESETS.find(p => p.id === wallpaperId) || WALLPAPER_PRESETS[0];

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Debounced resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 200);
    };
    window.addEventListener('resize', handleResize);

    // Gentle, slow-floating ambient stardust (reduced count for perf)
    const particleCount = reduceMotion ? 8 : 20;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.15,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulseVal: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    let lastFrame = 0;
    const targetInterval = 1000 / 30; // Target ~30fps instead of 60fps

    const render = (timestamp) => {
      animationFrameId = requestAnimationFrame(render);

      // Throttle to ~30fps
      if (timestamp - lastFrame < targetInterval) return;
      lastFrame = timestamp;

      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Dot grid removed — CSS background-image already draws the grid pattern
      // This eliminates thousands of ctx.arc() calls per frame

      // Render gentle stardust particles only
      particles.forEach((p) => {
        if (!reduceMotion) {
          p.y += p.speedY;
          p.x += p.speedX;
          if (p.y < 0) p.y = height;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
        }

        p.pulseVal += p.pulseSpeed;
        const currentOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulseVal));

        ctx.fillStyle = `rgba(226, 232, 240, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, [wallpaperId]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Background Image Layer */}
      {activePreset.url && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${activePreset.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'contrast(1.08) saturate(1.15)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: 'scale(1.02)'
          }}
        />
      )}

      {/* Dark Glass Overlay Layer for High Readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: activePreset.overlay,
          backdropFilter: activePreset.url ? 'blur(4px)' : 'none',
          WebkitBackdropFilter: activePreset.url ? 'blur(4px)' : 'none',
          transition: 'background 0.8s ease'
        }}
      />

      {/* Subtle Interactive Dot Grid & Stardust Canvas Layer */}
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', position: 'relative', zIndex: 1 }} />
    </div>
  );
}
