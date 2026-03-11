import * as Haptics from 'expo-haptics';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { addToWishlist, getMyWishlist, removeFromWishlist } from './api/productApis/products';

interface WishlistContextType {
    wishlistMap: Record<string, string>; // variantId -> wishlistItemId
    wishlistItems: any[];
    toggleWishlist: (productId: string, variantId: string) => Promise<void>;
    isInWishlist: (variantId: string) => boolean;
    refreshWishlist: () => Promise<void>;
    loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const [wishlistMap, setWishlistMap] = useState<Record<string, string>>({});
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = useCallback(async () => {
        try {
            const response = await getMyWishlist();
            const wishlist = response?.wishlist || [];
            setWishlistItems(wishlist);

            const map: Record<string, string> = {};
            wishlist.forEach((item: any) => {
                const vId = item?.product?.variant?._id || item?.product?.variant;
                if (vId) {
                    map[String(vId)] = String(item._id);
                }
            });

            setWishlistMap(map);
            await SecureStore.setItemAsync('Wishlist', JSON.stringify(map));
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            const stored = await SecureStore.getItemAsync('Wishlist');
            if (stored) {
                setWishlistMap(JSON.parse(stored));
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const toggleWishlist = async (productId: string, variantId: string) => {
        const strVariantId = String(variantId);
        const existingWishlistItemId = wishlistMap[strVariantId];

        // Save original states for potential rollback
        const originalMap = { ...wishlistMap };
        const originalItems = [...wishlistItems];

        try {
            if (existingWishlistItemId) {
                // Optimistic UI update: Remove
                const newMap = { ...wishlistMap };
                delete newMap[strVariantId];
                setWishlistMap(newMap);
                setWishlistItems(prev => prev.filter(item => String(item._id) !== String(existingWishlistItemId)));
                await SecureStore.setItemAsync('Wishlist', JSON.stringify(newMap));

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await removeFromWishlist(existingWishlistItemId);
            } else {
                // Optimistic UI update: Add (with temp ID)
                const tempId = `temp-${Date.now()}`;
                const newMap = { ...wishlistMap, [strVariantId]: tempId };
                setWishlistMap(newMap);
                // Note: wishlistItems will be fully updated after fetchWishlist() below

                await SecureStore.setItemAsync('Wishlist', JSON.stringify(newMap));

                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                const res = await addToWishlist(productId, strVariantId);
                const newWishlistItemId = res?.data?._id || res?._id;

                if (newWishlistItemId) {
                    // Update map with real ID and fetch full details
                    setWishlistMap(prev => ({ ...prev, [strVariantId]: String(newWishlistItemId) }));
                    await fetchWishlist();
                } else {
                    throw new Error('Failed to get new wishlist item ID');
                }
            }
        } catch (error) {
            console.error('Wishlist toggle error:', error);
            // Rollback on error
            setWishlistMap(originalMap);
            setWishlistItems(originalItems);
            await SecureStore.setItemAsync('Wishlist', JSON.stringify(originalMap));
        }
    };

    const isInWishlist = (variantId: string) => {
        return !!wishlistMap[String(variantId)];
    };

    return (
        <WishlistContext.Provider value={{
            wishlistMap,
            wishlistItems,
            toggleWishlist,
            isInWishlist,
            refreshWishlist: fetchWishlist,
            loading
        }}>
            {children}
        </WishlistContext.Provider>
    );
};


export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
