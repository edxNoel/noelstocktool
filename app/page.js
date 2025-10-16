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

  // Simulate AI reasoning for each step dynamically
  const simulateNodeOutput = (step, prevNodes) => {
    switch (step) {
      case 'Fetch Price Data':
        return {
          thought: `I need historical price data from ${startDate} to ${endDate} for ${ticker}.`,
          decision: `Retrieve daily closing prices and calculate moving averages.`,
          effect: `Base dataset ready with ${ticker} price history.`,
        };
      case 'Analyze News':
        return {
          thought: `I will scan recent news articles for ${ticker} to determine sentiment.`,
          decision: `Tag each article as positive, negative, or neutral.`,
          effect: `Sentiment score will influence AI's risk assessment for ${ticker}.`,
        };
      case 'Investigate Earnings':
        return {
          thought: `Earnings reports impact price movements. I will examine them.`,
          decision: `Check earnings dates, results, and projections.`,
          effect: `Future predictions now include earnings analysis.`,
        };
      case 'Competitor Analysis':
        return {
          thought: `I need to compare ${ticker} against competitors to identify external influences.`,
          decision: `Analyze competitor price trends and news.`,
          effect: `Adjust expectations for ${ticker} based on market competition.`,
        };
      case 'Cross-Validate Data':
        return {
          thought: `Validate anomalies in ${ticker} price history and sentiment.`,
          decision: `Flag unusual patterns to ensure reliable inference.`,
          effect: `Confidence in AI conclusions improved.`,
        };
      case 'Inference':
        // Combine all previous nodes to make final reasoning
        const summary = prevNodes.map((n) => `${n.title}: ${n.effect}`).join(' | ');
        const recommendation = Math.random() > 0.5 ? 'Buy' : 'Sell';
        const reasoning = `After analyzing price trends, news sentiment, earnings reports, and competitor activity, ${ticker} price is likely influenced as follows: ${summary}. Recommendation: ${recommendation}.`;
        return {
          thought: `Combine all prior analysis to form final conclusion.`,
          decision: `Determine predicted price movement and recommendation.`,
          effect: reasoning,
        };
      default:
        return { thought: '', decision: '', effect: '' };
    }
  };

  const handleAnalyze = () => {
    if (!ticker || !startDate || !endDate) {
      alert('Enter ticker and dates');
      return;
    }

    setNodes([]);
    setEdges([]);
    setQueue([]);
    setRunning(true);

    const steps = [
      'Fetch Price Data',
      'Analyze News',
      'Investigate Earnings',
      'Competitor Analysis',
      'Cross-Validate Data',
      'Inference',
    ];

    setQueue(steps);
  };

  useEffect(() => {
    if (!running || queue.length === 0) return;

    const timer = setTimeout(() => {
      const step = queue[0];
      const output = simulateNodeOutput(step, nodes);

      const newNode = {
        id: nodes.length + 1,
        title: step,
        ...output,
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
        <p className="text-lg">Watch the AI think, decide, and act</
