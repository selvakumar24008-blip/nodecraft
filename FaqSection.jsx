import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle, Sparkles } from 'lucide-react';

export default function FaqSection({ faqs }) {
  const [openId, setOpenId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultFaqs = [
    {
      id: 1,
      question: 'What types of websites do you develop?',
      answer: 'We engineer high-performance business portals, bespoke corporate web applications, interactive design portfolios, headless e-commerce storefronts, educational platforms, and AI-augmented web tools. Every project is custom-crafted to your specific goals without generic themes.'
    },
    {
      id: 2,
      question: 'How does the development process work?',
      answer: 'Our 7-phase methodology ensures transparency and velocity: Discovery & Requirements, Research & Planning, UI/UX Design Prototyping, Frontend & Backend Development, Testing & QA, Production Launch, and Ongoing Maintenance. You receive regular staging updates and direct engineer communication.'
    },
    {
      id: 3,
      question: 'How long does a typical project take?',
      answer: 'Timelines vary based on technical scope and integrations. A focused landing page or corporate website typically takes 2 to 4 weeks, while a complex custom web application, e-commerce platform, or AI integration typically ranges from 6 to 12 weeks. We establish clear milestone dates during the Discovery phase.'
    },
    {
      id: 4,
      question: 'What information do you need to start a project?',
      answer: 'To initiate a project, we begin with your core objectives, target user personas, any existing brand guidelines or design inspirations, desired technical integrations (e.g. payment gateways, CRMs, authentication), and your projected launch timeline and budget range.'
    },
    {
      id: 5,
      question: 'Do you develop custom web applications?',
      answer: 'Yes! Custom web applications are our specialty. We build scalable single-page and multi-page web applications with real-time websocket synchronization, role-based access control, complex data visualization dashboards, and resilient cloud architectures.'
    },
    {
      id: 6,
      question: 'Can you redesign an existing website?',
      answer: 'Absolutely. We specialize in modernizing legacy web applications: upgrading visual design to modern glassmorphic aesthetics, rewriting frontend code for Core Web Vitals speed, refactoring database backends, and ensuring zero downtime during data migration.'
    },
    {
      id: 7,
      question: 'Do you provide hosting and deployment?',
      answer: 'Yes, we handle complete end-to-end cloud provisioning. We configure production hosting on AWS, Vercel, Google Cloud, or your preferred infrastructure, complete with automated CI/CD deployment pipelines, SSL encryption, custom domain DNS, and global CDN caching.'
    },
    {
      id: 8,
      question: 'Do you offer website maintenance?',
      answer: 'Yes, we provide continuous SLA maintenance retainers that include 24/7 uptime monitoring, automated offsite database backups, security dependency patches, performance optimization audits, and dedicated priority developer hours for feature updates.'
    },
    {
      id: 9,
      question: 'Can you integrate payment gateways?',
      answer: 'Yes. We integrate secure, PCI-compliant payment gateways including Stripe, PayPal, Razorpay, Apple Pay, Google Pay, and bespoke invoicing processors, complete with automated webhook verification and recurring subscription billing workflows.'
    },
    {
      id: 10,
      question: 'How can I request a quotation?',
      answer: 'Simply fill out the project enquiry form in our Get In Touch section below with your project details and requirements. Our engineering lead will review your scope and provide a tailored technical proposal and quotation within 24 to 48 hours.'
    }
  ];

  const faqList = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  const filteredFaqs = faqList.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
  });

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="section" style={{ background: '#F8FAFC' }}>
      {/* Background ambient glow */}
      <div
        className="ambient-glow ambient-glow-blue"
        style={{ width: '450px', height: '450px', top: '15%', left: '10%' }}
      />

      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <span className="section-badge-dot" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="section-title">
            Answers to Common <span className="gradient-text">Inquiries</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to know about partnering with NODE CRAFT on your next digital flagship.
          </p>
        </div>

        {/* Search Filter Bar */}
        <div
          style={{
            position: 'relative',
            marginBottom: '2.5rem',
            maxWidth: '600px',
            margin: '0 auto 2.5rem auto',
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search questions (e.g. process, payment, timeline)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '46px', borderRadius: 'var(--radius-full)' }}
          />
        </div>

        {/* Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredFaqs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No matching questions found for "{searchQuery}".
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="glass-card"
                  style={{
                    padding: 0,
                    borderRadius: 'var(--radius-md)',
                    borderColor: isOpen ? 'rgba(96, 165, 250, 0.4)' : 'var(--border-subtle)',
                    transition: 'border-color var(--transition-fast)',
                  }}
                >
                  {/* Header / Question button */}
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.4rem 1.75rem',
                      textAlign: 'left',
                      background: 'none',
                      color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <HelpCircle
                        size={19}
                        color={isOpen ? 'var(--accent-cyan)' : 'var(--text-muted)'}
                        style={{ flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontSize: '1.08rem',
                          fontWeight: 600,
                          color: isOpen ? '#FFFFFF' : 'var(--text-primary)',
                          fontFamily: 'var(--font-heading)',
                        }}
                      >
                        {faq.question}
                      </span>
                    </div>

                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isOpen ? 'rgba(96, 165, 250, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isOpen ? 'var(--accent-cyan)' : 'var(--text-muted)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s var(--ease-spring), background 0.2s ease',
                        flexShrink: 0,
                      }}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  {/* Collapsible Answer */}
                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.75rem 1.5rem 3.5rem',
                        animation: 'fadeIn 0.22s ease-out',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '0.96rem',
                          lineHeight: 1.75,
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
