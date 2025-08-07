export const CATEGORY_EMOJIS = {
    food: '🍔',
    transport: '🚗',
    entertainment: '🎬',
    shopping: '🛍️',
    bills: '💡',
    health: '⚕️',
    travel: '✈️',
    other: '📝',
} as const;

export type ExpenseCategory = keyof typeof CATEGORY_EMOJIS;

export const getCategoryEmoji = (cat: ExpenseCategory): string => {
    return CATEGORY_EMOJIS[cat] || '📝';
};
