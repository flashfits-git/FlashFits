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
            const wishlist = response?.data || [];
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

        try {
            if (existingWishlistItemId) {
                // Optimistic UI update: Remove
                const newMap = { ...wishlistMap };
                delete newMap[strVariantId];
                setWishlistMap(newMap);
                setWishlistItems(prev => prev.filter(item => String(item._id) !== String(existingWishlistItemId)));
                await SecureStore.setItemAsync('Wishlist', JSON.stringify(newMap));

                await removeFromWishlist(existingWishlistItemId);
            } else {
                // Add
                const res = await addToWishlist(productId, strVariantId);
                const newWishlistItemId = res?.data?._id;

                if (newWishlistItemId) {
                    const newMap = { ...wishlistMap, [strVariantId]: newWishlistItemId };
                    setWishlistMap(newMap);
                    // Re-fetch to get the full product info for the new item in wishlistItems
                    await fetchWishlist();
                }
            }
        } catch (error) {
            console.error('Wishlist toggle error:', error);
            fetchWishlist();
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
