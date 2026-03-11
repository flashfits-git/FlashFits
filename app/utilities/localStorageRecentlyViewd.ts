import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'PREVIOUSLY_VIEWED';

export const addToPreviouslyViewed = async (product: any) => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        let viewed = jsonValue != null ? JSON.parse(jsonValue) : [];

        viewed = viewed.filter((item: any) => item && item.id && item.id !== product.id);

        viewed.unshift(product);
        if (viewed.length > 20) viewed.pop();

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
    } catch (e) {
        console.log('❌ Error saving previously viewed', e);
    }
};

export const clearPreviouslyViewed = async () => {
  try {
    console.log("✅ Previously viewed data cleared");
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log("✅ Previously viewed data cleared");
  } catch (e) {
    console.log("❌ Error clearing previously viewed", e);
  }
};

export const getPreviouslyViewed = async (): Promise<any[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.log('Error reading previously viewed', e);
        return [];
    }
};
