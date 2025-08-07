import React from 'react';
import styles from './Error.module.css';

interface ErrorProps {
  message: string;
  onRetry: () => void;
}

export const Error: React.FC<ErrorProps> = ({ message, onRetry }) => {
  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorText}>
        {message}
      </p>
      <button 
        onClick={onRetry}
        className={styles.retryButton}
      >
        Try Again
      </button>
    </div>
  );
};
