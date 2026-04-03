import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { calculateTotals, groupByCategory, formatCurrency } from '../utils/helpers';
import Card from '../components/common/Card';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const InsightCard = ({ title, value, subtitle, icon, colorClass, delay }) => (
  <Card className="p-6 flex items-start space-x-4" delay={delay}>
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <SafeIcon icon={icon} className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{value}</h4>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
    </div>
  </Card>
);

const Insights = () => {
  const { transactions } = useSelector(state => state.finance);

  const insights = useMemo(() => {
    if (!transactions || transactions.length === 0) return null;

    const expensesOnly = transactions.filter(t => t.type === 'expense');
    const { income, expense } = calculateTotals(transactions);
    
    const savingsRate = income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0;

    // Highest Spending Category
    const groupedEpxenses = groupByCategory(transactions, 'expense');
    let highestCategory = { name: 'N/A', amount: 0 };
    for (const [name, amount] of Object.entries(groupedEpxenses)) {
      if (amount > highestCategory.amount) {
        highestCategory = { name, amount };
      }
    }

    // Largest Single Expense
    const largestExpense = expensesOnly.reduce(
      (max, curr) => curr.amount > max.amount ? curr : max,
      { amount: 0 }
    );

    // Average Monthly Expense
    const months = new Set(transactions.map(t => t.date.substring(0, 7))).size;
    const avgMonthlyExpense = months > 0 ? expense / months : 0;

    return {
      savingsRate,
      highestCategory,
      largestExpense,
      avgMonthlyExpense
    };
  }, [transactions]);

  if (!insights) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <SafeIcon icon={FiIcons.FiInfo} className="w-12 h-12 mb-4 opacity-50" />
        <p>Not enough data to generate insights. Add some transactions first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightCard 
          title="Savings Rate" 
          value={`${insights.savingsRate}%`}
          subtitle="Of total income saved"
          icon={FiIcons.FiPercent}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          delay={0.1}
        />
        <InsightCard 
          title="Top Expense Category" 
          value={insights.highestCategory.name}
          subtitle={formatCurrency(insights.highestCategory.amount)}
          icon={FiIcons.FiPieChart}
          colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
          delay={0.2}
        />
        <InsightCard 
          title="Largest Single Expense" 
          value={formatCurrency(insights.largestExpense.amount)}
          subtitle={insights.largestExpense.description || insights.largestExpense.category}
          icon={FiIcons.FiAlertCircle}
          colorClass="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          delay={0.3}
        />
        <InsightCard 
          title="Avg. Monthly Expense" 
          value={formatCurrency(insights.avgMonthlyExpense)}
          subtitle="Based on available history"
          icon={FiIcons.FiCalendar}
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          delay={0.4}
        />
      </div>

      <Card className="p-6" delay={0.5}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Summary Notes</h3>
        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
          <li className="flex items-start">
            <SafeIcon icon={FiIcons.FiCheckCircle} className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <span>Your primary source of spending is <strong>{insights.highestCategory.name}</strong>, accounting for a significant portion of your expenses. Consider reviewing this category for potential savings.</span>
          </li>
          <li className="flex items-start">
            <SafeIcon icon={FiIcons.FiCheckCircle} className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <span>You are saving <strong>{insights.savingsRate}%</strong> of your income. Financial experts generally recommend a savings rate of at least 20%.</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default Insights;