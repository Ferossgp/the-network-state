import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  type BottomSheetBackgroundProps,
  type BottomSheetHandleProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import type { Scope } from '@radix-ui/react-context'
import { createContextScope } from '@radix-ui/react-context'
import { Slot } from '@radix-ui/react-slot'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import * as React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Box } from './box'
import { BlurView } from 'expo-blur'
import Animated, { interpolate, useAnimatedProps } from 'react-native-reanimated'
import { useTheme } from '@shopify/restyle'

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

const BOTTOM_SHEET_NAME = 'BottomSheet'
type ScopedProps<P> = P & { __scopeDialog?: Scope }

const [createBottomSheetContext] = createContextScope(BOTTOM_SHEET_NAME)
interface BottomSheetContextValue {
  open: boolean
  onOpenChange(open: boolean): void
  onOpenToggle(): void
  bottomSheetRef?: React.RefObject<BottomSheetModal>
}

const [BottomSheetProvider, useBottomSheetContext] =
  createBottomSheetContext<BottomSheetContextValue>(BOTTOM_SHEET_NAME)

interface BottomSheetProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
}

export const BottomSheet: React.FC<BottomSheetProps> = (props: ScopedProps<BottomSheetProps>) => {
  const { __scopeDialog, children, open: openProp, defaultOpen, onOpenChange } = props

  const bottomSheetRef = React.useRef<BottomSheetModal>(null)

  const _onOpenChange = React.useCallback(
    (_open: boolean) => {
      if (_open) {
        bottomSheetRef.current?.present()
      } else {
        bottomSheetRef.current?.dismiss()
      }
      onOpenChange?.(_open)
    },
    [onOpenChange],
  )

  React.useEffect(() => {
    if (openProp) {
      bottomSheetRef.current?.present()
    } else {
      bottomSheetRef.current?.dismiss()
    }
  }, [openProp])

  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: _onOpenChange,
  })

  return (
    <BottomSheetProvider
      scope={__scopeDialog}
      open={open}
      onOpenChange={setOpen}
      bottomSheetRef={bottomSheetRef}
      onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
    >
      {children}
    </BottomSheetProvider>
  )
}

const TRIGGER_NAME = 'BottomSheetTrigger'

type DialogTriggerElement = React.ElementRef<typeof Pressable>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> & {
  asChild?: boolean
}

export const BottomSheetTrigger = React.forwardRef<DialogTriggerElement, PrimitiveButtonProps>(
  (props: ScopedProps<PrimitiveButtonProps>, forwardedRef) => {
    const { __scopeDialog, asChild, ...triggerProps } = props
    const context = useBottomSheetContext(TRIGGER_NAME, __scopeDialog)
    const Comp = asChild ? Slot : Pressable

    return <Comp {...triggerProps} ref={forwardedRef} onPress={context.onOpenToggle} />
  },
)

BottomSheetTrigger.displayName = TRIGGER_NAME

const BottomSheetOverlay: React.FC<BottomSheetBackdropProps> = ({ animatedIndex, ...props }) => {
  const animatedProps = useAnimatedProps(() => ({
    intensity: interpolate(animatedIndex.value, [-1, 0], [0, 50]),
  }))
  const { colors } = useTheme()
  return (
    <AnimatedBlurView
      tint="systemThinMaterialLight"
      style={StyleSheet.absoluteFill}
      animatedProps={animatedProps}
    >
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        animatedIndex={animatedIndex}
        style={{ backgroundColor: colors.overlay }}
      />
    </AnimatedBlurView>
  )
}
const BottomSheetBackground: React.FC<BottomSheetBackgroundProps> = ({ style }) => {
  return (
    <Box
      pointerEvents="none"
      backgroundColor="card"
      shadowColor="shadow"
      shadowOpacity={0.05}
      shadowRadius={2}
      shadowOffset={{ width: 0, height: 0 }}
      style={style}
      borderTopLeftRadius="lg"
      borderTopRightRadius="lg"
    />
  )
}

const BottomSheetHandle: React.FC<BottomSheetHandleProps> = () => {
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      position="absolute"
      left={0}
      right={0}
      top={-12}
    >
      <Box backgroundColor="muted-light" width={36} height={4} borderRadius="sm" />
    </Box>
  )
}

const CONTENT_NAME = 'BottomSheetContent'

export const BottomSheetContent: React.FC<ScopedProps<React.PropsWithChildren>> = ({
  children,
  ...props
}) => {
  const context = useBottomSheetContext(CONTENT_NAME, props.__scopeDialog)
  const insets = useSafeAreaInsets()

  return (
    <BottomSheetModal
      ref={context.bottomSheetRef}
      enableDynamicSizing={true}
      enablePanDownToClose={true}
      backdropComponent={BottomSheetOverlay}
      backgroundComponent={BottomSheetBackground}
      handleComponent={BottomSheetHandle}
      topInset={insets.top}
      style={{ marginHorizontal: 12 }}
      onDismiss={() => context.onOpenChange(false)}
    >
      {children}
    </BottomSheetModal>
  )
}
