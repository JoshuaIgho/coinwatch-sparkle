import { useState, useEffect } from 'react';
import { fetchTopCryptos, CryptoCoin } from '@/services/cryptoApi';
import { useToast } from '@/hooks/use-toast';
import CryptoVueHeader from '@/components/CryptoVueHeader';
import CryptoTable from '@/components/CryptoTable';

const Index = () => {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
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

  useEffect(() => {
    // Initial load
    loadCryptoData();

    // Set up auto-refresh every 60 seconds
    const interval = setInterval(() => {
      loadCryptoData(true);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <CryptoVueHeader />
        <CryptoTable 
          coins={coins} 
          isLoading={isLoading} 
          lastUpdated={lastUpdated}
        />
      </div>
    </div>
  );
};

export default Index;
