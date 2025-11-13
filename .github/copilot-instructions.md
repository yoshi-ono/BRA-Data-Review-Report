# Copilot Instructions for BRA Data Review Report

## Project Overview
This is a **Google Apps Script** project that performs automated review of BRA (Brain Research Architecture) data files according to error code lists. The system operates as a standalone main program called from two different systems:

1. **BRA Data Review Tool**: UI for automated review, calls this program via [BRA Data Review Processing](https://github.com/yoshi-ono/BRA-Data-Review-Processing/)
2. **BRAES**: Editorial System for BRA data, calls this program for automatic review of submitted data via [BRAES Main](https://github.com/yoshi-ono/BRAES_Main)

## Architecture & Core Components

### Main Flow (`main.js`)
- Entry point: `main(toolDocId)` function that orchestrates the entire review process
- Returns status codes: `"pass"`, `"fail"`, or `"halt"`
- Global variables pattern: Uses `g_` prefix for shared state (`g_bra_data`, `g_sheet_reportSummary`, etc.)
- Template validation: Compares against `Template-v2-2.bra` stored in Google Drive folder

### Class Hierarchy Pattern
```
braData (main data controller)
├── dataBasic (abstract base for data processors)
│   ├── dataReferences, dataCircuits, dataConnections, dataFRG
├── entityBasic (abstract base for data entities)
│   ├── entityReferences, entityCircuits, entityConnections, entityFRG
├── Template (formula validation against template spreadsheet)
└── Setting (Google Sheets interface management)
```

### Review Categories
The system processes 4 main data categories (HCDeditor currently commented out):
- **References**: DOI, BibTex, Literature type validation
- **Circuits**: Circuit ID definitions and relationships
- **Connections**: Inter-circuit connections validation
- **FRG**: Functional Reference Group validation

Each follows the same pattern: `data[Category].review()` → `report()` → results written to corresponding sheet.

## Development Patterns

### Error Handling System
- **Error Codes**: Numeric codes defined in `ListItems` class from `AdminOnly` sheet
- **Error Types**: Automatic errors (validation failures) vs Manual errors (reviewer-added codes)
- **Warning vs Error**: Specific codes in `ManualWarning` array are treated as warnings
- **Error Recording**: `errorNums` and `warningNums` objects track issues per review item

### Google Apps Script Specifics
- **Execution Context**: Runs in Google's V8 runtime (see `appsscript.json`)
- **Timezone**: Asia/Tokyo hardcoded
- **Sheet References**: Global variables initialized in `Setting` constructor
- **Logging**: Extensive `Logger.log()` usage for debugging
- **Status Updates**: `spreadsheet.toast()` for user feedback during execution

### Formula Validation Logic
Template comparison in `template.js`:
- Uses `ITOL()` function to convert column numbers to letters (A, B, C...)
- Compares formulas cell-by-cell between BRA data and template
- Tracks mismatches in `not_match` object: `{row: [columnLetters...]}`
- Special handling for `IMPORTRANGE` formulas as data boundaries

### Data Validation Patterns
Common validation methods in `entityBasic`:
```javascript
isDescribed(item)      // Non-empty after trim
isURL(item)           // Starts with http:// or https://
isDefinedCircuit(id)  // Circuit ID exists in circuits data
hasTerminalSymbol()   // Ends with semicolon for lists
```

## Development Workflows

### Testing & Debugging
- Use `debug_auto_review()` function with hardcoded test document ID
- Check Google Apps Script logs via `Logger.log()` statements
- Monitor execution status via spreadsheet toast notifications

### Adding New Review Categories
1. Create `data[Category].js` extending `dataBasic`
2. Create `entity[Category].js` extending `entityBasic`
3. Add review method to `braData` class
4. Add global sheet variable to `setting.js`
5. Update main review loop in `main.js`

### Error Code Management
- Error codes are managed in the `AdminOnly` sheet of BRA data files
- Master error code list: [BRA data: Error code List (Master)](https://docs.google.com/spreadsheets/d/1mCQOmjBRIx-k12a2x8uV3aSKKZ5dDW0na4bVnZtAzhM/edit)
- **Error Types**: 
  - Type 0 (Auto error) and Type 2 (Auto warning) are subject to automatic review
  - Type 1 (Manual error) and Type 3 (Manual warning) are for manual review only - not implemented
  - ManualWarning array defines Type 3 codes for proper classification
- **Deprecated Error Codes**: 137, 203, 241, 278 (implementation not required)
- CSV format error code lists available in `error_code_list/` directory for each category
- `ListItems` class loads valid values for dropdowns and validation

## Key Dependencies & Integration
- **Google Drive API**: Template file access via folder ID
- **Google Sheets API**: Multi-sheet data processing and report generation
- **External System**: Called from container-bound script with `toolDocId` parameter
- **Version Control**: BRA version validation ensures template compatibility

## File Organization
- `main.js`: Entry point and orchestration
- `setting.js`: Google Sheets interface setup
- `bra_data.js`: Main data controller
- `data_*.js`: Category-specific data processors
- `entity_*.js`: Row-level data validators
- `template.js`: Formula validation against template
- `list_items.js`: Valid values and error code management
- `error_code_list/`: CSV format error code lists (References.csv, Circuits.csv, Connections.csv, FRG.csv)