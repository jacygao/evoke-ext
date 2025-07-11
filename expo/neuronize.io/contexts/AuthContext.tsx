import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, User } from '@react-native-google-signin/google-signin';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AUTH_TOKEN_KEY = '@neuronize_auth_token';
const USER_DATA_KEY = '@neuronize_user_data';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Configure Google Sign-In
      GoogleSignin.configure({
        // You'll need to add your Google OAuth client IDs here
        // Get these from Google Cloud Console
        webClientId: '942582519364-gn4puh22ulc8o1tceaog16m19gi54p3q.apps.googleusercontent.com', // Required for Android
        iosClientId: 'YOUR_IOS_CLIENT_ID', // Optional, auto-detected from GoogleService-Info.plist
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });

      // Check for stored authentication
      const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_DATA_KEY);

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        
        // Try to get current user info to verify token is still valid
        try {
          const currentUser = await GoogleSignin.getCurrentUser();
          if (currentUser) {
            setUser(userData);
          } else {
            // Token expired, clear stored data
            await clearStoredAuth();
          }
        } catch {
          // Token invalid, clear stored data
          await clearStoredAuth();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      await clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setIsLoading(true);
      
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices();
      
      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      
      // Get access token
      const tokens = await GoogleSignin.getTokens();
      
      // Store authentication data
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, tokens.accessToken);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userInfo.data));
      
      setUser(userInfo.data);
    } catch (error: any) {
      console.error('Sign-in error:', error);
      if (error.code === 'SIGN_IN_CANCELLED') {
        // User cancelled sign-in
        return;
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Sign out from Google
      await GoogleSignin.signOut();
      
      // Clear stored authentication data
      await clearStoredAuth();
      
      setUser(null);
    } catch (error) {
      console.error('Sign-out error:', error);
      // Even if Google sign-out fails, clear local data
      await clearStoredAuth();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearStoredAuth = async () => {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
    } catch (error) {
      console.error('Error clearing stored auth:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};