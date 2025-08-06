'use client'

import React from 'react'
import { AuthAPI } from '@api'

interface NavigationProps {
  currentPage: 'dashboard' | 'expenses' | 'add-expense'
  onPageChange: (page: 'dashboard' | 'expenses' | 'add-expense') => void
  onLogout: () => void
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange, onLogout }) => {
  const authAPI = new AuthAPI()
  const user = authAPI.getCurrentUser()

  const handleLogout = () => {
    authAPI.logout()
    onLogout()
  }

  return (
    <div style={{
      background: 'var(--card-background)',
      borderBottom: '1px solid var(--border-color)',
      padding: '12px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ 
          fontSize: '20px', 
          fontWeight: '700',
          color: 'var(--primary-color)',
          margin: 0
        }}>
          💰 Expense Tracker
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ 
          fontSize: '14px', 
          color: 'var(--secondary-color)',
          display: 'none'
        }}>
          {user?.name}
        </span>
        <button
          onClick={handleLogout}
          className="button button-secondary"
          style={{ 
            padding: '8px 16px', 
            fontSize: '14px',
            minHeight: '32px'
          }}
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
    <div style={{
      background: 'var(--card-background)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100
    }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onPageChange(tab.key)}
          className="touch-target"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            background: 'none',
            border: 'none',
            color: currentPage === tab.key ? 'var(--primary-color)' : 'var(--secondary-color)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: currentPage === tab.key ? '600' : '400'
          }}
        >
          <span style={{ fontSize: '20px', marginBottom: '4px' }}>
            {tab.icon}
          </span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}
