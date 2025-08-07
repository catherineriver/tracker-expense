import React from 'react';
import styles from './Category.module.css';

type CategoryProps = {
    category: string;
};

const getCategoryEmoji = (category: string): string => {
    const emojiMap: Record<string, string> = {
        food: '🍔',
        transport: '🚗',
        entertainment: '🎬',
        shopping: '🛍️',
        bills: '💡',
        health: '⚕️',
        travel: '✈️',
        other: '📝'
    };
    return emojiMap[category] || '📝';
};

export const Category: React.FC<CategoryProps> = ({ category }) => {
    return (
        <div className={styles.category}>
            <span className={styles.categoryIcon}>
                {getCategoryEmoji(category)}
            </span>
            <span className={styles.categoryName}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
        </div>
    );
};
