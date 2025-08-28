'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, MessageSquare, Settings, Info } from 'lucide-react';
import clsx from 'clsx';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const mainLinks = [
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart },
    { href: '/dashboard/responses', label: 'Responses', icon: MessageSquare },
  ];

  const bottomLinks = [
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { href: '/dashboard/about', label: 'About', icon: Info },
  ];

  return (
    <div className="flex h-screen bg-background">
      <aside className="flex flex-col w-60 border-r border-sidebar-border bg-sidebar">
        <div className="p-4 px-6">
          <h2 className="text-xl font-bold text-sidebar-foreground">Formback</h2>
        </div>
        <div className="flex flex-col justify-between flex-1 p-4">
            <nav className="flex flex-col">
            {mainLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                <Link
                    key={link.href}
                    href={link.href }
                    className={clsx(
                        'flex items-center rounded-lg px-4 py-2 text-sidebar-foreground ',
                        {
                            'bg-sidebar-accent text-sidebar-accent-foreground': isActive,
                        }
                    )}
                >
                    <Icon className={clsx("mr-3 h-5 w-5", isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground")} />
                    {link.label}
                </Link>
                );
            })}
            </nav>
            <nav className="flex flex-col">
            {bottomLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                        'flex items-center rounded-lg px-4 py-2 text-sidebar-foreground ',
                        {
                            'bg-sidebar-accent text-sidebar-accent-foreground': isActive,
                        }
                    )}
                >
                    <Icon className={clsx("mr-3 h-5 w-5", isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground")} />
                    {link.label}
                </Link>
                );
            })}
            </nav>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
