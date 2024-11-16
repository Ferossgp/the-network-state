import { type BlurTint, BlurView } from 'expo-blur'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Box } from './box'

export const WithFloatingEffect: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  return (
    <Box
      pointerEvents="box-none"
      shadowColor="shadow"
      shadowOpacity={0.1}
      shadowRadius={4}
      shadowOffset={{ width: 0, height: 2 }}
    >
      <Box
        pointerEvents="box-none"
        shadowColor="shadow"
        shadowOpacity={0.1}
        shadowRadius={1}
        shadowOffset={{ width: 0, height: 0 }}
      >
        {children}
      </Box>
    </Box>
  )
}

export const WithBlurEffect: React.FC<
  React.PropsWithChildren<{
    tint?: BlurTint
  }>
> = ({ children, tint = 'systemUltraThinMaterialDark' }) => {
  return <React.Fragment>
    <BlurView
      style={StyleSheet.absoluteFill}
      intensity={50}
      tint={tint}
    />
    {children}
  </React.Fragment >
}

type SurfaceProps = React.ComponentProps<typeof Box>

export const Surface: React.FC<SurfaceProps> = ({
  children,
  backgroundColor,
  ...rest
}) => {
  return (
    <WithFloatingEffect>
      <Box overflow="hidden" {...rest}>
        <Box backgroundColor={backgroundColor} opacity={0.75} style={StyleSheet.absoluteFill} />
        <WithBlurEffect>
          {children}
        </WithBlurEffect>
      </Box>
    </WithFloatingEffect>
  )
}