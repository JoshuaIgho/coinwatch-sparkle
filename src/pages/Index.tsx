import { useState, useEffect } from 'react';
import { fetchTopCryptos, fetchSingleCoin, CryptoCoin } from '@/services/cryptoApi';
import { useToast } from '@/hooks/use-toast';
import CryptoVueHeader from '@/components/CryptoVueHeader';
import CryptoTable from '@/components/CryptoTable';
import RefreshIntervalSelector from '@/components/RefreshIntervalSelector';
import CoinDetailModal from '@/components/CoinDetailModal';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(60); // Default 60 seconds
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const loadCryptoData = async (showToast = false) => {
    try {
      setIsLoading(true);
      const data = await fetchTopCryptos(50);
      setCoins(data);
      setLastUpdated(new Date());
      
      if (showToast) {
        toast({
          title: "Data Updated",
          description: "Cryptocurrency prices have been refreshed",
        });
      }
    } catch (error) {
      console.error('Failed to load crypto data:', error);
      toast({
        title: "Error",
        description: "Failed to load cryptocurrency data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoinClick = (coin: CryptoCoin) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  const handleRefreshCoin = async (coinId: string): Promise<CryptoCoin> => {
    return await fetchSingleCoin(coinId);
  };

  useEffect(() => {
    // Initial load
    loadCryptoData();

    // Set up auto-refresh with selected interval
    const interval = setInterval(() => {
      loadCryptoData(true);
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation currentView="main" />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <CryptoVueHeader />
        
        <div className="mb-6">
          <RefreshIntervalSelector
            selectedInterval={refreshInterval}
            onIntervalChange={setRefreshInterval}
          />
        </div>

        <CryptoTable 
          coins={coins} 
          isLoading={isLoading} 
          lastUpdated={lastUpdated}
          onCoinClick={handleCoinClick}
        />

        <CoinDetailModal
          coin={selectedCoin}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRefreshCoin={handleRefreshCoin}
        />
      </div>
    </div>
  );
};

export default Index;
