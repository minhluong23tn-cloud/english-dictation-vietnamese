import { Check, Crown } from "lucide-react"
import ActivationCodeForm from "@/components/ActivationCodeForm"
import { PAID_PLANS, type PaidPlanId, type PlanId } from "@/lib/plans"

type PricingSectionProps = {
  plan: PlanId
  onActivate: (plan: PaidPlanId) => void
}

const focusActivationCode = () => {
  document.getElementById("activation-code")?.scrollIntoView({ behavior: "smooth", block: "center" })
  document.querySelector<HTMLInputElement>("#activation-code input")?.focus({ preventScroll: true })
}

export default function PricingSection({ plan, onActivate }: PricingSectionProps) {
  return (
    <section id="pricing" className="border-t border-slate-800 bg-slate-900/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-teal-300">Nâng cấp</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Chọn gói học phù hợp với bạn</h2>
          <p className="mt-3 leading-relaxed text-slate-400">
            Mỗi gói mở thêm tính năng và số bảng flashcard. Gói cao hơn bao gồm mọi quyền lợi của gói thấp hơn.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PAID_PLANS.map((item) => {
            const isCurrent = plan === item.id
            const isFeatured = item.id === "standard"
            return (
              <article
                key={item.id}
                className={`relative flex flex-col rounded-2xl border bg-slate-900/60 p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 sm:p-8 ${
                  isFeatured ? "border-teal-400/60 ring-1 ring-teal-400/30" : "border-slate-800"
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-teal-400 px-3 py-0.5 text-xs font-medium text-slate-950">
                    Phổ biến
                  </span>
                )}
                <h3 className="text-lg font-medium text-slate-200">{item.name}</h3>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-white">{item.price.toLocaleString("vi-VN")}</span>
                  <span className="text-sm text-slate-400">đ</span>
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                      <Check size={16} className="mt-0.5 shrink-0 text-teal-300" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <span className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 font-medium text-teal-300">
                    <Crown size={16} /> Đang sử dụng
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={focusActivationCode}
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-teal-400/40 px-4 py-3 font-medium text-teal-300 transition hover:bg-teal-400/10 active:scale-[0.98]"
                  >
                    Nhập mã kích hoạt
                  </button>
                )}
              </article>
            )
          })}
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-amber-300/20 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 shadow-2xl shadow-black/40">
          <div className="grid gap-10 p-6 sm:p-10 md:grid-cols-2 md:items-center">
            <div className="text-center md:text-left">
              <p className="text-sm font-medium uppercase tracking-wider text-amber-300">Ủng hộ tác giả</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white">Buy me a drink!</h3>
              <p className="mt-4 leading-relaxed text-slate-300">
                Nếu ứng dụng giúp bạn học thêm được nhiều từ mới, hãy mời tác giả một ly nước. Mỗi đóng góp giúp mình có thêm thời gian phát triển các tính năng mới.
              </p>
              <ol className="mt-6 flex flex-col gap-3 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-300 text-xs font-semibold text-slate-950">1</span>
                  Mở ứng dụng ngân hàng và quét mã QR
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-300 text-xs font-semibold text-slate-950">2</span>
                  Nhập đúng số tiền của gói bạn muốn ủng hộ
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-300 text-xs font-semibold text-slate-950">3</span>
                  Quay lại và nhập mã kích hoạt ở phía dưới
                </li>
              </ol>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="rounded-2xl bg-white p-4 shadow-xl shadow-amber-900/20 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <img src="/payment-qr.png" alt="Mã QR thanh toán" className="block w-52 sm:w-60" />
              </div>
              <p className="text-center text-sm text-slate-400">
                Cảm ơn bạn đã ủng hộ. Mỗi lượt ủng hộ đều rất có ý nghĩa với mình.
              </p>
            </div>
          </div>
          <p className="border-t border-slate-800 bg-slate-950/40 px-6 py-4 text-center text-xs text-slate-500 sm:px-10">
            Mã kích hoạt được cung cấp cho bạn sau khi ủng hộ.
          </p>
        </div>

        <ActivationCodeForm plan={plan} onActivate={onActivate} />
      </div>
    </section>
  )
}
