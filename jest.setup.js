/**
 * Jest Setup File
 * 
 * Global mocks and configurations for all tests
 */

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
  FontAwesome: 'FontAwesome',
}));

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  return {
    __esModule: true,
    default: {
      call: () => {},
      createAnimatedComponent: (component) => component,
      Value: jest.fn(),
      event: jest.fn(),
      add: jest.fn(),
      eq: jest.fn(),
      set: jest.fn(),
      cond: jest.fn(),
      interpolate: jest.fn(),
      View: 'Animated.View',
      Text: 'Animated.Text',
      Image: 'Animated.Image',
      ScrollView: 'Animated.ScrollView',
    },
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((value) => value),
    withSpring: jest.fn((value) => value),
    withDelay: jest.fn((_, animation) => animation),
    FadeIn: { duration: () => ({ delay: () => ({}) }) },
    FadeInUp: { duration: () => ({ delay: () => ({}) }), delay: () => ({ duration: () => ({}) }) },
    FadeInDown: { duration: () => ({ delay: () => ({}) }), delay: () => ({ duration: () => ({}) }) },
    interpolate: jest.fn(),
    Extrapolate: { CLAMP: 'clamp' },
  };
});

// Mock Firebase Auth
jest.mock('@react-native-firebase/auth', () => {
  const mockAuth = {
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithCredential: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    }),
  };

  const auth = () => mockAuth;
  auth.GoogleAuthProvider = {
    credential: jest.fn(),
  };

  return {
    __esModule: true,
    default: auth,
    FirebaseAuthTypes: {},
  };
});

// Mock Google Sign-In
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({ data: { idToken: 'mock-token' } }),
    signOut: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
}));

// Mock Async Storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
  };
});

// Mock sonner-native
jest.mock('sonner-native', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}));

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));

// Global test timeout
jest.setTimeout(10000);
