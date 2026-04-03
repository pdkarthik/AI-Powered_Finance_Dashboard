export const initialTransactions = [
  { id: '1', date: '2023-08-15', amount: 4500, type: 'income', category: 'Salary', description: 'August Salary' },
  { id: '2', date: '2023-08-16', amount: 1200, type: 'expense', category: 'Housing', description: 'Rent Payment' },
  { id: '3', date: '2023-08-20', amount: 150, type: 'expense', category: 'Utilities', description: 'Electricity Bill' },
  { id: '4', date: '2023-08-25', amount: 400, type: 'expense', category: 'Food', description: 'Groceries' },
  { id: '5', date: '2023-09-02', amount: 60, type: 'expense', category: 'Entertainment', description: 'Movie Tickets' },
  { id: '6', date: '2023-09-15', amount: 4500, type: 'income', category: 'Salary', description: 'September Salary' },
  { id: '7', date: '2023-09-18', amount: 1200, type: 'expense', category: 'Housing', description: 'Rent Payment' },
  { id: '8', date: '2023-09-22', amount: 120, type: 'expense', category: 'Utilities', description: 'Water & Gas' },
  { id: '9', date: '2023-09-28', amount: 350, type: 'expense', category: 'Food', description: 'Groceries' },
  { id: '10', date: '2023-10-05', amount: 200, type: 'income', category: 'Freelance', description: 'Web Design Project' },
  { id: '11', date: '2023-10-10', amount: 80, type: 'expense', category: 'Transport', description: 'Gas Station' },
  { id: '12', date: '2023-10-15', amount: 4500, type: 'income', category: 'Salary', description: 'October Salary' },
  { id: '13', date: '2023-10-16', amount: 1200, type: 'expense', category: 'Housing', description: 'Rent Payment' },
  { id: '14', date: '2023-10-20', amount: 500, type: 'expense', category: 'Shopping', description: 'New Clothes' },
];

export const categories = {
  income: ['Salary', 'Freelance', 'Investments', 'Other Income'],
  expense: ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Other Expense']
};