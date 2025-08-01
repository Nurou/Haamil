import { ReactQueryClientProvider } from "@/web/components/query-provider";
import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "Haamil",
  description: "Haamil is a Quran memorization app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body>
          <div id="root" className="bg-gray-50">
            {children}
          </div>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
