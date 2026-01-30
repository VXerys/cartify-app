/**
 * RootLayout Tests
 *
 * UI tests for the root layout navigation guard.
 */

import RootLayout from "@/app/_layout";
import { render, waitFor } from "@testing-library/react-native";
import React from "react";

const mockReplace = jest.fn();
const mockReact = React;

jest.mock("expo-router", () => {
  const Stack = ({ children }: { children: React.ReactNode }) =>
    mockReact.createElement(mockReact.Fragment, null, children);
  const StackScreen = () => null;
  StackScreen.displayName = "StackScreen";
  Stack.Screen = StackScreen;
  return {
    Stack,
    useRouter: () => ({
      replace: mockReplace,
      push: jest.fn(),
      back: jest.fn(),
    }),
    useSegments: () => ["(tabs)"],
  };
});

jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

jest.mock("expo-sqlite", () => ({
  SQLiteProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSQLiteContext: () => ({}),
}));

jest.mock("@/src/services/db", () => ({
  migrateDbIfNeeded: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  DefaultTheme: {},
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("react-native-gesture-handler", () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("sonner-native", () => ({
  Toaster: () => null,
}));

const mockAuthState = { isAuthenticated: false, isLoading: false };

jest.mock("@/src/context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => mockAuthState,
}));

describe("RootLayout", () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it("redirects unauthenticated users to onboarding", async () => {
    render(<RootLayout />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/onboarding");
    });
  });
});
