import { cn } from "@/web/lib/utils";
import type { Chapter, Juz } from "@quranjs/api";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { uniqBy } from "lodash";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import partToFirstPage from "@/web/data/part-to-first-page-id.json";
import { usePageReaderContext } from "@/web/hooks/use-page-reader-context";
import { MenuIconWrapper } from "@/web/components/shared";
import { buttonVariants } from "@/web/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/web/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/web/components/ui/tabs";
import { READER_PAGES_COUNT } from "@/web/shared/constants";

const generateNavItems = ({
	parts,
	chapters,
}: { parts: Juz[]; chapters: Chapter[] }) => {
	const uniqueParts = uniqBy(parts, "juzNumber");

	return [
		{
			id: "chapter",
			title: "Chapter",
			children: chapters.map((chapter) => ({
				id: chapter.id,
				title: chapter.nameSimple,
				href: `/${chapter.pages[0]}`,
			})),
		},
		{
			id: "part",
			title: "Juz",
			children: uniqueParts.map((part) => {
				const partNumber =
					part.juzNumber.toString() as keyof typeof partToFirstPage;
				const firstPageOfPart = partToFirstPage[partNumber];

				return {
					id: part.id,
					title: `Juz ${part.juzNumber.toString()}`, //TODO: add start surah name and hizb + maybe ayah
					href: `/${firstPageOfPart}`,
				};
			}),
		},
		{
			id: "page",
			title: "Page",
			children: Array.from({ length: READER_PAGES_COUNT }, (_, i) => ({
				id: i + 1,
				title: `Page ${i + 1}`,
				href: `/${i + 1}`,
			})),
		},
	];
};

export const ReaderNavigationMenu = () => {
	const { parts, chapters } = usePageReaderContext();
	const pathname = usePathname();

	const navItems = generateNavItems({
		parts,
		chapters,
	});

	return (
		<Sheet>
			<SheetTrigger>
				{/* TODO: can't use Shadcn tooltip as it nests a button inside the sheet trigger button */}
				{/* <WithTooltip content={<p>Open reader menu</p>}> */}
				<MenuIconWrapper>
					<BookOpen />
				</MenuIconWrapper>
				{/* </WithTooltip> */}
			</SheetTrigger>
			{/* TODO: place this to the left on larger screens  */}
			<SheetContent
				side="bottom"
				className="overflow-auto grid place-content-center"
			>
				<SheetHeader>
					<VisuallyHidden.Root>
						<SheetTitle>Reader menu</SheetTitle>
						<SheetDescription>
							Navigate to anywhere in the Quran from here.
						</SheetDescription>
					</VisuallyHidden.Root>
				</SheetHeader>
				<Tabs defaultValue="chapter" className="">
					<TabsList>
						{navItems.map((item) => (
							<TabsTrigger key={item.id} value={item.id}>
								{item.title}
							</TabsTrigger>
						))}
					</TabsList>
					{navItems.map((item) => (
						<TabsContent key={item.id} value={item.id}>
							<nav className="h-[200px] overflow-auto grid place-items-center">
								{item.children.map((child) => (
									<Link
										key={child.id}
										href={child.href}
										className={cn(
											buttonVariants({ variant: "ghost" }),
											"group relative flex h-12 justify-start",
											pathname === child.href &&
												"bg-muted font-bold hover:bg-muted",
										)}
									>
										{child.title}
									</Link>
								))}
							</nav>
						</TabsContent>
					))}
				</Tabs>
			</SheetContent>
		</Sheet>
	);
};
