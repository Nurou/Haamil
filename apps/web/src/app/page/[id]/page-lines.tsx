import { Separator } from "@/web/components/ui/separator";
import { usePageSwipe } from "@/web/hooks/use-page-swipe";
import { cn } from "@/web/lib/utils";
import type { Verse } from "@quranjs/api";
import { groupBy } from "lodash";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePageReaderContext } from "@/web/hooks/use-page-reader-context";
import { READER_PAGES_COUNT } from "../../../shared/constants";

const CHAPTERS_WITH_NO_BASMALAH = ["1", "9"];
const UNICODE_SURAH = "\uE000";
const BASMALAH_UNICODE = "\ufdfd";

// Helper function for chapter name unicode
function getChapterNameUnicode(chapterId: string) {
	return `${chapterId.padStart(3, "0")}${UNICODE_SURAH}`;
}

function Basmalah() {
	return (
		<p dir="rtl" className="flex justify-center w-full mb-2">
			<span>{BASMALAH_UNICODE}</span>
		</p>
	);
}

function ChapterLines({ verses }: { verses: Verse[] }) {
	const linesToWordsMap = groupBy(
		verses.flatMap((v) => v.words),
		(word) => word?.lineNumber as number,
	);

	return Object.keys(linesToWordsMap).map((lineNumber) => {
		const words = linesToWordsMap[lineNumber];

		return (
			<p
				dir="rtl"
				key={`${lineNumber}-${words.length}`}
				className="flex justify-center w-full"
			>
				{words.map((word) => {
					return (
						<span key={`${word?.id}-${word?.lineNumber}`}>{word?.codeV1}</span>
					);
				})}
			</p>
		);
	});
}

function ChapterContent({
	chapterId,
	pageHasMultipleChapters,
}: {
	chapterId: string;
	pageHasMultipleChapters: boolean;
}) {
	const { versesByChapter } = usePageReaderContext();
	const chapterVerses = versesByChapter[chapterId];
	const hasFirstVerseOfChapter = chapterVerses.some(
		(verse) => verse.verseNumber === 1,
	);
	const displayBasmalah = !CHAPTERS_WITH_NO_BASMALAH.includes(chapterId);
	const chapterNameUnicode = getChapterNameUnicode(chapterId);

	return (
		<div
			key={`${chapterId}-${chapterVerses.length}`}
			className={cn(
				"grid gap-2",
				"text-xl sm:text-2xl md:text-3xl lg:text-4xl",
			)}
		>
			{hasFirstVerseOfChapter ? (
				<div>
					{pageHasMultipleChapters && <Separator className="my-6" />}
					<span
						dir="rtl"
						className="font-[surah-names] block text-center mb-4 bg-slate-100"
					>
						{chapterNameUnicode}
					</span>
					{displayBasmalah && <Basmalah />}
				</div>
			) : null}
			<ChapterLines verses={chapterVerses} />
		</div>
	);
}

type Router = ReturnType<typeof useRouter>;

interface FontInfo {
	name: string;
	url: string;
}

function usePrefetchAdjacentPagesData(pageNumber: number, router: Router) {
	const prevPage = pageNumber - 1;
	const nextPage = pageNumber + 1;

	// Prefetch adjacent pages
	useEffect(() => {
		const shouldPrefetchPrevPage = prevPage > 0;
		const shouldPrefetchNextPage = nextPage <= READER_PAGES_COUNT;

		if (shouldPrefetchPrevPage) {
			router.prefetch(`/page/${prevPage}`);
		}
		if (shouldPrefetchNextPage) {
			router.prefetch(`/page/${nextPage}`);
		}
	}, [prevPage, nextPage, router]);

	// Load fonts for adjacent pages
	useEffect(() => {
		const loadFonts = async () => {
			try {
				const fonts = getFontsToAdd(prevPage, nextPage);
				const fontPromises = fonts.map((font) =>
					new FontFace(font.name, `url(${font.url})`).load(),
				);

				await Promise.all(fontPromises).then((loadedFonts) => {
					for (const font of loadedFonts) {
						document.fonts.add(font);
					}
				});
			} catch (error) {
				console.error("Error loading fonts:", error);
			}
		};

		if (prevPage > 0 && nextPage <= READER_PAGES_COUNT) {
			loadFonts();
		}
	}, [prevPage, nextPage]);
}

function getFontsToAdd(prevPage: number, nextPage: number): FontInfo[] {
	const fonts: FontInfo[] = [];
	const BASE_URL = "/fonts/hafs/v1/woff2";
	for (let i = prevPage; i <= nextPage; i++) {
		fonts.push({ name: `page${i}`, url: `${BASE_URL}/p${i}.woff2` });
	}
	return fonts;
}

export function PageReaderLines() {
	const router = useRouter();
	const params = useParams();
	const pageNumber = Number.parseInt(params.id as string);

	usePrefetchAdjacentPagesData(pageNumber, router);

	const { handlers: swipeableHandlers } = usePageSwipe({
		currentPageNumber: pageNumber,
		onSwiped: (id) => {
			router.push(`/page/${id}`);
		},
	});

	const { versesByChapter } = usePageReaderContext();

	const chapterIds = Object.keys(versesByChapter);
	const pageHasMultipleChapters = chapterIds.length > 1;

	return (
		<div {...swipeableHandlers} className="w-full">
			{chapterIds.map((chapterId) => {
				return (
					<ChapterContent
						key={chapterId}
						chapterId={chapterId}
						pageHasMultipleChapters={pageHasMultipleChapters}
					/>
				);
			})}
		</div>
	);
}
