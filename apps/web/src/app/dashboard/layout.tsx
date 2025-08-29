import { Sidebar } from './components/sidebar';
import { MobileSidebar } from './components/mobile-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between p-4 lg:hidden border-b border-sidebar-border">
          <MobileSidebar />
          <h2 className="text-xl font-bold text-sidebar-foreground">Formback</h2>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
