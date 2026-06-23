import { resolveUniqueSlug, toUrlSlug } from "../slug"

describe("slug utilities", () => {
  it("normalizes accents and special characters into URL-safe slugs", () => {
    expect(toUrlSlug("Câmeras & Áudio / TV 4K!!!", "category")).toBe(
      "cameras-audio-tv-4k"
    )
  })

  it("uses the fallback when no URL-safe characters remain", () => {
    expect(toUrlSlug("!!!", "product")).toBe("product")
  })

  it("uses a preferred suffix before numeric suffixes", async () => {
    const existing = new Set(["playstation-5", "playstation-5-used"])

    await expect(
      resolveUniqueSlug(
        "playstation-5",
        async (slug) => existing.has(slug),
        "Open Box"
      )
    ).resolves.toBe("playstation-5-open-box")
  })

  it("falls back to numeric suffixes when needed", async () => {
    const existing = new Set(["iphone", "iphone-used", "iphone-2"])

    await expect(
      resolveUniqueSlug(
        "iphone",
        async (slug) => existing.has(slug),
        "Used"
      )
    ).resolves.toBe("iphone-3")
  })
})
