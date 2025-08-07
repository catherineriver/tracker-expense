export const CATEGORY_META = {
    food:         { emoji: '🍔', color: '#FFB74D' },
    transport:    { emoji: '🚗', color: '#7986CB' },
    entertainment:{ emoji: '🎬', color: '#E57373' },
    shopping:     { emoji: '🛍️', color: '#BA68C8' },
    bills:        { emoji: '💡', color: '#FFD54F' },
    health:       { emoji: '⚕️', color: '#4DB6AC' },
    travel:       { emoji: '✈️', color: '#64B5F6' },
    other:        { emoji: '📝', color: '#A1887F' },
} as const;

export type ExpenseCategory = keyof typeof CATEGORY_META;

export const getCategoryEmoji = (cat: ExpenseCategory): string => {
    return CATEGORY_META[cat]?.emoji || '📝';
};

export const getCategoryColor = (cat: ExpenseCategory): string => {
    return CATEGORY_META[cat]?.color || '#9E9E9E';
};
