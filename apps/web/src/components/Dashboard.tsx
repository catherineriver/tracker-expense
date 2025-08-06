import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { ExpensesAPI } from '@api';
import { DashboardStats, formatCurrency } from '@utils';
import { ExpenseCard } from './ExpenseCard';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const expensesAPI = new ExpensesAPI();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dashboardStats = await expensesAPI.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadDashboardStats} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyTitle}>Welcome to Expense Tracker</Text>
        <Text style={styles.emptySubtitle}>Start by adding your first expense!</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryAmount}>{formatCurrency(stats.totalAmount)}</Text>
          <Text style={styles.summaryLabel}>Total Spent</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryAmount}>{stats.totalExpenses}</Text>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
        </View>
      </View>

      {/* Category Breakdown */}
      {stats.categoryBreakdown.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spending by Category</Text>
          {stats.categoryBreakdown.map((category) => {
            const percentage = (category.amount / stats.totalAmount) * 100;
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

      {/* Recent Expenses */}
      {stats.recentExpenses.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.cardTitle}>Recent Expenses</Text>
          {stats.recentExpenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} />
          ))}
        </View>
      )}

      {/* Quick Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipText}>• Track your expenses daily for better insights</Text>
          <Text style={styles.tipText}>• Categorize expenses for detailed reports</Text>
          <Text style={styles.tipText}>• Review your spending patterns regularly</Text>
          <Text style={styles.tipText}>• Set monthly budgets for different categories</Text>
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
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
