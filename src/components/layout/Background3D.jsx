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

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse parallax tracking
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Gentle, slow-floating ambient stardust
    const particleCount = reduceMotion ? 12 : 35;
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

    const render = () => {
      time += 0.015;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // 1. Render Architectural Dot Grid
      const gridSize = 36;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.045)';
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Render Gentle Stardust / Ambient Light Dust
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

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
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
