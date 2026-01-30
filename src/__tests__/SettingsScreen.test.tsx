/**
 * SettingsScreen Tests
 *
 * UI tests for the Settings screen (main screen).
 */

import SettingsScreen from "@/app/(tabs)/settings";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

const mockPush = jest.fn();
const mockUser = {
  fullName: "Test User",
  email: "test@example.com",
  avatarUrl: null,
};

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/src/hooks/useResponsive", () => ({
  useResponsive: () => ({
    moderateScale: (size: number) => size,
    containerPadding: 16,
    contentContainerStyle: {},
  }),
}));

jest.mock("@/src/hooks/useSettings", () => ({
  useSettings: () => ({
    voiceButtonPosition: "right",
    setVoiceButtonPosition: jest.fn(),
  }),
}));

jest.mock("@/src/context/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    signOut: jest.fn(),
    updateProfile: jest.fn(),
  }),
}));

jest.mock("../../app/(tabs)/settings/ProfileCard", () => ({
  ProfileCard: () => null,
}));

jest.mock("../../app/(tabs)/settings/SettingsModals", () => ({
  EditProfileModal: () => null,
  AvatarModal: () => null,
  PasswordModal: () => null,
  LanguageModal: () => null,
  VoicePositionModal: () => null,
  LogoutModal: () => null,
}));

describe("SettingsScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders key sections", () => {
    const { getByText } = render(<SettingsScreen />);

    expect(getByText("settings.preferences")).toBeTruthy();
    expect(getByText("settings.account")).toBeTruthy();
    expect(getByText("settings.support")).toBeTruthy();
  });

  it("navigates to Help Center, Security, and Terms", () => {
    const { getByTestId } = render(<SettingsScreen />);

    fireEvent.press(getByTestId("settings-help-center"));
    expect(mockPush).toHaveBeenCalledWith("/help-center");

    fireEvent.press(getByTestId("settings-security-privacy"));
    expect(mockPush).toHaveBeenCalledWith("/security-privacy");

    fireEvent.press(getByTestId("settings-terms-policy"));
    expect(mockPush).toHaveBeenCalledWith("/terms-policy");
  });
});
