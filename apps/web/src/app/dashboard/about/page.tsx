import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">About</h1>
      <Card>
        <CardHeader>
          <CardTitle>About Formback</CardTitle>
          <CardDescription>Information about the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is a feedback collection application.</p>
        </CardContent>
      </Card>
    </div>
  );
}
