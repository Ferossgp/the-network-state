import { useTheme } from '@shopify/restyle'
import { Stack } from 'expo-router'

export default function ContactsLayout() {
  const { colors } = useTheme()
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="contact/[id]"
        options={{
          contentStyle: {
            backgroundColor: colors['background-light'],
          },
        }}
      />
    </Stack>
  )
}
