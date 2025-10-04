import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Settings, Moon, Sun, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { theme, toggleTheme } = useTheme();
  const isOnline = useOnlineStatus();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold">
              P
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Planner
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mr-2">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-success" />
                  <span className="hidden sm:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-destructive" />
                  <span className="hidden sm:inline">Offline</span>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6">
        {children}
      </main>

      <nav className="sticky bottom-0 z-50 w-full border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 md:hidden">
        <div className="container flex h-16 items-center justify-around px-4">
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full h-12 w-12",
                isActive('/') && "bg-accent text-accent-foreground"
              )}
            >
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/calendar">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full h-12 w-12",
                isActive('/calendar') && "bg-accent text-accent-foreground"
              )}
            >
              <Calendar className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/settings">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full h-12 w-12",
                isActive('/settings') && "bg-accent text-accent-foreground"
              )}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </nav>

      <aside className="hidden md:flex fixed right-4 top-20 flex-col gap-2">
        <Link to="/">
          <Button
            variant={isActive('/') ? "default" : "outline"}
            size="icon"
            className="rounded-full h-12 w-12"
          >
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/calendar">
          <Button
            variant={isActive('/calendar') ? "default" : "outline"}
            size="icon"
            className="rounded-full h-12 w-12"
          >
            <Calendar className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/settings">
          <Button
            variant={isActive('/settings') ? "default" : "outline"}
            size="icon"
            className="rounded-full h-12 w-12"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </aside>
    </div>
  );
};
