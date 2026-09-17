import './globals.css';

export const metadata = {
  title: 'Vedic Future',
  description: 'Unlock Your Destiny Through Vedic Wisdom',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
