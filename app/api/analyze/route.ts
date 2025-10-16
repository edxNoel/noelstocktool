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
You are an autonomous stock research AI. Investigate ${ticker} from ${start} to ${end}.
Perform an independent investigation — do NOT use a predefined workflow.
For each step, return a JSON object with:
{
  "label": "Step title",
  "description": "What the AI did or decided at this step"
}
Return a JSON array of these objects. Example:
[
  {"label": "Fetch Price Data", "description": "Fetched daily historical prices from Stooq"},
  {"label": "Sentiment Analysis", "description": "Analyzed news and social media sentiment"}
]
The agent should decide which sources to investigate, which leads to follow, when to spawn sub-investigations, and how to cross-validate information.
`;

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
      // fallback if parsing fails: each line becomes a label only
      steps = text.split('\n').map((line: string) => ({ label: line, description: '' }));
    }

    return NextResponse.json({ steps });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}
