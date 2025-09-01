import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mailbox } from "lucide-react";

export function EmptyState({ title, message }: { title: string, message: string }) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
                <Mailbox className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-500">{message}</p>
            </CardContent>
        </Card>
    );
}