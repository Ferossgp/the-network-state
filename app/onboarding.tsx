import { AnimatedBox, Box } from '@/components/ui/box'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect, useState } from 'react'
import {
  Gesture,
  GestureDetector,
  PanGestureHandlerEventPayload,
  type GestureStateChangeEvent,
} from 'react-native-gesture-handler'
import {
  CurvedTransition,
  FadeIn,
  FadeOutDown,
  LinearTransition,
  runOnJS,
  useAnimatedKeyboard,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { ownerTable } from '@/db/schema'
import { Input } from '@/components/ui/input'
import { db } from '@/db/drizzle'
import { Button } from '@/components/ui/button'

const Slide: React.FC<
  React.PropsWithChildren<{
    expanded: boolean
    paddingTop?: number
    title: string
    onPress: () => void
    layout?: 'linear' | 'none'
  }>
> = ({ expanded, title, children, paddingTop, layout = 'none', onPress }) => {
  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: expanded ? withTiming(1) : withTiming(0.5),
    }
  })

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(onPress)()
  })

  const [disableTransition, setDisableTransition] = useState(false)

  useEffect(() => {
    if (layout === 'none' && !expanded) setDisableTransition(false)
  }, [expanded])

  const onEnd = useCallback(
    (finished: boolean) => {
      'worklet'
      if (finished && layout === 'none') runOnJS(setDisableTransition)(true)
    },
    [layout],
  )

  const _layout = !disableTransition ? LinearTransition.withCallback(onEnd) : undefined

  return (
    <GestureDetector gesture={tapGesture}>
      <AnimatedBox
        layout={_layout}
        backgroundColor="card"
        borderRadius="lg"
        flex={expanded ? 1 : 0}
        minHeight={64}
        style={{
          paddingTop: paddingTop,
        }}
      >
        <Box alignItems={expanded ? 'center' : 'flex-start'}>
          <AnimatedBox padding={4} style={headerStyle} layout={CurvedTransition}>
            <Text variant="title">{title}</Text>
          </AnimatedBox>
        </Box>
        {expanded ? (
          <AnimatedBox flex={1} entering={FadeIn} exiting={FadeOutDown}>
            {children}
          </AnimatedBox>
        ) : null}
      </AnimatedBox>
    </GestureDetector>
  )
}

export default function Onboarding() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [name, setName] = useState('')

  const onConinue = useCallback(async () => {
    if (activeIndex < 3) {
      setActiveIndex((prev) => (prev + 1) % 4)
    }
    if (name === '') return

    const result = await db.insert(ownerTable).values({ id: 'owner', name }).execute().catch(console.error)
    console.log(result)
    router.navigate('/')
  }, [db, name, activeIndex])
  const insets = useSafeAreaInsets()
  const keyboard = useAnimatedKeyboard()

  const onSwipeEnd = useCallback(
    (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      setActiveIndex((prev) => {
        if (event.velocityY > 0) {
          return Math.max(0, prev - 1)
        } else {
          return Math.min(3, prev + 1)
        }
      })
    },
    [],
  )

  const swipeGesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .onEnd((event) => {
      runOnJS(onSwipeEnd)(event)
    })

  const style = useAnimatedStyle(() => {
    return {
      paddingBottom: keyboard.height.value - insets.bottom + 8,
    }
  })

  return (
    <GestureDetector gesture={swipeGesture}>
      <AnimatedBox
        gap={1}
        paddingHorizontal={3}
        flex={1}
        style={[
          {
            marginBottom: insets.bottom,
          },
          style,
        ]}
      >
        <StatusBar style={'dark'} />
        <Slide
          layout="linear"
          expanded={activeIndex === 0}
          title="Network State"
          paddingTop={insets.top}
          onPress={() => setActiveIndex(0)}
        >
          <Box alignItems="center" justifyContent="center" flex={1} paddingHorizontal={4} gap={6}>
            <Image
              source={require('@/assets/illustrations/globus.png')}
              style={{
                width: '60%',
                aspectRatio: 1,
              }}
            />
            <Box gap={3}>
              <Text variant="h3" textAlign="center">
                Build relationships that matter.
              </Text>
              <Text variant="body" textAlign="center">
                First value proposition
              </Text>
            </Box>
          </Box>
        </Slide>
        <Slide
          layout="linear"
          expanded={activeIndex === 1}
          title="Offline First"
          onPress={() => setActiveIndex(1)}
        >
          <Box alignItems="center" justifyContent="center" flex={1} paddingHorizontal={4} gap={6}>
            <Image
              source={require('@/assets/illustrations/tunnel.png')}
              style={{
                width: '60%',
                aspectRatio: 1,
              }}
            />
            <Box gap={3}>
              <Text variant="h3" textAlign="center">
                You own your data.
              </Text>
              <Text variant="body" textAlign="center">
                Second value proposition
              </Text>
            </Box>
          </Box>
        </Slide>
        <Slide
          layout="linear"
          expanded={activeIndex === 2}
          title="AI enabled"
          onPress={() => setActiveIndex(2)}
        >
          <Box alignItems="center" justifyContent="center" flex={1} paddingHorizontal={4} gap={6}>
            <Image
              source={require('@/assets/illustrations/ai.png')}
              style={{
                width: '60%',
                aspectRatio: 1,
              }}
            />
            <Box gap={3}>
              <Text variant="h3" textAlign="center">
                AI powered insights.
              </Text>
              <Text variant="body" textAlign="center">
                Third value proposition
              </Text>
            </Box>
          </Box>
        </Slide>
        <Slide
          layout={'none'}
          expanded={activeIndex === 3}
          title="LFG!"
          onPress={() => setActiveIndex(3)}
        >
          <Box justifyContent="center" flex={1} paddingHorizontal={4} gap={4}>
            <Text variant="body" color="foreground-light">
              To get started, please introduce yourself.
            </Text>
            <Input
              variant="onboarding"
              paddingHorizontal={3}
              placeholderTextColor="#5f5f5f"
              onChangeText={setName}
              value={name}
              placeholder="Name"
            />
          </Box>
        </Slide>
        <Button variant="primary" onPress={onConinue}>
          Next
        </Button>
      </AnimatedBox>
    </GestureDetector>
  )
}
