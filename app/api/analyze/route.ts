// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Helper: fetch daily CSV from Stooq (no API key required)
// Example: https://stooq.com/q/d/l/?s=aapl.us&i=d
async function fetchPriceCSV(symbol: string, start: string, end: string): Promise<string | null> {
  try {
    const sym = symbol.toLowerCase().includes('.') ? symbol : `${symbol}.us`;
    const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(sym)}&d1=${start.replace(/-/g,'')}&d2=${end.replace(/-/g,'')}&i=d`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const text = await res.text();
    return text;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Helper: parse CSV text into structured data
interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function parseCSV(csv: string): PriceData[] {
  const lines = csv.split('\n').filter(Boolean);
  const header = lines.shift();
  if (!header) return [];

  return lines.map(line => {
    const [date, open, high, low, close, volume] = line.split(',');
    return {
      date,
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close),
      volume: parseFloat(volume)
    };
  });
}

// API Route handler
export async function POST(req: NextRequest) {
  try {
    const body: { ticker: string; start_date: string; end_date: string } = await req.json();
    const { ticker, start_date, end_date } = body;

    // Fetch historical CSV
    const csv = await fetchPriceCSV(ticker, start_date, end_date);
    if (!csv) return NextResponse.json({ error: 'Failed to fetch stock data.' }, { status: 500 });

    const prices = parseCSV(csv);

    // Call OpenAI for autonomous analysis
    const gptResponse = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an autonomous stock investigator. Decide which leads to follow, what to investigate, and provide structured insights.'
        },
        {
          role: 'user',
          content: `Analyze the following stock price data and provide insights: ${JSON.stringify(prices)}`
        }
      ]
    });

    const aiText = gptResponse.choices?.[0]?.message?.content || 'No response from AI';

    return NextResponse.json({ analysis: aiText, prices });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error occurred.' }, { status: 500 });
  }
}
