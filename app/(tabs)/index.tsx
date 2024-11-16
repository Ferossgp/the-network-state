import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/HelloWave';
import { HomeListItem } from '@/components/home-screen/home-screen-card';
import { TAB_BAR_HEIGHT } from '@/components/tab-bar';
import { useLiveQuery } from '@/db/use-live-query';
import { db } from '@/db/drizzle';
import { contactTable, recordingsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { stringToHslColor } from '@/lib/colors';

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();
  const { data: recordings } = useLiveQuery(
    (db) =>
      db.query.recordingsTable.findMany(),
    [],
  )

  return (
    <Box flex={1}>
      <Box height={insets.top} />
      <Box paddingHorizontal={2} gap={2} flexDirection="row" alignItems="center">
        <Text variant="header" color="foreground-dark">Welcome!</Text>
        <HelloWave />
      </Box>
      <Box flex={1} paddingHorizontal={3}>
        <Box flex={1}>
          {recordings?.reverse().map((recording, index) => (
            <HomeListItem
              key={recording.id}
              title={recording.name}
              description={recording.description}
              index={index}
              total={recordings.length}
              onLeft={async () => {
                await db.delete(recordingsTable).where(
                  eq(recordingsTable.id, recording.id),
                ).execute()
              }}
              onRight={async () => {
                await db.delete(recordingsTable).where(
                  eq(recordingsTable.id, recording.id),
                ).execute()
                await db
                  .insert(contactTable)
                  .values({
                    name: recording.name,
                    color: stringToHslColor(recording.name),
                    description: recording.description,
                    headline: recording.raw?.headline,
                    raw: recording.raw,
                  })
                  .execute()
              }}
            />
          ))}
        </Box>
      </Box>
      <Box height={insets.bottom + TAB_BAR_HEIGHT} />
    </Box>

  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
