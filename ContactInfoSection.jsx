import React, { useState } from 'react';
import {
  Mail, Phone, MessageSquare, MapPin, Clock, Copy, Check,
  ExternalLink, Globe, Send
} from 'lucide-react';
import { Github, Linkedin, Twitter } from './BrandIcons';

export default function ContactInfoSection({ settings, onCopyToast }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const contact = settings || {
    business_email: 'hello@nodecraft.io',
    business_phone: '+1 (555) 392-8241',
    whatsapp_number: '+15553928241',
    office_address: 'Innovation Tower, Suite 402, Tech District, San Francisco, CA',
    business_hours: 'Monday – Friday: 9:00 AM – 6:00 PM PST',
    social_github: 'https://github.com/nodecraft',
    social_linkedin: 'https://linkedin.com/company/nodecraft',
    social_twitter: 'https://x.com/nodecraft_io',
    social_discord: 'https://discord.gg/nodecraft'
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (onCopyToast) onCopyToast(`Copied "${text}" to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section id="contact-info" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <span className="section-badge-dot" />
            <span>DIRECT CONNECTIVITY</span>
          </div>
          <h2 className="section-title">
            Direct Communication <span className="gradient-text">Channels</span>
          </h2>
          <p className="section-subtitle">
            Reach out via your preferred medium. Our partners and team members are available across time zones.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem',
            marginBottom: '3rem',
          }}
        >
          {/* Phone Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(103, 232, 249, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)',
                marginBottom: '1.25rem',
              }}
            >
              <Phone size={22} />
            </div>

            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Call Our Studio
            </div>
            <a
              href={`tel:${contact.business_phone?.replace(/[^\d+]/g, '')}`}
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                display: 'block',
                marginBottom: '1rem',
              }}
            >
              {contact.business_phone}
            </a>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <a
                href={`tel:${contact.business_phone?.replace(/[^\d+]/g, '')}`}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                <span>Call Now</span>
                <Phone size={13} />
              </a>
              <button
                onClick={() => handleCopy(contact.business_phone, 'phone')}
                className="btn-icon"
                style={{ width: '36px', height: '36px' }}
                title="Copy Phone"
              >
                {copiedKey === 'phone' ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* WhatsApp Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(52, 211, 153, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-emerald)',
                marginBottom: '1.25rem',
              }}
            >
              <MessageSquare size={22} />
            </div>

            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              WhatsApp Messaging
            </div>
            <div
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '1rem',
              }}
            >
              Instant Chat Line
            </div>

            <a
              href={`https://wa.me/${contact.whatsapp_number?.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
            >
              <span>Message on WhatsApp</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Office Address & Business Hours Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(167, 139, 250, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-violet)',
                marginBottom: '1.25rem',
              }}
            >
              <MapPin size={22} />
            </div>

            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              San Francisco Studio HQ
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.65rem' }}>
              {contact.office_address}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Clock size={13} />
              <span>{contact.business_hours}</span>
            </div>
          </div>
        </div>

        {/* Global Node Availability Card with Social Channels */}
        <div
          className="glass-card"
          style={{
            padding: '2.5rem',
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xl), 0 10px 40px rgba(37, 99, 235, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: 'var(--accent-emerald)',
                  boxShadow: '0 0 10px var(--accent-emerald)',
                }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-emerald)' }}>
                GLOBAL OPERATIONS ACTIVE
              </span>
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Distributed Engineering &amp; Global Availability
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Deploying for clients across North America, Europe, Asia Pacific, and beyond.
            </p>
          </div>

          {/* Social Channels */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {contact.social_github && (
              <a href={contact.social_github} target="_blank" rel="noopener noreferrer" className="btn-icon" title="GitHub">
                <Github size={18} />
              </a>
            )}
            {contact.social_linkedin && (
              <a href={contact.social_linkedin} target="_blank" rel="noopener noreferrer" className="btn-icon" title="LinkedIn">
                <Linkedin size={18} />
              </a>
            )}
            {contact.social_twitter && (
              <a href={contact.social_twitter} target="_blank" rel="noopener noreferrer" className="btn-icon" title="X / Twitter">
                <Twitter size={18} />
              </a>
            )}
            {contact.social_discord && (
              <a href={contact.social_discord} target="_blank" rel="noopener noreferrer" className="btn-icon" title="Discord Community">
                <Globe size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
