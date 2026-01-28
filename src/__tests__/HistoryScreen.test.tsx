/**
 * HistoryScreen Tests
 *
 * UI tests for the History screen (main screen).
 */

import HistoryScreen from "@/app/(tabs)/history";
import { fireEvent, render } from "@testing-library/react-native";
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

jest.mock("expo-sqlite", () => ({
  useSQLiteContext: () => ({}),
}));

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: (cb: () => void) => {
    React.useEffect(() => cb(), [cb]);
  },
}));

jest.mock("@/src/hooks/useResponsive", () => ({
  useResponsive: () => ({
    width: 375,
    moderateScale: (size: number) => size,
    containerPadding: 16,
    contentContainerStyle: {},
    isTablet: false,
  }),
}));

jest.mock("@/src/components/history/HistoryHeader", () => ({
  HistoryHeader: () => null,
}));

jest.mock("@/src/components/history/HistoryCard", () => ({
  HistoryCard: () => null,
}));

jest.mock("@/src/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));

jest.mock("@/src/components/ui/AppModal", () => ({
  AppModal: () => null,
}));

jest.mock("@/src/services/db", () => ({
  getTransactionsWithItems: jest.fn().mockResolvedValue([]),
  deleteTransaction: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("react-native-calendars", () => ({
  Calendar: () => null,
}));

describe("HistoryScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders empty state and header", async () => {
    const { findByText } = render(<HistoryScreen />);

    expect(await findByText("history.recentActivity")).toBeTruthy();
    expect(await findByText("history.noTransactions")).toBeTruthy();
    expect(await findByText("history.noPurchaseYet")).toBeTruthy();
  });

  it("toggles calendar", async () => {
    const { findByTestId } = render(<HistoryScreen />);

    const toggleButton = await findByTestId("history-toggle-calendar");
    fireEvent.press(toggleButton);

    expect(toggleButton).toBeTruthy();
  });
});
