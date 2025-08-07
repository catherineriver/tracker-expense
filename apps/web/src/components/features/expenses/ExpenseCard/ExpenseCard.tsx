import React from "react";
import {Expense, formatCurrency, formatDate} from "@utils";
import styles from "./ExpenseCard.module.css";
import {Category, Currency, Button} from "@/components/ui";


type ExpenseProps = {
    expense: Expense
    onPress?: () => void
    onEdit?: () => void
    onDelete?: () => void
}

export const ExpenseCard: React.FC<ExpenseProps> = ({
    expense,
    onPress,
}) => {
    return (
        <div
            className={styles.expenseCard}
            onClick={onPress}
        >
            <Category category={expense.category}/>
            <div className={styles.expenseContent}>
                <div className={styles.header}>
                    <p className={styles.description}>
                        {expense.description}
                    </p>

                </div>

                <div className={styles.cardFooter}>
                    <Currency amount={formatCurrency(expense.amount)}/>
                    <span className={styles.date}>
                        {formatDate(new Date(expense.date))}
                    </span>
                </div>
            </div>

        </div>
    );
};
