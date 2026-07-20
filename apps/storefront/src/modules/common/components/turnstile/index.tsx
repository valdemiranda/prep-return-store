"use client"

import { useEffect, useRef } from "react"
import { loadTurnstileScript } from "./load-script"

type TurnstileAppearance = "always" | "execute" | "interaction-only"

type TurnstileRenderOptions = {
  sitekey: string
  appearance?: TurnstileAppearance
  callback?: (token: string) => void
  "expired-callback"?: () => void
  "error-callback"?: () => void
}

type TurnstileApi = {
  render: (el: HTMLElement, opts: TurnstileRenderOptions) => string
  reset: (id?: string) => void
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

type Props = {
  /** Notificado quando o token muda (resolvido, expirado ou com erro). */
  onVerify?: (token: string) => void
  className?: string
  appearance?: TurnstileAppearance
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

/** True quando o captcha está habilitado (site key configurada). */
export const isTurnstileConfigured = Boolean(SITE_KEY)

/**
 * Widget do Cloudflare Turnstile. O próprio widget injeta um input hidden
 * "cf-turnstile-response" no container — assim o token viaja no formData
 * (server actions) e na query (forms GET) sem lógica extra. Não adicionar um
 * segundo input com esse nome: o parâmetro duplicado vira array na query e
 * quebra a validação. Quando NEXT_PUBLIC_TURNSTILE_SITE_KEY não está
 * configurado, renderiza null (graceful degradation) e o backend também
 * desabilita a verificação.
 */
export default function Turnstile({
  onVerify,
  className,
  appearance = "always",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  // Mantém a callback em ref para não reiniciar o widget a cada render do pai.
  const onVerifyRef = useRef(onVerify)
  onVerifyRef.current = onVerify

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) {
      return
    }

    let cancelled = false

    loadTurnstileScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) {
        return
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        appearance,
        callback: (t: string) => {
          onVerifyRef.current?.(t)
        },
        "expired-callback": () => {
          onVerifyRef.current?.("")
          window.turnstile?.reset(widgetIdRef.current ?? undefined)
        },
        "error-callback": () => {
          onVerifyRef.current?.("")
        },
      })
    })

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [appearance])

  if (!SITE_KEY) {
    return null
  }

  return (
    <div className={className}>
      <div ref={containerRef} />
    </div>
  )
}
