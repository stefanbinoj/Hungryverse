"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useQuery } from "convex/react";
import { api } from "@feedbacl/backend/convex/_generated/api";

type RangeKey = "daily" | "weekly" | "monthly";

export default function FeedbackChart() {
    const [range, setRange] = React.useState<RangeKey>("daily");

    // Fetch dynamic chart data from Convex
    const chartData = useQuery(api.functions.dashboard.chart.getChartData);

    // Safely access current dataset
    const data = chartData?.[range] ?? [];

    // Responsive tick interval
    const interval = React.useMemo(() => {
        if (range === "daily") return 5; // every 6 hours
        if (range === "monthly") return 4; // every ~5 days
        return 0; // show all for weekly
    }, [range]);

    if (chartData === undefined) {
        // Data is loading
        <div>Loading chart...</div>;
    }

    return (
        <Card>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col">
                    <CardTitle className="text-base md:text-lg">
                        Feedback Volume
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Counts of feedback submissions over time
                    </p>
                </div>

                <Tabs
                    value={range}
                    onValueChange={(v) => setRange(v as RangeKey)}
                    className="w-fit"
                >
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
                    <BarChart data={data} margin={{ left: 8, right: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={interval}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            allowDecimals={false}
                            width={40}
                            tickLine={false}
                            axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={[4, 4, 0, 0]}
                            aria-label="Feedback count"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
