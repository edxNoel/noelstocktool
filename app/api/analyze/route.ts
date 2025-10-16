import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper: fetch daily CSV from Stooq (no API key). Example: https://stooq.com/q/d/l/?s=aapl.us&i=d
async function fetchPriceCSV(symbol, start, end) {
  try {
    const sym = symbol.toLowerCase().includes('.') ? symbol : (symbol + '.us');
    const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(sym)}&d1=${start.replace(/-/g,'')}&d2=${end.replace(/-/g,'')}&i=d`;
    const res = await axios.get(url);
    return res.data; // CSV text
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticker, startDate, endDate } = body;
    if (!ticker || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Fetch price CSV (best-effort, may be null if stooq blocks)
    const csv = await fetchPriceCSV(ticker, startDate, endDate);

    // Build prompt for the autonomous investigator
    const prompt = `
You are an autonomous financial investigator. Use the inputs below.
Ticker: ${ticker}
Date range: ${startDate} to ${endDate}

If available, here is the historical price CSV (Date,Open,High,Low,Close,Volume):
${csv ? csv.slice(0, 8000) : '[no CSV data available]'}

Tasks (decide autonomously what to check and report on):
- Decide which external sources to investigate (news, SEC/filings, earnings, social media) and why.
- Suggest hypotheses and tests (e.g., abnormal volume, price shocks, earnings surprises).
- Describe parallel investigation threads you would spawn and how you'd cross-check information.
- Provide a prioritized list of leads and next actions.
- Produce a concise conclusion stating whether further investigation is required.

Return the result as plain text, with headings.
`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 1500
    });

    const result = completion.choices?.[0]?.message?.content || null;
    return NextResponse.json({ result });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
