
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusIndicator from "./StatusIndicator";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface APIStatusProps {
  status: 'ready' | 'error' | 'pending';
  className?: string;
}

const APIStatus: React.FC<APIStatusProps> = ({ status, className }) => {
  const statusMessages = {
    ready: "API is operational and ready for requests",
    error: "API is currently experiencing issues",
    pending: "API connection is being established"
  };

  return (
    <Card className={cn(
      "overflow-hidden border-border/40 shadow-sm",
      "bg-card/80 backdrop-blur-md hover:shadow-md transition-all duration-300",
      className
    )}>
      <CardHeader className="pb-2 pt-5 px-5 flex flex-row items-center justify-between space-y-0 border-b border-border/10">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-base font-semibold">API Status</CardTitle>
        </div>
        <StatusIndicator 
          status={status} 
          text={status.charAt(0).toUpperCase() + status.slice(1)} 
          size="md"
        />
      </CardHeader>
      <CardContent className="px-5 py-4">
        <p className="text-sm text-muted-foreground">{statusMessages[status]}</p>
      </CardContent>
    </Card>
  );
};

export default APIStatus;
