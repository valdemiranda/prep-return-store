import { redirect } from "next/navigation"

type TrackOrderRedirectProps = {
  searchParams: Promise<{ orderid?: string; email?: string }>
}

export default async function TrackOrderRedirect(
  props: TrackOrderRedirectProps,
) {
  const searchParams = await props.searchParams
  const params = new URLSearchParams()

  if (searchParams.orderid) {
    params.set("orderid", searchParams.orderid)
  }

  if (searchParams.email) {
    params.set("email", searchParams.email)
  }

  const countryCode = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
  const queryString = params.toString()

  redirect(`/${countryCode}/track-order${queryString ? `?${queryString}` : ""}`)
}
