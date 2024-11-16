import { HelloWave } from '@/components/HelloWave';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { FlashList, ListRenderItem } from '@shopify/flash-list'
import { Contact, contactTable } from '@/db/schema';
import { useCallback } from 'react';
import { ContactListItem } from '@/components/home-screen/contact-list-item';
import { useLiveQuery } from '@/db/use-live-query';

const AnimatedFlatList = Animated.createAnimatedComponent(FlashList)

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const { data: contacts } = useLiveQuery((db) =>
    db.select().from(contactTable)
  )

  const renderItem: ListRenderItem<Contact> = useCallback(
    ({ item, index }) => <ContactListItem contact={item} index={index} />,
    [],
  )

  const ListFooterComponent = useCallback(
    () => <Box height={insets.bottom} />,
    [insets.bottom],
  )

  const ItemSeparatorComponent = useCallback(
    () => <Box height={8} backgroundColor="transparent" />,
    [],
  )

  return (
    <Box>
      <Box height={insets.top} />
      <Box paddingHorizontal={2} gap={2} flexDirection="row" alignItems="center">
        <Text variant="title" color="foreground-dark">Network 📒</Text>
      </Box>
      <AnimatedFlatList
        data={contacts}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListFooterComponent={ListFooterComponent}
        estimatedItemSize={110}
        keyExtractor={keyExtractor}
      />
    </Box>
  );
}

const keyExtractor = (item: Contact) => item.id.toString()
