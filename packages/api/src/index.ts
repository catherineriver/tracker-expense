// Export main implementations
export { AuthAPI } from './auth'
export { ExpensesAPI as LocalExpensesAPI } from './expenses'
export { SupabaseExpensesAPI } from './supabase-expenses'
export { supabase, isSupabaseConfigured } from './supabase'

export { ExpenseStorage, LocalStorage } from './storage'

export { useAdvancedRealTime } from './hooks/useAdvancedRealTime'
export { useAdvancedRealTimeWeb } from './hooks/useAdvancedRealTimeWeb'

import { AuthAPI } from './auth'
import { SupabaseExpensesAPI } from './supabase-expenses'
export const ExpensesAPI = SupabaseExpensesAPI

export default {
  AuthAPI,
  ExpensesAPI
}
