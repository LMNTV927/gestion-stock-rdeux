import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "success" | "warning" | "danger"
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  const variantStyles = {
    default: "text-blue-600 bg-blue-50",
    success: "text-green-600 bg-green-50",
    warning: "text-yellow-600 bg-yellow-50",
    danger: "text-red-600 bg-red-50",
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", variantStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-extrabold text-gray-900 mb-1">{value}</div>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs font-semibold",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-gray-400 ml-1">vs mois dernier</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 