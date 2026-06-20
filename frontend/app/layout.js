import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MainLayoutWrapper from '@/components/layout/MainLayoutWrapper';

export const metadata = {
  metadataBase: new URL('https://devspark.com'),
  title: {
    default: 'DevSpark — Software Development Agency',
    template: '%s | DevSpark',
  },
  description: 'DevSpark is a software development agency that crafts exceptional digital experiences. We build modern web and mobile applications that drive growth and delight users.',
  keywords: ['software development', 'web development', 'mobile app development', 'UI/UX design', 'custom software', 'cloud solutions'],
  authors: [{ name: 'DevSpark Team' }],
  creator: 'DevSpark',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://devspark.com',
    siteName: 'DevSpark',
    title: 'DevSpark — Software Development Agency',
    description: 'We craft exceptional digital experiences that transform businesses and delight users.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DevSpark' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevSpark — Software Development Agency',
    description: 'We craft exceptional digital experiences that transform businesses and delight users.',
    images: ['/og-image.png'],
    creator: '@devspark',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ background: '#0d0b09', color: '#f5f0e8' }}>
        <Navbar />
        <MainLayoutWrapper>{children}</MainLayoutWrapper>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1c1916',
              color: '#f5f0e8',
              border: '1px solid #2e2520',
            },
          }}
        />
      </body>
    </html>
  );
}
