
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Manrope } from 'next/font/google'
import AppBottomNav from '@/components/app/bottom-nav';

export const metadata: Metadata = {
  title: 'SkillBridge',
  description: 'Empowering youth with market-ready skills and connecting them to opportunities.',
};

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="font-body antialiased h-full bg-secondary" suppressHydrationWarning>
        <div className="min-h-screen flex flex-col items-center">
            <div className="w-full max-w-sm flex-1 flex flex-col bg-background shadow-2xl relative">
                <main className="flex-1 overflow-y-auto pb-20">
                  {children}
                </main>
                <AppBottomNav />
                <Toaster />
            </div>
        </div>
      </body>
    </html>
  );
}
