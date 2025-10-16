from fastapi import FastAPI
from pydantic import BaseModel
from langgraph import Agent, Step
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Enable CORS for your frontend (replace with your domain in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    ticker: str
    start: str
    end: str

@app.post("/analyze")
async def analyze(data: AnalyzeRequest):
    """
    Autonomous AI agent that investigates stock price changes using LangGraph.
    Returns structured steps for frontend React Flow visualization.
    """
    try:
        agent = Agent(
            name="Stock Investigator",
            goal=f"Determine why {data.ticker} stock changed price from {data.start} to {data.end}. "
                 "Use news, earnings, SEC filings, social media, and historical prices. "
                 "Make independent decisions, spawn sub-investigations, cross-validate data, "
                 "form hypotheses, and produce a final conclusion."
        )

        # Run agent to generate reasoning steps
        steps: list[Step] = agent.run()

        # Convert LangGraph steps to JSON for frontend
        response = {
            "steps": [
                {"label": step.title, "description": step.description} for step in steps
            ]
        }

        # Insert Expected Inputs/Outputs as first node
        response["steps"].insert(0, {
            "label": "Expected Inputs / Outputs",
            "description": (
                f"Expected inputs: ticker, start date and price, end date and price\n"
                f"Expected Output: Full-stack web app showing why {data.ticker} price changed\n"
                "Baseline Techstack: Frontend - Next.js, Backend - FastAPI, Agentic framework - LangGraph"
            )
        })

        return response

    except Exception as e:
        return {"steps": [{"label": "Error", "description": str(e)}]}
