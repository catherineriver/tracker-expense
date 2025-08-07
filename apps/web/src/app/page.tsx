'use client'

import React, { useState } from 'react'
import { 
  AuthGuard,
  Navigation, 
  TabBar,
  Dashboard,
  ExpenseList,
  AddExpense,
  ShareReport
} from '@/components'
import styles from './page.module.css'

type Page = 'dashboard' | 'expenses' | 'add-expense'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  const handleLogout = () => {
    window.location.reload()
  }

  const handleExpenseAdded = () => {
    setCurrentPage('dashboard')
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div>
            <Dashboard />
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
      <div className={styles.container}>
        <Navigation
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
        />

        <main className={styles.main}>
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
