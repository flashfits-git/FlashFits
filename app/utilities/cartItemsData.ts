import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeCartLocally = async (cartItems: any[]) => {
    try {
        await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
        console.error('Error saving cart to storage:', error);
    }
};

export const getCartFromStorage = async (): Promise<any[]> => {
    try {
        const storedCart = await AsyncStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error('Error fetching cart from storage:', error);
        return [];
    }
};

export const clearCartStorage = async () => {
    try {
        await AsyncStorage.removeItem('cart');
    } catch (error) {
        console.error('Error clearing cart from storage:', error);
    }
};
