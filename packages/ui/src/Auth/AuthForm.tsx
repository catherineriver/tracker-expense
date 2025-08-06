'use client'

import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { AuthAPI } from '@api'
import { validateAuth } from '@utils'
import { BaseInput } from '../BaseInput'
import { BaseButton } from '../BaseButton'

export interface AuthFormProps {
    onSuccess?: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const authAPI = new AuthAPI();

    const handleSubmit = async () => {
        setErrors([]);
        setIsLoading(true);

        const validation = validateAuth({ email, password });
        if (!validation.valid) {
            setErrors(validation.errors);
            setIsLoading(false);
            return;
        }

        if (!isLogin && !name.trim()) {
            setErrors(['Name is required']);
            setIsLoading(false);
            return;
        }

        try {
            if (isLogin) {
                await authAPI.login({ email, password });
            } else {
                await authAPI.register({ email, password, name: name.trim() });
            }
            onSuccess?.();
        } catch (error) {
            setErrors([error instanceof Error ? error.message : 'An error occurred']);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {isLogin ? 'Sign In' : 'Create Account'}
            </Text>
            
            {errors.length > 0 && (
                <View style={styles.errorContainer}>
                    {errors.map((error, index) => (
                        <Text key={index} style={styles.errorText}>
                            {error}
                        </Text>
                    ))}
                </View>
            )}

            {!isLogin && (
                <BaseInput
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                />
            )}

            <BaseInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
            />

            <BaseInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
            />

            <BaseButton
                title={isLogin ? 'Sign In' : 'Create Account'}
                onPress={handleSubmit}
                disabled={isLoading}
                style={styles.submitButton}
            />

            <BaseButton
                title={isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                onPress={() => {
                    setIsLogin(!isLogin);
                    setErrors([]);
                }}
                variant="secondary"
                style={styles.toggleButton}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 32,
        color: '#1C1C1E'
    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 14,
        textAlign: 'center'
    },
    submitButton: {
        marginTop: 8,
        marginBottom: 16
    },
    toggleButton: {
        marginTop: 8
    }
});
