/**
 * OnboardingPage Tests
 *
 * UI tests for the onboarding flow screen.
 */

import OnboardingPage from "@/app/onboarding";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/src/components/onboarding", () => {
  const React = require("react");
  const { Text, TouchableOpacity, View } = require("react-native");
  return {
    SplashScreen: ({ onFinish }: { onFinish: () => void }) => (
      <TouchableOpacity testID="splash-finish" onPress={onFinish}>
        <Text>SplashScreen</Text>
      </TouchableOpacity>
    ),
    OnboardingScreen: ({
      onGetStarted,
      onLogin,
    }: {
      onGetStarted: () => void;
      onLogin: () => void;
    }) => (
      <View>
        <Text>OnboardingScreen</Text>
        <TouchableOpacity
          testID="onboarding-get-started"
          onPress={onGetStarted}
        >
          <Text>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="onboarding-login" onPress={onLogin}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    ),
  };
});

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
