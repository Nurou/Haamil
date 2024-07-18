import { useEffect, useState } from 'react';
import './fonts.css';
import './index.css';

export interface VersesByPage {
  id: number;
  verse_number: number;
  verse_key: string;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: any;
  text_uthmani: string;
  chapter_id: number;
  text_imlaei_simple: string;
  page_number: number;
  juz_number: number;
  words: Word[];
}

export interface Word {
  id: number;
  position: number;
  audio_url?: string;
  char_type_name: string;
  verse_key: string;
  verse_id: number;
  location: string;
  text_uthmani: string;
  code_v2: string;
  page_number: number;
  line_number: number;
  text: string;
  translation: Translation;
  transliteration: Transliteration;
}

export interface Translation {
  text: string;
  language_name: string;
}

export interface Transliteration {
  text?: string;
  language_name: string;
}

type KeyFunction<T> = (item: T) => string | number;

function groupBy<T>(array: T[], key: KeyFunction<T>): Record<string | number, T[]> {
  return array.reduce((result, currentItem) => {
    const groupKey = key(currentItem);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentItem);
    return result;
  }, {} as Record<string | number, T[]>);
}

function renderLines(verses: VersesByPage[]) {
  const lines = groupBy(
    verses.flatMap((v) => v.words),
    (word) => word.line_number
  );

  return Object.keys(lines).map((lineNumber) => {
    const words = lines[lineNumber];
    return (
      <p
        dir='rtl'
        key={lineNumber}
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {words.map((word) => {
          return (
            <span key={word.code_v2} style={{}}>
              {word.code_v2}
            </span>
          );
        })}
      </p>
    );
  });
}

function App() {
  const [data, setData] = useState<VersesByPage[] | null>(null);

  useEffect(() => {
    fetch(
      'https://api.quran.com/api/v4/verses/by_page/1?words=true&per_page=all&fields=text_uthmani%2Cchapter_id%2Chizb_number%2Ctext_imlaei_simple&reciter=7&word_translation_language=en&word_fields=verse_key%2Cverse_id%2Cpage_number%2Clocation%2Ctext_uthmani%2Ccode_v2%2Cqpc_uthmani_hafs&mushaf=1&filter_page_words=true&from=1%3A1&to=1%3A7'
    )
      .then((response) => response.json())
      .then((json) => setData(json.verses));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'page1',
        fontSize: '2rem',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        margin: 0,
      }}
    >
      {renderLines(data)}
    </div>
  );
}

export default App;
