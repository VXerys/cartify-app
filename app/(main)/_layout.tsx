/**
 * Main App Layout (Tabs/Drawer Navigation)
 */

import { colors } from '@/src/theme/colors';
import { Tabs } from 'expo-router';

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.DEFAULT,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background.surface,
          borderTopColor: colors.border.light,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: () => <TabIcon>🏠</TabIcon>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: () => <TabIcon>📜</TabIcon>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: () => <TabIcon>⚙️</TabIcon>,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ children }: { children: string }) {
  return <span style={{ fontSize: 24 }}>{children}</span>;
}
