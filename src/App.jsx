import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { parseStatement } from './utils/parser';
import { categorizeTransactions, getSpendingByCategory } from './utils/categorizer';
import { analyzeCashFlow, analyzeMonthlyCashFlow, calculateFinancialHealthScore } from './utils/cashFlowAnalyzer';
import { generateInsights } from './utils/insightsGenerator';
import { Loader2, TrendingUp } from 'lucide-react';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (files) => {
    setLoading(true);
    setError(null);

    try {
      // Parse all files
      const allTransactions = [];
      for (const file of files) {
        try {
          const parsed = await parseStatement(file);
          allTransactions.push(...parsed);
        } catch (err) {
          console.error(`Error parsing ${file.name}:`, err);
          setError(`Error parsing ${file.name}. Please check the file format.`);
        }
      }

      if (allTransactions.length === 0) {
        setError('No transactions found. Please check your files.');
        setLoading(false);
        return;
      }

      // Categorize transactions
      const categorized = categorizeTransactions(allTransactions);

      // Analyze
      const cashFlow = analyzeCashFlow(categorized);
      const monthlyCashFlow = analyzeMonthlyCashFlow(categorized);
      const categoryStats = getSpendingByCategory(categorized);
      const healthScore = calculateFinancialHealthScore(categorized);
      const insights = generateInsights(categorized);

      setTransactions(categorized);
      setAnalysis({
        cashFlow,
        monthlyCashFlow,
        categoryStats,
        healthScore,
        insights
      });
    } catch (err) {
      console.error('Error processing files:', err);
      setError('An error occurred while processing your files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTransactions([]);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-lg font-semibold text-gray-900">Analyzing your statements...</p>
            <p className="text-sm text-gray-600">This may take a moment</p>
          </div>
        </div>
      )}

      {!analysis ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="max-w-3xl w-full mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Financial Statement Analyzer
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Your Personal AI Accountant
              </p>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Upload your bank and credit card statements to get intelligent insights,
                spending patterns, anomaly detection, and actionable recommendations.
              </p>
            </div>

            <FileUpload onFileUpload={handleFileUpload} />

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-900 mb-1">Smart Categorization</h3>
                <p className="text-sm text-gray-600">
                  Automatically categorizes all your transactions
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="font-semibold text-gray-900 mb-1">Pattern Detection</h3>
                <p className="text-sm text-gray-600">
                  Identifies recurring payments and spending trends
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl mb-2">💡</div>
                <h3 className="font-semibold text-gray-900 mb-1">Actionable Insights</h3>
                <p className="text-sm text-gray-600">
                  Get personalized recommendations to improve finances
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={handleReset}
            className="fixed top-4 right-4 btn btn-secondary z-10"
          >
            Upload New Files
          </button>
          <Dashboard transactions={transactions} analysis={analysis} />
        </div>
      )}
    </div>
  );
}

export default App;
