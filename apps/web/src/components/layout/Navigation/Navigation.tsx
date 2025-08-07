'use client'

import React, { useState, useEffect } from 'react'
import { AuthAPI } from '@api'
import { User } from '@utils'
import styles from './Navigation.module.css'

interface NavigationProps {
  currentPage: 'dashboard' | 'expenses' | 'add-expense'
  onPageChange: (page: 'dashboard' | 'expenses' | 'add-expense') => void
  onLogout: () => void
}

export const Navigation: React.FC<NavigationProps> = ({ onLogout }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const authAPI = new AuthAPI()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authAPI.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Failed to load user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const handleLogout = async () => {
    await authAPI.logout()
    onLogout()
  }

  const getDisplayName = () => {
    if (isLoading) return 'Loading...'
    if (!user) return 'Welcome'
    
    // Use the user's name, or fallback to email username
    return user.name || user.email.split('@')[0]
  }

  return (
    <div className={styles.navigation}>
      <div className={styles.leftSection}>
        <h1 className={styles.title}>
          💰 Expense Tracker
        </h1>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.userInfo}>
          <span className={styles.userIcon}>👤</span>
          <span className={`${styles.userName} ${isLoading ? styles.loading : ''}`}>
            {getDisplayName()}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className={`button button-secondary ${styles.logoutButton}`}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

interface TabBarProps {
  currentPage: 'dashboard' | 'expenses' | 'add-expense'
  onPageChange: (page: 'dashboard' | 'expenses' | 'add-expense') => void
}

export const TabBar: React.FC<TabBarProps> = ({ currentPage, onPageChange }) => {
  const tabs = [
    { key: 'dashboard' as const, label: 'Dashboard', icon: '📊' },
    { key: 'expenses' as const, label: 'Expenses', icon: '📝' },
    { key: 'add-expense' as const, label: 'Add', icon: '➕' }
  ]

  return (
    <div className={styles.tabBar}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onPageChange(tab.key)}
          className={`${styles.tabButton} ${currentPage === tab.key ? styles.active : ''}`}
        >
          <span className={styles.tabIcon}>
            {tab.icon}
          </span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}
