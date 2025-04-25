import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {Providers} from './providers';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Serenity - Your Wellness Companion',
  description: 'Track your relaxation, meditation, and wellness journey',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

