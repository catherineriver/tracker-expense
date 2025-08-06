import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, StyleSheet } from 'react-native'
import { AuthGuard } from './src/components/AuthGuard'
import { Navigation, TabBar } from './src/components/Navigation'
import { Dashboard } from './src/components/Dashboard'
import { ExpenseList } from './src/components/ExpenseList'
import { AddExpense } from './src/components/AddExpense'

type Page = 'dashboard' | 'expenses' | 'add-expense'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  const handleLogout = () => {
    // Simple way to reset app state - you could use a more sophisticated state management solution
    setCurrentPage('dashboard')
  }

  const handleExpenseAdded = () => {
    // Switch to dashboard after adding an expense
    setCurrentPage('dashboard')
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
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
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Navigation 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
        />
        
        <View style={styles.content}>
          {renderCurrentPage()}
        </View>
        
        <TabBar 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </View>
    </AuthGuard>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7'
  },
  content: {
    flex: 1
  }
})
