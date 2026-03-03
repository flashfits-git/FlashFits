import React, { createContext, ReactNode, useContext, useState } from 'react';

interface CartContextType {
    cartItems: any[];
    setCartItems: (items: any[]) => void;
    cartCount: number;
    setCartCount: (count: number) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [cartCount, setCartCount] = useState(0);

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, cartCount, setCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
