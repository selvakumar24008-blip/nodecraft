import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle, Play, Pause } from 'lucide-react';

export default function ReviewsSection({ reviews }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const defaultReviews = [
    {
      id: 1,
      reviewer_name: 'David Sterling',
      reviewer_role: 'VP of Technology',
      company: 'Vortex Global Logistics',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      rating: 5,
      review_text: 'NODE CRAFT completely transformed our international freight infrastructure. Their team combined deep backend architecture with an interface so sleek our clients actually enjoy tracking shipments. Uptime has been flawless.',
      related_project: 'Vortex Global Logistics'
    },
    {
      id: 2,
      reviewer_name: 'Camilla Moreau',
      reviewer_role: 'Founder & Creative Director',
      company: 'Aura Atelier Ltd.',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      rating: 5,
      review_text: 'The attention to visual detail, glassmorphic polish, and lightning-fast checkout NODE CRAFT delivered catapulted our sales by 34% in the very first month. They are true digital craftsmen.',
      related_project: 'Aura Luxury Minimalist Commerce'
    },
    {
      id: 3,
      reviewer_name: 'Jonathan Kester',
      reviewer_role: 'Chief Product Officer',
      company: 'Stratum Technologies',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      rating: 5,
      review_text: 'Working with NODE CRAFT felt like having a powerhouse team of Silicon Valley staff engineers embedded in our office. They shipped on schedule, documented everything, and provided exceptional post-launch support.',
      related_project: 'Stratum Workflow Orchestrator'
    },
    {
      id: 4,
      reviewer_name: 'Dr. Evelyn Reed',
      reviewer_role: 'Director of AI Systems',
      company: 'Synapse Enterprise AI',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      rating: 5,
      review_text: 'Their mastery of vector search pipelines and clean web interfaces allowed us to deploy our enterprise LLM tool in half the expected time. Highly recommended for any serious startup.',
      related_project: 'Synapse Cognitive Search & Copilot'
    }
  ];

  const reviewList = reviews && reviews.length > 0 ? reviews : defaultReviews;
  const AUTOPLAY_INTERVAL = 5500; // 5.5 seconds per slide

  // Transition Helper with quick crossfade
  const changeReview = (newIndex) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimerKey((prev) => prev + 1);
      setAnimating(false);
    }, 180);
  };

  const nextReview = () => {
    changeReview((currentIndex + 1) % reviewList.length);
  };

  const prevReview = () => {
    changeReview((currentIndex - 1 + reviewList.length) % reviewList.length);
  };

  // Automated Carousel Timer Effect
  useEffect(() => {
    if (!isAutoPlaying || isHovered || reviewList.length <= 1) return;

    const timer = setInterval(() => {
      changeReview((currentIndex + 1) % reviewList.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, reviewList.length, currentIndex]);

  // Touch Swipe handlers for mobile devices
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    const touchEnd = e.targetTouches[0].clientX;
    if (touchStart - touchEnd > 75) {
      nextReview();
      setTouchStart(null);
    } else if (touchEnd - touchStart > 75) {
      prevReview();
      setTouchStart(null);
    }
  };

  const current = reviewList[currentIndex];

  return (
    <section id="reviews" className="section" style={{ background: '#F8FAFC' }}>
      {/* Background ambient glow */}
      <div
        className="ambient-glow ambient-glow-cyan"
        style={{ width: '450px', height: '450px', top: '25%', right: '10%' }}
      />

      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <span className="section-badge-dot" />
            <span>CLIENT EXPERIENCES</span>
          </div>
          <h2 className="section-title">
            Trusted by Ambitious <span className="gradient-text">Startups &amp; Leaders</span>
          </h2>
          <p className="section-subtitle">
            Read what visionary founders, CTOs, and product directors say about partnering with NODE CRAFT.
          </p>
          <div style={{ marginTop: '0.65rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            [Sample Client Reviews • Verified &amp; Editable in Admin Console]
          </div>
        </div>

        {/* Testimonials Carousel Container */}
        <div
          style={{ maxWidth: '840px', margin: '0 auto' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Testimonial Card */}
          <div
            className="glass-card"
            style={{
              padding: '3.25rem 2.5rem',
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xl), 0 10px 40px rgba(37, 99, 235, 0.08)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '340px',
              justifyContent: 'space-between',
              overflow: 'hidden',
              transition: 'border-color 0.3s ease',
            }}
          >
            {/* Automated Progress Bar along Top Border */}
            {isAutoPlaying && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'rgba(255, 255, 255, 0.08)',
                }}
              >
                <div
                  key={timerKey}
                  style={{
                    height: '100%',
                    background: 'var(--gradient-accent)',
                    boxShadow: '0 0 10px var(--accent-cyan)',
                    animation: isHovered
                      ? 'none'
                      : `reviewProgressBar ${AUTOPLAY_INTERVAL}ms linear forwards`,
                    width: isHovered ? '100%' : '0%',
                    opacity: isHovered ? 0.6 : 1,
                  }}
                />
              </div>
            )}

            {/* Giant Background Quote Watermark */}
            <Quote
              size={90}
              style={{
                position: 'absolute',
                top: '20px',
                right: '30px',
                color: 'rgba(255, 255, 255, 0.04)',
                pointerEvents: 'none',
              }}
            />

            {/* Animated Slide Content */}
            <div
              style={{
                opacity: animating ? 0 : 1,
                transform: animating ? 'translateY(6px)' : 'translateY(0)',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
            >
              {/* Star Rating Row & Verified Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={19}
                      fill={i < current.rating ? '#FBBF24' : 'none'}
                      color={i < current.rating ? '#FBBF24' : 'rgba(255,255,255,0.2)'}
                    />
                  ))}
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontWeight: 600 }}>
                    5.0 Verified Experience
                  </span>
                </div>

                {/* Hover pause indicator badge */}
                {isHovered && (
                  <span
                    className="badge badge-blue"
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}
                  >
                    ❚❚ Paused on Hover
                  </span>
                )}
              </div>

              {/* Review Text */}
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.15rem, 2.2vw, 1.4rem)',
                  lineHeight: 1.7,
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  marginBottom: '2rem',
                  fontStyle: 'italic',
                }}
              >
                "{current.review_text}"
              </p>
            </div>

            {/* Reviewer Details & Project Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                opacity: animating ? 0 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={current.avatar_url}
                  alt={current.reviewer_name}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--accent-cyan)',
                    boxShadow: '0 0 12px rgba(103, 232, 249, 0.3)',
                  }}
                />
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {current.reviewer_name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {current.reviewer_role} • <span style={{ color: 'var(--accent-electric)' }}>{current.company}</span>
                  </div>
                </div>
              </div>

              {current.related_project && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} color="var(--accent-emerald)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Engagement: {current.related_project}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Carousel Navigation Controls, Autoplay Toggle & Indicator Dots */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '2rem',
              padding: '0 0.5rem',
            }}
          >
            {/* Prev Button */}
            <button onClick={prevReview} className="btn-icon" aria-label="Previous Testimonial">
              <ChevronLeft size={20} />
            </button>

            {/* Center Controls: Dots & Play/Pause Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Dots */}
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                {reviewList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => changeReview(idx)}
                    style={{
                      width: idx === currentIndex ? '32px' : '10px',
                      height: '10px',
                      borderRadius: 'var(--radius-full)',
                      background: idx === currentIndex ? 'var(--gradient-accent)' : 'rgba(255, 255, 255, 0.2)',
                      boxShadow: idx === currentIndex ? '0 0 10px var(--accent-cyan)' : 'none',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Play / Pause Autoplay Toggle */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="btn-icon"
                style={{ width: '32px', height: '32px' }}
                title={isAutoPlaying ? 'Pause Automated Rotation' : 'Resume Automated Rotation'}
                aria-label={isAutoPlaying ? 'Pause Automated Rotation' : 'Resume Automated Rotation'}
              >
                {isAutoPlaying ? (
                  <Pause size={14} color="var(--accent-cyan)" />
                ) : (
                  <Play size={14} color="var(--accent-electric)" style={{ marginLeft: '1px' }} />
                )}
              </button>
            </div>

            {/* Next Button */}
            <button onClick={nextReview} className="btn-icon" aria-label="Next Testimonial">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar Keyframe CSS */}
      <style>{`
        @keyframes reviewProgressBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
}
