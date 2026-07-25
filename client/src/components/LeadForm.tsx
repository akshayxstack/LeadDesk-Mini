import React, { useState } from 'react';
import { api } from '../lib/api';
import { validateLeadForm, LeadFormData, ValidationErrors, BUDGET_RANGES } from '../lib/validation';
import { CheckCircle2, AlertCircle, Loader2, ChevronDown } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const validationErrors = validateLeadForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

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
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        padding: '2.25rem',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e2e8f0',
        width: '100%',
        maxWidth: '480px',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <h2
        style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          color: '#0f172a',
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}
      >
        Submit a Lead
      </h2>

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

        {/* Budget Range Field */}
        <div style={{ marginBottom: '1.25rem' }}>
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
          <div style={{ position: 'relative' }}>
            <select
              id="budget-select"
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleChange}
              style={{
                width: '100%',
                height: '46px',
                padding: '0 2.5rem 0 1rem',
                fontSize: '0.95rem',
                borderRadius: '8px',
                border: `1.5px solid ${errors.budgetRange ? '#ef4444' : '#cbd5e1'}`,
                backgroundColor: '#f8fafc',
                color: formData.budgetRange ? '#0f172a' : '#94a3b8',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="" disabled>
                Select budget range
              </option>
              {BUDGET_RANGES.map((range) => (
                <option key={range} value={range} style={{ color: '#0f172a' }}>
                  {range}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              style={{
                position: 'absolute',
                right: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#64748b'
              }}
            />
          </div>
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
      </form>
    </div>
  );
};
