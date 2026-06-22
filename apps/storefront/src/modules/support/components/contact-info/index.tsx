import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { Container } from "@modules/common/components/ui/container"

export default function ContactInfo() {
  return (
    <Container className="p-8 flex flex-col gap-8 h-full bg-white border border-outline-variant">
      <div>
        <h2 className="text-headline-md text-on-surface font-headline font-bold">
          Contact Information
        </h2>
        <p className="text-body-sm text-on-surface-variant mt-2">
          Get in touch with us directly through any of these channels.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-surface-container rounded-[4px] text-primary shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] tracking-wider text-on-surface-variant font-bold uppercase">
              Phone
            </div>
            <div className="text-body-md font-bold text-on-surface mt-1">
              <a href="tel:1-603-759-7808" className="hover:underline">
                1-603-759-7808
              </a>
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="p-3 bg-surface-container rounded-[4px] text-primary shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] tracking-wider text-on-surface-variant font-bold uppercase">
              Email
            </div>
            <div className="text-body-md font-bold text-on-surface mt-1 break-all">
              <a href="mailto:support@1stop-liquidation.com" className="hover:underline">
                support@1stop-liquidation.com
              </a>
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="p-3 bg-surface-container rounded-[4px] text-primary shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] tracking-wider text-on-surface-variant font-bold uppercase">
              Office Address
            </div>
            <div className="text-body-md font-bold text-on-surface mt-1 whitespace-pre-line">
              1 Chestnut St Suite 5-E{"\n"}
              Nashua, NH 03060
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="p-3 bg-surface-container rounded-[4px] text-primary shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] tracking-wider text-on-surface-variant font-bold uppercase">
              Business Hours
            </div>
            <div className="text-body-md font-bold text-on-surface mt-1">
              Monday - Friday: 9:00 AM - 5:00 PM EST
            </div>
            <div className="text-[11px] text-on-surface-variant mt-0.5">
              Weekends: Closed
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
