/**
 * Auth Flow Integration Tests
 *
 * These tests use real auth UI components to validate screen-to-screen flow
 * via the AuthPage container.
 */

import AuthPage from "@/app/auth";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

const mockReplace = jest.fn();
const mockSignInWithEmail = jest.fn();
const mockSignUp = jest.fn();
const mockSignInWithGoogle = jest.fn();
const mockSendPasswordReset = jest.fn();

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
    signInWithEmail: mockSignInWithEmail,
    signUp: mockSignUp,
    signInWithGoogle: mockSignInWithGoogle,
    sendPasswordReset: mockSendPasswordReset,
  }),
}));

jest.mock("@/assets/images/cartify-logo.png", () => 1);

describe("AuthPage integration flow", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSignInWithEmail.mockReset();
    mockSignUp.mockReset();
    mockSignInWithGoogle.mockReset();
    mockSendPasswordReset.mockReset();
  });

  it("navigates to Forgot Password, submits, and returns to login", async () => {
    mockSendPasswordReset.mockResolvedValueOnce(undefined);

    const { getByTestId, getByText, queryByText } = render(<AuthPage />);

    // Start at login
    expect(getByText("Welcome Back")).toBeTruthy();

    // Go to forgot password
    fireEvent.press(getByTestId("login-forgot-password"));
    expect(getByText("Forgot Password?")).toBeTruthy();

    fireEvent.changeText(getByTestId("forgot-email-input"), "test@example.com");
    fireEvent.press(getByTestId("forgot-submit"));

    await waitFor(() => {
      expect(mockSendPasswordReset).toHaveBeenCalledWith("test@example.com");
      expect(getByText("Check Your Email")).toBeTruthy();
    });

    // Back to login
    fireEvent.press(getByText("Back to Sign In"));
    await waitFor(() => {
      expect(queryByText("Welcome Back")).toBeTruthy();
    });
  });

  it("registers and shows verification pending screen", async () => {
    mockSignUp.mockResolvedValueOnce({ requiresVerification: true });

    const { getByTestId, getByText, queryByText } = render(<AuthPage />);

    // Go to register
    fireEvent.press(getByTestId("login-go-register"));
    expect(getByTestId("register-submit")).toBeTruthy();

    fireEvent.changeText(getByTestId("register-fullname-input"), "Test User");
    fireEvent.changeText(getByTestId("register-email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("register-password-input"), "Password123!");
    fireEvent.changeText(getByTestId("register-confirm-password-input"), "Password123!");

    fireEvent.press(getByTestId("register-terms-checkbox"));
    fireEvent.press(getByTestId("register-submit"));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith("test@example.com", "Password123!", "Test User");
      expect(queryByText("Verify Your Email")).toBeTruthy();
      expect(queryByText("test@example.com")).toBeTruthy();
    });
  });

  it("signs in and redirects to tabs", async () => {
    mockSignInWithEmail.mockResolvedValueOnce(undefined);

    const { getByTestId, getByText } = render(<AuthPage />);

    expect(getByText("Welcome Back")).toBeTruthy();

    fireEvent.changeText(getByTestId("login-email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("login-password-input"), "Password123!");
    fireEvent.press(getByTestId("login-submit"));

    await waitFor(() => {
      expect(mockSignInWithEmail).toHaveBeenCalledWith("test@example.com", "Password123!");
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
    });
  });
});
