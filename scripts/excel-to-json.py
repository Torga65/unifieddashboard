#!/usr/bin/env python3
"""
Convert Excel customer data to JSON format for EDS
"""
import json
import sys
from pathlib import Path

try:
    import openpyxl
except ImportError:
    print("Installing openpyxl...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "openpyxl"])
    import openpyxl

def excel_to_json(excel_path, json_path):
    """Convert Excel file to JSON format"""
    print(f"Reading Excel file: {excel_path}")
    
    # Load workbook
    wb = openpyxl.load_workbook(excel_path)
    
    # Get first sheet
    sheet = wb.active
    print(f"Sheet name: {sheet.title}")
    
    # Get headers from first row
    headers = []
    for cell in sheet[1]:
        if cell.value:
            headers.append(str(cell.value).strip())
    
    print(f"Found {len(headers)} columns: {', '.join(headers)}")
    
    # Read data rows
    data = []
    row_count = 0
    
    for row in sheet.iter_rows(min_row=2, values_only=True):
        # Skip empty rows
        if not any(row):
            continue
        
        # Create row dict
        row_dict = {}
        for header, value in zip(headers, row):
            if value is not None:
                # Convert to string, handle dates
                if hasattr(value, 'strftime'):
                    # It's a date
                    row_dict[header] = value.strftime('%Y-%m-%d')
                else:
                    row_dict[header] = str(value).strip()
            else:
                row_dict[header] = ""
        
        data.append(row_dict)
        row_count += 1
    
    print(f"Converted {row_count} rows")
    
    # Create output with EDS format
    output = {
        "data": data,
        "total": len(data)
    }
    
    # Write JSON
    print(f"Writing JSON to: {json_path}")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Success! Created {json_path}")
    print(f"   {len(data)} customer records")
    
    # Show sample of first record
    if data:
        print("\nSample record:")
        for key, value in list(data[0].items())[:5]:
            print(f"  {key}: {value}")
        if len(data[0]) > 5:
            print(f"  ... and {len(data[0]) - 5} more fields")

if __name__ == "__main__":
    # Paths
    project_root = Path(__file__).parent.parent
    excel_file = project_root / "data" / "AEM_Sites_Optimizer-CustomerExperience.xlsx"
    json_file = project_root / "data" / "customers.json"
    
    if not excel_file.exists():
        print(f"❌ Error: Excel file not found at {excel_file}")
        sys.exit(1)
    
    # Convert
    excel_to_json(excel_file, json_file)
