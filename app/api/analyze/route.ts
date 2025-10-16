// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AnalyzeRequest = {
  ticker: string;
  start: string;
  end: string;
};

export async function POST(req: NextRequest) {
  try {
    const { ticker, start, end } = (await req.json()) as AnalyzeRequest;

    if (!ticker || !start || !end) {
      return NextResponse.json(
        { error: 'Missing ticker, start, or end date' },
        { status: 400 }
      );
    }

    // Prompt AI to reason like an autonomous investigator
    const prompt = `
You are an autonomous AI agent analyzing why the stock ${ticker} changed price between ${start} and ${end}. 
Your task is to:
1. Identify relevant sources (news, earnings, SEC filings, social media).
2. Determine which leads to follow based on findings.
3. Make independent decisions, spawn parallel investigations, cross-validate data.
4. Form hypotheses and test them.
5. Present each step as an object with:
   - label: short description of action
   - description: detailed explanation
Return at least 8-12 steps, ending with an inference/conclusion node explaining why the price increased or decreased.
Format response as JSON: { steps: [ { label: string, description: string }, ... ] }
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message?.content || '';
    let steps: { label: string; description: string }[] = [];

    try {
      // Try parsing JSON returned by GPT
      const json = JSON.parse(raw);
      steps = json.steps || [];
    } catch (e) {
      // If parsing fails, fallback to splitting lines
      steps = raw
        .split('\n')
        .filter((line) => line.trim())
        .map((line, i) => ({
          label: `Step ${i + 1}`,
          description: line.trim(),
        }));
    }

    return NextResponse.json({ steps });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to analyze stock' }, { status: 500 });
  }
}
