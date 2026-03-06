import { Redirect } from 'expo-router';

export default function Index() {
  // Routing logic is now handled by the RootNavigator in _layout.tsx based on AuthContext
  // This index file simply redirects to the main layout, which handles the auth barrier.
  return <Redirect href={'/(tabs)' as any} />;
}