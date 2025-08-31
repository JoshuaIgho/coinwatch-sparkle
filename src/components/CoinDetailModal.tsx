import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CryptoCoin, formatPrice, formatMarketCap, formatPercentageChange } from '@/services/cryptoApi';
import Navigation from './Navigation';
import RefreshIntervalSelector from './RefreshIntervalSelector';

interface CoinDetailModalProps {
  coin: CryptoCoin | null;
  isOpen: boolean;
  onClose: () => void;
  onRefreshCoin?: (coinId: string) => Promise<CryptoCoin>;
}

const CoinDetailModal = ({ coin, isOpen, onClose, onRefreshCoin }: CoinDetailModalProps) => {
  const [chartData, setChartData] = useState<Array<{ time: string; price: number }>>([]);
  const [refreshInterval, setRefreshInterval] = useState(300); // Default 5 minutes
  const [currentCoin, setCurrentCoin] = useState<CryptoCoin | null>(coin);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshCoinData = async () => {
    if (!currentCoin?.id || !onRefreshCoin) return;
    
    setIsRefreshing(true);
    try {
      const updatedCoin = await onRefreshCoin(currentCoin.id);
      setCurrentCoin(updatedCoin);
    } catch (error) {
      console.error('Failed to refresh coin data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setCurrentCoin(coin);
  }, [coin]);

  useEffect(() => {
    const activeCoin = currentCoin || coin;
    if (activeCoin?.sparkline_in_7d?.price) {
      // Convert sparkline data to chart format with time labels
      const data = activeCoin.sparkline_in_7d.price.map((price, index) => {
        const date = new Date();
        date.setHours(date.getHours() - (168 - index)); // 168 hours in 7 days
        return {
          time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: price,
        };
      });
      setChartData(data);
    }
  }, [coin, currentCoin]);

  // Auto-refresh effect
  useEffect(() => {
    if (!isOpen || !onRefreshCoin) return;

    const interval = setInterval(() => {
      refreshCoinData();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [isOpen, refreshInterval, currentCoin?.id, onRefreshCoin]);

  const displayCoin = currentCoin || coin;
  if (!displayCoin) return null;

  const isPositive24h = displayCoin.price_change_percentage_24h >= 0;
  const is7dPositive = displayCoin.sparkline_in_7d?.price ? 
    displayCoin.sparkline_in_7d.price[displayCoin.sparkline_in_7d.price.length - 1] >= displayCoin.sparkline_in_7d.price[0] : true;

  const strokeColor = is7dPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-card-border">
        <Navigation 
          currentView="detail" 
          onNavigateHome={onClose} 
          coinName={displayCoin.name}
        />
        
        <DialogHeader className="mt-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={displayCoin.image} 
                alt={displayCoin.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <span className="text-xl font-bold">{displayCoin.name}</span>
                <span className="text-muted-foreground ml-2 text-sm uppercase">
                  {displayCoin.symbol}
                </span>
                {isRefreshing && (
                  <RotateCcw className="w-4 h-4 ml-2 animate-spin inline text-primary" />
                )}
              </div>
            </div>
            
            <RefreshIntervalSelector
              selectedInterval={refreshInterval}
              onIntervalChange={setRefreshInterval}
            />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-secondary/20 border-card-border">
              <div className="text-sm text-muted-foreground mb-1">Current Price</div>
              <div className="text-2xl font-bold text-foreground">
                {formatPrice(displayCoin.current_price)}
              </div>
            </Card>

            <Card className="p-4 bg-secondary/20 border-card-border">
              <div className="text-sm text-muted-foreground mb-1">24h Change</div>
              <Badge 
                variant={isPositive24h ? 'default' : 'destructive'}
                className={`
                  text-base px-3 py-1
                  ${isPositive24h 
                    ? 'bg-success/20 text-success border-success/30' 
                    : 'bg-destructive/20 text-destructive border-destructive/30'
                  }
                `}
              >
                <div className="flex items-center gap-1">
                  {isPositive24h ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {formatPercentageChange(displayCoin.price_change_percentage_24h)}
                </div>
              </Badge>
            </Card>

            <Card className="p-4 bg-secondary/20 border-card-border">
              <div className="text-sm text-muted-foreground mb-1">Market Cap</div>
              <div className="text-xl font-bold text-foreground">
                {formatMarketCap(displayCoin.market_cap)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Rank #{displayCoin.market_cap_rank}
              </div>
            </Card>
          </div>

          {/* Price Chart */}
          <Card className="p-6 bg-secondary/20 border-card-border">
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">7-Day Price Chart</h3>
            </div>
            
            {chartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      domain={['dataMin', 'dataMax']}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--card-border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                      }}
                      formatter={(value: number) => [`$${value.toFixed(4)}`, 'Price']}
                      labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={strokeColor}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ 
                        r: 4, 
                        fill: strokeColor,
                        stroke: 'hsl(var(--background))',
                        strokeWidth: 2
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <div className="text-muted-foreground">No chart data available</div>
              </div>
            )}
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoinDetailModal;