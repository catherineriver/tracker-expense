import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useAuth } from './AuthGuard'

interface NavigationProps {
  currentPage: 'dashboard' | 'expenses' | 'add-expense'
  onPageChange: (page: 'dashboard' | 'expenses' | 'add-expense') => void
  onLogout: () => void
}

export const Navigation: React.FC<NavigationProps> = ({ onLogout }) => {
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    onLogout()
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.title}>💰 Expense Tracker</Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    <View style={styles.tabContainer}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onPageChange(tab.key)}
          style={styles.tabButton}
        >
          <Text style={[
            styles.tabIcon,
            currentPage === tab.key && styles.activeTabIcon
          ]}>
            {tab.icon}
          </Text>
          <Text style={[
            styles.tabLabel,
            currentPage === tab.key && styles.activeTabLabel
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
    margin: 0
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  logoutButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minHeight: 32
  },
  logoutButtonText: {
    fontSize: 14,
    color: '#666'
  },
  tabContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  tabButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4
  },
  activeTabIcon: {

  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666'
  },
  activeTabLabel: {
    fontWeight: '600',
    color: '#007AFF'
  }
})
