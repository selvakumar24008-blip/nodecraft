import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Shield, ArrowRight } from 'lucide-react';

export default function ContactFormSection({ services, packages, preselectedService }) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    company: '',
    service_required: 'Website Development',
    selected_package: '',
    budget_range: 'Standard',
    project_description: '',
    preferred_contact: 'whatsapp',
    consent: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service_required: preselectedService }));
    }
  }, [preselectedService]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.full_name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      setError('Please provide your valid Phone / WhatsApp number so our team can get in touch.');
      return;
    }
    if (!formData.project_description.trim() || formData.project_description.trim().length < 10) {
      setError('Please provide at least 10 characters describing your project objectives.');
      return;
    }
    if (!formData.consent) {
      setError('Please agree to allow NODE CRAFT to contact you regarding your inquiry.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
          company: formData.company,
          service_required: formData.service_required,
          package: formData.selected_package,
          budget_range: formData.selected_package || 'Standard',
          project_description: formData.project_description,
          preferred_contact: formData.preferred_contact
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setSuccessData(data);
      // Reset form
      setFormData({
        full_name: '',
        phone: '',
        company: '',
        service_required: 'Website Development',
        selected_package: '',
        budget_range: 'Standard',
        project_description: '',
        preferred_contact: 'whatsapp',
        consent: true
      });
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Network error while submitting enquiry. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section" style={{ position: 'relative' }}>
      {/* Background ambient glow */}
      <div
        className="ambient-glow ambient-glow-violet"
        style={{ width: '500px', height: '500px', top: '10%', right: '15%' }}
      />
      <div
        className="ambient-glow ambient-glow-blue"
        style={{ width: '450px', height: '450px', bottom: '10%', left: '10%' }}
      />

      <div className="container" style={{ maxWidth: '960px', position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <span className="section-badge-dot" />
            <span>LET’S COLLABORATE</span>
          </div>
          <h2 className="section-title">
            Let’s Build Something <span className="gradient-text">Great Together</span>
          </h2>
          <p className="section-subtitle">
            Tell us about your product, timeline, and aspirations. Our engineering lead will examine your
            requirements and respond within 24 hours.
          </p>
        </div>

        {/* Success Confirmation Modal / Card */}
        {successData ? (
          <div
            className="glass-card"
            style={{
              padding: '3.5rem 2.5rem',
              textAlign: 'center',
              background: '#FFFFFF',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              boxShadow: 'var(--shadow-xl), 0 10px 40px rgba(16, 185, 129, 0.12)',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                color: 'var(--accent-emerald)',
                border: '2px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Enquiry Recorded Successfully!
            </h3>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 1.75rem auto', lineHeight: 1.7 }}>
              {successData.message}
            </p>

            <div
              style={{
                display: 'inline-block',
                padding: '0.85rem 1.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(37, 99, 235, 0.05)',
                border: '1px solid rgba(37, 99, 235, 0.15)',
                fontFamily: 'var(--font-code)',
                fontSize: '0.95rem',
                color: 'var(--brand-primary)',
                marginBottom: '2rem',
              }}
            >
              Tracking Reference: <strong>{successData.reference_code}</strong>
            </div>

            <div>
              <button onClick={() => setSuccessData(null)} className="btn btn-secondary">
                Submit Another Project Brief
              </button>
            </div>
          </div>
        ) : (
          /* The Form Card */
          <div
            className="glass-card"
            style={{
              padding: '3rem',
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xl), 0 10px 40px rgba(37, 99, 235, 0.08)',
            }}
          >
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#FDA4AF',
                  fontSize: '0.92rem',
                  marginBottom: '2rem',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">
                    Your Name <span style={{ color: 'var(--accent-cyan)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    placeholder="e.g. Alex Henderson"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Phone / WhatsApp (Primary Contact) */}
                <div className="form-group">
                  <label className="form-label">
                    Phone / WhatsApp Number <span style={{ color: 'var(--accent-cyan)' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210 / +1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Company Name */}
                <div className="form-group">
                  <label className="form-label">Company / Startup Name (Optional)</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="e.g. Acme Innovations"
                    value={formData.company}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Service Required */}
                <div className="form-group">
                  <label className="form-label">Service Required</label>
                  <select
                    name="service_required"
                    value={formData.service_required}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {services && services.length > 0 ? (
                      services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Website Development">Website Development</option>
                        <option value="Frontend Development">Frontend Development</option>
                        <option value="Backend Development">Backend Development</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="E-commerce Solutions">E-commerce Solutions</option>
                        <option value="Full-Stack Development">Full-Stack Development</option>
                        <option value="Website Maintenance">Website Maintenance</option>
                        <option value="SEO and Performance">SEO and Performance</option>
                        <option value="Cloud Deployment and Integration">Cloud Deployment and Integration</option>
                        <option value="AI-Powered Web Solutions">AI-Powered Web Solutions</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Select a Package (Optional) */}
                <div className="form-group">
                  <label className="form-label">Select a package (Optional)</label>
                  <select
                    name="selected_package"
                    value={formData.selected_package}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select a package (Optional)</option>
                    {(packages && packages.length > 0
                      ? packages
                      : [
                          { id: 1, name: 'Static Single Page Website', price_label: '₹5,000 + ₹3,000 Server' },
                          { id: 2, name: 'Full-Stack Web App', price_label: '₹12,000 + ₹3,000 Server' },
                          { id: 3, name: 'Portal & Daily Operations Suite', price_label: '₹20,000+' },
                          { id: 4, name: 'Modular Add-ons / Custom Requirements', price_label: 'Custom Quote' },
                        ]
                    ).map((pkg) => (
                      <option
                        key={pkg.id || pkg.name}
                        value={pkg.price_label ? `${pkg.name} (${pkg.price_label})` : pkg.name}
                      >
                        {pkg.name}{pkg.price_label ? ` (${pkg.price_label})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project Description */}
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label">
                  Project Overview &amp; Goals <span style={{ color: 'var(--accent-cyan)' }}>*</span>
                </label>
                <textarea
                  name="project_description"
                  required
                  rows={4}
                  placeholder="Tell us about what you want to build, current pain points, key user flows, and anticipated launch timeline..."
                  value={formData.project_description}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>

              {/* Preferred Contact & Consent */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  margin: '1.5rem 0 2rem 0',
                }}
              >
                {/* Contact preference radio pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Preferred Contact:</span>
                  {['whatsapp', 'phone'].map((method) => (
                    <label
                      key={method}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.82rem',
                        textTransform: 'capitalize',
                        cursor: 'pointer',
                        color: formData.preferred_contact === method ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      }}
                    >
                      <input
                        type="radio"
                        name="preferred_contact"
                        value={method}
                        checked={formData.preferred_contact === method}
                        onChange={handleChange}
                        style={{ accentColor: 'var(--accent-cyan)' }}
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>

                {/* Consent checkbox */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--accent-cyan)' }}
                  />
                  <span>I agree to receive communications regarding this project.</span>
                </label>
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    minWidth: '220px',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="spinner" style={{ animation: 'spinSlow 1s linear infinite' }} />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit Project Brief</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
