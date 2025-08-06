'use client'

import React, { useState } from 'react'
import { ExpensesAPI } from 'packages/api'
import { ExpenseCategory, EXPENSE_CATEGORIES, validateExpense, formatDate } from '@utils'

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
      
      // Reset form
      setAmount('')
      setCategory('other')
      setDescription('')
      setDate(formatDate(new Date()))
      
      onExpenseAdded?.()
      
      // Show success message briefly
      alert('Expense added successfully!')
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Failed to add expense'])
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryEmoji = (cat: ExpenseCategory): string => {
    const emojiMap: Record<ExpenseCategory, string> = {
      food: '🍔',
      transport: '🚗',
      entertainment: '🎬',
      shopping: '🛍️',
      bills: '💡',
      health: '⚕️',
      travel: '✈️',
      other: '📝'
    }
    return emojiMap[cat]
  }

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>
        Add New Expense
      </h2>

      {errors.length > 0 && (
        <div className="card" style={{ 
          backgroundColor: '#FFEBEE',
          borderColor: 'var(--error-color)',
          marginBottom: '24px'
        }}>
          {errors.map((error, index) => (
            <div key={index} className="error-text" style={{ textAlign: 'center' }}>
              {error}
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="form-group">
          <label className="label">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="input"
            style={{ fontSize: '18px', fontWeight: '600' }}
          />
        </div>

        <div className="form-group">
          <label className="label">Category</label>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '8px'
          }}>
            {EXPENSE_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`button ${category === cat ? 'button-primary' : 'button-secondary'}`}
                style={{ 
                  padding: '12px 8px',
                  fontSize: '14px',
                  minHeight: '48px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '20px' }}>
                  {getCategoryEmoji(cat)}
                </span>
                <span style={{ textTransform: 'capitalize' }}>
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you spend on?"
            className="input"
            rows={3}
            maxLength={200}
            style={{ resize: 'vertical', minHeight: '80px' }}
          />
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--secondary-color)',
            textAlign: 'right',
            marginTop: '4px'
          }}>
            {description.length}/200
          </div>
        </div>

        <div className="form-group">
          <label className="label">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            type="button"
            onClick={() => {
              setAmount('')
              setCategory('other')
              setDescription('')
              setDate(formatDate(new Date()))
              setErrors([])
            }}
            className="button button-secondary"
            disabled={isLoading}
          >
            Clear
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            className="button button-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="spinner"></div>
                Adding...
              </div>
            ) : (
              'Add Expense'
            )}
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          💡 Quick Tips
        </h3>
        <ul style={{ 
          fontSize: '14px', 
          color: 'var(--secondary-color)', 
          lineHeight: '1.5',
          paddingLeft: '16px'
        }}>
          <li>Be specific in your descriptions for better tracking</li>
          <li>Choose the most relevant category for accurate reporting</li>
          <li>Add expenses as soon as possible to avoid forgetting</li>
        </ul>
      </div>
    </div>
  )
}
