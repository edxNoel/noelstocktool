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
      alert('Enter ticker and dates');
      return;
    }

    setNodes([]);
    setEdges([]);
    setQueue([]);
    setRunning(true);

    // Step sequence
    const steps = [
      {
        title: `Fetch ${ticker} Price Data`,
        thought: `I need historical price data from ${startDate} to ${endDate} to see trends.`,
        decision: `Retrieve daily close prices and moving averages.`,
        effect: `This gives me the base dataset for trend analysis.`,
      },
      {
        title: `Analyze News`,
        thought: `I will scan recent news articles for sentiment.`,
        decision: `Tag each article as positive, negative, or neutral.`,
        effect: `Sentiment score will influence risk assessment for ${ticker}.`,
      },
      {
        title: `Decision: Investigate Earnings`,
        thought: `Based on price trends and news sentiment, earnings may impact stock movement.`,
        decision: `Check earnings report dates and projections.`,
        effect: `Future predictions now factor in earnings analysis.`,
      },
      {
        title: `Sub-Investigation: Competitor Analysis`,
        thought: `I will compare ${ticker} with competitors for external influence.`,
        decision: `Analyze competitors’ price movement and news.`,
        effect: `Adjust expectations for ${ticker} based on market competition.`,
      },
      {
        title: `Cross-Validate Historical Data`,
        thought: `I need to validate anomalies against historical trends.`,
        decision: `Flag unusual patterns in the data.`,
        effect: `Ensures the model’s inferences are reliable.`,
      },
      {
        title: `Inference: Likely Price Movement`,
        thought: `Combining all previous analyses...`,
        decision: `Predict ${ticker} is likely to move up/down/stable.`,
        effect: `Final decision node shows AI’s overall conclusion and confidence.`,
      },
    ];

    setQueue(steps);
  };

  // Sequential processing with dynamic reasoning
  useEffect(() => {
    if (!running || queue.length === 0) return;

    const timer = setTimeout(() => {
      const step = queue[0];
      const newNode = {
        id: nodes.length + 1,
        title: step.title,
        thought: step.thought,
        decision: step.decision,
        effect: step.effect,
      };

      setNodes((prev) => [...prev, newNode]);

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
        <p className="text-lg">Watch the AI think, decide, and act</p>
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
            className="p-4 rounded shadow-lg min-w-[280px] bg-black bg-opacity-50 border-2 border-white"
          >
            <h3 className="font-bold mb-2">{node.title}</h3>
            <p><strong>Thought:</strong> {node.thought}</p>
            <p><strong>Decision:</strong> {node.decision}</p>
            <p><strong>Effect:</strong> {node.effect}</p>
          </div>
        ))}
      </div>

      {/* Edges */}
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
                left: `${fromIndex * 300 + 140}px`,
                top: '20px',
                width: `${(toIndex - fromIndex) * 300}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
