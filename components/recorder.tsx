import { useEffect } from "react";
import { Alert } from "react-native";
import { useAudioRecorder, AudioModule, RecordingPresets } from "expo-audio";
import { AnimatedBox, Box } from "./ui/box";
import { Button } from "./ui/button";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Icon } from "./ui/icons";

export default function AudoRecorder() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
      setTimeout(() => {
        audioRecorder.record();
      }, 1000);
    })();

    return () => {
      audioRecorder.stop();
    };
  }, []);

  const onFinishRecording = async () => {
    await audioRecorder.stop();
  };

  const scale =
    useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.5, { duration: 500 }), -1, true);

    if (!audioRecorder.getStatus()) {
      cancelAnimationFrame(scale.value);
      scale.value = withTiming(1);
    }
  }, [audioRecorder.getStatus()]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Box padding={3} gap={6} alignItems="center">
      <AnimatedBox
        style={animatedStyle}
        width={64}
        height={64}
        alignItems="center"
        justifyContent="center"
        borderRadius="full"
        backgroundColor="primary"
      >
        <Icon name="mic" size={24} color="primary-foreground" />
      </AnimatedBox>

      <Button variant="primary" onPress={onFinishRecording}>
        Finish Session
      </Button>
    </Box>
  );
}
