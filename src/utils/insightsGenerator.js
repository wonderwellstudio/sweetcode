import { format } from 'date-fns';
import { analyzeCashFlow, analyzeMonthlyCashFlow, calculateFinancialHealthScore, predictCashFlow } from './cashFlowAnalyzer';
import { getSpendingByCategory } from './categorizer';
import { detectRecurringTransactions, analyzeSpendingTrends } from './patternAnalyzer';
import { detectAnomalies, getAnomalySummary } from './anomalyDetector';

/**
 * Insights Generator
 * Generates actionable financial insights and recommendations
 */

/**
 * Generate comprehensive financial insights
 */
export const generateInsights = (transactions) => {
  const insights = {
    summary: generateSummaryInsights(transactions),
    cashFlow: generateCashFlowInsights(transactions),
    spending: generateSpendingInsights(transactions),
    recurring: generateRecurringInsights(transactions),
    anomalies: generateAnomalyInsights(transactions),
    recommendations: generateRecommendations(transactions)
  };

  return insights;
};

/**
 * Generate summary insights
 */
const generateSummaryInsights = (transactions) => {
  const cashFlow = analyzeCashFlow(transactions);
  const healthScore = calculateFinancialHealthScore(transactions);

  const insights = [];

  // Overall health
  if (healthScore >= 80) {
    insights.push({
      type: 'positive',
      title: 'Strong Financial Health',
      message: `Your financial health score is ${healthScore}/100. You're doing great!`,
      icon: '🎯'
    });
  } else if (healthScore >= 60) {
    insights.push({
      type: 'neutral',
      title: 'Good Financial Health',
      message: `Your financial health score is ${healthScore}/100. There's room for improvement.`,
      icon: '📊'
    });
  } else {
    insights.push({
      type: 'warning',
      title: 'Financial Health Needs Attention',
      message: `Your financial health score is ${healthScore}/100. Consider reviewing your spending habits.`,
      icon: '⚠️'
    });
  }

  // Cash flow status
  if (cashFlow.netCashFlow > 0) {
    insights.push({
      type: 'positive',
      title: 'Positive Cash Flow',
      message: `You have a net positive cash flow of $${cashFlow.netCashFlow.toFixed(2)}`,
      icon: '💰'
    });
  } else if (cashFlow.netCashFlow < 0) {
    insights.push({
      type: 'warning',
      title: 'Negative Cash Flow',
      message: `You're spending $${Math.abs(cashFlow.netCashFlow).toFixed(2)} more than you earn`,
      icon: '📉'
    });
  }

  // Savings rate
  if (cashFlow.savingsRate >= 20) {
    insights.push({
      type: 'positive',
      title: 'Excellent Savings Rate',
      message: `You're saving ${cashFlow.savingsRate.toFixed(1)}% of your income`,
      icon: '💎'
    });
  } else if (cashFlow.savingsRate >= 10) {
    insights.push({
      type: 'neutral',
      title: 'Good Savings Rate',
      message: `You're saving ${cashFlow.savingsRate.toFixed(1)}% of your income. Try to reach 20%!`,
      icon: '💵'
    });
  } else if (cashFlow.savingsRate > 0) {
    insights.push({
      type: 'warning',
      title: 'Low Savings Rate',
      message: `You're only saving ${cashFlow.savingsRate.toFixed(1)}% of your income`,
      icon: '⚠️'
    });
  }

  return insights;
};

/**
 * Generate cash flow insights
 */
const generateCashFlowInsights = (transactions) => {
  const insights = [];
  const monthly = analyzeMonthlyCashFlow(transactions);

  if (monthly.length >= 2) {
    const current = monthly[monthly.length - 1];
    const previous = monthly[monthly.length - 2];

    const expenseChange = ((current.expenses - previous.expenses) / previous.expenses) * 100;

    if (Math.abs(expenseChange) > 20) {
      insights.push({
        type: expenseChange > 0 ? 'warning' : 'positive',
        title: 'Significant Spending Change',
        message: `Your spending ${expenseChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(expenseChange).toFixed(1)}% this month`,
        icon: expenseChange > 0 ? '📈' : '📉'
      });
    }
  }

  // Predict future cash flow
  const prediction = predictCashFlow(transactions, 1);
  if (prediction && prediction[0]) {
    const nextMonth = prediction[0];
    if (nextMonth.predictedNetCashFlow < 0) {
      insights.push({
        type: 'warning',
        title: 'Predicted Negative Cash Flow',
        message: `Based on trends, you may have a negative cash flow of $${Math.abs(nextMonth.predictedNetCashFlow).toFixed(2)} next month`,
        icon: '⚠️',
        action: 'Consider reducing discretionary spending'
      });
    }
  }

  return insights;
};

