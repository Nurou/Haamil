import { json, Links, Meta, Outlet, Scripts, ScrollRestoration, useParams } from '@remix-run/react';
import './index.css';

export const loader = async ({ params }: { params: { pageId?: string } }) => {
  if (!params.pageId) {
    return null;
  }
  const pageFontCssUrl: typeof import('*?url') = await import(`./font-css/page${params.pageId}.css?url`);
  return json(
    { pageFontCssUrl: pageFontCssUrl?.default },
    {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
};

export const meta = ({
  params,
  data,
}: {
  params: { pageId?: string };
  data?: {
    pageFontCssUrl?: string;
  };
}) => {
  const title = params.pageId ? `Haamil - chapter ${params.pageId}` : 'Haamil';

  return [
    {
      title,
    },
    data?.pageFontCssUrl && {
      tagName: 'link',
      rel: 'stylesheet',
      href: data.pageFontCssUrl,
    },
  ].filter(Boolean);
};

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
