// shared/constants/categories.ts
import { Platform } from 'react-native';

export const CATEGORY_EMOJIS = {
    food: Platform.select({
        ios: '🍔',
        android: '🍔',
        default: '🍔', // web and other platforms
    }),
    transport: Platform.select({
        ios: '🚗',
        android: '🚗',
        default: '🚗',
    }),
    entertainment: Platform.select({
        ios: '🎬',
        android: '🎬',
        default: '🎬',
    }),
    shopping: Platform.select({
        ios: '🛍️',
        android: '🛍️',
        default: '🛍️',
    }),
    bills: Platform.select({
        ios: '💡',
        android: '💡',
        default: '💡',
    }),
    health: Platform.select({
        ios: '⚕️',
        android: '⚕️',
        default: '⚕️',
    }),
    travel: Platform.select({
        ios: '✈️',
        android: '✈️',
        default: '✈️',
    }),
    other: Platform.select({
        ios: '📝',
        android: '📝',
        default: '📝',
    }),
} as const;

export type ExpenseCategory = keyof typeof CATEGORY_EMOJIS;

export const getCategoryEmoji = (cat: ExpenseCategory): string => {
    const emoji = CATEGORY_EMOJIS[cat];
    return typeof emoji === 'string' ? emoji : emoji || '📝';
};
