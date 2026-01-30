/**
 * TermsPolicyScreen Tests
 *
 * UI tests for the Terms & Policy screen.
 */

import TermsPolicyScreen from "@/app/terms-policy";
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

describe("TermsPolicyScreen", () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it("renders key content", () => {
    const { getByText } = render(<TermsPolicyScreen />);

    expect(getByText("Syarat & Kebijakan")).toBeTruthy();
    expect(getByText("Terakhir diperbarui: 19 Desember 2025")).toBeTruthy();
    expect(getByText("1. Pendahuluan")).toBeTruthy();
    expect(getByText("5. Hubungi Kami")).toBeTruthy();
  });

  it("navigates back when back button pressed", () => {
    const { getByTestId } = render(<TermsPolicyScreen />);

    fireEvent.press(getByTestId("terms-policy-back-button"));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
