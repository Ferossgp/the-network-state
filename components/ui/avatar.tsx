import type { Theme } from '@/theme'
import { type VariantProps, createRestyleComponent, createVariant } from '@shopify/restyle'
import { Image, type ImageProps } from 'expo-image'
import React, { useCallback, useState } from 'react'
import { ColorValue, StyleSheet } from 'react-native'
import { Box, type BoxProps } from './box'

export type AvatarVariants = VariantProps<Theme, 'avatarSizes'>['variant']

export interface AvatarProps extends BoxProps {
  displayName?: string
  src?: string
  variant?: AvatarVariants
  color?: ColorValue
}

type ImageLoadingStatus = 'idle' | 'error'

export const Avatar: React.FC<AvatarProps> = ({ src, variant, color, style, ...rest }) => {
  const [status, setStatus] = useState<ImageLoadingStatus>('idle')
  const onError = useCallback(() => setStatus('error'), [])

  return (
    <AvatarRoot
      variant={variant}
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      backgroundColor="primary"
      flexShrink={0}
      style={[{ backgroundColor: color }, style]}
      {...rest}
    >
      {src != null && status !== 'error' ? (
        <AvatarImage
          source={src}
          onError={onError}
          style={StyleSheet.absoluteFillObject}
          cachePolicy="none"
        />
      ) : null}
    </AvatarRoot>
  )
}

const AvatarRoot = createRestyleComponent<
  BoxProps & {
    variant?: AvatarVariants
  },
  Theme
>([createVariant({ themeKey: 'avatarSizes' })], Box)

const AvatarImage = React.forwardRef<Image, ImageProps>(({ style, ...props }, ref) => (
  <Image
    ref={ref}
    {...props}
    style={[StyleSheet.absoluteFillObject, style]}
    contentFit="cover"
    accessibilityIgnoresInvertColors={true}
  />
))
AvatarImage.displayName = 'AvatarImage'
