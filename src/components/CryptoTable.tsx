import { useState, useMemo } from 'react';
import { CryptoCoin, formatPrice, formatMarketCap, formatPercentageChange } from '@/services/cryptoApi';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';
import SparklineChart from './SparklineChart';

interface CryptoTableProps {
  coins: CryptoCoin[];
  isLoading: boolean;
  lastUpdated: Date | null;
}

type SortField = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'market_cap' | 'name';
type SortDirection = 'asc' | 'desc';

const CryptoTable = ({ coins, isLoading, lastUpdated }: CryptoTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('market_cap_rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filteredAndSortedCoins = useMemo(() => {
    let filtered = coins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [coins, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (isLoading) {
    return (
      <Card className="border-card-border bg-card shadow-crypto">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded-lg"></div>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/6"></div>
                </div>
                <div className="w-20 h-8 bg-muted rounded"></div>
                <div className="w-16 h-6 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card className="border-card-border bg-card shadow-crypto hover-glow">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-crypto bg-clip-text text-transparent">
                Top Cryptocurrencies
              </h2>
              {lastUpdated && (
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <RotateCcw className="w-3 h-3" />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search coins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Main Table */}
      <Card className="border-card-border bg-card shadow-crypto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border">
                <th 
                  className="text-left p-4 font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('market_cap_rank')}
                >
                  Rank {getSortIcon('market_cap_rank')}
                </th>
                <th 
                  className="text-left p-4 font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Name {getSortIcon('name')}
                </th>
                <th 
                  className="text-right p-4 font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('current_price')}
                >
                  Price {getSortIcon('current_price')}
                </th>
                <th 
                  className="text-right p-4 font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('price_change_percentage_24h')}
                >
                  24h Change {getSortIcon('price_change_percentage_24h')}
                </th>
                <th 
                  className="text-right p-4 font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('market_cap')}
                >
                  Market Cap {getSortIcon('market_cap')}
                </th>
                <th className="text-center p-4 font-semibold text-muted-foreground">
                  7d Chart
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCoins.map((coin, index) => {
                const isPositive24h = coin.price_change_percentage_24h >= 0;
                const is7dPositive = coin.sparkline_in_7d?.price ? 
                  coin.sparkline_in_7d.price[coin.sparkline_in_7d.price.length - 1] >= coin.sparkline_in_7d.price[0] : true;

                return (
                  <tr 
                    key={coin.id} 
                    className="border-b border-card-border hover:bg-secondary/50 transition-colors group"
                  >
                    <td className="p-4">
                      <span className="text-muted-foreground font-medium">
                        #{coin.market_cap_rank}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={coin.image} 
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                          loading="lazy"
                        />
                        <div>
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {coin.name}
                          </div>
                          <div className="text-sm text-muted-foreground uppercase">
                            {coin.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-semibold text-foreground">
                        {formatPrice(coin.current_price)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Badge 
                        variant={isPositive24h ? 'default' : 'destructive'}
                        className={`
                          ${isPositive24h 
                            ? 'bg-success/20 text-success border-success/30 hover:bg-success/30' 
                            : 'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30'
                          }
                        `}
                      >
                        <div className="flex items-center gap-1">
                          {isPositive24h ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {formatPercentageChange(coin.price_change_percentage_24h)}
                        </div>
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-semibold text-foreground">
                        {formatMarketCap(coin.market_cap)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        {coin.sparkline_in_7d?.price ? (
                          <SparklineChart 
                            data={coin.sparkline_in_7d.price} 
                            isPositive={is7dPositive}
                          />
                        ) : (
                          <div className="w-20 h-8 bg-muted rounded animate-pulse"></div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedCoins.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No cryptocurrencies found matching your search.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CryptoTable;