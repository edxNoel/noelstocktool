import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx

# New LangGraph imports
from langgraph import Graph, Node

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = FastAPI(title="NoelStockBot Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema
class AnalyzeRequest(BaseModel):
    ticker: str
    start: str
    end: str

# Fetch stock CSV
async def fetch_price_csv(symbol: str, start: str, end: str) -> str:
    symbol = symbol.lower() + ".us" if "." not in symbol else symbol.lower()
    url = f"https://stooq.com/q/d/l/?s={symbol}&d1={start.replace('-','')}&d2={end.replace('-','')}&i=d"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch stock data")
        return resp.text

@app.post("/analyze")
async def analyze(payload: AnalyzeRequest):
    ticker = payload.ticker
    start = payload.start
    end = payload.end

    # Step 1: Fetch stock data
    csv_data = await fetch_price_csv(ticker, start, end)
    if not csv_data.strip():
        raise HTTPException(status_code=400, detail="No stock data returned")

    # Step 2: Create a LangGraph
    graph = Graph(name=f"{ticker} Stock Analysis")

    # Step 3: Add nodes using new API
    price_node = Node(
        name="Fetch Price Data",
        prompt=f"Analyze the stock {ticker} from {start} to {end} and explain why the price changed."
    )
    graph.add_node(price_node)

    sentiment_node = Node(
        name="Sentiment Analysis: News Article",
        prompt=f"Analyze news sentiment for {ticker} between {start} and {end}."
    )
    graph.add_node(sentiment_node)

    decision_node = Node(
        name="Agent Decision: Investigate Earnings",
        prompt=f"Based on price and sentiment analysis, decide if we should investigate earnings, regulatory filings, or social media next."
    )
    graph.add_node(decision_node)

    # Step 4: Run nodes
    steps = []
    for node in [price_node, sentiment_node, decision_node]:
        output = node.run(api_key=OPENAI_API_KEY)
        steps.append({"label": node.name, "description": output})

    return {"steps": steps}
