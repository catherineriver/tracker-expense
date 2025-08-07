import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Expense, formatCurrency, formatDate } from "@tracker-expense/utils"
import { getCategoryEmoji, getCategoryColor } from '@tracker-expense/constants';

type ExpenseCardProps = {
    expense: Expense
    onPress?: () => void
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
    expense,
    onPress
}) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.row}>
                <View style={[styles.iconBox, { backgroundColor: getCategoryColor(expense.category) }]}>
                    <Text style={styles.emoji}>{getCategoryEmoji(expense.category)}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.description} numberOfLines={2}>
                        {expense.description}
                    </Text>
                </View>
                <View style={styles.amountDate}>
                    <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
                    <Text style={styles.date}>{formatDate(new Date(expense.date))}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        padding: 8,


    },
    emoji: {
        fontSize: 24,
        zIndex: 10
    },
    content: {
        flex: 1,
        marginRight: 12,
    },
    description: {
        fontSize: 14,
        color: '#333',
    },
    amountDate: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    date: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});
