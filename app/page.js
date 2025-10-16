"use client";

import { useState } from "react";

export default function Page() {
  const [ticker, setTicker] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [nodes, setNodes] = useState([]);

  // Simulated AI "brain"
  const simulateAI = async () => {
    setNodes([]); // reset nodes
    const newNodes = [];

    const addNode = async (content) => {
      newNodes.push({ content, id: newNodes.length });
      setNodes([...newNodes]);
      await new Promise((r) => setTimeout(r, 1200)); // pause for thinking
    };

    // Step 1: Fetch data
    await addNode(
      `AI is considering which data sources to fetch for ${ticker} between ${startDate} and ${endDate}...`
    );

    // Step 2: Analyze
    await addNode(
      `AI analyzes market sentiment, news, and historical price trends for ${ticker}...`
    );

    // Step 3: Make decisions
    await addNode(
      `AI decides which factors are most important: earnings reports, market sentiment, volume trends...`
    );

    // Step 4: Cross-validation / branching
    await addNode(
      `AI cross-checks these factors against historical price movements to form a hypothesis...`
    );

    // Step 5: Inference / conclusion
    await addNode(
      `AI concludes: Based on the analysis, the price is likely to ${
        Math.random() > 0.5 ? "rise" : "fall"
      }. Reason: strong correlation with recent earnings and sentiment. Recommendation: ${
        Math.random() > 0.5 ? "BUY" : "WAIT"
      }.`
    );
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 flex flex-col items-center p-8 text-white overflow-x-auto">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold">NoelStockBot</h1>
        <p className="text-lg">Watch the AI think, decide, and act</p>
      </header>

      <div className="mb-6 flex gap-2 flex-wrap">
        <input
          className="p-2 text-black rounded"
          placeholder="Ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
        />
        <input
          className="p-2 text-black rounded"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          className="p-2 text-black rounded"
          type="date"
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
            <p>{node.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
