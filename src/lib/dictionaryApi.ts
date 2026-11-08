import type { DictionaryMeaning, Entry, OnlineEntry } from "@/types/vocabulary"

const DICTIONARY_ENDPOINT = "https://api.dictionaryapi.dev/api/v2/entries/en/"
const TRANSLATE_ENDPOINT = "https://api.mymemory.translated.net/get"
const REQUEST_TIMEOUT_MS = 8000
const MAX_DEFINITIONS_PER_MEANING = 3
const MAX_TRANSLATED_DEFINITIONS = 6

type ApiDefinition = { definition?: unknown; example?: unknown }
type ApiMeaning = { partOfSpeech?: unknown; definitions?: unknown }
type ApiPhonetic = { text?: unknown; audio?: unknown }
type ApiEntry = { word?: unknown; phonetic?: unknown; phonetics?: unknown; meanings?: unknown }

const translationCache = new Map<string, string>()

function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer))
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

async function translateToVietnamese(text: string): Promise<string | null> {
  const cached = translationCache.get(text)
  if (cached !== undefined) return cached

  try {
    const response = await fetchWithTimeout(`${TRANSLATE_ENDPOINT}?q=${encodeURIComponent(text)}&langpair=en|vi`)
    if (!response.ok) return null
    const data: unknown = await response.json()
    const translated = asString((data as { responseData?: { translatedText?: unknown } })?.responseData?.translatedText)
    if (!translated || translated.toUpperCase().includes("MYMEMORY")) return null
    translationCache.set(text, translated)
    return translated
  } catch {
    return null
  }
}

function toMeanings(rawMeanings: unknown): DictionaryMeaning[] {
  if (!Array.isArray(rawMeanings)) return []

  return rawMeanings
    .map((raw: ApiMeaning) => {
      const rawDefinitions = Array.isArray(raw?.definitions) ? (raw.definitions as ApiDefinition[]) : []
      const definitions = rawDefinitions
        .flatMap((item) => {
          const definition = asString(item?.definition)
          return definition ? [{ definition, example: asString(item.example), definitionVi: null }] : []
        })
        .slice(0, MAX_DEFINITIONS_PER_MEANING)
      return { partOfSpeech: asString(raw?.partOfSpeech) ?? "", definitions }
    })
    .filter((meaning) => meaning.definitions.length > 0)
}

function findAudioUrl(rawPhonetics: unknown): string | null {
  if (!Array.isArray(rawPhonetics)) return null
  const withAudio = (rawPhonetics as ApiPhonetic[]).map((item) => asString(item?.audio)).find(Boolean)
  if (!withAudio) return null
  return withAudio.startsWith("//") ? `https:${withAudio}` : withAudio
}

function findPhonetic(first: ApiEntry): string | null {
  const direct = asString(first.phonetic)
  if (direct) return direct
  if (!Array.isArray(first.phonetics)) return null
  return (first.phonetics as ApiPhonetic[]).map((item) => asString(item?.text)).find(Boolean) ?? null
}

async function fetchEntry(word: string): Promise<OnlineEntry | null> {
  const response = await fetchWithTimeout(`${DICTIONARY_ENDPOINT}${encodeURIComponent(word)}`)
  if (!response.ok) return null

  const data: unknown = await response.json()
  if (!Array.isArray(data) || data.length === 0) return null

  const first = data[0] as ApiEntry
  const meanings = toMeanings(first.meanings)
  if (meanings.length === 0) return null

  return {
    word: asString(first.word) ?? word,
    phonetic: findPhonetic(first),
    audioUrl: findAudioUrl(first.phonetics),
    meaningVi: null,
    meanings,
  }
}

export async function lookupOnline(word: string): Promise<OnlineEntry | null> {
  let entry: OnlineEntry | null
  try {
    entry = await fetchEntry(word)
  } catch {
    return null
  }
  if (!entry) return null

  const definitions = entry.meanings.flatMap((meaning) => meaning.definitions).slice(0, MAX_TRANSLATED_DEFINITIONS)
  const [meaningVi, ...definitionsVi] = await Promise.all([
    translateToVietnamese(entry.word),
    ...definitions.map((item) => translateToVietnamese(item.definition)),
  ])

  definitions.forEach((item, index) => {
    item.definitionVi = definitionsVi[index] ?? null
  })

  return { ...entry, meaningVi }
}

export function toNotebookEntry(entry: OnlineEntry): Entry {
  const firstMeaning = entry.meanings[0]
  const firstDefinition = firstMeaning.definitions[0]
  return {
    word: entry.word,
    meaning: entry.meaningVi ?? firstDefinition.definitionVi ?? firstDefinition.definition,
    detail: firstDefinition.definition,
    type: firstMeaning.partOfSpeech,
    example: firstDefinition.example ?? "",
    collocations: [],
    phonetic: entry.phonetic ?? undefined,
  }
}