/**
 * Generate spending insights
 */
const generateSpendingInsights = (transactions) => {
  const insights = [];
  const categoryStats = getSpendingByCategory(transactions);

  if (categoryStats.length === 0) return insights;

  // Top spending category
  const topCategory = categoryStats[0];
  const totalSpending = categoryStats.reduce((sum, cat) => sum + cat.total, 0);
  const topCategoryPercent = (topCategory.total / totalSpending) * 100;

  insights.push({
    type: 'info',
    title: `Top Spending: ${topCategory.category}`,
    message: `${topCategoryPercent.toFixed(1)}% of your spending ($${topCategory.total.toFixed(2)})`,
    icon: '🏆'
  });

  // Check for high discretionary spending
  const discretionaryCategories = [
    'Restaurants & Dining',
    'Entertainment',
    'Shopping',
    'Personal Care'
  ];

  const discretionarySpending = categoryStats
    .filter(cat => discretionaryCategories.includes(cat.category))
    .reduce((sum, cat) => sum + cat.total, 0);

  const discretionaryPercent = (discretionarySpending / totalSpending) * 100;

  if (discretionaryPercent > 30) {
    insights.push({
      type: 'warning',
      title: 'High Discretionary Spending',
      message: `${discretionaryPercent.toFixed(1)}% of spending is on non-essentials ($${discretionarySpending.toFixed(2)})`,
      icon: '🛍️',
      action: 'Consider reducing dining out or entertainment expenses'
    });
  }

  // Check for high subscription spending
  const subscriptionCategory = categoryStats.find(cat => cat.category === 'Subscriptions');
  if (subscriptionCategory && subscriptionCategory.total > 100) {
    insights.push({
      type: 'info',
      title: 'Subscription Spending',
      message: `You're spending $${subscriptionCategory.total.toFixed(2)}/month on subscriptions`,
      icon: '📱',
      action: 'Review and cancel unused subscriptions'
    });
  }

  return insights;
};

/**
 * Generate recurring transaction insights
 */
const generateRecurringInsights = (transactions) => {
  const insights = [];
  const recurring = detectRecurringTransactions(transactions);

  if (recurring.length > 0) {
    const totalRecurring = recurring.reduce((sum, r) => sum + Math.abs(r.avgAmount), 0);

    insights.push({
      type: 'info',
      title: 'Recurring Transactions',
      message: `Found ${recurring.length} recurring transactions totaling ~$${totalRecurring.toFixed(2)}/month`,
      icon: '🔄',
      details: recurring.slice(0, 5).map(r => ({
        description: r.description,
        amount: Math.abs(r.avgAmount),
        frequency: r.frequency
      }))
    });

    // Check for upcoming recurring expenses
    const upcomingExpenses = recurring
      .filter(r => {
        const daysUntil = (r.nextExpectedDate - new Date()) / (1000 * 60 * 60 * 24);
        return daysUntil >= 0 && daysUntil <= 7;
      });

    if (upcomingExpenses.length > 0) {
      const upcomingTotal = upcomingExpenses.reduce((sum, r) => sum + Math.abs(r.avgAmount), 0);
      insights.push({
        type: 'info',
        title: 'Upcoming Recurring Expenses',
        message: `${upcomingExpenses.length} recurring expenses (~$${upcomingTotal.toFixed(2)}) expected in the next 7 days`,
        icon: '📅',
        details: upcomingExpenses.map(r => ({
          description: r.description,
          amount: Math.abs(r.avgAmount),
          expectedDate: format(r.nextExpectedDate, 'MMM dd')
        }))
      });
    }
  }

  return insights;
};

/**
 * Generate anomaly insights
 */
const generateAnomalyInsights = (transactions) => {
  const insights = [];
  const anomalies = detectAnomalies(transactions);
  const summary = getAnomalySummary(anomalies);

  if (summary.total > 0) {
    if (summary.high > 0) {
      insights.push({
        type: 'warning',
        title: 'High-Risk Anomalies Detected',
        message: `Found ${summary.high} high-risk transaction(s) requiring review`,
        icon: '🚨',
        action: 'Review these transactions immediately'
      });
    }

    if (summary.medium > 0) {
      insights.push({
        type: 'info',
        title: 'Unusual Transactions',
        message: `Found ${summary.medium} unusual transaction(s) worth checking`,
        icon: '🔍'
      });
    }
  }

  return insights;
};

/**
 * Generate actionable recommendations
 */
