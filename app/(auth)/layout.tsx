import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { dark } from '@clerk/themes';

import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Threads app',
  description: 'A Nextjs 13 Threads App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body
          suppressHydrationWarning={true}
          className={`${inter.className} bg-dark-1`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
