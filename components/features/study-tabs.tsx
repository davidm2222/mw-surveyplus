"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "./theme-toggle"
import { Study } from "@/types"

interface StudyTabsProps {
  study: Study
}

export function StudyTabs({ study }: StudyTabsProps) {
  const pathname = usePathname()

  const tabs = [
    {
      label: "Setup",
      href: `/study/${study.id}/edit`,
      active: pathname?.includes("/edit")
    },
    {
      label: "Monitor",
      href: `/study/${study.id}/monitor`,
      active: pathname?.includes("/monitor")
    },
    {
      label: "Report",
      href: `/study/${study.id}/report`,
      active: pathname?.includes("/report")
    },
  ]

  const statusVariant = {
    draft: "secondary" as const,
    active: "default" as const,
    complete: "success" as const,
  }[study.status]

  const statusLabel = {
    draft: "Draft",
    active: "Active",
    complete: "Completed",
  }[study.status]

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Study Header */}
        <div className="py-4 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold text-foreground truncate">
                {study.name}
              </h1>
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {study.researchGoal}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <ThemeToggle />
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                px-4 py-2 text-sm font-medium transition-colors rounded-t-lg
                ${tab.active
                  ? "bg-card text-foreground border-t border-x border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }
              `}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
