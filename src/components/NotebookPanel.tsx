import { BookMarked, Trash2 } from "lucide-react"
import type { Entry } from "@/types/vocabulary"

type NotebookPanelProps = {
  entries: Entry[]
  onSelect: (entry: Entry) => void
  onRemove: (word: string) => void
}

export default function NotebookPanel({ entries, onSelect, onRemove }: NotebookPanelProps) {
  return (
    <aside className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-white">
          <BookMarked size={18} className="text-teal-300" /> Sổ tay từ vựng
        </h2>
        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">{entries.length}</span>
      </div>

      {entries.length === 0 ? (
        <p className="mt-6 text-sm leading-relaxed text-slate-400">
          Chưa có từ nào. Lưu những từ bạn tra cứu để ôn tập sau.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {entries.map((entry) => (
            <li
              key={entry.word}
              className="group flex items-start justify-between gap-3 rounded-xl border border-transparent px-3 py-3 transition hover:border-slate-700 hover:bg-slate-800/60"
            >
              <button type="button" onClick={() => onSelect(entry)} className="min-w-0 flex-1 text-left">
                <span className="block font-medium text-slate-100 group-hover:text-teal-300">{entry.word}</span>
                <span className="mt-0.5 block truncate text-sm text-slate-400">{entry.meaning}</span>
              </button>
              <button
                type="button"
                onClick={() => onRemove(entry.word)}
                aria-label={`Xóa ${entry.word} khỏi sổ tay`}
                className="rounded-md p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
