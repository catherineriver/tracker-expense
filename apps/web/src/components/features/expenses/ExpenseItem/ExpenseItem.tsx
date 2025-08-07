import React from "react";
import {Expense, formatCurrency, formatDate} from "@utils";
import styles from "./ExpenseItem.module.css";
import {Category} from "../../../ui/Category/Category";
import {Currency} from "../../../ui/Currency/Currency";
import {Button} from "../../../ui";

type ExpenseProps = {
    expense: Expense
    onPress?: () => void
    onEdit?: () => void
    onDelete?: () => void
}

export const ExpenseItem: React.FC<ExpenseProps> = ({
    expense,
    onPress,
    onEdit,
    onDelete
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
