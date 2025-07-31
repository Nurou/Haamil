import "@/web/css/fonts-hafs-v1.css";

import { groupBy } from "lodash";
import { BASE_URL_QDC_CDN } from "@/web/shared/constants";
import { cn, toCamelCase } from "@/web/lib/utils";
import {
  chaptersQueryOptions,
  partsQueryOptions,
  queryClient,
} from "@/web/queries";
import type { Verse } from "@quranjs/api";
import PageReaderSpa from "./page-reader-spa";

enum MushafToQueryParamCode {
  HAFS_V1 = "2",
  HAFS_V2 = "1",
}

async function getParts() {
  const parts = await queryClient.fetchQuery(partsQueryOptions());

  return parts;
}

async function getChapters() {
  const chapters = await queryClient.fetchQuery(chaptersQueryOptions());

  return chapters;
}

export function generateStaticParams() {
  // Generate paths for all 604 pages of the Quran
  const pages = Array.from({ length: 604 }, (_, i) => ({
    id: (i + 1).toString(),
  }));

  return pages;
}

async function getVersesByPage(pageNumber: string) {
  try {
    const params = {
      words: "true",
      per_page: "all",
      fields: "text_uthmani,chapter_id,hizb_number,text_imlaei_simple",
      reciter: "7",
      word_translation_language: "en",
      word_fields:
        "line_number,verse_key,verse_id,page_number,location,text_uthmani,code_v2,code_v1,qpc_uthmani_hafs",
      mushaf: MushafToQueryParamCode.HAFS_V1,
      filter_page_words: "true",
    };

    const queryString = new URLSearchParams(params).toString();

    const response = await fetch(
      `${BASE_URL_QDC_CDN}/verses/by_page/${pageNumber}?${queryString}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch page ${pageNumber}: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error(`Expected JSON response but got ${contentType}`);
    }

    const versesByPage = await response.json();

    // camel casing for parity with official API that returns camel case
    return toCamelCase(versesByPage.verses);
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error);
    return [];
  }
}

function groupVersesByPage(verses: Verse[]) {
  return groupBy(verses, (verse) => verse.chapterId);
}

async function getPageRenderData(id: string) {
  const [versesByChapter, parts, chapters] = await Promise.all([
    getVersesByPage(id).then(groupVersesByPage),
    getParts(),
    getChapters(),
  ]);

  return {
    versesByChapter,
    parts,
    chapters,
  };
}

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const { id: pageId } = await props.params;
  const pageRenderData = await getPageRenderData(pageId);

  return <PageReaderSpa {...pageRenderData} pageId={pageId} />;
}
