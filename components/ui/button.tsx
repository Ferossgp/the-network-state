import type {
  BackgroundColorProps,
  BorderProps,
  ColorProps,
  LayoutProps,
  OpacityProps,
  PositionProps,
  SpacingProps,
  SpacingShorthandProps,
  TypographyProps,
  VariantProps,
  VisibleProps,
} from '@shopify/restyle'
import {
  backgroundColor,
  border,
  color,
  composeRestyleFunctions,
  createVariant,
  layout,
  opacity,
  spacing,
  spacingShorthand,
  typography,
  useRestyle,
  visible,
} from '@shopify/restyle'
import type React from 'react'
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from 'react-native'
import type { Theme } from '@/theme'
import { Box } from './box'
import { Text } from './text'
import { useMemo } from 'react'

type ButtonStyleProps = VariantProps<Theme, 'buttonVariants'> &
  OpacityProps<Theme> &
  VisibleProps<Theme> &
  LayoutProps<Theme> &
  SpacingProps<Theme> &
  BorderProps<Theme> &
  PositionProps<Theme> &
  SpacingShorthandProps<Theme> &
  BackgroundColorProps<Theme> &
  ColorProps<Theme> &
  TypographyProps<Theme>

interface BaseButtonProps extends ButtonStyleProps, PressableProps {
  loading?: boolean
  disabled?: boolean
  flex?: number
}

const ButtonVariant = createVariant({
  themeKey: 'buttonVariants',
})
export type ButtonVariant = keyof Omit<Theme['buttonVariants'], 'defaults'>

const restyleFunctions = composeRestyleFunctions<Theme, BaseButtonProps>([
  opacity,
  layout,
  spacing,
  spacingShorthand,
  visible,
  backgroundColor,
  color,
  border,
  typography,
  ButtonVariant,
])

const textOptions = [
  'color',
  'fontWeight',
  'fontSize',
  'fontFamily',
  'fontStyle',
  'letterSpacing',
  'textAlign',
] as const

function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      acc[key] = obj[key]
      return acc
    },
    {} as Pick<T, K>,
  )
}

const useButtonStyles = (
  props: BaseButtonProps,
): {
  textStyle: TextStyle
  buttonStyle: ViewStyle
} => {
  const restyled = useRestyle(restyleFunctions, props)

  const flatStyles = StyleSheet.flatten(restyled.style) as ViewStyle

  const textStyle = useMemo(() => pick(flatStyles, textOptions as any), [flatStyles])

  const buttonStyle = useMemo(() => {
    const { ...style } = flatStyles

    return {
      borderCurve: 'continuous',
      ...style,
    } as const
  }, [flatStyles])

  return { textStyle, buttonStyle }
}

export const Button: React.FC<React.PropsWithChildren<BaseButtonProps>> = ({
  onPress,
  variant,
  testID,
  loading = false,
  children,
  disabled,
  ...rest
}) => {
  const { textStyle, buttonStyle } = useButtonStyles({
    variant,
    ...rest,
  })
  return (
    <Pressable
      disabled={loading || disabled}
      onPress={onPress}
      {...rest}
    >
      <Box style={buttonStyle} overflow="hidden">
        {typeof children === 'string' || typeof children === 'number' ? (
          <Text style={textStyle} numberOfLines={1}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Box>
    </Pressable>
  )
}
