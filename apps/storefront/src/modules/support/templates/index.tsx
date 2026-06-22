import { LifeBuoy } from "lucide-react"
import ContactInfo from "../components/contact-info"
import SupportForm from "../components/support-form"

export default function SupportTemplate() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full border border-outline text-[#a15016] bg-[#fdf8f5] shrink-0 shadow-sm">
            <LifeBuoy className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-headline font-black tracking-tight text-on-surface">
            Customer Support
          </h1>
        </div>
        <p className="text-body-md text-on-surface-variant max-w-3xl leading-relaxed">
          Have questions or need assistance? Our support team is here to help
          you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-stretch">
        <ContactInfo />
        <SupportForm />
      </div>
    </div>
  )
}
