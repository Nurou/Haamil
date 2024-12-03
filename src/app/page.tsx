import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Haamil - Quran Memorization",
	description: "Start memorizing Quran with Haamil",
};

export default function HomePage() {
	redirect("/page/1");
}
