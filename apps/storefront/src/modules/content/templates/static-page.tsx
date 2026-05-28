import { getStoreContent } from "@lib/data/store-content"

const titles = {
  support: "Support",
  termsOfUse: "Terms of Use",
  privacy: "Privacy",
  returnPolicy: "Return Policy",
}

export type StaticPageKey = keyof typeof titles

export default async function StaticPageTemplate({
  pageKey,
}: {
  pageKey: StaticPageKey
}) {
  const content = await getStoreContent()
  const html = content?.staticPages[pageKey] ?? ""

  return (
    <main className="max-w-container-sm mx-auto px-margin-mobile md:px-gutter py-16">
      <article className="prose prose-neutral max-w-none prose-headings:font-display prose-a:text-primary">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <h1>{titles[pageKey]}</h1>
        )}
      </article>
    </main>
  )
}
