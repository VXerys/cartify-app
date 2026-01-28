/**
 * AuthScreen Tests
 *
 * UI tests for the auth flow screen.
 */

import AuthPage from "@/app/auth";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: mockReplace,
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/src/context/AuthContext", () => ({
  useAuth: () => ({
    signInWithEmail: jest.fn().mockResolvedValue(undefined),
    signUp: jest.fn().mockResolvedValue({ requiresVerification: true }),
    signInWithGoogle: jest.fn().mockResolvedValue(undefined),
    sendPasswordReset: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock("@/src/components/auth", () => {
  const React = require("react");
  const { Text, TouchableOpacity, View } = require("react-native");
  return {
    LoginScreen: ({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) => (
      <View>
        <Text>LoginScreen</Text>
        <TouchableOpacity testID="auth-login-submit" onPress={() => onLogin("test@example.com", "Password123")}> 
          <Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="auth-go-register" onPress={onRegister}>
          <Text>Go Register</Text>
        </TouchableOpacity>
      </View>
    ),
    RegisterScreen: ({ onRegister, onLogin }: { onRegister: () => void; onLogin: () => void }) => (
      <View>
        <Text>RegisterScreen</Text>
        <TouchableOpacity testID="auth-register-submit" onPress={() => onRegister("Test User", "test@example.com", "Password123")}>
          <Text>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="auth-go-login" onPress={onLogin}>
          <Text>Go Login</Text>
        </TouchableOpacity>
      </View>
    ),
    ForgotPasswordScreen: ({ onBackToLogin }: { onBackToLogin: () => void }) => (
      <View>
        <Text>ForgotPasswordScreen</Text>
        <TouchableOpacity testID="auth-forgot-back" onPress={onBackToLogin}>
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
    ),
    VerificationPendingScreen: ({ onBackToLogin }: { onBackToLogin: () => void }) => (
      <View>
        <Text>VerificationPendingScreen</Text>
        <TouchableOpacity testID="auth-verify-back" onPress={onBackToLogin}>
          <Text>Back to login</Text>
        </TouchableOpacity>
      </View>
    ),
  };
});

describe("AuthPage", () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it("renders login screen by default", () => {
    const { getByText } = render(<AuthPage />);

    expect(getByText("LoginScreen")).toBeTruthy();
  });

  it("switches to register screen", () => {
    const { getByTestId, getByText } = render(<AuthPage />);

    fireEvent.press(getByTestId("auth-go-register"));

    expect(getByText("RegisterScreen")).toBeTruthy();
  });

  it("navigates to tabs after login success", async () => {
    const { getByTestId, findByText } = render(<AuthPage />);

    fireEvent.press(getByTestId("auth-login-submit"));

    await findByText("LoginScreen");
    expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
  });

  it("shows verification pending after register", async () => {
    const { getByTestId, findByText } = render(<AuthPage />);

    fireEvent.press(getByTestId("auth-go-register"));
    fireEvent.press(getByTestId("auth-register-submit"));

    expect(await findByText("VerificationPendingScreen")).toBeTruthy();
  });
});
