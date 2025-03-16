"use client";
import dynamic from "next/dynamic";
import type { PageReaderContextType } from "../../../hooks/use-page-reader-context";

const PageReader = dynamic(() => import("./page-reader"), { ssr: false }); // disabling server-side rendering results in a SPA

/* 
* This has to live in a separate file from the entry (page.tsx)
* because dynamic import requires a client component, hence the use-client directive.
* Might be wrong though... 
*/
export default function PageRendererSpa(pageRenderData: PageReaderContextType) {
	return <PageReader {...pageRenderData} />;
}
