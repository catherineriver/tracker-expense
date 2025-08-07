import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { useAdvancedRealTime } from '@api/src/hooks/useAdvancedRealTime'
import { getCategoryEmoji } from '@constants';
import {ExpenseCard} from "./ExpenseCard";

export const ExpenseList: React.FC = () => {
    const {
        expenses,
        isLoading,
        isConnected,
        isOnline,
        error,
        lastUpdated,
        pendingOperations,
        deleteExpense,
        refresh,
        clearError
    } = useAdvancedRealTime({
        enableOptimisticUpdates: true,
        enableNotifications: true,
        enableOfflineSupport: true
    })

    const handleDeleteExpense = async (expenseId: string, expenseName: string) => {
        Alert.alert(
            'Delete Expense',
            `Are you sure you want to delete "${expenseName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteExpense(expenseId)
                        } catch (err) {

                        }
                    }
                }
            ]
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading expenses...</Text>
            </View>
        )
    }

    if (error && expenses.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={refresh}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
                {clearError && (
                    <TouchableOpacity onPress={clearError} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>Clear Error</Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.title}>Expenses ({expenses.length})</Text>
                    <TouchableOpacity onPress={refresh} disabled={pendingOperations > 0}>
                        <Text style={styles.refreshButton}>🔄</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {error && expenses.length > 0 && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>⚠️ {error}</Text>
                    {clearError && (
                        <TouchableOpacity onPress={clearError}>
                            <Text style={styles.errorBannerClose}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {expenses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📝</Text>
                    <Text style={styles.emptyTitle}>No expenses yet</Text>
                    <Text style={styles.emptySubtitle}>Start by adding your first expense!</Text>
                </View>
            ) : (
                <ScrollView style={styles.expenseList} showsVerticalScrollIndicator={false}>
                    {expenses.map(expense => {

                        const isOptimistic = expense.id.startsWith('temp-')

                        return (
                            <TouchableOpacity key={expense.id}>
                                <ExpenseCard expense={expense} />

                                {isOptimistic && (
                                    <View style={styles.optimisticOverlay}>
                                        <Text style={styles.optimisticText}>⏳</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        )
                    })}
                    <View style={styles.bottomSpacing} />
                </ScrollView>
            )}

            {!isOnline && (
                <View style={styles.offlineIndicator}>
                    <Text style={styles.offlineText}>📴 Working offline</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa'
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    loadingText: {
        marginTop: 16,
        color: '#666',
        fontSize: 16
    },
    errorText: {
        color: '#dc3545',
        marginBottom: 16,
        fontSize: 16,
        textAlign: 'center'
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 8
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    clearButton: {
        paddingVertical: 8,
        paddingHorizontal: 16
    },
    clearButtonText: {
        color: '#007AFF',
        fontSize: 14
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e5e9'
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333'
    },
    refreshButton: {
        fontSize: 20,
        padding: 4
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        backgroundColor: '#f8f9fa',
        borderRadius: 6,
        borderWidth: 1
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500'
    },
    lastUpdatedText: {
        color: '#666',
        fontSize: 11,
        marginLeft: 4
    },
    errorBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        padding: 12,
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#dc3545'
    },
    errorBannerText: {
        flex: 1,
        color: '#dc3545',
        fontSize: 14
    },
    errorBannerClose: {
        color: '#dc3545',
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 8
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333'
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center'
    },
    expenseList: {
        flex: 1,
        paddingHorizontal: 16
    },
    expenseCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        position: 'relative'
    },
    optimisticCard: {
        opacity: 0.8,
        borderWidth: 2,
        borderColor: '#007AFF',
        borderStyle: 'dashed'
    },
    expenseHeader: {
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
        fontSize: 20,
        marginRight: 8
    },
    categoryText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500'
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    amount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333'
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        lineHeight: 22
    },
    expenseFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    date: {
        fontSize: 12,
        color: '#999'
    },
    optimisticLabel: {
        fontSize: 11,
        color: '#007AFF',
        fontWeight: '500'
    },
    optimisticOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        borderRadius: 12,
        padding: 4
    },
    optimisticText: {
        fontSize: 12
    },
    offlineIndicator: {
        position: 'absolute',
        bottom: 80,
        left: 16,
        right: 16,
        backgroundColor: '#fd7e14',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center'
    },
    offlineText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500'
    },
    bottomSpacing: {
        height: 20
    }
})
