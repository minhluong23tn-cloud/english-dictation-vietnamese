import { Check, Lock, Plus } from "lucide-react"
import type { Entry } from "@/types/vocabulary"

type WordCardProps = {
  entry: Entry
  isSaved: boolean
  canSave: boolean
  showExtras: boolean
  onSave: (entry: Entry) => void
  onUpgrade: () => void
}

export default function WordCard({ entry, isSaved, canSave, showExtras, onSave, onUpgrade }: WordCardProps) {
  const isKnownWord = entry.type !== "unknown"

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/20 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-3xl font-semibold tracking-tight text-white">{entry.word}</h2>
            {entry.phonetic && <span className="text-sm text-slate-400">{entry.phonetic}</span>}
          </div>
          <span className="mt-2 inline-block rounded-md bg-slate-800 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-teal-300">
            {entry.type}
          </span>
        </div>

        {isKnownWord &&
          (isSaved ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-400/10 px-3 py-2 text-sm font-medium text-teal-300 ring-1 ring-teal-400/30">
              <Check size={16} /> Đã lưu
            </span>
          ) : (
            <button
              type="button"
              onClick={() => (canSave ? onSave(entry) : onUpgrade())}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-400 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-teal-300 active:scale-95"
            >
              {canSave ? <Plus size={16} /> : <Lock size={16} />}
              {canSave ? "Lưu vào sổ tay" : "Lưu (cần nâng cấp)"}
            </button>
          ))}
      </div>

      <p className="mt-6 text-xl text-slate-100">{entry.meaning}</p>
      <p className="mt-3 leading-relaxed text-slate-400">{entry.detail}</p>

      {showExtras ? (
        <>
          <blockquote className="mt-6 border-l-2 border-teal-400/60 pl-4 italic leading-relaxed text-slate-300">
            {entry.example}
          </blockquote>

          {entry.collocations.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cụm từ đi kèm</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {entry.collocations.map((collocation) => (
                  <li
                    key={collocation}
                    className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-sm text-slate-200"
                  >
                    {collocation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        isKnownWord && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed border-slate-700 p-4">
            <p className="text-sm text-slate-400">Ngữ cảnh, câu ví dụ và cụm từ đi kèm có ở gói Nâng cao.</p>
            <button
              type="button"
              onClick={onUpgrade}
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-teal-400/60 hover:text-teal-300"
            >
              Xem gói
            </button>
          </div>
        )
      )}
    </article>
  )
}
