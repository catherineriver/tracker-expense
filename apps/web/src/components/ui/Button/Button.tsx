import React from 'react'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  isLoading?: boolean
  children: React.ReactNode
    loadingText?: string
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
                                                  loadingText,
                                                  isLoading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
      isLoading && styles.loading,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className={styles.spinner} />
          {loadingText ? 'Loading...' : loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}
