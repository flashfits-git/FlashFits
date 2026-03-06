import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (token: string, userId: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check for token on mount
        const loadToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                if (token) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Failed to load token from secure store', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        loadToken();
    }, []);

    const signIn = async (token: string, userId: string) => {
        try {
            await SecureStore.setItemAsync('token', token);
            await SecureStore.setItemAsync('userId', userId);
            setIsAuthenticated(true);
            router.replace('/(tabs)' as any);
        } catch (error) {
            console.error('Failed to save auth data', error);
        }
    };

    const signOut = async () => {
        try {
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('userId');
            await SecureStore.deleteItemAsync('selectedAddress');
            await SecureStore.setItemAsync('addressSelectedOnce', 'false');

            setIsAuthenticated(false);

            // Navigate to auth explicitly
            router.replace('/(auth)' as any);
        } catch (error) {
            console.error('Failed to remove auth data', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
