import './globals.css';

export const metadata = {
  title: 'NoelStockBot',
  description: 'Autonomous Stock Analysis with AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 font-sans">
        <header className="bg-blue-600 text-white py-4 shadow-md">
          <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">NoelStockBot</h1>
            <p className="text-sm">Autonomous Stock Analysis with GPT-4</p>
          </div>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>

        <footer className="bg-gray-100 text-gray-500 py-4 mt-10 text-center text-xs">
          Deploy to Vercel: Set <code>OPENAI_API_KEY</code> in Project Settings → Environment Variables
        </footer>
      </body>
    </html>
  );
}
