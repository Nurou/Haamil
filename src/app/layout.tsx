import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Haamil',
  description: 'Haamil is a Quran memorization app.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
