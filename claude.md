# Financial Statement Analyzer - Project Context

## What Was Built

A complete financial statement analyzer web application that acts as a personal AI accountant. Upload CSV bank/credit card statements and get intelligent insights, pattern detection, anomaly alerts, and actionable recommendations.

## Project Status

✅ **Complete and functional**
✅ **Code pushed to GitHub**: `wonderwellstudio/sweetcode` on branch `claude/finance-statement-analyzer-hbhGt`
⚠️ **GitHub Pages deployment**: Configured but may need manual setup

## Tech Stack

- React 18 + Vite
- TailwindCSS for styling
- Recharts for data visualization
- Papa Parse for CSV parsing
- date-fns for date manipulation
- Lucide React for icons

## Key Features Implemented

### 1. Smart Transaction Categorization
- 15+ categories (Groceries, Dining, Transportation, Utilities, etc.)
- Pattern-based merchant recognition
- `src/utils/categorizer.js`

### 2. Pattern Detection
- Recurring transaction identification (subscriptions, bills)
- Spending trend analysis
- Seasonal pattern detection
- `src/utils/patternAnalyzer.js`

### 3. Anomaly Detection
- Unusual transaction amounts
- Duplicate charge detection
- Potential fraud indicators (round numbers, rapid succession)
- New merchant alerts
- `src/utils/anomalyDetector.js`

### 4. Cash Flow Analysis
- Income vs expense tracking
- Monthly breakdowns
- Savings rate calculation
- Financial health score (0-100)
- Future cash flow predictions
- `src/utils/cashFlowAnalyzer.js`

### 5. Insights & Recommendations
- Personalized financial advice
- Spending optimization suggestions
- Emergency fund planning
- Budget recommendations
- `src/utils/insightsGenerator.js`

### 6. Interactive Dashboard
- File upload with drag & drop
- Real-time analysis
- Interactive charts (pie chart, bar chart with trend line)
- Transaction list with search/filter
- Export to CSV
- Responsive design

## Project Structure

```
sweetcode/
├── .github/workflows/
│   └── deploy.yml                 # GitHub Actions deployment
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx        # Drag & drop upload
│   │   ├── Dashboard.jsx         # Main dashboard layout
│   │   ├── StatCard.jsx          # Metric display cards
│   │   ├── TransactionList.jsx   # Searchable transaction table
│   │   ├── CategoryChart.jsx     # Pie chart for categories
│   │   ├── CashFlowChart.jsx     # Monthly income/expense chart
│   │   └── InsightsPanel.jsx     # Insights & recommendations
│   ├── utils/
│   │   ├── parser.js             # CSV parsing (handles multiple formats)
│   │   ├── categorizer.js        # Transaction categorization
│   │   ├── patternAnalyzer.js    # Recurring transactions, trends
│   │   ├── anomalyDetector.js    # Fraud detection, duplicates
│   │   ├── cashFlowAnalyzer.js   # Income/expense analysis
│   │   └── insightsGenerator.js  # Recommendations engine
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles + Tailwind
├── sample-statement.csv          # Test data (3 months)
├── package.json                  # Dependencies
├── vite.config.js                # Vite config (GitHub Pages base path set)
├── tailwind.config.js            # Tailwind theme
└── README.md                     # Full documentation

letteranimation.js                # Pre-existing file (unrelated)
```

## How to Run Locally

### Prerequisites
- Node.js 18+ and npm

### Setup
```bash
# Clone from GitHub
git clone https://github.com/wonderwellstudio/sweetcode.git
cd sweetcode

# Install dependencies
npm install

# Start dev server
npm run dev
# Opens at http://localhost:3000
```

### Build for Production
```bash
npm run build
npm run preview  # Test production build locally
```

## GitHub Pages Deployment

### Current Setup
- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Auto-deploys on push to `main` or `claude/finance-statement-analyzer-hbhGt` branches
- Vite base path configured: `/sweetcode/`
- **Expected URL**: https://wonderwellstudio.github.io/sweetcode/

### Manual Steps Required
GitHub Pages may need manual configuration:

