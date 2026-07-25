import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, LeadItem } from '../lib/api';
import { LeadTable } from '../components/LeadTable';
import { Footer } from '../components/Footer';
import {
  Users,
  LayoutDashboard,
  ListFilter,
  LogOut,
  Search,
  ExternalLink,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  token: string | null;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, onLogout }) => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('Admin');

  // Check auth session validity & fetch initial data
  const loadDashboardData = useCallback(async (searchTerm: string = '') => {
    if (!token) {
      onLogout();
      navigate('/admin/login', { replace: true });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // 1. Verify token session via GET /api/auth/me
      const meRes = await api.getMe(token);
      if (meRes && meRes.username) {
        setUsername(meRes.username);
      }

      // 2. Fetch leads via GET /api/leads
      const leadsRes = await api.getLeads(token, searchTerm);
      setLeads(leadsRes.leads);
    } catch (err: any) {
      if (err.status === 401) {
        onLogout();
        navigate('/admin/login', { replace: true });
        return;
      }
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, [token, onLogout, navigate]);

  useEffect(() => {
    loadDashboardData('');
  }, [loadDashboardData]);

  // Debounced search handling
  useEffect(() => {
    const handler = setTimeout(() => {
      loadDashboardData(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search, loadDashboardData]);

  // Status Change Handler
  const handleStatusChange = async (id: string, newStatus: 'New' | 'Contacted' | 'Closed') => {
    if (!token) return;
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );

    try {
      await api.updateLeadStatus(token, id, newStatus);
    } catch (err: any) {
      // Revert on error
      setError('Failed to update lead status. Please try again.');
      loadDashboardData(search);
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem',
          position: 'sticky',
          top: 0,
          height: '100vh'
        }}
      >
        <div>
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" style={{ marginBottom: '2.5rem', textDecoration: 'none' }}>
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

          {/* Navigation items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <ListFilter size={18} />
              All Leads
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div>
          <button
            onClick={handleLogoutClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#ef4444',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginBottom: '2rem',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LogOut size={18} />
            Logout ({username})
          </button>

          <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
            Built for Digital Heroes Training Task
            <br />
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2563eb', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600, marginTop: '0.25rem' }}
            >
              digitalheroesco.com <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <main style={{ flex: 1, padding: '2.5rem 3rem' }}>
          {/* Header & Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem'
            }}
          >
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>All Leads</h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Manage and track all your leads</p>
            </div>

            {/* Search bar */}
            <div style={{ position: 'relative', width: '320px' }}>
              <Search
                size={18}
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
              <input
                id="lead-search-input"
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 1rem 0.625rem 2.75rem',
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#0f172a'
                }}
              />
            </div>
          </div>

          {error && (
            <div className="alert-error" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
              <button
                onClick={() => loadDashboardData(search)}
                style={{ background: 'none', color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          )}

          {/* Data Table Component */}
          <LeadTable
            leads={leads}
            onStatusChange={handleStatusChange}
            isLoading={isLoading}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
};
