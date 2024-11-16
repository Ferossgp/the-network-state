import { createTheme } from '@shopify/restyle'

const colorsLight = {
  background: '#F2F2F7',
  foreground: '#000000',

  primary: '#d9e922',
  primaryForeground: 'rgba(28,24,13,1)',
  destructive: 'rgba(250,70,31,1)',

  card: '#F2F2F7',
  overlay: '#f5f5f5',

  secondary: '#8A8989',
  muted: '#E3E3E3',
}

const colorsDark = {
  background: '#000000',
  foreground: '#F2F2F7',
  secondary: '#8A8989',
  muted: '#515151',
}

const fontSizes = {
  h1: 34,
  h2: 28,
  h3: 24,
  large: 18,
  base: 16,
  small: 14,
}

export const buttonSize = {
  large: 52,
  medium: 48,
  small: 44,
}

const theme = createTheme({
  dark: false,
  colors: {
    transparent: 'transparent',

    'background-dark': colorsDark.background,
    'background-light': colorsLight.background,

    'foreground-dark': colorsDark.foreground,
    'foreground-light': colorsLight.foreground,

    'muted-dark': colorsDark.muted,
    'muted-light': colorsLight.muted,

    'surface-light': '#FFFFFF',

    card: colorsLight.card,
    overlay: colorsLight.overlay,
    shadow: '#000000',

    primary: colorsLight.primary,
    'primary-foreground': colorsLight.primaryForeground,

    destructive: colorsLight.destructive,
    'destructive-foreground': '#ffffff',

    positive: colorsLight.primary,
    'positive-foreground': colorsLight.primaryForeground,

    'border-light': colorsLight.muted,
    'border-dark': colorsDark.muted,

    'tab-bar-background': '#fff',
    'tab-bar-button-active': colorsLight.primaryForeground,
    'tab-bar-button-inactive': 'transparent',

    'onboarding-input': 'rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 24,
    6: 32,
    7: 40,
    8: 48,
  },
  borderRadii: {
    sm: 8,
    md: 16,
    lg: 24,
    xlg: 36,
    full: 9999,
  },
  avatarSizes: {
    sm: {
      width: 32,
      height: 32,
      borderRadius: 'full',
    },
    md: {
      width: 48,
      height: 48,
      borderRadius: 'full',
    },
    lg: {
      width: 64,
      height: 64,
      borderRadius: 'lg',
    },
    xlg: {
      width: 96,
      height: 96,
      borderRadius: 'full',
    },
  },
  buttonVariants: {
    defaults: {
      height: 48,
      color: 'foreground-dark',
      fontSize: 18,
      fontWeight: '600',
      paddingHorizontal: 4,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    primary: {
      backgroundColor: 'primary',
      borderRadius: 'lg',
      color: 'primary-foreground',
    },
    icon: {
      paddingHorizontal: 0,
      width: buttonSize.large,
      height: buttonSize.large,
      backgroundColor: 'primary',
      borderRadius: 'full',
      alignItems: 'center',
      justifyContent: 'center',
    },
    'back-icon': {
      paddingHorizontal: 0,
      width: buttonSize.large,
      height: buttonSize.large,
      backgroundColor: 'tab-bar-background',
      borderRadius: 'full',
      alignItems: 'center',
      justifyContent: 'center',
    },
    'card-action': {
      height: buttonSize.small,
      paddingHorizontal: 0,
      paddingLeft: 4,
      paddingRight: 3,
      backgroundColor: 'positive',
      borderRadius: 'lg',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'positive-foreground',
    }
  },
  textVariants: {
    header: {
      fontWeight: '700',
      fontSize: fontSizes.h1,
    },
    title: {
      fontWeight: '700',
      fontSize: fontSizes.h2,
    },
    h3: {
      fontSize: fontSizes.h3,
      fontWeight: '600',
    },
    body: {
      fontSize: fontSizes.base,
    },
    large: {
      fontSize: fontSizes.large,
    },
    small: {
      fontSize: fontSizes.small,
    },
    defaults: {
      fontSize: fontSizes.base,
      fontWeight: '400',
    },
  },
  inputVariants: {
    onboarding: {
      height: 56,
      borderRadius: 'lg',
      paddingHorizontal: 4,
      backgroundColor: 'onboarding-input',
      color: 'foreground-light',
      fontSize: 24,
      fontWeight: '600',
    },
  },
})

export type Theme = typeof theme
export default theme
