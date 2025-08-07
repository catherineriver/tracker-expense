'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ExpensesAPI } from '@api'
import { DashboardStats, Expense, formatCurrency } from '@utils'
import { ExpenseCard } from '@/components'

export default function SharedReportPage() {
  const params = useParams()
  const reportId = params.id as string

  const [reportData, setReportData] = useState<{ expenses: Expense[], stats: DashboardStats } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const expensesAPI = new ExpensesAPI()

  useEffect(() => {
    if (reportId) {
      loadSharedReport()
    }
  }, [reportId])

  const loadSharedReport = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const report = await expensesAPI.getSharedReport(reportId)
      if (!report) {
        setError('Report not found or has expired')
        return
      }
      
      setReportData(report)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px 16px' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '16px', color: 'var(--secondary-color)' }}>
          Loading shared report...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px 16px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
        <h2 style={{ marginBottom: '8px' }}>Report Not Available</h2>
        <p style={{ color: 'var(--error-color)', marginBottom: '24px' }}>
          {error}
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="button button-primary"
        >
          Go to Expense Tracker
        </button>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px 16px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <h2 style={{ marginBottom: '8px' }}>No Data Available</h2>
        <p style={{ color: 'var(--secondary-color)' }}>
          This report appears to be empty.
        </p>
      </div>
    )
  }

  const { expenses, stats } = reportData

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--card-background)',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '700',
          color: 'var(--primary-color)',
          margin: 0,
          marginBottom: '8px'
        }}>
          📊 Shared Expense Report
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--secondary-color)', margin: 0 }}>
          View-only report • {stats.totalExpenses} expenses
        </p>
      </div>

      <div className="container">
        {/* Summary Cards */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
          marginTop: '24px'
        }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--primary-color)' }}>
              {formatCurrency(stats.totalAmount)}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--secondary-color)' }}>
              Total Spent
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--primary-color)' }}>
              {stats.totalExpenses}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--secondary-color)' }}>
              Total Expenses
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        {stats.categoryBreakdown.length > 0 && (
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
              Spending by Category
            </h3>
            {stats.categoryBreakdown.map(category => {
              const percentage = (category.amount / stats.totalAmount) * 100
              return (
                <div key={category.category} style={{ marginBottom: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>
                      {category.category} ({category.count})
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>
                      {formatCurrency(category.amount)}
                    </span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '6px', 
                    backgroundColor: 'var(--border-color)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: 'var(--primary-color)',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Recent Expenses */}
        {expenses.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
              All Expenses ({expenses.length})
            </h3>
            {expenses.slice(0, 10).map(expense => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
              />
            ))}
            
            {expenses.length > 10 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '16px',
                color: 'var(--secondary-color)',
                fontSize: '14px'
              }}>
                ... and {expenses.length - 10} more expenses
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          padding: '24px 16px',
          borderTop: '1px solid var(--border-color)',
          marginTop: '32px'
        }}>
          <p style={{ fontSize: '14px', color: 'var(--secondary-color)', marginBottom: '16px' }}>
            Want to track your own expenses?
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="button button-primary"
          >
            Start Using Expense Tracker
          </button>
        </div>
      </div>
    </div>
  )
}