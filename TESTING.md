# How to Test the Frontend Improvements

## Quick Start

### 1. Start the Backend Server

Open a terminal and run:
```bash
cd backend
npm install  # if you haven't already
npm run dev
```

The backend should start on `http://localhost:3001`

### 2. Start the Frontend Development Server

Open another terminal and run:
```bash
cd frontend
npm install  # if you haven't already
npm run dev
```

The frontend should start on `http://localhost:5173`

### 3. Open in Browser

Navigate to: **http://localhost:5173**

---

## What to Test

### ✅ Toast Notifications
1. **Upload a file** - You should see a success toast notification
2. **Upload an invalid file** (e.g., .txt) - You should see an error toast
3. **Try to get rates** when backend is offline - You should see a warning toast

### ✅ File Upload Improvements
1. **Drag and drop** an Excel file - Should show loading spinner
2. **Click "Choose File"** - Should show loading state during processing
3. **Upload Sample_Data.xlsx** - Should show success toast with count

### ✅ Table Sorting
1. Click on **column headers** (ID, Date, Cost, Weight, Carrier, Mode)
2. Click again to **reverse sort order**
3. Notice the **sort indicators** (↑ ↓) appear

### ✅ Table Pagination
1. Upload a file with many shipments (or use Sample_Data.xlsx)
2. Use **pagination controls** at bottom:
   - Change items per page (10, 25, 50, 100)
   - Use Prev/Next buttons
   - Use First/Last buttons («« »»)

### ✅ Export Functionality
1. Apply some **filters** (optional)
2. Click **"Export Excel"** button in table header
3. Check your Downloads folder for the exported file

### ✅ Enhanced Filters
1. **Type in search box** - Should filter in real-time
2. **Select filters** - Notice the blue highlight on active filters
3. See **results count** update at top of filters panel
4. Click **"Clear"** button to reset all filters

### ✅ Improved Modal
1. Click **"Get Rates"** on any shipment
2. Notice the **smooth animation** when modal opens
3. See **"BEST PRICE"** badge on cheapest rate
4. Click **outside modal** or **× button** to close

### ✅ Responsive Design
1. **Resize browser window** to mobile size
2. Check that:
   - Header adapts to smaller screens
   - Tabs show abbreviated text on mobile
   - Table scrolls horizontally on mobile
   - Filters stack properly

### ✅ Analytics Improvements
1. Switch to **"Analytics"** tab
2. Notice the **gradient stat cards** with icons
3. Check that **charts** display properly
4. Hover over chart elements to see **tooltips**

---

## Troubleshooting

### Backend Not Starting?
- Check if port 3001 is already in use
- Make sure you're in the `backend` directory
- Run `npm install` if you see module errors

### Frontend Not Starting?
- Check if port 5173 is already in use
- Make sure you're in the `frontend` directory
- Run `npm install` if you see module errors

### Toast Notifications Not Showing?
- Check browser console for errors
- Make sure ToastProvider is wrapping the app (check App.tsx)

### Table Sorting Not Working?
- Make sure you have shipments loaded
- Check browser console for errors

### Export Not Working?
- Make sure you have shipments loaded
- Check browser console for errors
- Check if downloads are blocked by browser

---

## Quick Test Checklist

- [ ] Toast notifications appear and auto-dismiss
- [ ] File upload shows loading state
- [ ] Table columns are sortable
- [ ] Pagination works correctly
- [ ] Export creates Excel file
- [ ] Filters show visual feedback
- [ ] Modal has smooth animations
- [ ] Responsive design works on mobile
- [ ] Analytics charts display correctly

---

## Sample Data

Use the included `Sample_Data.xlsx` file to test all features quickly!

