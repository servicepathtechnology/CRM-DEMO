import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CRM Dashboard',
  description: 'Production-ready CRM lead management system',
};

import { ToastProvider } from '@/components/ui/Toast';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <ToastProvider>
          <DashboardShell>
            {children}
          </DashboardShell>
        </ToastProvider>
      </body>
    </html>
  );
}
