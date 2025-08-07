import { 
  Expense, 
  CreateExpenseRequest, 
  UpdateExpenseRequest, 
  ExpenseFilter,
  DashboardStats,
  validateExpense,
  filterExpenses,
  calculateDashboardStats,
  sortExpenses
} from "@utils";
import { ExpenseStorage, LocalStorage } from './storage';

export class ExpensesAPI {
  private storage = new ExpenseStorage();
  
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
  
  private async requireAuth(): Promise<string> {
    const user = await this.storage.getUser();
    if (!user) {
      throw new Error('Authentication required');
    }
    return user.id;
  }
  
  async createExpense(request: CreateExpenseRequest): Promise<Expense> {
    const userId = await this.requireAuth();
    
    const validation = validateExpense(request);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }
    
    const now = new Date().toISOString();
    const expense: Expense = {
      id: this.generateId(),
      userId,
      amount: request.amount,
      category: request.category,
      description: request.description.trim(),
      date: request.date,
      createdAt: now,
      updatedAt: now
    };
    
    const expenses = await this.storage.getExpenses(userId);
    expenses.push(expense);
    await this.storage.saveExpenses(userId, expenses);
    
    return expense;
  }
  
  async getExpenses(filter?: ExpenseFilter, sortBy?: 'date' | 'amount' | 'category', sortOrder?: 'asc' | 'desc'): Promise<Expense[]> {
    const userId = await this.requireAuth();
    let expenses = await this.storage.getExpenses(userId);
    
    if (filter) {
      expenses = filterExpenses(expenses, filter);
    }
    
    if (sortBy) {
      expenses = sortExpenses(expenses, sortBy, sortOrder);
    }
    
    return expenses;
  }
  
  async updateExpense(request: UpdateExpenseRequest): Promise<Expense> {
    const userId = await this.requireAuth();
    
    if (request.amount !== undefined || request.category || request.description || request.date) {
      const validationRequest = {
        amount: request.amount || 0,
        category: request.category || 'other',
        description: request.description || '',
        date: request.date || ''
      };
      const validation = validateExpense(validationRequest);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }
    }
    
    const expenses = await this.storage.getExpenses(userId);
    const expenseIndex = expenses.findIndex(e => e.id === request.id && e.userId === userId);
    
    if (expenseIndex === -1) {
      throw new Error('Expense not found');
    }
    
    const updatedExpense: Expense = {
      ...expenses[expenseIndex],
      ...(request.amount !== undefined && { amount: request.amount }),
      ...(request.category && { category: request.category }),
      ...(request.description && { description: request.description.trim() }),
      ...(request.date && { date: request.date }),
      updatedAt: new Date().toISOString()
    };
    
    expenses[expenseIndex] = updatedExpense;
    await this.storage.saveExpenses(userId, expenses);
    
    return updatedExpense;
  }
  
  async deleteExpense(id: string): Promise<void> {
    const userId = await this.requireAuth();
    
    const expenses = await this.storage.getExpenses(userId);
    const filteredExpenses = expenses.filter(e => !(e.id === id && e.userId === userId));
    
    if (filteredExpenses.length === expenses.length) {
      throw new Error('Expense not found');
    }
    
    await this.storage.saveExpenses(userId, filteredExpenses);
  }
  
  async getDashboardStats(): Promise<DashboardStats> {
    const userId = await this.requireAuth();
    const expenses = await this.storage.getExpenses(userId);
    return calculateDashboardStats(expenses);
  }
  
  async generateShareableReport(): Promise<{ id: string; expenses: Expense[]; stats: DashboardStats }> {
    const userId = await this.requireAuth();
    const expenses = await this.storage.getExpenses(userId);
    const stats = calculateDashboardStats(expenses);
    
    const reportId = this.generateId();
    const reportKey = `expense_report_${reportId}`;
    
    const reportData = {
      id: reportId,
      expenses,
      stats,
      createdAt: new Date().toISOString(),
      userId
    };
    
    const localStorage = new LocalStorage();
    await localStorage.setItem(reportKey, reportData);
    
    return { id: reportId, expenses, stats };
  }
  
  async getSharedReport(reportId: string): Promise<{ expenses: Expense[]; stats: DashboardStats } | null> {
    const localStorage = new LocalStorage();
    const reportKey = `expense_report_${reportId}`;
    const reportData = await localStorage.getItem(reportKey);
    
    if (!reportData) {
      return null;
    }
    
    const parsedData = reportData as any;
    return {
      expenses: parsedData.expenses,
      stats: parsedData.stats
    };
  }
}
