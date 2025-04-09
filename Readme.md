# 📈 Stock Market Prediction App

This is a full-stack application that allows users to:
- 🔍 Search for stock symbols
- 🤖 View predictions on market movement using SVM and Random Forest models
- 📊 See historical closing price chart
- 📋 Explore real-time stock details

Built using **React (MUI)** on the frontend and **Flask (Python)** on the backend with **yfinance** for stock data.

---

## 🧰 Tech Stack

**Frontend:** React, MUI, Chart.js  
**Backend:** Flask, scikit-learn, yfinance, flask-cors  
**ML Models:** SVM and Random Forest Classifier  

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/stock-prediction-app.git
cd stock-prediction-app
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### 🔧 File Structure (Backend)
```
backend/
├── app.py                 # Flask app with 3 routes
├── models/
│   ├── rfc_model.py       # Random Forest logic
│   └── svm_model.py       # SVM logic
├── requirements.txt       # Python dependencies
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev  # or npm start
```

#### 🔧 File Structure (Frontend)
```
frontend/
├── src/
│   └── App.jsx            # Main React component
├── public/
├── package.json
```

---

## 🚀 Running the App
- Run backend:
```bash
cd backend
python app.py
```

- Run frontend:
```bash
cd frontend
npm run dev
```

- Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 API Endpoints

### `POST /predict`
- Input: `{ "stock": "RELIANCE.NS" }`
- Output: Market prediction and precision score from SVM and RFC

### `POST /stock-info`
- Input: `{ "stock": "RELIANCE.NS" }`
- Output: Company info (market cap, price, sector, etc.)

### `POST /chart-data`
- Input: `{ "stock": "RELIANCE.NS" }`
- Output: Last 6 months historical close prices (label + prices array)

---

## 📝 Notes
- Ensure Python 3.8+ and Node 16+ are installed
- NSE stocks like `RELIANCE.NS` work well with `yfinance`
- CORS is handled via `flask-cors`

---

## 🙋‍♂️ Contributing
Feel free to fork, improve, or extend the project. PRs are welcome!


