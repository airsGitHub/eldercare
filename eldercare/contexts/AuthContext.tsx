import React, { createContext, useContext, useState } from 'react';
import { AuthContextType, User, AuthState } from '../types/auth';

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  const updateAvatar = async (avatarUrl: string) => {
    if (state.user) {
      setState(prev => ({
        ...prev,
        user: {
          ...prev.user!,
          avatar: avatarUrl
        }
      }));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      // TODO: Implement actual login logic
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        avatar: 'https://via.placeholder.com/100',
      };
      setState(prev => ({ ...prev, user: mockUser, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      }));
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      // TODO: Implement actual registration logic
      const mockUser: User = {
        id: '1',
        email,
        name,
      };
      setState(prev => ({ ...prev, user: mockUser, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      }));
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      // TODO: Implement actual logout logic
      setState(initialState);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
