import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Loader from '@/components/Loader/Loader';
import { initSocket } from './config/socket';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Replace this with your actual auth check logic
      const token = await SecureStore.getItemAsync('token');
      console.log(token,'token');
      
      setIsAuthenticated(!!token); // or check session validity
      initSocket(token)
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (   
        <Loader/>
    );
  }
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)'} />;
}