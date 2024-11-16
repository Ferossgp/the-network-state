import ParallaxScrollView from "@/components/ParallaxScrollView";
import { TAB_BAR_HEIGHT } from "@/components/tab-bar";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { contactTable } from "@/db/schema";
import { useLiveQuery } from "@/db/use-live-query";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { Link, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Linking } from "react-native";

export default function ContactScreen() {
  const params = useLocalSearchParams<{ id: string }>()
  const { data: contact } = useLiveQuery((db) =>
    db.query.contactTable.findFirst({
      where: eq(contactTable.id, Number(params.id)),
    }),
  )

  const onBlockscoutPress = () => {
    Linking.openURL(`https://polygon.blockscout.com/tx/${contact?.raw?.tx_hash}`)
  }

  if (!contact) return null

  return (
    <ParallaxScrollView headerBackgroundColor={contact.color}
      headerImage={<Box />}>
      <StatusBar style={'dark'} />
      <Box gap={4} flex={1}>
        <Text variant="title">{contact.name}</Text>
        <Text variant="body">{contact.headline}</Text>
        <Box backgroundColor="surface-light" padding={3} gap={4} borderRadius="md" width="100%">
          <Box gap={1}>
            <Text color="foreground-secondary-light" variant="large" fontWeight="500">
              Detected on:
            </Text>
            <Text color="foreground-light">
              {format(new Date(contact.raw?.created_at), 'MMM dd, yyyy')}
            </Text>
          </Box>
          <Box gap={1}>
            <Text color="foreground-secondary-light" variant="large" fontWeight="500">
              Transcript:
            </Text>
            <Text color="foreground-light">
              {contact.description}
            </Text>
          </Box>
        </Box>
        <Button variant="primary" onPress={onBlockscoutPress}>
          View on Blockscout
        </Button>
      </Box>
      <Box height={TAB_BAR_HEIGHT} />
    </ParallaxScrollView>
  )
}