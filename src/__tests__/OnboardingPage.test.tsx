/**
 * OnboardingPage Tests
 *
 * UI tests for the onboarding flow screen.
 */

import OnboardingPage from "@/app/onboarding";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const mockPush = jest.fn();
const MockText = Text;
const MockTouchableOpacity = TouchableOpacity;
const MockView = View;

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/src/components/onboarding", () => ({
  SplashScreen: ({ onFinish }: { onFinish: () => void }) => (
    <MockTouchableOpacity testID="splash-finish" onPress={onFinish}>
      <MockText>SplashScreen</MockText>
    </MockTouchableOpacity>
  ),
  OnboardingScreen: ({
    onGetStarted,
    onLogin,
  }: {
    onGetStarted: () => void;
    onLogin: () => void;
  }) => (
    <MockView>
      <MockText>OnboardingScreen</MockText>
      <MockTouchableOpacity testID="onboarding-get-started" onPress={onGetStarted}>
        <MockText>Get Started</MockText>
      </MockTouchableOpacity>
      <MockTouchableOpacity testID="onboarding-login" onPress={onLogin}>
        <MockText>Login</MockText>
      </MockTouchableOpacity>
    </MockView>
  ),
}));

describe("OnboardingPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders splash screen first", () => {
    const { getByText } = render(<OnboardingPage />);

    expect(getByText("SplashScreen")).toBeTruthy();
  });

  it("navigates to auth when Get Started pressed", async () => {
    const { getByTestId, findByText } = render(<OnboardingPage />);

    fireEvent.press(getByTestId("splash-finish"));

    await findByText("OnboardingScreen");

    fireEvent.press(getByTestId("onboarding-get-started"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth");
    });
  });

  it("navigates to auth when Login pressed", async () => {
    const { getByTestId, findByText } = render(<OnboardingPage />);

    fireEvent.press(getByTestId("splash-finish"));

    await findByText("OnboardingScreen");

    fireEvent.press(getByTestId("onboarding-login"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth");
    });
  });
});
