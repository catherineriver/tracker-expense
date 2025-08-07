import React from 'react';
import styles from './Currency.module.css';

type CurrencyProps = {
    amount: string;
};

export const Currency: React.FC<CurrencyProps> = ({ amount }) => {
    return (
        <span className={styles.currency}>
                {amount}
            </span>
    );
};
