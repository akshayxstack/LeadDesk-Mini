import React from 'react';
import { ChevronDown } from 'lucide-react';

interface StatusPillProps {
  status: 'New' | 'Contacted' | 'Closed';
  onStatusChange?: (newStatus: 'New' | 'Contacted' | 'Closed') => void;
  disabled?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, onStatusChange, disabled = false }) => {
  const getPillStyles = () => {
    switch (status) {
      case 'New':
        return {
          bg: '#eff6ff',
          color: '#1d4ed8',
          border: '#bfdbfe'
        };
      case 'Contacted':
        return {
          bg: '#fffbe6',
          color: '#d97706',
          border: '#fde68a'
        };
      case 'Closed':
        return {
          bg: '#f0fdf4',
          color: '#15803d',
          border: '#bbf7d0'
        };
      default:
        return {
          bg: '#f1f5f9',
          color: '#475569',
          border: '#cbd5e1'
        };
    }
  };

  const style = getPillStyles();

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      <select
        value={status}
        disabled={disabled}
        onChange={(e) => onStatusChange && onStatusChange(e.target.value as 'New' | 'Contacted' | 'Closed')}
        style={{
          appearance: 'none',
          backgroundColor: style.bg,
          color: style.color,
          border: `1px solid ${style.border}`,
          borderRadius: '9999px',
          padding: '0.25rem 1.6rem 0.25rem 0.75rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Closed">Closed</option>
      </select>
      <ChevronDown
        size={13}
        style={{
          position: 'absolute',
          right: '0.5rem',
          pointerEvents: 'none',
          color: style.color
        }}
      />
    </div>
  );
};
