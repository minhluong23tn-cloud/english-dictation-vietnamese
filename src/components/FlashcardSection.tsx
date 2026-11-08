import { useState, type FormEvent } from "react"
import { Layers, Lock, Pencil, Plus, Trash2 } from "lucide-react"
import DeckEditor from "@/components/DeckEditor"
import DeckReview from "@/components/DeckReview"
import type { Deck, Entry } from "@/types/vocabulary"

type FlashcardSectionProps = {
  decks: Deck[]
  notebook: Entry[]
  deckLimit: number
  canUse: boolean
  showExtras: boolean
  onCreateDeck: (name: string) => void
  onDeleteDeck: (id: string) => void
  onUpdateDeck: (id: string, cards: Entry[]) => void
  onUpgrade: () => void
}

export default function FlashcardSection({
  decks,
  notebook,
  deckLimit,
  canUse,
  showExtras,
  onCreateDeck,
  onDeleteDeck,
  onUpdateDeck,
  onUpgrade,
}: FlashcardSectionProps) {
  const [name, setName] = useState("")
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)

  const reviewDeck = decks.find((deck) => deck.id === reviewId)
  const editDeck = decks.find((deck) => deck.id === editId)
  const atLimit = decks.length >= deckLimit
  const limitLabel = Number.isFinite(deckLimit) ? String(deckLimit) : "không giới hạn"

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || atLimit) return
    onCreateDeck(trimmed)
    setName("")
  }

  const handleDelete = (deck: Deck) => {
    if (!window.confirm(`Xóa bảng "${deck.name}"?`)) return
    onDeleteDeck(deck.id)
  }

  return (
    <section id="flashcards" className="border-t border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {!canUse ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-slate-800 p-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
              <Lock size={20} />
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">Flashcard ôn tập</h2>
            <p className="mt-2 text-slate-400">Tạo bảng flashcard từ sổ tay của bạn khi nâng cấp gói.</p>
            <button
              type="button"
              onClick={onUpgrade}
              className="mt-6 rounded-xl bg-teal-400 px-5 py-2.5 font-medium text-slate-950 transition hover:bg-teal-300 active:scale-95"
            >
              Xem các gói
            </button>
          </div>
        ) : reviewDeck ? (
          <DeckReview deck={reviewDeck} showExtras={showExtras} onBack={() => setReviewId(null)} />
        ) : (
          <div className="flex flex-col gap-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-teal-300">Ôn tập</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Flashcard</h2>
                <p className="mt-2 text-slate-400">
                  Đã dùng {decks.length} / {limitLabel} bảng
                </p>
              </div>

              {atLimit ? (
                <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                  <p className="text-sm text-slate-400">Đã đạt giới hạn bảng của gói hiện tại.</p>
                  <button
                    type="button"
                    onClick={onUpgrade}
                    className="whitespace-nowrap text-sm font-medium text-teal-300 hover:text-teal-200"
                  >
                    Nâng cấp
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreate} className="flex w-full gap-2 sm:w-auto">
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Tên bảng, ví dụ: Academic Writing"
                    aria-label="Tên bảng flashcard"
                    className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 transition focus:border-teal-400/60 focus:outline-none focus:ring-4 focus:ring-teal-400/10 sm:w-72"
                  />
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-400 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-teal-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={16} /> Tạo bảng
                  </button>
                </form>
              )}
            </div>

            {decks.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
                Chưa có bảng nào. Tạo bảng đầu tiên để bắt đầu ôn tập.
              </p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {decks.map((deck) => (
                  <li
                    key={deck.id}
                    className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/30">
                        <Layers size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-medium text-white">{deck.name}</h3>
                        <p className="mt-0.5 text-sm text-slate-400">{deck.cards.length} thẻ</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setReviewId(deck.id)}
                        disabled={deck.cards.length === 0}
                        className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Ôn tập
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditId(deck.id)}
                        aria-label={`Sửa bảng ${deck.name}`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(deck)}
                        aria-label={`Xóa bảng ${deck.name}`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {editDeck && (
        <DeckEditor
          key={editDeck.id}
          deck={editDeck}
          notebook={notebook}
          onSave={(cards) => {
            onUpdateDeck(editDeck.id, cards)
            setEditId(null)
          }}
          onClose={() => setEditId(null)}
        />
      )}
    </section>
  )
}
