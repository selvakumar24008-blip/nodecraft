import React, { useState } from 'react';
import { ExternalLink, ArrowRight, X, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { Github } from './BrandIcons';

export default function ProjectsSection({ projects }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    'All',
    'Business Websites',
    'E-commerce',
    'Portfolio Websites',
    'Web Applications',
    'Dashboard Systems',
    'AI-Powered Solutions'
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  return (
    <section id="work" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <span className="section-badge-dot" />
            <span>OUR WORK &amp; CASE STUDIES</span>
          </div>
          <h2 className="section-title">
            Featured <span className="gradient-text">Deployments</span>
          </h2>
          <p className="section-subtitle">
            Explore our portfolio of high-performance web applications, intelligent SaaS engines,
            and digital flagship portals.
          </p>
          <div style={{ marginTop: '0.65rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            [Sample Portfolio Deployments • Manageable via Admin Portal]
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.25rem',
          }}
        >
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="glass-card"
              style={{
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'all var(--transition-normal)',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedProject(proj)}
            >
              {/* Cover Image Container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '220px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={proj.cover_image}
                  alt={proj.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  className="project-cover-img"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 40%, rgba(15, 23, 42, 0.85) 100%)',
                  }}
                />

                {/* Status Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                  }}
                >
                  <span className="badge badge-emerald">● {proj.status}</span>
                </div>

                {/* Category Pill */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                  }}
                >
                  <span className="badge badge-blue">{proj.category}</span>
                </div>
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flexGrow: 1,
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      marginBottom: '0.65rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {proj.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {proj.summary}
                  </p>

                  {/* Tech stack tags */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {proj.technologies &&
                      proj.technologies.slice(0, 4).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.6rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-code)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Card Footer Link */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                    Case Study &amp; Metrics →
                  </span>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Project Case Study Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Image Header */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '280px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                marginBottom: '1.75rem',
              }}
            >
              <img
                src={selectedProject.cover_image}
                alt={selectedProject.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 50%, rgba(15, 23, 42, 0.9) 100%)',
                }}
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="btn-icon"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  color: '#FFFFFF',
                }}
              >
                <X size={18} />
              </button>

              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  display: 'flex',
                  gap: '0.5rem',
                }}
              >
                <span className="badge badge-emerald">● {selectedProject.status}</span>
                <span className="badge badge-blue">{selectedProject.category}</span>
                {selectedProject.client && (
                  <span className="badge badge-violet">Client: {selectedProject.client}</span>
                )}
              </div>
            </div>

            {/* Title & Overview */}
            <h3 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              {selectedProject.title}
            </h3>

            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              {selectedProject.description || selectedProject.summary}
            </p>

            {/* Key Impact Stats Highlight Box */}
            {selectedProject.impact_stats && Object.keys(selectedProject.impact_stats).length > 0 && (
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(96, 165, 250, 0.08)',
                  border: '1px solid rgba(96, 165, 250, 0.25)',
                  marginBottom: '1.75rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.82rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--accent-cyan)',
                    fontWeight: 700,
                    marginBottom: '1rem',
                  }}
                >
                  <TrendingUp size={16} />
                  <span>Verified Project Impact &amp; Metrics</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '1.25rem',
                    textAlign: 'center',
                  }}
                >
                  {Object.entries(selectedProject.impact_stats).map(([k, v], idx) => (
                    <div key={idx}>
                      <div
                        style={{
                          fontSize: '1.65rem',
                          fontWeight: 800,
                          fontFamily: 'var(--font-heading)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {v}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {k}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies Used */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                Engineering Architecture
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedProject.technologies &&
                  selectedProject.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-code)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {selectedProject.live_url && (
                  <a
                    href={selectedProject.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    <span>Launch Live Demo</span>
                    <ExternalLink size={14} />
                  </a>
                )}
                {selectedProject.repo_url && (
                  <a
                    href={selectedProject.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <Github size={14} />
                    <span>View Repository</span>
                  </a>
                )}
              </div>

              <button onClick={() => setSelectedProject(null)} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .project-cover-img:hover {
          transform: scale(1.04);
        }
      `}</style>
    </section>
  );
}
