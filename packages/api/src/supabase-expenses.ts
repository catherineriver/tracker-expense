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

export class SupabaseExpensesAPI {

  private async requireAuth(): Promise<string> {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      throw new Error('Authentication required')
    }
    
    return user.id
  }


  async createExpense(request: CreateExpenseRequest): Promise<Expense> {
    const validation = validateExpense(request)
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '))
    }

    try {
      const userId = await this.requireAuth()
      
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
      throw new Error(error instanceof Error ? error.message : 'Failed to create expense')
    }
  }

  async getExpenses(filter?: ExpenseFilter, sortBy?: 'date' | 'amount' | 'category', sortOrder?: 'asc' | 'desc'): Promise<Expense[]> {
    try {
      const userId = await this.requireAuth()
      return await this.getExpensesForUser(userId, filter, sortBy, sortOrder)
    } catch (error) {
      console.error('Get expenses error:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch expenses')
    }
  }

  async updateExpense(request: UpdateExpenseRequest): Promise<Expense> {
    try {
      const userId = await this.requireAuth()

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
      throw new Error(error instanceof Error ? error.message : 'Failed to update expense')
    }
  }

  async deleteExpense(id: string): Promise<void> {
    try {
      const userId = await this.requireAuth()
      
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Delete expense error:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to delete expense')
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

      const userId = await this.requireAuth()
      const reportId = this.generateId()

      return { id: reportId, expenses, stats }
    } catch (error) {
      console.error('Generate shareable report error:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to generate shareable report')
    }
  }

  async getSharedReport(reportId: string): Promise<{ expenses: Expense[]; stats: DashboardStats } | null> {
    // TODO: Query shared_reports table in Supabase
    throw new Error('Shared reports not yet implemented')
  }

  private async getExpensesForUser(userId: string, filter?: ExpenseFilter, sortBy?: 'date' | 'amount' | 'category', sortOrder?: 'asc' | 'desc'): Promise<Expense[]> {
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
  }

  // Real-time subscription method
  subscribeToExpenses(callback: (expenses: Expense[]) => void) {
    let userId: string | null = null

    // Get the current user ID
    this.requireAuth().then(id => {
      userId = id

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
            // When any change occurs, fetch the latest expenses without auth check
            try {
              const expenses = await this.getExpensesForUser(userId!)
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
