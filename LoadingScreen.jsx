import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [fadingOut, setFadingOut] = useState(false);
  const [stage, setStage] = useState(1); // 1: nodes form, 2: lines connect, 3: wordmark reveals, 4: complete

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        setFadingOut(true);
        setTimeout(onComplete, 200);
      }, 400);
      return () => clearTimeout(timer);
    }

    const t1 = setTimeout(() => setStage(2), 350);
    const t2 = setTimeout(() => setStage(3), 750);
    const t3 = setTimeout(() => {
      setFadingOut(true);
      setTimeout(onComplete, 500);
    }, 1350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#FFFFFF',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: fadingOut ? 0 : 1,
        transform: fadingOut ? 'scale(1.04)' : 'scale(1)',
        pointerEvents: fadingOut ? 'none' : 'all',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, rgba(2,132,199,0.05) 50%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'pulseGlow 2.5s infinite ease-in-out',
        }}
      />

      {/* Connected Nodes Animated Logo */}
      <div
        style={{
          position: 'relative',
          width: '180px',
          height: '110px',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: stage >= 1 ? 'scale(1)' : 'scale(0.85)',
          opacity: stage >= 1 ? 1 : 0,
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <img
          src="/logo-mark.png"
          alt="NODE CRAFT Logo"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 24px rgba(96, 165, 250, 0.75))',
            animation: 'pulseGlow 2.5s infinite ease-in-out',
          }}
        />
      </div>

      {/* Agency Wordmark Reveal */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <span
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.8rem',
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: '#0F172A',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          NOD
          <span
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              gap: '3px',
              verticalAlign: 'middle',
              margin: '0 2px 0 1px',
            }}
          >
            <span style={{ width: '13px', height: '3px', background: 'var(--accent-cyan)', borderRadius: '1.5px' }} />
            <span style={{ width: '13px', height: '3px', background: 'var(--accent-cyan)', borderRadius: '1.5px' }} />
            <span style={{ width: '13px', height: '3px', background: 'var(--accent-cyan)', borderRadius: '1.5px' }} />
          </span>
        </span>
        <span
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.8rem',
            fontWeight: 800,
            letterSpacing: '0.18em',
            background: 'linear-gradient(135deg, #1E40AF, #2563EB)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginLeft: '0.35rem',
          }}
        >
          CRAFT
        </span>
      </div>

      {/* Animated Subtle Pulse Subtitle */}
      <span
        style={{
          marginTop: '0.65rem',
          fontSize: '0.8rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#64748B',
          opacity: stage >= 3 ? 0.9 : 0,
          transition: 'opacity 0.4s ease 0.15s',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
        }}
      >
        Crafting Digital. Connecting Possibilities.
      </span>
    </div>
  );
}
