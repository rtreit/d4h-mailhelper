# D4H Mail Helper Extension

## Files Created:
- `manifest.json` - Extension configuration
- `content.js` - Main functionality script
- `icon.png` - Extension icon (you need to add this)

## Installation Instructions:

1. **Add an icon**: Replace this file with a 128x128 PNG icon named `icon.png`

2. **Install the extension**:
   - Open Chrome or Edge
   - Navigate to `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" toggle
   - Click "Load unpacked"
   - Select the `d4h-mail-helper` folder

3. **Usage**:
   - Navigate to any D4H exercises page (https://...d4h.com/team/exercises)
   - Look for the orange "Copy mail block" button
   - Click it to copy formatted exercise data to clipboard
   - Paste into email as needed

## What the extension does:
- Detects D4H exercise list pages
- Adds an orange "Copy mail block" button
- Scrapes exercise links and dates from the table
- Creates tab-separated content with HTML anchor tags
- Copies to clipboard for easy email pasting
