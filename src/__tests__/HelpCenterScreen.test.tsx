/**
 * HelpCenterScreen Tests
 *
 * UI tests for the Help Center screen.
 */

import HelpCenterScreen from "@/app/help-center";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: mockBack,
  }),
  useLocalSearchParams: () => ({}),
  Link: "Link",
}));

jest.mock("@/src/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));

describe("HelpCenterScreen", () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it("renders key content", () => {
    const { getByText, getByTestId } = render(<HelpCenterScreen />);

    expect(getByText("Pusat Bantuan")).toBeTruthy();
    expect(getByText("Kami siap membantu Anda")).toBeTruthy();
    expect(getByText("Pertanyaan Populer")).toBeTruthy();
    expect(getByText("Bagaimana cara mencatat transaksi?")).toBeTruthy();
    expect(getByTestId("help-center-email-button")).toBeTruthy();
  });

  it("navigates back when back button pressed", () => {
    const { getByTestId } = render(<HelpCenterScreen />);

    fireEvent.press(getByTestId("help-center-back-button"));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
