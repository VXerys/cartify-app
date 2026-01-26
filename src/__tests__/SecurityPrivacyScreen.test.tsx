/**
 * SecurityPrivacyScreen Tests
 *
 * UI tests for the Security & Privacy screen.
 */

import SecurityPrivacyScreen from "@/app/security-privacy";
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

jest.mock("expo-sqlite", () => ({
  useSQLiteContext: () => ({}),
}));

jest.mock("@/src/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));

jest.mock("@/app/security-privacy/SecurityItem", () => ({
  SecurityItem: () => null,
}));

jest.mock("@/app/security-privacy/ExportDataModal", () => ({
  ExportDataModal: () => null,
}));

jest.mock("@/app/security-privacy/SecurityModals", () => ({
  ClearHistoryModal: () => null,
  DeleteAccountModal: () => null,
  AppLockModal: () => null,
}));

jest.mock("@/src/services/db", () => ({
  getTransactionsWithItems: jest.fn().mockResolvedValue([]),
  deleteAllTransactions: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/src/services/pdfExportService", () => ({
  exportToCSV: jest.fn().mockResolvedValue({ success: true, message: "ok" }),
  exportToPDF: jest.fn().mockResolvedValue({ success: true, message: "ok" }),
}));

describe("SecurityPrivacyScreen", () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it("renders key content", () => {
    const { getByText } = render(<SecurityPrivacyScreen />);

    expect(getByText("Keamanan & Privasi")).toBeTruthy();
    expect(getByText("KEAMANAN APLIKASI")).toBeTruthy();
    expect(getByText("DATA & PRIVASI")).toBeTruthy();
    expect(getByText("ZONA BAHAYA")).toBeTruthy();
  });

  it("navigates back when back button pressed", () => {
    const { getByTestId } = render(<SecurityPrivacyScreen />);

    fireEvent.press(getByTestId("security-privacy-back-button"));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
