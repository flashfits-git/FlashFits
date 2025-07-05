import AsyncStorage from '@react-native-async-storage/async-storage';

// Save cart data to AsyncStorage
export const storeCartLocally = async (cartItems) => {
  try {
    await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    // console.log('Cart saved to AsyncStorage ✅');
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

// Get cart data from AsyncStorage
export const getCartFromStorage = async () => {
  try {
    const storedCart = await AsyncStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('Error fetching cart from storage:', error);
    return [];
  }
};

// Optional: clear cart from AsyncStorage
export const clearCartStorage = async () => {
  try {
    await AsyncStorage.removeItem('cart');
    console.log('Cart cleared from AsyncStorage ❌');
  } catch (error) {
    console.error('Error clearing cart from storage:', error);
  }
};
