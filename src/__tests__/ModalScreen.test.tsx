/**
 * ModalScreen Tests
 *
 * UI tests for the modal screen.
 */

import ModalScreen from "@/app/modal";
import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

jest.mock("@/src/components/themed-text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    ThemedText: ({ children }: { children: React.ReactNode }) => (
      <Text>{children}</Text>
    ),
  };
});

jest.mock("@/src/components/themed-view", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ThemedView: ({ children }: { children: React.ReactNode }) => (
      <View>{children}</View>
    ),
  };
});

describe("ModalScreen", () => {
  it("renders modal content", () => {
    const { getByText } = render(<ModalScreen />);

    expect(getByText("This is a modal")).toBeTruthy();
    expect(getByText("Go to home screen")).toBeTruthy();
  });
});
