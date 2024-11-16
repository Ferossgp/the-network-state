import { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { AnimatedBox, Box } from "../ui/box";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { Icon } from "../ui/icons";

export const HomeListItem = ({
  title,
  description,
  index,
  total,
  onLeft,
  onRight,
}: {
  index: number; total: number
  title: string
  description: string
  onLeft: () => void
  onRight: () => void
}) => {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const gestureHandler = Gesture.Pan()
    .onChange((event) => {
      translateX.value = event.translationX * 0.8
      translateY.value = event.translationY * 0.2
    })
    .onEnd((event) => {
      const shouldDismiss = Math.abs(event.velocityX) > 500

      const springConfig = {
        mass: 3,
        stiffness: 100,
        damping: 30,
      }
      if (shouldDismiss) {
        translateX.value = withTiming(event.velocityX > 0 ? 500 : -500, {
          duration: 500,
        }, () => {
          if (event.velocityX < 0) {
            runOnJS(onLeft)()
          } else {
            runOnJS(onRight)()
          }
        })
      } else {
        translateX.value = withSpring(0, springConfig)
        translateY.value = withSpring(0, springConfig)
      }
    })

  const onPressRight = () => {
    translateX.value = withTiming(500, {
      duration: 500,
    }, () => {
      runOnJS(onRight)()
    })
  }
  const onPressLeft = () => {
    translateX.value = withTiming(-500, {
      duration: 500,
    }, () => {
      runOnJS(onLeft)()
    })
  }

  const style = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
      zIndex: index,
      opacity: withSpring(index === total - 1 ? 1 : 0.5),
      transform: [
        {
          scale: withSpring(index === total - 1 ? 1 : 0.95),
        },
        {
          rotate: withSpring(index === total - 1 ? '0rad' : index % 2 === 0 ? '0.2rad' : '-0.2rad'),
        },
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${interpolate(translateX.value, [-500, 0, 500], [-30, 0, -30])}deg` },
      ],
    }
  })

  return (
    <GestureDetector gesture={gestureHandler}>
      <AnimatedBox
        style={style}
        shadowColor="shadow"
        shadowOpacity={0.1}
        shadowRadius={1}
        shadowOffset={{ width: 0, height: 0 }}
        justifyContent="center"
        pointerEvents="box-none"
      >
        <Box
          backgroundColor="card"
          borderRadius="xlg"
          gap={3}
          padding={4}
          style={{
            borderCurve: 'continuous',
          }}
        >
          <Box gap={4}>
            <Box flexDirection="row" gap={2} alignItems="center">
              <Box
                width={44}
                paddingVertical={3}
                borderRadius="full"
                justifyContent="center"
                alignItems="center"
                backgroundColor="background-dark"
              >
                <Text fontSize={18} fontWeight={700} color="foreground-dark">
                  17
                </Text>
                <Text fontSize={14} color="foreground-dark">
                  Nov
                </Text>
              </Box>
              <Text variant="title">{title}</Text>
            </Box>
            <Text variant="large" color="foreground-light">
              {description}
            </Text>
            <Box flexDirection="row" gap={3}>
              <Button
                variant="card-action"
                backgroundColor='destructive'
                onPress={onPressLeft}
              >
                <Box flexDirection="row" gap={2} alignItems="center">
                  <Text
                    fontWeight={500}
                    color={'destructive-foreground'}
                  >
                    Delete
                  </Text>
                  <Icon
                    name='close'
                    size={20}
                    color={'destructive-foreground'}
                  />
                </Box>
              </Button>
              <Button
                variant="card-action"
                backgroundColor='primary'
                onPress={onPressRight}
              >
                <Box flexDirection="row" gap={2} alignItems="center">
                  <Text
                    fontWeight={500}
                    color={'primary-foreground'}
                  >
                    Store
                  </Text>
                  <Icon
                    name='checkmark-outline'
                    size={20}
                    color={'primary-foreground'}
                  />
                </Box>
              </Button>
            </Box>
          </Box>
        </Box>
      </AnimatedBox>
    </GestureDetector>
  )
}