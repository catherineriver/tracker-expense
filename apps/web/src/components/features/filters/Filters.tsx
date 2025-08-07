import React from 'react';
import { ExpenseFilter, ExpenseCategory, EXPENSE_CATEGORIES } from '@utils';
import styles from './Filters.module.css';

interface ExpenseFilterCardProps {
    filter: ExpenseFilter;
    setFilter: (filter: ExpenseFilter) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
}

export const Filters: React.FC<ExpenseFilterCardProps> = ({
    filter,
    setFilter,
    clearFilters,
    hasActiveFilters,
}) => {
    return (
        <div className={styles.filterCard}>
            <h3 className={styles.filterTitle}>
                Filters
            </h3>

            <div className={styles.filterGrid}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Category</label>
                    <select
                        value={filter.category || ''}
                        onChange={(e) => setFilter({
                            ...filter,
                            category: e.target.value as ExpenseCategory || undefined
                        })}
                        className={styles.select}
                    >
                        <option value="">All Categories</option>
                        {EXPENSE_CATEGORIES.map(category => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Start Date</label>
                    <input
                        type="date"
                        value={filter.startDate || ''}
                        onChange={(e) => setFilter({
                            ...filter,
                            startDate: e.target.value || undefined
                        })}
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>End Date</label>
                    <input
                        type="date"
                        value={filter.endDate || ''}
                        onChange={(e) => setFilter({
                            ...filter,
                            endDate: e.target.value || undefined
                        })}
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Min Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={filter.minAmount || ''}
                        onChange={(e) => setFilter({
                            ...filter,
                            minAmount: e.target.value ? parseFloat(e.target.value) : undefined
                        })}
                        className={styles.input}
                        placeholder="$0.00"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Max Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={filter.maxAmount || ''}
                        onChange={(e) => setFilter({
                            ...filter,
                            maxAmount: e.target.value ? parseFloat(e.target.value) : undefined
                        })}
                        className={styles.input}
                        placeholder="$0.00"
                    />
                </div>
            </div>

            {hasActiveFilters && (
                <div className={styles.clearFiltersContainer}>
                    <button
                        onClick={clearFilters}
                        className={styles.clearFiltersButton}
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
};
