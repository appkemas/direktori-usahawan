import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KEMAS Directory',
  description: 'Direktori Usahawan KEMAS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <AdminAuthProvider>
            {children}
          </AdminAuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
