import { createBox } from '@shopify/restyle'
import type { Theme } from '@/theme'
import Reanimated from 'react-native-reanimated'

export const Box = createBox<Theme>()
export const AnimatedBox = createBox<Theme, React.ComponentProps<typeof Reanimated.View>>(
  Reanimated.View,
)

export type AnimatedBoxProps = React.ComponentProps<typeof AnimatedBox>
export type BoxProps = React.ComponentProps<typeof Box>
