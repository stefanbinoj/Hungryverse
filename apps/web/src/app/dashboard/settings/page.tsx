import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Manage your application settings here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings form will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
