/**
 * Transaction Categorization Engine
 * Intelligently categorizes transactions based on description patterns
 */

// Category definitions with keywords and patterns
const CATEGORY_RULES = {
  'Groceries & Food': {
    keywords: ['grocery', 'supermarket', 'whole foods', 'trader joe', 'safeway', 'kroger', 'walmart', 'target', 'costco', 'food', 'market'],
    patterns: [/grocery/i, /market$/i, /foods?$/i]
  },
  'Restaurants & Dining': {
    keywords: ['restaurant', 'cafe', 'coffee', 'starbucks', 'dunkin', 'chipotle', 'mcdonalds', 'burger', 'pizza', 'dining', 'bar & grill', 'kitchen', 'eatery', 'diner', 'bistro'],
    patterns: [/restaurant/i, /cafe/i, /grill/i, /kitchen/i]
  },
  'Transportation': {
    keywords: ['uber', 'lyft', 'gas', 'fuel', 'shell', 'chevron', 'exxon', 'bp', 'mobil', 'parking', 'metro', 'transit', 'airline', 'flight'],
    patterns: [/gas\s*station/i, /fuel/i, /parking/i]
  },
  'Utilities': {
    keywords: ['electric', 'water', 'gas company', 'utility', 'power', 'energy', 'internet', 'phone', 'mobile', 'verizon', 'at&t', 'comcast', 'spectrum'],
    patterns: [/electric/i, /power/i, /utility/i, /telecom/i]
  },
  'Entertainment': {
    keywords: ['netflix', 'spotify', 'hulu', 'disney', 'amazon prime', 'youtube', 'apple music', 'movie', 'theater', 'cinema', 'concert', 'game', 'entertainment'],
    patterns: [/streaming/i, /subscription/i, /entertainment/i]
  },
  'Shopping': {
    keywords: ['amazon', 'ebay', 'etsy', 'shop', 'store', 'retail', 'mall', 'purchase'],
    patterns: [/shop/i, /retail/i, /store$/i]
  },
  'Healthcare': {
    keywords: ['pharmacy', 'cvs', 'walgreens', 'medical', 'hospital', 'doctor', 'dentist', 'clinic', 'health', 'insurance'],
    patterns: [/medical/i, /health/i, /pharma/i, /dr\./i]
  },
  'Housing & Rent': {
    keywords: ['rent', 'mortgage', 'property', 'landlord', 'housing', 'apartment', 'real estate'],
    patterns: [/rent/i, /mortgage/i, /property/i]
  },
  'Insurance': {
    keywords: ['insurance', 'policy', 'premium', 'coverage'],
    patterns: [/insurance/i, /policy/i]
  },
  'Income': {
    keywords: ['salary', 'payroll', 'deposit', 'payment', 'direct dep', 'paycheck', 'income', 'wage', 'earnings'],
    patterns: [/payroll/i, /salary/i, /direct\s*dep/i],
    types: ['income']
  },
  'Subscriptions': {
    keywords: ['subscription', 'monthly', 'recurring', 'membership', 'annual fee'],
    patterns: [/subscription/i, /membership/i]
  },
  'Banking & Fees': {
    keywords: ['bank fee', 'atm fee', 'service charge', 'overdraft', 'interest', 'finance charge'],
    patterns: [/fee$/i, /charge$/i, /interest/i]
  },
  'Transfers': {
    keywords: ['transfer', 'zelle', 'venmo', 'paypal', 'cash app', 'wire'],
    patterns: [/transfer/i, /p2p/i]
  },
  'Education': {
    keywords: ['tuition', 'school', 'university', 'college', 'education', 'course', 'class', 'student'],
    patterns: [/tuition/i, /education/i, /university/i]
  },
  'Personal Care': {
    keywords: ['salon', 'spa', 'gym', 'fitness', 'yoga', 'beauty', 'haircut', 'massage'],
    patterns: [/salon/i, /spa/i, /gym/i, /fitness/i]
  },
  'Taxes': {
    keywords: ['tax', 'irs', 'federal', 'state tax', 'property tax'],
    patterns: [/tax/i, /irs/i]
  }
};

/**
 * Categorize a single transaction
 */
export const categorizeTransaction = (transaction) => {
  const description = transaction.description.toLowerCase();
  const type = transaction.type;

  // Check each category's rules
  for (const [category, rules] of Object.entries(CATEGORY_RULES)) {
    // Check if category is type-specific
    if (rules.types && !rules.types.includes(type)) {
      continue;
    }

    // Check keywords
    for (const keyword of rules.keywords) {
      if (description.includes(keyword.toLowerCase())) {
        return category;
      }
    }

    // Check patterns
    for (const pattern of rules.patterns) {
      if (pattern.test(description)) {
        return category;
      }
    }
  }

  // Default categories based on type
  if (type === 'income') {
    return 'Other Income';
  }

  return 'Other';
};

/**
 * Categorize all transactions
 */
export const categorizeTransactions = (transactions) => {
  return transactions.map(transaction => ({
    ...transaction,
    category: transaction.category || categorizeTransaction(transaction)
  }));
};

/**
 * Get category statistics
 */
export const getCategoryStats = (transactions) => {
  const stats = {};

  transactions.forEach(transaction => {
    const category = transaction.category || 'Uncategorized';

    if (!stats[category]) {
      stats[category] = {
        category,
        count: 0,
        total: 0,
        transactions: []
      };
    }

    stats[category].count++;
    stats[category].total += Math.abs(transaction.amount);
    stats[category].transactions.push(transaction);
  });

  // Convert to array and sort by total
  return Object.values(stats).sort((a, b) => b.total - a.total);
};

/**
 * Get spending by category (expenses only)
 */
export const getSpendingByCategory = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  return getCategoryStats(expenses);
};

/**
 * Get income by category
 */
export const getIncomeByCategory = (transactions) => {
  const income = transactions.filter(t => t.type === 'income');
  return getCategoryStats(income);
};

/**
 * Suggest category based on similar transactions
 */
export const suggestCategory = (description, historicalTransactions) => {
  const descLower = description.toLowerCase();

  // Find similar transactions
  const similar = historicalTransactions.filter(t => {
    const tDescLower = t.description.toLowerCase();
    return tDescLower.includes(descLower) || descLower.includes(tDescLower);
  });

  if (similar.length === 0) {
    return null;
  }

  // Find most common category among similar transactions
  const categoryCounts = {};
  similar.forEach(t => {
    const cat = t.category || 'Uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  return Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
};
