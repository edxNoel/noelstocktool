"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [ticker, setTicker] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  const handleAnalyze = async () => {
    setNodes([]);
    setEdges([]);
    try {
      const response = await axios.post("/api/analyze", {
        ticker,
        start_date: startDate,
        end_date: endDate,
      });

      const { analysisSteps, connections } = response.data;

      setNodes(analysisSteps);
      setEdges(connections);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex flex-col">
      <header className="bg-black text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">NoelStockBot</h1>
        <p className="text-sm">Watch the AI think in real-time</p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start p-6 gap-4 overflow-auto">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="p-2 rounded shadow"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 rounded shadow"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 rounded shadow"
          />
          <button
            onClick={handleAnalyze}
            className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800"
          >
            Analyze
          </button>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-4xl">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="p-3 rounded shadow bg-white bg-opacity-90"
            >
              <strong>{node.label}</strong>
              <p className="text-sm mt-1">{node.description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-black text-white text-center py-2">
        Expected inputs :- ticker, start date and price, end date and price <br />
        Expected Output:- Create a full stack web app which displays why the price changed (increased or decreased)
      </footer>
    </div>
  );
}
