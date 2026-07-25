export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const BUDGET_RANGES = ['<5k', '5-10k', '10k+'] as const;

export type BudgetRange = (typeof BUDGET_RANGES)[number];

export interface LeadFormData {
  name: string;
  email: string;
  budgetRange: string;
  message: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  budgetRange?: string;
  message?: string;
}

export const validateLeadForm = (data: LeadFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  const trimmedName = data.name.trim();
  if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 80) {
    errors.name = 'Name must be between 2 and 80 characters.';
  }

  const trimmedEmail = data.email.trim().toLowerCase();
  if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!data.budgetRange || !BUDGET_RANGES.includes(data.budgetRange as BudgetRange)) {
    errors.budgetRange = 'Select a valid budget range.';
  }

  const trimmedMessage = data.message.trim();
  if (!trimmedMessage || trimmedMessage.length < 10 || trimmedMessage.length > 1000) {
    errors.message = 'Message must be between 10 and 1000 characters.';
  }

  return errors;
};
