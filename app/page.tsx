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
  NodeChange,
  EdgeChange,
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
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    []
  );

  const addNode = (label: string, id?: string) => {
    const newNode: Node = {
      id: id || (nodes.length + 1).toString(),
      type: 'default',
      data: { label },
      position: { x: nodes.length * 250, y: 100 }, // left-to-right layout
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleAnalyze = async () => {
    if (!ticker || !startDate || !endDate) return alert('Enter ticker and dates');

    setLoading(true);
    setNodes([]);
    setEdges([]);

    try {
      // Step 1: Fetch price
      addNode(`Fetch ${ticker} Price Data`, '1');

      // Step 2: Simulate AI reasoning steps
      addNode('Sentiment Analysis: News Article', '2');
      addNode('Agent Decision: Investigate Earnings', '3');
      addNode('Inference: Conclusion from Data', '4');

      // Connect nodes left-to-right
      setEdges([
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
        { id: 'e3-4', source: '3', target: '4', animated: true },
      ]);

      // Here you can replace with real AI API calls to dynamically add nodes
    } catch (err) {
      console.error(err);
      addNode('Error fetching AI data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500">
      <header className="bg-black text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">NoelStockBot</h1>
          <p className="text-sm">Watch the AI think in real-time</p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg mb-6">
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-white">Stock Ticker</label>
            <input
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-white">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-white">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <button
            onClick={handleAnalyze}
            className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        <div className="w-full h-[600px] bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg">
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
      </main>
    </div>
  );
}
