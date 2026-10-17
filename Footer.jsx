import React, { useState } from 'react';
import { ArrowUp, Globe, Heart, Shield, Lock, X } from 'lucide-react';
import { Github, Linkedin, Twitter } from './BrandIcons';

export default function Footer({ onOpenAdmin }) {
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Team', href: '#team' },
    { label: 'Work', href: '#work' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
    { label: 'FAQ', href: '#faq' }
  ];

  const serviceLinks = [
    'Website Development',
    'Frontend Architecture',
    'Backend API Systems',
    'UI/UX Design Systems',
    'E-commerce Solutions',
    'Full-Stack Turnkey',
    'Cloud CI/CD Deployment',
    'AI-Powered Web Systems'
  ];

  return (
    <footer
      style={{
        background: '#F8FAFC',
        borderTop: '1px solid rgba(15, 23, 42, 0.08)',
        paddingTop: '5rem',
        paddingBottom: '3rem',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="container">
        {/* Top 4-Column Footer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          {/* Brand Info & Mission */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.6))',
                }}
              >
                <img
                  src="/logo-mark.png"
                  alt="NODE CRAFT Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: '#F8FAFC',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                NOD
                <span
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    gap: '2.5px',
                    verticalAlign: 'middle',
                    margin: '0 1px 0 0',
                  }}
                >
                  <span style={{ width: '9px', height: '2.5px', background: 'var(--accent-cyan)', borderRadius: '1px' }} />
                  <span style={{ width: '9px', height: '2.5px', background: 'var(--accent-cyan)', borderRadius: '1px' }} />
                  <span style={{ width: '9px', height: '2.5px', background: 'var(--accent-cyan)', borderRadius: '1px' }} />
                </span>
                <span className="gradient-text" style={{ marginLeft: '0.2rem' }}>CRAFT</span>
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Crafting intelligent digital experiences by connecting technology, creativity, and innovation.
              Where Ideas Become Digital.
            </p>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <a href="https://github.com/nodecraft" target="_blank" rel="noopener noreferrer" className="btn-icon" style={{ width: '36px', height: '36px' }}>
                <Github size={15} />
              </a>
              <a href="https://linkedin.com/company/nodecraft" target="_blank" rel="noopener noreferrer" className="btn-icon" style={{ width: '36px', height: '36px' }}>
                <Linkedin size={15} />
              </a>
              <a href="https://x.com/nodecraft_io" target="_blank" rel="noopener noreferrer" className="btn-icon" style={{ width: '36px', height: '36px' }}>
                <Twitter size={15} />
              </a>
              <a href="https://discord.gg/nodecraft" target="_blank" rel="noopener noreferrer" className="btn-icon" style={{ width: '36px', height: '36px' }}>
                <Globe size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
              }}
            >
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--accent-cyan)')}
                  onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Service Capabilities */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
              }}
            >
              Core Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {serviceLinks.map((serv) => (
                <a
                  key={serv}
                  href="#services"
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--accent-electric)')}
                  onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
                >
                  {serv}
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
              }}
            >
              Direct Studio
            </h4>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
              <div>San Francisco, California</div>
              <div>+1 (555) 392-8241</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => setLegalModal('privacy')}
                style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setLegalModal('terms')}
                style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}
              >
                Terms of Engagement
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} NODE CRAFT LLC. Built with Logic. Crafted with Vision. All rights reserved.
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <span>Back to Top</span>
            <ArrowUp size={15} />
          </button>
        </div>
      </div>

      {/* Privacy / Terms Modal */}
      {legalModal && (
        <div className="modal-overlay" onClick={() => setLegalModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              <button onClick={() => setLegalModal(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              {legalModal === 'privacy' ? (
                <>
                  <p style={{ marginBottom: '1rem' }}>
                    At <strong>NODE CRAFT</strong>, we respect your privacy and are committed to protecting the confidential information you share with us.
                  </p>
                  <p style={{ marginBottom: '1rem' }}>
                    Information submitted via our project enquiry forms is utilized strictly to communicate project scopes, generate technical proposals, and deliver requested software engineering services.
                  </p>
                  <p>
                    We never sell, rent, or lease client information to third parties. All client source code and technical data are treated under rigorous non-disclosure agreements.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: '1rem' }}>
                    All services provided by <strong>NODE CRAFT</strong> are governed by dedicated Master Services Agreements (MSA) and Statements of Work (SOW) executed between authorized parties.
                  </p>
                  <p style={{ marginBottom: '1rem' }}>
                    Deliverables, project milestones, payment schedules, and intellectual property transfers are defined precisely per contract.
                  </p>
                  <p>
                    Upon complete remuneration, full intellectual property and production source repositories are transferred irrevocably to the client.
                  </p>
                </>
              )}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setLegalModal(null)} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
