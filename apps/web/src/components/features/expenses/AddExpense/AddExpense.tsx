'use client'

import React, { useState } from 'react'
import { ExpensesAPI } from '@api'
import { ExpenseCategory, EXPENSE_CATEGORIES, validateExpense, formatDate } from '@utils'
import {getCategoryColor, getCategoryEmoji} from "@constants";
import styles from './AddExpense.module.css'
import {PageTitle} from "@/components/ui/PageTitle/PageTitle";
import {PageLayout} from "@/components/layout/PageLayout/PageLayout";

interface AddExpenseProps {
  onExpenseAdded?: () => void
}

export const AddExpense: React.FC<AddExpenseProps> = ({ onExpenseAdded }) => {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('other')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(formatDate(new Date()))
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const expensesAPI = new ExpensesAPI()

  const handleSubmit = async () => {
    setErrors([])
    setIsLoading(true)

    const expenseData = {
      amount: parseFloat(amount),
      category,
      description: description.trim(),
      date
    }

    const validation = validateExpense(expenseData)
    if (!validation.valid) {
      setErrors(validation.errors)
      setIsLoading(false)
      return
    }

    try {
      await expensesAPI.createExpense(expenseData)

      setAmount('')
      setCategory('other')
      setDescription('')
      setDate(formatDate(new Date()))
      
      onExpenseAdded?.()

      alert('Expense added successfully!')
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Failed to add expense'])
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <>
        <PageTitle>Add Expense</PageTitle>
        <PageLayout>
          {errors.length > 0 && (
            <div className={styles.errorCard}>
              {errors.map((error, index) => (
                <div key={index} className={styles.errorText}>
                  {error}
                </div>
              ))}
            </div>
          )}

          <div className={styles.formCard}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`${styles.input} ${styles.amountInput}`}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <div className={styles.categoryGrid}>
                {EXPENSE_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`${styles.categoryButton} ${category === cat ? styles.categoryButtonActive : ''}`}
                    style={{ '--category-color': getCategoryColor(category) } as React.CSSProperties}
                  >
                    <span className={styles.categoryEmoji}>
                      {getCategoryEmoji(cat)}
                    </span>
                    <span className={styles.categoryText}>
                      {cat}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you spend on?"
                className={`${styles.input} ${styles.textarea}`}
                rows={3}
                maxLength={200}
              />
              <div className={styles.characterCount}>
                {description.length}/200
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.actionButtonsGrid}>
              <button
                type="button"
                onClick={() => {
                  setAmount('')
                  setCategory('other')
                  setDescription('')
                  setDate(formatDate(new Date()))
                  setErrors([])
                }}
                className={`${styles.button} ${styles.buttonSecondary}`}
                disabled={isLoading}
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className={`${styles.button} ${styles.buttonPrimary}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    Adding...
                  </div>
                ) : (
                  'Add Expense'
                )}
              </button>
            </div>
        </div>
        </PageLayout>
      </>
  )
}
