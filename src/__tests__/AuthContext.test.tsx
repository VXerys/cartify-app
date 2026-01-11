/**
 * AuthContext Tests
 *
 * Unit tests for the AuthContext provider and useAuth hook.
 */

import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { authService } from '@/src/services/authService';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

// Mock authService
jest.mock('@/src/services/authService', () => ({
  authService: {
    subscribe: jest.fn((callback) => {
      callback({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return jest.fn(); // unsubscribe function
    }),
    initialize: jest.fn(),
    signInWithEmail: jest.fn(),
    signUp: jest.fn(),
    signInWithGoogle: jest.fn(),
    signOut: jest.fn(),
    sendPasswordReset: jest.fn(),
    updateProfile: jest.fn(),
    getState: jest.fn(() => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })),
  },
}));

describe('AuthContext', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // Provider Tests
  // ============================================
  describe('AuthProvider', () => {
    it('should provide auth context to children', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should subscribe to auth state changes on mount', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      renderHook(() => useAuth(), { wrapper });

      expect(authService.subscribe).toHaveBeenCalled();
      expect(authService.initialize).toHaveBeenCalled();
    });

    it('should unsubscribe from auth state changes on unmount', () => {
      const unsubscribeMock = jest.fn();
      (authService.subscribe as jest.Mock).mockReturnValue(unsubscribeMock);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { unmount } = renderHook(() => useAuth(), { wrapper });
      unmount();

      expect(unsubscribeMock).toHaveBeenCalled();
    });
  });

  // ============================================
  // useAuth Hook Tests
  // ============================================
  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });

    it('should provide signInWithEmail method', async () => {
      (authService.signInWithEmail as jest.Mock).mockResolvedValue({
        id: 'test-id',
        email: 'test@example.com',
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.signInWithEmail('test@example.com', 'password123');
      });

      expect(authService.signInWithEmail).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should provide signUp method', async () => {
      (authService.signUp as jest.Mock).mockResolvedValue({ requiresVerification: true });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUp('test@example.com', 'Password123', 'Test User');
      });

      expect(authService.signUp).toHaveBeenCalledWith('test@example.com', 'Password123', 'Test User');
      expect(signUpResult).toEqual({ requiresVerification: true });
    });

    it('should provide signInWithGoogle method', async () => {
      (authService.signInWithGoogle as jest.Mock).mockResolvedValue(undefined);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(authService.signInWithGoogle).toHaveBeenCalled();
    });

    it('should provide signOut method', async () => {
      (authService.signOut as jest.Mock).mockResolvedValue(undefined);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.signOut();
      });

      expect(authService.signOut).toHaveBeenCalled();
    });

    it('should provide sendPasswordReset method', async () => {
      (authService.sendPasswordReset as jest.Mock).mockResolvedValue(undefined);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.sendPasswordReset('test@example.com');
      });

      expect(authService.sendPasswordReset).toHaveBeenCalledWith('test@example.com');
    });

    it('should provide updateProfile method', async () => {
      (authService.updateProfile as jest.Mock).mockResolvedValue(undefined);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.updateProfile({ fullName: 'New Name' });
      });

      expect(authService.updateProfile).toHaveBeenCalledWith({ fullName: 'New Name' });
    });
  });

  // ============================================
  // Auth State Updates
  // ============================================
  describe('auth state updates', () => {
    it('should update state when auth changes', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        fullName: 'Test User',
        avatarUrl: null,
        provider: 'email' as const,
      };

      let capturedCallback: Function;
      (authService.subscribe as jest.Mock).mockImplementation((callback) => {
        capturedCallback = callback;
        callback({
          user: null,
          isLoading: true,
          isAuthenticated: false,
        });
        return jest.fn();
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Simulate auth state change
      act(() => {
        capturedCallback({
          user: mockUser,
          isLoading: false,
          isAuthenticated: true,
        });
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
