import React, {useState} from "react";
import {StyleSheet, View} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Dashboard } from './src/components/Dashboard';
import {Navigation, TabBar} from "./src/components/Navigation";
import {AuthGuard} from "./src/components/AuthGuard";
import {AddExpense} from "./src/components/AddExpense";
import {ExpenseList} from "./src/components/ExpenseList";

export default function App() {
    const [currentPage, setCurrentPage] = useState('dashboard')

    const handleLogout = () => {
        setCurrentPage('dashboard')
    }

    const handleExpenseAdded = () => {
        setCurrentPage('dashboard')
    }

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />
            case 'expenses':
                return <ExpenseList />
            case 'add-expense':
                return <AddExpense onExpenseAdded={handleExpenseAdded} />
            default:
                return <Dashboard />
        }
    }

    return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
          <AuthGuard onLogout={handleLogout}>
              <Navigation
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onLogout={handleLogout}
              />

              <View style={styles.main}>
                  {renderCurrentPage()}
              </View>

              <TabBar
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
              />
      </AuthGuard>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  main: {
    flex: 1,
    paddingBottom: 80
  }
});
