'use client';

import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse bg-dark-700 rounded', className)}
      {...props}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="bg-dark-800/80 border border-dark-700/60 rounded-xl shadow-lg overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-200/20 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-surface-500">Loading...</p>
      </div>
    </div>
  );
}

export { Skeleton, CardSkeleton, TableRowSkeleton, PageLoader };
