'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, MessageSquare, Settings, Info, Menu } from 'lucide-react';
import clsx from 'clsx';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const mainLinks = [
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart },
  { href: '/dashboard/responses', label: 'Responses', icon: MessageSquare },
];

const bottomLinks = [
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/about', label: 'About', icon: Info },
];

export function MobileSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-60 p-4 flex flex-col">
        <div className="p-4 px-6">
          <h2 className="text-xl font-bold text-sidebar-foreground">Formback</h2>
        </div>
        <div className="flex flex-col justify-between flex-1 mt-4">
          <nav className="flex flex-col">
            {mainLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    'flex items-center rounded-lg px-4 py-2 text-sidebar-foreground ',
                    {
                      'bg-sidebar-accent text-sidebar-accent-foreground': isActive,
                    }
                  )}
                >
                  <Icon
                    className={clsx(
                      'mr-3 h-5 w-5',
                      isActive
                        ? 'text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground'
                    )}
                  />
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
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    'flex items-center rounded-lg px-4 py-2 text-sidebar-foreground ',
                    {
                      'bg-sidebar-accent text-sidebar-accent-foreground': isActive,
                    }
                  )}
                >
                  <Icon
                    className={clsx(
                      'mr-3 h-5 w-5',
                      isActive
                        ? 'text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground'
                    )}
                  />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
