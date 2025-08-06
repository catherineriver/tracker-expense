'use client'

import React, { useState, useEffect } from 'react'
import { AuthAPI } from '@api'
import { AuthForm } from "@ui"

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const authAPI = new AuthAPI()

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = authAPI.isAuthenticated()
      setIsAuthenticated(await authenticated)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

  if (isLoading) {
    return (
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div className="spinner"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <AuthForm onSuccess={handleAuthSuccess} />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
