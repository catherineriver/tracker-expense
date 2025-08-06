export const formatDate = (d: Date) => d.toISOString().split('T')[0];

export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const parseDate = (dateString: string) => {
  return new Date(dateString + 'T00:00:00.000Z');
};
