import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AURELLE | Modern Indian Ethnic & Western Wear',
  description: 'Wear your mood. Own your style. Discover modern feminine Indian ethnic and western wear, luxury dresses, kurtis, co-ords, and sarees.',
  openGraph: {
    title: 'AURELLE | Modern Indian Ethnic & Western Wear',
    description: 'Wear your mood. Own your style. Premium feminine ethnic & western wear.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AURELLE | Modern Indian Ethnic & Western Wear',
    description: 'Wear your mood. Own your style.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased selection:bg-[#7B1E45] selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
