/**
 * AuthScreen Tests
 *
 * UI tests for the auth flow screen.
 */

import AuthPage from "@/app/auth";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const mockReplace = jest.fn();
const MockText = Text;
const MockTouchableOpacity = TouchableOpacity;
const MockView = View;

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

jest.mock("@/src/components/auth", () => ({
  LoginScreen: ({ onLogin, onRegister }: { onLogin: (email: string, password: string) => void; onRegister: () => void }) => (
    <MockView>
      <MockText>LoginScreen</MockText>
      <MockTouchableOpacity testID="auth-login-submit" onPress={() => onLogin("test@example.com", "Password123")}>
        <MockText>Login</MockText>
      </MockTouchableOpacity>
      <MockTouchableOpacity testID="auth-go-register" onPress={onRegister}>
        <MockText>Go Register</MockText>
      </MockTouchableOpacity>
    </MockView>
  ),
  RegisterScreen: ({ onRegister, onLogin }: { onRegister: (fullName: string, email: string, password: string) => void; onLogin: () => void }) => (
    <MockView>
      <MockText>RegisterScreen</MockText>
      <MockTouchableOpacity testID="auth-register-submit" onPress={() => onRegister("Test User", "test@example.com", "Password123")}>
        <MockText>Register</MockText>
      </MockTouchableOpacity>
      <MockTouchableOpacity testID="auth-go-login" onPress={onLogin}>
        <MockText>Go Login</MockText>
      </MockTouchableOpacity>
    </MockView>
  ),
  ForgotPasswordScreen: ({ onBackToLogin }: { onBackToLogin: () => void }) => (
    <MockView>
      <MockText>ForgotPasswordScreen</MockText>
      <MockTouchableOpacity testID="auth-forgot-back" onPress={onBackToLogin}>
        <MockText>Back</MockText>
      </MockTouchableOpacity>
    </MockView>
  ),
  VerificationPendingScreen: ({ onBackToLogin }: { onBackToLogin: () => void }) => (
    <MockView>
      <MockText>VerificationPendingScreen</MockText>
      <MockTouchableOpacity testID="auth-verify-back" onPress={onBackToLogin}>
        <MockText>Back to login</MockText>
      </MockTouchableOpacity>
    </MockView>
  ),
}));

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
