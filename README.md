# 🚚 Logistics Analytics Dashboard

A modern, full-stack logistics management platform for analyzing shipment data, visualizing routes, and comparing shipping options.

## ✨ Features

- **📊 Data Import**: Upload Excel files with shipment data
- **🗺️ Interactive Maps**: Visualize shipment routes with geocoding
- **💰 Rate Comparison**: Compare shipping rates across carriers
- **📈 Analytics**: Comprehensive analytics and insights
- **🔍 Advanced Filtering**: Filter by country, carrier, date, weight, and more
- **📥 Export**: Download filtered data and reports

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Leaflet.js for map visualization
- Chart.js for analytics
- SheetJS for Excel processing

### Backend
- Node.js with Express
- RESTful API design
- Mock shipping rate data (no external API dependencies)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR-USERNAME/logistics-dashboard-v2.git
cd logistics-dashboard-v2
```

2. **Install dependencies**

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

3. **Start development servers**

Backend (Terminal 1):
```bash
cd backend
npm run dev
```

Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

4. **Open your browser**
```
http://localhost:5173
```

## 📁 Project Structure

```
logistics-dashboard-v2/
├── backend/          # Express API server
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic
│   │   └── server.js # Entry point
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
├── Sample_Data.xlsx  # Sample Excel file
└── README.md
```

## 📊 Excel File Format

Your Excel file should contain these columns:

| Column | Required | Description |
|--------|----------|-------------|
| Shipment ID | Yes | Unique identifier (e.g., SHIP001) |
| Collection Date | Yes | Pickup date (YYYY-MM-DD) |
| Collection Location | Yes | Pickup postcode/area |
| Delivery Location | Yes | Delivery postcode/area |
| Origin Country | Yes | Pickup country (full name) |
| Destination Country | Yes | Delivery country (full name) |
| Transport Mode | Yes | Road, Air, or Sea |
| Carrier | Yes | Carrier name (e.g., DHL, FedEx) |
| Weight (kg) | Yes | Package weight |
| Cost | Yes | Shipping cost |

**📥 [Download Sample Excel File](./Sample_Data.xlsx)**

## 🌐 Deployment

### Backend (Render/Railway/Vercel)

1. Push code to GitHub
2. Connect repository to your hosting service
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`

### Frontend (Vercel/Netlify)

1. Connect GitHub repository
2. Set root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`

## 📝 License

MIT License - feel free to use this project for your portfolio or learning.

## 👤 Author

**Your Name**
- Portfolio: [your-portfolio.com]
- GitHub: [@yourusername](https://github.com/yourusername)

---

⭐ Star this repo if you find it useful!

