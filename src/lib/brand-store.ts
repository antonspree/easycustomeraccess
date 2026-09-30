const kinds = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
} as const

export async function uploadBrandFile(
  file: File,
  agencyId: string,
  kind: "logo" | "banner",
): Promise<{ url: string | null; error?: string }> {
  if (!(file instanceof File) || file.size === 0) return { url: null }
  if (file.size > 2_000_000) {
    return { url: null, error: "Die Datei darf höchstens 2 MB groß sein." }
  }
  const ext = kinds[file.type as keyof typeof kinds]
  if (!ext) {
    return { url: null, error: "Logo und Banner brauchen PNG, JPEG, WebP oder GIF." }
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { url: null, error: "Der Bildspeicher ist in dieser Umgebung nicht verbunden." }
  }
  const { put } = await import("@vercel/blob")
  const blob = await put(`agencies/${agencyId}/${kind}.${ext}`, file, {
    access: "public",
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })
  return { url: blob.url }
}
