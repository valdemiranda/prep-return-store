import { getStoreContent } from "@lib/data/store-content"

const titles = {
  termsOfUse: "Terms of Use",
  privacy: "Privacy",
  returnPolicy: "Return Policy",
  aboutUs: "About Us",
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
    <main className="content-container py-16">
      <article className="prose prose-neutral mx-auto max-w-3xl prose-headings:font-display prose-a:text-primary">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <h1>{titles[pageKey]}</h1>
        )}
      </article>
    </main>
  )
}
