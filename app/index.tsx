import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // or AsyncStorage
// import { getCurrentUser } from '../lib/auth'; <-- If using Firebase or custom API

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Replace this with your actual auth check logic
      const token = await SecureStore.getItemAsync('user_token');

      setIsAuthenticated(!!token); // or check session validity
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)'} />;
  return <Redirect href={'/(tabs)'} />;

}
