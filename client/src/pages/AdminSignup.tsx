import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Footer } from '../components/Footer';
import { 
  UserPlus, 
  User, 
  Lock, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface AdminSignupProps {
  onSignupSuccess: (token: string) => void;
}

export const AdminSignup: React.FC<AdminSignupProps> = ({ onSignupSuccess }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.register(trimmedUsername, password);
      onSignupSuccess(response.token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-bg app-container">
      {/* Top Header / Navigation Bar (Matching Landing Page Navbar) */}
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
          <Link
            to="/"
            className="btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Grid Content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 2rem',
          maxWidth: '1240px',
          width: '100%',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {/* Left Column: Brand Showcase */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
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
                gap: '0.5rem'
              }}
            >
              <UserPlus size={18} /> ADMIN REGISTRATION
            </span>

            <h1
              style={{
                fontSize: '2.75rem',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#0f172a',
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em'
              }}
            >
              Join the Admin Team & <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Empower Growth.
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '460px'
              }}
            >
              Create your administrator account to take full control of inbound leads, streamline team actions, and monitor performance.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    borderRadius: '8px',
                    padding: '0.45rem',
                    display: 'flex'
                  }}
                >
                  <TrendingUp size={18} />
                </div>
                <span style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 600 }}>
                  Unified CRM dashboard for fast lead triage
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div
                  style={{
                    backgroundColor: '#f3e8ff',
                    color: '#7c3aed',
                    borderRadius: '8px',
                    padding: '0.45rem',
                    display: 'flex'
                  }}
                >
                  <ShieldCheck size={18} />
                </div>
                <span style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 600 }}>
                  High-security credentials with instant JWT issuing
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div
                  style={{
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    borderRadius: '8px',
                    padding: '0.45rem',
                    display: 'flex'
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <span style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 600 }}>
                  Full lead history & budget segmentation
                </span>
              </div>
            </div>

            <div
              className="float-badge"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                borderRadius: '14px',
                padding: '0.875rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                width: 'fit-content'
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  boxShadow: '0 0 10px #2563eb'
                }}
              />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  Fast Onboarding
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Instant access to Lead Management Console
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Form Card */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              className="auth-card-elevated"
              style={{
                padding: '2.5rem',
                width: '100%',
                maxWidth: '430px'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
                  }}
                >
                  <UserPlus size={28} />
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                  Create Admin Account
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Register to start managing leads effectively
                </p>
              </div>

              {error && (
                <div
                  className="alert-error"
                  style={{
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label
                    htmlFor="signup-username-input"
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '0.4rem'
                    }}
                  >
                    Username
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '0.9rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                        pointerEvents: 'none'
                      }}
                    />
                    <input
                      id="signup-username-input"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="auth-input-field"
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label
                    htmlFor="signup-password-input"
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '0.4rem'
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '0.9rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                        pointerEvents: 'none'
                      }}
                    />
                    <input
                      id="signup-password-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password (min. 6 chars)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input-field"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle-btn"
                      title={showPassword ? 'Hide password' : 'Show password'}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    htmlFor="signup-confirm-password-input"
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '0.4rem'
                    }}
                  >
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '0.9rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                        pointerEvents: 'none'
                      }}
                    />
                    <input
                      id="signup-confirm-password-input"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="auth-input-field"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="password-toggle-btn"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  id="signup-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="auth-submit-btn"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Login Link Redirect */}
              <div
                style={{
                  marginTop: '1.75rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid #f1f5f9',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  color: '#64748b'
                }}
              >
                Already have an account?{' '}
                <Link
                  to="/admin/login"
                  style={{
                    color: '#2563eb',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  Log In
                </Link>
              </div>

              {/* Trust Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem',
                  marginTop: '1rem',
                  color: '#94a3b8',
                  fontSize: '0.75rem'
                }}
              >
                <CheckCircle2 size={13} style={{ color: '#10b981' }} />
                <span>Protected by 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
