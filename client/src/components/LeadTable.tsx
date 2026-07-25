import React, { useState } from 'react';
import { LeadItem } from '../lib/api';
import { StatusPill } from './StatusPill';
import { MoreVertical, X } from 'lucide-react';

interface LeadTableProps {
  leads: LeadItem[];
  onStatusChange: (id: string, newStatus: 'New' | 'Contacted' | 'Closed') => void;
  isLoading?: boolean;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, onStatusChange, isLoading = false }) => {
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  const getBudgetBadge = (budget: string) => {
    switch (budget) {
      case '<5k':
        return <span className="badge-budget badge-5k">&lt;5k</span>;
      case '5-10k':
        return <span className="badge-budget badge-5-10k">5-10k</span>;
      case '10k+':
        return <span className="badge-budget badge-10k">10k+</span>;
      default:
        return <span className="badge-budget">{budget}</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        Loading leads data...
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}
      >
        <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>
          No leads found matching your search criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
          overflowX: 'auto'
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.9rem'
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              <th style={{ padding: '1rem 1.25rem' }}>Name</th>
              <th style={{ padding: '1rem 1.25rem' }}>Email</th>
              <th style={{ padding: '1rem 1.25rem' }}>Budget Range</th>
              <th style={{ padding: '1rem 1.25rem' }}>Message</th>
              <th style={{ padding: '1rem 1.25rem' }}>Status</th>
              <th style={{ padding: '1rem 1.25rem' }}>Submitted At</th>
              <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#0f172a' }}>
                  {lead.name}
                </td>
                <td style={{ padding: '1rem 1.25rem', color: '#475569' }}>
                  {lead.email}
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  {getBudgetBadge(lead.budgetRange)}
                </td>
                <td style={{ padding: '1rem 1.25rem', color: '#475569', maxWidth: '280px' }}>
                  <div
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'pointer'
                    }}
                    title={lead.message}
                    onClick={() => setSelectedLead(lead)}
                  >
                    {lead.message}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <StatusPill
                    status={lead.status}
                    onStatusChange={(newStatus) => onStatusChange(lead.id, newStatus)}
                  />
                </td>
                <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.85rem' }}>
                  {formatDate(lead.createdAt)}
                </td>
                <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                  <button
                    onClick={() => setSelectedLead(lead)}
                    title="View lead details"
                    style={{
                      background: 'none',
                      color: '#64748b',
                      padding: '0.375rem',
                      borderRadius: '6px',
                      transition: 'color 0.2s, background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#2563eb';
                      e.currentTarget.style.backgroundColor = '#eff6ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#64748b';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            padding: '0.875rem 1.25rem',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            fontSize: '0.85rem',
            color: '#64748b'
          }}
        >
          Showing {leads.length} of {leads.length} leads
        </div>
      </div>

      {/* Modal for viewing lead message */}
      {selectedLead && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '1rem'
          }}
          onClick={() => setSelectedLead(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedLead(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                color: '#94a3b8'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Lead Detail
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.95rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>
                  NAME
                </span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedLead.name}</span>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>
                  EMAIL
                </span>
                <span style={{ color: '#334155' }}>{selectedLead.email}</span>
              </div>

              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>
                    BUDGET RANGE
                  </span>
                  <div style={{ marginTop: '0.25rem' }}>{getBudgetBadge(selectedLead.budgetRange)}</div>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>
                    STATUS
                  </span>
                  <div style={{ marginTop: '0.25rem' }}>
                    <StatusPill
                      status={selectedLead.status}
                      onStatusChange={(newStatus) => {
                        onStatusChange(selectedLead.id, newStatus);
                        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                  MESSAGE
                </span>
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6
                  }}
                >
                  {selectedLead.message}
                </div>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>
                  SUBMITTED AT
                </span>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  {formatDate(selectedLead.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
