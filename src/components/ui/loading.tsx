import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ size = 'md', className, ...props }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <div
        className={cn(
          'animate-spin rounded-full border-t-transparent border-primary',
          sizeClasses[size]
        )}
      />
    </div>
  );
} 