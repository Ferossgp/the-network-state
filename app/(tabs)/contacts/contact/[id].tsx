import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { contactTable } from "@/db/schema";
import { useLiveQuery } from "@/db/use-live-query";
import { eq } from "drizzle-orm";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function ContactScreen() {
  const params = useLocalSearchParams<{ id: string }>()
  const { data: contact } = useLiveQuery((db) =>
    db.query.contactTable.findFirst({
      where: eq(contactTable.id, Number(params.id)),
    }),
  )

  if (!contact) return null

  return (
    <ParallaxScrollView headerBackgroundColor={contact.color}
      headerImage={<Box />}>
      <StatusBar style={'dark'} />
      <Box padding={3} gap={4} flex={1}>
        <Box backgroundColor="surface-light" padding={3} borderRadius="md">
          <Text color="foreground-light">
            {JSON.stringify(contact, null, 2)}
          </Text>
        </Box>
      </Box>
    </ParallaxScrollView>
  )
}