// React hook for real-time expenses
import { useState, useEffect } from 'react'
import { Expense, CreateExpenseRequest, UpdateExpenseRequest, DashboardStats } from '../../../utils/src'
import { RealtimeExpensesAPI } from '../realtime-expenses'

export const useRealtimeExpenses = (userId?: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [realtimeAPI] = useState(() => new RealtimeExpensesAPI())

  useEffect(() => {
    if (!userId) return

    const initializeRealtime = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Initialize real-time connection
        await realtimeAPI.initialize(userId)

        // Subscribe to changes
        const unsubscribe = realtimeAPI.onExpensesChange(async (updatedExpenses) => {
          setExpenses(updatedExpenses)
          // Update dashboard stats when expenses change
          const stats = await realtimeAPI.getDashboardStats()
          setDashboardStats(stats)
        })

        // Load initial data
        const initialExpenses = await realtimeAPI.getExpenses()
        setExpenses(initialExpenses)
        
        const initialStats = await realtimeAPI.getDashboardStats()
        setDashboardStats(initialStats)

        setIsLoading(false)

        return unsubscribe
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize real-time data')
        setIsLoading(false)
      }
    }

    const cleanup = initializeRealtime()

    return () => {
      cleanup.then(unsubscribe => {
        if (unsubscribe) unsubscribe()
        realtimeAPI.disconnect()
      })
    }
  }, [userId])

  const createExpense = async (data: CreateExpenseRequest) => {
    try {
      setError(null)
      await realtimeAPI.createExpense(data)
      // Real-time subscription will update the state automatically
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expense')
      throw err
    }
  }

  const updateExpense = async (data: UpdateExpenseRequest) => {
    try {
      setError(null)
      await realtimeAPI.updateExpense(data)
      // Real-time subscription will update the state automatically
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update expense')
      throw err
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      setError(null)
      await realtimeAPI.deleteExpense(id)
      // Real-time subscription will update the state automatically
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense')
      throw err
    }
  }

  return {
    expenses,
    dashboardStats,
    isLoading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    // Direct API access if needed
    realtimeAPI
  }
}

// Example usage in component:
/*
import { useRealtimeExpenses } from '../../../../packages/api/src/hooks/useRealtimeExpenses'

export const Dashboard: React.FC = () => {
  const { expenses, dashboardStats, isLoading, error, createExpense } = useRealtimeExpenses('user-id')

  if (isLoading) return <Loading />
  if (error) return <Error message={error} />

  return (
    <View>
      <DashboardStats stats={dashboardStats} />
      <ExpensesList expenses={expenses} />
      <AddExpenseForm onAdd={createExpense} />
    </View>
  )
}
*/