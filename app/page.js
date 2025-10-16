'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [ticker, setTicker] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  // AI thinking steps
  const steps = [
    { label: 'Fetch TSLA Price Data', type: 'action' },
    { label: 'Sentiment Analysis: News Article', type: 'analysis' },
    { label: 'Agent Decision: Investigate Earnings', type: 'decision' },
    { label: 'Spawn Sub-Investigation: Competitor Analysis', type: 'branch' },
    { label: 'Cross-validate Data', type: 'edge' },
    { label: 'Inference Node: Price Likely Increased', type: 'inference' },
  ];

  const handleAnalyze = () => {
    if (!ticker || !startDate || !endDate) {
      alert('Please enter ticker and dates');
      return;
    }

    setNodes([]);
    setEdges([]);
    setStep(0);
    setRunning(true);
  };

  // AI simulation effect
  useEffect(() => {
    if (!running) return;
    if (step >= steps.length) {
      setRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      const nextNode = { id: nodes.length + 1, label: steps[step].label };
      setNodes((prev) => [...prev, nextNode]);

      // Add edges for cross-validation or branch nodes
      if (steps[step].type === 'edge' && nodes.length > 1) {
        setEdges((prev) => [
          ...prev,
          { from: nodes[nodes.length - 2].id, to: nodes[nodes.length - 1].id },
        ]);
      }

      setStep(step + 1);
    }, 1500); // 1.5s delay per step

    return () => clearTimeout(timer);
  }, [step, nodes, running]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 flex flex-col items-center p-8 text-white overflow-x-auto">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold">NoelStockBot</h1>
        <p className="text-lg">Watch the AI agent think step by step</p>
      </header>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="date"
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

      {/* Node graph */}
      <div className="flex items-start gap-6 overflow-x-auto py-4">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`p-4 rounded shadow-lg min-w-[200px] bg-black bg-opacity-50 border-2 border-white`}
          >
            {node.label}
          </div>
        ))}
      </div>

      {/* Edge visualization */}
      <div className="relative w-full h-16">
        {edges.map((edge, idx) => {
          const fromIndex = nodes.findIndex((n) => n.id === edge.from);
          const toIndex = nodes.findIndex((n) => n.id === edge.to);

          if (fromIndex === -1 || toIndex === -1) return null;

          return (
            <div
              key={idx}
              className="absolute bg-white h-1"
              style={{
                left: `${fromIndex * 220 + 100}px`,
                top: '20px',
                width: `${(toIndex - fromIndex) * 220}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
