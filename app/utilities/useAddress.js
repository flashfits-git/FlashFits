import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export const useAddress = () => {
  const [address, setAddress] = useState(null);

  const loadAddress = async () => {
    const data = await SecureStore.getItemAsync("selectedAddress");
    setAddress(data ? JSON.parse(data) : null);
  };

  const updateAddress = async (newAddress) => {
    await SecureStore.setItemAsync("selectedAddress", JSON.stringify(newAddress));
    setAddress(newAddress);
  };

  return { address, loadAddress, updateAddress };
};
