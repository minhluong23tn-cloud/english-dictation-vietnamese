import { useEffect, useRef, useState, type FormEvent } from "react"
import { BookOpen, Clock, Crown, Loader2, Search, Sparkles } from "lucide-react"
import FlashcardSection from "@/components/FlashcardSection"
import MultiMeaningCard from "@/components/MultiMeaningCard"
import NotebookPanel from "@/components/NotebookPanel"
import PricingSection from "@/components/PricingSection"
import WordCard from "@/components/WordCard"
import { dictionary } from "@/data/vocabulary"
import { lookupOnline } from "@/lib/dictionaryApi"
import { getDeckLimit, getPlanName, hasPlan, type PaidPlanId, type PlanId } from "@/lib/plans"
import { readStorage, writeStorage } from "@/lib/storage"
import type { Deck, Entry, OnlineEntry } from "@/types/vocabulary"

const HISTORY_LIMIT = 10
const DRILL_DEFAULT_COUNT = 5
const DRILL_COMMAND = "__vocabulary"
const SUGGESTIONS = ["nuance", "mitigate", "resilient", "paradigm"]

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function App() {
  const [query, setQuery] = useState("")
  const [currentWord, setCurrentWord] = useState<Entry | null>(null)
  const [drillResults, setDrillResults] = useState<Entry[]>([])
  const [notebook, setNotebook] = useState<Entry[]>(() => readStorage<Entry[]>("lexi_notebook", []))
  const [history, setHistory] = useState<string[]>(() => readStorage<string[]>("lexi_history", []))
  const [plan, setPlan] = useState<PlanId>(() => readStorage<PlanId>("lexi_plan", "free"))
  const [decks, setDecks] = useState<Deck[]>(() => readStorage<Deck[]>("lexi_decks", []))
  const [onlineEntry, setOnlineEntry] = useState<OnlineEntry | null>(null)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const lookupIdRef = useRef(0)

  useEffect(() => {
    writeStorage("lexi_notebook", notebook)
  }, [notebook])

  useEffect(() => {
    writeStorage("lexi_history", history)
  }, [history])

  useEffect(() => {
    writeStorage("lexi_plan", plan)
  }, [plan])

  useEffect(() => {
    writeStorage("lexi_decks", decks)
  }, [decks])

  const canSave = hasPlan(plan, "basic")
  const canUseFlashcards = hasPlan(plan, "basic")
  const showExtras = hasPlan(plan, "standard")
  const canDrill = hasPlan(plan, "pro")
  const deckLimit = getDeckLimit(plan)
  const planName = getPlanName(plan)

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
  }

  const runSearch = async (raw: string) => {
    const term = raw.trim()
    if (!term) return
    const normalized = term.toLowerCase()
    const requestId = ++lookupIdRef.current

    if (normalized.startsWith(DRILL_COMMAND)) {
      setIsLookingUp(false)
      setOnlineEntry(null)
      if (!canDrill) {
        scrollToPricing()
        return
      }
      const requested = Number.parseInt(normalized.split(/\s+/)[1] ?? "", 10)
      const count = Number.isNaN(requested)
        ? DRILL_DEFAULT_COUNT
        : Math.min(Math.max(requested, 1), dictionary.length)
      setDrillResults(shuffle(dictionary).slice(0, count))
      setCurrentWord(null)
      return
    }

    setHistory((prev) => [term, ...prev.filter((item) => item !== term)].slice(0, HISTORY_LIMIT))
    setDrillResults([])

    const found = dictionary.find((item) => item.word === normalized)
    if (found) {
      setIsLookingUp(false)
      setOnlineEntry(null)
      setCurrentWord(found)
      return
    }

    setCurrentWord(null)
    setIsLookingUp(true)
    const online = await lookupOnline(normalized)
    if (requestId !== lookupIdRef.current) return
    setIsLookingUp(false)

    if (online) {
      setOnlineEntry(online)
      return
    }

    setOnlineEntry(null)
    setCurrentWord({
      word: term,
      meaning: "Chưa tìm thấy nghĩa",
      detail: "Từ vựng này hiện chưa có trong kho dữ liệu cục bộ.",
      type: "unknown",
      example: "No example available.",
      collocations: [],
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    runSearch(query)
  }

  const saveToNotebook = (entry: Entry) => {
    if (!canSave) {
      scrollToPricing()
      return
    }
    if (notebook.some((item) => item.word === entry.word)) return
    setNotebook((prev) => [entry, ...prev])
  }

  const removeFromNotebook = (word: string) => {
    setNotebook((prev) => prev.filter((item) => item.word !== word))
  }

  const createDeck = (name: string) => {
    if (decks.length >= deckLimit) return
    setDecks((prev) => [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name, cards: [] },
      ...prev,
    ])
  }

  const deleteDeck = (id: string) => {
    setDecks((prev) => prev.filter((deck) => deck.id !== id))
  }

  const updateDeckCards = (id: string, cards: Entry[]) => {
    setDecks((prev) => prev.map((deck) => (deck.id === id ? { ...deck, cards } : deck)))
  }

  const selectEntry = (entry: Entry) => {
    lookupIdRef.current += 1
    setIsLookingUp(false)
    setOnlineEntry(null)
    setQuery(entry.word)
    setCurrentWord(entry)
    setDrillResults([])
  }

  const activatePlan = (id: PaidPlanId) => {
    setPlan(id)
  }

  const activeWord = onlineEntry?.word ?? currentWord?.word
  const isCurrentSaved = activeWord !== undefined && notebook.some((item) => item.word === activeWord)

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 selection:bg-teal-400 selection:text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/30">
              <BookOpen size={18} />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              English-Dictation-<span className="text-teal-300">Vietnamese</span>
            </span>
          </div>

          {planName ? (
            <button
              type="button"
              onClick={scrollToPricing}
              className="inline-flex items-center gap-1.5 rounded-full bg-teal-400/10 px-3 py-1.5 text-xs font-medium text-teal-300 ring-1 ring-teal-400/30 transition hover:bg-teal-400/20"
            >
              <Crown size={14} /> Gói {planName}
            </button>
          ) : (
            <button
              type="button"
              onClick={scrollToPricing}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-teal-400/60 hover:text-teal-300"
            >
              <Crown size={14} /> Premium
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_320px]">
        <section className="min-w-0">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-teal-300">Từ điển tra cứu Anh - Việt</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Tra cứu từ vựng với ngữ cảnh thực tế
            </h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-400">
              Nghĩa tiếng Việt, ví dụ và cụm từ đi kèm giúp bạn ghi nhớ từ vựng học thuật lâu hơn.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nhập một từ tiếng Anh..."
                aria-label="Tìm từ vựng"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-11 pr-4 text-slate-100 placeholder:text-slate-500 transition focus:border-teal-400/60 focus:outline-none focus:ring-4 focus:ring-teal-400/10"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-teal-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-teal-300 active:scale-95"
            >
              Tra cứu
            </button>
          </form>

          {history.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock size={14} /> Gần đây
              </span>
              {history.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setQuery(item)
                    runSearch(item)
                  }}
                  className="rounded-full border border-slate-800 px-3 py-1 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white"
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          <div className="mt-8">
            {isLookingUp ? (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-slate-300">
                <Loader2 size={18} className="animate-spin text-teal-300" /> Đang tra cứu...
              </div>
            ) : onlineEntry ? (
              <MultiMeaningCard
                entry={onlineEntry}
                isSaved={isCurrentSaved}
                canSave={canSave}
                showExtras={showExtras}
                onSave={saveToNotebook}
                onUpgrade={scrollToPricing}
              />
            ) : currentWord ? (
              <WordCard
                entry={currentWord}
                isSaved={isCurrentSaved}
                canSave={canSave}
                showExtras={showExtras}
                onSave={saveToNotebook}
                onUpgrade={scrollToPricing}
              />
            ) : drillResults.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center">
                <p className="text-slate-300">Nhập một từ để xem nghĩa, ví dụ và cụm từ đi kèm.</p>
                <p className="mt-2 text-sm text-slate-500">
                  {canDrill
                    ? `Gõ "${DRILL_COMMAND} 5" vào ô tìm kiếm để luyện tập ngẫu nhiên.`
                    : "Thử một trong các từ sau:"}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((word) => (
                    <button
                      key={word}
                      type="button"
                      onClick={() => {
                        setQuery(word)
                        runSearch(word)
                      }}
                      className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200 transition hover:bg-slate-700"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {drillResults.length > 0 && (
              <div className="mt-8">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  <Sparkles size={16} className="text-teal-300" /> Bài luyện ngẫu nhiên
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {drillResults.map((entry) => (
                    <li key={entry.word}>
                      <button
                        type="button"
                        onClick={() => selectEntry(entry)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left transition hover:border-teal-400/50 hover:bg-slate-900"
                      >
                        <span className="block font-medium text-white">{entry.word}</span>
                        <span className="mt-1 block text-sm text-slate-400">{entry.meaning}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <NotebookPanel entries={notebook} onSelect={selectEntry} onRemove={removeFromNotebook} />
      </main>

      <FlashcardSection
        decks={decks}
        notebook={notebook}
        deckLimit={deckLimit}
        canUse={canUseFlashcards}
        showExtras={showExtras}
        onCreateDeck={createDeck}
        onDeleteDeck={deleteDeck}
        onUpdateDeck={updateDeckCards}
        onUpgrade={scrollToPricing}
      />

      <PricingSection plan={plan} onActivate={activatePlan} />
    </div>
  )
}
