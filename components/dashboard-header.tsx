import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  description?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, description, children, className, ...props }: DashboardHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-2 pb-5 md:flex-row md:items-center md:justify-between", className)}
      {...props}
    >
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
