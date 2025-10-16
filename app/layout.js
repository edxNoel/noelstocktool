import './globals.css';

export const metadata = {
  title: 'NoelStockBot',
  description: 'Watch the AI think in real-time',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500">
        <header className="bg-black text-white py-4 px-6 flex justify-between items-center shadow-md">
          <h1 className="text-2xl font-bold">NoelStockBot</h1>
          <p className="text-sm">Watch the AI think in real-time</p>
        </header>
        <main className="h-[calc(100vh-64px)] w-full">{children}</main>
      </body>
    </html>
  );
}
