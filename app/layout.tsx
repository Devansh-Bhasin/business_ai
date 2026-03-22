import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ClearReply',
  description: 'Write polished business messages for awkward, high-stakes moments in seconds.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
