import '@/app/ui/global.css';
import {inter} from '@/app/ui/fonts'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Vyayam',
    default: 'Vyayam - Invoices Made Easy',
  },
  description: 'Vyayam is a simple invoicing tool for small businesses and freelancers.'
};

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}  antialised`}>{children}</body>
    </html>
  );
}
