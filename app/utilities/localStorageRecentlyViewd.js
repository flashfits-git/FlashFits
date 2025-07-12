import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'PREVIOUSLY_VIEWED';

export const addToPreviouslyViewed = async (product) => {
  try {
    // console.log('👀 Product to add:', product);

    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    let viewed = jsonValue != null ? JSON.parse(jsonValue) : [];

    // 💡 Ensure all items are valid before filtering
    viewed = viewed.filter(item => item && item.id && item.id !== product.id);

    viewed.unshift(product); // add to top
    if (viewed.length > 20) viewed.pop(); // limit history size

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
    // console.log('✅ Saved successfully to AsyncStorage');
  } catch (e) {
    console.log('❌ Error saving previously viewed', e);
  }
};


export const getPreviouslyViewed = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log('Error reading previously viewed', e);
    return [];
  }
};
