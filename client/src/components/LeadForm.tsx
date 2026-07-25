import React, { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { validateLeadForm, LeadFormData, ValidationErrors, BUDGET_RANGES, BudgetRange } from '../lib/validation';
import { CheckCircle2, AlertCircle, Loader2, ChevronDown, Check } from 'lucide-react';

interface BudgetOptionConfig {
  value: BudgetRange;
  label: string;
  subtext: string;
  badgeClass: string;
}

const BUDGET_OPTIONS: BudgetOptionConfig[] = [
  {
    value: '<5k',
    label: '<5k',
    subtext: 'Under $5,000 • Starter',
    badgeClass: 'badge-5k'
  },
  {
    value: '5-10k',
    label: '5-10k',
    subtext: '$5,000 – $10,000 • Growth',
    badgeClass: 'badge-5-10k'
  },
  {
    value: '10k+',
    label: '10k+',
    subtext: '$10,000+ • Enterprise',
    badgeClass: 'badge-10k'
  }
];

export const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    budgetRange: '',
    message: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear individual error as user types
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleSelectBudget = (val: string) => {
    setFormData((prev) => ({ ...prev, budgetRange: val }));
    if (errors.budgetRange) {
      setErrors((prev) => ({ ...prev, budgetRange: undefined }));
    }
    if (serverError) setServerError(null);
    if (successMessage) setSuccessMessage(null);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const validationErrors = validateLeadForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoadingState(true);

    try {
      await api.submitLead({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        budgetRange: formData.budgetRange,
        message: formData.message.trim()
      });

      setSuccessMessage('Thank you! Your lead has been submitted successfully.');
      setFormData({
        name: '',
        email: '',
        budgetRange: '',
        message: ''
      });
      setErrors({});
    } catch (err: any) {
      setServerError(err.message || 'Failed to submit lead. Please try again.');
    } finally {
      setIsLoadingState(false);
    }
  };

  const setIsLoadingState = (loading: boolean) => {
    setIsSubmitting(loading);
  };

  const selectedConfig = BUDGET_OPTIONS.find((opt) => opt.value === formData.budgetRange);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '2.25rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e2e8f0',
        width: '100%',
        maxWidth: '480px',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
        <h2
          style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '0.35rem'
          }}
        >
          Submit a Lead
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5 }}>
          We’d love to hear from you! Please share your project details below, and our team will get in touch with you shortly.
        </p>
      </div>

      {serverError && (
        <div className="alert-error">
          <AlertCircle size={18} />
          <span>{serverError}</span>
        </div>
      )}

      {successMessage && (
        <div className="alert-success">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Name Field */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="name-input"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.375rem'
            }}
          >
            Name <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
          </label>
          <input
            id="name-input"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: '100%',
              height: '46px',
              padding: '0 1rem',
              fontSize: '0.95rem',
              borderRadius: '8px',
              border: `1.5px solid ${errors.name ? '#ef4444' : '#cbd5e1'}`,
              backgroundColor: '#f8fafc',
              color: '#0f172a'
            }}
          />
          {errors.name && (
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="email-input"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.375rem'
            }}
          >
            Email <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
          </label>
          <input
            id="email-input"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              height: '46px',
              padding: '0 1rem',
              fontSize: '0.95rem',
              borderRadius: '8px',
              border: `1.5px solid ${errors.email ? '#ef4444' : '#cbd5e1'}`,
              backgroundColor: '#f8fafc',
              color: '#0f172a'
            }}
          />
          {errors.email && (
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Budget Range Field (Custom Interactive Dropdown) */}
        <div style={{ marginBottom: '1.25rem', position: 'relative' }} ref={dropdownRef}>
          <label
            htmlFor="budget-select"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.375rem'
            }}
          >
            Budget Range <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
          </label>

          {/* Hidden native select for form accessibility & test selectors */}
          <select
            id="budget-select"
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            style={{
              position: 'absolute',
              opacity: 0,
              pointerEvents: 'none',
              width: '1px',
              height: '1px'
            }}
            tabIndex={-1}
          >
            <option value="" disabled>Select budget range</option>
            {BUDGET_RANGES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Custom Select Trigger Button */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsDropdownOpen(!isDropdownOpen);
              }
            }}
            style={{
              width: '100%',
              height: '46px',
              padding: '0 1rem',
              fontSize: '0.95rem',
              borderRadius: '8px',
              border: `1.5px solid ${errors.budgetRange ? '#ef4444' : isDropdownOpen ? '#2563eb' : '#cbd5e1'}`,
              backgroundColor: isDropdownOpen ? '#ffffff' : '#f8fafc',
              boxShadow: isDropdownOpen ? '0 0 0 3.5px rgba(37, 99, 235, 0.15)' : 'none',
              color: formData.budgetRange ? '#0f172a' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {selectedConfig ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge-budget ${selectedConfig.badgeClass}`}>
                  {selectedConfig.label}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  ({selectedConfig.subtext.split('•')[1]?.trim() || selectedConfig.subtext})
                </span>
              </div>
            ) : (
              <span>Select budget range</span>
            )}

            <ChevronDown
              size={18}
              style={{
                color: isDropdownOpen ? '#2563eb' : '#64748b',
                transition: 'transform 0.2s ease-in-out',
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                flexShrink: 0
              }}
            />
          </div>

          {/* Floating Dropdown Menu */}
          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.04)',
                zIndex: 50,
                padding: '0.4rem',
                animation: 'fadeIn 0.2s ease-out forwards'
              }}
            >
              {BUDGET_OPTIONS.map((option) => {
                const isSelected = formData.budgetRange === option.value;
                return (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectBudget(option.value)}
                    style={{
                      padding: '0.625rem 0.75rem',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <span className={`badge-budget ${option.badgeClass}`}>
                        {option.label}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: isSelected ? 600 : 400 }}>
                        {option.subtext}
                      </span>
                    </div>

                    {isSelected && (
                      <Check size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {errors.budgetRange && (
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              {errors.budgetRange}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="message-input"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.375rem'
            }}
          >
            Message <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
          </label>
          <textarea
            id="message-input"
            name="message"
            rows={4}
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '0.95rem',
              borderRadius: '8px',
              border: `1.5px solid ${errors.message ? '#ef4444' : '#cbd5e1'}`,
              backgroundColor: '#f8fafc',
              resize: 'vertical',
              minHeight: '105px',
              color: '#0f172a'
            }}
          />
          {errors.message && (
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          id="submit-lead-btn"
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
          style={{
            width: '100%',
            height: '48px',
            fontSize: '1rem',
            fontWeight: 700,
            borderRadius: '8px'
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              Submitting...
            </>
          ) : (
            'Submit Lead'
          )}
        </button>

        {/* Reassurance Privacy Note */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            marginTop: '0.875rem',
            color: '#94a3b8',
            fontSize: '0.75rem'
          }}
        >
          <span>🔒 We respect your privacy. No spam, ever.</span>
        </div>
      </form>
    </div>
  );
};

