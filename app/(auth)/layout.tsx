import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import '../globals.css';
import { dark } from '@clerk/themes';

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
        <body suppressHydrationWarning={true} className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
