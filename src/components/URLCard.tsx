
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface URLCardProps {
  title: string;
  url: string;
  onAction?: () => void;
  actionLabel?: string;
  status?: string;
  className?: string;
}

const URLCard: React.FC<URLCardProps> = ({
  title,
  url,
  onAction,
  actionLabel = "Refresh",
  status,
  className
}) => {
  return (
    <Card className={cn(
      "overflow-hidden border-border/40 shadow-sm transition-all duration-300",
      "bg-card/80 backdrop-blur-md hover:shadow-md",
      "group",
      className
    )}>
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-base">{title}</h3>
          </div>
          
          <div className="bg-secondary/30 rounded-md p-3 flex items-center overflow-hidden border border-border/30">
            <p className="text-sm font-mono text-muted-foreground truncate flex-1">
              {url || "Not set"}
            </p>
            {url && (
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:text-primary/70 ml-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            {status && (
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  status === "Connected" ? "bg-status-ready" : "bg-status-error"
                )}></div>
                <span className="text-xs text-muted-foreground">
                  {status}
                </span>
              </div>
            )}
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onAction}
              className="ml-auto text-xs h-8 gap-1.5 group-hover:-translate-y-0.5 transition-transform"
            >
              <RefreshCcw className="w-3 h-3" /> {actionLabel}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default URLCard;
