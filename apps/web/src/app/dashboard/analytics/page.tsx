import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Feedback Analytics</CardTitle>
          <CardDescription>Here's an overview of the feedback received.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Analytics charts and data will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
