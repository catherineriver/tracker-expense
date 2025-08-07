import React, { ReactNode } from 'react';
import styles from './Section.module.css';

interface SectionProps {
    title?: ReactNode;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
}

export const Section: React.FC<SectionProps> = ({
    title,
    actions,
    children,
    className = ''
}) => {
    return (
        <section className={`${styles.section} ${className}`.trim()}>
            {(title || actions) && (
                <div className={styles.header}>
                    {title && (
                        <h2 className={styles.title}>
                            {title}
                        </h2>
                    )}
                    {actions && (
                        <div className={styles.actions}>
                            {actions}
                        </div>
                    )}
                </div>
            )}
            <div className={styles.content}>
                {children}
            </div>
        </section>
    );
};
