
"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { dailyFeedbackCounts, weeklyFeedbackCounts, monthlyFeedbackCounts } from "./static-data"

type RangeKey = "daily" | "weekly" | "monthly"

const datasets: Record<RangeKey, { label: string; count: number }[]> = {
  daily: dailyFeedbackCounts,
  weekly: weeklyFeedbackCounts,
  monthly: monthlyFeedbackCounts,
}

export default function FeedbackChart() {
  const [range, setRange] = React.useState<RangeKey>("daily")
  const data = datasets[range]

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <CardTitle className="text-base md:text-lg">Feedback Volume</CardTitle>
          <p className="text-xs text-muted-foreground">Counts of feedback submissions over time</p>
        </div>

        <Tabs value={range} onValueChange={(v) => setRange(v as RangeKey)} className="w-fit">
          <TabsList aria-label="Select time range" className="grid grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={{
            count: {
              label: "Feedback",
              color: "#f2da83",
            },
          }}
          className="h-[320px] md:h-[360px] lg:h-[400px] w-full"
        >
          {/* ChartContainer wraps children in ResponsiveContainer; just render BarChart */}
          <BarChart data={data} margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis allowDecimals={false} width={40} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} aria-label="Feedback count" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
