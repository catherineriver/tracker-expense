'use client'

import React, {useState, useEffect, useCallback} from "react";
import { AuthAPI } from '@api'
import { AuthForm } from "@/components/features/auth/AuthForm/AuthForm"
import styles from './AuthGuard.module.css'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

    const checkAuth = useCallback(async () => {
        const authAPI = new AuthAPI()
        const authenticated = authAPI.isAuthenticated()
        setIsAuthenticated(await authenticated)
        setIsLoading(false)
    }, [isAuthenticated])

  useEffect(() => {
    checkAuth()
  }, [])

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.fullScreenContainer}>
        <div className={styles.authFormContainer}>
          <AuthForm onSuccess={handleAuthSuccess} />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
