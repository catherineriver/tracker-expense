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
    onEdit,
    onDelete
}) => {
    return (
        <div
            className={styles.expenseCard}
            onClick={onPress}
        >
            <div className={styles.header}>
                <p className={styles.description}>
                    {expense.description}
                </p>
                <Currency amount={formatCurrency(expense.amount)}/>
            </div>

            <div className={styles.cardFooter}>
                <Category category={expense.category}/>

                <span className={styles.date}>
                    {formatDate(new Date(expense.date))}
                </span>
                {(onEdit || onDelete) && (
                    <div className={styles.actions}>
                        {onEdit && (
                            <Button
                                className={styles.actionButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                            >
                                Edit
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
