import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WhoWeAreSection from './components/WhoWeAreSection';
import ServicesSection from './components/ServicesSection';
import ProcessSection from './components/ProcessSection';
import TeamSection from './components/TeamSection';
import ProjectsSection from './components/ProjectsSection';
import ReviewsSection from './components/ReviewsSection';
import ContactInfoSection from './components/ContactInfoSection';
import FaqSection from './components/FaqSection';
import ContactFormSection from './components/ContactFormSection';
import Footer from './components/Footer';
import AdminDashboardModal from './components/AdminDashboardModal';
import Toast from './components/Toast';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [preselectedService, setPreselectedService] = useState(null);

  // Content state loaded from backend API
  const [heroContent, setHeroContent] = useState(null);
  const [aboutContent, setAboutContent] = useState(null);
  const [services, setServices] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [contactSettings, setContactSettings] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [packages, setPackages] = useState([]);

  const fetchPublicContent = async () => {
    try {
      const [hRes, aRes, sRes, pRes, tRes, prjRes, rRes, cRes, fRes, pkgRes] = await Promise.all([
        fetch('/api/content/hero').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('/api/content/about').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('/api/services').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('/api/process').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('/api/team').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('/api/projects').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('/api/reviews').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('/api/contact-settings').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('/api/faqs').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('/api/packages').then((r) => (r.ok ? r.json() : [])).catch(() => [])
      ]);

      if (hRes) setHeroContent(hRes);
      if (aRes) setAboutContent(aRes);
      if (sRes) setServices(sRes);
      if (pRes) setProcessSteps(pRes);
      if (tRes) setTeam(tRes);
      if (prjRes) setProjects(prjRes);
      if (rRes) setReviews(rRes);
      if (cRes) setContactSettings(cRes);
      if (fRes) setFaqs(fRes);
      if (pkgRes) setPackages(pkgRes);
    } catch (e) {
      console.warn('Backend content fetch notice:', e);
    }
  };

  useEffect(() => {
    fetchPublicContent();

    // Secret Admin Shortcut Listeners (Hidden from public view)
    // 1. Shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminOpen(true);
        showToast('🔓 Admin Portal Unlocked (Ctrl+Shift+A)');
      }
    };

    // 2. Secret Hash: /#admin
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setAdminOpen(true);
        showToast('🔓 Admin Portal Unlocked');
      }
    };
    checkHash();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkHash);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartProject = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreWork = () => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectServiceForEnquiry = (serviceTitle) => {
    setPreselectedService(serviceTitle);
    handleStartProject();
    showToast(`Selected "${serviceTitle}" for your project brief`);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* 1. Animated Signature Loading Screen */}
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {/* 2. Navigation Header */}
      <Navbar
        onOpenAdmin={() => setAdminOpen(true)}
        onStartProject={handleStartProject}
      />

      {/* 3. SECTION 1: HERO — FIRST IMPRESSION */}
      <HeroSection
        content={heroContent}
        onStartProject={handleStartProject}
        onExploreWork={handleExploreWork}
      />

      {/* 4. SECTION 2: WHO WE ARE */}
      <WhoWeAreSection content={aboutContent} />

      {/* 5. SECTION 3: OUR SERVICES (All 10 Categories) */}
      <ServicesSection
        services={services}
        onSelectServiceForEnquiry={handleSelectServiceForEnquiry}
      />

      {/* 6. SECTION 4: OUR DEVELOPMENT PROCESS (7-Stage Timeline) */}
      <ProcessSection steps={processSteps} />

      {/* 7. SECTION 5: OUR TEAM */}
      <TeamSection team={team} />

      {/* 8. SECTION 6: SAMPLE PROJECTS / OUR WORK */}
      <ProjectsSection projects={projects} />

      {/* 9. SECTION 7: CLIENT REVIEWS */}
      <ReviewsSection reviews={reviews} />

      {/* 10. SECTION 8: CONTACT INFORMATION */}
      <ContactInfoSection
        settings={contactSettings}
        onCopyToast={(msg) => showToast(msg)}
      />

      {/* 11. SECTION 9: FAQ ACCORDION */}
      <FaqSection faqs={faqs} />

      {/* 12. SECTION 10: GET IN TOUCH (Functional Project Brief) */}
      <ContactFormSection
        services={services}
        packages={packages}
        preselectedService={preselectedService}
      />

      {/* 13. SECTION 11: FOOTER */}
      <Footer onOpenAdmin={() => setAdminOpen(true)} />

      {/* 14. ADMIN DASHBOARD MODAL */}
      <AdminDashboardModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        packages={packages}
        onContentUpdated={fetchPublicContent}
        onShowToast={showToast}
      />

      {/* 15. Global Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
