export type Entry = {
  word: string
  meaning: string
  detail: string
  type: string
  example: string
  collocations: string[]
  phonetic?: string
}

export type Deck = {
  id: string
  name: string
  cards: Entry[]
}

export type DictionaryDefinition = {
  definition: string
  definitionVi: string | null
  example: string | null
}

export type DictionaryMeaning = {
  partOfSpeech: string
  definitions: DictionaryDefinition[]
}

export type OnlineEntry = {
  word: string
  phonetic: string | null
  audioUrl: string | null
  meaningVi: string | null
  meanings: DictionaryMeaning[]
}
