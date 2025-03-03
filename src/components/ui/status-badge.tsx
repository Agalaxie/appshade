"use client"

import React from 'react';
import { cn } from '@/lib/utils';

type Status = 'open' | 'in_progress' | 'closed' | 'todo' | 'in-progress' | 'backlog' | 'done' | 'canceled' | string;

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: Status;
  children?: React.ReactNode;
}

function getStatusColor(status: Status): string {
  switch (status) {
    case 'open':
    case 'En attente':
    case 'backlog':
      return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-400 border-yellow-300 dark:border-yellow-400/20';
    
    case 'in_progress':
    case 'En cours':
    case 'in-progress':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400 border-blue-300 dark:border-blue-400/20';
    
    case 'closed':
    case 'Fermé':
    case 'done':
      return 'bg-green-50 text-green-700 dark:bg-green-400/10 dark:text-green-400 border-green-300 dark:border-green-400/20';
    
    case 'todo':
      return 'bg-gray-50 text-gray-700 dark:bg-gray-400/10 dark:text-gray-400 border-gray-300 dark:border-gray-400/20';
    
    case 'canceled':
      return 'bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-400 border-red-300 dark:border-red-400/20';
    
    default:
      return 'bg-gray-50 text-gray-700 dark:bg-gray-400/10 dark:text-gray-400 border-gray-300 dark:border-gray-400/20';
  }
}

export function StatusBadge({ status, className, children, ...props }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium',
        getStatusColor(status),
        className
      )}
      {...props}
    >
      {children ? children : status}
    </span>
  );
} 