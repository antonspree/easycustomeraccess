import { Column, Frame } from "@/components/frame"

export default function NotFound() {
  return (
    <Frame>
      <Column className="pt-16">
        <p className="text-[16px] leading-[1.5]">Diese Seite gibt es nicht.</p>
      </Column>
    </Frame>
  )
}
