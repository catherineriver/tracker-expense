import React from 'react'
import styles from '../features/expenses/AddExpense/AddExpense.module.css'

interface FormFieldProps {
  label: string
  children: React.ReactNode
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  children, 
  className 
}) => {
  return (
    <div className={`${styles.formGroup} ${className || ''}`}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  )
}
