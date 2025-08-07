'use client'

import React, { useState, useEffect } from 'react'
import { ExpensesAPI } from '@api'
import { Expense, ExpenseFilter } from '@utils'
import { ExpenseCard } from '@/components/features/expenses/ExpenseCard/ExpenseCard'
import styles from './ExpenseList.module.css'
import {Filters} from "@/components/features/filters/Filters";
import {Loading} from "@/components/ui/Loading/Loading";
import {Error} from "@/components/ui/Error/Error";
import {PageTitle} from "@/components/ui/PageTitle/PageTitle";
import {PageLayout} from "@/components/layout/PageLayout/PageLayout";
import {EmptyState} from "@/components/ui/EmptyState/EmptyState";

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
      setError('Failed to load expenses')
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
      alert(err instanceof Error ? err : 'Failed to delete expense')
    }
  }

  const clearFilters = () => {
    setFilter({})
  }

  const hasActiveFilters = Object.keys(filter).some(key => filter[key as keyof ExpenseFilter] !== undefined)

  if (isLoading) {
    return (
      <Loading text={'Loading expenses...'} />
    )
  }

  if (error) {
    return (
      <Error message={error} onRetry={() => console.error('Something went wrong')} />
    )
  }

  return (
      <PageLayout>
      <div className={styles.header}>
         <PageTitle additionalContent={`(${filteredExpenses.length})`}>Expenses</PageTitle>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={styles.filterToggle}
        >
          {showFilters ? 'Hide' : 'Filter'}
        </button>
      </div>

      {showFilters && (
          <Filters
              filter={filter}
              setFilter={setFilter}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
          />
      )}

      {filteredExpenses.length === 0 ? (
          <EmptyState title={expenses.length === 0 ? 'No expenses yet' : 'No matching expenses'} subtitle={expenses.length === 0
                  ? 'Start by adding your first expense!'
                  : 'Try adjusting your filters or clear them to see all expenses.'
          } />
      ) : (
        <div className={styles.expenseList}>
          {filteredExpenses.map(expense => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onDelete={() => handleDeleteExpense(expense.id)}
            />
          ))}
        </div>
      )}
          </PageLayout>
  )
}
