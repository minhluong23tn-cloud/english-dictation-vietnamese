import { Check, Lock, Plus, Volume2 } from "lucide-react"
import type { Entry, OnlineEntry } from "@/types/vocabulary"
import { toNotebookEntry } from "@/lib/dictionaryApi"

type MultiMeaningCardProps = {
  entry: OnlineEntry
  isSaved: boolean
  canSave: boolean
  showExtras: boolean
  onSave: (entry: Entry) => void
  onUpgrade: () => void
}

export default function MultiMeaningCard({ entry, isSaved, canSave, showExtras, onSave, onUpgrade }: MultiMeaningCardProps) {
  const notebookEntry = toNotebookEntry(entry)

  const playAudio = () => {
    if (!entry.audioUrl) return
    new Audio(entry.audioUrl).play().catch(() => undefined)
  }

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/20 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-semibold tracking-tight text-white">{entry.word}</h2>
            {entry.audioUrl && (
              <button
                type="button"
                onClick={playAudio}
                aria-label="Nghe phát âm"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/30 transition hover:bg-teal-400/20 active:scale-95"
              >
                <Volume2 size={16} />
              </button>
            )}
          </div>
          {entry.phonetic && <p className="mt-1 text-sm text-slate-400">{entry.phonetic}</p>}
          {entry.meaningVi && <p className="mt-4 text-xl text-slate-100">{entry.meaningVi}</p>}
        </div>

        {isSaved ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-400/10 px-3 py-2 text-sm font-medium text-teal-300 ring-1 ring-teal-400/30">
            <Check size={16} /> Đã lưu
          </span>
        ) : (
          <button
            type="button"
            onClick={() => (canSave ? onSave(notebookEntry) : onUpgrade())}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-400 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-teal-300 active:scale-95"
          >
            {canSave ? <Plus size={16} /> : <Lock size={16} />}
            {canSave ? "Lưu vào sổ tay" : "Lưu (cần nâng cấp)"}
          </button>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {entry.meanings.map((meaning) => (
          <section key={meaning.partOfSpeech} className="border-t border-slate-800 pt-6">
            <span className="inline-block rounded-md bg-slate-800 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-teal-300">
              {meaning.partOfSpeech}
            </span>
            <ol className="mt-4 flex flex-col gap-5">
              {meaning.definitions.map((item, index) => (
                <li key={item.definition} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-100">{item.definitionVi ?? item.definition}</p>
                    <p className="mt-1 leading-relaxed text-slate-400">{item.definition}</p>
                    {showExtras && item.example && (
                      <blockquote className="mt-3 border-l-2 border-teal-400/60 pl-4 italic leading-relaxed text-slate-300">
                        {item.example}
                      </blockquote>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      {!showExtras && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed border-slate-700 p-4">
          <p className="text-sm text-slate-400">Câu ví dụ minh họa có ở gói Nâng cao.</p>
          <button
            type="button"
            onClick={onUpgrade}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-teal-400/60 hover:text-teal-300"
          >
            Xem gói
          </button>
        </div>
      )}

      <p className="mt-8 text-xs text-slate-500">
        Định nghĩa tiếng Anh từ dictionaryapi.dev. Bản dịch tiếng Việt là bản dịch máy nên có thể chưa hoàn toàn chính xác.
      </p>
    </article>
  )
}
