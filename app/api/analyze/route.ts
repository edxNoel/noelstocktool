import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { ticker, start_date, end_date } = await req.json();

  // Example: Fake analysis steps to mimic agentic reasoning
  const analysisSteps = [
    { id: "1", label: "Fetch Price Data", description: `Fetched historical data for ${ticker}` },
    { id: "2", label: "Sentiment Analysis", description: "Analyzed news sentiment" },
    { id: "3", label: "Agent Decision", description: "Decided to check earnings report" },
    { id: "4", label: "Inference", description: "Price increased due to positive earnings" },
  ];

  const connections = [
    { from: "1", to: "2" },
    { from: "2", to: "3" },
    { from: "3", to: "4" },
  ];

  return NextResponse.json({ analysisSteps, connections });
}
