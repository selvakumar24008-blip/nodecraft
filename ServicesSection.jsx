import React, { useState } from 'react';
import {
  Globe, Layout, Server, Palette, ShoppingCart, Layers,
  ShieldCheck, TrendingUp, Cloud, Cpu, ArrowRight, Check, X, Sparkles
} from 'lucide-react';

export default function ServicesSection({ services, onSelectServiceForEnquiry }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedService, setSelectedService] = useState(null);

  const categories = ['All', 'Core Development', 'Engineering & Data', 'Design & Experience', 'Growth & Optimization', 'Support & Ops'];

  const renderServiceIcon = (iconName) => {
    const props = { size: 26, strokeWidth: 1.8 };
    switch (iconName) {
      case 'Globe': return <Globe {...props} color="var(--accent-electric)" />;
      case 'Layout': return <Layout {...props} color="var(--accent-cyan)" />;
      case 'Server': return <Server {...props} color="var(--accent-violet)" />;
      case 'Palette': return <Palette {...props} color="var(--accent-rose)" />;
      case 'ShoppingCart': return <ShoppingCart {...props} color="var(--accent-amber)" />;
      case 'Layers': return <Layers {...props} color="var(--accent-electric)" />;
      case 'ShieldCheck': return <ShieldCheck {...props} color="var(--accent-emerald)" />;
      case 'TrendingUp': return <TrendingUp {...props} color="var(--accent-cyan)" />;
      case 'Cloud': return <Cloud {...props} color="var(--accent-violet)" />;
      case 'Cpu': return <Cpu {...props} color="var(--accent-electric)" />;
      default: return <Globe {...props} color="var(--accent-electric)" />;
    }
  };

  const filteredServices = services.filter((s) => {
    if (activeCategory === 'All') return true;
    return s.category === activeCategory;
  });

  return (
    <section id="services" className="section" style={{ background: '#F8FAFC' }}>
      {/* Ambient background glow */}
      <div
        className="ambient-glow ambient-glow-blue"
        style={{ width: '500px', height: '500px', top: '30%', right: '-5%' }}
      />

      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <span className="section-badge-dot" />
            <span>OUR SERVICES</span>
          </div>
          <h2 className="section-title">
            Engineered for <span className="gradient-text">Velocity &amp; Scale</span>
          </h2>
          <p className="section-subtitle">
            From modern responsive frontends to complex distributed backends and cognitive AI pipelines,
            we deliver end-to-end digital mastery.
          </p>
        </div>

        {/* Filter Pills */}
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

        {/* Services Grid (10 Categories) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2.25rem',
                transition: 'all var(--transition-normal)',
                position: 'relative',
              }}
            >
              <div>
                {/* Header: Icon & Category */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {renderServiceIcon(service.icon)}
                  </div>
                  <span className="badge badge-blue">{service.category}</span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  {service.title}
                </h3>

                {/* Summary */}
                <p
                  style={{
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    marginBottom: '1.5rem',
                  }}
                >
                  {service.summary}
                </p>

                {/* Preview bullets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.75rem' }}>
                  {service.features &&
                    service.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <Check size={14} color="var(--accent-cyan)" />
                        <span>{feat}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Bottom Action: Explore Service Details */}
              <button
                onClick={() => setSelectedService(service)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  transition: 'all var(--transition-fast)',
                }}
                className="service-explore-btn"
              >
                <span>Explore Service Details</span>
                <ArrowRight size={15} color="var(--accent-cyan)" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Modal: Service Comprehensive Details */}
      {selectedService && (
        <div className="modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {renderServiceIcon(selectedService.icon)}
                </div>
                <div>
                  <span className="badge badge-cyan" style={{ marginBottom: '0.35rem' }}>
                    {selectedService.category}
                  </span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{selectedService.title}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="btn-icon"
                style={{ width: '36px', height: '36px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Description */}
            <p style={{ fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.75rem', color: 'var(--text-secondary)' }}>
              {selectedService.description}
            </p>

            {/* Key Capabilities */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--accent-electric)' }}>
                Key Capabilities &amp; Architecture
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.65rem' }}>
                {selectedService.features &&
                  selectedService.features.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <Sparkles size={15} color="var(--accent-cyan)" />
                      <span>{item}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Tangible Deliverables */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--accent-cyan)' }}>
                Tangible Deliverables
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedService.deliverables &&
                  selectedService.deliverables.map((item, idx) => (
                    <span key={idx} className="badge badge-emerald">
                      ✓ {item}
                    </span>
                  ))}
              </div>
            </div>

            {/* Technology Stack Tags */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                Technology Stack
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {selectedService.technologies &&
                  selectedService.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.78rem',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-code)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedService(null)} className="btn btn-secondary">
                Close
              </button>
              <button
                onClick={() => {
                  const sTitle = selectedService.title;
                  setSelectedService(null);
                  onSelectServiceForEnquiry(sTitle);
                }}
                className="btn btn-primary"
              >
                <span>Request This Service</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
