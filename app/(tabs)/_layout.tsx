import { Redirect, Tabs } from 'expo-router';
import React from 'react';
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
      />
      <Tabs.Screen
        name="contacts"
      />
    </Tabs>
  );
}
