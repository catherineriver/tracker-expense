import React, { ReactNode } from 'react';
import styles from './PageTitle.module.css';

interface TitleProps {
  children: ReactNode;
  additionalContent?: ReactNode;
  className?: string;
}

export const PageTitle: React.FC<TitleProps> = ({
  children, 
  additionalContent,
  className = '' 
}) => {
  return (
    <h2 className={`${styles.title} ${className}`.trim()}>
      {children}
      {additionalContent && (
        <span className={styles.additionalContent}>
          {additionalContent}
        </span>
      )}
    </h2>
  );
};
