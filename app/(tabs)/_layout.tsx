import { Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '../../src/components/ui/icon-symbol';
import TabBar from '../../src/components/ui/TabBar';

export default function TabLayout() {

  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
             <IconSymbol 
                size={28} 
                name={focused ? "house.fill" : "house"} 
                color={color} 
             />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
             <IconSymbol 
                size={26} 
                name={focused ? "clock.fill" : "clock"} 
                color={color} 
             />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
                size={26} 
                name={focused ? "person.fill" : "person"} 
                color={color} 
            />
          ),
        }}
      />

    </Tabs>
  );
}
