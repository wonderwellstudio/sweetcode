import Papa from 'papaparse';
import { parse, isValid } from 'date-fns';

/**
 * Parse CSV/TSV bank statement files
 * Supports multiple formats from different banks
 */
export const parseStatement = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
          const transactions = normalizeTransactions(results.data);
          resolve(transactions);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * Normalize transactions from various bank formats into a standard format
 */
const normalizeTransactions = (data) => {
  const transactions = [];

  for (const row of data) {
    const transaction = detectAndNormalizeFormat(row);
    if (transaction && transaction.date && (transaction.amount || transaction.debit || transaction.credit)) {
      transactions.push(transaction);
    }
  }

  return transactions.sort((a, b) => b.date - a.date);
};

/**
 * Detect bank statement format and normalize fields
 */
const detectAndNormalizeFormat = (row) => {
  const normalized = {
    id: generateId(),
    date: null,
    description: '',
    amount: 0,
    type: 'expense',
    category: null,
    balance: null,
    raw: row
  };

  // Detect date field (various formats)
  const dateField = findField(row, ['date', 'transaction date', 'posting date', 'trans date', 'value date']);
  if (dateField) {
    normalized.date = parseDate(dateField);
  }

  if (!normalized.date) {
    return null; // Skip invalid transactions
  }

  // Detect description field
  const descField = findField(row, ['description', 'details', 'transaction details', 'merchant', 'payee', 'memo', 'narrative']);
  if (descField) {
    normalized.description = String(descField).trim();
  }

  // Detect amount field(s)
  const amountField = findField(row, ['amount', 'transaction amount']);
  const debitField = findField(row, ['debit', 'withdrawal', 'debit amount', 'withdrawals']);
  const creditField = findField(row, ['credit', 'deposit', 'credit amount', 'deposits']);

  if (amountField !== undefined && amountField !== null) {
    normalized.amount = parseAmount(amountField);
    normalized.type = normalized.amount < 0 ? 'expense' : 'income';
  } else if (debitField !== undefined || creditField !== undefined) {
    const debit = debitField !== undefined ? Math.abs(parseAmount(debitField)) : 0;
    const credit = creditField !== undefined ? Math.abs(parseAmount(creditField)) : 0;

    if (credit > 0) {
      normalized.amount = credit;
      normalized.type = 'income';
    } else if (debit > 0) {
      normalized.amount = -debit;
      normalized.type = 'expense';
    }
  }

  // Detect balance
  const balanceField = findField(row, ['balance', 'running balance', 'account balance']);
  if (balanceField !== undefined) {
    normalized.balance = parseAmount(balanceField);
  }

  return normalized;
};

/**
 * Find a field in the row by checking multiple possible names (case-insensitive)
 */
const findField = (row, possibleNames) => {
  const keys = Object.keys(row);

  for (const name of possibleNames) {
    const match = keys.find(k => k.toLowerCase().trim() === name.toLowerCase());
    if (match && row[match] !== undefined && row[match] !== null && row[match] !== '') {
      return row[match];
    }
  }

  return undefined;
};

/**
 * Parse date string into Date object
 */
const parseDate = (dateStr) => {
  if (!dateStr) return null;

  const dateString = String(dateStr).trim();

  // Common date formats
  const formats = [
    'MM/dd/yyyy',
    'dd/MM/yyyy',
    'yyyy-MM-dd',
    'MM-dd-yyyy',
    'dd-MM-yyyy',
    'M/d/yyyy',
    'd/M/yyyy',
    'MMM dd, yyyy',
    'dd MMM yyyy',
    'yyyy/MM/dd'
  ];

  for (const format of formats) {
    const parsed = parse(dateString, format, new Date());
    if (isValid(parsed)) {
      return parsed;
    }
  }

  // Try native Date parsing as fallback
  const nativeDate = new Date(dateString);
  if (isValid(nativeDate)) {
    return nativeDate;
  }

  return null;
};

/**
 * Parse amount string into number
 */
const parseAmount = (amountStr) => {
  if (typeof amountStr === 'number') {
    return amountStr;
  }

  if (!amountStr) return 0;

  // Remove currency symbols, commas, and spaces
  let cleaned = String(amountStr)
    .replace(/[$€£¥₹,\s]/g, '')
    .trim();

  // Handle parentheses as negative (accounting format)
  if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
    cleaned = '-' + cleaned.slice(1, -1);
  }

  const amount = parseFloat(cleaned);
  return isNaN(amount) ? 0 : amount;
};

/**
 * Generate unique transaction ID
 */
const generateId = () => {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Export transactions to CSV format
 */
export const exportToCSV = (transactions) => {
  const csv = Papa.unparse(transactions.map(t => ({
    Date: t.date.toLocaleDateString(),
    Description: t.description,
    Amount: t.amount,
    Type: t.type,
    Category: t.category || 'Uncategorized',
    Balance: t.balance || ''
  })));

  return csv;
};
