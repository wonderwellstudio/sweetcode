import { format, startOfMonth, endOfMonth, eachMonthOfInterval, differenceInMonths } from 'date-fns';

/**
 * Cash Flow Analysis Engine
 * Analyzes income vs expenses, trends, and financial health
 */

/**
 * Analyze overall cash flow
 */
export const analyzeCashFlow = (transactions) => {
  const income = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');

  const totalIncome = income.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netCashFlow = totalIncome - totalExpenses;

  const avgIncome = income.length > 0 ? totalIncome / income.length : 0;
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  return {
    totalIncome,
    totalExpenses,
    netCashFlow,
    avgIncome,
    avgExpense,
    incomeCount: income.length,
    expenseCount: expenses.length,
    savingsRate: totalIncome > 0 ? ((netCashFlow / totalIncome) * 100) : 0,
    cashFlowRatio: totalExpenses > 0 ? (totalIncome / totalExpenses) : 0
  };
};

/**
 * Analyze monthly cash flow
 */
export const analyzeMonthlyCashFlow = (transactions) => {
  if (transactions.length === 0) return [];

  const dates = transactions.map(t => t.date);
  const startDate = new Date(Math.min(...dates));
  const endDate = new Date(Math.max(...dates));

  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  return months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthTransactions = transactions.filter(t => {
      return t.date >= monthStart && t.date <= monthEnd;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      month: format(month, 'yyyy-MM'),
      monthLabel: format(month, 'MMM yyyy'),
      income,
      expenses,
      netCashFlow: income - expenses,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
      transactionCount: monthTransactions.length
    };
  });
};

/**
 * Calculate financial health score (0-100)
 */
export const calculateFinancialHealthScore = (transactions) => {
  let score = 50; // Start at neutral

  const cashFlow = analyzeCashFlow(transactions);

  // Positive cash flow (+30 points)
  if (cashFlow.netCashFlow > 0) {
    score += 30;
  } else if (cashFlow.netCashFlow < 0) {
    score -= 20;
  }

  // Good savings rate (+20 points)
  if (cashFlow.savingsRate >= 20) {
    score += 20;
  } else if (cashFlow.savingsRate >= 10) {
    score += 10;
  } else if (cashFlow.savingsRate < 0) {
    score -= 10;
  }

  // Consistent income (check monthly variance)
  const monthly = analyzeMonthlyCashFlow(transactions);
  if (monthly.length >= 3) {
    const incomeAmounts = monthly.map(m => m.income);
    const avgIncome = incomeAmounts.reduce((a, b) => a + b, 0) / incomeAmounts.length;
    const variance = incomeAmounts.reduce((sum, income) => {
      return sum + Math.pow(income - avgIncome, 2);
    }, 0) / incomeAmounts.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = avgIncome > 0 ? (stdDev / avgIncome) : 0;

    if (coefficientOfVariation < 0.2) {
      score += 10; // Very consistent
    } else if (coefficientOfVariation > 0.5) {
      score -= 10; // Very inconsistent
    }
  }

  return Math.max(0, Math.min(100, score));
};

/**
 * Predict future cash flow based on trends
 */
export const predictCashFlow = (transactions, monthsAhead = 3) => {
  const monthly = analyzeMonthlyCashFlow(transactions);

  if (monthly.length < 3) {
    return null; // Need at least 3 months of data
  }

  // Calculate trend using simple linear regression
  const recentMonths = monthly.slice(-6); // Use last 6 months

  const avgIncome = recentMonths.reduce((sum, m) => sum + m.income, 0) / recentMonths.length;
  const avgExpenses = recentMonths.reduce((sum, m) => sum + m.expenses, 0) / recentMonths.length;

  // Calculate trend
  const incomeTrend = calculateTrend(recentMonths.map(m => m.income));
  const expenseTrend = calculateTrend(recentMonths.map(m => m.expenses));

  const predictions = [];
  for (let i = 1; i <= monthsAhead; i++) {
    const predictedIncome = avgIncome + (incomeTrend * i);
    const predictedExpenses = avgExpenses + (expenseTrend * i);

    predictions.push({
      monthsFromNow: i,
      predictedIncome,
      predictedExpenses,
      predictedNetCashFlow: predictedIncome - predictedExpenses
    });
  }

  return predictions;
};

