'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function MainLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <main className={cn(isAdmin ? "" : "pt-16")}>
      {children}
    </main>
  );
}
