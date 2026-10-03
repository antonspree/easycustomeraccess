export function Frame({
  children,
  wash,
}: {
  children: React.ReactNode
  wash?: string
}) {
  return (
    <div className="relative min-h-svh">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[180px]"
        style={{ background: wash ?? "var(--wash)" }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export function Column({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[820px] px-4 ${className}`}>{children}</div>
}

export const washes = {
  lavender:
    "linear-gradient(180deg, rgba(176, 164, 230, 0.12) 0%, rgba(210, 200, 235, 0.08) 50%, rgba(248, 248, 248, 0) 100%)",
  mint:
    "linear-gradient(180deg, rgba(170, 214, 196, 0.12) 0%, rgba(190, 225, 200, 0.08) 50%, rgba(248, 248, 248, 0) 100%)",
  cream:
    "linear-gradient(180deg, rgba(228, 210, 176, 0.12) 0%, rgba(236, 224, 196, 0.08) 50%, rgba(248, 248, 248, 0) 100%)",
}
