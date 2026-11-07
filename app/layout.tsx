import type { Metadata } from 'next';
import './globals.css';
import {CurrencyProvider} from '@/components/storefront/currency';
export const metadata: Metadata = {
  title: { default: 'DARICY DANIELS — The Heart of Luxury', template: '%s | DARICY DANIELS' },
  description: 'The world of Daricy Daniels. Contemporary femininity, sculptural silhouettes, and an expressive luxury point of view.',
  metadataBase: new URL('https://daricy-daniels-studio.nmhwc-7205.chatgpt.site'),
  robots: { index: false, follow: false },
  openGraph: { title: 'DARICY DANIELS — The Heart of Luxury', images: ['/assets/campaign-concept.webp'], type: 'website' },
  icons: { icon: '/assets/daricy-daniels-logo-clean.png' },
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet"/></head><body><CurrencyProvider>{children}</CurrencyProvider></body></html>;
}
