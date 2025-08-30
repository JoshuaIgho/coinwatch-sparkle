import { TrendingUp, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

const CryptoVueHeader = () => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 -m-4 bg-gradient-crypto opacity-20 blur-3xl rounded-full"></div>
        
        {/* Main header */}
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-crypto rounded-2xl shadow-crypto-glow">
              <TrendingUp className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-crypto bg-clip-text text-transparent">
              CryptoVue
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Real-time cryptocurrency prices and market data with beautiful, intuitive charts
          </p>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Card className="px-4 py-2 bg-card/50 border-card-border">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Zap className="w-4 h-4 text-primary" />
                <span>Live Updates</span>
              </div>
            </Card>
            <Card className="px-4 py-2 bg-card/50 border-card-border">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="w-4 h-4 text-success" />
                <span>Top 50 Coins</span>
              </div>
            </Card>
            <Card className="px-4 py-2 bg-card/50 border-card-border">
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className="w-4 h-4 bg-gradient-crypto rounded-full"></div>
                <span>7-Day Charts</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoVueHeader;