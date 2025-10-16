'use client';

import React, { useState, useEffect } from 'react';
import ReactFlow, { addEdge, MiniMap, Controls, Node, Edge } from 'react-flow-renderer';

interface Step {
  label: string;
  description: string;
}

const steps: Step[] = [
  { label: 'Fetch TSLA Price Data', description: 'Expected inputs: ticker, start date and price, end date and price\nExpected output: Historical price data' },
  { label: 'Sentiment Analysis: News Article', description: 'Analyzing market sentiment for TSLA' },
  { label: 'Agent Decision: Investigate Earnings', description: 'Deciding to check earnings report for unusual patterns' },
  { label: 'Spawn Sub-Investigation', description: 'Starting parallel investigation on product recalls' },
  { label: 'Cross-Validate Data', description: 'Connecting news sentiment and earnings anomalies' },
  { label: 'Inference Node', description: 'Combine prior nodes to form conclusion on price movement' },
];

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count >= steps.length) {
        clearInterval(interval);
        return;
      }
      const step = steps[count];
      const id = (count + 1).toString();

      setNodes((nds) => [
        ...nds,
        {
          id,
          type: 'default',
          data: {
            label: (
              <div className="p-3 rounded shadow bg-white bg-opacity-90 max-w-xs">
                <strong>{step.label}</strong>
                <p className="text-sm mt-1 whitespace-pre-line">{step.description}</p>
              </div>
            ),
          },
          position: { x: 250 * count, y: 50 + Math.random() * 150 },
        },
      ]);

      if (count > 0) {
        setEdges((eds) => addEdge({ id: `e${count}-${count + 1}`, source: count.toString(), target: id, type: 'smoothstep' }, eds));
      }

      count++;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex flex-col">
      <header className="bg-black text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">NoelStockBot</h1>
        <p className="text-sm">Watch the AI think in real-time</p>
      </header>
      <div className="flex-1">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
      <footer className="bg-black text-white py-2 px-6 text-sm text-center">
        Expected inputs: ticker, start date and price, end date and price | Expected output: Create a full stack web app which displays why the price changed (increased or decreased)
      </footer>
    </div>
  );
}
