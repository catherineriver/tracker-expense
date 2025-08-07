import React from 'react';
import { formatCurrency } from '@utils';
import { useAdvancedRealTimeWeb } from '@api';
import styles from './Dashboard.module.css';
import {ShareReport} from "../../reports";
import {PageTitle} from "../../../ui/PageTitle/PageTitle";
import {Section} from "../../../layout/Section/Section";
import {Graph} from "../Graph/Graph";
import {ExpenseItem} from "../../expenses/ExpenseItem/ExpenseItem";
import {Loading} from "../../../ui/Loading/Loading";
import {Error} from "../../../ui/Error/Error";
import {EmptyState} from "../../../ui/EmptyState/EmptyState";
import {Currency} from "../../../ui/Currency/Currency";
import {Card} from "../../../ui/Card/Card";
import {PageLayout} from "../../../layout/PageLayout/PageLayout";

export const Dashboard: React.FC = () => {
  const {
    dashboardStats,
    isLoading,
    error,
    refresh
  } = useAdvancedRealTimeWeb({ enableOptimisticUpdates: true });

  if (isLoading) {
    return (
      <Loading text={'Loading dashboard...'} />
    );
  }

    if (error) {
        return (
            <Error message={error} onRetry={refresh} />
        )
    }

  if (!dashboardStats) {
    return (
        <EmptyState
            title="Welcome to Expense Tracker"
            subtitle="Start by adding your first expense!"
        />

    );
  }

  return (
    <PageLayout>
      <PageTitle>Dashboard</PageTitle>
        <Card>
            <Currency amount={formatCurrency(dashboardStats.totalAmount)} />
            <div className={styles.summaryLabel}>Total Spent</div>
        </Card>


      {dashboardStats.categoryBreakdown.length > 0 && (
          <Section title="Spending by Category">
              <Graph
                  categories={dashboardStats.categoryBreakdown}
                  totalAmount={dashboardStats.totalAmount}
              />
          </Section>
      )}

    {dashboardStats.recentExpenses.length > 0 && (
        <Section title="Recent Expenses">
            <div className={styles.list}>
            {dashboardStats.recentExpenses.map((expense) => (
                <ExpenseItem key={expense.id} expense={expense} />
            ))}
            </div>
        </Section>
    )}

        <Section>
            <ShareReport />
        </Section>
    </PageLayout>
  );
};
