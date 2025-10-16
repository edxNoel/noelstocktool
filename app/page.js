"use client";

import { useState } from "react";

export default function Page() {
  const [ticker, setTicker] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [nodes, setNodes] = useState([]);

  // Simulate AI thinking dynamically
  const simulateAI = async () => {
    setNodes([]); // Reset graph
    const newNodes = [];

    const addNode = async (title, content) => {
      newNodes.push({ title, content, id: newNodes.length });
      setNodes([...newNodes]);
      await new Promise((r) => setTimeout(r, 1000)); // Pause to simulate thinking
    };

    await addNode(
      `Fetch ${ticker} Price Data`,
      `Fetching price data for ${ticker} from ${startDate} to ${endDate}`
    );
    await addNode(
      "Sentiment Analysis: News Articles",
      `Analyzing latest news for ${ticker} to determine market sentiment`
    );
    await addNode(
      "Agent Decision: Investigate Earnings",
      `Based on sentiment and price trends, the AI chooses to investigate earnings reports`
    );
    await addNode(
      "Cross-Validation: Data Check",
      `Comparing historical price movement vs earnings report for validation`
    );
    await addNode(
      "Inference Node: Price Prediction",
      `AI predicts price movement for ${ticker}. Reason: strong earnings + positive sentiment. Recommendation: BUY`
    );
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 flex flex-col items-center p-8 text-white overflow-x-auto">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold">NoelStockBot</h1>
        <p className="text-lg">Watch the AI think, decide, and act</p>
      </header>

      <div className="mb-6 flex gap-2">
        <input
          className="p-2 text-black rounded"
          placeholder="Ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
        />
        <input
          className="p-2 text-black rounded"
          placeholder="Start Date (YYYY-MM-DD)"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          className="p-2 text-black rounded"
          placeholder="End Date (YYYY-MM-DD)"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          className="bg-white text-black px-4 py-2 rounded font-bold"
          onClick={simulateAI}
        >
          Analyze
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="min-w-[250px] p-4 bg-black bg-opacity-50 rounded shadow"
          >
            <h2 className="font-bold text-lg">{node.title}</h2>
            <p>{node.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
