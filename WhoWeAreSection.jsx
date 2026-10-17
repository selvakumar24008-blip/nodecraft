import React, { useState } from 'react';
import { Sparkles, Zap, ShieldCheck, Users, Layers, Cpu, CheckCircle2, ChevronRight } from 'lucide-react';

export default function WhoWeAreSection({ content }) {
  const [activePhilosophyTab, setActivePhilosophyTab] = useState(0);

  const about = content || {
    title: 'Engineering Tomorrow’s Connected Web',
    story: 'NODE CRAFT was born out of a desire to eliminate clunky, fragile web software. We are an elite team of full-stack engineers, motion designers, and system architects passionate about transforming ambitious ideas into resilient digital platforms.',
    mission: 'To bridge business intent and state-of-the-art web technology through uncompromising code craftsmanship, breathtaking aesthetics, and dependable architectures.',
    vision: 'To be the premier digital catalyst for ambitious startups and enterprises seeking intelligent, high-velocity digital experiences.',
    values: [
      {
        title: 'Creativity',
        description: 'Design that evokes emotion, sparks curiosity, and delivers distinct brand presence.',
        icon: 'Sparkles'
      },
      {
        title: 'Innovation',
        description: 'Adopting battle-tested modern tools, AI workflows, and progressive web capabilities.',
        icon: 'Zap'
      },
      {
        title: 'Quality',
        description: 'Zero-compromise engineering: strict type safety, deep testing, and sub-second load times.',
        icon: 'ShieldCheck'
      },
      {
        title: 'Partnership',
        description: 'Transparent communication, agile milestones, and enduring commitment beyond launch day.',
        icon: 'Users'
      }
    ],
    philosophy: [
      { layer: '01. Architecture', detail: 'Distributed micro-services & headless paradigms tailored to your load.' },
      { layer: '02. Engineering', detail: 'Clean code, resilient error boundaries, and observable data pipelines.' },
      { layer: '03. Visual Motion', detail: 'Purposeful micro-interactions with hardware-accelerated 60 FPS transitions.' },
      { layer: '04. Scalability', detail: 'Automated CI/CD, multi-region edge caches, and enterprise data security.' }
    ]
  };

  const renderIcon = (name) => {
    switch (name) {
      case 'Sparkles': return <Sparkles size={24} color="var(--accent-cyan)" />;
      case 'Zap': return <Zap size={24} color="var(--accent-electric)" />;
      case 'ShieldCheck': return <ShieldCheck size={24} color="var(--accent-emerald)" />;
      case 'Users': return <Users size={24} color="var(--accent-violet)" />;
      default: return <Sparkles size={24} color="var(--accent-cyan)" />;
    }
  };

  return (
    <section id="about" className="section">
      {/* Background ambient glow */}
      <div
        className="ambient-glow ambient-glow-violet"
        style={{ width: '450px', height: '450px', top: '20%', left: '-10%' }}
      />

      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <span className="section-badge-dot" />
            <span>WHO WE ARE</span>
          </div>
          <h2 className="section-title">
            Crafting Digital. <span className="gradient-text">Connecting Possibilities.</span>
          </h2>
          <p className="section-subtitle">
            {about.title || 'Engineering Tomorrow’s Connected Web with Precision & Artistry'}
          </p>
        </div>

        {/* Split Layout: Narrative Story & Interactive Development Philosophy */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
            marginBottom: '4.5rem',
          }}
        >
          {/* Narrative Column */}
          <div>
            <h3
              style={{
                fontSize: '1.85rem',
                marginBottom: '1.25rem',
                color: 'var(--text-primary)',
              }}
            >
              We transform complex ideas into{' '}
              <span className="gradient-text">effortless digital realities</span>.
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {about.story}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                marginTop: '2rem',
              }}
            >
              {/* Mission Card */}
              <div
                className="glass-card"
                style={{ padding: '1.5rem', borderColor: 'rgba(96, 165, 250, 0.25)' }}
              >
                <div
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--accent-cyan)',
                    fontWeight: 700,
                    marginBottom: '0.45rem',
                  }}
                >
                  Our Mission
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  {about.mission}
                </p>
              </div>

              {/* Vision Card */}
              <div
                className="glass-card"
                style={{ padding: '1.5rem', borderColor: 'rgba(167, 139, 250, 0.25)' }}
              >
                <div
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--accent-violet)',
                    fontWeight: 700,
                    marginBottom: '0.45rem',
                  }}
                >
                  Our Vision
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  {about.vision}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Philosophy Layers Visual */}
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xl), 0 10px 40px rgba(37, 99, 235, 0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Layers size={22} color="var(--accent-cyan)" />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Our Development Philosophy</h4>
              </div>
              <span className="badge badge-blue">4 Core Pillars</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {about.philosophy &&
                about.philosophy.map((item, idx) => {
                  const isActive = activePhilosophyTab === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActivePhilosophyTab(idx)}
                      style={{
                        padding: '1.15rem 1.35rem',
                        borderRadius: 'var(--radius-md)',
                        background: isActive
                          ? 'linear-gradient(90deg, rgba(96, 165, 250, 0.16) 0%, rgba(103, 232, 249, 0.08) 100%)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: isActive
                          ? '1px solid rgba(96, 165, 250, 0.45)'
                          : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                        boxShadow: isActive ? '0 0 20px rgba(96, 165, 250, 0.2)' : 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: isActive ? '0.45rem' : '0',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: isActive ? 'var(--accent-cyan)' : 'var(--text-primary)',
                          }}
                        >
                          {item.layer}
                        </span>
                        <ChevronRight
                          size={16}
                          style={{
                            transform: isActive ? 'rotate(90deg)' : 'none',
                            transition: 'transform 0.2s ease',
                            color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                          }}
                        />
                      </div>
                      {isActive && (
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {item.detail}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* 4 Value Cards with interactive hover effects */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {about.values &&
            about.values.map((val, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2rem',
                  transition: 'all var(--transition-normal)',
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {renderIcon(val.icon)}
                </div>

                <h4
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '0.65rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  {val.title}
                </h4>

                <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  {val.description}
                </p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
