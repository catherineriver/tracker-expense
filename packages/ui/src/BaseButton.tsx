import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'

type Props = {
    title: string
    onPress?: () => void
    style?: ViewStyle
    textStyle?: TextStyle
    variant?: 'primary' | 'secondary' | 'danger'
    disabled?: boolean
}

export const BaseButton: React.FC<Props> = ({ 
    title, 
    onPress, 
    style, 
    textStyle,
    variant = 'primary',

    disabled = false
}) => {
    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.btnSecondary;
            case 'danger':
                return styles.btnDanger;
            default:
                return styles.btnPrimary;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.textSecondary;
            case 'danger':
                return styles.textDanger;
            default:
                return styles.textPrimary;
        }
    };

    return (
        <TouchableOpacity 
            style={[
                styles.btn, 
                getButtonStyle(),
                disabled && styles.btnDisabled,
                style
            ]} 
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[getTextStyle(), disabled && styles.textDisabled, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btn: { 
        padding: 12, 
        borderRadius: 8, 
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnPrimary: { 
        backgroundColor: '#007AFF' 
    },
    btnSecondary: { 
        backgroundColor: '#F2F2F7',
        borderWidth: 1,
        borderColor: '#D1D1D6'
    },
    btnDanger: { 
        backgroundColor: '#FF3B30' 
    },
    btnDisabled: {
        opacity: 0.5
    },
    textPrimary: { 
        color: '#fff', 
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600'
    },
    textSecondary: { 
        color: '#007AFF', 
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600'
    },
    textDanger: { 
        color: '#fff', 
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600'
    },
    textDisabled: {
        color: '#8E8E93'
    }
})
