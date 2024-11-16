import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import type { Contact } from '@/db/schema'
import { router } from 'expo-router'
import { Pressable } from 'react-native-gesture-handler'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Avatar } from '@/components/ui/avatar'

export const ContactListItem: React.FC<{
  contact: Contact
  index: number
}> = ({ contact, index }) => {
  return (
    <Animated.View entering={index < 10 ? FadeInDown.delay(index * 100) : undefined}>
      <Pressable
        onPress={() =>
          router.navigate({
            pathname: '/contact/[id]',
            params: { id: contact.id },
          })
        }
      >
        <Box
          backgroundColor="card"
          borderRadius="lg"
          flexDirection="row"
          overflow="hidden"
          padding={3}
          gap={3}
          style={{
            borderCurve: 'continuous',
          }}
        >
          <Avatar
            variant="lg"
            color={contact.color}
            style={{
              borderCurve: 'continuous',
            }}
          />

          <Box flex={1} gap={1} justifyContent="center">
            <Text variant="h3">{contact.name}</Text>
            {contact.headline ? (
              <Text color="foreground-light">{contact.headline}</Text>
            ) : null}
          </Box>
        </Box>
      </Pressable>
    </Animated.View>
  )
}
