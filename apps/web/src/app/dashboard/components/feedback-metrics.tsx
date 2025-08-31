
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowDownRight, ArrowUpRight, ChevronDown, Star } from "lucide-react"
import {
  dailyFeedbackCounts,
  weeklyFeedbackCounts,
  monthlyFeedbackCounts,
  ratings,
  categoryRatings,
} from "./static-data"

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0)
}

function formatNumber(n: number) {
  return n.toLocaleString()
}

function toPercent(current: number, prev: number) {
  if (!prev || !isFinite(prev)) return 0
  return ((current - prev) / prev) * 100
}

function avg(arr: number[]) {
  if (!arr.length) return 0
  return arr.reduce((s, v) => s + v, 0) / arr.length
}

type PeriodKey = "today" | "week" | "month"

export default function FeedbackMetrics() {
  // Period selector for the first card
  const [period, setPeriod] = React.useState<PeriodKey>("today")

  // Aggregates
  const todayCount = dailyFeedbackCounts.reduce((s, d) => s + d.count, 0)
  const yesterdayCount =
    monthlyFeedbackCounts.length >= 2 ? monthlyFeedbackCounts[monthlyFeedbackCounts.length - 2].count : todayCount

  const weekCount = weeklyFeedbackCounts.reduce((s, d) => s + d.count, 0)
  const prev7DaysCount = sum(monthlyFeedbackCounts.slice(-7).map((d) => d.count))

  const monthCount = monthlyFeedbackCounts.reduce((s, d) => s + d.count, 0)
  // compare last 15 vs prior 15 to show a meaningful month trend
  const last15 = sum(monthlyFeedbackCounts.slice(-15).map((d) => d.count))
  const prev15 = sum(monthlyFeedbackCounts.slice(0, 15).map((d) => d.count))

  // First card dynamic values based on selected period
  const periodValue = period === "today" ? todayCount : period === "week" ? weekCount : monthCount

  const { periodPrevValue, periodCaption } = React.useMemo(() => {
    if (period === "today") {
      return { periodPrevValue: yesterdayCount, periodCaption: "vs yesterday" }
    }
    if (period === "week") {
      return { periodPrevValue: prev7DaysCount, periodCaption: "vs previous 7 days" }
    }
    return { periodPrevValue: prev15, periodCaption: "vs prior 15 days" }
  }, [period, yesterdayCount, prev7DaysCount, prev15])

  const periodPercent = toPercent(periodValue, periodPrevValue)

  // Total card (last 30 days)
  const totalPercent = toPercent(last15, prev15) // show recent half vs prior half

  // Average rating and delta vs previous half of ratings
  const avgRatingRaw = avg(ratings)
  const avgRating = Math.round(avgRatingRaw * 10) / 10

  const firstHalf = ratings.slice(0, Math.floor(ratings.length / 2))
  const secondHalf = ratings.slice(Math.floor(ratings.length / 2))
  const avgPrev = avg(firstHalf) || avgRatingRaw
  const avgCurr = avg(secondHalf) || avgRatingRaw
  const avgPercent = toPercent(avgCurr, avgPrev)

  // Category averages for stars
  const avgClean = Math.round(avg(categoryRatings.cleanliness) * 10) / 10
  const avgService = Math.round(avg(categoryRatings.service) * 10) / 10
  const avgFood = Math.round(avg(categoryRatings.food) * 10) / 10

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Card 1: Submissions with period dropdown */}
      <Card role="region" aria-label="Feedback submissions">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Submissions</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                  {period === "today" ? "Today" : period === "week" ? "This week" : "This month"}
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setPeriod("today")}>Today</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPeriod("week")}>This week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPeriod("month")}>This month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold tracking-tight">{formatNumber(periodValue)}</div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            <DeltaPill value={periodPercent} />
            <span className="whitespace-nowrap">{periodCaption}</span>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Total (last 30 days) with trend */}
      <Card role="region" aria-label="Total feedback submissions">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold tracking-tight">443</div>
          <p className="text-xs text-muted-foreground mt-1">All-time feedback submissions</p>
        </CardContent>
      </Card>

      {/* Card 3: Average rating with categories */}
      <Card role="region" aria-label="Average rating">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div>
            <div className="text-3xl font-semibold tracking-tight">{avgRating}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
              <DeltaPill value={avgPercent} />
              <span>vs previous period</span>
            </div>
          </div>

          <div className="grid gap-2">
            <CategoryStars label="Cleanliness" value={avgClean} />
            <CategoryStars label="Service" value={avgService} />
            <CategoryStars label="Food" value={avgFood} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DeltaPill({ value }: { value: number }) {
  const isUp = value >= 0
  const abs = Math.abs(value)
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-foreground text-[10px] font-medium
      ${isUp ? "bg-emerald-50" : "bg-red-50"}`}
      aria-label={`Change ${isUp ? "up" : "down"} ${abs.toFixed(1)} percent`}
    >
      {isUp ? (
        <ArrowUpRight className={`h-3 w-3 ${isUp ? "text-emerald-600" : ""}`} aria-hidden />
      ) : (
        <ArrowDownRight className="h-3 w-3 text-red-600" aria-hidden />
      )}
      <span className={isUp ? "text-emerald-700" : "text-red-700"}>{abs.toFixed(1)}%</span>
    </span>
  )
}

function CategoryStars({ label, value }: { label: string; value: number }) {
  // Round to nearest 0.5 for nicer visual mapping
  const rounded = Math.round(value * 2) / 2
  const full = Math.floor(rounded)
  const hasHalf = rounded - full >= 0.5

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1" aria-label={`${label} rating ${value} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full
          const half = i === full && hasHalf
          return (
            <Star
              key={i}
              className={`h-4 w-4 ${filled ? "text-amber-500 fill-amber-500" : half ? "text-amber-500" : "text-muted-foreground"}`}
              aria-hidden
            />
          )
        })}
        <span className="ml-2 text-xs text-muted-foreground">{value.toFixed(1)}</span>
      </div>
    </div>
  )
}
