from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langgraph.agent import Agent
from langgraph.nodes import LLMNode
from langgraph.graph import Graph
import yfinance as yf
import os

app = FastAPI()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


# Request body model
class AnalyzeRequest(BaseModel):
    ticker: str
    start_date: str  # YYYY-MM-DD
    end_date: str    # YYYY-MM-DD


# Utility to fetch historical stock prices
def fetch_stock_data(ticker: str, start_date: str, end_date: str):
    try:
        df = yf.download(ticker, start=start_date, end=end_date)
        if df.empty:
            raise ValueError("No data for given dates.")
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/analyze")
async def analyze_stock(data: AnalyzeRequest):
    # 1️⃣ Validate and fetch data
    price_data = fetch_stock_data(data.ticker, data.start_date, data.end_date)

    # 2️⃣ Create LangGraph agent
    graph = Graph(name=f"{data.ticker} Investigation")
    agent = Agent(
        graph=graph,
        openai_api_key=OPENAI_API_KEY,
        name="StockInvestigator"
    )

    # 3️⃣ Seed agent with nodes
    fetch_node = LLMNode(
        label=f"Fetch {data.ticker} Price Data",
        prompt=f"Fetched price data from {data.start_date} to {data.end_date}: {price_data}"
    )
    graph.add_node(fetch_node)

    sentiment_node = LLMNode(
        label="Sentiment Analysis: News & Social Media",
        prompt=f"Analyze sentiment for {data.ticker} in this date range."
    )
    graph.add_node(sentiment_node)
    graph.add_edge(fetch_node.id, sentiment_node.id)

    decision_node = LLMNode(
        label="Agent Decision: Investigate Earnings",
        prompt=f"Based on price and sentiment, decide next step."
    )
    graph.add_node(decision_node)
    graph.add_edge(sentiment_node.id, decision_node.id)

    inference_node = LLMNode(
        label="Inference Node: Price Movement Conclusion",
        prompt="Combine all previous data to explain why the stock price changed."
    )
    graph.add_node(inference_node)
    graph.add_edge(fetch_node.id, inference_node.id)
    graph.add_edge(sentiment_node.id, inference_node.id)
    graph.add_edge(decision_node.id, inference_node.id)

    # 4️⃣ Let agent run (optional: async LLM generation)
    await agent.run_llm_nodes()

    # 5️⃣ Return graph structure for frontend
    return graph.to_dict()
