import React from 'react';
import styles from './Currency.module.css';

type CurrencyVariant = 'default' | 'accent' | 'warning';

type CurrencyProps = {
    amount: string;
    variant?: CurrencyVariant;
};

export const Currency: React.FC<CurrencyProps> = ({ amount, variant = 'default' }) => {
    return (
        <span className={`${styles.currency} ${styles[variant]}`}>
                {amount}
            </span>
    );
};
