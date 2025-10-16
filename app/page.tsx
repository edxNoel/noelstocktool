"use client";
import { useState } from "react";
import axios from "axios";
import tickers from "../data/tickers.json";

export default function Home() {
  const [ticker, setTicker] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");
    if (!ticker || !startDate || !endDate) {
      setError("Please enter ticker and date range.");
      return;
    }
    if (!tickers.includes(ticker.toUpperCase())) {
      setError("Ticker not in built-in list. You can still try any US ticker with .US suffix when fetching prices.");
      // continue anyway
    }
    setLoading(true);
    setReport("");
    try {
      const res = await axios.post('/api/analyze', { ticker: ticker.toUpperCase(), startDate, endDate });
      setReport(res.data.result || JSON.stringify(res.data));
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-start justify-center p-8">
      <div className="w-full max-w-3xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">NoelStockBot — Autonomous Investigator</h1>
          <p className="text-sm text-gray-600">Enter a ticker and date range. Uses OpenAI (set on Vercel) and public price data from Stooq (no API key).</p>
        </header>

        <section className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="border p-2 rounded" placeholder="Ticker (e.g., AAPL)" value={ticker} onChange={(e)=>setTicker(e.target.value)} />
            <input className="border p-2 rounded" type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
            <input className="border p-2 rounded" type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={handleAnalyze} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {loading ? 'Analyzing...' : 'Run Investigation'}
            </button>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </section>

        {report && (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Investigation Report</h2>
            <pre className="whitespace-pre-wrap text-sm">{report}</pre>
          </section>
        )}

        <footer className="mt-6 text-xs text-gray-500">
          <p>
  Deploy to Vercel: set <code>OPENAI_API_KEY</code> in Project Settings &gt; Environment Variables.
          </p>
        </footer>
      </div>
    </main>
  );
}
