#!/usr/bin/env python3
"""
Create New Week Data
Generates a new week's customer data by copying the previous week
and clearing the "Summary of Engagement" field.

Usage:
    python3 scripts/create-new-week.py [--date YYYY-MM-DD]

Options:
    --date    Specify the Sunday date for the new week (optional)
              If not provided, uses next Sunday after the latest week
"""

import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

# File paths
DATA_FILE = Path(__file__).parent.parent / 'data' / 'customers.json'


def get_next_sunday(from_date=None):
    """Get the next Sunday from the given date (or today if not provided)."""
    if from_date is None:
        from_date = datetime.now()
    elif isinstance(from_date, str):
        from_date = datetime.strptime(from_date, '%Y-%m-%d')
    
    # Calculate days until next Sunday (0 = Monday, 6 = Sunday)
    days_ahead = 6 - from_date.weekday()
    if days_ahead <= 0:  # If today is Sunday or later in the week
        days_ahead += 7
    
    next_sunday = from_date + timedelta(days=days_ahead)
    return next_sunday.strftime('%Y-%m-%d')


def load_customer_data():
    """Load customer data from JSON file."""
    if not DATA_FILE.exists():
        print(f"Error: Data file not found at {DATA_FILE}")
        sys.exit(1)
    
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_customer_data(data):
    """Save customer data to JSON file."""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved data to {DATA_FILE}")


def get_latest_week(customers):
    """Get the latest week from existing customer data."""
    weeks = set(c['week'] for c in customers if 'week' in c)
    if not weeks:
        return None
    return max(weeks)


def create_new_week(target_date=None):
    """Create a new week's data by copying the previous week."""
    print("📊 Creating new week data...")
    print(f"Data file: {DATA_FILE}")
    
    # Load existing data
    data = load_customer_data()
    customers = data.get('data', [])
    
    if not customers:
        print("❌ Error: No customer data found")
        sys.exit(1)
    
    # Get latest week
    latest_week = get_latest_week(customers)
    if not latest_week:
        print("❌ Error: No weeks found in data")
        sys.exit(1)
    
    print(f"📅 Latest week: {latest_week}")
    
    # Determine new week date
    if target_date:
        new_week = target_date
        # Validate it's a Sunday
        check_date = datetime.strptime(new_week, '%Y-%m-%d')
        if check_date.weekday() != 6:  # 6 = Sunday
            print(f"⚠️  Warning: {new_week} is not a Sunday (it's a {check_date.strftime('%A')})")
            response = input("Continue anyway? (y/n): ")
            if response.lower() != 'y':
                print("❌ Cancelled")
                sys.exit(0)
    else:
        new_week = get_next_sunday(latest_week)
    
    print(f"🆕 New week: {new_week}")
    
    # Check if new week already exists
    existing_weeks = set(c['week'] for c in customers if 'week' in c)
    if new_week in existing_weeks:
        print(f"⚠️  Warning: Week {new_week} already exists in the data")
        response = input("Overwrite existing data for this week? (y/n): ")
        if response.lower() != 'y':
            print("❌ Cancelled")
            sys.exit(0)
        # Remove existing data for this week
        customers = [c for c in customers if c.get('week') != new_week]
        print(f"🗑️  Removed existing data for {new_week}")
    
    # Get customers from latest week
    latest_week_customers = [c for c in customers if c.get('week') == latest_week]
    
    if not latest_week_customers:
        print(f"❌ Error: No customers found for week {latest_week}")
        sys.exit(1)
    
    print(f"📋 Found {len(latest_week_customers)} customers to copy")
    
    # Create new week's data
    new_week_customers = []
    for customer in latest_week_customers:
        new_customer = customer.copy()
        new_customer['week'] = new_week
        
        # Clear the summary field
        new_customer['summary'] = ''
        
        new_week_customers.append(new_customer)
    
    # Add new week's data to the dataset
    customers.extend(new_week_customers)
    
    # Sort by week (newest first), then by company name
    customers.sort(key=lambda c: (c.get('week', ''), c.get('companyName', '')), reverse=True)
    
    # Update data
    data['data'] = customers
    
    # Save
    save_customer_data(data)
    
    print(f"\n✅ Successfully created new week: {new_week}")
    print(f"📊 Copied {len(new_week_customers)} customers from {latest_week}")
    print(f"📝 Summary field cleared for all customers")
    print(f"📈 Total records in dataset: {len(customers)}")
    
    # Show some stats
    all_weeks = sorted(set(c['week'] for c in customers if 'week' in c), reverse=True)
    print(f"\n📅 All weeks in dataset ({len(all_weeks)} weeks):")
    for week in all_weeks[:5]:  # Show first 5
        count = len([c for c in customers if c.get('week') == week])
        indicator = "← NEW" if week == new_week else ""
        print(f"   {week}: {count} customers {indicator}")
    if len(all_weeks) > 5:
        print(f"   ... and {len(all_weeks) - 5} more weeks")


def main():
    """Main entry point."""
    target_date = None
    
    # Parse command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] in ['-h', '--help']:
            print(__doc__)
            sys.exit(0)
        elif sys.argv[1] == '--date' and len(sys.argv) > 2:
            target_date = sys.argv[2]
            try:
                datetime.strptime(target_date, '%Y-%m-%d')
            except ValueError:
                print(f"❌ Error: Invalid date format '{target_date}'. Use YYYY-MM-DD")
                sys.exit(1)
    
    # Banner
    print("=" * 60)
    print("  📊 Create New Week - Customer Data Generator")
    print("=" * 60)
    print()
    
    # Create new week
    try:
        create_new_week(target_date)
    except KeyboardInterrupt:
        print("\n❌ Cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("✅ Done! Refresh your browser to see the new week.")
    print("=" * 60)


if __name__ == '__main__':
    main()
