
import React from 'react';
import Dashboard from '../components/Dashboard';
import { Info } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex flex-col">
      <header className="w-full py-4 px-6 border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <Info className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Data Management Console</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-6">
        <Dashboard />
      </main>

      <footer className="py-4 px-6 border-t border-border/40 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2023 Data Management System</p>
          <p className="text-sm text-muted-foreground">Version 1.0.0</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
