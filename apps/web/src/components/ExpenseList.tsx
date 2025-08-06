'use client'

import React, { useState, useEffect } from 'react'
import { ExpensesAPI } from '@api'
import { Expense, ExpenseFilter, ExpenseCategory, EXPENSE_CATEGORIES, formatDate } from '@utils'
import { ExpenseCard, BaseInput } from '@ui'

export const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filter, setFilter] = useState<ExpenseFilter>({})

  const expensesAPI = new ExpensesAPI()

  useEffect(() => {
    loadExpenses()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [expenses, filter])

  const loadExpenses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const expenseList = await expensesAPI.getExpenses(undefined, 'date', 'desc')
      setExpenses(expenseList)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses')
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...expenses]

    if (filter.category) {
      filtered = filtered.filter(expense => expense.category === filter.category)
    }

    if (filter.startDate) {
      filtered = filtered.filter(expense => expense.date >= filter.startDate!)
    }

    if (filter.endDate) {
      filtered = filtered.filter(expense => expense.date <= filter.endDate!)
    }

    if (filter.minAmount) {
      filtered = filtered.filter(expense => expense.amount >= filter.minAmount!)
    }

    if (filter.maxAmount) {
      filtered = filtered.filter(expense => expense.amount <= filter.maxAmount!)
    }

    setFilteredExpenses(filtered)
  }

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return
    }

    try {
      await expensesAPI.deleteExpense(expenseId)
      setExpenses(prev => prev.filter(e => e.id !== expenseId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete expense')
    }
  }

  const clearFilters = () => {
    setFilter({})
  }

  const hasActiveFilters = Object.keys(filter).some(key => filter[key as keyof ExpenseFilter] !== undefined)

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px 16px' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '16px', color: 'var(--secondary-color)' }}>
          Loading expenses...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px 16px' }}>
        <p style={{ color: 'var(--error-color)', marginBottom: '16px' }}>
          {error}
        </p>
        <button 
          onClick={loadExpenses}
          className="button button-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
          Expenses ({filteredExpenses.length})
        </h2>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="button button-secondary"
          style={{ 
            padding: '8px 16px',
            fontSize: '14px',
            minHeight: '36px'
          }}
        >
          {showFilters ? 'Hide' : 'Filter'} 🔍
        </button>
      </div>

      {showFilters && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
            Filters
          </h3>
          
          <div style={{ 
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
          }}>
            <div className="form-group">
              <label className="label">Category</label>
              <select 
                value={filter.category || ''}
                onChange={(e) => setFilter(prev => ({ 
                  ...prev, 
                  category: e.target.value as ExpenseCategory || undefined 
                }))}
                className="input"
              >
                <option value="">All Categories</option>
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label">Start Date</label>
              <input
                type="date"
                value={filter.startDate || ''}
                onChange={(e) => setFilter(prev => ({ 
                  ...prev, 
                  startDate: e.target.value || undefined 
                }))}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">End Date</label>
              <input
                type="date"
                value={filter.endDate || ''}
                onChange={(e) => setFilter(prev => ({ 
                  ...prev, 
                  endDate: e.target.value || undefined 
                }))}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Min Amount</label>
              <input
                type="number"
                step="0.01"
                value={filter.minAmount || ''}
                onChange={(e) => setFilter(prev => ({ 
                  ...prev, 
                  minAmount: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                className="input"
                placeholder="$0.00"
              />
            </div>

            <div className="form-group">
              <label className="label">Max Amount</label>
              <input
                type="number"
                step="0.01"
                value={filter.maxAmount || ''}
                onChange={(e) => setFilter(prev => ({ 
                  ...prev, 
                  maxAmount: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                className="input"
                placeholder="$0.00"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={clearFilters}
                className="button button-secondary"
                style={{ fontSize: '14px', padding: '8px 16px', minHeight: '36px' }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {filteredExpenses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 16px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h3 style={{ marginBottom: '8px' }}>
            {expenses.length === 0 ? 'No expenses yet' : 'No matching expenses'}
          </h3>
          <p style={{ color: 'var(--secondary-color)' }}>
            {expenses.length === 0 
              ? 'Start by adding your first expense!'
              : 'Try adjusting your filters or clear them to see all expenses.'
            }
          </p>
        </div>
      ) : (
        <div>
          {filteredExpenses.map(expense => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onDelete={() => handleDeleteExpense(expense.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
