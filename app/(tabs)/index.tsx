import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/HelloWave';

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Box>
      <Box height={insets.top} />
      <Box paddingHorizontal={2} gap={2} flexDirection="row" alignItems="center">
        <Text variant="title" color="foreground-dark">Welcome!</Text>
        <HelloWave />
      </Box>
    </Box>

  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
