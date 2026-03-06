import { Redirect } from 'expo-router';
import { useAuth } from './AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { isAuthenticated, isLoading, hasSeenOnboarding } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Not logged in -> Auth flow
  if (!isAuthenticated) {
    return <Redirect href={'/(auth)'} />;
  }

  // Logged in but hasn't seen onboarding -> Onboarding flow
  if (!hasSeenOnboarding) {
    return <Redirect href={'/(auth)/onboarding'} />;
  }

  // Logged in and has seen onboarding -> Main app
  return <Redirect href={'/(tabs)'} />;
}