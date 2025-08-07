export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory = 
  | 'food'
  | 'transport' 
  | 'entertainment'
  | 'shopping'
  | 'bills'
  | 'health'
  | 'travel'
  | 'other';

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

export interface ExpenseFilter {
  category?: ExpenseCategory;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface DashboardStats {
  totalExpenses: number;
  totalAmount: number;
  categoryBreakdown: Array<{
    category: ExpenseCategory;
    amount: number;
    count: number;
  }>;
  recentExpenses: Expense[];
}

export interface CreateExpenseRequest {
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {
  id: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}