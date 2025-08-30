import { ArrowLeft, Home, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentView?: 'main' | 'detail';
  onNavigateHome?: () => void;
  coinName?: string;
}

const Navigation = ({ currentView = 'main', onNavigateHome, coinName }: NavigationProps) => {
  return (
    <nav className="bg-card/50 backdrop-blur-sm border-b border-card-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentView === 'detail' && onNavigateHome && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateHome}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            )}
            
            <div className="flex items-center gap-2">
              {currentView === 'main' ? (
                <>
                  <Home className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">CryptoVue Dashboard</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">
                    {coinName} Analysis
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              Real-time data
            </div>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;