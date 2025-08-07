import React from 'react';
import { Expense, formatCurrency} from "@utils";
import {useAdvancedRealTimeWeb} from "@api";
import styles from "./Dashboard.module.css";
import {ShareReport} from "@/components/features/reports";
import {PageTitle} from "@/components/ui/PageTitle/PageTitle";
import {Section} from "@/components/layout/Section/Section";
import {Graph} from "@/components/features/dashboard/Graph/Graph";
import {ExpenseItem} from "@/components/features/expenses/ExpenseItem/ExpenseItem";
import {Loading} from "@/components/ui/Loading/Loading";
import {Error} from "@/components/ui/Error/Error";
import {EmptyState} from "@/components/ui/EmptyState/EmptyState";
import {Currency} from "@/components/ui/Currency/Currency";
import {Card} from "@/components/ui/Card/Card";
import {PageLayout} from "@/components/layout/PageLayout/PageLayout";

export const Dashboard: React.FC = () => {
    const {
        dashboardStats,
        isLoading,
        error,
        refresh
    } = useAdvancedRealTimeWeb({enableOptimisticUpdates: true});

    if (isLoading) {
        return (
            <Loading text={"Loading dashboard..."}/>
        );
    }

    if (error) {
        return (
            <Error message={error} onRetry={refresh}/>
        );
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
        <>
            <PageTitle>Dashboard</PageTitle>
            <PageLayout variant='grid'>
                <Section title="Total Spent">
                    <Currency variant="accent" amount={formatCurrency(dashboardStats.totalAmount)}/>
                </Section>


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
                            {dashboardStats.recentExpenses.map((expense: Expense) => (
                    <ExpenseItem key={expense.id} expense={expense} />
                ))}
                </div>
            </Section>
        )}

            <Section>
                <ShareReport />
            </Section>
        </PageLayout>
    </>
  );
};
