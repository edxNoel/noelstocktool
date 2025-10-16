import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { ticker, start, end } = await req.json();

    if (!ticker || !start || !end) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const prompt = `You are an autonomous stock research AI. Investigate ${ticker} between ${start} and ${end}. 
    List each investigation step in order and provide a short label for each. Output a JSON array like:
    [{"label":"Fetch TSLA Price Data"},{"label":"Sentiment Analysis: News Article"},{"label":"Agent Decision: Investigate Earnings"}]`;

    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const text = response.choices[0].message?.content || '';
    let steps;

    try {
      steps = JSON.parse(text);
    } catch {
      // fallback if JSON parsing fails
      steps = text.split('\n').map((line: string) => ({ label: line }));
    }

    return NextResponse.json({ steps });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}
