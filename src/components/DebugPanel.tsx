
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface DebugPanelProps {
  apiUrl: string;
  lastRequest: string | null;
  className?: string;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ 
  apiUrl, 
  lastRequest,
  className 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className={cn(
      "overflow-hidden border-border/40 shadow-sm",
      "bg-card/80 backdrop-blur-md hover:shadow-md transition-all duration-300",
      className
    )}>
      <CardHeader className="pb-2 pt-5 px-5 flex flex-row items-center justify-between space-y-0 border-b border-border/10">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-base font-semibold">Debug Information</CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 rounded-full hover:bg-primary/10"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      
      <CardContent className={cn(
        "px-0 pb-0 space-y-0 grid gap-0",
        "transition-all duration-500 ease-in-out",
        isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}>
        <div className={cn(
          "overflow-hidden transition-all duration-500",
          isExpanded ? "opacity-100" : "opacity-0"
        )}>
          <div className="space-y-4 px-5 py-4">
            <div>
              <h4 className="text-xs font-medium mb-2 text-muted-foreground">IVIbetx API URL:</h4>
              <div className="bg-secondary/30 rounded-md p-3 border border-border/30">
                <p className="text-xs font-mono text-foreground/80 break-all">
                  {apiUrl || "Not set"}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-medium mb-2 text-muted-foreground">Last Request:</h4>
              <div className="bg-secondary/30 rounded-md p-3 border border-border/30">
                <p className="text-xs font-mono text-foreground/80 break-all">
                  {lastRequest || "None"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;
