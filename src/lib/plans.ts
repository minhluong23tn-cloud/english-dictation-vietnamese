export type PlanId = "free" | "basic" | "standard" | "pro"
export type PaidPlanId = Exclude<PlanId, "free">

export type PaidPlan = {
  id: PaidPlanId
  name: string
  price: number
  deckLimit: number
  features: string[]
}

export const PAID_PLANS: PaidPlan[] = [
  {
    id: "basic",
    name: "Cơ bản",
    price: 10000,
    deckLimit: 25,
    features: ["25 bảng flashcard", "Lưu từ vào sổ tay", "Nghĩa và giải thích chi tiết"],
  },
  {
    id: "standard",
    name: "Nâng cao",
    price: 20000,
    deckLimit: 50,
    features: ["50 bảng flashcard", "Cụm từ đi kèm khi tra từ", "Ngữ cảnh và câu ví dụ"],
  },
  {
    id: "pro",
    name: "Trọn bộ",
    price: 50000,
    deckLimit: Number.POSITIVE_INFINITY,
    features: ["Flashcard không giới hạn", "Tất cả tính năng", "Luyện tập ngẫu nhiên bằng lệnh __vocabulary"],
  },
]

const ACTIVATION_CODES: Record<PaidPlanId, string> = {
  basic: "VIP10K",
  standard: "VIP20K",
  pro: "PREMIUM50K",
}

export function findPlanByCode(code: string): PaidPlanId | null {
  const normalized = code.trim().toUpperCase()
  const match = (Object.keys(ACTIVATION_CODES) as PaidPlanId[]).find((id) => ACTIVATION_CODES[id] === normalized)
  return match ?? null
}

const PLAN_ORDER: PlanId[] = ["free", "basic", "standard", "pro"]

export function hasPlan(current: PlanId, required: PaidPlanId): boolean {
  return PLAN_ORDER.indexOf(current) >= PLAN_ORDER.indexOf(required)
}

export function getDeckLimit(plan: PlanId): number {
  return PAID_PLANS.find((item) => item.id === plan)?.deckLimit ?? 0
}

export function getPlanName(plan: PlanId): string | null {
  return PAID_PLANS.find((item) => item.id === plan)?.name ?? null
}
