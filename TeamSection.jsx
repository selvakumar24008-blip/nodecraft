import React, { useState } from 'react';
import { ExternalLink, X, Award, Code, Sparkles } from 'lucide-react';
import { Github, Linkedin, Twitter } from './BrandIcons';

export default function TeamSection({ team }) {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <section id="team" className="section" style={{ background: '#FFFFFF' }}>
      {/* Background ambient glow */}
      <div
        className="ambient-glow ambient-glow-violet"
        style={{ width: '450px', height: '450px', top: '15%', left: '5%' }}
      />

      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <span className="section-badge-dot" />
            <span>OUR TEAM</span>
          </div>
          <h2 className="section-title">
            The Minds Behind <span className="gradient-text">the Architecture</span>
          </h2>
          <p className="section-subtitle">
            A cohesive squad of senior full-stack architects, motion artists, and cloud engineers
            dedicated to crafting flawless digital solutions.
          </p>
          <div style={{ marginTop: '0.65rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            [Sample Team Profiles • Fully Customizable via Admin Dashboard]
          </div>
        </div>

        {/* Team Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '2rem',
          }}
        >
          {team.map((member) => (
            <div
              key={member.id}
              className="glass-card"
              style={{
                padding: '2.25rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all var(--transition-normal)',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedMember(member)}
            >
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Circular Profile Avatar */}
                <div
                  style={{
                    position: 'relative',
                    width: '136px',
                    height: '136px',
                    marginBottom: '1.25rem',
                  }}
                >
                  <img
                    src={member.avatar_url}
                    alt={member.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #FFFFFF',
                      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.25), 0 10px 25px rgba(15, 23, 42, 0.1)',
                      transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                    }}
                    className="team-avatar-img"
                  />

                  {member.featured_project && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#0F172A',
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: 'var(--accent-cyan)',
                        border: '1px solid rgba(2, 132, 199, 0.4)',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      }}
                    >
                      ★ {member.featured_project}
                    </div>
                  )}
                </div>

                {/* Name (Directly below circle profile) */}
                <h3
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    marginBottom: '0.25rem',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                  }}
                >
                  {member.name}
                </h3>

                {/* Role (Directly below name) */}
                <div
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--brand-primary)',
                    fontWeight: 600,
                    marginBottom: '0.85rem',
                    textAlign: 'center',
                  }}
                >
                  {member.role}
                </div>

                {/* Bio snippet */}
                <p
                  style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    marginBottom: '1.25rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textAlign: 'center',
                  }}
                >
                  {member.bio}
                </p>

                {/* Skills Preview */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  {member.skills &&
                    member.skills.slice(0, 3).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.2rem 0.55rem',
                          background: 'rgba(37, 99, 235, 0.06)',
                          borderRadius: 'var(--radius-full)',
                          color: 'var(--brand-primary)',
                          border: '1px solid rgba(37, 99, 235, 0.15)',
                          fontWeight: 500,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>

              {/* Social Links & Action */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                  {member.social_links?.github && (
                    <a
                      href={member.social_links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      style={{ width: '32px', height: '32px' }}
                      title="GitHub Profile"
                    >
                      <Github size={14} />
                    </a>
                  )}
                  {member.social_links?.linkedin && (
                    <a
                      href={member.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      style={{ width: '32px', height: '32px' }}
                      title="LinkedIn Profile"
                    >
                      <Linkedin size={14} />
                    </a>
                  )}
                  {member.social_links?.twitter && (
                    <a
                      href={member.social_links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      style={{ width: '32px', height: '32px' }}
                      title="X / Twitter"
                    >
                      <Twitter size={14} />
                    </a>
                  )}
                </div>

                <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  View Profile →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Team Member Modal */}
      {selectedMember && (
        <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <img
                  src={selectedMember.avatar_url}
                  alt={selectedMember.name}
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--accent-cyan)',
                  }}
                />
                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{selectedMember.name}</h3>
                  <div style={{ fontSize: '0.95rem', color: 'var(--accent-electric)', fontWeight: 600 }}>
                    {selectedMember.role}
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedMember(null)} className="btn-icon" style={{ width: '36px', height: '36px' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Biography
              </h4>
              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                {selectedMember.bio}
              </p>
            </div>

            {selectedMember.featured_project && (
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(96, 165, 250, 0.08)',
                  border: '1px solid rgba(96, 165, 250, 0.25)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <Award size={20} color="var(--accent-cyan)" />
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    Signature Architecture
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{selectedMember.featured_project}</div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Core Competencies &amp; Technologies
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedMember.skills &&
                  selectedMember.skills.map((skill, idx) => (
                    <span key={idx} className="badge badge-blue" style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
                      {skill}
                    </span>
                  ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedMember(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .team-avatar-img:hover {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
