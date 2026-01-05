import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart
} from 'recharts';

const CashFlowChart = ({ data, title = 'Monthly Cash Flow' }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

      {data.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="monthLabel"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="netCashFlow"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Net Cash Flow"
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {data.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Avg Income</p>
            <p className="text-lg font-bold text-income">
              ${(data.reduce((sum, m) => sum + m.income, 0) / data.length).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Avg Expenses</p>
            <p className="text-lg font-bold text-expense">
              ${(data.reduce((sum, m) => sum + m.expenses, 0) / data.length).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Avg Net</p>
            <p className="text-lg font-bold text-primary">
              ${(data.reduce((sum, m) => sum + m.netCashFlow, 0) / data.length).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashFlowChart;
