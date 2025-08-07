import React from 'react';
import { formatCurrency } from '@utils';
import styles from './Graph.module.css';

interface CategoryData {
    category: string;
    amount: number;
    count: number;
}

interface GraphProps {
    categories: CategoryData[];
    totalAmount: number;
    className?: string;
}

export const Graph: React.FC<GraphProps> = ({
    categories,
    totalAmount,
    className = ''
}) => {
    return (
        <div className={`${styles.container} ${className}`.trim()}>
            {categories.map((category) => {
                const percentage = (category.amount / totalAmount) * 100;
                return (
                    <div key={category.category} className={styles.categoryItem}>
                        <div className={styles.categoryHeader}>
                            <span className={styles.categoryName}>
                                {category.category.charAt(0).toUpperCase() + category.category.slice(1)} ({category.count})
                            </span>
                            <span className={styles.categoryAmount}>
                                {formatCurrency(category.amount)}
                            </span>
                        </div>
                        <div className={styles.progressBarContainer}>
                            <div 
                                className={styles.progressBar}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
