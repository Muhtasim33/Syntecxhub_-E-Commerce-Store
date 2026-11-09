import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { CartDrawer } from '@/components/cart/CartDrawer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aurelia & Co. | Fine Jewelry & Luxury Maison',
  description:
    'Ethically sourced emerald jewelry, fine tailored textiles, and bespoke organic home goods crafted with timeless permanence.',
  keywords: ['fine jewelry', 'luxury fashion', 'emerald rings', 'organic fragrances', 'aurelia'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#f3ebd6] text-[#02110c] antialiased selection:bg-[#1a422f] selection:text-[#f3ebd6]">
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
