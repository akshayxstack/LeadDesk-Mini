import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LeadForm } from '../components/LeadForm';
import { Footer } from '../components/Footer';
import { Users } from 'lucide-react';

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
    <div className="app-container">
      {/* Header */}
      <header className="navbar">
        <Link to="/" className="brand-logo">
          <div
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
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
          width: '100%'
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
                display: 'block'
              }}
            >
              CAPTURE. MANAGE. CLOSE.
            </span>

            <h1
              style={{
                fontSize: '3rem',
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
                marginBottom: '2.5rem',
                maxWidth: '480px'
              }}
            >
              LeadDesk Mini helps you capture leads from your website and manage them efficiently in one simple dashboard.
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
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
      <Footer />
    </div>
  );
};
