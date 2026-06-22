"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { Send } from "lucide-react"
import { Input } from "@modules/common/components/ui/input"
import { Button } from "@modules/common/components/ui/button"
import { Container } from "@modules/common/components/ui/container"
import Turnstile, {
  isTurnstileConfigured,
} from "@modules/common/components/turnstile"
import { submitSupportRequest } from "@lib/data/support"

export default function SupportForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [captchaToken, setCaptchaToken] = useState("")
  const [captchaKey, setCaptchaKey] = useState(0)
  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const captchaReady = !isTurnstileConfigured || Boolean(captchaToken)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isTurnstileConfigured && !captchaToken) {
      return
    }

    setStatus("loading")
    setErrorMessage(null)

    try {
      const response = await submitSupportRequest({
        name,
        email,
        subject,
        message,
        captchaToken,
      })

      if (response.success) {
        setStatus("success")
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
        setCaptchaToken("")
        setCaptchaKey((prev) => prev + 1)
      } else {
        setStatus("error")
        setErrorMessage("Failed to send your support message. Please try again.")
      }
    } catch (err) {
      setStatus("error")
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again later."
      )
    }
  }

  return (
    <Container className="p-8 flex flex-col gap-6 bg-white border border-outline-variant">
      <div>
        <h2 className="text-headline-md text-on-surface font-headline font-bold">
          Send a Message
        </h2>
        <p className="text-body-sm text-on-surface-variant mt-2">
          Tell us what you need and we will respond to you as soon as possible.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {status === "success" && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-body-sm rounded-[4px]">
            Thank you! Your support message has been sent successfully.
          </div>
        )}
        {status === "error" && errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-300 text-rose-800 text-body-sm rounded-[4px]">
            {errorMessage}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            disabled={status === "loading"}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={status === "loading"}
          />
        </div>
        <Input
          label="Subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="How can we help you?"
          required
          disabled={status === "loading"}
        />
        <div className="flex flex-col gap-1">
          <label className="text-body-sm font-bold text-on-surface">Message</label>
          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue or question in detail..."
            required
            disabled={status === "loading"}
            className="flex min-h-[140px] w-full rounded-sm border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y"
          />
        </div>
        {isTurnstileConfigured && (
          <div className="mt-2">
            <Turnstile key={captchaKey} onVerify={setCaptchaToken} />
          </div>
        )}
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2 flex items-center justify-center gap-2"
          isLoading={status === "loading"}
          disabled={!captchaReady}
        >
          <span>Send Message</span>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Container>
  )
}
