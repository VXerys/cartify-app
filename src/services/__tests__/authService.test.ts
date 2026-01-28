/**
 * AuthService Tests
 *
 * Unit tests for the authentication service.
 * Tests the business logic layer of authentication.
 */

describe('AuthService', () => {
  // Store original module
  let authService: typeof import('../../services/authService').authService;
  let firebaseAuth: typeof import('@react-native-firebase/auth').default;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();

    // Re-import after resetModules so we stub the same mock instance
    const firebaseModule = await import('@react-native-firebase/auth');
    firebaseAuth = firebaseModule.default;

    // Re-import to get fresh instance
    const authModule = await import('../../services/authService');
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
      
      expect(listener).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // signInWithEmail Tests
  // ============================================
  describe('signInWithEmail', () => {
    it('should call Firebase signInWithEmailAndPassword with verified user', async () => {
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        emailVerified: true,
        photoURL: null,
        providerData: [{ providerId: 'password' }],
      };

      (firebaseAuth().signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      });

      const result = await authService.signInWithEmail('test@example.com', 'password123');

      expect(firebaseAuth().signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123');
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

      (firebaseAuth().signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUnverifiedUser,
      });
      (firebaseAuth().signOut as jest.Mock).mockResolvedValue(undefined);

      await expect(authService.signInWithEmail('test@example.com', 'password123'))
        .rejects.toThrow('verify your email');
    });
  });

  // ============================================
  // signUp Tests
  // ============================================
  describe('signUp', () => {
    it('should handle email already in use error', async () => {
      (firebaseAuth().createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: 'auth/email-already-in-use',
      });

      await expect(authService.signUp('existing@example.com', 'Password123', 'Test User'))
        .rejects.toThrow();
    });
  });

  // ============================================
  // sendPasswordReset Tests
  // ============================================
  describe('sendPasswordReset', () => {
    it('should call Firebase sendPasswordResetEmail', async () => {
      (firebaseAuth().sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

      await authService.sendPasswordReset('test@example.com');

      expect(firebaseAuth().sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  // ============================================
  // signOut Tests
  // ============================================
  describe('signOut', () => {
    it('should call Firebase signOut', async () => {
      (firebaseAuth().signOut as jest.Mock).mockResolvedValue(undefined);

      await authService.signOut();

      expect(firebaseAuth().signOut).toHaveBeenCalled();
    });
  });

  // ============================================
  // updateProfile Tests
  // ============================================
  describe('updateProfile', () => {
    it('should throw error when no user is logged in', async () => {
      await expect(authService.updateProfile({ fullName: 'New Name' }))
        .rejects.toThrow('No user logged in');
    });
  });
});
