import React, { useState, useEffect, createContext, useContext } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { AuthAPI } from '../../../../packages/api'
import { AuthForm } from './AuthForm'

interface AuthContextType {
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthGuard')
  }
  return context
}

interface AuthGuardProps {
  children: React.ReactNode
  onLogout?: () => void
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const authAPI = new AuthAPI()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...')
        const authenticated = await authAPI.isAuthenticated()
        console.log('Authentication status:', authenticated)
        setIsAuthenticated(authenticated)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      console.log('Logging out...')
      await authAPI.logout()
      setIsAuthenticated(false)
      if (onLogout) {
        onLogout()
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.authContainer}>
          <AuthForm onSuccess={handleAuthSuccess} />
        </View>
      </View>
    )
  }

  return (
    <AuthContext.Provider value={{ logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa'
  },
  authContainer: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 20
  }
})
