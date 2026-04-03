import { format, parseISO } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString) => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch (e) {
    return dateString;
  }
};

export const calculateTotals = (transactions) => {
  return transactions.reduce(
    (acc, curr) => {
      if (curr.type === 'income') acc.income += curr.amount;
      if (curr.type === 'expense') acc.expense += curr.amount;
      acc.balance = acc.income - acc.expense;
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );
};

export const groupByCategory = (transactions, type = 'expense') => {
  const filtered = transactions.filter(t => t.type === type);
  return filtered.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});
};

export const groupByMonth = (transactions) => {
  return transactions.reduce((acc, curr) => {
    const month = curr.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) acc[month] = { income: 0, expense: 0 };
    acc[month][curr.type] += curr.amount;
    return acc;
  }, {});
};