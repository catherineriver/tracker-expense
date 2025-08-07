import { Expense, ExpenseFilter, DashboardStats, ExpenseCategory } from './types';

export const filterExpenses = (expenses: Expense[], filter: ExpenseFilter): Expense[] => {
  return expenses.filter(expense => {
    if (filter.category && expense.category !== filter.category) {
      return false;
    }

    if (filter.startDate && expense.date < filter.startDate) {
      return false;
    }

    if (filter.endDate && expense.date > filter.endDate) {
      return false;
    }

    if (filter.minAmount && expense.amount < filter.minAmount) {
      return false;
    }

    if (filter.maxAmount && expense.amount > filter.maxAmount) {
      return false;
    }

    return true;
  });
};

export const calculateTotal = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const calculateCategoryBreakdown = (expenses: Expense[]) => {
  const breakdown = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = { amount: 0, count: 0 };
    }
    acc[category].amount += expense.amount;
    acc[category].count += 1;
    return acc;
  }, {} as Record<ExpenseCategory, { amount: number; count: number }>);

  return Object.entries(breakdown).map(([category, data]) => ({
    category: category as ExpenseCategory,
    amount: data.amount,
    count: data.count,
  }));
};

export const calculateDashboardStats = (expenses: Expense[]): DashboardStats => {
  const totalAmount = calculateTotal(expenses);
  const categoryBreakdown = calculateCategoryBreakdown(expenses);
  
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    totalExpenses: expenses.length,
    totalAmount,
    categoryBreakdown,
    recentExpenses,
  };
};

export const sortExpenses = (expenses: Expense[], sortBy: 'date' | 'amount' | 'category' = 'date', order: 'asc' | 'desc' = 'desc'): Expense[] => {
  return [...expenses].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'date':
        aValue = a.date;
        bValue = b.date;
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'category':
        aValue = a.category;
        bValue = b.category;
        break;
      default:
        aValue = a.date;
        bValue = b.date;
    }

    if (order === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};