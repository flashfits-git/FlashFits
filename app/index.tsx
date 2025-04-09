import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useLocalSearchParams, useRouter  } from 'expo-router';



import { Redirect } from "expo-router";

export default function Index() {
  const { routerr } = useLocalSearchParams();

  return <Redirect href="/(tabs)" />;
  
}
