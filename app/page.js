'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [ticker, setTicker] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [running, setRunning] = useState(false);
  const [queue, setQueue] = useState([]); // queue of AI steps

  const handleAnalyze = () => {
    if (!ticker || !startDate || !endDate) {
      alert('Please enter ticker and dates');
      return;
    }

    // reset nodes/edges
    setNodes([]);
    setEdges([]);
    setQueue([]);
    setRunning(true);

    // generate dynamic AI steps based on ticker
    const steps = [
      { label: `Fetch ${ticker} Price Data`, type: 'action' },
      { label: `Analyze News for ${ticker}`, type: 'analysis' },
      { label: `Agent Decision: Investigate Earnings of ${ticker}`, type: 'decision' },
      { label: `Spawn Sub-Investigation: Competitor Analysis`, type: 'branch' },
      { label: `Cross-validate Historical Data`, type: 'edge' },
      { label: `Inference Node: Likely Price Movement for ${ticker}`, type: 'inference' },
    ];
    setQueue(steps);
  };

  // AI simulation effect
  useEffect(() => {
    if (!running || queue.length === 0) return;

    const timer = setTimeout(() => {
      const step = queue[0];
      const newNode = { id: nodes.length + 1, label: step.label, type: step.type };
      setNodes((prev) => [...prev, newNode]);

      // create edges dynamically
      if (step.type === 'edge' && nodes.length > 0) {
        setEdges((prev) => [
          ...prev,
          { from: nodes[nodes.length - 1].id, to: newNode.id },
        ]);
      }

      // branch node simulation
      if (step.type === 'branch' && nodes.length > 0) {
        const branchNode = { id: nodes.length + 2, label: `${step.label} Child`, type: 'branch-child' };
        setNodes((prev) => [...prev, branchNode]);
        setEdges((prev) => [...prev, { from: newNode.id, to: branchNode.id }]);
      }

      // remove the processed step from queue
      setQueue((prev) => prev.slice(1));
    }, 1500);

    return () => clearTimeout(timer);
  }, [queue, running, nodes]);

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
            className="p-4 rounded shadow-lg min-w-[220px] bg-black bg-opacity-50 border-2 border-white"
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
                left: `${fromIndex * 240 + 110}px`,
                top: '20px',
                width: `${(toIndex - fromIndex) * 240}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
