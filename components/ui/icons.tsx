import type { Theme } from '@/theme'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'

export const Icon: React.FC<
  React.ComponentProps<typeof Ionicons> & { color: keyof Theme['colors'] }
> = ({ color, ...props }) => {
  const { colors } = useTheme<Theme>()

  return <Ionicons color={colors[color]} {...props} />
}
