import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    hasSeenOnboarding: boolean;
    signIn: (token: string, userId: string, isNewUser?: boolean) => Promise<void>;
    signOut: () => Promise<void>;
    completeOnboarding: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(false);

    useEffect(() => {
        // Check for token on mount
        const loadToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                const seenOnboardingStr = await SecureStore.getItemAsync('hasSeenOnboarding');
                const seenOnboarding = seenOnboardingStr === 'true';

                setHasSeenOnboarding(seenOnboarding);

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

    const signIn = async (token: string, userId: string, isNewUser?: boolean) => {
        try {
            await SecureStore.setItemAsync('token', token);
            await SecureStore.setItemAsync('userId', userId);

            if (isNewUser) {
                setHasSeenOnboarding(false);
                await SecureStore.setItemAsync('hasSeenOnboarding', 'false');
            }

            // Mark authenticated state immediately so root layout knows we are logged in
            setIsAuthenticated(true);

            setTimeout(() => {
                if (isNewUser || !hasSeenOnboarding) {
                    router.replace('/(auth)/onboarding' as any);
                } else {
                    router.replace('/(tabs)' as any);
                }
            }, 0);
        } catch (error) {
            console.error('Failed to save auth data', error);
        }
    };

    const completeOnboarding = async () => {
        try {
            await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
            setHasSeenOnboarding(true);
            router.replace('/(tabs)' as any);
        } catch (error) {
            console.error('Failed to save onboarding state', error);
            // navigate anyway
            router.replace('/(tabs)' as any);
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
            setTimeout(() => {
                router.replace('/(auth)' as any);
            }, 0);
        } catch (error) {
            console.error('Failed to remove auth data', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, hasSeenOnboarding, signIn, signOut, completeOnboarding }}>
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