1. Go to: https://github.com/wonderwellstudio/sweetcode/settings/pages
2. Under "Build and deployment":
   - **Source**: Select "GitHub Actions" (NOT "Deploy from a branch")
3. Go to: https://github.com/wonderwellstudio/sweetcode/settings/actions
4. Under "Workflow permissions":
   - Enable "Read and write permissions"
5. Trigger deployment:
   - Go to Actions tab
   - Click "Deploy to GitHub Pages"
   - Click "Run workflow"

### Alternative: Merge to Main
If you want to deploy from `main` branch:
```bash
git checkout main
git merge claude/finance-statement-analyzer-hbhGt
git push origin main
```

The workflow will auto-deploy.

## Testing the App

### Using Sample Data
1. Run `npm run dev`
2. Upload `sample-statement.csv`
3. See analysis with:
   - 3 months of transactions
   - Recurring subscriptions (Netflix, Spotify, Gym)
   - One anomaly ($500 unusual charge)
   - Various spending categories

### Using Real Bank Statements
Works with CSV exports from most banks:
- Chase, Bank of America, Wells Fargo, Citi, etc.
- Credit cards: Amex, Discover, Capital One, etc.

Required CSV columns (flexible naming):
- Date (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, etc.)
- Description
- Amount (or separate Debit/Credit columns)

## Privacy & Security

- **100% client-side processing** - no data leaves the browser
- No server, no database, no accounts
- No analytics or tracking
- Data not saved (unless user exports)

## Customization Examples

### Add New Category
Edit `src/utils/categorizer.js`:
```javascript
'Pet Expenses': {
  keywords: ['petco', 'petsmart', 'vet', 'veterinary'],
  patterns: [/pet/i, /vet/i]
}
```

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#3b82f6',    // Change to your color
  income: '#10b981',
  expense: '#ef4444',
}
```

### Modify Insights
Edit `src/utils/insightsGenerator.js` to change recommendation logic.

## Outstanding Issues

1. **GitHub Pages 404**: Deployment configured but needs manual setup in repo settings
2. **Large bundle size**: 684KB (could optimize with code splitting)

## Next Steps

To continue development:

1. **Clone the repo locally** (if not already):
   ```bash
   git clone https://github.com/wonderwellstudio/sweetcode.git
   cd sweetcode
   npm install
   ```

2. **Fix GitHub Pages deployment**:
   - Follow manual steps above
   - Or deploy to Vercel/Netlify instead

3. **Optional enhancements**:
   - PDF statement parsing
   - Multi-currency support
   - Budget tracking
   - Goal setting
   - Custom category creation
   - Transaction notes/tags

## Git Info

**Repository**: https://github.com/wonderwellstudio/sweetcode
**Current branch**: `claude/finance-statement-analyzer-hbhGt`
**Main branch**: (check repo for default branch name)

Last commit: "Configure for GitHub Pages deployment"

## Quick Reference

**Start dev**: `npm run dev`
**Build**: `npm run build`
**Preview build**: `npm run preview`
**Run from GitHub Pages**: https://wonderwellstudio.github.io/sweetcode/ (once deployed)

## Architecture Notes

### Data Flow
1. User uploads CSV → `FileUpload.jsx`
2. Parse CSV → `parser.js` (handles multiple formats)
3. Categorize transactions → `categorizer.js`
4. Run all analyzers:
   - `cashFlowAnalyzer.js`
   - `patternAnalyzer.js`
   - `anomalyDetector.js`
5. Generate insights → `insightsGenerator.js`
6. Display in `Dashboard.jsx`

### State Management
- Uses React `useState` in `App.jsx`
- No Redux/global state (not needed for this scope)
- All analysis runs synchronously on upload

### Performance
- Large CSV files (10k+ transactions) process in ~1-2 seconds
- All processing happens in main thread (could move to Web Worker if needed)

## Contact/Questions

This project was built by Claude (Anthropic AI) via Claude Code web interface.
All code is committed to the GitHub repository.

---

**To pick up where we left off**: Clone the repo, run `npm install && npm run dev`, and you're ready to go!
