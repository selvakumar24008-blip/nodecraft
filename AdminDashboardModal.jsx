import React, { useState, useEffect } from 'react';
import {
  X, Lock, LogOut, Check, Trash2, Edit3, Plus, RefreshCw,
  Mail, Users, FolderGit2, Star, HelpCircle, Settings, Layout,
  Layers, ChevronRight, Eye, EyeOff, AlertCircle, Sparkles, Send, FileText
} from 'lucide-react';
import ImageUploader from './ImageUploader';

export default function AdminDashboardModal({
  isOpen,
  onClose,
  onContentUpdated,
  onShowToast
}) {
  const [authToken, setAuthToken] = useState(localStorage.getItem('nodecraft_admin_token') || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, enquiries, services, projects, team, reviews, process, faqs, settings

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@nodecraft.io');
  const [loginPassword, setLoginPassword] = useState('NodeCraft@2026!');
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Data states
  const [stats, setStats] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [services, setServices] = useState([]);
  const [packagesList, setPackagesList] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [contactSettings, setContactSettings] = useState({});
  const [heroContent, setHeroContent] = useState({});
  const [aboutContent, setAboutContent] = useState({});
  const [processSteps, setProcessSteps] = useState([]);

  // Sub-modal or editing states
  const [editingItem, setEditingItem] = useState(null); // { type, data }
  const [viewingEnquiry, setViewingEnquiry] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type, id, name }

  // Check auth session
  useEffect(() => {
    if (authToken) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.authenticated && res.user) {
            setCurrentUser(res.user);
            loadAllAdminData();
          } else {
            handleLogout();
          }
        })
        .catch(() => handleLogout());
    }
  }, [authToken]);

  const loadAllAdminData = async () => {
    const headers = { Authorization: `Bearer ${authToken}` };
    try {
      const [sRes, eRes, servRes, pRes, tRes, rRes, fRes, cRes, hRes, aRes, procRes, pkgRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }).then((r) => r.json()),
        fetch('/api/admin/enquiries', { headers }).then((r) => r.json()),
        fetch('/api/services?admin=true').then((r) => r.json()),
        fetch('/api/projects?admin=true').then((r) => r.json()),
        fetch('/api/team?admin=true').then((r) => r.json()),
        fetch('/api/reviews?admin=true').then((r) => r.json()),
        fetch('/api/faqs?admin=true').then((r) => r.json()),
        fetch('/api/contact-settings').then((r) => r.json()),
        fetch('/api/content/hero').then((r) => r.json()),
        fetch('/api/content/about').then((r) => r.json()),
        fetch('/api/process').then((r) => r.json()),
        fetch('/api/packages?admin=true').then((r) => r.json())
      ]);

      setStats(sRes);
      setEnquiries(eRes);
      setServices(servRes);
      setProjects(pRes);
      setTeam(tRes);
      setReviews(rRes);
      setFaqs(fRes);
      setContactSettings(cRes);
      setHeroContent(hRes);
      setAboutContent(aRes);
      setProcessSteps(procRes);
      setPackagesList(pkgRes);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('nodecraft_admin_token', data.token);
      setAuthToken(data.token);
      setCurrentUser(data.user);
      onShowToast('Welcome back, Administrator!');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nodecraft_admin_token');
    setAuthToken(null);
    setCurrentUser(null);
    onShowToast('Logged out of Admin Portal');
  };

  // Generic Save / Update Handler
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    const { type, data, isNew } = editingItem;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    };

    let url = '';
    let method = isNew ? 'POST' : 'PUT';

    switch (type) {
      case 'package':
        url = isNew ? '/api/admin/packages' : `/api/admin/packages/${data.id}`;
        break;
      case 'service':
        url = isNew ? '/api/admin/services' : `/api/admin/services/${data.id}`;
        break;
      case 'project':
        url = isNew ? '/api/admin/projects' : `/api/admin/projects/${data.id}`;
        break;
      case 'team':
        url = isNew ? '/api/admin/team' : `/api/admin/team/${data.id}`;
        break;
      case 'review':
        url = isNew ? '/api/admin/reviews' : `/api/admin/reviews/${data.id}`;
        break;
      case 'faq':
        url = isNew ? '/api/admin/faqs' : `/api/admin/faqs/${data.id}`;
        break;
      case 'process':
        url = isNew ? '/api/admin/process' : `/api/admin/process/${data.id}`;
        break;
      case 'contact':
        url = '/api/admin/contact-settings';
        method = 'PUT';
        break;
      case 'hero':
        url = '/api/admin/content/hero';
        method = 'PUT';
        break;
      case 'about':
        url = '/api/admin/content/about';
        method = 'PUT';
        break;
      default:
        return;
    }

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save changes');
      }

      onShowToast(`${type.toUpperCase()} saved successfully!`);
      setEditingItem(null);
      loadAllAdminData();
      if (onContentUpdated) onContentUpdated();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Action
  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    const headers = { Authorization: `Bearer ${authToken}` };

    let url = '';
    switch (type) {
      case 'package': url = `/api/admin/packages/${id}`; break;
      case 'service': url = `/api/admin/services/${id}`; break;
      case 'project': url = `/api/admin/projects/${id}`; break;
      case 'team': url = `/api/admin/team/${id}`; break;
      case 'review': url = `/api/admin/reviews/${id}`; break;
      case 'faq': url = `/api/admin/faqs/${id}`; break;
      case 'process': url = `/api/admin/process/${id}`; break;
      case 'enquiry': url = `/api/admin/enquiries/${id}`; break;
      default: return;
    }

    try {
      const res = await fetch(url, { method: 'DELETE', headers });
      if (res.ok) {
        onShowToast(`Deleted ${type} item`);
        setDeleteConfirm(null);
        loadAllAdminData();
        if (onContentUpdated) onContentUpdated();
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  // Toggle Status Action (Active / Published)
  const handleToggle = async (type, id) => {
    const headers = { Authorization: `Bearer ${authToken}` };
    let url = '';
    switch (type) {
      case 'package': url = `/api/admin/packages/${id}/toggle`; break;
      case 'service': url = `/api/admin/services/${id}/toggle`; break;
      case 'project': url = `/api/admin/projects/${id}/toggle`; break;
      case 'team': url = `/api/admin/team/${id}/toggle`; break;
      case 'review': url = `/api/admin/reviews/${id}/toggle`; break;
      case 'faq': url = `/api/admin/faqs/${id}/toggle`; break;
      default: return;
    }

    try {
      const res = await fetch(url, { method: 'PATCH', headers });
      if (res.ok) {
        loadAllAdminData();
        if (onContentUpdated) onContentUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Enquiry Status
  const handleUpdateEnquiryStatus = async (id, status) => {
    try {
      await fetch(`/api/admin/enquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });
      loadAllAdminData();
      onShowToast(`Enquiry marked as ${status}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }} onClick={onClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '1100px',
          width: '95%',
          height: '88vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '1.25rem 2rem',
            background: '#FFFFFF',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.65))',
              }}
            >
              <img
                src="/logo-mark.png"
                alt="NODE CRAFT Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800 }}>
                NODE CRAFT <span className="gradient-text">Admin Control Center</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {currentUser ? `Authenticated as ${currentUser.email} (${currentUser.role})` : 'Secured Gateway'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {currentUser && (
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem 0.85rem' }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            )}
            <button onClick={onClose} className="btn-icon" style={{ width: '36px', height: '36px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: Login View vs Tabbed Dashboard View */}
        {!currentUser ? (
          /* LOGIN FORM */
          <div
            style={{
              padding: '3.5rem 2rem',
              maxWidth: '460px',
              margin: 'auto',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(96, 165, 250, 0.12)',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-electric)',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <Lock size={28} />
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Sign In to Management
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Enter your authorized administrator credentials to manage live portfolio content.
            </p>

            {loginError && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#FDA4AF',
                  fontSize: '0.85rem',
                  marginBottom: '1.5rem',
                  textAlign: 'left',
                }}
              >
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
              <div className="form-group">
                <label className="form-label">Admin Email or Username</label>
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="form-input"
                  placeholder="admin@nodecraft.io"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '1.5rem' }}
              >
                {loginLoading ? 'Authenticating...' : 'Enter Dashboard'}
              </button>

              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                }}
              >
                Default Credentials: <code>admin@nodecraft.io</code> / <code>NodeCraft@2026!</code>
              </div>
            </form>
          </div>
        ) : (
          /* TABBED DASHBOARD VIEW */
          <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
            {/* Sidebar Tabs */}
            <div
              style={{
                width: '240px',
                background: '#F8FAFC',
                borderRight: '1px solid var(--border-subtle)',
                padding: '1.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                flexShrink: 0,
                overflowY: 'auto',
              }}
            >
              {[
                { id: 'overview', label: 'Overview', icon: Layout },
                { id: 'enquiries', label: `Inquiries (${enquiries.filter((e) => e.status === 'new').length})`, icon: Mail },
                { id: 'packages', label: `Packages & Pricing (${packagesList.length})`, icon: Sparkles },
                { id: 'services', label: 'Services', icon: Layers },
                { id: 'projects', label: 'Projects', icon: FolderGit2 },
                { id: 'team', label: 'Team', icon: Users },
                { id: 'reviews', label: 'Reviews', icon: Star },
                { id: 'process', label: 'Process Steps', icon: RefreshCw },
                { id: 'faqs', label: 'FAQs', icon: HelpCircle },
                { id: 'settings', label: 'Site Content & Contact', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.95rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                      border: isActive ? '1px solid rgba(37, 99, 235, 0.25)' : '1px solid transparent',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon size={16} color={isActive ? 'var(--brand-primary)' : 'var(--text-muted)'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div style={{ flexGrow: 1, padding: '2rem', overflowY: 'auto', background: '#FFFFFF' }}>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                    System Status &amp; Realtime Metrics
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '1.25rem',
                      marginBottom: '2.5rem',
                    }}
                  >
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        New Inquiries
                      </div>
                      <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                        {stats?.newEnquiries ?? 0}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Total Leads: {stats?.totalEnquiries ?? 0}
                      </div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Active Services
                      </div>
                      <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-electric)' }}>
                        {stats?.totalServices ?? 10}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Categories Online</div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Live Projects
                      </div>
                      <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                        {stats?.publishedProjects ?? 0}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Total in DB: {stats?.totalProjects ?? 0}
                      </div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Team Members
                      </div>
                      <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-violet)' }}>
                        {stats?.totalTeam ?? 4}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Profiles Published</div>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Recent Inbound Leads
                  </h4>
                  {enquiries.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      No project enquiries submitted yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {enquiries.slice(0, 4).map((enq) => (
                        <div
                          key={enq.id}
                          className="glass-card"
                          style={{
                            padding: '1rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700 }}>{enq.full_name} ({enq.company || 'Private'})</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {enq.service_required} • {enq.budget_range} • {new Date(enq.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <span className={`badge ${enq.status === 'new' ? 'badge-cyan' : 'badge-emerald'}`}>
                            {enq.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ENQUIRIES INBOX */}
              {activeTab === 'enquiries' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Project Enquiries Inbox</h3>
                    <span className="badge badge-blue">{enquiries.length} Inbound Inquiries</span>
                  </div>

                  {enquiries.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      Your inbox is empty. Test the public contact form to see leads populate here.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {enquiries.map((enq) => (
                        <div
                          key={enq.id}
                          className="glass-card"
                          style={{
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.85rem',
                            borderColor: enq.status === 'new' ? 'rgba(103, 232, 249, 0.4)' : 'var(--border-subtle)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{enq.full_name}</span>
                                <span className="badge badge-blue">{enq.reference_code}</span>
                                {enq.status === 'new' && <span className="badge badge-cyan">NEW</span>}
                              </div>
                              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                                {enq.phone && (
                                  <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
                                    📞 Phone/WhatsApp: {enq.phone}
                                  </span>
                                )}
                                {enq.package && (
                                  <span className="badge badge-cyan" style={{ fontSize: '0.78rem' }}>
                                    📦 {enq.package}
                                  </span>
                                )}
                                {enq.email && !enq.email.startsWith('phone:') && (
                                  <span>Email: {enq.email}</span>
                                )}
                                {enq.company && <span>Company: {enq.company}</span>}
                              </div>
                            </div>

                            {/* Status dropdown & Delete */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <select
                                value={enq.status}
                                onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                                className="form-select"
                                style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', width: 'auto' }}
                              >
                                <option value="new">New</option>
                                <option value="in_review">In Review</option>
                                <option value="contacted">Contacted</option>
                                <option value="completed">Completed</option>
                                <option value="archived">Archived</option>
                              </select>

                              <button
                                onClick={() => setDeleteConfirm({ type: 'enquiry', id: enq.id, name: enq.reference_code })}
                                className="btn-icon"
                                style={{ width: '32px', height: '32px', color: '#F43F5E' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <div
                            style={{
                              padding: '1rem',
                              background: 'rgba(255, 255, 255, 0.03)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.92rem',
                              lineHeight: 1.6,
                            }}
                          >
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                              Requested: <strong>{enq.service_required}</strong> ({enq.budget_range}) • Preferred:{' '}
                              <strong>{enq.preferred_contact}</strong>
                            </div>
                            {enq.project_description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: PACKAGES & PRICING */}
              {activeTab === 'packages' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage Packages &amp; Pricing ({packagesList.length})</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Configure client packages, setup costs, server fees, and descriptions. All details can be edited live by admin.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingItem({
                          type: 'package',
                          isNew: true,
                          data: {
                            name: '',
                            price_label: '',
                            description: '',
                            badge: 'Custom',
                            display_order: packagesList.length + 1
                          }
                        })
                      }
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={15} />
                      <span>Add Package</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {packagesList.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="glass-card"
                        style={{
                          padding: '1.25rem 1.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1.5rem',
                          opacity: pkg.is_active ? 1 : 0.6,
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{pkg.name}</span>
                            <span className="badge badge-cyan" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                              {pkg.price_label}
                            </span>
                            {pkg.badge && <span className="badge badge-blue">{pkg.badge}</span>}
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order: #{pkg.display_order}</span>
                          </div>
                          {pkg.description && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                              {pkg.description}
                            </p>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <button
                            onClick={() => handleToggle('package', pkg.id)}
                            className="btn-icon"
                            title={pkg.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {pkg.is_active ? <Eye size={15} color="var(--accent-emerald)" /> : <EyeOff size={15} />}
                          </button>
                          <button
                            onClick={() => setEditingItem({ type: 'package', isNew: false, data: pkg })}
                            className="btn-icon"
                            title="Edit Package Details"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'package', id: pkg.id, name: pkg.name })}
                            className="btn-icon"
                            style={{ color: '#F43F5E' }}
                            title="Delete Package"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SERVICES */}
              {activeTab === 'services' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage Services ({services.length})</h3>
                    <button
                      onClick={() =>
                        setEditingItem({
                          type: 'service',
                          isNew: true,
                          data: {
                            title: '',
                            slug: '',
                            category: 'Core Development',
                            icon: 'Globe',
                            summary: '',
                            description: '',
                            features: ['Feature 1', 'Feature 2'],
                            deliverables: ['Deliverable 1'],
                            technologies: ['React', 'Node.js'],
                            display_order: services.length + 1
                          }
                        })
                      }
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={15} />
                      <span>Add Service</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {services.map((s) => (
                      <div
                        key={s.id}
                        className="glass-card"
                        style={{
                          padding: '1.25rem 1.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          opacity: s.is_active ? 1 : 0.6,
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{s.title}</span>
                            <span className="badge badge-blue">{s.category}</span>
                            <span className="badge badge-cyan">{s.icon}</span>
                            {!s.is_active && <span className="badge badge-violet">INACTIVE</span>}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {s.summary}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <button
                            onClick={() => handleToggle('service', s.id)}
                            className="btn-icon"
                            title={s.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {s.is_active ? <Eye size={15} color="var(--accent-emerald)" /> : <EyeOff size={15} />}
                          </button>
                          <button
                            onClick={() => setEditingItem({ type: 'service', isNew: false, data: s })}
                            className="btn-icon"
                            title="Edit Service"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'service', id: s.id, name: s.title })}
                            className="btn-icon"
                            style={{ color: '#F43F5E' }}
                            title="Delete Service"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PROJECTS */}
              {activeTab === 'projects' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage Projects ({projects.length})</h3>
                    <button
                      onClick={() =>
                        setEditingItem({
                          type: 'project',
                          isNew: true,
                          data: {
                            title: '',
                            slug: '',
                            category: 'Web Applications',
                            status: 'Production Live',
                            cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
                            summary: '',
                            description: '',
                            technologies: ['React', 'Node.js', 'PostgreSQL'],
                            live_url: '',
                            repo_url: '',
                            client: '',
                            impact_stats: { Metric: '+100%' },
                            featured: 0,
                            display_order: projects.length + 1
                          }
                        })
                      }
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={15} />
                      <span>Add Project</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {projects.map((p) => (
                      <div
                        key={p.id}
                        className="glass-card"
                        style={{
                          padding: '1.25rem 1.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          opacity: p.is_published ? 1 : 0.6,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img
                            src={p.cover_image}
                            alt={p.title}
                            style={{ width: '60px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{p.title}</span>
                              <span className="badge badge-blue">{p.category}</span>
                              <span className="badge badge-emerald">{p.status}</span>
                              {!p.is_published && <span className="badge badge-violet">UNPUBLISHED</span>}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.summary}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <button
                            onClick={() => handleToggle('project', p.id)}
                            className="btn-icon"
                            title={p.is_published ? 'Unpublish' : 'Publish'}
                          >
                            {p.is_published ? <Eye size={15} color="var(--accent-emerald)" /> : <EyeOff size={15} />}
                          </button>
                          <button
                            onClick={() => setEditingItem({ type: 'project', isNew: false, data: p })}
                            className="btn-icon"
                            title="Edit Project"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'project', id: p.id, name: p.title })}
                            className="btn-icon"
                            style={{ color: '#F43F5E' }}
                            title="Delete Project"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: TEAM */}
              {activeTab === 'team' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage Team Members ({team.length})</h3>
                    <button
                      onClick={() =>
                        setEditingItem({
                          type: 'team',
                          isNew: true,
                          data: {
                            name: '',
                            role: '',
                            bio: '',
                            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                            skills: ['Full Stack', 'Architecture'],
                            social_links: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
                            featured_project: '',
                            display_order: team.length + 1
                          }
                        })
                      }
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={15} />
                      <span>Add Member</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {team.map((m) => (
                      <div
                        key={m.id}
                        className="glass-card"
                        style={{
                          padding: '1.25rem 1.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          opacity: m.is_active ? 1 : 0.6,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img
                            src={m.avatar_url}
                            alt={m.name}
                            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{m.name}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>{m.role}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <button
                            onClick={() => handleToggle('team', m.id)}
                            className="btn-icon"
                            title={m.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {m.is_active ? <Eye size={15} color="var(--accent-emerald)" /> : <EyeOff size={15} />}
                          </button>
                          <button
                            onClick={() => setEditingItem({ type: 'team', isNew: false, data: m })}
                            className="btn-icon"
                            title="Edit Team Member"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'team', id: m.id, name: m.name })}
                            className="btn-icon"
                            style={{ color: '#F43F5E' }}
                            title="Delete Member"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: REVIEWS */}
              {activeTab === 'reviews' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage Client Reviews ({reviews.length})</h3>
                    <button
                      onClick={() =>
                        setEditingItem({
                          type: 'review',
                          isNew: true,
                          data: {
                            reviewer_name: '',
                            reviewer_role: '',
                            company: '',
                            avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                            rating: 5,
                            review_text: '',
                            related_project: '',
                            display_order: reviews.length + 1
                          }
                        })
                      }
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={15} />
                      <span>Add Review</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {reviews.map((r) => (
                      <div
                        key={r.id}
                        className="glass-card"
                        style={{
                          padding: '1.25rem 1.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          opacity: r.is_published ? 1 : 0.6,
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 700 }}>{r.reviewer_name}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              ({r.reviewer_role}, {r.company})
                            </span>
                            <span className="badge badge-emerald">★ {r.rating} Stars</span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            "{r.review_text.slice(0, 90)}..."
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <button
                            onClick={() => handleToggle('review', r.id)}
                            className="btn-icon"
                            title={r.is_published ? 'Unpublish' : 'Publish'}
                          >
                            {r.is_published ? <Eye size={15} color="var(--accent-emerald)" /> : <EyeOff size={15} />}
                          </button>
                          <button
                            onClick={() => setEditingItem({ type: 'review', isNew: false, data: r })}
                            className="btn-icon"
                            title="Edit Review"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'review', id: r.id, name: r.reviewer_name })}
                            className="btn-icon"
                            style={{ color: '#F43F5E' }}
                            title="Delete Review"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: PROCESS */}
              {activeTab === 'process' && (
                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                    Development Process Lifecycle (7 Stages)
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {processSteps.map((p) => (
                      <div
                        key={p.id}
                        className="glass-card"
                        style={{
                          padding: '1.25rem 1.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <span className="badge badge-cyan">Step 0{p.step_number}</span>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{p.title}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({p.duration})</span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {p.subtitle}
                          </div>
                        </div>

                        <button
                          onClick={() => setEditingItem({ type: 'process', isNew: false, data: p })}
                          className="btn-icon"
                          title="Edit Stage"
                        >
                          <Edit3 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: FAQS */}
              {activeTab === 'faqs' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage FAQs ({faqs.length})</h3>
                    <button
                      onClick={() =>
                        setEditingItem({
                          type: 'faq',
                          isNew: true,
                          data: {
                            question: '',
                            answer: '',
                            category: 'General',
                            display_order: faqs.length + 1
                          }
                        })
                      }
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={15} />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {faqs.map((f) => (
                      <div
                        key={f.id}
                        className="glass-card"
                        style={{
                          padding: '1.25rem 1.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          opacity: f.is_published ? 1 : 0.6,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{f.question}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            {f.answer.slice(0, 110)}...
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <button
                            onClick={() => handleToggle('faq', f.id)}
                            className="btn-icon"
                            title={f.is_published ? 'Unpublish' : 'Publish'}
                          >
                            {f.is_published ? <Eye size={15} color="var(--accent-emerald)" /> : <EyeOff size={15} />}
                          </button>
                          <button
                            onClick={() => setEditingItem({ type: 'faq', isNew: false, data: f })}
                            className="btn-icon"
                            title="Edit FAQ"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'faq', id: f.id, name: f.question })}
                            className="btn-icon"
                            style={{ color: '#F43F5E' }}
                            title="Delete FAQ"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: SETTINGS & SITE CONTENT */}
              {activeTab === 'settings' && (
                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                    Studio Settings &amp; Homepage Content
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {/* Contact Settings Card */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-cyan)' }}>
                        Contact Channels
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Updates email, phone numbers, WhatsApp, physical address, and community links.
                      </p>
                      <button
                        onClick={() => setEditingItem({ type: 'contact', isNew: false, data: contactSettings })}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit Contact Settings
                      </button>
                    </div>

                    {/* Hero Section Content */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-electric)' }}>
                        Hero Section Content
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Modify hero badge, main headline, secondary tagline, description, and trust stats.
                      </p>
                      <button
                        onClick={() => setEditingItem({ type: 'hero', isNew: false, data: heroContent })}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit Hero Content
                      </button>
                    </div>

                    {/* About Section Content */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-violet)' }}>
                        About Us Narrative
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Update the agency origin story, mission, vision, and core value cards.
                      </p>
                      <button
                        onClick={() => setEditingItem({ type: 'about', isNew: false, data: aboutContent })}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit About Content
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Edit / Add Sub-Modal */}
        {editingItem && (
          <div className="modal-overlay" style={{ zIndex: 1300 }} onClick={() => setEditingItem(null)}>
            <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, textTransform: 'capitalize' }}>
                  {editingItem.isNew ? 'Create New' : 'Edit'} {editingItem.type}
                </h3>
                <button onClick={() => setEditingItem(null)} className="btn-icon">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveItem}>
                {/* PACKAGE FIELDS */}
                {editingItem.type === 'package' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Package Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Static Single Page Website"
                        value={editingItem.data.name || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, name: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price &amp; Server Fee</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₹5,000 + ₹3,000 Server"
                        value={editingItem.data.price_label || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, price_label: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Badge (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Starter, Most Popular, Enterprise"
                        value={editingItem.data.badge || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, badge: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Package Description</label>
                      <textarea
                        rows={3}
                        placeholder="Explain deliverables included in this package tier..."
                        value={editingItem.data.description || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, description: e.target.value }
                          })
                        }
                        className="form-textarea"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Display Order</label>
                      <input
                        type="number"
                        value={editingItem.data.display_order || 0}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, display_order: parseInt(e.target.value) || 0 }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                  </>
                )}

                {/* SERVICE FIELDS */}
                {editingItem.type === 'service' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Service Title</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.title || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, title: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select
                        value={editingItem.data.category || 'Core Development'}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, category: e.target.value }
                          })
                        }
                        className="form-select"
                      >
                        <option value="Core Development">Core Development</option>
                        <option value="Engineering & Data">Engineering & Data</option>
                        <option value="Design & Experience">Design & Experience</option>
                        <option value="Growth & Optimization">Growth & Optimization</option>
                        <option value="Support & Ops">Support & Ops</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Summary</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.summary || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, summary: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Full Description</label>
                      <textarea
                        rows={3}
                        value={editingItem.data.description || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, description: e.target.value }
                          })
                        }
                        className="form-textarea"
                      />
                    </div>
                  </>
                )}

                {/* PROJECT FIELDS */}
                {editingItem.type === 'project' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Project Title</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.title || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, title: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select
                        value={editingItem.data.category || 'Web Applications'}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, category: e.target.value }
                          })
                        }
                        className="form-select"
                      >
                        <option value="Business Websites">Business Websites</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Portfolio Websites">Portfolio Websites</option>
                        <option value="Web Applications">Web Applications</option>
                        <option value="Dashboard Systems">Dashboard Systems</option>
                        <option value="AI-Powered Solutions">AI-Powered Solutions</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <ImageUploader
                        currentUrl={editingItem.data.cover_image}
                        authToken={authToken}
                        defaultPreset="project"
                        label="Project Cover Image (Upload JPG & Resize)"
                        onImageUploaded={(url) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, cover_image: url }
                          })
                        }
                      />
                      <div style={{ marginTop: '0.65rem' }}>
                        <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Or enter Image URL manually:</label>
                        <input
                          type="text"
                          value={editingItem.data.cover_image || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, cover_image: e.target.value }
                            })
                          }
                          className="form-input"
                          style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Summary</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.summary || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, summary: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Live Demo URL (Optional)</label>
                      <input
                        type="text"
                        value={editingItem.data.live_url || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, live_url: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                  </>
                )}

                {/* TEAM MEMBER FIELDS */}
                {editingItem.type === 'team' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.name || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, name: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.role || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, role: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <ImageUploader
                        currentUrl={editingItem.data.avatar_url}
                        authToken={authToken}
                        defaultPreset="avatar"
                        label="Team Member Photo (Upload JPG & Resize)"
                        onImageUploaded={(url) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, avatar_url: url }
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Biography</label>
                      <textarea
                        rows={3}
                        value={editingItem.data.bio || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, bio: e.target.value }
                          })
                        }
                        className="form-textarea"
                      />
                    </div>
                  </>
                )}

                {/* CONTACT SETTINGS FIELDS */}
                {editingItem.type === 'contact' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Business Email</label>
                      <input
                        type="email"
                        required
                        value={editingItem.data.business_email || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, business_email: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Business Phone</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.business_phone || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, business_phone: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">WhatsApp Number</label>
                      <input
                        type="text"
                        value={editingItem.data.whatsapp_number || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, whatsapp_number: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Office Address</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.office_address || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, office_address: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Business Hours</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.business_hours || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, business_hours: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                  </>
                )}

                {/* REVIEW FIELDS */}
                {editingItem.type === 'review' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Reviewer Name</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.reviewer_name || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, reviewer_name: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role & Company</label>
                      <input
                        type="text"
                        value={editingItem.data.company || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, company: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Rating (1 to 5)</label>
                      <select
                        value={editingItem.data.rating || 5}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, rating: Number(e.target.value) }
                          })
                        }
                        className="form-select"
                      >
                        <option value={5}>5 Stars (Excellent)</option>
                        <option value={4}>4 Stars (Very Good)</option>
                        <option value={3}>3 Stars (Average)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Review Text</label>
                      <textarea
                        rows={3}
                        required
                        value={editingItem.data.review_text || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, review_text: e.target.value }
                          })
                        }
                        className="form-textarea"
                      />
                    </div>
                  </>
                )}

                {/* FAQ FIELDS */}
                {editingItem.type === 'faq' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Question</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.question || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, question: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Answer</label>
                      <textarea
                        rows={4}
                        required
                        value={editingItem.data.answer || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, answer: e.target.value }
                          })
                        }
                        className="form-textarea"
                      />
                    </div>
                  </>
                )}

                {/* HERO CONTENT FIELDS */}
                {editingItem.type === 'hero' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Agency Badge</label>
                      <input
                        type="text"
                        value={editingItem.data.badge || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, badge: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Main Headline</label>
                      <input
                        type="text"
                        value={editingItem.data.headline || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, headline: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subheadline (Gradient Highlight)</label>
                      <input
                        type="text"
                        value={editingItem.data.subheadline || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, subheadline: e.target.value }
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Paragraph Text</label>
                      <textarea
                        rows={3}
                        value={editingItem.data.paragraph || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, paragraph: e.target.value }
                          })
                        }
                        className="form-textarea"
                      />
                    </div>
                  </>
                )}

                {/* Modal Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setEditingItem(null)} className="btn btn-secondary btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Alert */}
        {deleteConfirm && (
          <div className="modal-overlay" style={{ zIndex: 1400 }} onClick={() => setDeleteConfirm(null)}>
            <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'rgba(244, 63, 94, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F43F5E',
                  margin: '0 auto 1.25rem auto',
                }}
              >
                <Trash2 size={24} />
              </div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Confirm Deletion
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                Are you sure you want to permanently remove "<strong>{deleteConfirm.name}</strong>"?
                This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button onClick={() => setDeleteConfirm(null)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="btn btn-primary btn-sm"
                  style={{ background: '#F43F5E', borderColor: '#F43F5E' }}
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
