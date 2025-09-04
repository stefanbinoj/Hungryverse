import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeedbackMetricsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 Skeleton */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </CardContent>
            </Card>

            {/* Card 2 Skeleton */}
            <Card>
                <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-16" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-4 w-40" />
                </CardContent>
            </Card>

            {/* Card 3 Skeleton */}
            <Card>
                <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-24" />
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <div>
                        <Skeleton className="h-8 w-12" />
                    </div>
                    <div className="grid gap-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}