/**
 * Calculate trend (slope) using simple linear regression
 */
const calculateTrend = (values) => {
  const n = values.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  const sumX = indices.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + (x * values[i]), 0);
  const sumX2 = indices.reduce((sum, x) => sum + (x * x), 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  return slope;
};

/**
 * Analyze spending velocity (how fast money is being spent)
 */
export const analyzeSpendingVelocity = (transactions) => {
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .sort((a, b) => a.date - b.date);

  if (expenses.length < 2) {
    return null;
  }

  const totalSpent = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const daysSpanned = differenceInMonths(
    expenses[expenses.length - 1].date,
    expenses[0].date
  ) * 30; // Approximate days

  const dailyBurnRate = daysSpanned > 0 ? totalSpent / daysSpanned : 0;
  const monthlyBurnRate = dailyBurnRate * 30;

  return {
    dailyBurnRate,
    monthlyBurnRate,
    averageTransactionSize: totalSpent / expenses.length,
    transactionsPerDay: daysSpanned > 0 ? expenses.length / daysSpanned : 0
  };
};

/**
 * Compare current period vs previous period
 */
export const comparePeriods = (transactions) => {
  const monthly = analyzeMonthlyCashFlow(transactions);

  if (monthly.length < 2) {
    return null;
  }

  const current = monthly[monthly.length - 1];
  const previous = monthly[monthly.length - 2];

  return {
    current,
    previous,
    incomeChange: current.income - previous.income,
    incomeChangePercent: previous.income > 0 ?
      ((current.income - previous.income) / previous.income) * 100 : 0,
    expenseChange: current.expenses - previous.expenses,
    expenseChangePercent: previous.expenses > 0 ?
      ((current.expenses - previous.expenses) / previous.expenses) * 100 : 0,
    netCashFlowChange: current.netCashFlow - previous.netCashFlow
  };
};

/**
 * Calculate emergency fund adequacy
 */
export const calculateEmergencyFundNeed = (transactions) => {
  const monthly = analyzeMonthlyCashFlow(transactions);

  if (monthly.length === 0) {
    return null;
  }

  const recentMonths = monthly.slice(-3);
  const avgMonthlyExpenses = recentMonths.reduce((sum, m) => sum + m.expenses, 0) / recentMonths.length;

  return {
    monthlyExpenses: avgMonthlyExpenses,
    threeMonthFund: avgMonthlyExpenses * 3,
    sixMonthFund: avgMonthlyExpenses * 6,
    oneYearFund: avgMonthlyExpenses * 12
  };
};

/**
 * Get spending breakdown by time period
 */
export const getSpendingBreakdown = (transactions) => {
  const now = new Date();
  const expenses = transactions.filter(t => t.type === 'expense');

  const today = expenses.filter(t => {
    return format(t.date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
  });

  const thisWeek = expenses.filter(t => {
    const daysDiff = (now.getTime() - t.date.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  });

  const thisMonth = expenses.filter(t => {
    return format(t.date, 'yyyy-MM') === format(now, 'yyyy-MM');
  });

  const thisYear = expenses.filter(t => {
    return format(t.date, 'yyyy') === format(now, 'yyyy');
  });

  const sum = (txns) => txns.reduce((total, t) => total + Math.abs(t.amount), 0);

  return {
    today: { amount: sum(today), count: today.length },
    thisWeek: { amount: sum(thisWeek), count: thisWeek.length },
    thisMonth: { amount: sum(thisMonth), count: thisMonth.length },
    thisYear: { amount: sum(thisYear), count: thisYear.length }
  };
};
