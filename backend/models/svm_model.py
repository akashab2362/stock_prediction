import yfinance as yf
import pandas as pd
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import precision_score

def run_svm(stock_symbol):
    data = yf.Ticker(stock_symbol).history(period="max")
    if data.empty:
        return {"error": "Stock data not found."}

    data.drop(columns=["Dividends", "Stock Splits"], inplace=True, errors='ignore')
    data["Tomorrow"] = data["Close"].shift(-1)
    data["Target"] = (data["Tomorrow"] > data["Close"]).astype(int)
    data = data.loc["1990-01-01":].copy()
    predictors = ["Close", "Volume", "Open", "High", "Low"]

    train = data.iloc[:-100]
    test = data.iloc[-100:]

    scaler = StandardScaler()
    X_train = scaler.fit_transform(train[predictors])
    X_test = scaler.transform(test[predictors])
    y_train = train["Target"]
    y_test = test["Target"]

    model = SVC(kernel='rbf', C=10, gamma=0.1, probability=True, random_state=1)
    model.fit(X_train, y_train)
    preds = model.predict(X_test)

    precision = precision_score(y_test, preds)
    latest_prediction = int(preds[-1])
    latest_date = test.index[-1].date()

    return {
        "model": "SVM",
        "precision_score": round(precision, 4),
        "prediction": latest_prediction,
        "date": str(latest_date)
    }
