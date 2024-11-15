import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <Box style={styles.titleContainer}>
        <Text variant="title">Welcome!</Text>
        <HelloWave />
      </Box>
      <Text style={styles.stepContainer}>
        <Text >Step 1: Try it</Text>
        <Text>
          Edit <Text >app/(tabs)/index.tsx</Text> to see changes.
          Press{' '}
          <Text >
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </Text>{' '}
          to open developer tools.
        </Text>
      </Text>
      <Text style={styles.stepContainer}>
        <Text >Step 2: Explore</Text>
        <Text>
          Tap the Explore tab to learn more about what's included in this starter app.
        </Text>
      </Text>
      <Text style={styles.stepContainer}>
        <Text >Step 3: Get a fresh start</Text>
        <Text>
          When you're ready, run{' '}
          <Text >npm run reset-project</Text> to get a fresh{' '}
          <Text >app</Text> directory. This will move the current{' '}
          <Text >app</Text> to{' '}
          <Text >app-example</Text>.
        </Text>
      </Text>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
