import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native'

type Props = {
    title: string
    onPress: () => void
    style?: ViewStyle
}

export const BaseButton: React.FC<Props> = ({ title, onPress, style }) => (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    btn: { padding: 12, backgroundColor: '#0070f3', borderRadius: 6 },
    text: { color: '#fff', textAlign: 'center' }
})
