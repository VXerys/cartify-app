/**
 * HomeScreen Tests
 *
 * UI tests for the Home screen (main screen).
 */

import React from "react";
import { render } from "@testing-library/react-native";
import HomeScreen from "@/app/(tabs)/index";

jest.mock("expo-sqlite", () => ({
  useSQLiteContext: () => ({}),
}));

jest.mock("@/src/hooks/useResponsive", () => ({
  useResponsive: () => ({
    moderateScale: (size: number) => size,
    isTablet: false,
    contentContainerStyle: {},
    containerPadding: 16,
  }),
}));

jest.mock("@/src/hooks/useSettings", () => ({
  useSettings: () => ({
    voiceButtonPosition: "right",
  }),
}));

jest.mock("@/src/hooks/useVoiceInput", () => ({
  useVoiceInput: () => ({
    isListening: false,
    transcript: "",
    finalResult: null,
    startRecording: jest.fn(),
    stopRecording: jest.fn(),
    error: null,
  }),
}));

jest.mock("@/src/components/home/BudgetCard", () => ({
  BudgetCard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/src/components/home/BudgetModal", () => ({
  BudgetModal: () => null,
}));

jest.mock("@/src/components/home/CategorySlider", () => ({
  CategorySlider: () => null,
}));

jest.mock("@/src/components/home/EditItemModal", () => ({
  EditItemModal: () => null,
}));

jest.mock("@/src/components/home/HomeHeader", () => ({
  HomeHeader: () => null,
}));

jest.mock("@/src/components/home/StatsRow", () => ({
  StatsRow: () => null,
}));

jest.mock("@/src/components/ui/AppModal", () => ({
  AppModal: () => null,
}));

jest.mock("@/src/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));

jest.mock("@/src/components/voice/VoiceFeedback", () => ({
  VoiceFeedback: () => null,
}));

jest.mock("@/src/components/VoiceFloatingButton", () => ({
  VoiceFloatingButton: () => null,
}));

jest.mock("@/src/components/VoiceShoppingCard", () => ({
  VoiceShoppingCard: () => null,
}));

jest.mock("@/src/services/db", () => ({
  insertTransaction: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/src/services/groqService", () => ({
  groqService: {
    analyzeVoiceText: jest.fn(),
  },
}));

describe("HomeScreen", () => {
  it("renders empty cart state", () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText("home.cartEmpty")).toBeTruthy();
    expect(getByText("home.tapMic")).toBeTruthy();
  });
});
