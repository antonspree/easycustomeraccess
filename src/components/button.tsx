import Link from "next/link"
import { cn } from "@/lib/cn"

const base =
  "inline-flex items-center justify-center rounded-[16px] font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(21,21,21,0.04)] [corner-shape:superellipse(2)]"

export const buttonClass = cn(
  base,
  "h-[38px] bg-[var(--button-dark)] px-[14px] text-[16px] text-white hover:bg-[var(--button-dark-hover)]",
)

export const quietClass = cn(
  base,
  "h-[30px] bg-[var(--fill-04)] px-[10px] text-[14px] text-[var(--text-64)] hover:bg-[rgba(21,21,21,0.07)]",
)

export function Button({
  className,
  quiet = false,
  ...props
}: React.ComponentProps<"button"> & { quiet?: boolean }) {
  return <button className={cn(quiet ? quietClass : buttonClass, className)} {...props} />
}

export function ButtonLink({
  href,
  children,
  quiet = false,
}: {
  href: string
  children: React.ReactNode
  quiet?: boolean
}) {
  return (
    <Link href={href} className={quiet ? quietClass : buttonClass}>
      {children}
    </Link>
  )
}
