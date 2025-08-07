import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native'
import { useAdvancedRealTime } from '@tracker-expense/api'
import { ExpenseCategory, EXPENSE_CATEGORIES, validateExpense } from '@tracker-expense/utils'
import { getCategoryEmoji, getCategoryColor } from '@tracker-expense/constants';

interface RealTimeAddExpenseProps {
    onExpenseAdded?: () => void
}

export const AddExpense: React.FC<RealTimeAddExpenseProps> = ({ onExpenseAdded }) => {
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState<ExpenseCategory>('other')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [errors, setErrors] = useState<string[]>([])

    const {
        createExpense,
        isOnline,
        isConnected,
        pendingOperations,
        error: realtimeError
    } = useAdvancedRealTime({
        enableOptimisticUpdates: true,
        enableNotifications: true,
        enableOfflineSupport: true
    })

    const handleSubmit = async () => {
        setErrors([])

        const expenseData = {
            amount: parseFloat(amount),
            category,
            description: description.trim(),
            date
        }

        const validation = validateExpense(expenseData)
        if (!validation.valid) {
            setErrors(validation.errors)
            return
        }

        try {
            await createExpense(expenseData)

            setAmount('')
            setCategory('other')
            setDescription('')
            setDate(new Date().toISOString().split('T')[0])

            onExpenseAdded?.()

            const message = isOnline
                ? 'Expense added successfully!'
                : 'Expense saved offline. Will sync when online.'

            Alert.alert('Success', message)
        } catch (error) {
            console.log('Add expense failed:', error)
        }
    }

    const clearForm = () => {
        setAmount('')
        setCategory('other')
        setDescription('')
        setDate(new Date().toISOString().split('T')[0])
        setErrors([])
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Add New Expense</Text>
            </View>

            {errors.length > 0 && (
                <View style={styles.errorCard}>
                    {errors.map((error, index) => (
                        <Text key={index} style={styles.errorText}>
                            {error}
                        </Text>
                    ))}
                </View>
            )}

            {!isOnline && (
                <View style={styles.offlineNotice}>
                    <Text style={styles.offlineNoticeText}>
                        📴 You're offline. Expenses will be saved locally and synced when you're back online.
                    </Text>
                </View>
            )}

            <View style={styles.card}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Amount ($)</Text>
                    <TextInput
                        style={[styles.input, styles.amountInput]}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.categoryGrid}>
                        {EXPENSE_CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setCategory(cat)}
                                style={[
                                    styles.categoryButton,
                                    category === cat ? { backgroundColor: getCategoryColor(cat) } : {}
                                ]}
                            >
                                <Text style={styles.categoryEmoji}>
                                    {getCategoryEmoji(cat)}
                                </Text>
                                <Text style={[
                                    styles.categoryText,
                                    category === cat && styles.selectedCategoryText
                                ]}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.descriptionInput]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="What did you spend on?"
                        multiline
                        maxLength={200}
                    />
                    <Text style={styles.characterCount}>
                        {description.length}/200
                    </Text>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Date</Text>
                    <TextInput
                        style={styles.input}
                        value={date}
                        onChangeText={setDate}
                        placeholder="YYYY-MM-DD"
                    />
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={clearForm}
                        disabled={pendingOperations > 0}
                    >
                        <Text style={styles.secondaryButtonText}>Clear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.primaryButton,
                            (!isOnline || pendingOperations > 0) && styles.offlineButton
                        ]}
                        onPress={handleSubmit}
                        disabled={pendingOperations > 0}
                    >
                        <Text style={[
                            styles.primaryButtonText,
                            !isOnline && styles.offlineButtonText
                        ]}>
                            {pendingOperations > 0 ? 'Saving...' :
                                !isOnline ? 'Save Offline' : 'Add Expense'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.card, styles.tipsCard]}>
                <Text style={styles.tipsTitle}>💡 Real-Time Features</Text>
                <Text style={styles.tipsText}>• ✅ Instant sync across all devices</Text>
                <Text style={styles.tipsText}>• 📱 Works offline, syncs when back online</Text>
                <Text style={styles.tipsText}>• ⚡ Optimistic updates for fast UI</Text>
                <Text style={styles.tipsText}>• 🔔 Push notifications for updates</Text>
            </View>

            <View style={styles.bottomSpacing} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
        paddingHorizontal: 16
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 16
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333'
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        backgroundColor: '#f8f9fa',
        borderRadius: 6,
        borderWidth: 1
    },
    statusIcon: {
        fontSize: 12,
        marginRight: 4
    },
    statusText: {
        fontSize: 11,
        fontWeight: '500'
    },
    realtimeErrorBanner: {
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#dc3545'
    },
    realtimeErrorText: {
        color: '#dc3545',
        fontSize: 14
    },
    errorCard: {
        backgroundColor: '#FFEBEE',
        borderWidth: 1,
        borderColor: '#dc3545',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24
    },
    errorText: {
        color: '#dc3545',
        textAlign: 'center',
        fontSize: 14
    },
    offlineNotice: {
        backgroundColor: '#FFF3CD',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107'
    },
    offlineNoticeText: {
        color: '#856404',
        fontSize: 14
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    formGroup: {
        marginBottom: 16
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
        color: '#333'
    },
    amountInput: {
        fontSize: 18,
        fontWeight: '600'
    },
    descriptionInput: {
        minHeight: 80,
        textAlignVertical: 'top'
    },
    characterCount: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
        marginTop: 4
    },
    categoryGrid: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12
    },
    categoryButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        width: '48%',
        minWidth: 90,
        minHeight: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    categoryEmoji: {
        fontSize: 20,
        marginBottom: 4
    },
    categoryText: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize'
    },
    selectedCategoryText: {
        color: '#fff'
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24
    },
    button: {
        flex: 1,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center'
    },
    primaryButton: {
        backgroundColor: '#007AFF'
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    offlineButton: {
        backgroundColor: '#fd7e14'
    },
    offlineButtonText: {
        color: '#fff'
    },
    secondaryButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd'
    },
    secondaryButtonText: {
        color: '#666',
        fontSize: 16
    },
    tipsCard: {
        marginTop: 0
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333'
    },
    tipsText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 4
    },
    bottomSpacing: {
        height: 20
    }
})
