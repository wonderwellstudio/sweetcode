import { differenceInDays, startOfMonth, endOfMonth, eachMonthOfInterval, format } from 'date-fns';

/**
 * Pattern Analysis Engine
 * Identifies recurring transactions, spending patterns, and trends
 */

/**
 * Detect recurring transactions (subscriptions, bills, etc.)
 */
export const detectRecurringTransactions = (transactions) => {
  const grouped = groupSimilarTransactions(transactions);
  const recurring = [];

  for (const group of grouped) {
    if (group.transactions.length < 2) continue;

    const intervals = calculateIntervals(group.transactions);
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const intervalStdDev = calculateStdDev(intervals);

    // Consider recurring if:
    // 1. At least 2 transactions
    // 2. Average interval is between 7-90 days (weekly to quarterly)
    // 3. Low variance in intervals (consistent timing)
    if (avgInterval >= 7 && avgInterval <= 90 && intervalStdDev < avgInterval * 0.3) {
      recurring.push({
        description: group.description,
        frequency: determineFrequency(avgInterval),
        avgAmount: group.avgAmount,
        lastAmount: group.transactions[0].amount,
        lastDate: group.transactions[0].date,
        count: group.transactions.length,
        transactions: group.transactions,
        nextExpectedDate: predictNextDate(group.transactions[0].date, avgInterval),
        category: group.transactions[0].category
      });
    }
  }

  return recurring.sort((a, b) => Math.abs(b.avgAmount) - Math.abs(a.avgAmount));
};

/**
 * Group similar transactions by description
 */
const groupSimilarTransactions = (transactions) => {
  const groups = {};

  transactions.forEach(transaction => {
    const key = normalizeDescription(transaction.description);

    if (!groups[key]) {
      groups[key] = {
        description: transaction.description,
        transactions: [],
        totalAmount: 0
      };
    }

    groups[key].transactions.push(transaction);
    groups[key].totalAmount += Math.abs(transaction.amount);
  });

  // Calculate averages and sort transactions by date
  return Object.values(groups).map(group => ({
    ...group,
    avgAmount: group.totalAmount / group.transactions.length,
    transactions: group.transactions.sort((a, b) => b.date - a.date)
  }));
};

/**
 * Normalize transaction description for grouping
 */
const normalizeDescription = (description) => {
  return description
    .toLowerCase()
    .replace(/\d+/g, '') // Remove numbers
    .replace(/[^a-z\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
    .substring(0, 30); // Take first 30 chars
};

/**
 * Calculate intervals between transactions (in days)
 */
const calculateIntervals = (transactions) => {
  const intervals = [];
  for (let i = 0; i < transactions.length - 1; i++) {
    const diff = differenceInDays(transactions[i].date, transactions[i + 1].date);
    intervals.push(Math.abs(diff));
  }
  return intervals;
};

/**
 * Calculate standard deviation
 */
const calculateStdDev = (values) => {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
  return Math.sqrt(avgSquareDiff);
};

/**
 * Determine frequency label from average interval
 */
const determineFrequency = (avgInterval) => {
  if (avgInterval <= 7) return 'Weekly';
  if (avgInterval <= 14) return 'Bi-weekly';
  if (avgInterval <= 31) return 'Monthly';
  if (avgInterval <= 62) return 'Bi-monthly';
  if (avgInterval <= 90) return 'Quarterly';
  return 'Irregular';
};

/**
 * Predict next transaction date
 */
const predictNextDate = (lastDate, avgInterval) => {
  const next = new Date(lastDate);
  next.setDate(next.getDate() + avgInterval);
  return next;
};

/**
 * Analyze spending trends over time
 */
export const analyzeSpendingTrends = (transactions) => {
  if (transactions.length === 0) return [];

  const expenses = transactions.filter(t => t.type === 'expense');

  // Group by month
  const monthlyData = groupByMonth(expenses);

  // Calculate trends
  const trends = [];
  const months = Object.keys(monthlyData).sort();

  for (let i = 0; i < months.length; i++) {
    const month = months[i];
    const data = monthlyData[month];

    const trend = {
      month,
      monthLabel: format(new Date(month), 'MMM yyyy'),
      totalSpent: data.total,
      transactionCount: data.count,
      avgTransaction: data.total / data.count,
      categoryBreakdown: data.categories
    };

    // Calculate month-over-month change
    if (i > 0) {
      const prevMonth = monthlyData[months[i - 1]];
      trend.changeAmount = data.total - prevMonth.total;
      trend.changePercent = ((data.total - prevMonth.total) / prevMonth.total) * 100;
    }

    trends.push(trend);
  }

  return trends;
};

/**
 * Group transactions by month
 */
const groupByMonth = (transactions) => {
  const monthly = {};

  transactions.forEach(transaction => {
    const monthKey = format(startOfMonth(transaction.date), 'yyyy-MM');

    if (!monthly[monthKey]) {
      monthly[monthKey] = {
        total: 0,
        count: 0,
        categories: {}
      };
    }

    monthly[monthKey].total += Math.abs(transaction.amount);
    monthly[monthKey].count++;

    const category = transaction.category || 'Other';
    if (!monthly[monthKey].categories[category]) {
      monthly[monthKey].categories[category] = 0;
    }
    monthly[monthKey].categories[category] += Math.abs(transaction.amount);
  });

  return monthly;
};

/**
 * Identify spending spikes (unusual high spending days/weeks)
 */
export const identifySpendingSpikes = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');

  // Group by day
  const dailySpending = {};
  expenses.forEach(t => {
    const day = format(t.date, 'yyyy-MM-dd');
    if (!dailySpending[day]) {
      dailySpending[day] = { date: t.date, total: 0, transactions: [] };
    }
    dailySpending[day].total += Math.abs(t.amount);
    dailySpending[day].transactions.push(t);
  });

  const days = Object.values(dailySpending);
  const amounts = days.map(d => d.total);
  const avgDaily = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const stdDev = calculateStdDev(amounts);

  // Identify spikes (2 standard deviations above mean)
  const threshold = avgDaily + (stdDev * 2);
  const spikes = days
    .filter(d => d.total > threshold)
    .sort((a, b) => b.total - a.total);

  return spikes.map(spike => ({
    date: spike.date,
    dateLabel: format(spike.date, 'MMM dd, yyyy'),
    amount: spike.total,
    transactionCount: spike.transactions.length,
    transactions: spike.transactions,
    percentAboveAverage: ((spike.total - avgDaily) / avgDaily) * 100
  }));
};

/**
 * Detect seasonal patterns
 */
export const detectSeasonalPatterns = (transactions) => {
  const monthlySpending = {};

  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      const month = format(transaction.date, 'MMMM');
      if (!monthlySpending[month]) {
        monthlySpending[month] = { total: 0, count: 0 };
      }
      monthlySpending[month].total += Math.abs(transaction.amount);
      monthlySpending[month].count++;
    });

  return Object.entries(monthlySpending)
    .map(([month, data]) => ({
      month,
      avgSpending: data.total / data.count,
      totalSpending: data.total
    }))
    .sort((a, b) => b.totalSpending - a.totalSpending);
};

/**
 * Find largest transactions
 */
export const findLargestTransactions = (transactions, limit = 10) => {
  return [...transactions]
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, limit);
};
