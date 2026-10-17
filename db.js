import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'nodecraft.db');
export const db = new DatabaseSync(dbPath);

export function initDatabase() {
  // Foreign keys and optimization
  db.exec(`PRAGMA foreign_keys = ON;`);

  // 1. Users (Admin)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Site Content (Key-Value for Hero, About, Philosophy, etc.)
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Services
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      icon TEXT NOT NULL,
      summary TEXT NOT NULL,
      description TEXT NOT NULL,
      features TEXT NOT NULL,
      deliverables TEXT NOT NULL,
      technologies TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Process Steps
  db.exec(`
    CREATE TABLE IF NOT EXISTS process_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      step_number INTEGER UNIQUE NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      description TEXT NOT NULL,
      deliverables TEXT NOT NULL,
      icon TEXT NOT NULL,
      duration TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Team Members
  db.exec(`
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT NOT NULL,
      avatar_url TEXT NOT NULL,
      skills TEXT NOT NULL,
      social_links TEXT NOT NULL,
      featured_project TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Projects
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      summary TEXT NOT NULL,
      description TEXT NOT NULL,
      technologies TEXT NOT NULL,
      live_url TEXT,
      repo_url TEXT,
      client TEXT,
      impact_stats TEXT,
      featured INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Reviews
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reviewer_name TEXT NOT NULL,
      reviewer_role TEXT NOT NULL,
      company TEXT NOT NULL,
      avatar_url TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      review_text TEXT NOT NULL,
      related_project TEXT,
      is_published INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 8. Contact Settings
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_settings (
      id INTEGER PRIMARY KEY,
      business_email TEXT NOT NULL,
      business_phone TEXT NOT NULL,
      whatsapp_number TEXT,
      office_address TEXT NOT NULL,
      business_hours TEXT NOT NULL,
      social_github TEXT,
      social_linkedin TEXT,
      social_twitter TEXT,
      social_discord TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 9. FAQs
  db.exec(`
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      display_order INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 10. Enquiries (Contact Form Submissions)
  db.exec(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_code TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      service_required TEXT NOT NULL,
      budget_range TEXT,
      project_description TEXT NOT NULL,
      preferred_contact TEXT DEFAULT 'email',
      status TEXT DEFAULT 'new',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 11. Packages & Pricing
  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price_label TEXT NOT NULL,
      description TEXT,
      badge TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ensure 'package' column exists in enquiries
  try {
    db.exec(`ALTER TABLE enquiries ADD COLUMN package TEXT;`);
  } catch (e) {
    // Column may already exist
  }

  seedInitialData();
}

function seedInitialData() {
  // Check admin user
  const adminCheck = db.prepare('SELECT count(*) as count FROM users').get();
  if (adminCheck.count === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('NodeCraft@2026!', salt);
    db.prepare(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `).run('admin', 'admin@nodecraft.io', hash, 'admin');
    console.log('✅ Admin initialized: admin@nodecraft.io / NodeCraft@2026!');
  }

  // Hero and About site content
  const contentCheck = db.prepare('SELECT count(*) as count FROM site_content').get();
  if (contentCheck.count === 0) {
    const heroContent = {
      badge: 'NEXT-GEN DIGITAL CRAFTSMANSHIP',
      headline: 'Where Logic Meets Vision.',
      subheadline: 'We Craft Intelligent Digital Experiences.',
      paragraph: 'NODE CRAFT connects cutting-edge engineering, bespoke UI/UX design, and AI integration to build scalable, high-conversion web applications that accelerate modern businesses.',
      ctaPrimary: 'Start a Project',
      ctaSecondary: 'Explore Our Work',
      stats: [
        { label: 'Production Deployments', value: '50+' },
        { label: 'Uptime Reliability', value: '99.9%' },
        { label: 'Client Satisfaction', value: '100%' },
        { label: 'Avg Speed Boost', value: '4.2x' }
      ]
    };

    const aboutContent = {
      title: 'Engineering Tomorrow’s Connected Web',
      story: 'NODE CRAFT was born out of a desire to eliminate clunky, fragile web software. We are an elite team of full-stack engineers, motion designers, and system architects passionate about transforming ambitious ideas into resilient digital platforms.',
      mission: 'To bridge business intent and state-of-the-art web technology through uncompromising code craftsmanship, breathtaking aesthetics, and dependable architectures.',
      vision: 'To be the premier digital catalyst for ambitious startups and enterprises seeking intelligent, high-velocity digital experiences.',
      values: [
        {
          title: 'Creativity',
          description: 'Design that evokes emotion, sparks curiosity, and delivers distinct brand presence.',
          icon: 'Sparkles'
        },
        {
          title: 'Innovation',
          description: 'Adopting battle-tested modern tools, AI workflows, and progressive web capabilities.',
          icon: 'Zap'
        },
        {
          title: 'Quality',
          description: 'Zero-compromise engineering: strict type safety, deep testing, and sub-second load times.',
          icon: 'ShieldCheck'
        },
        {
          title: 'Partnership',
          description: 'Transparent communication, agile milestones, and enduring commitment beyond launch day.',
          icon: 'Users'
        }
      ],
      philosophy: [
        { layer: '01. Architecture', detail: 'Distributed micro-services & headless paradigms tailored to your load.' },
        { layer: '02. Engineering', detail: 'Clean code, resilient error boundaries, and observable data pipelines.' },
        { layer: '03. Visual Motion', detail: 'Purposeful micro-interactions with hardware-accelerated 60 FPS transitions.' },
        { layer: '04. Scalability', detail: 'Automated CI/CD, multi-region edge caches, and enterprise data security.' }
      ]
    };

    db.prepare('INSERT INTO site_content (key, value) VALUES (?, ?)').run('hero', JSON.stringify(heroContent));
    db.prepare('INSERT INTO site_content (key, value) VALUES (?, ?)').run('about', JSON.stringify(aboutContent));
  }

  // Services (all 10 categories requested)
  const servicesCheck = db.prepare('SELECT count(*) as count FROM services').get();
  if (servicesCheck.count === 0) {
    const servicesList = [
      {
        title: 'Website Development',
        slug: 'website-development',
        category: 'Core Development',
        icon: 'Globe',
        summary: 'High-conversion business, corporate, landing, and custom web applications.',
        description: 'From interactive corporate portals to tailored web experiences, we engineer responsive, high-performance websites built for velocity, conversion, and global reach.',
        features: JSON.stringify([
          'Bespoke Business & Corporate Portals',
          'High-converting Campaign Landing Pages',
          'Interactive Brand & Portfolio Websites',
          'Educational & E-learning Hubs',
          'Multi-tenant Custom Web Applications'
        ]),
        deliverables: JSON.stringify([
          'Production-ready code repository',
          'Content management integration',
          'Fully responsive cross-device views',
          'Lighthouse 95+ score compliance'
        ]),
        technologies: JSON.stringify(['React', 'Next.js', 'Node.js', 'Tailwind/Vanilla CSS', 'TypeScript']),
        display_order: 1
      },
      {
        title: 'Frontend Development',
        slug: 'frontend-development',
        category: 'Core Development',
        icon: 'Layout',
        summary: 'Component-driven, pixel-perfect user interfaces with dynamic animations.',
        description: 'We craft buttery-smooth user interfaces with modular architectures, fluid animations, strict accessibility standards (WCAG AAA), and instant interactivity.',
        features: JSON.stringify([
          'Responsive UI with Mobile-first Methodology',
          'Atomic Component Library & Design Systems',
          'Hardware-accelerated Micro-interactions',
          'Deep WCAG 2.1 Accessibility Compliance',
          'Sub-second First Contentful Paint Optimization'
        ]),
        deliverables: JSON.stringify([
          'Reusable UI component library',
          'State management architecture',
          'Cross-browser tested interface',
          'Storybook / UI documentation'
        ]),
        technologies: JSON.stringify(['React', 'Vue', 'Vite', 'CSS Modules', 'Web Animations API']),
        display_order: 2
      },
      {
        title: 'Backend Development',
        slug: 'backend-development',
        category: 'Engineering & Data',
        icon: 'Server',
        summary: 'Robust REST/GraphQL APIs, relational/document databases, and secure servers.',
        description: 'Scalable backend engines designed for high concurrency, bulletproof authentication, relational integrity, and seamless third-party service orchestrations.',
        features: JSON.stringify([
          'High-throughput RESTful & GraphQL APIs',
          'Zero-trust Auth (JWT, OAuth2, RBAC, MFA)',
          'Complex Database Schema Design & Optimization',
          'Asynchronous Job Queues & Webhooks',
          'Resilient Error Handling & Logging Audits'
        ]),
        deliverables: JSON.stringify([
          'Complete API Swagger / OpenAPI documentation',
          'Automated database migration scripts',
          'Comprehensive integration test suite',
          'Environment-configured Docker containers'
        ]),
        technologies: JSON.stringify(['Node.js', 'Express', 'Python', 'PostgreSQL', 'Redis', 'SQLite']),
        display_order: 3
      },
      {
        title: 'UI/UX Design',
        slug: 'ui-ux-design',
        category: 'Design & Experience',
        icon: 'Palette',
        summary: 'Human-centred design systems, interactive prototypes, and UX wireframes.',
        description: 'We turn complex workflows into intuitive, visually breathtaking digital products. Rooted in empirical user research and modern glassmorphic aesthetics.',
        features: JSON.stringify([
          'Empirical User Journey & Empathy Mapping',
          'High-fidelity Interactive Prototypes',
          'Comprehensive Tokenized Design Systems',
          'Responsive Wireframing & Usability Audits',
          'Micro-motion Choreography Specifications'
        ]),
        deliverables: JSON.stringify([
          'Full Figma UI kit & master components',
          'Clickable prototyping walkthroughs',
          'Design tokens JSON export',
          'Usability testing reports'
        ]),
        technologies: JSON.stringify(['Figma', 'FigJam', 'Tokens Studio', 'Framer', 'Protopie']),
        display_order: 4
      },
      {
        title: 'E-commerce Solutions',
        slug: 'ecommerce-solutions',
        category: 'Core Development',
        icon: 'ShoppingCart',
        summary: 'End-to-end digital storefronts, checkout flows, and payment integrations.',
        description: 'High-speed shopping experiences with frictionless checkouts, inventory synchronization, automated taxes, and multi-currency payment gateway integrations.',
        features: JSON.stringify([
          'Dynamic Product Catalogs & Advanced Filtering',
          'Frictionless One-page Cart & Checkout',
          'Stripe, PayPal & Razorpay Secure Processing',
          'Real-time Inventory & Order Syncing',
          'Customer Portal & Automated Order Tracking'
        ]),
        deliverables: JSON.stringify([
          'Complete storefront deployment',
          'Payment gateway sandbox & production certification',
          'Admin order dispatch dashboard',
          'Customer automated transactional email suite'
        ]),
        technologies: JSON.stringify(['Shopify Headless', 'Next.js Commerce', 'Stripe API', 'PostgreSQL']),
        display_order: 5
      },
      {
        title: 'Full-Stack Development',
        slug: 'full-stack-development',
        category: 'Core Development',
        icon: 'Layers',
        summary: 'Holistic turnkey solutions combining frontend, backend, database, and admin.',
        description: 'Complete digital platform engineering from raw architecture to production release, complete with tailored administrative consoles and analytical dashboards.',
        features: JSON.stringify([
          'Unified Full-stack Monorepo / Microservice Setups',
          'Tailored Role-based Admin Dashboards',
          'End-to-end Data Pipelines & Real-time Sockets',
          'Automated CI/CD Deployment Pipelines',
          'Production Monitoring & Security Hardening'
        ]),
        deliverables: JSON.stringify([
          'Turnkey production deployment',
          'Admin control center with analytics',
          'Database backup & recovery runbooks',
          'Architecture technical specification'
        ]),
        technologies: JSON.stringify(['React', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS']),
        display_order: 6
      },
      {
        title: 'Website Maintenance',
        slug: 'website-maintenance',
        category: 'Support & Ops',
        icon: 'ShieldCheck',
        summary: 'Proactive security updates, continuous uptime monitoring, and SLA support.',
        description: 'Keep your digital flagship flawless. We handle package audits, vulnerability patches, database maintenance, zero-downtime backups, and feature improvements.',
        features: JSON.stringify([
          '24/7 Uptime & Error Metric Monitoring',
          'Scheduled Dependency & Security Patching',
          'Automated Off-site Daily Database Backups',
          'Performance Drift Audits & Bug Fixes',
          'Dedicated Priority SLA Support Channels'
        ]),
        deliverables: JSON.stringify([
          'Monthly health & uptime reports',
          'Continuous security patch deployment',
          'Disaster recovery testing verifications',
          'Dedicated support slack/ticketing access'
        ]),
        technologies: JSON.stringify(['Datadog', 'Sentry', 'GitHub Actions', 'Prometheus']),
        display_order: 7
      },
      {
        title: 'SEO and Performance',
        slug: 'seo-and-performance',
        category: 'Growth & Optimization',
        icon: 'TrendingUp',
        summary: 'Core Web Vitals optimization, semantic structured data, and search rankings.',
        description: 'Engineer your site to dominate search algorithms and delight users with sub-second page loads, schema.org graph markups, and optimal Core Web Vitals.',
        features: JSON.stringify([
          'Deep Core Web Vitals (LCP, INP, CLS) Tuning',
          'JSON-LD Schema & Semantic Open Graph Metadata',
          'Automated XML Sitemap & Robots Protocol',
          'Edge Image Transcoding (WebP/AVIF) & Inlining',
          'Zero-layout-shift Font & Asset Preloading'
        ]),
        deliverables: JSON.stringify([
          'Pre/Post Lighthouse performance benchmark',
          'Structured data validation report',
          'Search Console indexing verification',
          'Target keyword metadata blueprint'
        ]),
        technologies: JSON.stringify(['Google Lighthouse', 'Schema.org', 'Sharp', 'Cloudflare Edge']),
        display_order: 8
      },
      {
        title: 'Cloud Deployment and Integration',
        slug: 'cloud-deployment-and-integration',
        category: 'Engineering & Data',
        icon: 'Cloud',
        summary: 'Cloud architecture, custom domain DNS, automated CI/CD, and API pipelines.',
        description: 'We orchestrate rock-solid cloud environments on AWS, Vercel, GCP, or bare metal, wired with automated GitHub Actions pipelines and zero-downtime deployments.',
        features: JSON.stringify([
          'Multi-stage Dockerized Build & Deployment',
          'Automated CI/CD via GitHub Actions',
          'Custom Domain DNS, SSL & CDN Provisioning',
          'Third-party Webhook & API Mesh Orchestration',
          'Secrets Management & Compliance Hardening'
        ]),
        deliverables: JSON.stringify([
          'Infrastructure-as-Code scripts',
          'Automated deployment pipelines',
          'SSL / DNS configuration signoff',
          'Secrets and environment runbook'
        ]),
        technologies: JSON.stringify(['AWS', 'Vercel', 'Docker', 'GitHub Actions', 'Cloudflare']),
        display_order: 9
      },
      {
        title: 'AI-Powered Web Solutions',
        slug: 'ai-powered-web-solutions',
        category: 'Design & Experience',
        icon: 'Cpu',
        summary: 'Custom LLM integrations, conversational agents, semantic search, and automation.',
        description: 'Supercharge your web application with intelligent capabilities: context-aware AI copilots, vector-based semantic search, automated document summarization, and cognitive workflows.',
        features: JSON.stringify([
          'Context-aware Conversational AI Chatbots',
          'Vector Database Semantic Retrieval (RAG)',
          'Automated Document Processing & Extraction',
          'Intelligent Dynamic Recommendation Engines',
          'Custom AI Agent Tool-calling Integrations'
        ]),
        deliverables: JSON.stringify([
          'Integrated LLM API endpoint layer',
          'Custom prompt engineering & guardrails',
          'Vector database indexing pipeline',
          'Token cost & usage telemetry console'
        ]),
        technologies: JSON.stringify(['OpenAI API', 'Anthropic Claude', 'LangChain', 'Pinecone', 'Python']),
        display_order: 10
      }
    ];

    const insertService = db.prepare(`
      INSERT INTO services (title, slug, category, icon, summary, description, features, deliverables, technologies, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    servicesList.forEach(s => {
      insertService.run(
        s.title, s.slug, s.category, s.icon, s.summary,
        s.description, s.features, s.deliverables, s.technologies, s.display_order
      );
    });
  }

  // Process Steps (all 7 requested)
  const processCheck = db.prepare('SELECT count(*) as count FROM process_steps').get();
  if (processCheck.count === 0) {
    const processSteps = [
      {
        step_number: 1,
        title: 'Discovery and Requirements',
        subtitle: 'Uncovering the Core Vision',
        description: 'We align deeply with your business objectives, target demographics, technical requirements, and strategic metrics to construct a blueprint for success.',
        deliverables: JSON.stringify(['Project Scope Document', 'Technical Feasibility Analysis', 'Stakeholder Alignment Matrix', 'Milestone Roadmap']),
        icon: 'Compass',
        duration: 'Week 1'
      },
      {
        step_number: 2,
        title: 'Research and Planning',
        subtitle: 'Architectural Blueprinting',
        description: 'We conduct competitive benchmarking, user flow mapping, database schema design, and security modeling before writing a single line of production code.',
        deliverables: JSON.stringify(['Architecture Design Spec', 'Database Entity Relationship Diagram', 'User Journey Maps', 'Tech Stack Selection']),
        icon: 'FileText',
        duration: 'Week 2'
      },
      {
        step_number: 3,
        title: 'UI/UX Design and Prototyping',
        subtitle: 'Crafting the Visual Identity',
        description: 'Our design studio translates wireframes into high-fidelity glassmorphic prototypes, establishing a comprehensive design system with micro-interaction motion specs.',
        deliverables: JSON.stringify(['Figma Design System', 'High-Fidelity Clickable Prototype', 'Accessibility Audit (WCAG)', 'Interactive Micro-motion Specs']),
        icon: 'Figma',
        duration: 'Weeks 3-4'
      },
      {
        step_number: 4,
        title: 'Frontend and Backend Development',
        subtitle: 'High-Velocity Engineering',
        description: 'Our senior engineers construct clean, modular codebases with strict type safety, performant state management, secure REST/GraphQL APIs, and resilient data layers.',
        deliverables: JSON.stringify(['Modular Component Library', 'Hardened API & Database Engine', 'Bi-weekly Staging Demos', 'Automated Unit & E2E Tests']),
        icon: 'Code2',
        duration: 'Weeks 5-8'
      },
      {
        step_number: 5,
        title: 'Testing and Quality Assurance',
        subtitle: 'Zero-Tolerance Verification',
        description: 'We subject the application to rigorous stress tests: cross-browser compatibility, mobile responsive matrices, penetration security checks, and Lighthouse performance tuning.',
        deliverables: JSON.stringify(['Full QA Test Matrix Report', 'Security Penetration Signoff', 'Lighthouse 95+ Audit', 'Cross-Device Validation Matrix']),
        icon: 'CheckCircle2',
        duration: 'Week 9'
      },
      {
        step_number: 6,
        title: 'Deployment and Launch',
        subtitle: 'Flawless Production Release',
        description: 'We orchestrate zero-downtime containerized production releases on cloud infrastructure with edge CDNs, SSL certificates, DNS routing, and automated rollback triggers.',
        deliverables: JSON.stringify(['Production Cloud Provisioning', 'SSL & DNS Propagation', 'CI/CD Pipeline Setup', 'Live Launch Monitoring']),
        icon: 'Rocket',
        duration: 'Week 10'
      },
      {
        step_number: 7,
        title: 'Maintenance and Continuous Improvement',
        subtitle: 'Long-Term Evolution',
        description: 'Post-launch, we provide continuous health telemetry, proactive dependency updates, security audits, database backups, and data-driven feature iterations.',
        deliverables: JSON.stringify(['24/7 SLA Uptime Monitoring', 'Scheduled Dependency Patches', 'Quarterly Optimization Reviews', 'On-demand Feature Sprints']),
        icon: 'RefreshCw',
        duration: 'Ongoing'
      }
    ];

    const insertStep = db.prepare(`
      INSERT INTO process_steps (step_number, title, subtitle, description, deliverables, icon, duration)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    processSteps.forEach(p => {
      insertStep.run(p.step_number, p.title, p.subtitle, p.description, p.deliverables, p.icon, p.duration);
    });
  }

  // Team Members (Sample Team Profiles clearly labelled)
  const teamCheck = db.prepare('SELECT count(*) as count FROM team_members').get();
  if (teamCheck.count === 0) {
    const team = [
      {
        name: 'Arjun Vance',
        role: 'Chief Technology Officer & Lead Architect',
        bio: 'Over a decade designing high-throughput distributed systems, modern web engines, and scalable microservices. Passionate about sub-millisecond execution and clean architectures.',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        skills: JSON.stringify(['Distributed Systems', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker']),
        social_links: JSON.stringify({
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://x.com'
        }),
        featured_project: 'Nexus AI Engine',
        display_order: 1
      },
      {
        name: 'Elena Rostova',
        role: 'Head of UI/UX & Creative Director',
        bio: 'Specialist in glassmorphic motion design, intuitive human-computer interfaces, and design system engineering with an obsession for micro-interactions.',
        avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
        skills: JSON.stringify(['Design Systems', 'Figma', 'Motion Design', 'WCAG AAA', 'User Research']),
        social_links: JSON.stringify({
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://x.com'
        }),
        featured_project: 'Aura Commerce OS',
        display_order: 2
      },
      {
        name: 'Marcus Chen',
        role: 'Senior Full-Stack & Cloud Specialist',
        bio: 'Full-stack craftsman specializing in React ecosystems, serverless edge compute, zero-downtime CI/CD automation, and secure API gateways.',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        skills: JSON.stringify(['React / Next.js', 'GraphQL', 'AWS / Cloudflare', 'Redis', 'Python']),
        social_links: JSON.stringify({
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://x.com'
        }),
        featured_project: 'Pulse Cloud Monitor',
        display_order: 3
      },
      {
        name: 'Sophia Patel',
        role: 'AI Systems & Data Engineer',
        bio: 'Focuses on integrating generative intelligence, RAG vector pipelines, semantic search engines, and real-time inference within production web platforms.',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        skills: JSON.stringify(['LLM Fine-tuning', 'LangChain', 'Vector DBs', 'FastAPI', 'PyTorch']),
        social_links: JSON.stringify({
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://x.com'
        }),
        featured_project: 'Synapse Semantic Search',
        display_order: 4
      }
    ];

    const insertTeam = db.prepare(`
      INSERT INTO team_members (name, role, bio, avatar_url, skills, social_links, featured_project, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    team.forEach(t => {
      insertTeam.run(t.name, t.role, t.bio, t.avatar_url, t.skills, t.social_links, t.featured_project, t.display_order);
    });
  }

  // Projects (Sample Projects covering all 6 requested categories)
  const projectsCheck = db.prepare('SELECT count(*) as count FROM projects').get();
  if (projectsCheck.count === 0) {
    const projectsList = [
      {
        title: 'Vortex Global Logistics',
        slug: 'vortex-global-logistics',
        category: 'Business Websites',
        status: 'Production Live',
        cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
        summary: 'Corporate web presence and enterprise freight tracking system serving 120+ international ports.',
        description: 'Vortex required a complete digital overhaul to modernise their enterprise freight brokerage. We engineered an ultra-fast, multi-lingual portal with real-time tracking integration, interactive container cost estimators, and sub-second page transitions.',
        technologies: JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS']),
        live_url: 'https://example.com/vortex',
        repo_url: 'https://github.com/example/vortex',
        client: 'Vortex Shipping Corp',
        impact_stats: JSON.stringify({ 'Conversion Increase': '+185%', 'Page Load Time': '0.62s', 'Inquiry Volume': '3.4x' }),
        featured: 1,
        display_order: 1
      },
      {
        title: 'Aura Luxury Minimalist Commerce',
        slug: 'aura-luxury-commerce',
        category: 'E-commerce',
        status: 'Production Live',
        cover_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80',
        summary: 'Headless e-commerce storefront featuring bespoke 3D product previews and instant one-click checkout.',
        description: 'Engineered an ultra-luxurious e-commerce destination with instant page transitions, interactive product customizer, Stripe multi-currency processing, and real-time inventory synchronization across 4 warehouses.',
        technologies: JSON.stringify(['Next.js', 'Shopify Storefront API', 'Stripe', 'Framer Motion', 'Tailwind CSS']),
        live_url: 'https://example.com/aura',
        repo_url: 'https://github.com/example/aura',
        client: 'Aura Atelier Ltd.',
        impact_stats: JSON.stringify({ 'Checkout Conversion': '+34%', 'Mobile Cart Drop': '-42%', 'Monthly GMV': '$1.2M' }),
        featured: 1,
        display_order: 2
      },
      {
        title: 'Krypton Studio Portfolio',
        slug: 'krypton-studio-portfolio',
        category: 'Portfolio Websites',
        status: 'Production Live',
        cover_image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
        summary: 'Award-winning interactive design studio portfolio featuring fluid WebGL fluid canvas effects.',
        description: 'An evocative, experimental digital agency showcase designed to capture high-profile international clients. Features cursor-reactive liquid distortions, audio feedback, and modular project case study displays.',
        technologies: JSON.stringify(['Vanilla Three.js', 'React', 'GLSL Shaders', 'Web Audio API']),
        live_url: 'https://example.com/krypton',
        repo_url: 'https://github.com/example/krypton',
        client: 'Krypton Creative Inc.',
        impact_stats: JSON.stringify({ 'Site of the Day': 'Awwwards Nominee', 'Avg Session Duration': '4m 12s', 'Global Reach': '94 Countries' }),
        featured: 1,
        display_order: 3
      },
      {
        title: 'Stratum Workflow Orchestrator',
        slug: 'stratum-workflow-orchestrator',
        category: 'Web Applications',
        status: 'Production Live',
        cover_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
        summary: 'Cloud-native collaborative project management suite with real-time websocket sync.',
        description: 'Stratum provides high-velocity development teams with a visual graph editor for sprint planning, branch synchronization, automated test notifications, and multi-user live cursors.',
        technologies: JSON.stringify(['React', 'WebSockets', 'Go Engine', 'PostgreSQL', 'Redis']),
        live_url: 'https://example.com/stratum',
        repo_url: 'https://github.com/example/stratum',
        client: 'Stratum Technologies',
        impact_stats: JSON.stringify({ 'Active Daily Users': '28,000+', 'Sync Latency': '<15ms', 'Customer Retention': '96%' }),
        featured: 1,
        display_order: 4
      },
      {
        title: 'Pulse Cloud Telemetry Dashboard',
        slug: 'pulse-cloud-telemetry',
        category: 'Dashboard Systems',
        status: 'Production Live',
        cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
        summary: 'Real-time infrastructure observability dashboard handling 10M+ events per minute.',
        description: 'Engineered for cloud devops engineers, Pulse visualizes server cluster metrics, latency spikes, database thread pool exhaustion, and automated alert incident management.',
        technologies: JSON.stringify(['React', 'Chart.js', 'Node.js', 'ClickHouse', 'Tailwind CSS']),
        live_url: 'https://example.com/pulse',
        repo_url: 'https://github.com/example/pulse',
        client: 'PulseCloud Networks',
        impact_stats: JSON.stringify({ 'Event Throughput': '10M/min', 'Alert MTTR': '-60%', 'Crash Rate': '0.001%' }),
        featured: 0,
        display_order: 5
      },
      {
        title: 'Synapse Cognitive Search & Copilot',
        slug: 'synapse-cognitive-search',
        category: 'AI-Powered Solutions',
        status: 'Production Live',
        cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
        summary: 'Enterprise document intelligence system with natural language search and semantic RAG summarization.',
        description: 'Connected internal company knowledge bases, PDFs, and API documentation into an instant semantic intelligence tool. Employees query policies in natural language and receive verified citations.',
        technologies: JSON.stringify(['Python', 'LangChain', 'FastAPI', 'React', 'Pinecone Vector DB']),
        live_url: 'https://example.com/synapse',
        repo_url: 'https://github.com/example/synapse',
        client: 'Synapse Enterprise AI',
        impact_stats: JSON.stringify({ 'Search Speed': '120ms', 'Accuracy Rating': '99.2%', 'Saved Hours/Mo': '1,400 hrs' }),
        featured: 1,
        display_order: 6
      }
    ];

    const insertProject = db.prepare(`
      INSERT INTO projects (title, slug, category, status, cover_image, summary, description, technologies, live_url, repo_url, client, impact_stats, featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    projectsList.forEach(p => {
      insertProject.run(
        p.title, p.slug, p.category, p.status, p.cover_image, p.summary,
        p.description, p.technologies, p.live_url, p.repo_url, p.client,
        p.impact_stats, p.featured, p.display_order
      );
    });
  }

  // Reviews (Sample testimonials clearly labelled)
  const reviewsCheck = db.prepare('SELECT count(*) as count FROM reviews').get();
  if (reviewsCheck.count === 0) {
    const reviewsList = [
      {
        reviewer_name: 'David Sterling',
        reviewer_role: 'VP of Technology',
        company: 'Vortex Global Logistics',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        rating: 5,
        review_text: 'NODE CRAFT completely transformed our international freight infrastructure. Their team combined deep backend architecture with an interface so sleek our clients actually enjoy tracking shipments. Uptime has been flawless.',
        related_project: 'Vortex Global Logistics',
        display_order: 1
      },
      {
        reviewer_name: 'Camilla Moreau',
        reviewer_role: 'Founder & Creative Director',
        company: 'Aura Atelier Ltd.',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        rating: 5,
        review_text: 'The attention to visual detail, glassmorphic polish, and lightning-fast checkout NODE CRAFT delivered catapulted our sales by 34% in the very first month. They are true digital craftsmen.',
        related_project: 'Aura Luxury Minimalist Commerce',
        display_order: 2
      },
      {
        reviewer_name: 'Jonathan Kester',
        reviewer_role: 'Chief Product Officer',
        company: 'Stratum Technologies',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        rating: 5,
        review_text: 'Working with NODE CRAFT felt like having a powerhouse team of Silicon Valley staff engineers embedded in our office. They shipped on schedule, documented everything, and provided exceptional post-launch support.',
        related_project: 'Stratum Workflow Orchestrator',
        display_order: 3
      },
      {
        reviewer_name: 'Dr. Evelyn Reed',
        reviewer_role: 'Director of AI Systems',
        company: 'Synapse Enterprise AI',
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        rating: 5,
        review_text: 'Their mastery of vector search pipelines and clean web interfaces allowed us to deploy our enterprise LLM tool in half the expected time. Highly recommended for any serious startup.',
        related_project: 'Synapse Cognitive Search & Copilot',
        display_order: 4
      }
    ];

    const insertReview = db.prepare(`
      INSERT INTO reviews (reviewer_name, reviewer_role, company, avatar_url, rating, review_text, related_project, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    reviewsList.forEach(r => {
      insertReview.run(r.reviewer_name, r.reviewer_role, r.company, r.avatar_url, r.rating, r.review_text, r.related_project, r.display_order);
    });
  }

  // Contact Settings
  const contactCheck = db.prepare('SELECT count(*) as count FROM contact_settings').get();
  if (contactCheck.count === 0) {
    db.prepare(`
      INSERT INTO contact_settings (id, business_email, business_phone, whatsapp_number, office_address, business_hours, social_github, social_linkedin, social_twitter, social_discord)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'hello@nodecraft.io',
      '+1 (555) 392-8241',
      '+15553928241',
      'Innovation Tower, Suite 402, Tech District, San Francisco, CA',
      'Monday – Friday: 9:00 AM – 6:00 PM PST',
      'https://github.com/nodecraft',
      'https://linkedin.com/company/nodecraft',
      'https://x.com/nodecraft_io',
      'https://discord.gg/nodecraft'
    );
  }

  // FAQs (All 10 requested questions)
  const faqCheck = db.prepare('SELECT count(*) as count FROM faqs').get();
  if (faqCheck.count === 0) {
    const faqList = [
      {
        question: 'What types of websites do you develop?',
        answer: 'We engineer high-performance business portals, bespoke corporate web applications, interactive design portfolios, headless e-commerce storefronts, educational platforms, and AI-augmented web tools. Every project is custom-crafted to your specific goals without generic themes.',
        category: 'Services',
        display_order: 1
      },
      {
        question: 'How does the development process work?',
        answer: 'Our 7-phase methodology ensures transparency and velocity: Discovery & Requirements, Research & Planning, UI/UX Design Prototyping, Frontend & Backend Development, Testing & QA, Production Launch, and Ongoing Maintenance. You receive regular staging updates and direct engineer communication.',
        category: 'Process',
        display_order: 2
      },
      {
        question: 'How long does a typical project take?',
        answer: 'Timelines vary based on technical scope and integrations. A focused landing page or corporate website typically takes 2 to 4 weeks, while a complex custom web application, e-commerce platform, or AI integration typically ranges from 6 to 12 weeks. We establish clear milestone dates during the Discovery phase.',
        category: 'Planning',
        display_order: 3
      },
      {
        question: 'What information do you need to start a project?',
        answer: 'To initiate a project, we begin with your core objectives, target user personas, any existing brand guidelines or design inspirations, desired technical integrations (e.g. payment gateways, CRMs, authentication), and your projected launch timeline and budget range.',
        category: 'Getting Started',
        display_order: 4
      },
      {
        question: 'Do you develop custom web applications?',
        answer: 'Yes! Custom web applications are our specialty. We build scalable single-page and multi-page web applications with real-time websocket synchronization, role-based access control, complex data visualization dashboards, and resilient cloud architectures.',
        category: 'Services',
        display_order: 5
      },
      {
        question: 'Can you redesign an existing website?',
        answer: 'Absolutely. We specialize in modernizing legacy web applications: upgrading visual design to modern glassmorphic aesthetics, rewriting frontend code for Core Web Vitals speed, refactoring database backends, and ensuring zero downtime during data migration.',
        category: 'Services',
        display_order: 6
      },
      {
        question: 'Do you provide hosting and deployment?',
        answer: 'Yes, we handle complete end-to-end cloud provisioning. We configure production hosting on AWS, Vercel, Google Cloud, or your preferred infrastructure, complete with automated CI/CD deployment pipelines, SSL encryption, custom domain DNS, and global CDN caching.',
        category: 'Infrastructure',
        display_order: 7
      },
      {
        question: 'Do you offer website maintenance?',
        answer: 'Yes, we provide continuous SLA maintenance retainers that include 24/7 uptime monitoring, automated offsite database backups, security dependency patches, performance optimization audits, and dedicated priority developer hours for feature updates.',
        category: 'Support',
        display_order: 8
      },
      {
        question: 'Can you integrate payment gateways?',
        answer: 'Yes. We integrate secure, PCI-compliant payment gateways including Stripe, PayPal, Razorpay, Apple Pay, Google Pay, and bespoke invoicing processors, complete with automated webhook verification and recurring subscription billing workflows.',
        category: 'E-commerce',
        display_order: 9
      },
      {
        question: 'How can I request a quotation?',
        answer: 'Simply fill out the project enquiry form in our Get In Touch section below with your project details and requirements. Our engineering lead will review your scope and provide a tailored technical proposal and quotation within 24 to 48 hours.',
        category: 'Contact',
        display_order: 10
      }
    ];

    const insertFaq = db.prepare(`
      INSERT INTO faqs (question, answer, category, display_order)
      VALUES (?, ?, ?, ?)
    `);

    faqList.forEach(f => {
      insertFaq.run(f.question, f.answer, f.category, f.display_order);
    });
  }

  // 11. Initial Packages
  const pkgCheck = db.prepare('SELECT count(*) as count FROM packages').get();
  if (pkgCheck.count === 0) {
    const insertPkg = db.prepare(`
      INSERT INTO packages (name, price_label, description, badge, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `);

    insertPkg.run(
      'Static Single Page Website',
      '₹5,000 + ₹3,000 Server',
      'High-conversion responsive single page website with smooth animations, mobile-first design, SEO meta tags, and high-speed server configuration.',
      'Starter',
      1
    );

    insertPkg.run(
      'Full-Stack Web App',
      '₹12,000 + ₹3,000 Server',
      'Production-grade full-stack web application with SQLite/Postgres database, user authentication, REST APIs, and responsive management dashboard.',
      'Most Popular',
      2
    );

    insertPkg.run(
      'Portal & Daily Operations Suite',
      '₹20,000+',
      'Comprehensive custom portal with role-based access control, automated daily workflows, billing/invoicing integrations, and advanced analytics.',
      'Enterprise',
      3
    );

    insertPkg.run(
      'Modular Add-ons / Custom Requirements',
      'Custom Quote',
      'Tailored microservices, AI vector integrations, custom plugins, legacy migrations, and specialized architecture consulting.',
      'Tailored',
      4
    );

    console.log('✅ Initial packages seeded successfully.');
  }
}
