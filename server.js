import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { db, initDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB schema & seeds
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'nodecraft_super_secret_jwt_key_2026_xyz';

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
const uploadsDir = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Serve frontend build if dist exists in production
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Multer storage for secure image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `nodecraft_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only valid image files (PNG, JPG, WEBP, SVG, GIF) are allowed.'));
    }
  }
});

// Auth Verification Middleware
export function verifyAdmin(req, res, next) {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.nodecraft_token) {
    token = req.cookies.nodecraft_token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required' });
    }

    const user = db.prepare(`
      SELECT * FROM users WHERE username = ? OR email = ?
    `).get(usernameOrEmail.trim(), usernameOrEmail.trim().toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('nodecraft_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Verify Current User
app.get('/api/auth/me', (req, res) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.nodecraft_token) {
    token = req.cookies.nodecraft_token;
  }

  if (!token) {
    return res.json({ authenticated: false, user: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, username, email, role FROM users WHERE id = ?').get(decoded.id);
    if (!user) {
      return res.json({ authenticated: false, user: null });
    }
    return res.json({ authenticated: true, user });
  } catch (e) {
    return res.json({ authenticated: false, user: null });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('nodecraft_token');
  return res.json({ success: true, message: 'Logged out successfully' });
});

// Change Password
app.put('/api/auth/change-password', verifyAdmin, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = bcrypt.compareSync(currentPassword, user.password_hash);
    if (!isValid) return res.status(400).json({ error: 'Current password incorrect' });

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, req.user.id);

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    return res.status(500).json({ error: 'Failed to update password' });
  }
});

// ==========================================
// 2. PUBLIC CONTENT ENDPOINTS
// ==========================================

// Hero Content
app.get('/api/content/hero', (req, res) => {
  const row = db.prepare('SELECT value FROM site_content WHERE key = ?').get('hero');
  res.json(row ? JSON.parse(row.value) : {});
});

// About Content
app.get('/api/content/about', (req, res) => {
  const row = db.prepare('SELECT value FROM site_content WHERE key = ?').get('about');
  res.json(row ? JSON.parse(row.value) : {});
});

// Services (Public gets active; Admin gets all)
app.get('/api/services', (req, res) => {
  const isAdmin = req.query.admin === 'true';
  const query = isAdmin
    ? 'SELECT * FROM services ORDER BY display_order ASC, id ASC'
    : 'SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC, id ASC';
  const rows = db.prepare(query).all();
  const parsed = rows.map(r => ({
    ...r,
    features: JSON.parse(r.features || '[]'),
    deliverables: JSON.parse(r.deliverables || '[]'),
    technologies: JSON.parse(r.technologies || '[]')
  }));
  res.json(parsed);
});

// Process Steps
app.get('/api/process', (req, res) => {
  const rows = db.prepare('SELECT * FROM process_steps ORDER BY step_number ASC').all();
  const parsed = rows.map(r => ({
    ...r,
    deliverables: JSON.parse(r.deliverables || '[]')
  }));
  res.json(parsed);
});

// Team Members (Public gets active; Admin gets all)
app.get('/api/team', (req, res) => {
  const isAdmin = req.query.admin === 'true';
  const query = isAdmin
    ? 'SELECT * FROM team_members ORDER BY display_order ASC, id ASC'
    : 'SELECT * FROM team_members WHERE is_active = 1 ORDER BY display_order ASC, id ASC';
  const rows = db.prepare(query).all();
  const parsed = rows.map(r => ({
    ...r,
    skills: JSON.parse(r.skills || '[]'),
    social_links: JSON.parse(r.social_links || '{}')
  }));
  res.json(parsed);
});

// Projects (Public gets published; Admin gets all)
app.get('/api/projects', (req, res) => {
  const isAdmin = req.query.admin === 'true';
  const query = isAdmin
    ? 'SELECT * FROM projects ORDER BY display_order ASC, id ASC'
    : 'SELECT * FROM projects WHERE is_published = 1 ORDER BY display_order ASC, id ASC';
  const rows = db.prepare(query).all();
  const parsed = rows.map(r => ({
    ...r,
    technologies: JSON.parse(r.technologies || '[]'),
    impact_stats: JSON.parse(r.impact_stats || '{}')
  }));
  res.json(parsed);
});

// Reviews (Public gets published; Admin gets all)
app.get('/api/reviews', (req, res) => {
  const isAdmin = req.query.admin === 'true';
  const query = isAdmin
    ? 'SELECT * FROM reviews ORDER BY display_order ASC, id ASC'
    : 'SELECT * FROM reviews WHERE is_published = 1 ORDER BY display_order ASC, id ASC';
  const rows = db.prepare(query).all();
  res.json(rows);
});

// Contact Settings
app.get('/api/contact-settings', (req, res) => {
  const row = db.prepare('SELECT * FROM contact_settings WHERE id = 1').get();
  res.json(row || {});
});

// FAQs
app.get('/api/faqs', (req, res) => {
  const isAdmin = req.query.admin === 'true';
  const query = isAdmin
    ? 'SELECT * FROM faqs ORDER BY display_order ASC, id ASC'
    : 'SELECT * FROM faqs WHERE is_published = 1 ORDER BY display_order ASC, id ASC';
  const rows = db.prepare(query).all();
  res.json(rows);
});

// Packages (Public gets active; Admin gets all)
app.get('/api/packages', (req, res) => {
  const isAdmin = req.query.admin === 'true';
  const query = isAdmin
    ? 'SELECT * FROM packages ORDER BY display_order ASC, id ASC'
    : 'SELECT * FROM packages WHERE is_active = 1 ORDER BY display_order ASC, id ASC';
  const rows = db.prepare(query).all();
  res.json(rows);
});

// Public Project Enquiry Submission
app.post('/api/enquiries', (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      company,
      service_required,
      budget_range,
      package: selectedPackage,
      project_description,
      preferred_contact
    } = req.body;

    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    // With email section removed, require phone or valid email
    if (!phone && (!email || !email.trim())) {
      return res.status(400).json({ error: 'Please provide your Phone / WhatsApp number so our team can reach you.' });
    }
    if (!project_description || project_description.trim().length < 10) {
      return res.status(400).json({ error: 'Please provide at least 10 characters describing your project' });
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const reference_code = `NC-${dateStr}-${randPart}`;

    const stmt = db.prepare(`
      INSERT INTO enquiries (
        reference_code, full_name, email, phone, company,
        service_required, budget_range, package, project_description, preferred_contact
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      reference_code,
      full_name.trim(),
      email && email.trim() ? email.trim().toLowerCase() : (phone ? `phone:${phone.trim()}` : 'N/A'),
      phone ? phone.trim() : null,
      company ? company.trim() : null,
      service_required || 'Custom Web Application',
      budget_range || 'Flexible',
      selectedPackage || null,
      project_description.trim(),
      preferred_contact || 'whatsapp'
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your project enquiry has been submitted. Our engineering lead will respond promptly on Phone/WhatsApp.',
      reference_code
    });
  } catch (err) {
    console.error('Enquiry submission error:', err);
    return res.status(500).json({ error: 'Failed to record project enquiry. Please try again or contact us directly.' });
  }
});

