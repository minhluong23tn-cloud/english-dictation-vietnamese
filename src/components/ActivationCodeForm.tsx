import { useState, type FormEvent } from "react"
import { KeyRound } from "lucide-react"
import { findPlanByCode, getPlanName, hasPlan, type PaidPlanId, type PlanId } from "@/lib/plans"

type ActivationCodeFormProps = {
  plan: PlanId
  onActivate: (plan: PaidPlanId) => void
}

type Feedback = { tone: "success" | "error"; message: string }

export default function ActivationCodeForm({ plan, onActivate }: ActivationCodeFormProps) {
  const [code, setCode] = useState("")
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const target = findPlanByCode(code)

    if (!target) {
      setFeedback({ tone: "error", message: "Mã không hợp lệ. Vui lòng kiểm tra lại và thử lần nữa." })
      return
    }

    if (hasPlan(plan, target)) {
      setFeedback({ tone: "success", message: `Bạn đã có đầy đủ quyền lợi của gói ${getPlanName(target)}.` })
      return
    }

    onActivate(target)
    setCode("")
    setFeedback({ tone: "success", message: `Đã kích hoạt gói ${getPlanName(target)} thành công.` })
  }

  return (
    <div id="activation-code" className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10">
      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/30">
          <KeyRound size={20} />
        </span>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">Điền mã để nhận gói</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Nhập mã kích hoạt bạn nhận được sau khi ủng hộ để mở khóa gói tương ứng.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={code}
            onChange={(event) => {
              setCode(event.target.value)
              setFeedback(null)
            }}
            placeholder="Ví dụ: VIP20K"
            autoComplete="off"
            spellCheck={false}
            aria-label="Mã kích hoạt"
            className="w-full flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono uppercase tracking-wider text-slate-100 placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-500 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30"
          />
          <button
            type="submit"
            disabled={code.trim() === ""}
            className="rounded-xl bg-teal-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-teal-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
          >
            Kích hoạt
          </button>
        </form>

        {feedback && (
          <p
            role="status"
            className={`mt-4 text-sm ${feedback.tone === "success" ? "text-teal-300" : "text-rose-300"}`}
          >
            {feedback.message}
          </p>
        )}
      </div>
    </div>
  )
}
