'use client';

import { useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [nodes, setNodes] = useState([]);
  const [ticker, setTicker] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleAnalyze = async () => {
    if (!ticker || !startDate || !endDate) {
      alert('Please fill all fields');
      return;
    }

    // Simulate AI node-based analysis
    const newNodes = [
      { id: 1, label: `Expected inputs: ticker=${ticker}, start=${startDate}, end=${endDate}` },
      { id: 2, label: 'Fetching historical price data...' },
      { id: 3, label: 'Performing AI sentiment & trend analysis...' },
      { id: 4, label: 'Inference: Price likely increased due to positive news' },
    ];
    setNodes(newNodes);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start p-8 text-white">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold">NoelStockBot</h1>
        <p className="text-lg">Watch the AI think in real-time</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 rounded text-black"
        />
        <button
          onClick={handleAnalyze}
          className="bg-white text-black px-4 py-2 rounded font-bold hover:bg-gray-200"
        >
          Analyze
        </button>
      </div>

      <div className="flex flex-col items-start gap-2 w-full max-w-2xl">
        {nodes.map((node) => (
          <div key={node.id} className="bg-black bg-opacity-50 p-4 rounded w-full">
            {node.label}
          </div>
        ))}
      </div>

      <footer className="mt-8 text-sm text-gray-200 text-center">
        Expected inputs: ticker, start date and end date. <br />
        Expected output: Create a full-stack web app which displays why the price changed (increased or decreased). <br />
        Baseline Techstack: Frontend - Next.js
      </footer>
    </div>
  );
}
