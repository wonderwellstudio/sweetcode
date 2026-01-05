import React, { useState } from 'react';
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Target
} from 'lucide-react';

const InsightsPanel = ({ insights }) => {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    recommendations: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightBg = (type) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const allInsights = [
    ...(insights.summary || []),
    ...(insights.cashFlow || []),
    ...(insights.spending || []),
    ...(insights.recurring || []),
    ...(insights.anomalies || [])
  ];

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="card">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('summary')}
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">Key Insights</h2>
          </div>
          {expandedSections.summary ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {expandedSections.summary && (
          <div className="mt-6 space-y-3">
            {allInsights.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Upload transactions to see insights
              </p>
            ) : (
              allInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getInsightBg(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {insight.icon && <span className="text-2xl">{insight.icon}</span>}
                    {!insight.icon && getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {insight.title}
                      </h3>
                      <p className="text-sm text-gray-700">{insight.message}</p>
                      {insight.action && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          💡 {insight.action}
                        </p>
                      )}
                      {insight.details && (
                        <div className="mt-3 space-y-1">
                          {insight.details.map((detail, i) => (
                            <div key={i} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                              {detail.description && <span>{detail.description}</span>}
                              {detail.amount && <span className="font-semibold">${detail.amount.toFixed(2)}</span>}
                              {detail.frequency && <span className="text-xs text-gray-500">({detail.frequency})</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <div className="card">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('recommendations')}
          >
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-bold text-gray-900">Recommendations</h2>
            </div>
            {expandedSections.recommendations ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {expandedSections.recommendations && (
            <div className="mt-6 space-y-4">
              {insights.recommendations.map((rec, index) => (
                <div key={index} className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {rec.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{rec.description}</p>
                    </div>
                  </div>

                  {rec.actions && rec.actions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Action Steps:</p>
                      <ul className="space-y-1">
                        {rec.actions.map((action, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rec.potentialSavings && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-sm font-semibold text-green-700">
                        💰 Potential Savings: ${rec.potentialSavings.toFixed(2)}/month
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;
