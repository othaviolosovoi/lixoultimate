import React, { createContext, useContext, useState, useCallback } from 'react';

interface CoinsContextType {
  refreshTrigger: number;
  refreshCoins: () => void;
}

const CoinsContext = createContext<CoinsContextType | undefined>(undefined);

export const CoinsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshCoins = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <CoinsContext.Provider value={{ refreshTrigger, refreshCoins }}>
      {children}
    </CoinsContext.Provider>
  );
};

export const useCoins = () => {
  const context = useContext(CoinsContext);
  if (context === undefined) {
    throw new Error('useCoins deve ser usado dentro de um CoinsProvider');
  }
  return context;
};
