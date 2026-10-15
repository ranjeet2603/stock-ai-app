from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import feedparser
import yfinance as yf
from google import genai
import os

app = FastAPI(title="Stock API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY", "YOUR_API_KEY"))

@app.get("/api/stock/{ticker}")
def stock_analysis(ticker: str):
    t = ticker.upper().strip()
    try:
        stock = yf.Ticker(t)
        data = stock.history(period="1d")
        price = float(data['Close'].iloc[-1]) if not data.empty else 0.0
    except Exception:
        price = 0.0

    feed = feedparser.parse(f"https://finance.yahoo.com/rss/headline?s={t}")
    headlines = [entry.title for entry in feed.entries[:5]]

    if not headlines:
        return {"ticker": t, "price": price, "headlines": ["No news found."], "signal": "NEUTRAL — No news."}

    prompt = (
        f"Analyze recent news for {t}:\n" + "\n".join(headlines) + "\n\n"
        "Give market signal: BULLISH, BEARISH, or NEUTRAL followed by a short reason."
    )

    try:
        res = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        signal = res.text.strip()
    except Exception as e:
        signal = f"NEUTRAL — Error: {str(e)}"

    return {"ticker": t, "price": round(price, 2), "headlines": headlines, "signal": signal}