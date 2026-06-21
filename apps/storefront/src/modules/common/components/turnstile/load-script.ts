/**
 * Carrega o script do Cloudflare Turnstile uma única vez (singleton a nível de
 * módulo). Usado pelo componente <Turnstile />; só é invocado quando há
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY configurado, então em dev sem captcha o
 * script externo nunca é carregado.
 */
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js"

let loadPromise: Promise<void> | null = null

export function loadTurnstileScript(): Promise<void> {
  if (loadPromise) {
    return loadPromise
  }

  loadPromise = new Promise<void>((resolve) => {
    const w = window as unknown as {
      turnstile?: { render: (...args: unknown[]) => unknown }
    }

    if (w.turnstile) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => {
      // Permite retentativa em uma próxima montagem do widget.
      loadPromise = null
      resolve()
    }
    document.head.appendChild(script)
  })

  return loadPromise
}
