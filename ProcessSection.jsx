import React, { useState } from 'react';
import {
  Compass, FileText, Palette, Code2, CheckCircle2, Rocket, RefreshCw,
  Clock, ArrowRight, Check
} from 'lucide-react';

export default function ProcessSection({ steps }) {
  const [activeStep, setActiveStep] = useState(1);

  const defaultSteps = [
    {
      step_number: 1,
      title: 'Discovery and Requirements',
      subtitle: 'Uncovering the Core Vision',
      description: 'We align deeply with your business objectives, target demographics, technical requirements, and strategic metrics to construct a blueprint for success.',
      deliverables: ['Project Scope Document', 'Technical Feasibility Analysis', 'Stakeholder Alignment Matrix', 'Milestone Roadmap'],
      icon: 'Compass',
      duration: 'Week 1'
    },
    {
      step_number: 2,
      title: 'Research and Planning',
      subtitle: 'Architectural Blueprinting',
      description: 'We conduct competitive benchmarking, user flow mapping, database schema design, and security modeling before writing a single line of production code.',
      deliverables: ['Architecture Design Spec', 'Database Entity Relationship Diagram', 'User Journey Maps', 'Tech Stack Selection'],
      icon: 'FileText',
      duration: 'Week 2'
    },
    {
      step_number: 3,
      title: 'UI/UX Design and Prototyping',
      subtitle: 'Crafting the Visual Identity',
      description: 'Our design studio translates wireframes into high-fidelity glassmorphic prototypes, establishing a comprehensive design system with micro-interaction motion specs.',
      deliverables: ['Figma Design System', 'High-Fidelity Clickable Prototype', 'Accessibility Audit (WCAG)', 'Interactive Micro-motion Specs'],
      icon: 'Figma',
      duration: 'Weeks 3-4'
    },
    {
      step_number: 4,
      title: 'Frontend and Backend Development',
      subtitle: 'High-Velocity Engineering',
      description: 'Our senior engineers construct clean, modular codebases with strict type safety, performant state management, secure REST/GraphQL APIs, and resilient data layers.',
      deliverables: ['Modular Component Library', 'Hardened API & Database Engine', 'Bi-weekly Staging Demos', 'Automated Unit & E2E Tests'],
      icon: 'Code2',
      duration: 'Weeks 5-8'
    },
    {
      step_number: 5,
      title: 'Testing and Quality Assurance',
      subtitle: 'Zero-Tolerance Verification',
      description: 'We subject the application to rigorous stress tests: cross-browser compatibility, mobile responsive matrices, penetration security checks, and Lighthouse performance tuning.',
      deliverables: ['Full QA Test Matrix Report', 'Security Penetration Signoff', 'Lighthouse 95+ Audit', 'Cross-Device Validation Matrix'],
      icon: 'CheckCircle2',
      duration: 'Week 9'
    },
    {
      step_number: 6,
      title: 'Deployment and Launch',
      subtitle: 'Flawless Production Release',
      description: 'We orchestrate zero-downtime containerized production releases on cloud infrastructure with edge CDNs, SSL certificates, DNS routing, and automated rollback triggers.',
      deliverables: ['Production Cloud Provisioning', 'SSL & DNS Propagation', 'CI/CD Pipeline Setup', 'Live Launch Monitoring'],
      icon: 'Rocket',
      duration: 'Week 10'
    },
    {
      step_number: 7,
      title: 'Maintenance and Continuous Improvement',
      subtitle: 'Long-Term Evolution',
      description: 'Post-launch, we provide continuous health telemetry, proactive dependency updates, security audits, database backups, and data-driven feature iterations.',
      deliverables: ['24/7 SLA Uptime Monitoring', 'Scheduled Dependency Patches', 'Quarterly Optimization Reviews', 'On-demand Feature Sprints'],
      icon: 'RefreshCw',
      duration: 'Ongoing'
    }
  ];

  const processList = steps && steps.length > 0 ? steps : defaultSteps;
  const currentStepData = processList.find((s) => s.step_number === activeStep) || processList[0];

  const renderStepIcon = (iconName) => {
    const props = { size: 20 };
    switch (iconName) {
      case 'Compass': return <Compass {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'Palette':
      case 'Figma': return <Palette {...props} />;
      case 'Code2': return <Code2 {...props} />;
      case 'CheckCircle2': return <CheckCircle2 {...props} />;
      case 'Rocket': return <Rocket {...props} />;
      case 'RefreshCw': return <RefreshCw {...props} />;
      default: return <Compass {...props} />;
    }
  };

  return (
    <section id="process" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <span className="section-badge-dot" />
            <span>OUR PROCESS</span>
          </div>
          <h2 className="section-title">
            The 7-Stage <span className="gradient-text">Engineering Lifecycle</span>
          </h2>
          <p className="section-subtitle">
            A battle-tested agile methodology engineered for transparency, continuous velocity, and flawless deployment.
          </p>
        </div>

        {/* Horizontal Timeline Track (Desktop) / Vertical Selector (Mobile) */}
        <div
          style={{
            position: 'relative',
            marginBottom: '3.5rem',
            padding: '1.5rem 0',
          }}
        >
          {/* Connecting glowing progress line */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '4%',
              right: '4%',
              height: '3px',
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-50%)',
              zIndex: 1,
              borderRadius: '2px',
            }}
            className="timeline-track-desktop"
          />

          {/* Active progress fill */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '4%',
              width: `${((activeStep - 1) / (processList.length - 1)) * 92}%`,
              height: '3px',
              background: 'var(--gradient-accent)',
              transform: 'translateY(-50%)',
              zIndex: 1,
              transition: 'width 0.4s var(--ease-spring)',
              boxShadow: '0 0 12px var(--accent-cyan)',
            }}
            className="timeline-track-desktop"
          />

          {/* Step Nodes Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 2,
              gap: '0.75rem',
              overflowX: 'auto',
              paddingBottom: '0.75rem',
            }}
          >
            {processList.map((step) => {
              const isActive = step.step_number === activeStep;
              const isPast = step.step_number < activeStep;

              return (
                <button
                  key={step.step_number}
                  onClick={() => setActiveStep(step.step_number)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.65rem',
                    background: 'none',
                    minWidth: '100px',
                    cursor: 'pointer',
                  }}
                >
                  {/* Node Circle */}
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: isActive
                        ? 'var(--gradient-accent)'
                        : isPast
                        ? 'rgba(96, 165, 250, 0.25)'
                        : 'var(--bg-secondary)',
                      border: isActive
                        ? '2px solid #FFFFFF'
                        : isPast
                        ? '2px solid var(--accent-electric)'
                        : '2px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? '#080D18' : isPast ? 'var(--accent-electric)' : 'var(--text-muted)',
                      boxShadow: isActive ? '0 0 20px var(--accent-cyan)' : 'none',
                      transition: 'all var(--transition-normal)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    {renderStepIcon(step.icon)}
                  </div>

                  {/* Stage Label */}
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Step 0{step.step_number}
                    </div>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        maxWidth: '120px',
                        lineHeight: 1.25,
                        marginTop: '0.2rem',
                      }}
                    >
                      {step.title.split(' ')[0]}...
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detailed Breakdown Panel */}
        <div
          className="glass-card"
          style={{
            padding: '2.75rem',
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xl), 0 10px 40px rgba(37, 99, 235, 0.08)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left: Stage Title, Description, Duration */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span className="badge badge-cyan">STAGE 0{currentStepData.step_number} OF 07</span>
                {currentStepData.duration && (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8rem',
                      color: 'var(--accent-violet)',
                      fontWeight: 600,
                    }}
                  >
                    <Clock size={14} />
                    <span>{currentStepData.duration}</span>
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {currentStepData.title}
              </h3>
              <div style={{ fontSize: '1.05rem', color: 'var(--accent-electric)', fontWeight: 600, marginBottom: '1.25rem' }}>
                {currentStepData.subtitle}
              </div>

              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                {currentStepData.description}
              </p>

              {/* Navigation buttons to step through timeline */}
              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <button
                  disabled={activeStep === 1}
                  onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: activeStep === 1 ? 0.4 : 1, cursor: activeStep === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Previous Stage
                </button>
                <button
                  disabled={activeStep === processList.length}
                  onClick={() => setActiveStep((prev) => Math.min(processList.length, prev + 1))}
                  className="btn btn-primary btn-sm"
                  style={{ opacity: activeStep === processList.length ? 0.4 : 1, cursor: activeStep === processList.length ? 'not-allowed' : 'pointer' }}
                >
                  <span>Next Stage</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right: Key Deliverables Checklist Box */}
            <div
              style={{
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                Tangible Stage Deliverables
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {currentStepData.deliverables &&
                  currentStepData.deliverables.map((del, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.8rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(52, 211, 153, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-emerald)',
                        }}
                      >
                        <Check size={14} />
                      </div>
                      <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {del}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .timeline-track-desktop { display: none !important; }
        }
      `}</style>
    </section>
  );
}
