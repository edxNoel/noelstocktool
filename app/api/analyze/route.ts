import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fetch from 'node-fetch';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper: fetch daily stock CSV from Stooq (free, no API key)
async function fetchPriceCSV(symbol: string, start: string, end: string) {
  const sym = symbol.toLowerCase().includes('.') ? symbol : symbol + '.us';
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(sym)}&d1=${start.replace(/-/g, '')}&d2=${end.replace(/-/g, '')}&i=d`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch price data');
  const text = await res.text();
  if (!text || text.startsWith('No data')) throw new Error('No price data available');
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const { ticker, start, end } = await req.json();
    if (!ticker || !start || !end) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1️⃣ Data validation
    try {
      await fetchPriceCSV(ticker, start, end);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid ticker or date range' }, { status: 400 });
    }

    // 2️⃣ AI investigation
    const prompt = `
You are a stock research AI that autonomously investigates ${ticker} from ${start} to ${end}.
Generate a JSON array of steps where each step has:

{
  "label": "Step title",
  "description": "Short explanation of what the AI did or decided in this step"
}

Include examples of:
- Fetching price data
- Sentiment Analysis of news
- Making decisions like "Agent Decision: Investigate Earnings"
- Spawning sub-investigations
- Cross-validating data
- Combining prior nodes to form an Inference Node

Return only the JSON array.
`;

    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
    });

    const text = response.choices[0].message?.content || '';
    let steps;
    try {
      steps = JSON.parse(text);
    } catch {
      steps = text
        .split('\n')
        .filter((line: string) => line.trim())
        .map((line: string) => ({ label: line, description: '' }));
    }

    return NextResponse.json({ steps });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}
