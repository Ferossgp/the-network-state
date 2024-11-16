import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import type React from 'react'
import { router } from 'expo-router'
import { ActivityIndicator, Pressable } from 'react-native'
import { FadeIn, FadeInRight, FadeOutRight, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import { buttonSize } from '@/theme'
import { Button } from './ui/button'
import { AnimatedBox, Box } from './ui/box'
import { Icon } from './ui/icons'
import { Surface } from './ui/surface'
import { BottomSheet, BottomSheetContent, BottomSheetTrigger } from './ui/bottom-sheet'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import { Text } from './ui/text'
import Recorder from './recorder'
import { syncServerRecordings } from '@/lib/api'
import { useTheme } from '@shopify/restyle'

const HIT_SLOP = 10
export const TAB_BAR_HEIGHT = buttonSize.large + 4 + 4

const ROUTE_NAMES_TO_ICON: Record<string, string> = {
  index: 'albums',
  contacts: 'people',
}

const AddContact = () => {
  const [open, setOpen] = useState(false)
  const insets = useSafeAreaInsets()
  return (
    <BottomSheet open={open} onOpenChange={setOpen}>
      <Button
        variant="icon"
        hitSlop={HIT_SLOP}
        onPress={() => setOpen(true)}
      >
        <Icon size={24} name="add" color="primary-foreground" />
      </Button>
      <BottomSheetContent>
        <BottomSheetView>
          <Box padding={3}>
            <Text variant="title" color="foreground-dark">Add Contact</Text>
            <Recorder onDismiss={() => setOpen(false)} />
          </Box>
          <Box height={insets.bottom} />
        </BottomSheetView>
      </BottomSheetContent>
    </BottomSheet>
  )
}

const SyncButton = () => {
  const { colors } = useTheme()
  const [loading, setLoading] = useState(false)

  const onPress = async () => {
    setLoading(true)
    await syncServerRecordings().finally(() => setLoading(false))
  }

  return (
    <Button variant="icon" hitSlop={HIT_SLOP} onPress={onPress} loading={loading}>
      {loading ? (
        <ActivityIndicator size="small" color={colors['primary-foreground']} />
      ) :
        <Icon size={24} name="reload-outline" color="primary-foreground" />}
    </Button>
  )
}

export const BackButton = () => {
  return (
    <AnimatedBox entering={FadeInRight} exiting={FadeOutRight}>
      <Button variant="back-icon" onPress={router.back} hitSlop={HIT_SLOP}>
        <Icon size={24} name="arrow-back-outline" color="tab-bar-button-active" />
      </Button>
    </AnimatedBox>
  )
}

export const TabBar: React.FC<BottomTabBarProps> = ({ navigation, state, insets }) => {
  const { bottom } = insets
  const route = state.routes[state.index]
  const canGoBack = route?.state?.index && route.state.index > 0

  return (
    <Box
      pointerEvents="box-none"
      position="absolute"
      left={0}
      right={0}
      bottom={0}
      paddingHorizontal={4}
      paddingBottom={1}
    >
      <Box flex={1} pointerEvents="box-none" style={{ paddingBottom: bottom }}>
        <Box flexDirection="row" flex={1} pointerEvents="box-none" alignItems="center">
          {canGoBack ? <BackButton /> : null}
          <Box flex={1} pointerEvents="box-none" />
          <SyncButton />
        </Box>
        <Box
          position="absolute"
          left={0}
          right={0}
          alignItems="center"
          flex={1}
          pointerEvents="box-none"
        >
          <Surface
            borderRadius="full"
            backgroundColor="tab-bar-background"
            flexDirection="row"
          >
            <Box gap={2} flexDirection="row" padding={1} height={buttonSize.large}>
              {state.routes.map((route, index) => {
                const isFocused = state.index === index
                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  })

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name)
                  }
                }

                return (
                  <Pressable onPress={onPress} hitSlop={HIT_SLOP} key={route.name}>
                    <AnimatedBox
                      entering={FadeIn.duration(100)}
                      key={`${route.name}-${isFocused}`}
                      height="100%"
                      aspectRatio={1}
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="full"
                      backgroundColor={
                        isFocused ? 'tab-bar-button-active' : 'tab-bar-button-inactive'
                      }
                    >
                      <Icon
                        size={24}
                        name={ROUTE_NAMES_TO_ICON[route.name]}
                        color={isFocused ? 'tab-bar-background' : 'tab-bar-button-active'}
                      />
                    </AnimatedBox>
                  </Pressable>
                )
              })}
            </Box>
          </Surface>
        </Box>
      </Box>
    </Box>
  )
}
