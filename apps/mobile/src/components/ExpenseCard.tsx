import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Expense, formatCurrency, formatDate } from "@utils"
import { getCategoryEmoji } from '@constants';

type ExpenseCardProps = {
    expense: Expense
    onPress?: () => void
    onEdit?: () => void
    onDelete?: () => void
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
    expense, 
    onPress, 
    onEdit, 
    onDelete 
}) => {
    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.categoryContainer}>
                    <Text style={styles.categoryEmoji}>
                        {getCategoryEmoji(expense.category)}
                    </Text>
                    <Text style={styles.category}>
                        {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                    </Text>
                </View>
                <Text style={styles.amount}>
                    {formatCurrency(expense.amount)}
                </Text>
            </View>
            
            <Text style={styles.description} numberOfLines={2}>
                {expense.description}
            </Text>
            
            <Text style={styles.date}>
                {formatDate(new Date(expense.date))}
            </Text>
            
            {(onEdit || onDelete) && (
                <View style={styles.actions}>
                    {onEdit && (
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.editButton]}
                            onPress={onEdit}
                        >
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    )}
                    {onDelete && (
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={onDelete}
                        >
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
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
        elevation: 3
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    categoryEmoji: {
        fontSize: 24,
        marginRight: 8
    },
    category: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E'
    },
    amount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#007AFF'
    },
    description: {
        fontSize: 14,
        color: '#636366',
        marginBottom: 8,
        lineHeight: 20
    },
    date: {
        fontSize: 12,
        color: '#8E8E93'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
        gap: 8
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6
    },
    editButton: {
        backgroundColor: '#007AFF'
    },
    deleteButton: {
        backgroundColor: '#FF3B30'
    },
    editButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    }
});
