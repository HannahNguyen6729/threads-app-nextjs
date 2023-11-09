import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { dark } from '@clerk/themes';
import Topbar from '../../components/shared/Topbar';
import LeftSidebar from '../../components/shared/LeftSidebar';
import RightSidebar from '../../components/shared/RightSidebar';
import Bottombar from '../../components/shared/Bottombar';

import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Threads',
  description: 'A Next.js 13 Threads App',
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
          <Topbar />

          <main className="flex flex-row">
            <LeftSidebar />

            <section className="main-container">
              <div>{children}</div>
            </section>

            <RightSidebar />
          </main>

          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
