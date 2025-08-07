import React from 'react';
import styles from './Category.module.css';
import { getCategoryEmoji, getCategoryColor } from '@constants';
import {ExpenseCategory} from '@utils'

type CategoryProps = {
    category: ExpenseCategory;
}

export const Category: React.FC<CategoryProps> = ({ category }) => {
    return (
        <div className={styles.category}
             style={{ '--category-color': getCategoryColor(category) } as React.CSSProperties}
        >
            <span className={styles.categoryIcon}>
                {getCategoryEmoji(category)}
            </span>
        </div>
    );
};
