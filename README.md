# CDR Analysis Website

A simple static CDR analysis dashboard that lets you upload a CSV file and view call summaries.

## Files
- `index.html` — UI for upload and charts
- `styles.css` — page styling
- `app.js` — CSV parsing and chart rendering using Chart.js

## How to use
1. Open `index.html` in your browser.
2. Upload a CSV with columns: `Date, Time, Caller, Receiver, Duration, CallType`.
3. View totals and charts for call types and top callers.

## Notes
- You can also click **Use sample CSV** to test the app without your own file.
- If your CSV has different column names, rename them to match the expected headers.
