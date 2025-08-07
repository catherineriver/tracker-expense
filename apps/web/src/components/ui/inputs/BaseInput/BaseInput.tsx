import React, { forwardRef } from 'react';
import styles from './BaseInput.module.css';

export type BaseInputProps = {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    className?: string;
    containerClassName?: string;
    labelClassName?: string;
    onChangeText?: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
    (
        {
            label,
            error,
            helperText,
            fullWidth = true,
            className = '',
            containerClassName = '',
            labelClassName = '',
            id,
            onChange,
            onChangeText,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            onChangeText?.(e.target.value);
        };

        return (
            <div
                className={`${styles.container} ${fullWidth ? styles.fullWidth : ''} ${containerClassName}`}
            >
                {label && (
                    <label
                        htmlFor={inputId}
                        className={`${styles.label} ${labelClassName}`}
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
                        ${styles.input}
                        ${error ? styles.error : ''}
                        ${className}
                    `}
                    onChange={handleChange}
                    {...props}
                />
                {(error || helperText) && (
                    <div className={styles.bottomText}>
                        {error ? (
                            <span className={styles.errorText}>{error}</span>
                        ) : (
                            <span className={styles.helperText}>{helperText}</span>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

BaseInput.displayName = 'BaseInput';
