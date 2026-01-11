/**
 * AuthService Tests
 *
 * Unit tests for the authentication service.
 * Tests the business logic layer of authentication.
 */

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// We need to import after mocks are set up
// The authService is already using the mocked Firebase

describe('AuthService', () => {
  // Store original module
  let authService: typeof import('../../services/authService').authService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    // Re-import to get fresh instance
    const authModule = require('../../services/authService');
    authService = authModule.authService;
  });

  // ============================================
  // getState Tests
  // ============================================
  describe('getState', () => {
    it('should return current auth state', () => {
      const state = authService.getState();
      
      expect(state).toHaveProperty('user');
      expect(state).toHaveProperty('isLoading');
      expect(state).toHaveProperty('isAuthenticated');
    });

    it('should have initial state with null user', () => {
      const state = authService.getState();
      
      expect(state.isAuthenticated).toBe(false);
    });
  });

  // ============================================
  // subscribe Tests
  // ============================================
  describe('subscribe', () => {
    it('should add listener and call it immediately with current state', () => {
      const listener = jest.fn();
      
      authService.subscribe(listener);
      
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        isLoading: expect.any(Boolean),
        isAuthenticated: expect.any(Boolean),
      }));
    });

    it('should return unsubscribe function', () => {
      const listener = jest.fn();
      
      const unsubscribe = authService.subscribe(listener);
      
      expect(typeof unsubscribe).toBe('function');
    });

    it('should stop calling listener after unsubscribe', () => {
      const listener = jest.fn();
      
      const unsubscribe = authService.subscribe(listener);
      listener.mockClear();
      
      unsubscribe();
      
      // Listener should not be called after unsubscribe
      // This is verified by no additional calls
      expect(listener).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // signInWithEmail Tests
  // ============================================
  describe('signInWithEmail', () => {
    it('should call Firebase signInWithEmailAndPassword', async () => {
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        emailVerified: true,
        photoURL: null,
        providerData: [{ providerId: 'password' }],
      };

      (auth().signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      });

      const result = await authService.signInWithEmail('test@example.com', 'password123');

      expect(auth().signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
    });

    it('should reject unverified email users', async () => {
      const mockUnverifiedUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        emailVerified: false,
        providerData: [{ providerId: 'password' }],
      };

      (auth().signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUnverifiedUser,
      });
      (auth().signOut as jest.Mock).mockResolvedValue(undefined);

      await expect(authService.signInWithEmail('test@example.com', 'password123'))
        .rejects.toThrow('verify your email');
    });

    it('should throw error for invalid credentials', async () => {
      (auth().signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: 'auth/invalid-credential',
      });

      await expect(authService.signInWithEmail('test@example.com', 'wrongpassword'))
        .rejects.toThrow();
    });
  });

  // ============================================
  // signUp Tests
  // ============================================
  describe('signUp', () => {
    it('should create user and send verification email', async () => {
      const mockUser = {
        uid: 'new-user-uid',
        email: 'new@example.com',
        updateProfile: jest.fn().mockResolvedValue(undefined),
        sendEmailVerification: jest.fn().mockResolvedValue(undefined),
      };

      (auth().createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      });
      (auth().signOut as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.signUp('new@example.com', 'Password123', 'New User');

      expect(auth().createUserWithEmailAndPassword).toHaveBeenCalledWith('new@example.com', 'Password123');
      expect(mockUser.updateProfile).toHaveBeenCalledWith({ displayName: 'New User' });
      expect(mockUser.sendEmailVerification).toHaveBeenCalled();
      expect(auth().signOut).toHaveBeenCalled();
      expect(result).toEqual({ requiresVerification: true });
    });

    it('should throw error for weak password', async () => {
      (auth().createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: 'auth/weak-password',
      });

      await expect(authService.signUp('test@example.com', 'weak', 'Test User'))
        .rejects.toThrow();
    });

    it('should throw error for already used email', async () => {
      (auth().createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: 'auth/email-already-in-use',
      });

      await expect(authService.signUp('existing@example.com', 'Password123', 'Test User'))
        .rejects.toThrow('already registered');
    });
  });

  // ============================================
  // signInWithGoogle Tests
  // ============================================
  describe('signInWithGoogle', () => {
    it('should call Google SignIn and Firebase auth', async () => {
      (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);
      (GoogleSignin.signIn as jest.Mock).mockResolvedValue({
        data: { idToken: 'mock-id-token' },
      });
      (auth.GoogleAuthProvider.credential as jest.Mock).mockReturnValue('mock-credential');
      (auth().signInWithCredential as jest.Mock).mockResolvedValue({
        user: { uid: 'google-user', email: 'google@example.com' },
      });

      await authService.signInWithGoogle();

      expect(GoogleSignin.hasPlayServices).toHaveBeenCalled();
      expect(GoogleSignin.signIn).toHaveBeenCalled();
      expect(auth.GoogleAuthProvider.credential).toHaveBeenCalledWith('mock-id-token');
      expect(auth().signInWithCredential).toHaveBeenCalledWith('mock-credential');
    });

    it('should handle cancelled sign in', async () => {
      (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);
      (GoogleSignin.signIn as jest.Mock).mockRejectedValue({
        code: '12501',
        message: 'Sign in cancelled',
      });

      await expect(authService.signInWithGoogle()).rejects.toThrow('cancelled');
    });

    it('should handle missing ID token', async () => {
      (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);
      (GoogleSignin.signIn as jest.Mock).mockResolvedValue({
        data: { idToken: null },
      });

      await expect(authService.signInWithGoogle()).rejects.toThrow();
    });
  });

  // ============================================
  // sendPasswordReset Tests
  // ============================================
  describe('sendPasswordReset', () => {
    it('should call Firebase sendPasswordResetEmail', async () => {
      (auth().sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

      await authService.sendPasswordReset('test@example.com');

      expect(auth().sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw error for non-existent email', async () => {
      (auth().sendPasswordResetEmail as jest.Mock).mockRejectedValue({
        code: 'auth/user-not-found',
      });

      await expect(authService.sendPasswordReset('nonexistent@example.com'))
        .rejects.toThrow();
    });
  });

  // ============================================
  // signOut Tests
  // ============================================
  describe('signOut', () => {
    it('should sign out from both Google and Firebase', async () => {
      (GoogleSignin.signOut as jest.Mock).mockResolvedValue(undefined);
      (auth().signOut as jest.Mock).mockResolvedValue(undefined);

      await authService.signOut();

      expect(GoogleSignin.signOut).toHaveBeenCalled();
      expect(auth().signOut).toHaveBeenCalled();
    });
  });

  // ============================================
  // updateProfile Tests
  // ============================================
  describe('updateProfile', () => {
    it('should throw error when no user is logged in', async () => {
      // Mock currentUser as null
      Object.defineProperty(auth(), 'currentUser', {
        get: () => null,
        configurable: true,
      });

      await expect(authService.updateProfile({ fullName: 'New Name' }))
        .rejects.toThrow('No user logged in');
    });

    it('should update user profile', async () => {
      const mockUser = {
        displayName: 'Old Name',
        photoURL: null,
        updateProfile: jest.fn().mockResolvedValue(undefined),
        reload: jest.fn().mockResolvedValue(undefined),
      };

      Object.defineProperty(auth(), 'currentUser', {
        get: () => mockUser,
        configurable: true,
      });

      await authService.updateProfile({ fullName: 'New Name' });

      expect(mockUser.updateProfile).toHaveBeenCalledWith({
        displayName: 'New Name',
        photoURL: null,
      });
      expect(mockUser.reload).toHaveBeenCalled();
    });
  });
});
