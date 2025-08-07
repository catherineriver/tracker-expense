import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    RefreshControl
} from 'react-native';
import { useAdvancedRealTime } from '@api/src/hooks/useAdvancedRealTime';
import { formatCurrency } from '@utils';
import { ExpenseCard } from './ExpenseCard';


export const Dashboard: React.FC = () => {
    const {
        expenses,
        dashboardStats,
        isLoading,
        isConnected,
        isOnline,
        error,
        lastUpdated,
        pendingOperations,
        refresh,
        clearError
    } = useAdvancedRealTime({
        enableOptimisticUpdates: true,
        enableNotifications: true,
        enableOfflineSupport: true
    });

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading dashboard...</Text>
            </View>
        );
    }

    if (error && !dashboardStats) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={refresh} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
                {clearError && (
                    <TouchableOpacity onPress={clearError} style={styles.clearErrorButton}>
                        <Text style={styles.clearErrorButtonText}>Clear Error</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    if (!dashboardStats) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📊</Text>
                <Text style={styles.emptyTitle}>Welcome to Expense Tracker</Text>
                <Text style={styles.emptySubtitle}>Start by adding your first expense!</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl refreshing={pendingOperations > 0} onRefresh={refresh} />
            }
        >
            <Text style={styles.title}>Dashboard</Text>

            {error && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>⚠️ {error}</Text>
                    {clearError && (
                        <TouchableOpacity onPress={clearError}>
                            <Text style={styles.errorBannerClose}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryAmount}>{formatCurrency(dashboardStats.totalAmount)}</Text>
                    <Text style={styles.summaryLabel}>Total Spent</Text>
                    {pendingOperations > 0 && (
                        <ActivityIndicator size="small" color="#007AFF" style={{ marginTop: 4 }} />
                    )}
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryAmount}>{dashboardStats.totalExpenses}</Text>
                    <Text style={styles.summaryLabel}>Total Expenses</Text>
                </View>
            </View>

            {dashboardStats.categoryBreakdown.length > 0 && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Spending by Category</Text>
                    {dashboardStats.categoryBreakdown.map((category) => {
                        const percentage = (category.amount / dashboardStats.totalAmount) * 100;
                        return (
                            <View key={category.category} style={styles.categoryItem}>
                                <View style={styles.categoryHeader}>
                                    <Text style={styles.categoryName}>
                                        {category.category.charAt(0).toUpperCase() + category.category.slice(1)} ({category.count})
                                    </Text>
                                    <Text style={styles.categoryAmount}>
                                        {formatCurrency(category.amount)}
                                    </Text>
                                </View>
                                <View style={styles.progressBarContainer}>
                                    <View
                                        style={[
                                            styles.progressBar,
                                            { width: `${percentage}%` }
                                        ]}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}

            {dashboardStats.recentExpenses.length > 0 && (
                <View style={styles.recentSection}>
                    <Text style={styles.cardTitle}>Recent Expenses</Text>
                    {dashboardStats.recentExpenses.map((expense) => (
                        <ExpenseCard key={expense.id} expense={expense} />
                    ))}
                </View>
            )}

            <View style={styles.tipsCard}>
                <Text style={styles.tipsTitle}>💡 Real-Time Features</Text>
                <View style={styles.tipsList}>
                    <Text style={styles.tipText}>• ✅ Live sync across all your devices</Text>
                    <Text style={styles.tipText}>• 📱 Push notifications for updates</Text>
                    <Text style={styles.tipText}>• 📴 Works offline, syncs when back online</Text>
                    <Text style={styles.tipText}>• ⚡ Instant updates as you add expenses</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingBottom: 100,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        backgroundColor: '#f8f9fa',
        borderRadius: 6,
        borderWidth: 1,
        marginBottom: 16
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500'
    },
    lastUpdatedText: {
        color: '#666',
        fontSize: 11
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6c757d',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f8f9fa',
    },
    errorText: {
        color: '#dc3545',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    clearErrorButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    clearErrorButtonText: {
        color: '#007AFF',
        fontSize: 14,
    },
    errorBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#dc3545',
    },
    errorBannerText: {
        flex: 1,
        color: '#dc3545',
        fontSize: 14,
    },
    errorBannerClose: {
        color: '#dc3545',
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f8f9fa',
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        color: '#1c1c1e',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 24,
        color: '#1c1c1e',
    },
    summaryContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    summaryAmount: {
        fontSize: 24,
        fontWeight: '700',
        color: '#007AFF',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#1c1c1e',
    },
    categoryItem: {
        marginBottom: 16,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 14,
        color: '#1c1c1e',
    },
    categoryAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1c1c1e',
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#e9ecef',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#007AFF',
    },
    recentSection: {
        marginBottom: 20,
    },
    tipsCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#1c1c1e',
    },
    tipsList: {
        gap: 8,
    },
    tipText: {
        fontSize: 14,
        color: '#6c757d',
        lineHeight: 20,
    },
});