// ==========================================
// 3. ADMIN MANAGEMENT ROUTES (PROTECTED)
// ==========================================

// Image Upload with Automatic Resize and JPG Conversion
app.post('/api/admin/upload', verifyAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  try {
    const width = req.body.width ? parseInt(req.body.width, 10) : null;
    const height = req.body.height ? parseInt(req.body.height, 10) : null;
    const quality = req.body.quality ? parseInt(req.body.quality, 10) : 90;

    const originalPath = req.file.path;
    const jpgFilename = `nodecraft_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
    const jpgPath = path.join(uploadsDir, jpgFilename);

    let transformer = sharp(originalPath);
    if (width || height) {
      transformer = transformer.resize(width || null, height || null, { fit: 'cover', position: 'center' });
    }

    // Force JPG output format as required
    await transformer
      .jpeg({ quality: Math.min(100, Math.max(30, quality)), mozjpeg: true })
      .toFile(jpgPath);

    // Clean up temporary original upload if different
    if (originalPath !== jpgPath && fs.existsSync(originalPath)) {
      try { fs.unlinkSync(originalPath); } catch (e) {}
    }

    const fileUrl = `/uploads/${jpgFilename}`;
    return res.json({
      success: true,
      url: fileUrl,
      filename: jpgFilename,
      format: 'jpg',
      width: width || 'auto',
      height: height || 'auto'
    });
  } catch (err) {
    console.error('Image processing error:', err);
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({ success: true, url: fileUrl });
  }
});

// Update Hero Content
app.put('/api/admin/content/hero', verifyAdmin, (req, res) => {
  try {
    const data = JSON.stringify(req.body);
    db.prepare('INSERT OR REPLACE INTO site_content (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)').run('hero', data);
    res.json({ success: true, message: 'Hero content updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update About Content
app.put('/api/admin/content/about', verifyAdmin, (req, res) => {
  try {
    const data = JSON.stringify(req.body);
    db.prepare('INSERT OR REPLACE INTO site_content (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)').run('about', data);
    res.json({ success: true, message: 'About content updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Services CRUD
app.post('/api/admin/services', verifyAdmin, (req, res) => {
  try {
    const { title, slug, category, icon, summary, description, features, deliverables, technologies, display_order } = req.body;
    const cleanSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    db.prepare(`
      INSERT INTO services (title, slug, category, icon, summary, description, features, deliverables, technologies, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, cleanSlug, category || 'Core Development', icon || 'Globe', summary || '',
      description || '', JSON.stringify(features || []), JSON.stringify(deliverables || []),
      JSON.stringify(technologies || []), display_order || 0
    );
    res.json({ success: true, message: 'Service added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/services/:id', verifyAdmin, (req, res) => {
  try {
    const { title, slug, category, icon, summary, description, features, deliverables, technologies, display_order, is_active } = req.body;
    db.prepare(`
      UPDATE services SET
        title = ?, slug = ?, category = ?, icon = ?, summary = ?, description = ?,
        features = ?, deliverables = ?, technologies = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `).run(
      title, slug, category, icon, summary, description,
      JSON.stringify(features || []), JSON.stringify(deliverables || []),
      JSON.stringify(technologies || []), display_order, is_active ?? 1, req.params.id
    );
    res.json({ success: true, message: 'Service updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/services/:id', verifyAdmin, (req, res) => {
  db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Service deleted' });
});

app.patch('/api/admin/services/:id/toggle', verifyAdmin, (req, res) => {
  const current = db.prepare('SELECT is_active FROM services WHERE id = ?').get(req.params.id);
  if (!current) return res.status(404).json({ error: 'Not found' });
  const nextVal = current.is_active === 1 ? 0 : 1;
  db.prepare('UPDATE services SET is_active = ? WHERE id = ?').run(nextVal, req.params.id);
  res.json({ success: true, is_active: nextVal });
});

// Process Steps CRUD
app.post('/api/admin/process', verifyAdmin, (req, res) => {
  try {
    const { step_number, title, subtitle, description, deliverables, icon, duration } = req.body;
    db.prepare(`
      INSERT INTO process_steps (step_number, title, subtitle, description, deliverables, icon, duration)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(step_number, title, subtitle, description, JSON.stringify(deliverables || []), icon || 'Compass', duration || '');
    res.json({ success: true, message: 'Process step added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/process/:id', verifyAdmin, (req, res) => {
  try {
    const { step_number, title, subtitle, description, deliverables, icon, duration } = req.body;
    db.prepare(`
      UPDATE process_steps SET
        step_number = ?, title = ?, subtitle = ?, description = ?,
        deliverables = ?, icon = ?, duration = ?
      WHERE id = ?
    `).run(step_number, title, subtitle, description, JSON.stringify(deliverables || []), icon, duration, req.params.id);
    res.json({ success: true, message: 'Process step updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/process/:id', verifyAdmin, (req, res) => {
  db.prepare('DELETE FROM process_steps WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Process step deleted' });
});

// Team Members CRUD
app.post('/api/admin/team', verifyAdmin, (req, res) => {
  try {
    const { name, role, bio, avatar_url, skills, social_links, featured_project, display_order } = req.body;
    db.prepare(`
      INSERT INTO team_members (name, role, bio, avatar_url, skills, social_links, featured_project, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, role, bio || '', avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      JSON.stringify(skills || []), JSON.stringify(social_links || {}), featured_project || '', display_order || 0
    );
    res.json({ success: true, message: 'Team member added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/team/:id', verifyAdmin, (req, res) => {
  try {
    const { name, role, bio, avatar_url, skills, social_links, featured_project, display_order, is_active } = req.body;
    db.prepare(`
      UPDATE team_members SET
        name = ?, role = ?, bio = ?, avatar_url = ?, skills = ?, social_links = ?,
        featured_project = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `).run(
      name, role, bio, avatar_url, JSON.stringify(skills || []),
      JSON.stringify(social_links || {}), featured_project, display_order, is_active ?? 1, req.params.id
    );
    res.json({ success: true, message: 'Team member updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/team/:id', verifyAdmin, (req, res) => {
  db.prepare('DELETE FROM team_members WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Team member removed' });
});

app.patch('/api/admin/team/:id/toggle', verifyAdmin, (req, res) => {
  const current = db.prepare('SELECT is_active FROM team_members WHERE id = ?').get(req.params.id);
  if (!current) return res.status(404).json({ error: 'Not found' });
  const nextVal = current.is_active === 1 ? 0 : 1;
  db.prepare('UPDATE team_members SET is_active = ? WHERE id = ?').run(nextVal, req.params.id);
  res.json({ success: true, is_active: nextVal });
});

// Projects CRUD
app.post('/api/admin/projects', verifyAdmin, (req, res) => {
  try {
    const { title, slug, category, status, cover_image, summary, description, technologies, live_url, repo_url, client, impact_stats, featured, display_order } = req.body;
    const cleanSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    db.prepare(`
      INSERT INTO projects (title, slug, category, status, cover_image, summary, description, technologies, live_url, repo_url, client, impact_stats, featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, cleanSlug, category || 'Web Applications', status || 'Production Live',
      cover_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
      summary || '', description || '', JSON.stringify(technologies || []),
      live_url || '', repo_url || '', client || '', JSON.stringify(impact_stats || {}),
      featured ? 1 : 0, display_order || 0
    );
    res.json({ success: true, message: 'Project added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/projects/:id', verifyAdmin, (req, res) => {
  try {
    const { title, slug, category, status, cover_image, summary, description, technologies, live_url, repo_url, client, impact_stats, featured, is_published, display_order } = req.body;
    db.prepare(`
      UPDATE projects SET
        title = ?, slug = ?, category = ?, status = ?, cover_image = ?, summary = ?,
        description = ?, technologies = ?, live_url = ?, repo_url = ?, client = ?,
        impact_stats = ?, featured = ?, is_published = ?, display_order = ?
      WHERE id = ?
    `).run(
      title, slug, category, status, cover_image, summary, description,
      JSON.stringify(technologies || []), live_url, repo_url, client,
      JSON.stringify(impact_stats || {}), featured ? 1 : 0, is_published ?? 1, display_order || 0, req.params.id
    );
    res.json({ success: true, message: 'Project updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/projects/:id', verifyAdmin, (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Project deleted' });
});

app.patch('/api/admin/projects/:id/toggle', verifyAdmin, (req, res) => {
  const current = db.prepare('SELECT is_published FROM projects WHERE id = ?').get(req.params.id);
  if (!current) return res.status(404).json({ error: 'Not found' });
  const nextVal = current.is_published === 1 ? 0 : 1;
  db.prepare('UPDATE projects SET is_published = ? WHERE id = ?').run(nextVal, req.params.id);
  res.json({ success: true, is_published: nextVal });
});

// Reviews CRUD
app.post('/api/admin/reviews', verifyAdmin, (req, res) => {
  try {
    const { reviewer_name, reviewer_role, company, avatar_url, rating, review_text, related_project, display_order } = req.body;
    db.prepare(`
      INSERT INTO reviews (reviewer_name, reviewer_role, company, avatar_url, rating, review_text, related_project, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      reviewer_name, reviewer_role || '', company || '',
      avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      rating || 5, review_text, related_project || '', display_order || 0
    );
    res.json({ success: true, message: 'Review added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/reviews/:id', verifyAdmin, (req, res) => {
  try {
    const { reviewer_name, reviewer_role, company, avatar_url, rating, review_text, related_project, is_published, display_order } = req.body;
    db.prepare(`
      UPDATE reviews SET
        reviewer_name = ?, reviewer_role = ?, company = ?, avatar_url = ?, rating = ?,
        review_text = ?, related_project = ?, is_published = ?, display_order = ?
      WHERE id = ?
    `).run(
      reviewer_name, reviewer_role, company, avatar_url, rating,
      review_text, related_project, is_published ?? 1, display_order || 0, req.params.id
    );
    res.json({ success: true, message: 'Review updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/reviews/:id', verifyAdmin, (req, res) => {
  db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Review deleted' });
});

app.patch('/api/admin/reviews/:id/toggle', verifyAdmin, (req, res) => {
  const current = db.prepare('SELECT is_published FROM reviews WHERE id = ?').get(req.params.id);
  if (!current) return res.status(404).json({ error: 'Not found' });
  const nextVal = current.is_published === 1 ? 0 : 1;
  db.prepare('UPDATE reviews SET is_published = ? WHERE id = ?').run(nextVal, req.params.id);
  res.json({ success: true, is_published: nextVal });
});

// Contact Settings
app.put('/api/admin/contact-settings', verifyAdmin, (req, res) => {
  try {
    const { business_email, business_phone, whatsapp_number, office_address, business_hours, social_github, social_linkedin, social_twitter, social_discord } = req.body;
    db.prepare(`
      UPDATE contact_settings SET
        business_email = ?, business_phone = ?, whatsapp_number = ?, office_address = ?,
        business_hours = ?, social_github = ?, social_linkedin = ?, social_twitter = ?,
        social_discord = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(
      business_email, business_phone, whatsapp_number, office_address,
      business_hours, social_github, social_linkedin, social_twitter, social_discord
    );
    res.json({ success: true, message: 'Contact settings updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FAQs CRUD
app.post('/api/admin/faqs', verifyAdmin, (req, res) => {
  try {
    const { question, answer, category, display_order } = req.body;
    db.prepare(`
      INSERT INTO faqs (question, answer, category, display_order)
      VALUES (?, ?, ?, ?)
    `).run(question, answer, category || 'General', display_order || 0);
    res.json({ success: true, message: 'FAQ added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/faqs/:id', verifyAdmin, (req, res) => {
  try {
    const { question, answer, category, display_order, is_published } = req.body;
    db.prepare(`
      UPDATE faqs SET question = ?, answer = ?, category = ?, display_order = ?, is_published = ?
      WHERE id = ?
    `).run(question, answer, category, display_order, is_published ?? 1, req.params.id);
    res.json({ success: true, message: 'FAQ updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/faqs/:id', verifyAdmin, (req, res) => {
  db.prepare('DELETE FROM faqs WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'FAQ deleted' });
});

app.patch('/api/admin/faqs/:id/toggle', verifyAdmin, (req, res) => {
  const current = db.prepare('SELECT is_published FROM faqs WHERE id = ?').get(req.params.id);
  if (!current) return res.status(404).json({ error: 'Not found' });
  const nextVal = current.is_published === 1 ? 0 : 1;
  db.prepare('UPDATE faqs SET is_published = ? WHERE id = ?').run(nextVal, req.params.id);
  res.json({ success: true, is_published: nextVal });
});

// Packages CRUD (Admin)
app.post('/api/admin/packages', verifyAdmin, (req, res) => {
  try {
    const { name, price_label, description, badge, display_order } = req.body;
    if (!name || !price_label) {
      return res.status(400).json({ error: 'Package name and price label are required' });
    }
    const stmt = db.prepare(`
      INSERT INTO packages (name, price_label, description, badge, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `);
    stmt.run(name.trim(), price_label.trim(), description || '', badge || '', display_order || 0);
    res.json({ success: true, message: 'Package created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/packages/:id', verifyAdmin, (req, res) => {
  try {
    const { name, price_label, description, badge, display_order, is_active } = req.body;
    db.prepare(`
      UPDATE packages SET
        name = ?, price_label = ?, description = ?, badge = ?,
        display_order = ?, is_active = ?
      WHERE id = ?
    `).run(
      name, price_label, description, badge,
      display_order || 0, is_active !== undefined ? (is_active ? 1 : 0) : 1, req.params.id
    );
    res.json({ success: true, message: 'Package updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/packages/:id', verifyAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM packages WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/packages/:id/toggle', verifyAdmin, (req, res) => {
  try {
    const current = db.prepare('SELECT is_active FROM packages WHERE id = ?').get(req.params.id);
    if (!current) return res.status(404).json({ error: 'Package not found' });
    const nextVal = current.is_active === 1 ? 0 : 1;
    db.prepare('UPDATE packages SET is_active = ? WHERE id = ?').run(nextVal, req.params.id);
    res.json({ success: true, is_active: nextVal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enquiries Management
app.get('/api/admin/enquiries', verifyAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all();
  res.json(rows);
});

app.patch('/api/admin/enquiries/:id/status', verifyAdmin, (req, res) => {
  const { status, notes } = req.body;
  db.prepare('UPDATE enquiries SET status = ?, notes = COALESCE(?, notes) WHERE id = ?').run(status, notes || null, req.params.id);
  res.json({ success: true, message: 'Status updated' });
});

app.delete('/api/admin/enquiries/:id', verifyAdmin, (req, res) => {
  db.prepare('DELETE FROM enquiries WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Enquiry deleted' });
});

// Admin Dashboard Summary Metrics
app.get('/api/admin/stats', verifyAdmin, (req, res) => {
  const totalEnquiries = db.prepare('SELECT count(*) as count FROM enquiries').get().count;
  const newEnquiries = db.prepare("SELECT count(*) as count FROM enquiries WHERE status = 'new'").get().count;
  const totalProjects = db.prepare('SELECT count(*) as count FROM projects').get().count;
  const publishedProjects = db.prepare('SELECT count(*) as count FROM projects WHERE is_published = 1').get().count;
  const totalServices = db.prepare('SELECT count(*) as count FROM services WHERE is_active = 1').get().count;
  const totalTeam = db.prepare('SELECT count(*) as count FROM team_members WHERE is_active = 1').get().count;
  const totalReviews = db.prepare('SELECT count(*) as count FROM reviews WHERE is_published = 1').get().count;

  res.json({
    totalEnquiries,
    newEnquiries,
    totalProjects,
    publishedProjects,
    totalServices,
    totalTeam,
    totalReviews
  });
});

// Catch-all for SPA in production
if (fs.existsSync(distDir)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 NODE CRAFT backend running on port ${PORT}`);
  console.log(`📡 Admin credentials: admin@nodecraft.io / NodeCraft@2026!`);
});
