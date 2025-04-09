import requests
from flask import Flask, request, jsonify
from models.svm_model import run_svm
from models.rfc_model import run_rfc
import yfinance as yf
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    stock = data.get("stock")

    if not stock:
        return jsonify({"error": "Stock symbol is required."}), 400

    svm_result = run_svm(stock)
    rfc_result = run_rfc(stock)

    return jsonify({
        "stock": stock,
        "svm": svm_result,
        "rfc": rfc_result
    })

@app.route("/stock-info", methods=["POST"])
def stock_info():
    data = request.json
    stock_symbol = data.get("stock")

    if not stock_symbol:
        return jsonify({"error": "Stock symbol is required."}), 400

    try:
        ticker = yf.Ticker(stock_symbol)
        info = ticker.info

        stock_data = {
            "symbol": info.get("symbol"),
            "name": info.get("longName"),
            "sector": info.get("sector"),
            "marketCap": info.get("marketCap"),
            "currency": info.get("currency"),
            "country": info.get("country"),
            "previousClose": info.get("previousClose"),
            "open": info.get("open"),
            "dayHigh": info.get("dayHigh"),
            "dayLow": info.get("dayLow"),
            "volume": info.get("volume"),
            "website": info.get("website"),
        }

        return jsonify(stock_data)
    
    except Exception as e:
        return jsonify({"error": f"Failed to fetch data: {str(e)}"}), 500

@app.route("/chart-data", methods=["POST"])
def chart_data():
    data = request.json
    stock = data.get("stock")

    if not stock:
        return jsonify({"error": "Stock symbol is required."}), 400

    try:
        ticker = yf.Ticker(stock)
        hist = ticker.history(period="6mo", interval="1d")
        hist.reset_index(inplace=True)

        result = {
            "labels": hist["Date"].dt.strftime("%Y-%m-%d").tolist(),
            "prices": hist["Close"].round(2).fillna(0).tolist()
        }

        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
