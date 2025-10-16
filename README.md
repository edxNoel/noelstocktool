# NoelStockBot

Next.js + TypeScript + Tailwind + OpenAI app (noelstockbot)

Quick start:
1. Unzip and `cd noelstockbot`
2. `npm install`
3. Create `.env.local` with:
   OPENAI_API_KEY=sk-...
4. `npm run dev`
5. Open http://localhost:3000

Notes:
- The app fetches historical daily prices from Stooq (no API key) for basic context (may be rate-limited).
- Set OPENAI_API_KEY in Vercel Environment Variables for production.
