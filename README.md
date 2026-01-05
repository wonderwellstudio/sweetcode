# Financial Statement Analyzer

Your Personal AI Accountant - Analyze bank and credit card statements with intelligent insights, pattern detection, and actionable recommendations.

## Features

### 🎯 Smart Analysis
- **Automatic Categorization**: Intelligently categorizes transactions into 15+ categories (Groceries, Dining, Transportation, etc.)
- **Pattern Detection**: Identifies recurring transactions, subscriptions, and spending trends
- **Anomaly Detection**: Flags unusual transactions, duplicates, and potential fraud
- **Cash Flow Analysis**: Comprehensive income vs expense tracking with monthly breakdowns

### 📊 Visualizations
- Interactive charts for spending by category
- Monthly cash flow trends with income/expense comparisons
- Financial health score (0-100)
- Detailed transaction list with search and filtering

### 💡 Actionable Insights
- Personalized financial recommendations
- Savings opportunities identification
- Spending habit analysis
- Emergency fund planning
- Budget optimization suggestions

### 🔒 Privacy First
- **100% Client-Side Processing**: All analysis happens in your browser
- **No Data Upload**: Your financial data never leaves your computer
- **No Account Required**: Start analyzing immediately

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will open at `http://localhost:3000`

### Usage

1. **Upload Your Statements**
   - Click "Choose Files" or drag and drop CSV files
   - Supports multiple file formats (CSV, TSV, TXT)
   - Works with most bank statement exports

2. **View Analysis**
   - Automatic categorization and insights generation
   - Interactive dashboard with charts and metrics
   - Detailed transaction list

3. **Export Results**
   - Download analyzed data as CSV
   - All categories and insights included

## Supported File Formats

The analyzer supports CSV/TSV files from most banks and credit card companies:

### Major Banks
- Chase
- Bank of America
- Wells Fargo
- Citibank
- US Bank
- Capital One
- And more...

### Credit Cards
- American Express
- Discover
- Visa
- Mastercard
- Any card issuer providing CSV exports

### Required Columns
Your CSV should include (column names are flexible):
- **Date**: Transaction date (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, etc.)
- **Description**: Merchant/transaction description
- **Amount**: Transaction amount (can be positive/negative or separate Debit/Credit columns)

## Sample CSV Format

```csv
Date,Description,Amount
01/15/2024,WHOLE FOODS MARKET,-125.43
01/15/2024,Direct Deposit Salary,2500.00
01/16/2024,STARBUCKS,-5.75
01/17/2024,Netflix Subscription,-15.99
```

Or with separate debit/credit columns:

```csv
Transaction Date,Description,Debit,Credit,Balance
01/15/2024,WHOLE FOODS MARKET,125.43,,1874.57
01/15/2024,Direct Deposit Salary,,2500.00,4374.57
```

## Features Breakdown

### Categorization Engine
Automatically categorizes transactions into:
- Groceries & Food
- Restaurants & Dining
- Transportation
- Utilities
- Entertainment
- Shopping
- Healthcare
- Housing & Rent
- Insurance
- Income
- Subscriptions
- Banking & Fees
- Transfers
- Education
- Personal Care
- Taxes
- Other

### Pattern Analysis
- **Recurring Transactions**: Detects subscriptions and regular bills
- **Spending Trends**: Month-over-month comparisons
- **Spending Spikes**: Identifies unusually high spending days
- **Seasonal Patterns**: Discovers spending patterns by month

### Anomaly Detection
- Unusually large transactions
- Duplicate charges
- Round number transactions (potential fraud indicator)
- New merchant transactions
- Rapid succession transactions (card skimming detection)

### Cash Flow Insights
- Total income vs expenses
- Net cash flow
- Savings rate calculation
- Financial health score
- Monthly trends and predictions
- Emergency fund recommendations

### Recommendations System
Generates actionable advice based on your spending:
- Savings optimization
- Subscription cleanup
- Dining out reduction strategies
- Emergency fund planning
- Investment suggestions

## Technology Stack

- **React 18**: Modern UI framework
- **Vite**: Fast build tool and dev server
- **Recharts**: Beautiful, responsive charts
- **TailwindCSS**: Utility-first styling
- **Papa Parse**: CSV parsing
- **date-fns**: Date manipulation
- **Lucide React**: Icon library

## Privacy & Security

This application is designed with privacy as a priority:

- ✅ **No Server**: All processing happens in your browser
- ✅ **No Tracking**: Zero analytics or tracking scripts
- ✅ **No Account**: No login or registration required
- ✅ **No Storage**: Data is not saved unless you explicitly export
- ✅ **Open Source**: Code is transparent and auditable

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── FileUpload.jsx  # File upload interface
│   ├── Dashboard.jsx   # Main dashboard
│   ├── StatCard.jsx    # Metric cards
│   ├── TransactionList.jsx
│   ├── CategoryChart.jsx
│   ├── CashFlowChart.jsx
│   └── InsightsPanel.jsx
├── utils/              # Analysis engines
│   ├── parser.js       # CSV parsing
│   ├── categorizer.js  # Transaction categorization
│   ├── patternAnalyzer.js
│   ├── anomalyDetector.js
│   ├── cashFlowAnalyzer.js
│   └── insightsGenerator.js
├── App.jsx            # Main app component
├── main.jsx           # React entry point
└── index.css          # Global styles
```

### Adding New Categories

Edit `src/utils/categorizer.js`:

```javascript
const CATEGORY_RULES = {
  'Your Category': {
    keywords: ['keyword1', 'keyword2'],
    patterns: [/pattern/i]
  }
};
```

### Customizing Insights

Edit `src/utils/insightsGenerator.js` to add custom recommendations or modify the insight generation logic.

## Troubleshooting

### File Not Parsing
- Ensure your CSV has headers in the first row
- Check that date, description, and amount columns exist
- Try opening the file in Excel/Google Sheets to verify format

### Categories Not Accurate
- Categories are based on merchant names
- You can enhance the categorizer by adding more keywords in `categorizer.js`

### Missing Transactions
- Check date format compatibility
- Ensure amount column has numeric values
- Verify no empty rows in CSV

## Roadmap

Future enhancements:
- [ ] PDF statement parsing
- [ ] Multi-currency support
- [ ] Budget planning and tracking
- [ ] Goal setting and progress
- [ ] Comparison with national averages
- [ ] More chart types and visualizations
- [ ] Custom category creation
- [ ] Transaction tagging and notes
- [ ] Year-over-year comparisons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for personal or commercial projects.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for better financial awareness
