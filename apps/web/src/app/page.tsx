'use client'

import React, { useState } from 'react'
import { AuthGuard } from '../components/AuthGuard'
import { Navigation, TabBar } from '../components/Navigation'
import { Dashboard } from '../components/Dashboard'
import { ExpenseList } from '../components/ExpenseList'
import { AddExpense } from '../components/AddExpense'
import { ShareReport } from '../components/ShareReport'

type Page = 'dashboard' | 'expenses' | 'add-expense'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  const handleLogout = () => {
    window.location.reload() // Simple way to reset app state
  }

  const handleExpenseAdded = () => {
    // Switch to dashboard or expenses page after adding an expense
    setCurrentPage('dashboard')
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div>
            <Dashboard />
            <div className="container">
              <ShareReport />
            </div>
          </div>
        )
      case 'expenses':
        return <ExpenseList />
      case 'add-expense':
        return <AddExpense onExpenseAdded={handleExpenseAdded} />
      default:
        return <Dashboard />
    }
  }

  return (
    <AuthGuard>
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Navigation 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
        />
        
        <main style={{ flex: 1, paddingBottom: '80px' }}>
          {renderCurrentPage()}
        </main>
        
        <TabBar 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </AuthGuard>
  )
}
