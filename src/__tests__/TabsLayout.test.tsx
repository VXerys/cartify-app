/**
 * TabsLayout Tests
 *
 * UI tests for the tabs layout.
 */

import TabLayout from "@/app/(tabs)/_layout";
import { render } from "@testing-library/react-native";
import React from "react";

const screenCalls: { name: string; options: any }[] = [];
const mockReact = React;

jest.mock("@/src/components/ui/TabBar", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/src/components/ui/icon-symbol", () => ({
  IconSymbol: () => null,
}));

jest.mock("expo-router", () => {
  const Tabs = ({ children }: { children: React.ReactNode }) =>
    mockReact.createElement(mockReact.Fragment, null, children);
  const TabsScreen = ({ name, options }: { name: string; options: any }) => {
    screenCalls.push({ name, options });
    return null;
  };
  TabsScreen.displayName = "TabsScreen";
  Tabs.Screen = TabsScreen;
  return { Tabs };
});

describe("TabLayout", () => {
  beforeEach(() => {
    screenCalls.length = 0;
  });

  it("registers expected tabs", () => {
    render(<TabLayout />);

    const names = screenCalls.map((c) => c.name);

    expect(names).toEqual(["index", "history", "settings"]);
  });
});
