import LocalizedClientLink from "@modules/common/components/localized-client-link"

const links = [
  { href: "/account", label: "My Account" },
  { href: "/store", label: "Shop Deals" },
  { href: "/support", label: "Support" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/privacy", label: "Privacy" },
  { href: "/return-policy", label: "Return Policy" },
]

export default function InstitutionalLinks() {
  return (
    <div>
      <h4 className="font-bold text-sm text-on-surface uppercase tracking-wider mb-4">
        Institucional
      </h4>
      <ul className="space-y-2 text-xs text-on-surface-variant">
        {links.map((link) => (
          <li key={link.href}>
            <LocalizedClientLink
              href={link.href}
              className="hover:text-primary transition-colors"
            >
              {link.label}
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
