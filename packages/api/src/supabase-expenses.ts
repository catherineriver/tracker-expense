import { supabase } from './supabase'
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
} from '../../utils/src'
// Fallback to local storage if Supabase is not configured
import { ExpensesAPI as LocalExpensesAPI } from './expenses'

export class SupabaseExpensesAPI {
  private localAPI = new LocalExpensesAPI()

  private async requireAuth(): Promise<string> {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      throw new Error('Authentication required')
    }
    
    return user.id
  }

  private async checkAuth(): Promise<string | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        return null
      }
      
      return user.id
    } catch (error) {
      return null
    }
  }

  async createExpense(request: CreateExpenseRequest): Promise<Expense> {
    const validation = validateExpense(request)
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '))
    }

    try {
      const userId = await this.checkAuth()
      
      // If not authenticated, fall back to local storage
      if (!userId) {
        console.log('User not authenticated, creating expense in local storage')
        return this.localAPI.createExpense(request)
      }
      
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            user_id: userId,
            amount: request.amount,
            category: request.category,
            description: request.description.trim() || null,
            date: request.date,
          }
        ])
        .select()
        .single()

      if (error) throw error
      
      return this.mapSupabaseExpense(data)
    } catch (error) {
      console.error('Create expense error:', error)
      // If Supabase fails, try to fall back to local storage
      console.log('Supabase failed, creating expense in local storage')
      return this.localAPI.createExpense(request)
    }
  }

  async getExpenses(filter?: ExpenseFilter, sortBy?: 'date' | 'amount' | 'category', sortOrder?: 'asc' | 'desc'): Promise<Expense[]> {
    try {
      const userId = await this.checkAuth()
      
      // If not authenticated, fall back to local storage
      if (!userId) {
        console.log('User not authenticated, falling back to local storage')
        return this.localAPI.getExpenses(filter, sortBy, sortOrder)
      }
      
      let query = supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)

      // Apply sorting at database level for better performance
      if (sortBy) {
        const supabaseColumn = sortBy === 'date' ? 'created_at' : sortBy
        query = query.order(supabaseColumn, { ascending: sortOrder === 'asc' })
      } else {
        // Default sorting by creation date, newest first
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error
      
      let expenses = data.map(this.mapSupabaseExpense)

      // Apply filters on client side (could be moved to database for better performance)
      if (filter) {
        expenses = filterExpenses(expenses, filter)
      }

      return expenses
    } catch (error) {
      console.error('Get expenses error:', error)
      // If Supabase fails, try to fall back to local storage
      console.log('Supabase failed, falling back to local storage')
      return this.localAPI.getExpenses(filter, sortBy, sortOrder)
    }
  }

  async updateExpense(request: UpdateExpenseRequest): Promise<Expense> {
    try {
      const userId = await this.checkAuth()
      
      // If not authenticated, fall back to local storage
      if (!userId) {
        console.log('User not authenticated, updating expense in local storage')
        return this.localAPI.updateExpense(request)
      }

      // Validate the update data
      if (request.amount !== undefined || request.category || request.description || request.date) {
        const validationRequest = {
          amount: request.amount || 0,
          category: request.category || 'other',
          description: request.description || '',
          date: request.date || ''
        }
        const validation = validateExpense(validationRequest)
        if (!validation.valid) {
          throw new Error(validation.errors.join(', '))
        }
      }

      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      if (request.amount !== undefined) updateData.amount = request.amount
      if (request.category) updateData.category = request.category
      if (request.description !== undefined) updateData.description = request.description.trim() || null
      if (request.date) updateData.date = request.date

      const { data, error } = await supabase
        .from('expenses')
        .update(updateData)
        .eq('id', request.id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      
      if (!data) {
        throw new Error('Expense not found')
      }

      return this.mapSupabaseExpense(data)
    } catch (error) {
      console.error('Update expense error:', error)
      // If Supabase fails, try to fall back to local storage
      console.log('Supabase failed, updating expense in local storage')
      return this.localAPI.updateExpense(request)
    }
  }

  async deleteExpense(id: string): Promise<void> {
    try {
      const userId = await this.checkAuth()
      
      // If not authenticated, fall back to local storage
      if (!userId) {
        console.log('User not authenticated, deleting expense from local storage')
        return this.localAPI.deleteExpense(id)
      }
      
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Delete expense error:', error)
      // If Supabase fails, try to fall back to local storage
      console.log('Supabase failed, deleting expense from local storage')
      return this.localAPI.deleteExpense(id)
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {

    try {
      const expenses = await this.getExpenses()
      return calculateDashboardStats(expenses)
    } catch (error) {
      console.error('Get dashboard stats error:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch dashboard stats')
    }
  }

  async generateShareableReport(): Promise<{ id: string; expenses: Expense[]; stats: DashboardStats }> {
    try {
      const expenses = await this.getExpenses()
      const stats = calculateDashboardStats(expenses)
      
      const reportId = this.generateId()
      
      // Store the shareable report in Supabase (you might want to create a separate table for this)
      // For now, we'll use the same approach as the local API
      const reportKey = `expense_report_${reportId}`
      const userId = await this.checkAuth()
      const reportData = {
        id: reportId,
        expenses,
        stats,
        createdAt: new Date().toISOString(),
        userId: userId || 'anonymous'
      }

      // You could store this in a separate 'shared_reports' table for better organization
      // For now, using localStorage as fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem(reportKey, JSON.stringify(reportData))
      }

      return { id: reportId, expenses, stats }
    } catch (error) {
      console.error('Generate shareable report error:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to generate shareable report')
    }
  }

  async getSharedReport(reportId: string): Promise<{ expenses: Expense[]; stats: DashboardStats } | null> {
    // This would typically query a 'shared_reports' table
    // For now, falling back to localStorage
    try {
      if (typeof window !== 'undefined') {
        const reportKey = `expense_report_${reportId}`
        const reportData = localStorage.getItem(reportKey)
        
        if (reportData) {
          const parsed = JSON.parse(reportData)
          return {
            expenses: parsed.expenses,
            stats: parsed.stats
          }
        }
      }
      return null
    } catch (error) {
      console.error('Get shared report error:', error)
      return null
    }
  }

  // Real-time subscription method
  subscribeToExpenses(callback: (expenses: Expense[]) => void) {
    let userId: string | null = null

    // Get the current user ID
    this.checkAuth().then(id => {
      userId = id

      // If not authenticated, just return empty subscription
      if (!userId) {
        console.log('User not authenticated, skipping real-time subscription')
        return { 
          unsubscribe: () => {
            // No-op
          }
        }
      }

      const channel = supabase
        .channel('expenses-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'expenses',
            filter: `user_id=eq.${userId}`
          },
          async () => {
            // When any change occurs, fetch the latest expenses
            try {
              const expenses = await this.getExpenses()
              callback(expenses)
            } catch (error) {
              console.error('Error fetching expenses after real-time update:', error)
            }
          }
        )
        .subscribe()

      return { 
        unsubscribe: () => {
          supabase.removeChannel(channel)
        }
      }
    }).catch(error => {
      console.error('Error setting up real-time subscription:', error)
    })

    // Return immediate unsubscribe function
    return { 
      unsubscribe: () => {
        // Channel cleanup will happen in the async block above
      }
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  private mapSupabaseExpense(data: any): Expense {
    return {
      id: data.id,
      userId: data.user_id,
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description || '',
      date: data.date,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }
}
