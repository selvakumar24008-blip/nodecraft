import React from 'react';
import HeroCanvas from './HeroCanvas';
import { ArrowRight, Sparkles, Code2, Cpu, ShieldCheck, Terminal, Compass } from 'lucide-react';

export default function HeroSection({ content, onStartProject, onExploreWork }) {
  const hero = content || {
    badge: 'NEXT-GEN DIGITAL CRAFTSMANSHIP',
    headline: 'Where Logic Meets Vision.',
    subheadline: 'We Craft Intelligent Digital Experiences.',
    paragraph: 'NODE CRAFT connects cutting-edge engineering, bespoke UI/UX design, and AI integration to build scalable, high-conversion web applications that accelerate modern businesses.',
    ctaPrimary: 'Start a Project',
    ctaSecondary: 'Explore Our Work',
    stats: [
      { label: 'Production Deployments', value: '50+' },
      { label: 'Uptime Reliability', value: '99.9%' },
      { label: 'Client Satisfaction', value: '100%' },
      { label: 'Avg Speed Boost', value: '4.2x' }
    ]
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'calc(var(--header-height) + 2rem)',
        paddingBottom: '4rem',
        overflow: 'hidden',
      }}
    >
      {/* Interactive Connected Nodes Particle Canvas */}
      <HeroCanvas />

      {/* Ambient background glows */}
      <div
        className="ambient-glow ambient-glow-blue"
        style={{ width: '500px', height: '500px', top: '10%', left: '15%' }}
      />
      <div
        className="ambient-glow ambient-glow-violet"
        style={{ width: '450px', height: '450px', top: '35%', right: '10%' }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '3.5rem',
          }}
        >
          {/* Left Column: Headline & Action CTAs */}
          <div style={{ maxWidth: '640px' }}>
            {/* Animated Agency Badge */}
            <div className="section-badge" style={{ animation: 'fadeIn 0.6s ease' }}>
              <span className="section-badge-dot" />
              <span>{hero.badge || 'NEXT-GEN DIGITAL CRAFTSMANSHIP'}</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.6rem, 5.2vw, 4.2rem)',
                lineHeight: 1.1,
                fontWeight: 800,
                marginBottom: '1.25rem',
                letterSpacing: '-0.03em',
              }}
            >
              {hero.headline || 'Where Logic Meets Vision.'} <br />
              <span className="gradient-text">
                {hero.subheadline || 'We Craft Intelligent Digital Experiences.'}
              </span>
            </h1>

            {/* Supporting Copy */}
            <p
              style={{
                fontSize: '1.15rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                marginBottom: '2.25rem',
                maxWidth: '560px',
              }}
            >
              {hero.paragraph ||
                'NODE CRAFT connects cutting-edge engineering, bespoke UI/UX design, and AI integration to build scalable, high-conversion web applications that accelerate modern businesses.'}
            </p>

            {/* Call to Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '3rem',
              }}
            >
              <button onClick={onStartProject} className="btn btn-primary">
                <span>{hero.ctaPrimary || 'Start a Project'}</span>
                <ArrowRight size={17} />
              </button>

              <button onClick={onExploreWork} className="btn btn-secondary">
                <span>{hero.ctaSecondary || 'Explore Our Work'}</span>
              </button>
            </div>

            {/* Quick Tech Highlights Badge Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                flexWrap: 'wrap',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Terminal size={15} color="var(--accent-electric)" />
                <span>Zero Technical Debt</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Cpu size={15} color="var(--accent-cyan)" />
                <span>AI-Native Engineering</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <ShieldCheck size={15} color="var(--accent-emerald)" />
                <span>Enterprise Grade Security</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Abstract 3D Architecture Visual */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Main Interactive Glass Console Card */}
            <div
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: '480px',
                padding: '2rem',
                background: '#0F172A',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 50px rgba(37, 99, 235, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <img src="/logo-mark.png" alt="NodeCraft" style={{ width: '20px', height: '14px', objectFit: 'contain' }} />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-code)' }}>
                    nodecraft.config.ts
                  </div>
                </div>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                  ONLINE 24/7
                </span>
              </div>

              {/* Code Snippet Layer */}
              <div
                style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '0.86rem',
                  lineHeight: 1.8,
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <span style={{ color: '#A78BFA' }}>const</span>{' '}
                  <span style={{ color: '#60A5FA' }}>nodeCraft</span> ={' '}
                  <span style={{ color: '#67E8F9' }}>createDigitalStudio</span>&#40;&#123;
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span style={{ color: '#9CA9BC' }}>architecture:</span>{' '}
                  <span style={{ color: '#34D399' }}>'Distributed &amp; Edge'</span>,
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span style={{ color: '#9CA9BC' }}>frontend:</span>{' '}
                  <span style={{ color: '#34D399' }}>'Ultra-Responsive Glassmorphism'</span>,
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span style={{ color: '#9CA9BC' }}>intelligence:</span>{' '}
                  <span style={{ color: '#34D399' }}>'Custom LLM + Vector Search'</span>,
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span style={{ color: '#9CA9BC' }}>performance:</span>{' '}
                  <span style={{ color: '#FBBF24' }}>99.98</span>,
                </div>
                <div>&#125;&#41;;</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ color: '#A78BFA' }}>await</span>{' '}
                  <span style={{ color: '#60A5FA' }}>nodeCraft</span>.
                  <span style={{ color: '#67E8F9' }}>launchProductionExperience</span>&#40;&#41;;
                </div>
              </div>

              {/* Visual Node Graph Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(96, 165, 250, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-electric)',
                    }}
                  >
                    <Code2 size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Multi-Cloud Engine
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Global Low Latency Sync</div>
                  </div>
                </div>
                <span className="badge badge-emerald">Optimal</span>
              </div>
            </div>

            {/* Floating Glass Accent Pill: Top Right */}
            <div
              className="glass-card"
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-15px',
                padding: '0.75rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                animation: 'floatAnim 4s ease-in-out infinite',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--accent-cyan)',
                  boxShadow: '0 0 10px var(--accent-cyan)',
                }}
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>100% Custom Tailored</span>
            </div>

            {/* Floating Glass Accent Pill: Bottom Left */}
            <div
              className="glass-card"
              style={{
                position: 'absolute',
                bottom: '-25px',
                left: '-15px',
                padding: '0.75rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                animation: 'floatAnim 5s ease-in-out infinite 1.5s',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <Sparkles size={16} color="var(--accent-violet)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Glassmorphic Motion</span>
            </div>
          </div>
        </div>

        {/* Bottom Trust Statistics Bar */}
        <div
          style={{
            marginTop: '5rem',
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            backdropFilter: 'blur(16px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          {hero.stats &&
            hero.stats.map((stat, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                    fontWeight: 800,
                    marginBottom: '0.35rem',
                    background: 'var(--gradient-accent)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
