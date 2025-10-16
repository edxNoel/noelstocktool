'use client';

import { useState } from 'react';

interface AnalysisResult {
  analysis?: string;
  prices?: any[];
  error?: string;
}

export default function Home() {
  const [ticker, setTicker] = useState('AAPL');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-10-01');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!ticker || !startDate || !endDate) {
      alert('Please enter a ticker and select start and end dates');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker,
          start_date: startDate,
          end_date: endDate
        })
      });

      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Failed to fetch analysis' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold my-6">NoelStockBot</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Stock Ticker</label>
          <input
            type="text"
            value={ticker}
            onChange={e => setTicker(e.target.value.toUpperCase())}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleAnalyze}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mt-6">
          {result.error && <p className="text-red-500 font-semibold">{result.error}</p>}
          {result.analysis && (
            <>
              <h2 className="text-xl font-bold mb-2">AI Analysis</h2>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto">{result.analysis}</pre>
            </>
          )}
          {result.prices && result.prices.length > 0 && (
            <>
              <h2 className="text-xl font-bold mt-4 mb-2">Price Data</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-2 py-1">Date</th>
                      <th className="border px-2 py-1">Open</th>
                      <th className="border px-2 py-1">High</th>
                      <th className="border px-2 py-1">Low</th>
                      <th className="border px-2 py-1">Close</th>
                      <th className="border px-2 py-1">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.prices.map((p, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">{p.date}</td>
                        <td className="border px-2 py-1">{p.open}</td>
                        <td className="border px-2 py-1">{p.high}</td>
                        <td className="border px-2 py-1">{p.low}</td>
                        <td className="border px-2 py-1">{p.close}</td>
                        <td className="border px-2 py-1">{p.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      <footer className="mt-6 text-xs text-gray-500">
        Deploy to Vercel: Set <code>OPENAI_API_KEY</code> in Project Settings → Environment Variables
      </footer>
    </div>
  );
}
