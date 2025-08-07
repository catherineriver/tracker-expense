import React, { ReactNode } from 'react';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
    children: ReactNode;
    className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    className = ''
}) => {
    return (
        <div className={`${styles.container} ${className}`.trim()}>
                {children}
        </div>
    );
};
