'use client';

import { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

export default function Home() {
  const [ticker, setTicker] = useState('AAPL');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-10-01');
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    []
  );

  const addNode = (label: string, index: number) => {
    const newNode: Node = {
      id: (index + 1).toString(),
      type: 'default',
      data: { label },
      position: { x: index * 300, y: 200 },
    };

    setNodes((nds) => [...nds, newNode]);

    if (index > 0) {
      setEdges((eds) => [
        ...eds,
        {
          id: `e${index}-${index + 1}`,
          source: index.toString(),
          target: (index + 1).toString(),
          animated: true,
        },
      ]);
    }
  };

  const handleAnalyze = async () => {
    if (!ticker || !startDate || !endDate)
      return alert('Enter ticker and dates');

    setLoading(true);
    setNodes([]);
    setEdges([]);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, start: startDate, end: endDate }),
      });

      const data = await res.json();
      const steps = data.steps || [];

      for (let i = 0; i < steps.length; i++) {
        const step = typeof steps[i] === 'string' ? steps[i] : steps[i].label;
        addNode(step, i);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    } catch (err) {
      console.error(err);
      addNode('Error fetching AI data', 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex flex-col">
      <header className="bg-black text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">NoelStockBot</h1>
        <p className="text-sm">Watch the AI think in real-time</p>
      </header>

      <div className="flex items-center gap-4 p-4 bg-black bg-opacity-40">
        <input
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          className="px-2 py-1 rounded border border-gray-300"
          placeholder="Ticker"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-2 py-1 rounded border border-gray-300"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-2 py-1 rounded border border-gray-300"
        />
        <button
          onClick={handleAnalyze}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
