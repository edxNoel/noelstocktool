import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { ticker, start, end } = await req.json();

    if (!ticker || !start || !end) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const prompt = `
You are a stock research AI that autonomously investigates ${ticker} from ${start} to ${end}.
Generate a JSON array of steps the AI would take, where each step has:

{
  "label": "Step title",
  "description": "Short explanation of what the AI did or decided in this step"
}

Example output:
[
  {"label": "Fetch Price Data", "description": "Fetched daily historical prices from Stooq"},
  {"label": "Analyze News Sentiment", "description": "Checked major news sources and social media for positive or negative sentiment"}
]

Focus only on stock research steps. Do not include unrelated advice, disclaimers, or safety messages.
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
      // fallback if parsing fails
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
