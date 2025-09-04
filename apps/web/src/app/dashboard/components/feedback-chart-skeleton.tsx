import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeedbackChartSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-56" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[320px] md:h-[360px] lg:h-[400px] w-full" />
            </CardContent>
        </Card>
    );
}