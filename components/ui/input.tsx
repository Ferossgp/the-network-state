import {
  type BackgroundColorProps,
  type BorderProps,
  type BoxProps,
  type ColorProps,
  type TypographyProps,
  type VariantProps,
  backgroundColor,
  border,
  color,
  composeRestyleFunctions,
  createVariant,
  layout,
  spacing,
  typography,
  useRestyle,
} from '@shopify/restyle'
import { forwardRef } from 'react'
import { type NativeMethods, TextInput, type TextInputProps } from 'react-native'
import Reanimated from 'react-native-reanimated'
import type { Theme } from '@/theme'

const ReanimatedTextInput = Reanimated.createAnimatedComponent(TextInput)

export type InputMethods = NativeMethods
export type InputProps = TextInputProps &
  TypographyProps<Theme> &
  ColorProps<Theme> &
  BoxProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  VariantProps<Theme, 'inputVariants'> & {
    asChild?: boolean
  }

const restyleFunctions = composeRestyleFunctions<Theme, InputProps>([
  layout,
  border,
  typography,
  backgroundColor,
  color,
  spacing,
  createVariant({
    themeKey: 'inputVariants',
  }),
])

export const Input = forwardRef<InputMethods, InputProps>(function Input(
  { asChild, ...rest },
  ref,
) {
  const props = useRestyle<Theme, InputProps, InputProps>(restyleFunctions, rest)

  return (
    <ReanimatedTextInput
      ref={ref as any}
      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
      {...props}
    />
  )
})
