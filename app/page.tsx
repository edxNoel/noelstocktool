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
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    []
  );

  const addNode = (label: string) => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      type: 'default',
      data: { label },
      position: { x: nodes.length * 250, y: 200 }, // Left-to-right layout
    };
    setNodes((nds) => [...nds, newNode]);

    // Connect to previous node
    if (nodes.length > 0) {
      const prevId = nodes[nodes.length - 1].id;
      setEdges((eds) => [
        ...eds,
        { id: `e${prevId}-${nodes.length + 1}`, source: prevId, target: newNode.id, animated: true },
      ]);
    }
  };

  const handleAnalyze = async () => {
    if (!ticker || !startDate || !endDate) return alert('Enter ticker and dates');

    setLoading(true);
    setNodes([]);
    setEdges([]);

    try {
      // Simulate AI reasoning steps left-to-right
      addNode(`Fetch ${ticker} Price Data`);
      addNode('Sentiment Analysis: News Article');
      addNode('Agent Decision: Investigate Earnings');
      addNode('Inference: Conclusion from Data');

      // You can dynamically add more nodes here using API responses
    } catch (err) {
      console.error(err);
      addNode('Error fetching AI data');
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

      {/* Controls */}
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

      {/* React Flow full-screen canvas */}
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
