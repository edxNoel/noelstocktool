"use client";

import { useState } from "react";

export default function Page() {
  const [ticker, setTicker] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [nodes, setNodes] = useState([]);

  const simulateAI = async () => {
    setNodes([]);
    const newNodes = [];

    const addNode = async (content) => {
      newNodes.push({ content, id: newNodes.length });
      setNodes([...newNodes]);
      await new Promise((r) => setTimeout(r, 1500));
    };

    // Step 1: Fetch Data
    await addNode(
      `AI is deciding which data sources to fetch for ${ticker} between ${startDate} and ${endDate}. ` +
        `It chooses historical price data, financial statements, news articles, and sentiment scores to form a broad understanding of market conditions.`
    );

    // Step 2: Analyze Trends & News
    await addNode(
      `AI analyzes the fetched data: recent news shows increased interest in ${ticker}, earnings report indicates revenue growth, ` +
        `and historical price trends suggest volatility around earnings. It evaluates sentiment scores, noting positive mentions outweigh negative.`
    );

    // Step 3: Decide Key Factors
    await addNode(
      `AI prioritizes factors impacting price: earnings surprise (+2%), positive sentiment (+1.5%), trading volume spike (+1%). ` +
        `It decides earnings and sentiment are the primary drivers for short-term price movement.`
    );

    // Step 4: Cross-validation / Branching
    await addNode(
      `AI cross-checks historical correlations between earnings surprises and price jumps for ${ticker}. ` +
        `It also simulates scenarios with sentiment fluctuations to test robustness of predictions.`
    );

    // Step 5: Inference / Conclusion
    await addNode(
      `AI forms a final inference: the price of ${ticker} is likely to increase by 3-5% in the next week. ` +
        `Reasoning: strong positive earnings report, favorable sentiment, and high trading volume. ` +
        `Recommendation: consider buying, but monitor for sudden negative news or market shifts that could invalidate the inference.`
    );
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 flex flex-col items-center p-8 text-white overflow-x-auto">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold">NoelStockBot</h1>
        <p className="text-lg">Watch the AI think, decide, and act in depth</p>
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
            className="min-w-[300px] p-4 bg-black bg-opacity-50 rounded shadow"
          >
            <p>{node.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
