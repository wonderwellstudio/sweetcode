import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, subtitle, trend, icon: Icon, type = 'neutral' }) => {
  const colors = {
    income: 'text-income bg-green-50 border-green-200',
    expense: 'text-expense bg-red-50 border-red-200',
    neutral: 'text-primary bg-blue-50 border-blue-200',
    warning: 'text-orange-600 bg-orange-50 border-orange-200'
  };

  const colorClass = colors[type] || colors.neutral;

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return <TrendingUp className="w-4 h-4" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (type === 'expense') {
      return trend > 0 ? 'text-red-600' : 'text-green-600';
    }
    return trend > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg border ${colorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
