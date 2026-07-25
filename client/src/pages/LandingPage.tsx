import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LeadForm } from '../components/LeadForm';
import { Footer } from '../components/Footer';
import { Users, Zap } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToForm = () => {
    const formElement = document.getElementById('name-input');
    if (formElement) {
      formElement.focus();
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="hero-bg-wrapper app-container">
      {/* Professional Decorative Background Lines & Waves */}
      <div className="hero-grid-lines" />
      <div className="hero-light-glow-1" />
      <div className="hero-light-glow-2" />

      {/* SVG Curved Architectural Lines */}
      <svg
        className="hero-waves-svg"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="curveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="curveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <path
          d="M-100 220 C 350 40, 750 420, 1540 180"
          stroke="url(#curveGrad1)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M-100 360 C 450 620, 920 120, 1540 480"
          stroke="url(#curveGrad2)"
          strokeWidth="2.5"
          strokeDasharray="8 8"
        />
        <path
          d="M-100 520 C 280 180, 820 680, 1540 320"
          stroke="url(#curveGrad1)"
          strokeWidth="2"
        />
      </svg>

      {/* Header */}
      <header className="navbar" style={{ position: 'relative', zIndex: 10 }}>
        <Link to="/" className="brand-logo">
          <div
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}
          >
            <Users size={20} />
          </div>
          <span>
            LeadDesk <span className="highlight">Mini</span>
          </span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <button
            id="nav-admin-login-btn"
            onClick={() => navigate('/admin/login')}
            className="btn-primary"
          >
            Admin Login
          </button>
        </div>
      </header>

      {/* Main Hero Content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 3rem',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {/* Left Hero Text */}
          <div>
            <span
              style={{
                color: '#2563eb',
                fontWeight: 800,
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#eff6ff',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                border: '1px solid #bfdbfe'
              }}
            >
              <Zap size={15} /> CAPTURE. MANAGE. CLOSE.
            </span>

            <h1
              style={{
                fontSize: '3.1rem',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#0f172a',
                marginBottom: '1.5rem',
                letterSpacing: '-0.02em'
              }}
            >
              Capture Leads. <br />
              Manage Better. <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Close More Deals.
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: '2.25rem',
                maxWidth: '480px'
              }}
            >
              LeadDesk Mini helps you capture leads from your website and manage them efficiently in one simple dashboard.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={scrollToForm} className="btn-primary" style={{ padding: '0.875rem 1.75rem', fontSize: '1rem' }}>
                Submit a Lead
              </button>
              <button onClick={() => navigate('/admin/login')} className="btn-outline" style={{ padding: '0.875rem 1.75rem', fontSize: '1rem' }}>
                Admin Login
              </button>
            </div>
          </div>

          {/* Right Form Component */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LeadForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <Footer />
      </div>
    </div>
  );
};

