"use client"

import { clx } from "@modules/common/components/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination({
  page,
  totalPages,
  'data-testid': dataTestid
}: {
  page: number
  totalPages: number
  'data-testid'?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Helper function to generate an array of numbers within a range
  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index)

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  // Function to render a page button
  const renderPageButton = (
    p: number,
    label: string | number,
    isCurrent: boolean
  ) => (
    <button
      key={p}
      className={clx(
        "min-w-[36px] h-9 px-3 flex items-center justify-center text-sm font-sans font-medium rounded-[4px] border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2 disabled:cursor-default",
        isCurrent
          ? "bg-primary border-primary text-white font-bold"
          : "bg-white border-surface-container-highest text-on-surface hover:bg-surface-container"
      )}
      disabled={isCurrent}
      onClick={() => handlePageChange(p)}
      aria-label={`Go to page ${p}`}
      aria-current={isCurrent ? "page" : undefined}
    >
      {label}
    </button>
  )

  // Function to render ellipsis
  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="min-w-[36px] h-9 flex items-center justify-center text-sm font-sans text-on-surface-variant font-medium select-none cursor-default"
    >
      ...
    </span>
  )

  // Function to render page buttons based on the current page and total pages
  const renderPageButtons = () => {
    const buttons = []

    if (totalPages <= 7) {
      buttons.push(
        ...arrayRange(1, totalPages).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
    } else {
      if (page <= 4) {
        buttons.push(
          ...arrayRange(1, 5).map((p) => renderPageButton(p, p, p === page))
        )
        buttons.push(renderEllipsis("ellipsis1"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      } else if (page >= totalPages - 3) {
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis2"))
        buttons.push(
          ...arrayRange(totalPages - 4, totalPages).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
      } else {
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis3"))
        buttons.push(
          ...arrayRange(page - 1, page + 1).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
        buttons.push(renderEllipsis("ellipsis4"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      }
    }

    return buttons
  }

  return (
    <div className="flex justify-center w-full mt-12">
      <div
        className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
        data-testid={dataTestid}
      >
        <button
          className="w-9 h-9 flex items-center justify-center text-on-surface bg-white border border-surface-container-highest rounded-[4px] hover:bg-surface-container transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2 disabled:opacity-40 disabled:bg-surface-container-low disabled:border-surface-container-highest disabled:text-on-surface-variant/40 disabled:pointer-events-none"
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {renderPageButtons()}

        <button
          className="w-9 h-9 flex items-center justify-center text-on-surface bg-white border border-surface-container-highest rounded-[4px] hover:bg-surface-container transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2 disabled:opacity-40 disabled:bg-surface-container-low disabled:border-surface-container-highest disabled:text-on-surface-variant/40 disabled:pointer-events-none"
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
          aria-label="Go to next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
