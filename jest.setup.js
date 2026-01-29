/* eslint-env jest */
/**
 * Jest Setup File
 *
 * Global mocks and configurations for all tests
 */

// Define __DEV__ for React Native
global.__DEV__ = true;
process.env.EXPO_OS = process.env.EXPO_OS || "ios";

// Silence React 19 react-test-renderer deprecation warning in test output
const originalConsoleError = console.error;
console.error = (...args) => {
  const first = args[0];
  if (typeof first === "string" && first.includes("react-test-renderer is deprecated")) {
    return;
  }
  originalConsoleError(...args);
};

// Mock react-native modules that are commonly used
jest.mock("react-native/Libraries/Utilities/Dimensions", () => ({
  get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock PixelRatio to avoid native calls in tests
jest.mock("react-native/Libraries/Utilities/PixelRatio", () => ({
  get: jest.fn(() => 1),
  roundToNearestPixel: jest.fn((size) => size),
}));

// Mock react-native base module using RN Jest mock and override PixelRatio
jest.mock("react-native", () => {
  const rnMock = jest.requireActual("react-native/jest/mock");
  rnMock.View = rnMock.View || "View";
  rnMock.Text = rnMock.Text || "Text";
  rnMock.TextInput = rnMock.TextInput || rnMock.Text;
  rnMock.Image = rnMock.Image || "Image";
  rnMock.KeyboardAvoidingView = rnMock.KeyboardAvoidingView || rnMock.View;
  rnMock.Modal = rnMock.Modal || rnMock.View;
  rnMock.ScrollView = rnMock.ScrollView || rnMock.View;
  rnMock.TouchableOpacity = rnMock.TouchableOpacity || rnMock.View;
  rnMock.Pressable = rnMock.Pressable || rnMock.View;
  rnMock.Dimensions = rnMock.Dimensions || {
    get: () => ({ width: 375, height: 812 }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  rnMock.ActivityIndicator = rnMock.ActivityIndicator || rnMock.View;
  rnMock.Platform = rnMock.Platform || {
    OS: process.env.EXPO_OS || "ios",
    select: (options) => {
      if (!options) return undefined;
      const os = process.env.EXPO_OS || "ios";
      return options[os] ?? options.default ?? options.android;
    },
  };
  if (!rnMock.FlatList) {
    const React = require("react");
    const { View } = rnMock;
    rnMock.FlatList = ({ ListEmptyComponent }) => (
      React.createElement(View, null, ListEmptyComponent || null)
    );
  }
  rnMock.RefreshControl = rnMock.RefreshControl || rnMock.View;
  rnMock.StatusBar = rnMock.StatusBar || "StatusBar";
  rnMock.PixelRatio = {
    get: jest.fn(() => 1),
    roundToNearestPixel: jest.fn((size) => size),
  };
  rnMock.StyleSheet = {
    create: (styles) => styles,
    hairlineWidth: 1,
    absoluteFillObject: {},
    flatten: (style) => style,
  };
  return rnMock;
});

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
  MaterialIcons: "MaterialIcons",
  FontAwesome: "FontAwesome",
}));

// Mock MaterialIcons submodule directly (used by IconSymbol)
jest.mock("@expo/vector-icons/MaterialIcons", () => {
  return "MaterialIcons";
});

// Mock React Native Reanimated
jest.mock("react-native-reanimated", () => {
  const chainable = () => {
    const chain = {};
    chain.duration = () => chain;
    chain.delay = () => chain;
    chain.springify = () => ({
      damping: () => ({ mass: () => ({ stiffness: () => ({}) }) }),
    });
    chain.damping = () => chain;
    return chain;
  };

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
      View: "View",
      Text: "Text",
      Image: "Image",
      ScrollView: "ScrollView",
    },
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((value) => value),
    withSpring: jest.fn((value) => value),
    withDelay: jest.fn((_, animation) => animation),
    withRepeat: jest.fn((animation) => animation),
    withSequence: jest.fn((...animations) => animations[animations.length - 1]),
    Easing: {
      in: (fn) => fn,
      out: (fn) => fn,
      cubic: jest.fn(),
    },
    FadeIn: chainable(),
    FadeInUp: chainable(),
    FadeInDown: chainable(),
    ZoomIn: chainable(),
    ZoomOut: chainable(),
    interpolate: jest.fn(),
    Extrapolate: { CLAMP: "clamp" },
  };
});

// Mock Firebase Auth
jest.mock("@react-native-firebase/auth", () => {
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
jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({ data: { idToken: "mock-token" } }),
    signOut: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock Async Storage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
}));

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
  };
});

// Mock expo-localization to avoid native module access in tests
jest.mock("expo-localization", () => ({
  locale: "en-US",
  timezone: "UTC",
  getLocales: () => [{ languageCode: "en", countryCode: "US", languageTag: "en-US" }],
  getCalendars: () => [],
}));

// Mock sonner-native
jest.mock("sonner-native", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}));

// Mock i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: "en",
      changeLanguage: jest.fn(),
    },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: jest.fn(),
  },
}));

// Global test timeout
jest.setTimeout(10000);
