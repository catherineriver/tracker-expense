import React from "react";
import {Expense, formatCurrency} from "@utils";
import styles from "./ExpenseItem.module.css";
import {Currency} from "../../../ui/Currency/Currency";

type ExpenseProps = {
    expense: Expense
    onPress?: () => void
}

export const ExpenseItem: React.FC<ExpenseProps> = ({
    expense,
    onPress,
}) => {
    return (
        <div
            className={styles.expenseItem}
            onClick={onPress}
        >
            <p className={styles.description}>
                {expense.description}
            </p>
            <Currency amount={formatCurrency(expense.amount)}/>
        </div>
    );
};
