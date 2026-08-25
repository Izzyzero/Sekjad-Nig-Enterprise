import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export function StatCard({ label, value, changePct, icon: Icon }) {
  const isPositive = typeof changePct === 'number' && changePct >= 0
  const hasChange = typeof changePct === 'number'

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="border-[#E67E22]/25 bg-[#E67E22]/10 text-[#E67E22] flex size-10 items-center justify-center rounded-xl border">
          <Icon size={18} strokeWidth={1.75} />
        </span>
        {hasChange && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(changePct)}%
          </span>
        )}
      </div>
      <p className="text-[#111827] font-display text-2xl font-semibold">{value}</p>
      <p className="text-[#6B7280] mt-1 text-sm">{label}</p>
    </div>
  )
}

export default StatCard