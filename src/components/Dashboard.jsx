import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Download } from 'lucide-react';
import StatCard from './StatCard';
import TransactionList from './TransactionList';
import CategoryChart from './CategoryChart';
import CashFlowChart from './CashFlowChart';
import InsightsPanel from './InsightsPanel';
import { exportToCSV } from '../utils/parser';

const Dashboard = ({ transactions, analysis }) => {
  const {
    cashFlow,
    monthlyCashFlow,
    categoryStats,
    insights,
    healthScore
  } = analysis;

  const handleExport = () => {
    const csv = exportToCSV(transactions);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Financial Dashboard
            </h1>
            <p className="text-gray-600">
              {transactions.length} transactions analyzed
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Financial Health Score</p>
              <p className={`text-3xl font-bold ${getHealthColor(healthScore)}`}>
                {healthScore}/100
              </p>
            </div>
            <button
              onClick={handleExport}
              className="btn btn-primary flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Data
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Income"
            value={`$${cashFlow.totalIncome.toFixed(2)}`}
            subtitle={`${cashFlow.incomeCount} transactions`}
            icon={TrendingUp}
            type="income"
          />
          <StatCard
            title="Total Expenses"
            value={`$${cashFlow.totalExpenses.toFixed(2)}`}
            subtitle={`${cashFlow.expenseCount} transactions`}
            icon={TrendingDown}
            type="expense"
          />
          <StatCard
            title="Net Cash Flow"
            value={`$${cashFlow.netCashFlow.toFixed(2)}`}
            subtitle={cashFlow.netCashFlow >= 0 ? 'Positive' : 'Negative'}
            icon={Wallet}
            type={cashFlow.netCashFlow >= 0 ? 'income' : 'expense'}
          />
          <StatCard
            title="Savings Rate"
            value={`${cashFlow.savingsRate.toFixed(1)}%`}
            subtitle={cashFlow.savingsRate >= 20 ? 'Excellent!' : 'Can improve'}
            icon={DollarSign}
            type={cashFlow.savingsRate >= 20 ? 'income' : 'neutral'}
          />
        </div>

        {/* Insights */}
        <div className="mb-8">
          <InsightsPanel insights={insights} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CashFlowChart data={monthlyCashFlow} />
          <CategoryChart data={categoryStats} />
        </div>

        {/* Transaction List */}
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;
