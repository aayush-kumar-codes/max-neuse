
import React from 'react';
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: 'ready' | 'error' | 'pending';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  text?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  size = 'md', 
  pulse = true,
  text
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const statusColors = {
    ready: 'bg-status-ready',
    error: 'bg-status-error',
    pending: 'bg-status-pending'
  };

  const textColors = {
    ready: 'text-status-ready',
    error: 'text-status-error',
    pending: 'text-status-pending'
  };

  // Convert display text if provided
  const displayText = text || status;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={cn(
          "rounded-full", 
          sizeClasses[size], 
          statusColors[status]
        )}>
          {pulse && (
            <div className={cn(
              "absolute inset-0 rounded-full",
              statusColors[status],
              "opacity-40 animate-pulse-light"
            )} />
          )}
        </div>
      </div>
      {displayText && (
        <span className={cn(
          "text-sm font-medium",
          textColors[status]
        )}>
          {displayText}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
