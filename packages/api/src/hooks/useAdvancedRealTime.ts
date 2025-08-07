import { useState, useEffect, useCallback, useRef } from 'react'
import { Expense, CreateExpenseRequest, UpdateExpenseRequest, DashboardStats } from '@utils'
import { SupabaseExpensesAPI } from '../supabase-expenses'
import { AuthAPI } from '../auth'

interface UseAdvancedRealTimeOptions {
  enableOptimisticUpdates?: boolean
  enableNotifications?: boolean
  enableOfflineSupport?: boolean
  pollInterval?: number
}

interface UseAdvancedRealTimeReturn {
  // Data
  expenses: Expense[]
  dashboardStats: DashboardStats | null

  // Status
  isLoading: boolean
  isConnected: boolean
  isOnline: boolean
  error: string | null
  lastUpdated: Date | null
  pendingOperations: number

  // Actions
  createExpense: (data: CreateExpenseRequest) => Promise<void>
  updateExpense: (data: UpdateExpenseRequest) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  refresh: () => Promise<void>
  clearError: () => void
}

export const useAdvancedRealTime = (
  options: UseAdvancedRealTimeOptions = {}
): UseAdvancedRealTimeReturn => {
  const {
    enableOptimisticUpdates = true,
    enableNotifications = true,
    enableOfflineSupport = true,
    pollInterval = 30000
  } = options

  // State
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [pendingOperations, setPendingOperations] = useState(0)

  // Refs
  const expensesAPI = useRef(new SupabaseExpensesAPI())
  const authAPI = useRef(AuthAPI.getInstance())
  const subscriptionRef = useRef<any>(null)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const offlineQueue = useRef<Array<{ action: string, data: any }>>([])

  // Generate optimistic ID
  const generateOptimisticId = useCallback(() => {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }, [])

  // Update dashboard stats
  const updateStats = useCallback(async (expenseList: Expense[]) => {
    try {
      const { calculateDashboardStats } = await import('../../../utils/src')
      const stats = calculateDashboardStats(expenseList)
      setDashboardStats(stats)
    } catch (err) {
      console.error('Error calculating stats:', err)
    }
  }, [])

  // Show notification
  const showNotification = useCallback((title: string, body: string) => {
    if (!enableNotifications) return

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' })
    }
  }, [enableNotifications])

  // Process offline queue
  const processOfflineQueue = useCallback(async () => {
    if (!enableOfflineSupport || offlineQueue.current.length === 0) return

    console.log('🔄 Processing offline queue:', offlineQueue.current.length, 'items')
    const queue = [...offlineQueue.current]
    offlineQueue.current = []

    for (const item of queue) {
      try {
        switch (item.action) {
          case 'create':
            await expensesAPI.current.createExpense(item.data)
            break
          case 'update':
            await expensesAPI.current.updateExpense(item.data)
            break
          case 'delete':
            await expensesAPI.current.deleteExpense(item.data)
            break
        }
      } catch (err) {
        console.error('Failed to process offline item:', item, err)
        // Could re-queue or show user notification
      }
    }

    showNotification('💰 Sync Complete', 'Your offline changes have been synced')
  }, [enableOfflineSupport, showNotification])

  // Initialize real-time connection
  const initialize = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check auth
      const isAuth = await authAPI.current.isAuthenticated()
      if (!isAuth) {
        throw new Error('Authentication required')
      }

      // Load initial data
      const initialExpenses = await expensesAPI.current.getExpenses()
      setExpenses(initialExpenses)
      await updateStats(initialExpenses)
      setLastUpdated(new Date())

      // Set up real-time subscription
      subscriptionRef.current = expensesAPI.current.subscribeToExpenses(async (updatedExpenses) => {
        console.log('📡 Real-time update:', updatedExpenses.length, 'expenses')
        setExpenses(updatedExpenses)
        await updateStats(updatedExpenses)
        setLastUpdated(new Date())
        setIsConnected(true)

        if (error) setError(null)
      })

      setIsConnected(true)
      setIsLoading(false)

      // Process any offline queue
      await processOfflineQueue()

      // Set up polling fallback
      if (pollInterval > 0) {
        pollIntervalRef.current = setInterval(async () => {
          if (!isConnected) {
            try {
              const polledExpenses = await expensesAPI.current.getExpenses()
              setExpenses(polledExpenses)
              await updateStats(polledExpenses)
              setLastUpdated(new Date())
            } catch (pollError) {
              console.warn('Polling failed:', pollError)
            }
          }
        }, pollInterval)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize')
      setIsLoading(false)
    }
  }, [error, isConnected, pollInterval, updateStats, processOfflineQueue])

  // Cleanup
  const cleanup = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
      subscriptionRef.current = null
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }, [])

  // CRUD operations with optimistic updates and offline support
  const createExpense = useCallback(async (data: CreateExpenseRequest) => {
    setPendingOperations(prev => prev + 1)

    try {
      if (enableOptimisticUpdates) {
        const optimisticExpense: Expense = {
          id: generateOptimisticId(),
          userId: 'current-user',
          amount: data.amount,
          category: data.category,
          description: data.description,
          date: data.date,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        setExpenses(prev => [optimisticExpense, ...prev])
        await updateStats([optimisticExpense, ...expenses])
      }

      if (!isOnline && enableOfflineSupport) {
        // Queue for later
        offlineQueue.current.push({ action: 'create', data })
        showNotification('💾 Saved Offline', 'Expense will sync when online')
        return
      }

      await expensesAPI.current.createExpense(data)
      showNotification('✅ Expense Added', `${data.description} - $${data.amount}`)

    } catch (err) {
      // Revert optimistic update
      if (enableOptimisticUpdates) {
        const refreshedExpenses = await expensesAPI.current.getExpenses()
        setExpenses(refreshedExpenses)
        await updateStats(refreshedExpenses)
      }

      const errorMsg = err instanceof Error ? err.message : 'Failed to create expense'
      setError(errorMsg)
      showNotification('❌ Error', errorMsg)
      throw err
    } finally {
      setPendingOperations(prev => prev - 1)
    }
  }, [enableOptimisticUpdates, enableOfflineSupport, generateOptimisticId, expenses, isOnline, updateStats, showNotification])

  const updateExpense = useCallback(async (data: UpdateExpenseRequest) => {
    setPendingOperations(prev => prev + 1)

    try {
      if (enableOptimisticUpdates) {
        setExpenses(prev => prev.map(expense =>
          expense.id === data.id
            ? { ...expense, ...data, updatedAt: new Date().toISOString() }
            : expense
        ))
      }

      if (!isOnline && enableOfflineSupport) {
        offlineQueue.current.push({ action: 'update', data })
        showNotification('💾 Saved Offline', 'Changes will sync when online')
        return
      }

      await expensesAPI.current.updateExpense(data)

    } catch (err) {
      if (enableOptimisticUpdates) {
        const refreshedExpenses = await expensesAPI.current.getExpenses()
        setExpenses(refreshedExpenses)
        await updateStats(refreshedExpenses)
      }

      const errorMsg = err instanceof Error ? err.message : 'Failed to update expense'
      setError(errorMsg)
      showNotification('❌ Error', errorMsg)
      throw err
    } finally {
      setPendingOperations(prev => prev - 1)
    }
  }, [enableOptimisticUpdates, enableOfflineSupport, isOnline, updateStats, showNotification])

  const deleteExpense = useCallback(async (id: string) => {
    setPendingOperations(prev => prev + 1)

    try {
      if (enableOptimisticUpdates) {
        const filteredExpenses = expenses.filter(expense => expense.id !== id)
        setExpenses(filteredExpenses)
        await updateStats(filteredExpenses)
      }

      if (!isOnline && enableOfflineSupport) {
        offlineQueue.current.push({ action: 'delete', data: id })
        showNotification('💾 Saved Offline', 'Deletion will sync when online')
        return
      }

      await expensesAPI.current.deleteExpense(id)
      showNotification('🗑️ Expense Deleted', 'Expense removed successfully')

    } catch (err) {
      if (enableOptimisticUpdates) {
        const refreshedExpenses = await expensesAPI.current.getExpenses()
        setExpenses(refreshedExpenses)
        await updateStats(refreshedExpenses)
      }

      const errorMsg = err instanceof Error ? err.message : 'Failed to delete expense'
      setError(errorMsg)
      showNotification('❌ Error', errorMsg)
      throw err
    } finally {
      setPendingOperations(prev => prev - 1)
    }
  }, [enableOptimisticUpdates, enableOfflineSupport, expenses, isOnline, updateStats, showNotification])

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const refreshedExpenses = await expensesAPI.current.getExpenses()
      setExpenses(refreshedExpenses)
      await updateStats(refreshedExpenses)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh')
    }
  }, [updateStats])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Effects
  useEffect(() => {
    initialize()

    // Request notification permission
    if (enableNotifications && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }

    return cleanup
  }, [initialize, cleanup, enableNotifications])

  return {
    expenses,
    dashboardStats,
    isLoading,
    isConnected,
    isOnline,
    error,
    lastUpdated,
    pendingOperations,
    createExpense,
    updateExpense,
    deleteExpense,
    refresh,
    clearError
  }
}
