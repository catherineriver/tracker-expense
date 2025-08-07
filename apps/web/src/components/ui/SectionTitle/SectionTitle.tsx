import React, { ReactNode } from 'react';
import styles from './SectionTitle.module.css';

interface TitleProps {
  children: ReactNode;
  additionalContent?: ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<TitleProps> = ({
  children, 
  additionalContent,
  className = '' 
}) => {
  return (
    <h3 className={`${styles.title} ${className}`}>
      {children}
      {additionalContent && (
        <span className={styles.additionalContent}>
          {additionalContent}
        </span>
      )}
    </h3>
  );
};
