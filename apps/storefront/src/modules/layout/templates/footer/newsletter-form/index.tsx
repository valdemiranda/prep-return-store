"use client"

import React, { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { subscribeToNewsletter } from "@lib/data/newsletter"
import Turnstile, {
  isTurnstileConfigured,
} from "@modules/common/components/turnstile"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [captchaToken, setCaptchaToken] = useState("")
  // O widget do Turnstile só é montado quando o visitante interage com o
  // campo de email. Assim evitamos disparar um desafio (e o re-challenge a
  // cada ~5 min enquanto a aba fica aberta) em todo pageview do rodapé.
  const [captchaMounted, setCaptchaMounted] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  // Quando o captcha está habilitado, exige o token antes de habilitar o envio.
  const captchaReady = !isTurnstileConfigured || Boolean(captchaToken)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !captchaReady) return

    setStatus("loading")
    setMessage("")

    try {
      const res = await subscribeToNewsletter(email, captchaToken)
      if (res.success) {
        setStatus("success")
        setMessage("Thank you for subscribing to our newsletter!")
        setEmail("")
      } else {
        setStatus("error")
        setMessage("Subscription failed. Please try again.")
      }
    } catch (err) {
      setStatus("error")
      setMessage(
        err instanceof Error
          ? err.message
          : "Failed to subscribe to the newsletter."
      )
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <form onSubmit={handleSubmit} className="flex">
        <input
          className="bg-surface-container border border-r-0 border-outline-variant rounded-l-base w-full px-4 py-2 text-xs focus:ring-1 focus:ring-primary text-on-surface focus:outline-none"
          placeholder="Your email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setCaptchaMounted(true)}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading" || !captchaReady}
          className="bg-primary hover:bg-primary-container text-white px-4 rounded-r-base transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Subscribe"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
      {isTurnstileConfigured && captchaMounted && (
        <Turnstile onVerify={setCaptchaToken} appearance="interaction-only" />
      )}
      {status === "success" && (
        <p className="text-xs text-green-600 font-medium leading-none" role="status">
          {message}
        </p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-500 font-medium leading-none" role="alert">
          {message}
        </p>
      )}
    </div>
  )
}
