# D4H Mail Helper - Troubleshooting Guide

## Extension appears grayed out? Follow these steps:

### 1. Check the URL Pattern
The extension only works on D4H exercise pages. Make sure you're on a URL that contains:
- `team/exercises` 
- Examples: 
  - `https://app.d4h.com/team/exercises`
  - `https://yourorg.d4h.com/team/exercises`
  - `https://secure.d4h.com/account123/team/exercises`

### 2. Reload the Extension
1. Go to `chrome://extensions/` (or `edge://extensions/`)
2. Find "D4H Mail Helper"
3. Click the refresh/reload button (🔄)
4. Refresh the D4H page

### 3. Check Developer Console
1. On the D4H exercises page, press F12
2. Go to the "Console" tab
3. Look for messages starting with "D4H Mail Helper:"
4. You should see: `D4H Mail Helper: Content script loaded on [URL]`

### 4. Verify Permissions
1. Right-click the extension icon
2. Select "This can read and change site data"
3. Make sure it's set to "On all sites" or "On d4h.com"

### 5. Test the Button
If the script loads but no button appears:
1. Wait a few seconds for the page to fully load
2. Check the console for: `D4H Mail Helper: Button added successfully`
3. Look for an orange button near the page header

### 6. Common Issues & Solutions

**Extension grayed out:**
- URL doesn't match the pattern - verify you're on `/team/exercises`
- Permissions not granted - check site permissions
- Extension disabled - check extensions page

**Button doesn't appear:**
- Page still loading - wait for React components
- No table found - verify page has exercise table
- Check console for error messages

**Button appears but doesn't work:**
- Clipboard permission denied - reload extension
- No exercise rows found - check table structure
- JavaScript errors - check console

### 7. Manual URL Test
Try these specific URL patterns to see if extension activates:
- Add `/team/exercises` to your D4H domain
- Example: `https://yourteam.d4h.com/team/exercises`

If none of these work, the issue might be with the specific D4H URL structure. Check the console logs and let me know the exact URL pattern you're using!
