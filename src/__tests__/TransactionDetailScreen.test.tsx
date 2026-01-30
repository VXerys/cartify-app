/**
 * TransactionDetailScreen Tests
 *
 * UI tests for transaction detail screen.
 */

import TransactionDetailScreen from "@/app/transaction/[id]";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: mockBack,
  }),
  useLocalSearchParams: () => ({ id: "1" }),
  Stack: {
    Screen: () => null,
  },
}));

jest.mock("expo-sqlite", () => ({
  useSQLiteContext: () => ({}),
}));

jest.mock("@/src/hooks/useResponsive", () => ({
  useResponsive: () => ({
    moderateScale: (size: number) => size,
    verticalScale: (size: number) => size,
    containerPadding: 16,
    contentContainerStyle: {},
  }),
}));

jest.mock("@/src/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));

jest.mock("@/src/services/db", () => ({
  getTransactionDetails: jest.fn().mockResolvedValue(null),
}));

describe("TransactionDetailScreen", () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it("renders not-found state", async () => {
    const { findByText } = render(<TransactionDetailScreen />);

    expect(await findByText("transaction.notFound")).toBeTruthy();
  });

  it("navigates back when back button pressed", async () => {
    const { findByTestId } = render(<TransactionDetailScreen />);

    fireEvent.press(await findByTestId("transaction-back-button"));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
