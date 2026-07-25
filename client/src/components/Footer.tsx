import React, { useState } from 'react';
import { Github, Linkedin, X, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <footer
        style={{
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          padding: '2rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          fontSize: '0.85rem',
          color: '#64748b',
          width: '100%'
        }}
      >
        {/* Top Row: About Blurb & Social/Terms Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {/* About Blurb */}
          <div style={{ maxWidth: '540px', lineHeight: 1.5, color: '#475569' }}>
            LeadDesk Mini — a lead capture and management tool, built as part of a full-stack development submission by Akshay.
          </div>

          {/* Social Icons & Terms */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <a
              href="https://github.com/Akshay-tech-hub"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Profile"
              style={{
                color: '#64748b',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              <Github size={18} />
            </a>

            <a
              href="https://linkedin.com/in/akshaydorasrichintha"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn Profile"
              style={{
                color: '#64748b',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              <Linkedin size={18} />
            </a>

            <span style={{ color: '#cbd5e1' }}>|</span>

            <button
              onClick={() => setIsTermsOpen(true)}
              style={{
                background: 'none',
                color: '#64748b',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                cursor: 'pointer',
                transition: 'color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              Terms & Conditions
            </button>
          </div>
        </div>

        {/* Bottom Row: Copyright */}
        <div
          style={{
            borderTop: '1px solid #f1f5f9',
            paddingTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#94a3b8'
          }}
        >
          <div>© {new Date().getFullYear()} LeadDesk Mini. All rights reserved.</div>
          <div>Built by Akshay</div>
        </div>
      </footer>

      {/* Terms & Conditions Modal */}
      {isTermsOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setIsTermsOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              maxWidth: '460px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsTermsOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.4rem', borderRadius: '8px' }}>
                <ShieldAlert size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>Terms & Conditions</h3>
            </div>

            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              This is a demo application built for a development task submission. Not intended for production use or real data collection.
            </p>

            <button
              onClick={() => setIsTermsOpen(false)}
              className="btn-primary"
              style={{ width: '100%', height: '42px', fontSize: '0.9rem', borderRadius: '8px' }}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