const generateRecommendations = (transactions) => {
  const recommendations = [];
  const cashFlow = analyzeCashFlow(transactions);
  const categoryStats = getSpendingByCategory(transactions);

  // Budget recommendations
  if (cashFlow.savingsRate < 10) {
    recommendations.push({
      category: 'Savings',
      priority: 'high',
      title: 'Increase Your Savings',
      description: 'Aim to save at least 10-20% of your income',
      actions: [
        'Set up automatic transfers to savings on payday',
        'Reduce discretionary spending by 10%',
        'Find one subscription or expense to eliminate'
      ],
      potentialSavings: cashFlow.totalIncome * 0.1
    });
  }

  // Category-specific recommendations
  const diningCategory = categoryStats.find(cat => cat.category === 'Restaurants & Dining');
  if (diningCategory && diningCategory.total > 300) {
    recommendations.push({
      category: 'Dining',
      priority: 'medium',
      title: 'Reduce Dining Out',
      description: `You're spending $${diningCategory.total.toFixed(2)}/month on restaurants`,
      actions: [
        'Cook at home 2-3 more times per week',
        'Bring lunch to work instead of eating out',
        'Use grocery delivery to avoid impulse restaurant orders'
      ],
      potentialSavings: diningCategory.total * 0.3
    });
  }

  const subscriptionsCategory = categoryStats.find(cat => cat.category === 'Subscriptions');
  if (subscriptionsCategory && subscriptionsCategory.total > 50) {
    recommendations.push({
      category: 'Subscriptions',
      priority: 'medium',
      title: 'Review Subscriptions',
      description: `You have $${subscriptionsCategory.total.toFixed(2)}/month in subscriptions`,
      actions: [
        'Audit all active subscriptions',
        'Cancel services you rarely use',
        'Look for annual plans (often 15-20% cheaper)',
        'Share family plans with household members'
      ],
      potentialSavings: subscriptionsCategory.total * 0.25
    });
  }

  // Emergency fund recommendation
  if (cashFlow.netCashFlow > 0) {
    const monthlyExpenses = cashFlow.totalExpenses;
    const emergencyFund = monthlyExpenses * 6;

    recommendations.push({
      category: 'Emergency Fund',
      priority: 'high',
      title: 'Build an Emergency Fund',
      description: 'Financial experts recommend 3-6 months of expenses',
      actions: [
        `Target: $${emergencyFund.toFixed(2)} (6 months)`,
        'Open a high-yield savings account',
        `Save $${(cashFlow.netCashFlow * 0.5).toFixed(2)}/month to reach goal in ~${(emergencyFund / (cashFlow.netCashFlow * 0.5)).toFixed(0)} months`
      ]
    });
  }

  // Investment recommendation
  if (cashFlow.savingsRate > 20) {
    recommendations.push({
      category: 'Investing',
      priority: 'medium',
      title: 'Consider Investing',
      description: "You're saving well - consider growing your wealth through investing",
      actions: [
        'Max out employer 401(k) match (free money!)',
        'Open a Roth IRA if eligible',
        'Consider low-cost index funds',
        'Consult with a financial advisor'
      ]
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

/**
 * Generate a plain English summary of finances
 */
export const generateNarrativeSummary = (transactions) => {
  const cashFlow = analyzeCashFlow(transactions);
  const healthScore = calculateFinancialHealthScore(transactions);
  const categoryStats = getSpendingByCategory(transactions);

  let summary = '';

  // Overall status
  if (healthScore >= 80) {
    summary += "Your finances are in great shape! ";
  } else if (healthScore >= 60) {
    summary += "Your finances are looking decent, with some room for improvement. ";
  } else {
    summary += "Your finances need attention. ";
  }

  // Income/expense overview
  summary += `You earned $${cashFlow.totalIncome.toFixed(2)} and spent $${cashFlow.totalExpenses.toFixed(2)}, `;

  if (cashFlow.netCashFlow > 0) {
    summary += `leaving you with a positive cash flow of $${cashFlow.netCashFlow.toFixed(2)}. `;
  } else if (cashFlow.netCashFlow < 0) {
    summary += `resulting in a shortfall of $${Math.abs(cashFlow.netCashFlow).toFixed(2)}. `;
  } else {
    summary += "breaking even. ";
  }

  // Savings rate
  if (cashFlow.savingsRate > 0) {
    summary += `You're saving ${cashFlow.savingsRate.toFixed(1)}% of your income`;
    if (cashFlow.savingsRate >= 20) {
      summary += " - excellent work! ";
    } else if (cashFlow.savingsRate >= 10) {
      summary += " - good, but aim for 20%. ";
    } else {
      summary += " - try to increase this. ";
    }
  }

  // Top spending
  if (categoryStats.length > 0) {
    const top = categoryStats[0];
    summary += `Your biggest expense is ${top.category} at $${top.total.toFixed(2)}. `;
  }

  return summary;
};
