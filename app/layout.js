import './globals.css';

export const metadata = {
  title: 'NoelStockBot',
  description: 'Watch AI reasoning in real-time',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen w-screen m-0 p-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500">
        {children}
      </body>
    </html>
  );
}
