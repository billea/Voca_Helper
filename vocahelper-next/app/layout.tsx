import './globals.css';
import type { Metadata } from 'next';
import { TopNav } from '@/components/TopNav';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'VocaHelper',
  description: 'Smart, kid-friendly writing & vocabulary practice',
  icons: {
    icon: '/favicon.svg'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen antialiased bg-white text-slate-900">
        <ToastProvider>
          <a href="#main" className="skip-link">Skip to content</a>
          <TopNav />
          <main id="main" className="container mx-auto max-w-6xl px-4 py-6">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
