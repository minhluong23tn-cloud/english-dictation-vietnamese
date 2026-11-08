import { useState } from "react"
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react"
import type { Deck } from "@/types/vocabulary"

type DeckReviewProps = {
  deck: Deck
  showExtras: boolean
  onBack: () => void
}

export default function DeckReview({ deck, showExtras, onBack }: DeckReviewProps) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const total = deck.cards.length

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-teal-300"
      >
        <ChevronLeft size={16} /> Các bảng flashcard
      </button>
      <h2 className="text-lg font-semibold text-white">{deck.name}</h2>
      <span className="text-sm text-slate-400">
        {total === 0 ? "0 thẻ" : `${Math.min(index, total - 1) + 1} / ${total}`}
      </span>
    </div>
  )

  if (total === 0) {
    return (
      <div className="flex flex-col gap-8">
        {header}
        <p className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
          Bảng này chưa có thẻ nào. Hãy bấm Sửa để thêm từ từ sổ tay.
        </p>
      </div>
    )
  }

  const current = deck.cards[Math.min(index, total - 1)]

  const go = (delta: number) => {
    setIndex((prev) => Math.min(Math.max(prev + delta, 0), total - 1))
    setFlipped(false)
  }

  return (
    <div className="flex flex-col gap-8">
      {header}

      <div className="mx-auto w-full max-w-xl [perspective:1200px]">
        <button
          type="button"
          onClick={() => setFlipped((value) => !value)}
          aria-label={flipped ? "Lật về mặt trước" : "Lật thẻ"}
          className={`relative min-h-[320px] w-full text-left transition-transform duration-500 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl shadow-black/30 [backface-visibility:hidden]">
            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-teal-300">
              {current.type}
            </span>
            <span className="mt-6 text-4xl font-semibold tracking-tight text-white">{current.word}</span>
            {current.phonetic && <span className="mt-3 text-slate-400">{current.phonetic}</span>}
            <span className="mt-8 text-sm text-slate-500">Nhấn để lật</span>
          </div>

          <div className="absolute inset-0 flex flex-col justify-center overflow-y-auto rounded-2xl border border-teal-400/30 bg-slate-900 p-8 shadow-xl shadow-black/30 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-xl font-medium text-slate-100">{current.meaning}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{current.detail}</p>
            {showExtras && (
              <>
                <p className="mt-5 border-l-2 border-teal-400/60 pl-4 text-sm italic leading-relaxed text-slate-300">
                  {current.example}
                </p>
                {current.collocations.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {current.collocations.map((collocation) => (
                      <li
                        key={collocation}
                        className="rounded-full border border-slate-700 px-2.5 py-0.5 text-xs text-slate-200"
                      >
                        {collocation}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </button>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Thẻ trước"
          className="rounded-xl border border-slate-700 p-3 text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => setFlipped((value) => !value)}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-teal-300 active:scale-95"
        >
          <RotateCw size={16} /> Lật thẻ
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={index >= total - 1}
          aria-label="Thẻ tiếp theo"
          className="rounded-xl border border-slate-700 p-3 text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
