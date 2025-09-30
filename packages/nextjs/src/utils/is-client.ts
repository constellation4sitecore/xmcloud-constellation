import { useState, useEffect } from 'react';

export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);
  return isClient;
};
