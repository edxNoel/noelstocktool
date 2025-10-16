'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [ticker, setTicker] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [queue, setQueue] = useState([]);
  const [running, setRunning] = useState(false);

  const handleAnalyze = () => {
    if (!ticker || !startDate || !endDate) {
      alert('Please enter ticker and dates');
      return;
    }

    // Reset everything
    setNodes([]);
    setEdges([]);
    setQueue([]);
    setRunning(true);

    // Queue of AI thoughts
    const steps = [
      {
        title: `Fetch ${ticker} Price Data`,
        content: `I need the historical price data for ${ticker} from ${startDate} to ${endDate} to see recent trends.`,
      },
      {
        title: `Analyze News`,
        content: `I will scan recent news articles for ${ticker} to gauge sentiment and detect any unusual events.`,
      },
      {
        title: `Decision: Investigate Earnings`,
        content: `Based on price trends and news, I will check if upcoming earnings reports might affect ${ticker}'s stock movement.`,
      },
      {
        title: `Spawn Sub-Investigation: Competitor Analysis`,
        content: `I will compare ${ticker} with competitors to see how external factors might influence performance.`,
      },
      {
        title: `Cross-Validate Historical Data`,
        content: `I need to ensure my price analysis matches historical patterns and validate any anomalies.`,
      },
      {
        title: `Inference: Likely Price Movement`,
        content: `Combining all data points, I estimate the likely price movement for ${ticker}.`,
      },
    ];

    setQueue(steps);
  };

  // Sequentially process AI steps
  useEffect(() => {
    if (!running || queue.length === 0) return;

    const timer = setTimeout(() => {
      const step = queue[0];
      const newNode = {
        id: nodes.length + 1,
        title: step.title,
        content: step.content,
      };

      setNodes((prev) => [...prev, newNode]);

      // Connect edges sequentially
      if (nodes.length > 0) {
        setEdges((prev) => [
          ...prev,
          { from: nodes[nodes.length - 1].id, to: newNode.id },
        ]);
      }

      setQueue((prev) => prev.slice(1));
    }, 2000);

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
            className="p-4 rounded shadow-lg min-w-[260px] bg-black bg-opacity-50 border-2 border-white"
          >
            <h3 className="font-bold mb-2">{node.title}</h3>
            <p className="text-sm">{node.content}</p>
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
                left: `${fromIndex * 280 + 130}px`,
                top: '20px',
                width: `${(toIndex - fromIndex) * 280}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
