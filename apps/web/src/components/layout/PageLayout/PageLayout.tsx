import React, { ReactNode } from 'react';
import styles from './PageLayout.module.css';

type PageLayoutVariant = 'default' | 'grid';
interface PageLayoutProps {
    children: ReactNode;
    variant?: PageLayoutVariant;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    variant = 'default',
}) => {
    return (
        <div className={`${styles.container} ${styles[variant]}`}>
                {children}
        </div>
    );
};
