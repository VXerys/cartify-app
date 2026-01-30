/**
 * ModalScreen Tests
 *
 * UI tests for the modal screen.
 */

import ModalScreen from "@/app/modal";
import { render } from "@testing-library/react-native";
import React from "react";
import { Text, View } from "react-native";

const MockText = Text;
const MockView = View;

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

jest.mock("@/src/components/themed-text", () => ({
  ThemedText: ({ children }: { children: React.ReactNode }) => (
    <MockText>{children}</MockText>
  ),
}));

jest.mock("@/src/components/themed-view", () => ({
  ThemedView: ({ children }: { children: React.ReactNode }) => (
    <MockView>{children}</MockView>
  ),
}));

describe("ModalScreen", () => {
  it("renders modal content", () => {
    const { getByText } = render(<ModalScreen />);

    expect(getByText("This is a modal")).toBeTruthy();
    expect(getByText("Go to home screen")).toBeTruthy();
  });
});
