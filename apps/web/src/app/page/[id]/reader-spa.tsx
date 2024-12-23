"use client";
import dynamic from "next/dynamic";
import type { ReaderContextType } from "../../../hooks/use-reader-context";

const Reader = dynamic(() => import("./reader"), { ssr: false }); // disable server-side rendering -> render as SPA

export default function ReaderRenderer(readerContextData: ReaderContextType) {
	return <Reader {...readerContextData} />;
}
