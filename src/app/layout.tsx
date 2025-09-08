
import type {Metadata} from 'next';
import './globals.css';
import { Manrope } from 'next/font/google'
import ClientLayout from '@/components/app/client-layout';

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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
