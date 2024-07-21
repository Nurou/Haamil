import { json, Links, Meta, Outlet, Scripts, ScrollRestoration, useParams } from '@remix-run/react';
import './index.css';

export async function loader({ params }: { params: { pageId: string } }) {
  const pageFontCssUrl: typeof import('*?url') = await import(`./font-css/page${params.pageId}.css?url`);
  return json({ pageFontCssUrl: pageFontCssUrl.default });
}

export function meta({
  params,
  data,
}: {
  params: { pageId: string };
  data: {
    pageFontCssUrl: string;
  };
}) {
    return [
    {
      title: `Haamil - chapter ${params.pageId}`,
    },
    {
      tagName: 'link',
      rel: 'stylesheet',
      href: data.pageFontCssUrl,
    },
  ];
}

/* "Root Route". It's the first component in the UI that renders, so it typically contains the global layout for the page. */
export function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
