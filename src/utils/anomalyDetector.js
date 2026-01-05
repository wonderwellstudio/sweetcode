import { differenceInDays, format } from 'date-fns';

/**
 * Anomaly Detection Engine
 * Flags unusual, suspicious, or concerning transactions
 */

/**
 * Detect all anomalies in transactions
 */
export const detectAnomalies = (transactions) => {
  const anomalies = [];

  // Calculate statistics
  const stats = calculateStatistics(transactions);

  transactions.forEach(transaction => {
    const transactionAnomalies = [];

    // Check for unusually large amounts
    if (isUnusuallyLarge(transaction, stats)) {
      transactionAnomalies.push({
        type: 'large_amount',
        severity: 'high',
        message: `Unusually large ${transaction.type}: ${Math.abs(transaction.amount).toFixed(2)} (${stats.percentile}% of your typical transactions)`
      });
    }

    // Check for duplicate transactions (possible double charge)
    const duplicates = findDuplicates(transaction, transactions);
    if (duplicates.length > 0) {
      transactionAnomalies.push({
        type: 'duplicate',
        severity: 'medium',
        message: `Possible duplicate transaction - ${duplicates.length} similar transactions on the same day`,
        relatedTransactions: duplicates
      });
    }

    // Check for round number transactions (possible fraud indicator)
    if (isRoundNumber(transaction.amount)) {
      transactionAnomalies.push({
        type: 'round_number',
        severity: 'low',
        message: 'Round number transaction - verify this is legitimate'
      });
    }

    // Check for unusual merchant
    if (isUnusualMerchant(transaction, transactions)) {
      transactionAnomalies.push({
        type: 'unusual_merchant',
        severity: 'medium',
        message: 'First time transaction with this merchant - verify if authorized'
      });
    }

    // Check for rapid succession transactions
    const rapidTransactions = findRapidTransactions(transaction, transactions);
    if (rapidTransactions.length > 0) {
      transactionAnomalies.push({
        type: 'rapid_succession',
        severity: 'medium',
        message: `${rapidTransactions.length + 1} transactions within 1 hour - possible card skimming`,
        relatedTransactions: rapidTransactions
      });
    }

    if (transactionAnomalies.length > 0) {
      anomalies.push({
        transaction,
        anomalies: transactionAnomalies,
        totalSeverityScore: calculateSeverityScore(transactionAnomalies)
      });
    }
  });

  return anomalies.sort((a, b) => b.totalSeverityScore - a.totalSeverityScore);
};

/**
 * Calculate transaction statistics for comparison
 */
const calculateStatistics = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const amounts = expenses.map(t => Math.abs(t.amount)).sort((a, b) => a - b);

  if (amounts.length === 0) {
    return { mean: 0, median: 0, stdDev: 0, percentile: 0 };
  }

  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const median = amounts[Math.floor(amounts.length / 2)];

  // Calculate standard deviation
  const squareDiffs = amounts.map(value => Math.pow(value - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
  const stdDev = Math.sqrt(avgSquareDiff);

  // 95th percentile
  const percentile95 = amounts[Math.floor(amounts.length * 0.95)];

  return { mean, median, stdDev, percentile95, amounts };
};

/**
 * Check if transaction amount is unusually large
 */
const isUnusuallyLarge = (transaction, stats) => {
  if (transaction.type !== 'expense') return false;

  const amount = Math.abs(transaction.amount);

  // Consider unusual if:
  // 1. More than 3 standard deviations from mean
  // 2. OR more than 95th percentile
  return amount > (stats.mean + (stats.stdDev * 3)) || amount > stats.percentile95;
};

/**
 * Find duplicate transactions (same amount, same day, similar description)
 */
const findDuplicates = (transaction, allTransactions) => {
  const duplicates = allTransactions.filter(t => {
    if (t.id === transaction.id) return false;

    const sameDay = differenceInDays(t.date, transaction.date) === 0;
    const sameAmount = Math.abs(t.amount - transaction.amount) < 0.01;
    const similarDescription = calculateSimilarity(t.description, transaction.description) > 0.7;

    return sameDay && sameAmount && similarDescription;
  });

  return duplicates;
};

/**
 * Calculate string similarity (Levenshtein distance based)
 */
const calculateSimilarity = (str1, str2) => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  // Simple similarity: check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) {
    return 0.8;
  }

  // Check for common words
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const commonWords = words1.filter(w => words2.includes(w));

  return commonWords.length / Math.max(words1.length, words2.length);
};

/**
 * Check if amount is a round number
 */
const isRoundNumber = (amount) => {
  const absAmount = Math.abs(amount);

  // Check if it's a multiple of 100, 50, or 25
  return absAmount >= 50 && (
    absAmount % 100 === 0 ||
    absAmount % 50 === 0 ||
    (absAmount >= 100 && absAmount % 25 === 0)
  );
};

/**
 * Check if merchant is unusual (first time or very rare)
 */
const isUnusualMerchant = (transaction, allTransactions) => {
  const normalizedDesc = normalizeDescription(transaction.description);

  const similarTransactions = allTransactions.filter(t => {
    return normalizeDescription(t.description) === normalizedDesc;
  });

  // Unusual if this is the only transaction with this merchant
  return similarTransactions.length === 1;
};

/**
 * Normalize description for comparison
 */
const normalizeDescription = (description) => {
  return description
    .toLowerCase()
    .replace(/\d+/g, '')
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Find transactions in rapid succession (within 1 hour)
 */
const findRapidTransactions = (transaction, allTransactions) => {
  const oneHourMs = 60 * 60 * 1000;

  return allTransactions.filter(t => {
    if (t.id === transaction.id) return false;

    const timeDiff = Math.abs(t.date.getTime() - transaction.date.getTime());
    return timeDiff < oneHourMs;
  });
};

/**
 * Calculate total severity score
 */
const calculateSeverityScore = (anomalies) => {
  const severityWeights = {
    high: 10,
    medium: 5,
    low: 2
  };

  return anomalies.reduce((score, anomaly) => {
    return score + (severityWeights[anomaly.severity] || 0);
  }, 0);
};

/**
 * Get summary of anomalies
 */
export const getAnomalySummary = (anomalies) => {
  const summary = {
    total: anomalies.length,
    high: 0,
    medium: 0,
    low: 0,
    types: {},
    totalAmount: 0
  };

  anomalies.forEach(item => {
    summary.totalAmount += Math.abs(item.transaction.amount);

    item.anomalies.forEach(anomaly => {
      summary[anomaly.severity]++;

      if (!summary.types[anomaly.type]) {
        summary.types[anomaly.type] = 0;
      }
      summary.types[anomaly.type]++;
    });
  });

  return summary;
};

/**
 * Flag potentially fraudulent transactions
 */
export const flagPotentialFraud = (transactions) => {
  const suspicious = [];

  transactions.forEach(transaction => {
    const flags = [];

    // Multiple risk factors
    if (Math.abs(transaction.amount) > 500) {
      flags.push('Large amount');
    }

    if (isRoundNumber(transaction.amount)) {
      flags.push('Round number');
    }

    if (isUnusualMerchant(transaction, transactions)) {
      flags.push('New merchant');
    }

    const rapidTxns = findRapidTransactions(transaction, transactions);
    if (rapidTxns.length >= 2) {
      flags.push('Multiple rapid transactions');
    }

    // If multiple flags, mark as suspicious
    if (flags.length >= 2) {
      suspicious.push({
        transaction,
        riskScore: flags.length * 10,
        flags
      });
    }
  });

  return suspicious.sort((a, b) => b.riskScore - a.riskScore);
};
