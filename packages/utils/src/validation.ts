import { CreateExpenseRequest, ExpenseCategory, AuthRequest } from './types';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'food',
  'transport',
  'entertainment', 
  'shopping',
  'bills',
  'health',
  'travel',
  'other'
];

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  return { valid: true };
};

export const validateExpense = (expense: CreateExpenseRequest): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!expense.amount || expense.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (expense.amount > 999999) {
    errors.push('Amount cannot exceed $999,999');
  }

  if (!expense.category || !EXPENSE_CATEGORIES.includes(expense.category)) {
    errors.push('Invalid category');
  }

  if (!expense.description || expense.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (expense.description && expense.description.length > 200) {
    errors.push('Description cannot exceed 200 characters');
  }

  if (!expense.date) {
    errors.push('Date is required');
  } else {
    const date = new Date(expense.date);
    if (isNaN(date.getTime())) {
      errors.push('Invalid date');
    }
  }

  return { valid: errors.length === 0, errors };
};

export const validateAuth = (auth: AuthRequest): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!auth.email || !validateEmail(auth.email)) {
    errors.push('Invalid email address');
  }

  const passwordValidation = validatePassword(auth.password);
  if (!passwordValidation.valid && passwordValidation.error) {
    errors.push(passwordValidation.error);
  }

  return { valid: errors.length === 0, errors };
};