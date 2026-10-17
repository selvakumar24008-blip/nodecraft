import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar({ onOpenAdmin, onStartProject }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [logoClicks, setLogoClicks] = useState(0);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // Section spy
      const sections = ['hero', 'about', 'services', 'process', 'team', 'work', 'reviews', 'contact', 'faq'];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Secret shortcut: Triple click on logo opens admin
  const handleLogoClick = (e) => {
    handleLinkClick(e, '#hero');
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        if (onOpenAdmin) onOpenAdmin();
        return 0;
      }
      return next;
    });
    setTimeout(() => setLogoClicks(0), 1000);
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(255, 255, 255, 0.94)'
          : 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 20px rgba(15, 23, 42, 0.05)' : 'none',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo Mark & Wordmark (Hidden 3-click shortcut) */}
        <a
          href="#hero"
          onClick={handleLogoClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
          title="NODE CRAFT"
        >
          <div
            style={{
              width: '46px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(0 2px 8px rgba(37, 99, 235, 0.25))',
              transition: 'transform 0.3s var(--ease-spring)',
            }}
            className="logo-mark"
          >
            <img
              src="/logo-mark.png"
              alt="NODE CRAFT Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                gap: '0.18rem',
                lineHeight: 1.1,
              }}
            >
              NOD
              {/* Stylized 3-bar cyan E from official logo */}
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
            <span
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                fontWeight: 600,
              }}
            >
              Digital Studio
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.35rem',
            background: '#FFFFFF',
            padding: '0.35rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                style={{
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-full)',
                  color: isActive ? '#2563EB' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(37, 99, 235, 0.22)' : '1px solid transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Actions (Start a Project CTA & Mobile menu toggle — Admin button HIDDEN from public view) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Start Project CTA Button */}
          <button
            onClick={onStartProject}
            className="btn btn-primary btn-sm desktop-only-btn"
          >
            <span>Start a Project</span>
            <ArrowRight size={15} />
          </button>

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-icon mobile-menu-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '2.5rem 1.5rem',
            zIndex: 899,
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  color: activeSection === link.href.substring(1) ? 'var(--accent-electric)' : 'var(--text-primary)',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onStartProject();
            }}
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            <span>Start a Project</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* CSS helper for responsive navigation display */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-toggle { display: none !important; }
        }
        @media (max-width: 991px) {
          .desktop-only-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}
