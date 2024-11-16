import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ownerTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from '@/db/use-live-query';
import { TabBar } from '@/components/tab-bar';

export default function TabLayout() {
  const { data, status } = useLiveQuery((db) =>
    db.query.ownerTable.findFirst({
      where: eq(ownerTable.id, 'owner'),
    })
  );

  if (status === 'pending') {
    return null;
  }

  if (data == null) {
    return <Redirect href="/onboarding" />
  }

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
