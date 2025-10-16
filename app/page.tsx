'use client';

import { useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface Step {
  label: string;
  description: string;
}

export default function Home() {
  const [ticker, setTicker] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const handleAnalyze = async () => {
    if (!ticker || !startDate || !endDate) return;

    const res = await fetch('https://noelstocktool.onrender.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker, start: startDate, end: endDate }),
    });
    const data = await res.json();

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    data.steps.forEach((step: Step, index: number) => {
      newNodes.push({
        id: `node-${index}`,
        position: { x: index * 300, y: 200 }, // horizontal layout
        data: { label: (
          <div className="p-3 rounded shadow-lg bg-white bg-opacity-90 max-w-xs">
            <strong>{step.label}</strong>
            <p className="text-sm mt-1">{step.description}</p>
          </div>
        )},
        type: 'default',
      });

      if (index > 0) {
        newEdges.push({
          id: `edge-${index - 1}-${index}`,
          source: `node-${index - 1}`,
          target: `node-${index}`,
          animated: true,
          style: { stroke: 'black' },
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-4 flex gap-4 bg-black/30">
        <input
          type="text"
          placeholder="Ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          className="p-2 rounded"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 rounded"
        />
        <button
          onClick={handleAnalyze}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Analyze
        </button>
      </div>

      <div className="flex-1">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap />
          <Controls />
          <Background gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
}
