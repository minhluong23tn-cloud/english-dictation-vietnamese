import { useState } from "react"
import { Check, X } from "lucide-react"
import type { Deck, Entry } from "@/types/vocabulary"

type DeckEditorProps = {
  deck: Deck
  notebook: Entry[]
  onSave: (cards: Entry[]) => void
  onClose: () => void
}

export default function DeckEditor({ deck, notebook, onSave, onClose }: DeckEditorProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(deck.cards.map((card) => card.word)))

  const candidates = [...notebook, ...deck.cards.filter((card) => !notebook.some((item) => item.word === card.word))]

  const toggle = (word: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(word)) next.delete(word)
      else next.add(word)
      return next
    })
  }

  const handleSave = () => onSave(candidates.filter((card) => selected.has(card.word)))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="deck-editor-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-6">
          <div>
            <h2 id="deck-editor-title" className="text-lg font-semibold text-white">
              Sửa bảng "{deck.name}"
            </h2>
            <p className="mt-1 text-sm text-slate-400">Chọn các từ từ sổ tay để đưa vào bảng này.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {candidates.length === 0 ? (
            <p className="text-sm leading-relaxed text-slate-400">
              Sổ tay đang trống. Hãy tra từ và lưu vào sổ tay trước.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {candidates.map((entry) => {
                const isOn = selected.has(entry.word)
                return (
                  <li key={entry.word}>
                    <button
                      type="button"
                      aria-pressed={isOn}
                      onClick={() => toggle(entry.word)}
                      className={`flex w-full items-center justify-between gap-4 rounded-xl border p-3 text-left transition ${
                        isOn
                          ? "border-teal-400/60 bg-teal-400/10"
                          : "border-slate-800 bg-slate-900 hover:border-slate-600"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block font-medium text-slate-100">{entry.word}</span>
                        <span className="block truncate text-sm text-slate-400">{entry.meaning}</span>
                      </span>
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                          isOn ? "border-teal-400 bg-teal-400 text-slate-950" : "border-slate-600 text-transparent"
                        }`}
                      >
                        <Check size={14} />
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-800 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-teal-400 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-teal-300 active:scale-95"
          >
            Lưu ({selected.size} từ)
          </button>
        </div>
      </div>
    </div>
  )
}
