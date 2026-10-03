export function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-[6px] block text-[14px] font-medium leading-[1.5] text-[var(--text-64)]">
      {children}
    </label>
  )
}

export const inputClass =
  "h-[38px] w-full rounded-[8px] border border-[var(--border)] bg-white px-[14px] text-[16px] leading-[1.5] text-[var(--text)] outline-none placeholder:text-[var(--text-32)] focus:border-[rgba(21,21,21,0.24)] focus:shadow-[0_0_0_3px_rgba(21,21,21,0.04)]"

export function TextInput(props: React.ComponentProps<"input">) {
  return <input {...props} className={inputClass} />
}

export function FormError({ children }: { children?: string }) {
  if (!children) return null
  return <p className="text-[14px] leading-[1.5] text-[var(--text)]">{children}</p>
}
