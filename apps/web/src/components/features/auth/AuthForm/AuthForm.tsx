'use client'

import React, { useState } from 'react'
import { AuthAPI } from '@api'
import { validateAuth } from '@utils'
import { Button } from "@/components/ui/Button/Button"
import { BaseInput } from '@/components/ui/inputs/BaseInput/BaseInput'
import styles from './AuthForm.module.css'

export interface AuthFormProps {
    onSuccess?: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [errors, setErrors] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const authAPI = new AuthAPI()

    const handleSubmit = async () => {
        setErrors([])
        setIsLoading(true)

        const validation = validateAuth({ email, password })
        if (!validation.valid) {
            setErrors(validation.errors)
            setIsLoading(false)
            return
        }

        if (!isLogin && !name.trim()) {
            setErrors(['Name is required'])
            setIsLoading(false)
            return
        }

        try {
            if (isLogin) {
                await authAPI.login({ email, password })
            } else {
                await authAPI.register({ email, password, name: name.trim() })
            }
            onSuccess?.()
        } catch (error) {
            setErrors([error instanceof Error ? error.message : 'An error occurred'])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                {isLogin ? 'Sign In' : 'Create Account'}
            </h1>

            {errors.length > 0 && (
                <div className={styles.errorContainer}>
                    {errors.map((error, index) => (
                        <p key={index} className={styles.errorText}>
                            {error}
                        </p>
                    ))}
                </div>
            )}

            {!isLogin && (
                <BaseInput
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                />
            )}

            <BaseInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
            />

            <BaseInput
                label="Password"
                type="password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
            />

            <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className={styles.submitButton}
            >
                {isLogin ? "Sign In" : "Create Account"}
            </Button>

            <Button
                onClick={() => {
                    setIsLogin(!isLogin)
                    setErrors([])
                }}
                variant="secondary"
                className={styles.toggleButton}
            >
                {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </Button>
        </div>
    )
}
