# ✅ Customer Historical Analysis Created!

A comprehensive timeline view showing how customers have changed across all 28 columns over 16 weeks.

---

## 🚀 Access the Page

```bash
# Local
http://localhost:3000/customer-history

# Production (after deployment)
https://main--unifieddashboard--{org}.aem.live/customer-history
```

---

## 📊 What It Shows

### Summary Statistics
- Total customers tracked
- Weeks of historical data (16 weeks)
- Total records (598)
- Latest week date

### Individual Customer Timeline
View any customer's complete history showing:
- **All 28 columns** from the spreadsheet
- **Week-by-week changes** highlighted
- **Trend indicators** (↑↓) for improvements/declines
- **Color coding:**
  - 🟢 Green = Improved
  - 🟡 Yellow = Changed
  - 🔴 Red = Declined

### Historical Insights (Auto-Generated)
For each customer:
- Health score trend (+/- points over time)
- Status progression changes
- Engagement history (Active/At Risk/Critical weeks)
- Implementation progress (features enabled)
- Total weeks tracked

---

## 🎯 Key Features

### 1. Customer Selection
- Dropdown with all customers (sorted A-Z)
- Shows complete timeline for selected customer
- Auto-loads first customer by default

### 2. Metric Focus Filters
- **All Columns** - Show all 28 fields
- **Engagement Metrics** - Status, Health Score, MAU, TTIV, etc.
- **Implementation Status** - Feature deployments, configurations
- **Business Info** - License, Industry, ESE Lead, dates

### 3. Timeline Table
- Scrollable horizontal table
- Sticky column headers
- Week-by-week data
- Change highlighting:
  - Yellow = value changed
  - Green = improved (health/engagement up)
  - Red = declined (health/engagement down)
- Trend arrows (↑↓) for key metrics

### 4. Show All Customers View
- Summary cards for all customers
- Health score progression for each
- Current status and engagement
- Quick comparison across portfolio

### 5. Export Historical Data
- Downloads complete history as CSV
- All 598 records across 16 weeks
- All 28 columns included
- Sorted by customer name, then week

---

## 📋 All 28 Columns Analyzed

### Core Information (10)
1. Company Name
2. License Type
3. Industry
4. ESE Lead
5. Status
6. Delay Reason
7. Close Date
8. Onboard Date
9. Deployment Type
10. Headless

### Engagement & Health (8)
11. Engagement (with trend detection)
12. Blockers
13. Feedback
14. Health Score (with trend arrows)
15. Summary of Engagement
16. MAU
17. TTIV
18. Oppty Realized

### Implementation Status (10)
19. Preflight
20. Auto-Optimize Enabled
21. Auto-Optimize Button Pressed
22. Service Principle Deployed
23. Brand Profile
24. AEMY Deployed
25. Code Repo
26. Auth Implementation
27. Workflow Manager
28. Customer Self Serve

---

## 💡 Use Cases

### For Customer Success Managers
- Track individual customer journey over time
- Identify when health scores declined
- See implementation progress
- Understand engagement patterns

### For Leadership
- View portfolio-wide trends
- Compare customer progression
- Identify successful patterns
- Spot at-risk customers early

### For Analysis
- Export full history for deeper analysis
- Track all fields over time
- Identify correlations
- Measure impact of changes

---

## 🎨 Visual Features

### Change Detection
- **Yellow cells** = Value changed from previous week
- **Green cells** = Metric improved (health up, engagement better)
- **Red cells** = Metric declined (health down, engagement worse)
- **Trend arrows** = Direction of change (↑ up, ↓ down)

### Color-Coded Insights
Each customer timeline includes:
- Health score progression with trend
- Status changes highlighted
- Engagement history breakdown
- Implementation milestones

---

## 📈 Example Insights Generated

```
• Health score improved by 15 points (62 → 77)
• Status changed from Pre-Production to Production
• Engagement history: 8 weeks Active, 4 weeks At Risk, 0 weeks Critical
• Implementation progress: 2 new features enabled
• Tracked for 12 weeks from Sep 17, 2025 to Jan 23, 2026
```

---

## 🔍 How It Works

### Data Processing
1. Loads all 598 records from `/data/customers.json`
2. Groups by customer name
3. Sorts each customer's records by week
4. Compares week-to-week for changes
5. Detects trends in key metrics
6. Generates insights automatically

### Change Detection Logic
- **Health Score**: Numeric comparison (improved if up, declined if down)
- **Engagement**: Level comparison (Active > At Risk > Critical)
- **Other fields**: Highlights any change
- **Trend arrows**: Added for health and engagement

### Insight Generation
Automatically analyzes:
- First vs last week comparison
- Total weeks with each engagement level
- Implementation feature adoption
- Status progression
- Overall health trajectory

---

## 📊 Comparison with Other Views

### Customer History (This Page)
- **Focus**: Timeline and trends
- **View**: Week-by-week changes
- **All 598 records** across 16 weeks
- **Best for**: Understanding customer journey

### Customer Full Table
- **Focus**: Current week snapshot
- **View**: All columns, single week
- **46 customers** for one week
- **Best for**: Current state analysis

### Customer Overview (Home)
- **Focus**: Quick metrics + AI insights
- **View**: Card-based dashboard
- **Current week** summary
- **Best for**: Daily monitoring

---

## 🚀 Quick Start

### View a Customer's History
1. Open `http://localhost:3000/customer-history`
2. Select customer from dropdown
3. View complete timeline
4. Use metric filter to focus on specific areas

### Export All Historical Data
1. Click "📥 Export History" button
2. CSV downloads with all 598 records
3. All 28 columns included
4. Import into Excel for further analysis

### See Portfolio Overview
1. Click "Show All Customers" button
2. View summary cards for everyone
3. Compare health score progressions
4. Identify trends across portfolio

---

## 📁 Files

- **Page**: `customer-history.html` (in git)
- **Data**: `/data/customers.json` (598 records, 16 weeks)
- **Access**: Direct URL (no SharePoint needed)

---

## ✅ What's Included

- ✅ All 28 columns from spreadsheet
- ✅ All 16 weeks of historical data
- ✅ All 598 customer records
- ✅ Week-by-week change detection
- ✅ Automatic trend analysis
- ✅ Auto-generated insights
- ✅ Metric focus filters
- ✅ Full data export
- ✅ Portfolio overview
- ✅ Responsive design

---

## 🎯 Perfect For

- **Quarterly Business Reviews** - Show customer progress
- **Success Planning** - Identify patterns in successful customers
- **Risk Analysis** - See early warning signs
- **Executive Reports** - Portfolio-wide trends
- **Customer Check-ins** - Review journey with customer
- **Data Analysis** - Export for deeper insights

---

**Your historical analysis using all 28 columns is ready!** 🎉

Open `http://localhost:3000/customer-history` to explore customer timelines!
